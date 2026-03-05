package handler

import (
  "github.com/zeromicro/go-zero/rest"
  "semantic-config-backend/internal/svc"
)

func RegisterHandlers(server *rest.Server, ctx *svc.ServiceContext) {
  server.AddRoutes([]rest.Route{
    {Method:"get", Path:"/api/semantic/config/versions", Handler: ListVersionsHandler(ctx)},
    {Method:"post", Path:"/api/semantic/config/versions", Handler: CreateVersionHandler(ctx)},
    {Method:"get", Path:"/api/semantic/config/versions/:id", Handler: GetVersionHandler(ctx)},
    {Method:"post", Path:"/api/semantic/config/versions/:id/clone", Handler: CloneVersionHandler(ctx)},
    {Method:"put", Path:"/api/semantic/config/versions/:id/publish", Handler: PublishVersionHandler(ctx)},

    {Method:"get", Path:"/api/semantic/config/versions/:id/types", Handler: GetTypesHandler(ctx)},
    {Method:"put", Path:"/api/semantic/config/versions/:id/types", Handler: PutTypesHandler(ctx)},

    {Method:"get", Path:"/api/semantic/config/versions/:id/roles", Handler: GetRolesHandler(ctx)},
    {Method:"put", Path:"/api/semantic/config/versions/:id/roles", Handler: PutRolesHandler(ctx)},

    {Method:"get", Path:"/api/semantic/config/versions/:id/naming-rules", Handler: GetNamingRulesHandler(ctx)},
    {Method:"put", Path:"/api/semantic/config/versions/:id/naming-rules", Handler: PutNamingRulesHandler(ctx)},

    {Method:"post", Path:"/api/semantic/config/versions/:id/validate", Handler: ValidateHandler(ctx)},
    {Method:"post", Path:"/api/semantic/config/versions/:id/simulate", Handler: SimulateHandler(ctx)},
  })
}
