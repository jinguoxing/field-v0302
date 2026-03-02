
export type SemanticStateStatus = 
  | 'DRAFT'
  | 'RUNNING'
  | 'WAITING_DECISION'
  | 'READY'
  | 'PUBLISHED'
  | 'BLOCKED';

export interface SemanticStateMetrics {
  must_fix_count: number;
  coverage: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  impact_tables: number;
}

export interface SemanticState {
  status: SemanticStateStatus;
  metrics: SemanticStateMetrics;
  current_step: 'SCAN' | 'FIELD_DECISION' | 'TABLE_UNDERSTANDING' | 'OBJECT_GENERATION' | 'MAPPING_CONFIRM' | 'PUBLISH';
  blockers: ExceptionItem[];
}

export interface ExceptionItem {
  id: string;
  type: 'FIELD_CONFLICT' | 'MAPPING_CONFLICT' | 'LOW_CONFIDENCE' | 'STRUCTURE_ISSUE';
  title: string;
  count: number;
  description?: string;
}

export interface ExceptionDetail {
  id: string;
  field: string;
  issue: string;
  desc: string;
  confidence: number;
  suggestion?: {
    type: string;
    value: string;
    reason: string;
  };
}

export interface TableUnderstandingItem {
  id: string;
  tableName: string;
  displayName: string;
  aiDescription: string;
  userDescription?: string;
  classification: 'FACT' | 'DIMENSION' | 'AGGREGATE' | 'OTHER';
  confidence: number;
  status: 'PENDING' | 'CONFIRMED' | 'MODIFIED';
  tags: string[];
  columnsCount: number;
  rowCount: number;
}

export interface ObjectAttribute {
  id: string;
  name: string; // Attribute name (e.g., "Employee Name")
  fieldId: string; // Physical field name (e.g., "emp_name")
  type: 'IDENTIFIER' | 'ATTRIBUTE' | 'DIMENSION' | 'MEASURE';
  confidence: number;
  source: 'AI_GENERATED' | 'USER_DEFINED' | 'RULE_BASED';
  evidence?: string; // e.g., "Matches naming convention", "High cardinality"
}

export interface BusinessObjectCandidate {
  id: string;
  name: string; // Business Object Name (e.g., "Employee")
  description: string;
  sourceTableId: string;
  attributes: ObjectAttribute[];
  status: 'PENDING' | 'CONFIRMED' | 'MODIFIED';
  confidence: number;
}

export interface ObjectRelationship {
  id: string;
  sourceObjectId: string;
  targetObjectId: string;
  type: 'HAS_ONE' | 'HAS_MANY' | 'BELONGS_TO';
  keys: { sourceField: string; targetField: string }[];
  confidence: number;
}

export interface ObjectGenerationMetrics {
  totalFields: number;
  assignedFields: number;
  unassignedFields: number;
  conflicts: number;
  coverage: number; // percentage
}

export interface PlanAction {
  type: 'ACCEPT_HIGH_CONF_FIELDS' | 'RESOLVE_MAPPING_CONFLICTS' | 'UPDATE_TABLE_TYPE' | 'PUBLISH';
  label: string;
  count?: number;
  threshold?: number;
}

export interface ImpactMetric {
  before: number | string;
  after: number | string;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface PlanImpact {
  coverage: ImpactMetric;
  risk: { before: string; after: string; trend: 'UP' | 'DOWN' | 'STABLE' };
  must_fix: ImpactMetric;
}

export interface ExecutionPlan {
  id: string;
  intent: string;
  scope: string[];
  actions: PlanAction[];
  impact: PlanImpact;
  status: 'DRAFT' | 'EXECUTING' | 'COMPLETED';
}
