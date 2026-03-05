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
    },

    type_dictionary: {
      groups: {
        IDENTIFIER: { zh: "标识类", items: ["ID","CODE","UUID_HASH"] },
        TEXTUAL: { zh: "名称文本类", items: ["NAME","DESCRIPTION","TEXT"] },
        TIME: { zh: "时间类", items: ["DATE","DATETIME","DURATION"] },
        MONEY_QTY: { zh: "金额数量类", items: ["AMOUNT","PRICE","QUANTITY","PERCENT","CURRENCY"] },
        STATUS_ENUM: { zh: "状态枚举类", items: ["STATUS","FLAG_BOOL","CATEGORY","LEVEL"] },
        NETWORK_CONTACT: { zh: "联系方式网络类", items: ["PHONE","EMAIL","IP","URL"] },
        UNKNOWN_GROUP: { zh: "未知", items: ["UNKNOWN"] }
      },
      types: {
        UNKNOWN: { zh:"未知", group:"UNKNOWN_GROUP", active:true, advanced:false, bias:0.0, aliases:["unknown","未识别"], tooltip:{ def:"证据不足，不强行猜测。", example:["misc_field"], anti:["created_at"] } },
        ID: { zh:"标识ID", group:"IDENTIFIER", active:true, advanced:false, bias:0.0, aliases:["id","uid"], tooltip:{ def:"用于唯一标识实体的ID。", example:["user_id"], anti:["order_amount"] } },
        CODE: { zh:"业务编码", group:"IDENTIFIER", active:true, advanced:false, bias:0.0, aliases:["code","no","编号"], tooltip:{ def:"业务可读编码（工号/订单号）。", example:["employee_no"], anti:["name"] } },
        UUID_HASH: { zh:"UUID/HASH", group:"IDENTIFIER", active:true, advanced:true, bias:0.0, aliases:["uuid","md5","hash"], tooltip:{ def:"uuid、md5、hash 等固定格式标识。", example:["row_hash"], anti:["id"] } },
        NAME: { zh:"名称", group:"TEXTUAL", active:true, advanced:false, bias:0.0, aliases:["name","title","名称"], tooltip:{ def:"实体名称/标题。", example:["manufacturer"], anti:["status"] } },
        DESCRIPTION: { zh:"描述", group:"TEXTUAL", active:true, advanced:true, bias:0.0, aliases:["desc","remark"], tooltip:{ def:"描述/备注/说明文本。", example:["remark"], anti:["category"] } },
        TEXT: { zh:"自由文本", group:"TEXTUAL", active:true, advanced:true, bias:0.0, aliases:["text","content"], tooltip:{ def:"不可枚举的自由文本内容。", example:["memo"], anti:["status"] } },
        DATE: { zh:"日期", group:"TIME", active:true, advanced:false, bias:0.0, aliases:["date","dt"], tooltip:{ def:"仅日期。", example:["biz_date"], anti:["timestamp"] } },
        DATETIME: { zh:"时间戳", group:"TIME", active:true, advanced:false, bias:0.0, aliases:["time","timestamp","created_at"], tooltip:{ def:"日期时间/时间戳。", example:["created_at"], anti:["duration_ms"] } },
        DURATION: { zh:"时长", group:"TIME", active:true, advanced:false, bias:0.0, aliases:["duration","时长"], tooltip:{ def:"时间间隔/时长。", example:["duration_ms"], anti:["created_at"] } },
        AMOUNT: { zh:"金额", group:"MONEY_QTY", active:true, advanced:false, bias:0.0, aliases:["amount","金额"], tooltip:{ def:"货币金额。", example:["order_amount"], anti:["created_at"] } },
        PRICE: { zh:"单价", group:"MONEY_QTY", active:true, advanced:false, bias:0.0, aliases:["price","单价"], tooltip:{ def:"商品单价。", example:["unit_price"], anti:["quantity"] } },
        QUANTITY: { zh:"数量", group:"MONEY_QTY", active:true, advanced:false, bias:0.0, aliases:["quantity","qty","数量"], tooltip:{ def:"商品数量/计数。", example:["quantity"], anti:["amount"] } },
        PERCENT: { zh:"百分比", group:"MONEY_QTY", active:true, advanced:false, bias:0.0, aliases:["percent","rate","百分比"], tooltip:{ def:"百分比/比率。", example:["success_rate"], anti:["amount"] } },
        CURRENCY: { zh:"币种", group:"MONEY_QTY", active:true, advanced:false, bias:0.0, aliases:["currency","币种"], tooltip:{ def:"货币代码。", example:["currency_code"], anti:["amount"] } },
        STATUS: { zh:"状态", group:"STATUS_ENUM", active:true, advanced:false, bias:0.0, aliases:["status","状态"], tooltip:{ def:"状态码。", example:["order_status"], anti:["name"] } },
        FLAG_BOOL: { zh:"布尔标识", group:"STATUS_ENUM", active:true, advanced:false, bias:0.0, aliases:["flag","bool","is","has"], tooltip:{ def:"布尔标识。", example:["is_deleted"], anti:["name"] } },
        CATEGORY: { zh:"分类", group:"STATUS_ENUM", active:true, advanced:false, bias:0.0, aliases:["category","type","分类"], tooltip:{ def:"类别/类型。", example:["product_category"], anti:["amount"] } },
        LEVEL: { zh:"等级", group:"STATUS_ENUM", active:true, advanced:false, bias:0.0, aliases:["level","等级"], tooltip:{ def:"等级/层级。", example:["member_level"], anti:["name"] } },
        PHONE: { zh:"手机号", group:"NETWORK_CONTACT", active:true, advanced:false, bias:0.0, aliases:["phone","mobile","手机"], tooltip:{ def:"手机号码。", example:["mobile_phone"], anti:["name"] } },
        EMAIL: { zh:"邮箱", group:"NETWORK_CONTACT", active:true, advanced:false, bias:0.0, aliases:["email","邮箱"], tooltip:{ def:"电子邮箱。", example:["email_address"], anti:["name"] } },
        IP: { zh:"IP地址", group:"NETWORK_CONTACT", active:true, advanced:false, bias:0.0, aliases:["ip","ip_address"], tooltip:{ def:"IP地址。", example:["ip_address"], anti:["name"] } },
        URL: { zh:"URL", group:"NETWORK_CONTACT", active:true, advanced:false, bias:0.0, aliases:["url","link","链接"], tooltip:{ def:"网址链接。", example:["avatar_url"], anti:["name"] } }
      }
    },

    role_dictionary: {
      groups: {
        KEYS: { zh: "键与关系", items: ["PRIMARY_KEY","FOREIGN_KEY","BUSINESS_KEY"] },
        ANALYTICS: { zh: "分析建模", items: ["DIMENSION","MEASURE","DEGENERATE_DIM"] },
        TIME_PARTITION: { zh: "时间与分区", items: ["EVENT_TIME","PARTITION_KEY","AUDIT_FIELD"] },
        GOVERN_TECH: { zh: "治理与技术", items: ["SOFT_DELETE","TECHNICAL","IGNORE"] }
      },
      roles: {
        PRIMARY_KEY: { zh:"主键", group:"KEYS", active:true, advanced:false, bias:0.0, tooltip:{ def:"实体唯一标识字段。", example:["employee_id"], anti:["manufacturer"] } },
        FOREIGN_KEY: { zh:"外键", group:"KEYS", active:true, advanced:false, bias:0.0, tooltip:{ def:"引用其他表/对象的键。", example:["dept_id"], anti:["amount"] } },
        BUSINESS_KEY: { zh:"业务唯一键", group:"KEYS", active:true, advanced:false, bias:0.0, tooltip:{ def:"业务规则下的唯一编号。", example:["order_no"], anti:["name"] } },
        DIMENSION: { zh:"维度", group:"ANALYTICS", active:true, advanced:false, bias:0.0, tooltip:{ def:"用于筛选/分组的属性。", example:["status"], anti:["sales_amount"] } },
        MEASURE: { zh:"度量", group:"ANALYTICS", active:true, advanced:false, bias:0.0, tooltip:{ def:"可聚合指标字段。", example:["order_amount"], anti:["created_at"] } },
        DEGENERATE_DIM: { zh:"退化维度", group:"ANALYTICS", active:true, advanced:true, bias:0.0, tooltip:{ def:"事实表中的维度字段（无维度表）。", example:["order_no"], anti:["sales_amount"] } },
        EVENT_TIME: { zh:"事件时间", group:"TIME_PARTITION", active:true, advanced:false, bias:0.0, tooltip:{ def:"业务事件发生时间。", example:["pay_time"], anti:["updated_at"] } },
        AUDIT_FIELD: { zh:"审计字段", group:"TIME_PARTITION", active:true, advanced:false, bias:0.0, tooltip:{ def:"记录创建/更新/来源等审计信息。", example:["updated_at"], anti:["event_time"] } },
        PARTITION_KEY: { zh:"分区键", group:"TIME_PARTITION", active:true, advanced:false, bias:0.0, tooltip:{ def:"物理分区字段（dt/pt）。", example:["dt"], anti:["create_time"] } },
        SOFT_DELETE: { zh:"软删除", group:"GOVERN_TECH", active:true, advanced:false, bias:0.0, tooltip:{ def:"软删除标识。", example:["is_deleted"], anti:["created_at"] } },
        TECHNICAL: { zh:"技术字段", group:"GOVERN_TECH", active:true, advanced:true, bias:0.0, tooltip:{ def:"纯技术用途字段（ETL/同步）。", example:["etl_time"], anti:["business_field"] } },
        IGNORE: { zh:"忽略字段", group:"GOVERN_TECH", active:true, advanced:false, bias:0.0, tooltip:{ def:"冗余/噪声字段，不参与对象生成。", example:["tmp_col"], anti:["pk/fk/time"] } }
      }
    }
  };
}
