package handler

import (
  "net/http"
  "strconv"
  "github.com/zeromicro/go-zero/rest/httpx"
  "semantic-config-backend/internal/logic"
  "semantic-config-backend/internal/svc"
  "semantic-config-backend/internal/types"
)

func GetNamingRulesHandler(ctx *svc.ServiceContext) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
    if err != nil { WriteError(w, err); return }
    l := logic.NewRuleLogic(r.Context(), ctx)
    items, err := l.GetNamingRules(id)
    if err != nil { WriteError(w, err); return }
    resp := types.GetNamingRulesResp{Items: make([]types.NamingRuleItem,0,len(items))}
    for _, it := range items {
      resp.Items = append(resp.Items, types.NamingRuleItem{RuleId:it.RuleId, Enabled:it.Enabled, Priority:it.Priority, Scope:it.Scope, Regex:it.Regex, Title:it.Title, Summary:it.Summary, TypeDelta:it.TypeDelta, RoleDelta:it.RoleDelta})
    }
    httpx.WriteJson(w, http.StatusOK, resp)
  }
}
