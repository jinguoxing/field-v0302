package handler

import (
  "net/http"
  "strconv"
  "github.com/zeromicro/go-zero/rest/httpx"
  "semantic-config-backend/internal/logic"
  "semantic-config-backend/internal/svc"
  "semantic-config-backend/internal/types"
)

func ValidateHandler(ctx *svc.ServiceContext) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
    if err != nil { WriteError(w, err); return }
    l := logic.NewValidateLogic(r.Context(), ctx)
    issues, err := l.ValidateDraft(id)
    if err != nil { WriteError(w, err); return }
    resp := types.ValidateResp{Ok: len(issues)==0, Issues: make([]types.ValidateIssue,0,len(issues))}
    for _, it := range issues { resp.Issues = append(resp.Issues, types.ValidateIssue{Level:it.Level, Path:it.Path, Message:it.Message}) }
    httpx.WriteJson(w, http.StatusOK, resp)
  }
}
