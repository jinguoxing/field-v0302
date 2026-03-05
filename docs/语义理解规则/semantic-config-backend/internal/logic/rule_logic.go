package logic

import (
  "context"
  "semantic-config-backend/internal/repo"
  "semantic-config-backend/internal/svc"
)

type RuleLogic struct { ctx context.Context; svcCtx *svc.ServiceContext }
func NewRuleLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RuleLogic { return &RuleLogic{ctx:ctx, svcCtx:svcCtx} }

func (l *RuleLogic) GetNamingRules(versionId int64) ([]repo.NamingRule, error) {
  return l.svcCtx.RuleRepo.GetNamingRules(l.ctx, versionId)
}
func (l *RuleLogic) PutNamingRules(versionId int64, items []repo.NamingRule) error {
  if err := l.svcCtx.VersionRepo.MustDraft(l.ctx, versionId); err != nil { return err }
  return l.svcCtx.RuleRepo.PutNamingRules(l.ctx, versionId, items)
}
