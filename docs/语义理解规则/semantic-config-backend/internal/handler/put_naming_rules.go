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

func PutNamingRulesHandler(ctx *svc.ServiceContext) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
    if err != nil { WriteError(w, err); return }
    var req types.PutNamingRulesReq
    if err := httpx.Parse(r, &req); err != nil { WriteError(w, err); return }

    items := make([]repo.NamingRule,0,len(req.Items))
    for _, it := range req.Items {
      items = append(items, repo.NamingRule{RuleId:it.RuleId, Enabled:it.Enabled, Priority:it.Priority, Scope:it.Scope, Regex:it.Regex, Title:it.Title, Summary:it.Summary, TypeDelta:it.TypeDelta, RoleDelta:it.RoleDelta})
    }
    l := logic.NewRuleLogic(r.Context(), ctx)
    if err := l.PutNamingRules(id, items); err != nil { WriteError(w, err); return }
    httpx.WriteJson(w, http.StatusOK, types.PutNamingRulesResp{Ok:true})
  }
}
