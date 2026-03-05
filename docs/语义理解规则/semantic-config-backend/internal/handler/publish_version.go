package handler

import (
  "net/http"
  "strconv"
  "github.com/zeromicro/go-zero/rest/httpx"
  "semantic-config-backend/internal/logic"
  "semantic-config-backend/internal/svc"
  "semantic-config-backend/internal/types"
)

func PublishVersionHandler(ctx *svc.ServiceContext) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
    if err != nil { WriteError(w, err); return }
    l := logic.NewVersionLogic(r.Context(), ctx)
    v, err := l.Publish(id)
    if err != nil { WriteError(w, err); return }
    httpx.WriteJson(w, http.StatusOK, types.PublishVersionResp{Item: types.ConfigVersionItem{Id:v.Id, Name:v.Name, Status:v.Status, BaseVersionId:v.BaseVersionId, CreatedAt:v.CreatedAt, UpdatedAt:v.UpdatedAt}})
  }
}
