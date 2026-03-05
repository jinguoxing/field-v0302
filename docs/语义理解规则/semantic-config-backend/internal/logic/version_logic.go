package logic

import (
  "context"
  "semantic-config-backend/internal/repo"
  "semantic-config-backend/internal/svc"
)

type VersionLogic struct { ctx context.Context; svcCtx *svc.ServiceContext }
func NewVersionLogic(ctx context.Context, svcCtx *svc.ServiceContext) *VersionLogic { return &VersionLogic{ctx:ctx, svcCtx:svcCtx} }

func (l *VersionLogic) List() ([]repo.Version, error) { return l.svcCtx.VersionRepo.List(l.ctx) }
func (l *VersionLogic) Get(id int64) (repo.Version, error) { return l.svcCtx.VersionRepo.Get(l.ctx, id) }
func (l *VersionLogic) CreateDraft(name string, base *int64) (repo.Version, error) { return l.svcCtx.VersionRepo.CreateDraft(l.ctx, name, base) }
func (l *VersionLogic) CloneAsDraft(fromId int64, name string) (repo.Version, error) { return l.svcCtx.VersionRepo.CloneAsDraft(l.ctx, fromId, name) }
func (l *VersionLogic) Publish(id int64) (repo.Version, error) { return l.svcCtx.VersionRepo.Publish(l.ctx, id) }
