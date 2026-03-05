package handler

import (
  "net/http"
  "github.com/zeromicro/go-zero/rest/httpx"
  "semantic-config-backend/internal/logic"
  "semantic-config-backend/internal/svc"
  "semantic-config-backend/internal/types"
)

func CreateVersionHandler(ctx *svc.ServiceContext) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    var req types.CreateVersionReq
    if err := httpx.Parse(r, &req); err != nil { WriteError(w, err); return }
    var base *int64
    if req.BaseVersionId != 0 { base = &req.BaseVersionId }
    l := logic.NewVersionLogic(r.Context(), ctx)
    v, err := l.CreateDraft(req.Name, base)
    if err != nil { WriteError(w, err); return }
    httpx.WriteJson(w, http.StatusOK, types.CreateVersionResp{Item: types.ConfigVersionItem{Id:v.Id, Name:v.Name, Status:v.Status, BaseVersionId:v.BaseVersionId, CreatedAt:v.CreatedAt, UpdatedAt:v.UpdatedAt}})
  }
}
