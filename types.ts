
export interface DataSource {
  id: string;
  name: string;
  type: 'MySQL' | 'PostgreSQL' | 'Oracle' | 'SQL Server' | 'MongoDB' | 'Redis';
  tableCount: number;
}

export type SemanticStatus = 'pending' | 'processing' | 'completed' | 'review_required';

export interface TableEntity {
  id: string;
  name: string;
  description: string;
  dataSource: string;
  rowCount: number;
  status: SemanticStatus;
  progress: number;
  totalFields: number;
  riskScore: number;
  lastUpdated: string;
}

export interface TableField {
  id: number;
  name: string;
  description: string; // Chinese comment
  dataType: string;
  isPrimaryKey: boolean;
  isSensitive: boolean;
  sampleValues: string[];
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface ERNode {
  id: string;
  title: string;
  type: string;
  fields: { name: string; type: string; isKey?: boolean }[];
  position: NodePosition;
}

export interface ERLink {
  id: string;
  source: string;
  target: string;
}

export interface QualityRule {
  id: number;
  name: string;
  column: string;
  type: '完整性' | '有效性' | '唯一性' | '一致性' | '及时性' | '准确性';
  passRate: number;
  status: 'pass' | 'fail' | 'warning';
  failedRows: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface QualityOverview {
  score: number;
  scannedRows: number;
  failedRows: number;
  lastScan: string;
  dimensions: {
     completeness: number; // 完整性
     validity: number;     // 有效性
     consistency: number;  // 一致性
     uniqueness: number;   // 唯一性
     timeliness: number;   // 及时性
     accuracy: number;     // 准确性
  }
}

// Standards Library Types
// Expanded to include CodeSet and NamingConvention
export type StandardType = 'Term' | 'DataElement' | 'Indicator' | 'Rule' | 'CodeSet' | 'NamingConvention';
export type StandardStatus = 'Draft' | 'Review' | 'Published' | 'Deprecated';

export interface StandardItem {
  id: string;
  name: string; // English/System Name
  cnName: string; // Chinese Name
  type: StandardType;
  status: StandardStatus;
  domain: string;
  owner: string;
  version: string;
  updatedAt: string;
  refCount: number;
  complianceScore: number;
  description: string;
  tags: string[];
}

// AI Draft Studio Types
export interface AIDraft {
  id: string;
  name: string;
  cnName: string;
  type: StandardType;
  confidence: number;
  description: string;
  sourceOrigin: string; // e.g., "t_hr_employee.emp_id"
  evidence: string; // e.g., "Field comment: 'Employee Unique ID'"
  status: 'pending' | 'accepted' | 'rejected';
}

// AI Alignment Types
export interface AlignmentCandidate {
  id: string;
  name: string;
  cnName: string;
  type: StandardType;
  confidence: number;
  reason: string;
  isConflict?: boolean;
}

export interface AlignmentTask {
  id: string;
  fieldId: number;
  fieldName: string;
  fieldComment: string;
  tableName: string;
  status: 'unmapped' | 'mapped' | 'confirmed';
  candidates: AlignmentCandidate[];
  selectedCandidateId?: string;
  samples: string[];
}

// AI Conflict Types
export type ConflictType = 'homonym' | 'synonym' | 'overlap' | 'indicator_clash';

export interface ConflictItem {
  id: string;
  title: string;
  type: ConflictType;
  riskLevel: 'High' | 'Medium' | 'Low';
  similarity: number;
  itemA: { name: string; desc: string; domain: string };
  itemB: { name: string; desc: string; domain: string };
  aiSuggestion: string;
}

// AI Evaluation Types
export interface EvalMetric {
  label: string;
  value: string;
  trend: string;
  trendDir: 'up' | 'down';
}

export interface RegressionCase {
  id: string;
  input: string;
  aiOutput: string;
  humanOutput: string;
  result: 'match' | 'mismatch';
  date: string;
}

// --- APPLY MODULE TYPES ---

export type ComplianceState = 'passed' | 'failed' | 'exempt';

export interface LogicalView {
  id: string;
  name: string;
  cnName: string;
  domain: string;
  fieldCount: number;
  mappedCount: number;
  complianceScore: number;
  fields: LogicalField[];
}

export interface LogicalField {
  id: string;
  name: string;
  cnName: string;
  type: string;
  boundStandard?: { id: string; name: string; cnName: string };
  boundCodeTable?: string;
  boundRules?: string[];
  complianceStatus: ComplianceState;
}

export interface BusinessObject {
  id: string;
  name: string;
  cnName: string;
  domain: string;
  status: 'Candidate' | 'Published';
  maturity: 'Low' | 'Medium' | 'High';
  refCount: number;
  description: string;
  attributes: ObjectAttribute[];
}

export interface ObjectAttribute {
  id: string;
  name: string;
  cnName: string;
  dataType: string;
  isRequired: boolean;
  boundElement?: string;
  sensitiveLevel?: 'L1' | 'L2' | 'L3' | 'L4';
}

export interface Metric {
  id: string;
  name: string;
  cnName: string;
  domain: string;
  status: 'Draft' | 'Online' | 'Offline';
  isNorthStar: boolean;
  isPublic: boolean;
  definition: string;
  dimensions: string[];
  period: string;
  expression: string; // SQL or DSL
  owner: string;
}

// --- ENFORCE MODULE TYPES ---

export interface ValidationRun {
  id: string;
  scope: string;
  ruleSet: string;
  startTime: string;
  duration: string;
  status: 'success' | 'failed' | 'warning';
  resultSummary: { total: number; passed: number; failed: number };
  issues: ValidationIssue[];
}

export interface ValidationIssue {
  id: string;
  targetName: string;
  targetType: string; // Field, Object, Metric
  issueType: string;
  severity: 'High' | 'Medium' | 'Low';
  message: string;
  suggestion: string;
}

export interface GatePolicy {
  id: string;
  name: string;
  scope: string;
  requirements: string[];
  status: 'Active' | 'Inactive';
  lastCheckRate: number;
}

export interface DriftItem {
  id: string;
  target: string;
  type: 'code_new_value' | 'distribution_shift' | 'mapping_invalid';
  detectedAt: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  action: string;
}

export interface WaiverRequest {
  id: string;
  applicant: string;
  target: string;
  reason: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  expiryDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// --- IMPACT MODULE TYPES ---

export interface AffectedAsset {
  id: string;
  name: string;
  type: 'Table' | 'Metric' | 'API' | 'Report';
  riskLevel: 'High' | 'Medium' | 'Low';
  owner: string;
  impactDescription: string;
}

export interface ImpactAnalysis {
  changeId: string;
  standardName: string;
  versionChange: string; // "v1.0 -> v1.1"
  description: string;
  summary: {
    total: number;
    highRisk: number;
    apis: number;
    reports: number;
  };
  affectedAssets: AffectedAsset[];
  recommendation: string;
}

export interface DependencyNode {
  id: string;
  label: string;
  type: 'Standard' | 'Object' | 'View' | 'Metric' | 'Field';
  domain?: string;
  status?: string;
  x?: number; // for graph
  y?: number; // for graph
}

export interface DependencyLink {
  source: string;
  target: string;
  relation: string; // "defines", "maps_to", "calculates_from"
}

// --- OPS MODULE TYPES ---

export interface OpsOverview {
  coverage: {
    field: number;
    object: number;
    metric: number;
    trend: number;
  };
  compliance: {
    rulePassRate: number;
    gatePassRate: number;
    waiverRate: number;
    trend: number;
  };
  adoption: {
    rate: number;
    trend: number;
    funnel: { stage: string; count: number; rate: number }[];
  };
  reuse: {
    avgRefCount: number;
    unusedCount: number;
  };
}

export interface GovernancePriority {
  id: string;
  title: string;
  domain: string;
  roiScore: number; // 0-100, calculated from Usage * Risk
  reason: string;
  action: string;
}

export interface StandardReuseStats {
  topUsed: { name: string; type: string; count: number }[];
  lowUsed: { name: string; type: string; count: number; daysUnused: number }[];
}

// --- COLLAB MODULE TYPES ---

export type TaskType = 'approval' | 'mapping' | 'conflict';

export interface CollabTask {
  id: string;
  type: TaskType;
  title: string;
  targetName: string;
  requester: string;
  createTime: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'approved' | 'rejected';
}

export interface ReviewComment {
  id: string;
  user: string;
  content: string;
  time: string;
  type: 'pro' | 'con' | 'neutral';
}

export interface ReviewDetail {
  taskId: string;
  description: string;
  diffs: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  comments: ReviewComment[];
  votes: { approve: number; reject: number };
}

export interface ChangeLogEntry {
  id: string;
  version: string;
  date: string;
  publisher: string;
  description: string;
  impactSummary: string; // e.g. "3 Tables, 2 APIs"
  status: 'Active' | 'Rolled_Back';
  canRollback: boolean;
}

// --- SETTINGS MODULE TYPES ---

export interface TaxonomyNode {
  id: string;
  name: string;
  code: string;
  type: 'Domain' | 'Subject' | 'System' | 'ProductLine';
  owner: string;
  children?: TaxonomyNode[];
}

export interface ApprovalStep {
  id: string;
  name: string;
  approverRole: string;
  type: 'auto' | 'manual';
}

export interface ApprovalWorkflow {
  id: string;
  targetType: string; // 'Term', 'DataElement', etc.
  steps: ApprovalStep[];
  isActive: boolean;
}

export interface StandardTemplate {
  id: string;
  name: string;
  type: string; // 'DataElement'
  description: string;
  fields: string[]; 
  lastUpdated: string;
}

export interface DictionaryEntry {
  id: string;
  term: string;
  abbreviation?: string;
  type: 'Abbreviation' | 'Synonym' | 'Forbidden';
  replacement?: string; 
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface AISettings {
  model: string;
  promptVersion: string;
  confidenceThreshold: number;
  autoAcceptThreshold: number;
  evidenceRequired: boolean;
  strategy: 'Conservative' | 'Balanced' | 'Aggressive';
}

// --- SEMANTIC WORKBENCH TYPES ---

export interface SemanticField {
  id: string;
  name: string;
  dataType: string;
  currentSemanticType: string;
  role: 'Identifier' | 'Attribute' | 'Measure' | 'Date';
  confidence: number;
  candidateCount: number;
  riskLevel: 'High' | 'Medium' | 'Low' | 'None';
  status: 'Pending' | 'Resolved' | 'Conflict' | 'Multi';
  isConfirmed: boolean;
  tags: string[]; // e.g., PK, FK, PII
}

export interface SemanticEvidence {
  id: string;
  type: 'Naming' | 'Distribution' | 'Lineage' | 'Embedding' | 'Rule';
  title: string;
  weight: number; // 0-100 impact
  score: number; // 0-100 confidence contribution
  description: string;
  details?: any; // Chart data, sample values, etc.
}

export interface SemanticCandidate {
  id: string;
  type: string;
  role: string;
  confidence: number;
  isPrimary: boolean;
}

// --- METRIC HUB TYPES (NEW) ---

export type MetricLifecycleStatus = 'Draft' | 'InReview' | 'Published' | 'Archived';
export type MetricComplianceStatus = 'Compliant' | 'Warning' | 'NonCompliant';
export type ImplementationMode = 'AUTO_SQL' | 'SQL' | 'CANVAS';

export interface MetricAsset {
  id: string;
  name: string;
  code: string;
  cnName: string;
  domain: string;
  description: string;
  owner: string;
  status: 'Active' | 'Deprecated';
  latestVersionId: string;
  tags: string[];
}

export interface MetricMeasure {
  name: string;
  agg: string;
  expr: string;
  unit?: string;
  isAdditive?: boolean;
}

export interface MetricConstraint {
  type: 'NoSplit' | 'NoCombine' | 'NoDrillDown';
  dimensions?: string[]; // Specific dims if applicable
  description?: string;
}

export interface MetricDefinition {
  metricType: 'Atomic' | 'Derivative' | 'Composite';
  grain: string;
  timeWindow: string;
  measures: MetricMeasure[];
  dimensions: string[];
  filters: string[];
  constraints?: MetricConstraint[];
}

export interface MetricImplementation {
  mode: ImplementationMode;
  sql?: string;
  canvasSpec?: any; // JSON flow spec
}

export interface MetricEvidence {
  sources: string[];
  fieldTraceCoverage: number; // 0-100
  lastValidationResult: 'Pass' | 'Fail' | 'Warn';
}

export interface MetricVersion {
  id: string;
  metricId: string;
  versionNo: string; // e.g. "v1.0.0"
  status: MetricLifecycleStatus;
  compliance: MetricComplianceStatus;
  standardBinding?: { standardId: string; standardVersion: string };
  isRecommended?: boolean; // Rule: Must be Compliant + Bound
  waiverInfo?: {
    isWaived: boolean;
    reason?: string;
    approvalDate?: string;
  };
  createdAt: string;
  createdBy: string;
  publishedAt?: string;
  definition: MetricDefinition;
  implementation: MetricImplementation;
  evidence: MetricEvidence;
}
