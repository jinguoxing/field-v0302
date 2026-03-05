package repo

import (
  "context"
  "database/sql"
  "encoding/json"
)

type ruleRepo struct{ db *sql.DB }

func NewRuleRepo(db *sql.DB) RuleRepo { return &ruleRepo{db: db} }

func (r *ruleRepo) GetNamingRules(ctx context.Context, versionId int64) ([]NamingRule, error) {
  rows, err := r.db.QueryContext(ctx, `SELECT rule_id,enabled,priority,scope,regex,title,IFNULL(summary,''),type_delta,role_delta
    FROM semantic_naming_rule WHERE version_id=? ORDER BY priority DESC, rule_id ASC`, versionId)
  if err != nil { return nil, err }
  defer rows.Close()

  out := []NamingRule{}
  for rows.Next() {
    var it NamingRule
    var summary, typeJson, roleJson string
    if err := rows.Scan(&it.RuleId,&it.Enabled,&it.Priority,&it.Scope,&it.Regex,&it.Title,&summary,&typeJson,&roleJson); err != nil {
      return nil, err
    }
    it.Summary = summary
    it.TypeDelta = map[string]float64{}
    it.RoleDelta = map[string]float64{}
    _ = json.Unmarshal([]byte(typeJson), &it.TypeDelta)
    _ = json.Unmarshal([]byte(roleJson), &it.RoleDelta)
    out = append(out, it)
  }
  return out, nil
}

func (r *ruleRepo) PutNamingRules(ctx context.Context, versionId int64, items []NamingRule) error {
  tx, err := r.db.BeginTx(ctx, nil)
  if err != nil { return err }
  defer tx.Rollback()

  _, err = tx.ExecContext(ctx, `DELETE FROM semantic_naming_rule WHERE version_id=?`, versionId)
  if err != nil { return err }

  for _, it := range items {
    typeJson, _ := json.Marshal(it.TypeDelta)
    roleJson, _ := json.Marshal(it.RoleDelta)
    var summary any = nil
    if it.Summary != "" { summary = it.Summary }
    _, err = tx.ExecContext(ctx, `INSERT INTO semantic_naming_rule(version_id,rule_id,enabled,priority,scope,regex,title,summary,type_delta,role_delta)
      VALUES(?,?,?,?,?,?,?,?,?,?)`,
      versionId, it.RuleId, it.Enabled, it.Priority, it.Scope, it.Regex, it.Title, summary, string(typeJson), string(roleJson))
    if err != nil { return err }
  }
  return tx.Commit()
}
