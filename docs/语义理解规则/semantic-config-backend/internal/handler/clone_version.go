package handler

import (
  "net/http"
  "strconv"
  "github.com/zeromicro/go-zero/rest/httpx"
  "semantic-config-backend/internal/logic"
  "semantic-config-backend/internal/svc"
  "semantic-config-backend/internal/types"
)

func CloneVersionHandler(ctx *svc.ServiceContext) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
    if err != nil { WriteError(w, err); return }
    var req types.CloneVersionReq
    if err := httpx.Parse(r, &req); err != nil { WriteError(w, err); return }
    l := logic.NewVersionLogic(r.Context(), ctx)
    v, err := l.CloneAsDraft(id, req.Name)
    if err != nil { WriteError(w, err); return }
    httpx.WriteJson(w, http.StatusOK, types.CloneVersionResp{Item: types.ConfigVersionItem{Id:v.Id, Name:v.Name, Status:v.Status, BaseVersionId:v.BaseVersionId, CreatedAt:v.CreatedAt, UpdatedAt:v.UpdatedAt}})
  }
}
