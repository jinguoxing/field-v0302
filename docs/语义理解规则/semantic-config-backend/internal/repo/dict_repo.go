package repo

import (
  "context"
  "database/sql"
)

type dictRepo struct{ db *sql.DB }

func NewDictRepo(db *sql.DB) DictRepo { return &dictRepo{db: db} }

func (r *dictRepo) GetTypes(ctx context.Context, versionId int64) ([]TypeGroup, []SemanticType, error) {
  groups := []TypeGroup{}
  gr, err := r.db.QueryContext(ctx, `SELECT code,name_zh,sort FROM semantic_type_group WHERE version_id=? ORDER BY sort ASC, code ASC`, versionId)
  if err != nil { return nil, nil, err }
  defer gr.Close()
  for gr.Next() {
    var g TypeGroup
    if err := gr.Scan(&g.Code,&g.NameZh,&g.Sort); err != nil { return nil, nil, err }
    groups = append(groups, g)
  }

  aliasRows, err := r.db.QueryContext(ctx, `SELECT type_code,alias FROM semantic_type_alias WHERE version_id=?`, versionId)
  if err != nil { return nil, nil, err }
  defer aliasRows.Close()
  aliasMap := map[string][]string{}
  for aliasRows.Next() {
    var code, alias string
    if err := aliasRows.Scan(&code,&alias); err != nil { return nil, nil, err }
    aliasMap[code] = append(aliasMap[code], alias)
  }

  items := []SemanticType{}
  rows, err := r.db.QueryContext(ctx, `SELECT code,name_zh,group_code,active,advanced,bias,sort,IFNULL(tooltip,'') FROM semantic_type WHERE version_id=? ORDER BY sort ASC, code ASC`, versionId)
  if err != nil { return nil, nil, err }
  defer rows.Close()
  for rows.Next() {
    var it SemanticType
    var tooltip string
    if err := rows.Scan(&it.Code,&it.NameZh,&it.GroupCode,&it.Active,&it.Advanced,&it.Bias,&it.Sort,&tooltip); err != nil { return nil, nil, err }
    it.Tooltip = tooltip
    it.Aliases = aliasMap[it.Code]
    items = append(items, it)
  }
  return groups, items, nil
}

func (r *dictRepo) PutTypes(ctx context.Context, versionId int64, groups []TypeGroup, items []SemanticType) error {
  tx, err := r.db.BeginTx(ctx, nil)
  if err != nil { return err }
  defer tx.Rollback()

  _, err = tx.ExecContext(ctx, `DELETE FROM semantic_type_alias WHERE version_id=?`, versionId)
  if err != nil { return err }
  _, err = tx.ExecContext(ctx, `DELETE FROM semantic_type WHERE version_id=?`, versionId)
  if err != nil { return err }
  _, err = tx.ExecContext(ctx, `DELETE FROM semantic_type_group WHERE version_id=?`, versionId)
  if err != nil { return err }

  for _, g := range groups {
    _, err = tx.ExecContext(ctx, `INSERT INTO semantic_type_group(version_id,code,name_zh,sort) VALUES(?,?,?,?)`, versionId, g.Code, g.NameZh, g.Sort)
    if err != nil { return err }
  }
  for _, it := range items {
    var tooltip any = nil
    if it.Tooltip != "" { tooltip = it.Tooltip }
    _, err = tx.ExecContext(ctx, `INSERT INTO semantic_type(version_id,code,name_zh,group_code,active,advanced,bias,sort,tooltip) VALUES(?,?,?,?,?,?,?,?,?)`,
      versionId, it.Code, it.NameZh, it.GroupCode, it.Active, it.Advanced, it.Bias, it.Sort, tooltip)
    if err != nil { return err }
    for _, a := range it.Aliases {
      _, err = tx.ExecContext(ctx, `INSERT INTO semantic_type_alias(version_id,type_code,alias) VALUES(?,?,?)`, versionId, it.Code, a)
      if err != nil { return err }
    }
  }
  return tx.Commit()
}

