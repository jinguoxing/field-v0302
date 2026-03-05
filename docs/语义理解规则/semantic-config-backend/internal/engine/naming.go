package engine

import (
  "regexp"
  "sort"

  "semantic-config-backend/internal/repo"
)

type CompiledRule struct {
  Rule repo.NamingRule
  Re *regexp.Regexp
}

type Match struct {
  Rule repo.NamingRule
  Strength float64
}

func CompileRules(rules []repo.NamingRule) ([]CompiledRule, error) {
  out := make([]CompiledRule, 0, len(rules))
  for _, r := range rules {
    re, err := regexp.Compile(r.Regex)
    if err != nil { return nil, err }
    out = append(out, CompiledRule{Rule:r, Re:re})
  }
  sort.SliceStable(out, func(i, j int) bool { return out[i].Rule.Priority > out[j].Rule.Priority })
  return out, nil
}

func MatchField(rules []CompiledRule, fieldName, tableName, comment string) []Match {
  text := fieldName + " " + tableName + " " + comment
  matches := []Match{}
  for _, r := range rules {
    if !r.Rule.Enabled { continue }
    if r.Re.MatchString(text) {
      matches = append(matches, Match{Rule:r.Rule, Strength:1.0})
    }
  }
  return matches
}
