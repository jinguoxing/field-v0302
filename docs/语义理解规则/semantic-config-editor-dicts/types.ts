export type VersionStatus = "DRAFT" | "ACTIVE" | "DEPRECATED";
export type ConfidenceLevel = "HIGH" | "MED" | "LOW";

export type TabId = "type_dictionary" | "role_dictionary" | "naming_rules";
export type TabDef = { id: TabId; title: string; domain: string };

export type SimulationSampleRef = { mode: "FIELD_ID"; fieldId: string };

export type EvidenceItem = {
  evidenceId: string;
  dimension: string;
  source: "RULE" | "LLM";
  title: string;
  contribution: number;
  keySignals?: Record<string, any>;
};

export type Candidate = {
  semanticType: string;
  role: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  gap12?: number;
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
};

export type Tooltip = { def: string; example?: string[]; anti?: string[] };

export type TypeDictionaryPayload = {
  groups: Record<string, { zh: string; items: string[] }>;
  types: Record<string, { zh: string; group: string; active: boolean; advanced: boolean; bias: number; aliases: string[]; tooltip: Tooltip }>;
};

export type RoleDictionaryPayload = {
  groups: Record<string, { zh: string; items: string[] }>;
  roles: Record<string, { zh: string; group: string; active: boolean; advanced: boolean; bias: number; tooltip: Tooltip }>;
};

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

export type ConfigDomains = {
  type_dictionary: TypeDictionaryPayload;
  role_dictionary: RoleDictionaryPayload;
  "rules.naming": NamingPayload;
};

export type ConfigState = {
  versionId: string;
  versionName: string;
  status: VersionStatus;
  baseVersionId?: string;
  domains: ConfigDomains;
};
