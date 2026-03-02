
import { useState, useEffect, useCallback } from 'react';

// --- TYPES ---

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

// --- MOCK DB ---

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
  'lv_003': [], 
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

// --- MOCK API ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  getLogicalViews: async (): Promise<LogicalView[]> => {
    await delay(300);
    return [...logicalViews];
  },

  getLogicalView: async (id: string): Promise<LogicalView | undefined> => {
    await delay(200);
    return logicalViews.find(v => v.id === id);
  },

  getFields: async (lvId: string) => {
    await delay(300);
    return fields[lvId] || [];
  },

  createSemanticRun: async (lvId: string): Promise<SemanticRun> => {
    await delay(500);
    const view = logicalViews.find(v => v.id === lvId);
    if (view) {
      view.semantic_status = 'UNDERSTANDING_RUNNING';
      setTimeout(() => {
        view.semantic_status = 'NEED_DECISION';
        view.last_run_at = new Date().toISOString();
        if (!tasks[lvId]) tasks[lvId] = [];
        if (tasks[lvId].length === 0) {
           view.pending_tasks = 1;
           tasks[lvId].push({
             id: `task_${Date.now()}`, logical_view_id: lvId, level: 'table', 
             reason: '表级业务意图模糊', priority: 'P1', status: 'OPEN', must: false,
             top_candidates: [{label: 'User Dimension', score: 0.8}], impact: {downstream:0, objects:0}
           });
        }
      }, 3000); 
    }
    return {
      id: `run_${Date.now()}`, logical_view_id: lvId, status: 'RUNNING',
      progress: { done: 0, total: 100 }, started_at: new Date().toISOString()
    };
  },

  getTasks: async (lvId: string) => {
    await delay(300);
    return (tasks[lvId] || []).filter(t => t.status === 'OPEN');
  },

  getTaskContext: async (taskId: string) => {
    await delay(400);
    return {
      task: Object.values(tasks).flat().find(t => t.id === taskId),
      candidates: [
        { label: 'Mobile Phone', value: 'CONTACT', score: 0.85, tags: ['PII', 'HighFreq'] },
        { label: 'Telephone', value: 'CONTACT_LANDLINE', score: 0.60 },
        { label: 'Encrypted String', value: 'TEXT_ENCRYPTED', score: 0.45 }
      ],
      evidence_chain: [
        { type: 'NAMING', weight: 'HIGH', summary: '字段名包含 "mobile"', details: { raw: 'mobile_encrypted' } },
        { type: 'DISTRIBUTION', weight: 'MEDIUM', summary: '非空率 100%, 唯一率 95%' },
      ],
      form_schema: { type: 'field', fields: ['semantic_type', 'description'] }
    };
  },

  postDecision: async (decision: { taskId: string, action: string }) => {
    await delay(600);
    let targetTask: InboxTask | undefined;
    for (const lvId in tasks) {
      const t = tasks[lvId].find(x => x.id === decision.taskId);
      if (t) {
        targetTask = t;
        t.status = 'DONE';
        const view = logicalViews.find(v => v.id === lvId);
        if (view && view.pending_tasks > 0) view.pending_tasks--;
        
        if (t.field_id) {
          const field = fields[lvId]?.find(f => f.id === t.field_id);
          if (field && field.semantic) {
            field.semantic.decision_status = 'CONFIRMED';
            field.semantic.confidence = 1.0; 
          }
        }
        
        const openTasks = tasks[lvId].filter(x => x.status === 'OPEN');
        if (openTasks.length === 0 && view?.semantic_status === 'NEED_DECISION') {
          view.semantic_status = 'SEMANTIC_CONFIRMED';
        }
        break;
      }
    }
    return { success: true };
  },

  generateObjectCandidates: async (lvId: string) => {
    await delay(800);
    const view = logicalViews.find(v => v.id === lvId);
    if (view) {
      view.semantic_status = 'OBJECT_CANDIDATES_READY';
      if (!objectCandidates[lvId]) {
        objectCandidates[lvId] = [{
          id: `oc_${Date.now()}`, logical_view_id: lvId, name: 'GeneratedObject', 
          primary_identifier: 'id', attributes: ['attr1'], relations: [], confidence: 0.88, mapping: []
        }];
      }
    }
    return objectCandidates[lvId];
  },

  getObjectCandidates: async (lvId: string) => {
    await delay(300);
    return objectCandidates[lvId] || [];
  },

  publish: async (lvId: string, type: 'PREVIEW' | 'FORMAL') => {
    await delay(1000);
    const view = logicalViews.find(v => v.id === lvId);
    if (view) {
      view.publish_level = type;
      if (type === 'FORMAL') view.semantic_status = 'PUBLISHED_FORMAL';
      else view.semantic_status = 'PUBLISHED_PREVIEW';
    }
    return { success: true };
  }
};

// --- HOOKS ---

export function useAsync<T>(asyncFunction: () => Promise<T>, immediate = true) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);
    return asyncFunction()
      .then((response) => {
        setValue(response);
        setStatus('success');
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error, isLoading: status === 'pending' };
}
