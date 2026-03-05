// ==================== Common Types ====================
export type ID = string;

export type ValidationRule =
  | { type: "required"; message?: string }
  | { type: "range"; min: number; max: number; message?: string }
  | { type: "gt"; value: number; message?: string }
  | { type: "gte"; value: number; message?: string }
  | { type: "regexCompile"; message?: string }
  | { type: "custom"; name: string; args?: Record<string, any>; message?: string };

export type ConfidenceLevel = "HIGH" | "MED" | "LOW";
export type VersionStatus = "DRAFT" | "ACTIVE" | "DEPRECATED";

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

export interface TabDef {
  id: TabId;
  title: string;
  domain: string;
}

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
  meta?: Record<string, any>;
}

// ==================== Simulation Types ====================
export type SimulationSampleRef =
  | { mode: "FIELD_ID"; fieldId: string }
  | { mode: "LV_FIELD"; lvId: string; fieldName: string }
  | { mode: "RECENT"; pickId: string }
  | { mode: "CONFLICTS"; pickId: string }
  | { mode: "GOLDEN"; pickId: string };

export type SimulationSource = "Field ID" | "LV + Field" | "Error Sample";

export interface LogicView {
  id: string;
  name: string;
  fields: string[];
}

export interface ErrorSample {
  id: string;
  field: string;
  table: string;
  error: string;
}

export interface Candidate {
  semanticType: string;
  role: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  gap12?: number;
  evidenceRefs?: string[];
}

export interface EvidenceItem {
  evidenceId: string;
  dimension: Dimension;
  source: EvidenceSource;
  title: string;
  contribution: number;
  keySignals?: Record<string, any>;
  summary?: string;
}

export interface SimulationBreakdownItem {
  key: string;
  contributionTop1: number;
  contributionTop2?: number;
  notes?: string;
}

export interface SimulationResult {
  typeTop3: Array<{ type: string; confidence: number; level: ConfidenceLevel }>;
  roleTop3: Array<{ role: string; confidence: number; level: ConfidenceLevel }>;
  jointTop3: Candidate[];
  completeness: number;
  gap12: number;
  ignoreScore: number;
  queue: string;
  evidenceTop3: EvidenceItem[];
  breakdownByDimension?: SimulationBreakdownItem[];
  breakdownByRule?: SimulationBreakdownItem[];
}

export type SimulationMode = "BASELINE" | "WHAT_IF";

// ==================== Config Payload Types ====================

// Weights Payload
export interface WeightsConfig {
  softmax: { tau: number };
  joint: { alpha: number };
  dimension_weights: {
    type: Record<Dimension, number>;
    role: Record<string, number>;
  };
  thresholds: {
    completeness_low: number;
    completeness_llm: number;
    queue: {
      auto_pass: { top1_conf_min: number; gap12_min: number; completeness_min: number; forbid_roles: string[] };
      needs_confirm: { top1_conf_min: number };
      conflict: { gap12_max: number };
      ignore_candidate: { ignore_score_min: number };
    };
  };
  unknown_policy: { when_completeness_lt: number; non_unknown_penalty: number; unknown_bonus: number };
  llm: { enabled_default: boolean; max_calls_per_lv: number; max_delta_per_candidate: number };
  table_role_prior: Record<string, Record<string, number>>;
}

// Naming Rules Payload
export interface NamingRule {
  id: string;
  enabled: boolean;
  priority: number;
  scope: "field_name" | "comment" | "table_name" | "qualified_name";
  regex: string;
  type_delta: Record<string, number>;
  role_delta: Record<string, number>;
  title_template?: string;
  summary_template?: string;
}

export interface NamingPayload {
  patterns: NamingRule[];
}

// Type Dictionary Payload
export interface TypeGroup {
  zh: string;
  items: string[];
}

export interface TypeDefinition {
  zh: string;
  group: string;
  active?: boolean;
  advanced?: boolean;
  bias?: number;
  aliases: string[];
  tooltip: {
    def: string;
    example?: string[];
    anti?: string[];
  };
  display?: {
    defaultVisible?: boolean;
    sortOrder?: number;
  };
}

export interface TypeDictionaryPayload {
  groups: Record<string, TypeGroup>;
  types: Record<string, TypeDefinition>;
}

// Role Dictionary Payload
export interface RoleGroup {
  zh: string;
  items: string[];
}

export interface RoleDefinition {
  zh: string;
  group: string;
  active?: boolean;
  advanced?: boolean;
  bias?: number;
  tooltip: {
    def: string;
    example?: string[];
    anti?: string[];
  };
  display?: {
    defaultVisible?: boolean;
    sortOrder?: number;
  };
}

export interface RoleDictionaryPayload {
  groups: Record<string, RoleGroup>;
  roles: Record<string, RoleDefinition>;
}

// Profile Rules Payload
export interface ProfileDetector {
  detector_id: string;
  enabled: boolean;
  function: "piecewise_linear" | "logistic";
  params: Record<string, any>;
  type_delta: Record<string, number>;
  role_delta?: Record<string, number>;
  title_template?: string;
  signal_keys?: string[];
}

export interface ProfilePayload {
  detectors: ProfileDetector[];
}

// Compat Matrix Payload
export type CompatRelation = "ALLOW" | "WEAK" | "DENY";

