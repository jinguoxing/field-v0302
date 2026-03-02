
import { LogicalView, Field, InboxTask, ObjectCandidate } from '../types/domain';

// --- SEED DATA ---

export const logicalViews: LogicalView[] = [
  {
    id: 'lv_001',
    name: 't_dim_user',
    datasource: 'crm_prod',
    schema: 'public',
    semantic_status: 'NEED_DECISION',
    field_total: 12,
    pending_tasks: 2,
    avg_confidence: 0.78,
    risk_level: 'MEDIUM',
    last_run_at: '2023-10-26T10:00:00Z',
    publish_level: 'NONE'
  },
  {
    id: 'lv_002',
    name: 't_fact_order',
    datasource: 'crm_prod',
    schema: 'public',
    semantic_status: 'SEMANTIC_CONFIRMED',
    field_total: 45,
    pending_tasks: 0,
    avg_confidence: 0.92,
    risk_level: 'LOW',
    last_run_at: '2023-10-25T14:30:00Z',
    publish_level: 'PREVIEW'
  },
  {
    id: 'lv_003',
    name: 't_stg_clickstream',
    datasource: 'log_raw',
    schema: 'default',
    semantic_status: 'SCANNED',
    field_total: 120,
    pending_tasks: 0,
    avg_confidence: 0,
    risk_level: 'HIGH',
    last_run_at: undefined,
    publish_level: 'NONE'
  },
  {
    id: 'lv_004',
    name: 't_dict_geo',
    datasource: 'ref_data',
    schema: 'master',
    semantic_status: 'OBJECT_CANDIDATES_READY',
    field_total: 8,
    pending_tasks: 0,
    avg_confidence: 0.99,
    risk_level: 'LOW',
    last_run_at: '2023-10-27T09:00:00Z',
    publish_level: 'NONE'
  }
];

export const fields: Record<string, Field[]> = {
  'lv_001': [
    { id: 'f_1', name: 'user_id', type: 'BIGINT', comment: 'User PK', constraints: { pk: true, fk: false, unique: true }, semantic: { semantic_type: 'IDENTIFIER', field_role: 'PRIMARY_IDENTIFIER', confidence: 0.99, decision_status: 'CONFIRMED' } },
    { id: 'f_2', name: 'mobile_encrypted', type: 'VARCHAR', comment: 'Phone', constraints: { pk: false, fk: false, unique: true }, semantic: { semantic_type: 'CONTACT', field_role: 'BUSINESS_ATTRIBUTE', confidence: 0.65, decision_status: 'PENDING' } },
    { id: 'f_3', name: 'reg_ts', type: 'TIMESTAMP', comment: 'Registration Time', constraints: { pk: false, fk: false, unique: false }, semantic: { semantic_type: 'TIME', field_role: 'BUSINESS_ATTRIBUTE', confidence: 0.95, decision_status: 'CONFIRMED' } }
  ],
  'lv_002': [
    { id: 'f_10', name: 'order_id', type: 'STRING', constraints: { pk: true, fk: false, unique: true } },
    { id: 'f_11', name: 'amt', type: 'DECIMAL', constraints: { pk: false, fk: false, unique: false }, semantic: { semantic_type: 'AMOUNT', field_role: 'METRIC_VALUE', confidence: 0.9, decision_status: 'CONFIRMED' } }
  ],
  'lv_003': [], // Raw fields omitted for brevity
  'lv_004': []
};

export const tasks: Record<string, InboxTask[]> = {
  'lv_001': [
    {
      id: 'task_1',
      logical_view_id: 'lv_001',
      field_id: 'f_2',
      level: 'field',
      reason: '语义类型置信度低 (0.65)',
      priority: 'P0',
      status: 'OPEN',
      must: true,
      top_candidates: [{ label: 'Mobile Phone', score: 0.65 }, { label: 'Encrypted Text', score: 0.4 }],
      impact: { downstream: 5, objects: 1 }
    }
  ]
};

export const objectCandidates: Record<string, ObjectCandidate[]> = {
  'lv_004': [
    {
      id: 'oc_1',
      logical_view_id: 'lv_004',
      name: 'GeoLocation',
      primary_identifier: 'geo_id',
      attributes: ['country', 'province', 'city', 'zipcode'],
      relations: [],
      confidence: 0.98,
      mapping: []
    }
  ]
};
