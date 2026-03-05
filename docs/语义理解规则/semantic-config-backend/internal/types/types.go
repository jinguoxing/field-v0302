package types

type ConfigVersionItem struct {
  Id int64 `json:"id"`
  Name string `json:"name"`
  Status string `json:"status"`
  BaseVersionId int64 `json:"base_version_id,omitempty"`
  CreatedAt string `json:"created_at"`
  UpdatedAt string `json:"updated_at"`
}

type ListVersionsResp struct { Items []ConfigVersionItem `json:"items"` }

type CreateVersionReq struct { Name string `json:"name"`; BaseVersionId int64 `json:"base_version_id,omitempty"` }
type CreateVersionResp struct { Item ConfigVersionItem `json:"item"` }

type CloneVersionReq struct { Name string `json:"name"` }
type CloneVersionResp struct { Item ConfigVersionItem `json:"item"` }

type GetVersionResp struct { Item ConfigVersionItem `json:"item"` }

type PublishVersionResp struct { Item ConfigVersionItem `json:"item"` }

type TypeGroup struct { Code string `json:"code"`; NameZh string `json:"name_zh"`; Sort int32 `json:"sort"` }
type SemanticTypeItem struct {
  Code string `json:"code"`
  NameZh string `json:"name_zh"`
  GroupCode string `json:"group_code"`
  Active bool `json:"active"`
  Advanced bool `json:"advanced"`
  Bias float64 `json:"bias"`
  Sort int32 `json:"sort"`
  Aliases []string `json:"aliases"`
  Tooltip string `json:"tooltip,omitempty"`
}
type GetTypesResp struct { Groups []TypeGroup `json:"groups"`; Items []SemanticTypeItem `json:"items"` }
type PutTypesReq struct { Groups []TypeGroup `json:"groups"`; Items []SemanticTypeItem `json:"items"` }
type PutTypesResp struct { Ok bool `json:"ok"` }

type RoleGroup struct { Code string `json:"code"`; NameZh string `json:"name_zh"`; Sort int32 `json:"sort"` }
type FieldRoleItem struct {
  Code string `json:"code"`
  NameZh string `json:"name_zh"`
  GroupCode string `json:"group_code"`
  Active bool `json:"active"`
  Advanced bool `json:"advanced"`
  Bias float64 `json:"bias"`
  Sort int32 `json:"sort"`
  Tooltip string `json:"tooltip,omitempty"`
}
type GetRolesResp struct { Groups []RoleGroup `json:"groups"`; Items []FieldRoleItem `json:"items"` }
type PutRolesReq struct { Groups []RoleGroup `json:"groups"`; Items []FieldRoleItem `json:"items"` }
type PutRolesResp struct { Ok bool `json:"ok"` }

type NamingRuleItem struct {
  RuleId string `json:"rule_id"`
  Enabled bool `json:"enabled"`
  Priority int32 `json:"priority"`
  Scope string `json:"scope"`
  Regex string `json:"regex"`
  Title string `json:"title"`
  Summary string `json:"summary,omitempty"`
  TypeDelta map[string]float64 `json:"type_delta"`
  RoleDelta map[string]float64 `json:"role_delta"`
}
type GetNamingRulesResp struct { Items []NamingRuleItem `json:"items"` }
type PutNamingRulesReq struct { Items []NamingRuleItem `json:"items"` }
type PutNamingRulesResp struct { Ok bool `json:"ok"` }

type ValidateIssue struct { Level string `json:"level"`; Path string `json:"path"`; Message string `json:"message"` }
type ValidateResp struct { Ok bool `json:"ok"`; Issues []ValidateIssue `json:"issues"` }

type SimulateReq struct { FieldName string `json:"field_name"`; TableName string `json:"table_name,omitempty"`; Comment string `json:"comment,omitempty"` }
type SimTopItem struct { Code string `json:"code"`; Confidence float64 `json:"confidence"`; Raw float64 `json:"raw"` }
type SimEvidenceItem struct {
  RuleId string `json:"rule_id"`
  Title string `json:"title"`
  Regex string `json:"regex"`
  Strength float64 `json:"strength"`
  TypeDelta map[string]float64 `json:"type_delta"`
  RoleDelta map[string]float64 `json:"role_delta"`
}
type SimulateResp struct {
  MatchedRules []SimEvidenceItem `json:"matched_rules"`
  TopTypes []SimTopItem `json:"top_types"`
  TopRoles []SimTopItem `json:"top_roles"`
}
