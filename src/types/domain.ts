
export type SemanticStatus = 
  | 'SCANNED'
  | 'PENDING_UNDERSTANDING'
  | 'UNDERSTANDING_RUNNING'
  | 'NEED_DECISION'
  | 'SEMANTIC_CONFIRMED'
  | 'OBJECT_CANDIDATES_READY'
  | 'PUBLISHED_PREVIEW'
  | 'PUBLISHED_FORMAL';

export interface LogicalView {
  id: string;
  name: string;
  datasource: string;
  schema: string;
  semantic_status: SemanticStatus;
  field_total: number;
  pending_tasks: number;
  avg_confidence: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  last_run_at?: string;
  publish_level?: 'NONE' | 'PREVIEW' | 'FORMAL';
  semantic_version?: string;
}

export interface Field {
  id: string;
  name: string;
  type: string;
  comment?: string;
  profile?: {
    null_ratio: number;
    distinct_ratio: number;
    top_values?: string[];
  };
  constraints: {
    pk: boolean;
    fk: boolean;
    unique: boolean;
  };
  semantic?: {
    semantic_type: string;
    field_role: string;
    confidence: number;
    decision_status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
    object_binding?: string;
  };
}

export interface SemanticRun {
  id: string;
  logical_view_id: string;
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  progress: {
    done: number;
    total: number;
  };
  started_at: string;
  finished_at?: string;
}

export interface InboxTask {
  id: string;
  logical_view_id: string;
  field_id?: string;
  level: 'field' | 'table' | 'object';
  reason: string;
  priority: 'P0' | 'P1' | 'P2';
  status: 'OPEN' | 'DONE';
  top_candidates: { label: string; score: number }[];
  impact: {
    downstream: number;
    objects: number;
  };
  must: boolean;
}

export interface TaskContext {
  task: InboxTask;
  candidates: { label: string; value: string; score: number; tags?: string[] }[];
  evidence_chain: {
    type: 'NAMING' | 'DISTRIBUTION' | 'HISTORY' | 'RELATION';
    weight: 'HIGH' | 'MEDIUM' | 'LOW';
    summary: string;
    details?: any;
  }[];
  form_schema: {
    type: 'field' | 'table' | 'object';
    fields: string[];
  };
}

export interface ObjectCandidate {
  id: string;
  logical_view_id: string;
  name: string;
  primary_identifier: string;
  attributes: string[];
  relations: { type: string; target: string }[];
  confidence: number;
  mapping: {
    field_id: string;
    attr_name: string;
    confidence: number;
    status: 'OK' | 'CONFLICT' | 'UNMAPPED';
  }[];
}

export interface PublishCheck {
  group: 'Schema' | 'Semantic' | 'Quality' | 'Permission';
  item: string;
  status: 'PASS' | 'BLOCK' | 'WARN';
  message?: string;
}
