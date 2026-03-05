package logic

import (
  "context"
  "semantic-config-backend/internal/engine"
  "semantic-config-backend/internal/svc"
)

type SimulateLogic struct { ctx context.Context; svcCtx *svc.ServiceContext }
func NewSimulateLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SimulateLogic { return &SimulateLogic{ctx:ctx, svcCtx:svcCtx} }

func (l *SimulateLogic) SimulateD1(versionId int64, fieldName, tableName, comment string) (engine.SimOutput, error) {
  tb, err := l.svcCtx.DictRepo.GetTypeBiases(l.ctx, versionId)
  if err != nil { return engine.SimOutput{}, err }
  rb, err := l.svcCtx.DictRepo.GetRoleBiases(l.ctx, versionId)
  if err != nil { return engine.SimOutput{}, err }

  rules, err := l.svcCtx.RuleRepo.GetNamingRules(l.ctx, versionId)
  if err != nil { return engine.SimOutput{}, err }

  eng := engine.NewEngine()
  return eng.SimulateD1(engine.SimInput{FieldName:fieldName, TableName:tableName, Comment:comment}, tb, rb, rules)
}
