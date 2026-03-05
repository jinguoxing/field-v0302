package repo

import "context"

type Version struct {
  Id int64
  Name string
  Status string
  BaseVersionId int64
  CreatedAt string
  UpdatedAt string
}

type TypeGroup struct { Code, NameZh string; Sort int32 }
type SemanticType struct {
  Code, NameZh, GroupCode string
  Active, Advanced bool
  Bias float64
  Sort int32
  Tooltip string
  Aliases []string
}

type RoleGroup struct { Code, NameZh string; Sort int32 }
type FieldRole struct {
  Code, NameZh, GroupCode string
  Active, Advanced bool
  Bias float64
  Sort int32
  Tooltip string
}

type NamingRule struct {
  RuleId string
  Enabled bool
  Priority int32
  Scope string
  Regex string
  Title string
  Summary string
  TypeDelta map[string]float64
  RoleDelta map[string]float64
}

type VersionRepo interface {
  List(ctx context.Context) ([]Version, error)
  Get(ctx context.Context, id int64) (Version, error)
  CreateDraft(ctx context.Context, name string, baseVersionId *int64) (Version, error)
  CloneAsDraft(ctx context.Context, fromId int64, name string) (Version, error)
  Publish(ctx context.Context, id int64) (Version, error)
  MustDraft(ctx context.Context, id int64) error
}

type DictRepo interface {
  GetTypes(ctx context.Context, versionId int64) ([]TypeGroup, []SemanticType, error)
  PutTypes(ctx context.Context, versionId int64, groups []TypeGroup, items []SemanticType) error
  GetRoles(ctx context.Context, versionId int64) ([]RoleGroup, []FieldRole, error)
  PutRoles(ctx context.Context, versionId int64, groups []RoleGroup, items []FieldRole) error
  GetTypeBiases(ctx context.Context, versionId int64) (map[string]float64, error)
  GetRoleBiases(ctx context.Context, versionId int64) (map[string]float64, error)
}

type RuleRepo interface {
  GetNamingRules(ctx context.Context, versionId int64) ([]NamingRule, error)
  PutNamingRules(ctx context.Context, versionId int64, items []NamingRule) error
}
