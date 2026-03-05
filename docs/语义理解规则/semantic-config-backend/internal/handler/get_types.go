package handler

import (
  "net/http"
  "strconv"
  "github.com/zeromicro/go-zero/rest/httpx"
  "semantic-config-backend/internal/logic"
  "semantic-config-backend/internal/svc"
  "semantic-config-backend/internal/types"
)

func GetTypesHandler(ctx *svc.ServiceContext) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
    if err != nil { WriteError(w, err); return }
    l := logic.NewDictLogic(r.Context(), ctx)
    groups, items, err := l.GetTypes(id)
    if err != nil { WriteError(w, err); return }
    resp := types.GetTypesResp{Groups: make([]types.TypeGroup,0,len(groups)), Items: make([]types.SemanticTypeItem,0,len(items))}
    for _, g := range groups { resp.Groups = append(resp.Groups, types.TypeGroup{Code:g.Code, NameZh:g.NameZh, Sort:g.Sort}) }
    for _, it := range items {
      resp.Items = append(resp.Items, types.SemanticTypeItem{Code:it.Code, NameZh:it.NameZh, GroupCode:it.GroupCode, Active:it.Active, Advanced:it.Advanced, Bias:it.Bias, Sort:it.Sort, Aliases:it.Aliases, Tooltip:it.Tooltip})
    }
    httpx.WriteJson(w, http.StatusOK, resp)
  }
}
