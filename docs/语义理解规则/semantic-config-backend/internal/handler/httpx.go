package handler

import (
  "net/http"
  "github.com/zeromicro/go-zero/rest/httpx"
)

type ErrorResp struct {
  Code string `json:"code"`
  Message string `json:"message"`
}

func WriteError(w http.ResponseWriter, err error) {
  httpx.WriteJson(w, http.StatusBadRequest, ErrorResp{Code:"BAD_REQUEST", Message: err.Error()})
}
