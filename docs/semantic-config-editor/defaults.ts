import { ConfigDomains } from "./types";

export function defaultDomains(): ConfigDomains {
  return {
    weights: {
      softmax: { tau: 0.7 },
      joint: { alpha: 0.55 },
      dimension_weights: {
        type: { NAMING: 0.25, PROFILE: 0.35, METADATA: 0.1, USAGE: 0.1, STANDARD: 0.1, INTRA: 0.05, INTER: 0.03, LLM: 0.02 },
        role: { METADATA: 0.3, USAGE: 0.25, PROFILE: 0.15, NAMING: 0.1, TABLE_PRIOR: 0.1, STANDARD: 0.05, INTRA: 0.03, LLM: 0.02 }
      },
      thresholds: {
        completeness_low: 0.55,
        completeness_llm: 0.7,
        queue: {
          auto_pass: { top1_conf_min: 0.85, gap12_min: 0.15, completeness_min: 0.7, forbid_roles: ["UNKNOWN","IGNORE"] },
          needs_confirm: { top1_conf_min: 0.6 },
          conflict: { gap12_max: 0.1 },
          ignore_candidate: { ignore_score_min: 0.8 }
        }
      },
      unknown_policy: { when_completeness_lt: 0.55, non_unknown_penalty: -0.15, unknown_bonus: 0.1 },
      llm: { enabled_default: true, max_calls_per_lv: 30, max_delta_per_candidate: 0.05 },
      table_role_prior: {
        FACT: { MEASURE: 0.1, FOREIGN_KEY: 0.06, EVENT_TIME: 0.06, DIMENSION: -0.03 },
        DIMENSION: { PRIMARY_KEY: 0.08, DIMENSION: 0.06, STATUS: 0.04, MEASURE: -0.05 }
      }
    },

    "rules.naming": {
      patterns: [
        {
          id: "suffix__id",
          enabled: true,
          priority: 100,
          scope: "field_name",
          regex: ".*_id$",
          type_delta: { ID: 1.0, CODE: 0.3 },
          role_delta: { PRIMARY_KEY: 0.4, FOREIGN_KEY: 0.4, BUSINESS_KEY: 0.2 },
          title_template: "命名命中 *_id",
          summary_template: "字段名后缀为 _id，偏标识类"
        },
        {
          id: "audit_created_at",
          enabled: true,
          priority: 90,
          scope: "field_name",
          regex: "^(created_at|create_time|created_time)$",
          type_delta: { DATETIME: 1.0 },
          role_delta: { AUDIT_FIELD: 0.6, EVENT_TIME: 0.3 },
          title_template: "命名命中创建时间",
          summary_template: "字段名为 created_at 类，偏审计/事件时间"
        }
      ]
    },

    "rules.profile": {
      detectors: [
        {
          detector_id: "id_detector",
          enabled: true,
          function: "piecewise_linear",
          params: { unique_a: 0.6, unique_b: 0.9, nonnull_a: 0.6, nonnull_b: 0.95, unique_w: 0.6, nonnull_w: 0.4 },
          type_delta: { ID: 1.0 },
          role_delta: { PRIMARY_KEY: 0.2 },
          title_template: "唯一/非空支持标识",
          signal_keys: ["nonNullRate", "uniqueRate", "distinctCount"]
        },
        {
          detector_id: "enum_detector",
          enabled: true,
          function: "piecewise_linear",
          params: { distinct_k: 50 },
          type_delta: { STATUS: 0.8, CATEGORY: 0.5 },
          role_delta: { DIMENSION: 0.2 },
          title_template: "枚举性支持状态/分类",
          signal_keys: ["distinctCount", "topK"]
        }
      ]
    },

    "rules.metadata": {
      rules: [
        {
          rule_id: "pk_constraint",
          enabled: true,
          priority: 100,
          condition: { isPK: true },
          role_delta: { PRIMARY_KEY: 1.0 }
        },
        {
          rule_id: "fk_constraint",
          enabled: true,
          priority: 100,
          condition: { isFK: true },
          role_delta: { FOREIGN_KEY: 1.0 }
        },
        {
          rule_id: "partition_key",
          enabled: true,
          priority: 80,
          condition: { isPartition: true },
          role_delta: { PARTITION_KEY: 1.0 }
        }
      ]
    },

    "rules.usage": {
      p95_u: 200,
      function: "log",
      map: {
        FOREIGN_KEY: { join_weight: 1.0 },
        DIMENSION: { groupby_weight: 0.6, filter_weight: 0.6 },
        MEASURE: { agg_weight: 1.0 },
        EVENT_TIME: { time_range_weight: 1.0 }
      }
    },

    "rules.standards": {
      min_match_score: 0.7,
      mappings: [
        { match_type: "DATA_ELEMENT", ref_id: "phone_number", type_delta: { PHONE: 1.0 }, role_delta: { DIMENSION: 0.2 } },
        { match_type: "CODELIST", ref_id: "order_status", type_delta: { STATUS: 0.9 }, role_delta: { DIMENSION: 0.3 }, meta: { allowedValues: true } }
      ]
    },

    "rules.consistency": {
      intra: {
        relUniqueWeight: 0.6,
        relUsageWeight: 0.4,
        groupingRules: [
          { type: "suffix", value: "_id", weight: 1.0 },
          { type: "suffix", value: "_time", weight: 1.0 }
        ]
      },
      inter: {
        nameSimWeight: 0.4,
        valueOverlapWeight: 0.4,
        joinEvidenceWeight: 0.2,
        strongMatchThreshold: 0.8,
        topKTargets: 3
      }
    },

    compat: {
      defaults: { allow_bonus: 0.1, weak_penalty: 0.08, deny_penalty: 0.3 },
      matrix: {
        DATETIME: { ALLOW: ["EVENT_TIME", "AUDIT_FIELD", "PARTITION_KEY", "DIMENSION"], WEAK: ["PRIMARY_KEY"], DENY: ["MEASURE"], reason: { MEASURE: "时间戳不应作为度量" } },
        ID: { ALLOW: ["PRIMARY_KEY", "FOREIGN_KEY", "BUSINESS_KEY", "DIMENSION"], WEAK: [], DENY: ["MEASURE"], reason: { MEASURE: "标识字段不应聚合" } },
        UNKNOWN: { ALLOW: ["DIMENSION", "TECHNICAL", "IGNORE"], WEAK: [], DENY: ["MEASURE","PRIMARY_KEY","FOREIGN_KEY"] }
      }
    },

    ignore_llm: {
      ignore: {
        techNoisePatterns: ["^_", "etl", "ingest", "row_hash", "tmp", "bak"],
        nullRateHigh: 0.95,
        distinctLow: 2,
        ignoreScoreMin: 0.8,
        highUsageCap: 0.4,
        forbidIfKeyCandidate: true
      },
      llm: {
        enabled: true,
        trigger: { completenessLt: 0.7, gapLt: 0.1 },
        maxDeltaPerCandidate: 0.05,
        promptVersion: "v1",
        model: "gpt-4.1-mini",
        outputSchema: { type: "object" }
      }
    }
  };
}
