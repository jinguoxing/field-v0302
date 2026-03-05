export type VersionStatus = "DRAFT" | "ACTIVE" | "DEPRECATED";
export type ConfidenceLevel = "HIGH" | "MED" | "LOW";
export type Dimension = "NAMING" | "PROFILE" | "METADATA" | "USAGE" | "STANDARD" | "INTRA" | "INTER" | "LLM";
export type EvidenceSource = "RULE" | "LLM";

export type TabId =
  | "weights_thresholds"
  | "type_dictionary"
  | "role_dictionary"
  | "naming_rules"
  | "profile_rules"
  | "metadata_rules"
  | "usage_rules"
  | "standards_rules"
  | "consistency_rules"
  | "compat_matrix"
  | "ignore_llm";

export type TabDef = { id: TabId; title: string; domain: string };

export type SimulationSampleRef =
  | { mode: "FIELD_ID"; fieldId: string }
  | { mode: "LV_FIELD"; lvId: string; fieldName: string }
  | { mode: "RECENT"; pickId: string }
  | { mode: "CONFLICTS"; pickId: string }
  | { mode: "GOLDEN"; pickId: string };

export type EvidenceItem = {
  evidenceId: string;
  dimension: Dimension;
  source: EvidenceSource;
  title: string;
  contribution: number; // 0..1
  keySignals?: Record<string, any>;
  summary?: string;
};

export type Candidate = {
  semanticType: string;
  role: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  gap12?: number;
  evidenceRefs?: string[];
};

export type SimulationResult = {
  typeTop3: Array<{ type: string; confidence: number; level: ConfidenceLevel }>;
  roleTop3: Array<{ role: string; confidence: number; level: ConfidenceLevel }>;
  jointTop3: Candidate[];
  completeness: number;
  gap12: number;
  ignoreScore: number;
  queue: string;
  evidenceTop3: EvidenceItem[];
  breakdownByDimension?: Array<{ key: string; contributionTop1: number; notes?: string }>;
  breakdownByRule?: Array<{ key: string; contributionTop1: number; notes?: string }>;
};

// --- Config payload types (minimal editable shapes) ---
export type WeightsPayload = any;

export type NamingRule = {
  id: string;
  enabled: boolean;
  priority: number;
  scope: "field_name" | "comment" | "table_name" | "qualified_name";
  regex: string;
  type_delta: Record<string, number>;
  role_delta: Record<string, number>;
  title_template?: string;
  summary_template?: string;
};
export type NamingPayload = { patterns: NamingRule[] };

export type ProfileDetector = {
  detector_id: string;
  enabled: boolean;
  function: "piecewise_linear" | "logistic";
  params: Record<string, any>;
  type_delta: Record<string, number>;
  role_delta?: Record<string, number>;
  title_template?: string;
  signal_keys?: string[];
};
export type ProfilePayload = { detectors: ProfileDetector[] };

export type MetadataRule = {
  rule_id: string;
  enabled: boolean;
  priority: number;
  condition: Record<string, any>;
  role_delta: Record<string, number>;
  type_delta?: Record<string, number>;
};
export type MetadataPayload = { rules: MetadataRule[] };

export type UsagePayload = {
  p95_u: number;
  function: "log";
  map: {
    FOREIGN_KEY: { join_weight: number };
    DIMENSION: { groupby_weight: number; filter_weight: number };
    MEASURE: { agg_weight: number };
    EVENT_TIME: { time_range_weight: number };
  };
};

export type StandardsMapping = {
  match_type: "TERM" | "DATA_ELEMENT" | "CODELIST" | "NAMING_RULE";
  ref_id: string;
  type_delta: Record<string, number>;
  role_delta?: Record<string, number>;
  meta?: Record<string, any>;
};
export type StandardsPayload = {
  min_match_score: number;
  mappings: StandardsMapping[];
};

export type ConsistencyPayload = {
  intra: {
    relUniqueWeight: number;
    relUsageWeight: number;
    groupingRules: Array<{ type: "suffix" | "prefix" | "semantic" | "regex"; value: string; weight?: number }>;
  };
  inter: {
    nameSimWeight: number;
    valueOverlapWeight: number;
    joinEvidenceWeight: number;
    strongMatchThreshold: number;
    topKTargets: number;
  };
};

export type CompatPayload = {
  defaults: { allow_bonus: number; weak_penalty: number; deny_penalty: number };
  matrix: Record<
    string,
    {
      ALLOW: string[];
      WEAK: string[];
      DENY: string[];
      reason?: Record<string, string>;
    }
  >;
};

export type IgnoreLLMPayload = {
  ignore: {
    techNoisePatterns: string[];
    nullRateHigh: number;
    distinctLow: number;
    ignoreScoreMin: number;
    highUsageCap: number;
    forbidIfKeyCandidate: boolean;
  };
  llm: {
    enabled: boolean;
    trigger: { completenessLt: number; gapLt: number };
    maxDeltaPerCandidate: number;
    promptVersion: string;
    model: string;
    outputSchema: Record<string, any>;
  };
};

export type ConfigDomains = {
  weights: any;
  "rules.naming": NamingPayload;
  "rules.profile": ProfilePayload;
  "rules.metadata": MetadataPayload;
  "rules.usage": UsagePayload;
  "rules.standards": StandardsPayload;
  "rules.consistency": ConsistencyPayload;
  compat: CompatPayload;
  ignore_llm: IgnoreLLMPayload;
  // dictionaries omitted for brevity; you can add later
};

export type ConfigState = {
  versionId: string;
  versionName: string;
  status: VersionStatus;
  baseVersionId?: string;
  domains: ConfigDomains;
};
