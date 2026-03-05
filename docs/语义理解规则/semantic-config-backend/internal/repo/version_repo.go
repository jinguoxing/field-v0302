package repo

import (
  "context"
  "database/sql"
  "errors"
  "fmt"
  "time"
)

type versionRepo struct{ db *sql.DB }

func NewVersionRepo(db *sql.DB) VersionRepo { return &versionRepo{db: db} }

func (r *versionRepo) List(ctx context.Context) ([]Version, error) {
  rows, err := r.db.QueryContext(ctx, `SELECT id,name,status,IFNULL(base_version_id,0),created_at,updated_at FROM semantic_config_version ORDER BY id DESC`)
  if err != nil { return nil, err }
  defer rows.Close()
  out := []Version{}
  for rows.Next() {
    var v Version
    var created, updated time.Time
    if err := rows.Scan(&v.Id,&v.Name,&v.Status,&v.BaseVersionId,&created,&updated); err != nil { return nil, err }
    v.CreatedAt = created.UTC().Format(time.RFC3339Nano)
    v.UpdatedAt = updated.UTC().Format(time.RFC3339Nano)
    out = append(out, v)
  }
  return out, nil
}

func (r *versionRepo) Get(ctx context.Context, id int64) (Version, error) {
  var v Version
  var created, updated time.Time
  err := r.db.QueryRowContext(ctx, `SELECT id,name,status,IFNULL(base_version_id,0),created_at,updated_at FROM semantic_config_version WHERE id=?`, id).
    Scan(&v.Id,&v.Name,&v.Status,&v.BaseVersionId,&created,&updated)
  if err != nil { return Version{}, err }
  v.CreatedAt = created.UTC().Format(time.RFC3339Nano)
  v.UpdatedAt = updated.UTC().Format(time.RFC3339Nano)
  return v, nil
}

func (r *versionRepo) MustDraft(ctx context.Context, id int64) error {
  v, err := r.Get(ctx, id)
  if err != nil { return err }
  if v.Status != "DRAFT" { return fmt.Errorf("version %d status=%s is not editable", id, v.Status) }
  return nil
}

func (r *versionRepo) CreateDraft(ctx context.Context, name string, baseVersionId *int64) (Version, error) {
  res, err := r.db.ExecContext(ctx, `INSERT INTO semantic_config_version(name,status,base_version_id) VALUES(?,?,?)`, name, "DRAFT", baseVersionId)
  if err != nil { return Version{}, err }
  id, _ := res.LastInsertId()
  return r.Get(ctx, id)
}

func (r *versionRepo) CloneAsDraft(ctx context.Context, fromId int64, name string) (Version, error) {
  tx, err := r.db.BeginTx(ctx, nil)
  if err != nil { return Version{}, err }
  defer tx.Rollback()

  res, err := tx.ExecContext(ctx, `INSERT INTO semantic_config_version(name,status,base_version_id) VALUES(?,?,?)`, name, "DRAFT", fromId)
  if err != nil { return Version{}, err }
  newId, _ := res.LastInsertId()

  // clone groups/types/aliases
  _, err = tx.ExecContext(ctx, `INSERT INTO semantic_type_group(version_id,code,name_zh,sort) SELECT ?,code,name_zh,sort FROM semantic_type_group WHERE version_id=?`, newId, fromId)
  if err != nil { return Version{}, err }
  _, err = tx.ExecContext(ctx, `INSERT INTO semantic_type(version_id,code,name_zh,group_code,active,advanced,bias,sort,tooltip) SELECT ?,code,name_zh,group_code,active,advanced,bias,sort,tooltip FROM semantic_type WHERE version_id=?`, newId, fromId)
  if err != nil { return Version{}, err }
  _, err = tx.ExecContext(ctx, `INSERT INTO semantic_type_alias(version_id,type_code,alias) SELECT ?,type_code,alias FROM semantic_type_alias WHERE version_id=?`, newId, fromId)
  if err != nil { return Version{}, err }

  // roles
  _, err = tx.ExecContext(ctx, `INSERT INTO semantic_role_group(version_id,code,name_zh,sort) SELECT ?,code,name_zh,sort FROM semantic_role_group WHERE version_id=?`, newId, fromId)
  if err != nil { return Version{}, err }
  _, err = tx.ExecContext(ctx, `INSERT INTO semantic_role(version_id,code,name_zh,group_code,active,advanced,bias,sort,tooltip) SELECT ?,code,name_zh,group_code,active,advanced,bias,sort,tooltip FROM semantic_role WHERE version_id=?`, newId, fromId)
  if err != nil { return Version{}, err }

  // rules
  _, err = tx.ExecContext(ctx, `INSERT INTO semantic_naming_rule(version_id,rule_id,enabled,priority,scope,regex,title,summary,type_delta,role_delta)
    SELECT ?,rule_id,enabled,priority,scope,regex,title,summary,type_delta,role_delta FROM semantic_naming_rule WHERE version_id=?`, newId, fromId)
  if err != nil { return Version{}, err }

  if err := tx.Commit(); err != nil { return Version{}, err }
  return r.Get(ctx, newId)
}

func (r *versionRepo) Publish(ctx context.Context, id int64) (Version, error) {
  v, err := r.Get(ctx, id)
  if err != nil { return Version{}, err }
  if v.Status != "DRAFT" { return Version{}, errors.New("only DRAFT can be published") }

  tx, err := r.db.BeginTx(ctx, nil)
  if err != nil { return Version{}, err }
  defer tx.Rollback()

  _, err = tx.ExecContext(ctx, `UPDATE semantic_config_version SET status='ARCHIVED' WHERE status='PUBLISHED'`)
  if err != nil { return Version{}, err }
  _, err = tx.ExecContext(ctx, `UPDATE semantic_config_version SET status='PUBLISHED' WHERE id=?`, id)
  if err != nil { return Version{}, err }
  if err := tx.Commit(); err != nil { return Version{}, err }
  return r.Get(ctx, id)
}
