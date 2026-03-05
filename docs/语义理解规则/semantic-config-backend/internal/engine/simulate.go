package engine

import (
  "errors"
  "sort"

  "semantic-config-backend/internal/repo"
)

type SimInput struct { FieldName, TableName, Comment string }

type Evidence struct {
  RuleId string
  Title string
  Regex string
  Strength float64
  TypeDelta map[string]float64
  RoleDelta map[string]float64
}

type TopItem struct { Code string; Confidence float64; Raw float64 }

type SimOutput struct {
  Evidence []Evidence
  TopTypes []TopItem
  TopRoles []TopItem
}

type Engine struct { Tau float64 }

func NewEngine() *Engine { return &Engine{Tau:0.7} }

func (e *Engine) SimulateD1(input SimInput, typeBias map[string]float64, roleBias map[string]float64, rules []repo.NamingRule) (SimOutput, error) {
  compiled, err := CompileRules(rules)
  if err != nil { return SimOutput{}, err }
  matches := MatchField(compiled, input.FieldName, input.TableName, input.Comment)

  if len(typeBias) == 0 || len(roleBias) == 0 {
    return SimOutput{}, errors.New("type dictionary or role dictionary is empty")
  }

  rawType := map[string]float64{}
  for k, v := range typeBias { rawType[k] = v }
  rawRole := map[string]float64{}
  for k, v := range roleBias { rawRole[k] = v }

  evs := []Evidence{}
  for _, m := range matches {
    for t, d := range m.Rule.TypeDelta {
      if _, ok := rawType[t]; ok { rawType[t] += d * m.Strength }
    }
    for r, d := range m.Rule.RoleDelta {
      if _, ok := rawRole[r]; ok { rawRole[r] += d * m.Strength }
    }
    evs = append(evs, Evidence{RuleId:m.Rule.RuleId, Title:m.Rule.Title, Regex:m.Rule.Regex, Strength:m.Strength, TypeDelta:m.Rule.TypeDelta, RoleDelta:m.Rule.RoleDelta})
  }

  confType := Softmax(rawType, e.Tau)
  confRole := Softmax(rawRole, e.Tau)

  return SimOutput{
    Evidence: evs,
    TopTypes: topK(rawType, confType, 3),
    TopRoles: topK(rawRole, confRole, 3),
  }, nil
}

func topK(raw map[string]float64, conf map[string]float64, k int) []TopItem {
  items := make([]TopItem, 0, len(raw))
  for code, rv := range raw {
    items = append(items, TopItem{Code:code, Raw:rv, Confidence:conf[code]})
  }
  sort.SliceStable(items, func(i, j int) bool {
    if items[i].Confidence == items[j].Confidence { return items[i].Raw > items[j].Raw }
    return items[i].Confidence > items[j].Confidence
  })
  if len(items) > k { items = items[:k] }
  return items
}