export interface CompatDefaults {
  allow_bonus: number;
  weak_penalty: number;
  deny_penalty: number;
}

export interface CompatMatrix {
  ALLOW: string[];
  WEAK: string[];
  DENY: string[];
  reason?: Record<string, string>;
}

export interface CompatPayload {
  defaults: CompatDefaults;
  matrix: Record<string, CompatMatrix>;
}

// Metadata Rules Payload
export interface MetadataRule {
  rule_id: string;
  enabled: boolean;
  priority: number;
  condition: Record<string, any>;
  role_delta: Record<string, number>;
  type_delta?: Record<string, number>;
}

export interface MetadataPayload {
  rules: MetadataRule[];
}

// Usage Rules Payload
export interface UsagePayload {
  p95_u: number;
  function: "log";
  map: {
    FOREIGN_KEY: { join_weight: number };
    DIMENSION: { groupby_weight: number; filter_weight: number };
    MEASURE: { agg_weight: number };
    EVENT_TIME: { time_range_weight: number };
  };
}

// Standards Rules Payload
export interface StandardsMapping {
  match_type: "TERM" | "DATA_ELEMENT" | "CODELIST" | "NAMING_RULE";
  ref_id: string;
  type_delta: Record<string, number>;
  role_delta?: Record<string, number>;
  meta?: Record<string, any>;
}

export interface StandardsPayload {
  min_match_score: number;
  mappings: StandardsMapping[];
}

// Consistency Rules Payload
export interface ConsistencyPayload {
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
}

// Ignore + LLM Payload
export interface IgnoreLLMPayload {
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
}

// Full Config Domains
export interface ConfigDomains {
  weights: WeightsConfig;
  "rules.naming": NamingPayload;
  "rules.profile": ProfilePayload;
  "rules.metadata": MetadataPayload;
  "rules.usage": UsagePayload;
  "rules.standards": StandardsPayload;
  "rules.consistency": ConsistencyPayload;
  compat: CompatPayload;
  ignore_llm: IgnoreLLMPayload;
  type_dictionary: TypeDictionaryPayload;
  role_dictionary: RoleDictionaryPayload;
}

// Config State
export interface ConfigState {
  versionId: string;
  versionName: string;
  status: VersionStatus;
  baseVersionId?: string;
  domains: ConfigDomains;
}

// ==================== UI Component Props ====================
export interface BaseFieldProps<T> {
  id?: ID;
  label?: string;
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: ValidationRule[];
}

export interface WeightGridProps extends BaseFieldProps<Record<string, number>> {
  keys: string[];
  sumMustBe?: number;
  showSum?: boolean;
  normalizeButton?: boolean;
  onNormalize?: () => void;
  decimals?: number;
}

export interface DeltaTableProps extends BaseFieldProps<Record<string, number>> {
  keys: string[];
  range?: [number, number];
  showZeroRows?: boolean;
  sortByAbsValue?: boolean;
  decimals?: number;
}

// ==================== Legacy Types (for backward compatibility) ====================
export interface Rule {
  id: string;
  name: string;
  priority: number;
  regex: string;
  type: string;
  role: string;
  enabled: boolean;
}

export type EditorMode = 'form' | 'json';

// ==================== Tab Definitions ====================
export const TABS: TabDef[] = [
  { id: "weights_thresholds", title: "权重与阈值", domain: "weights" },
  { id: "type_dictionary", title: "类型字典", domain: "type_dictionary" },
  { id: "role_dictionary", title: "角色字典", domain: "role_dictionary" },
  { id: "naming_rules", title: "命名规则 (D1)", domain: "rules.naming" },
  { id: "profile_rules", title: "特征规则 (D2)", domain: "rules.profile" },
  { id: "metadata_rules", title: "元数据规则 (D3)", domain: "rules.metadata" },
  { id: "usage_rules", title: "使用规则 (D4)", domain: "rules.usage" },
  { id: "standards_rules", title: "标准映射 (D5)", domain: "rules.standards" },
  { id: "consistency_rules", title: "一致性规则 (D6+D7)", domain: "rules.consistency" },
  { id: "compat_matrix", title: "兼容性矩阵", domain: "compat" },
  { id: "ignore_llm", title: "忽略+LLM", domain: "ignore_llm" },
];

// Legacy DOMAINS for backward compatibility
export const DOMAINS = TABS.map(t => t.title);

// ==================== Constants ====================
export const TYPE_OPTIONS = ['ID', 'DIM', 'MEASURE', 'TIME', 'UNKNOWN', 'META'] as const;
export const ROLE_OPTIONS = ['PK', 'FK', 'BK', 'EVT_TIME', 'NONE'] as const;
export const DIMENSIONS: Dimension[] = ['NAMING', 'PROFILE', 'METADATA', 'USAGE', 'STANDARD', 'INTRA', 'INTER', 'LLM'];

// ==================== Partial Rule (for create form) ====================
export type PartialRule = Partial<Rule> & { name?: string; priority?: number; regex?: string; type?: string; role?: string };

// ==================== Helper Functions ====================
export function confidenceLevel(conf: number): ConfidenceLevel {
  if (conf >= 0.85) return "HIGH";
  if (conf >= 0.6) return "MED";
  return "LOW";
}

export function toPct(x: number): string {
  return `${Math.round(x * 100)}%`;
}
