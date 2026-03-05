package engine

import "math"

func Softmax(raw map[string]float64, tau float64) map[string]float64 {
  if tau <= 0 { tau = 1 }
  maxv := -math.MaxFloat64
  for _, v := range raw {
    if v > maxv { maxv = v }
  }
  sum := 0.0
  expv := map[string]float64{}
  for k, v := range raw {
    e := math.Exp((v-maxv)/tau)
    expv[k] = e
    sum += e
  }
  out := map[string]float64{}
  for k, e := range expv {
    out[k] = e / sum
  }
  return out
}
