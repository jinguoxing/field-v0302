package handler

import (
  "net/http"
  "github.com/zeromicro/go-zero/rest/httpx"
  "semantic-config-backend/internal/logic"
  "semantic-config-backend/internal/svc"
  "semantic-config-backend/internal/types"
)

func ListVersionsHandler(ctx *svc.ServiceContext) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    l := logic.NewVersionLogic(r.Context(), ctx)
    items, err := l.List()
    if err != nil { WriteError(w, err); return }
    resp := types.ListVersionsResp{Items: make([]types.ConfigVersionItem, 0, len(items))}
    for _, v := range items {
      resp.Items = append(resp.Items, types.ConfigVersionItem{Id:v.Id, Name:v.Name, Status:v.Status, BaseVersionId:v.BaseVersionId, CreatedAt:v.CreatedAt, UpdatedAt:v.UpdatedAt})
    }
    httpx.WriteJson(w, http.StatusOK, resp)
  }
}
