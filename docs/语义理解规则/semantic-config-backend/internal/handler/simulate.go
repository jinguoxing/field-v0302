package handler

import (
  "net/http"
  "strconv"
  "github.com/zeromicro/go-zero/rest/httpx"
  "semantic-config-backend/internal/logic"
  "semantic-config-backend/internal/svc"
  "semantic-config-backend/internal/types"
)

func SimulateHandler(ctx *svc.ServiceContext) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
    if err != nil { WriteError(w, err); return }
    var req types.SimulateReq
    if err := httpx.Parse(r, &req); err != nil { WriteError(w, err); return }

    l := logic.NewSimulateLogic(r.Context(), ctx)
    out, err := l.SimulateD1(id, req.FieldName, req.TableName, req.Comment)
    if err != nil { WriteError(w, err); return }

    resp := types.SimulateResp{
      MatchedRules: make([]types.SimEvidenceItem,0,len(out.Evidence)),
      TopTypes: make([]types.SimTopItem,0,len(out.TopTypes)),
      TopRoles: make([]types.SimTopItem,0,len(out.TopRoles)),
    }
    for _, ev := range out.Evidence {
      resp.MatchedRules = append(resp.MatchedRules, types.SimEvidenceItem{RuleId:ev.RuleId, Title:ev.Title, Regex:ev.Regex, Strength:ev.Strength, TypeDelta:ev.TypeDelta, RoleDelta:ev.RoleDelta})
    }
    for _, t := range out.TopTypes { resp.TopTypes = append(resp.TopTypes, types.SimTopItem{Code:t.Code, Confidence:t.Confidence, Raw:t.Raw}) }
    for _, rr := range out.TopRoles { resp.TopRoles = append(resp.TopRoles, types.SimTopItem{Code:rr.Code, Confidence:rr.Confidence, Raw:rr.Raw}) }

    httpx.WriteJson(w, http.StatusOK, resp)
  }
}