func (r *dictRepo) GetRoles(ctx context.Context, versionId int64) ([]RoleGroup, []FieldRole, error) {
  groups := []RoleGroup{}
  gr, err := r.db.QueryContext(ctx, `SELECT code,name_zh,sort FROM semantic_role_group WHERE version_id=? ORDER BY sort ASC, code ASC`, versionId)
  if err != nil { return nil, nil, err }
  defer gr.Close()
  for gr.Next() {
    var g RoleGroup
    if err := gr.Scan(&g.Code,&g.NameZh,&g.Sort); err != nil { return nil, nil, err }
    groups = append(groups, g)
  }

  items := []FieldRole{}
  rows, err := r.db.QueryContext(ctx, `SELECT code,name_zh,group_code,active,advanced,bias,sort,IFNULL(tooltip,'') FROM semantic_role WHERE version_id=? ORDER BY sort ASC, code ASC`, versionId)
  if err != nil { return nil, nil, err }
  defer rows.Close()
  for rows.Next() {
    var it FieldRole
    var tooltip string
    if err := rows.Scan(&it.Code,&it.NameZh,&it.GroupCode,&it.Active,&it.Advanced,&it.Bias,&it.Sort,&tooltip); err != nil { return nil, nil, err }
    it.Tooltip = tooltip
    items = append(items, it)
  }
  return groups, items, nil
}

func (r *dictRepo) PutRoles(ctx context.Context, versionId int64, groups []RoleGroup, items []FieldRole) error {
  tx, err := r.db.BeginTx(ctx, nil)
  if err != nil { return err }
  defer tx.Rollback()

  _, err = tx.ExecContext(ctx, `DELETE FROM semantic_role WHERE version_id=?`, versionId)
  if err != nil { return err }
  _, err = tx.ExecContext(ctx, `DELETE FROM semantic_role_group WHERE version_id=?`, versionId)
  if err != nil { return err }

  for _, g := range groups {
    _, err = tx.ExecContext(ctx, `INSERT INTO semantic_role_group(version_id,code,name_zh,sort) VALUES(?,?,?,?)`, versionId, g.Code, g.NameZh, g.Sort)
    if err != nil { return err }
  }
  for _, it := range items {
    var tooltip any = nil
    if it.Tooltip != "" { tooltip = it.Tooltip }
    _, err = tx.ExecContext(ctx, `INSERT INTO semantic_role(version_id,code,name_zh,group_code,active,advanced,bias,sort,tooltip) VALUES(?,?,?,?,?,?,?,?,?)`,
      versionId, it.Code, it.NameZh, it.GroupCode, it.Active, it.Advanced, it.Bias, it.Sort, tooltip)
    if err != nil { return err }
  }
  return tx.Commit()
}

func (r *dictRepo) GetTypeBiases(ctx context.Context, versionId int64) (map[string]float64, error) {
  rows, err := r.db.QueryContext(ctx, `SELECT code,bias FROM semantic_type WHERE version_id=? AND active=1`, versionId)
  if err != nil { return nil, err }
  defer rows.Close()
  m := map[string]float64{}
  for rows.Next() {
    var code string; var bias float64
    if err := rows.Scan(&code,&bias); err != nil { return nil, err }
    m[code]=bias
  }
  return m, nil
}

func (r *dictRepo) GetRoleBiases(ctx context.Context, versionId int64) (map[string]float64, error) {
  rows, err := r.db.QueryContext(ctx, `SELECT code,bias FROM semantic_role WHERE version_id=? AND active=1`, versionId)
  if err != nil { return nil, err }
  defer rows.Close()
  m := map[string]float64{}
  for rows.Next() {
    var code string; var bias float64
    if err := rows.Scan(&code,&bias); err != nil { return nil, err }
    m[code]=bias
  }
  return m, nil
}
