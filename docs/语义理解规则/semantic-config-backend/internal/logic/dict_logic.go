package logic

import (
  "context"
  "semantic-config-backend/internal/repo"
  "semantic-config-backend/internal/svc"
)

type DictLogic struct { ctx context.Context; svcCtx *svc.ServiceContext }
func NewDictLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DictLogic { return &DictLogic{ctx:ctx, svcCtx:svcCtx} }

func (l *DictLogic) GetTypes(versionId int64) ([]repo.TypeGroup, []repo.SemanticType, error) {
  return l.svcCtx.DictRepo.GetTypes(l.ctx, versionId)
}
func (l *DictLogic) PutTypes(versionId int64, groups []repo.TypeGroup, items []repo.SemanticType) error {
  if err := l.svcCtx.VersionRepo.MustDraft(l.ctx, versionId); err != nil { return err }
  return l.svcCtx.DictRepo.PutTypes(l.ctx, versionId, groups, items)
}

func (l *DictLogic) GetRoles(versionId int64) ([]repo.RoleGroup, []repo.FieldRole, error) {
  return l.svcCtx.DictRepo.GetRoles(l.ctx, versionId)
}
func (l *DictLogic) PutRoles(versionId int64, groups []repo.RoleGroup, items []repo.FieldRole) error {
  if err := l.svcCtx.VersionRepo.MustDraft(l.ctx, versionId); err != nil { return err }
  return l.svcCtx.DictRepo.PutRoles(l.ctx, versionId, groups, items)
}
