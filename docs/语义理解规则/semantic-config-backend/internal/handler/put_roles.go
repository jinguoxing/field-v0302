package handler

import (
  "net/http"
  "strconv"
  "github.com/zeromicro/go-zero/rest/httpx"
  "semantic-config-backend/internal/logic"
  "semantic-config-backend/internal/repo"
  "semantic-config-backend/internal/svc"
  "semantic-config-backend/internal/types"
)

func PutRolesHandler(ctx *svc.ServiceContext) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
    if err != nil { WriteError(w, err); return }
    var req types.PutRolesReq
    if err := httpx.Parse(r, &req); err != nil { WriteError(w, err); return }
    groups := make([]repo.RoleGroup,0,len(req.Groups))
    for _, g := range req.Groups { groups = append(groups, repo.RoleGroup{Code:g.Code, NameZh:g.NameZh, Sort:g.Sort}) }
    items := make([]repo.FieldRole,0,len(req.Items))
    for _, it := range req.Items {
      items = append(items, repo.FieldRole{Code:it.Code, NameZh:it.NameZh, GroupCode:it.GroupCode, Active:it.Active, Advanced:it.Advanced, Bias:it.Bias, Sort:it.Sort, Tooltip:it.Tooltip})
    }
    l := logic.NewDictLogic(r.Context(), ctx)
    if err := l.PutRoles(id, groups, items); err != nil { WriteError(w, err); return }
    httpx.WriteJson(w, http.StatusOK, types.PutRolesResp{Ok:true})
  }
}
