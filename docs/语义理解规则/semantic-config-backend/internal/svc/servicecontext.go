package svc

import (
  "database/sql"

  _ "github.com/go-sql-driver/mysql"
  "github.com/zeromicro/go-zero/core/logx"

  "semantic-config-backend/internal/config"
  "semantic-config-backend/internal/repo"
)

type ServiceContext struct {
  Config config.Config
  DB *sql.DB

  VersionRepo repo.VersionRepo
  DictRepo repo.DictRepo
  RuleRepo repo.RuleRepo
}

func NewServiceContext(c config.Config) *ServiceContext {
  db, err := sql.Open("mysql", c.MySQL.DSN)
  if err != nil {
    logx.Must(err)
  }
  db.SetMaxOpenConns(20)
  db.SetMaxIdleConns(5)

  return &ServiceContext{
    Config: c,
    DB: db,
    VersionRepo: repo.NewVersionRepo(db),
    DictRepo: repo.NewDictRepo(db),
    RuleRepo: repo.NewRuleRepo(db),
  }
}
