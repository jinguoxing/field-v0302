import { ConfigDomains } from "./types";

export function defaultDomains(): ConfigDomains {
  return {
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
        DATETIME: { zh:"时间戳", group:"TIME", active:true, advanced:false, bias:0.0, aliases:["time","timestamp","created_at"], tooltip:{ def:"日期时间/时间戳。", example:["created_at"], anti:["duration_ms"] } }
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
        EVENT_TIME: { zh:"事件时间", group:"TIME_PARTITION", active:true, advanced:false, bias:0.0, tooltip:{ def:"业务事件发生时间。", example:["pay_time"], anti:["updated_at"] } },
        AUDIT_FIELD: { zh:"审计字段", group:"TIME_PARTITION", active:true, advanced:false, bias:0.0, tooltip:{ def:"记录创建/更新/来源等审计信息。", example:["updated_at"], anti:["event_time"] } },
        PARTITION_KEY: { zh:"分区键", group:"TIME_PARTITION", active:true, advanced:false, bias:0.0, tooltip:{ def:"物理分区字段（dt/pt）。", example:["dt"], anti:["create_time"] } },
        IGNORE: { zh:"忽略字段", group:"GOVERN_TECH", active:true, advanced:false, bias:0.0, tooltip:{ def:"冗余/噪声字段，不参与对象生成。", example:["tmp_col"], anti:["pk/fk/time"] } }
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
    }
  };
}
