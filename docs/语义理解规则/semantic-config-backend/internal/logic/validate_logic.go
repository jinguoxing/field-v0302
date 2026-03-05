package logic

import (
  "context"
  "fmt"
  "regexp"

  "semantic-config-backend/internal/svc"
)

type ValidateIssue struct {
  Level string
  Path string
  Message string
}

type ValidateLogic struct { ctx context.Context; svcCtx *svc.ServiceContext }
func NewValidateLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ValidateLogic { return &ValidateLogic{ctx:ctx, svcCtx:svcCtx} }

func (l *ValidateLogic) ValidateDraft(versionId int64) ([]ValidateIssue, error) {
  if err := l.svcCtx.VersionRepo.MustDraft(l.ctx, versionId); err != nil { return nil, err }

  issues := []ValidateIssue{}
  _, types, err := l.svcCtx.DictRepo.GetTypes(l.ctx, versionId)
  if err != nil { return nil, err }
  _, roles, err := l.svcCtx.DictRepo.GetRoles(l.ctx, versionId)
  if err != nil { return nil, err }

  typeSet := map[string]bool{}
  for _, t := range types { typeSet[t.Code]=true }
  roleSet := map[string]bool{}
  for _, r := range roles { roleSet[r.Code]=true }

  rules, err := l.svcCtx.RuleRepo.GetNamingRules(l.ctx, versionId)
  if err != nil { return nil, err }

  for i, r := range rules {
    if _, err := regexp.Compile(r.Regex); err != nil {
      issues = append(issues, ValidateIssue{Level:"ERROR", Path:fmt.Sprintf("namingRules[%d].regex", i), Message: err.Error()})
    }
    for k := range r.TypeDelta {
      if !typeSet[k] { issues = append(issues, ValidateIssue{Level:"ERROR", Path:fmt.Sprintf("namingRules[%d].type_delta.%s", i, k), Message:"unknown semantic type code"}) }
    }
    for k := range r.RoleDelta {
      if !roleSet[k] { issues = append(issues, ValidateIssue{Level:"ERROR", Path:fmt.Sprintf("namingRules[%d].role_delta.%s", i, k), Message:"unknown role code"}) }
    }
  }
  return issues, nil
}
