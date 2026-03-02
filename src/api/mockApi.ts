
import { logicalViews, fields, tasks, objectCandidates } from '../data/mockDb';
import { LogicalView, SemanticRun, InboxTask, ObjectCandidate } from '../types/domain';

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
      // Step 1: Running
      view.semantic_status = 'UNDERSTANDING_RUNNING';
      
      // Step 2: Finish (Mock Async)
      setTimeout(() => {
        view.semantic_status = 'NEED_DECISION';
        view.last_run_at = new Date().toISOString();
        
        // Populate Tasks if empty
        if (!tasks[lvId]) tasks[lvId] = [];
        if (tasks[lvId].length === 0) {
           view.pending_tasks = 1;
           tasks[lvId].push({
             id: `task_${Date.now()}`, logical_view_id: lvId, level: 'table', 
             reason: '表级业务意图模糊', priority: 'P1', status: 'OPEN', must: false,
             top_candidates: [{label: 'User Dimension', score: 0.8}], impact: {downstream:0, objects:0}
           });
        }
      }, 2000); 
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
    // Find task
    let targetTask: InboxTask | undefined;
    for (const lvId in tasks) {
      const t = tasks[lvId].find(x => x.id === decision.taskId);
      if (t) {
        targetTask = t;
        t.status = 'DONE';
        // Update view counts
        const view = logicalViews.find(v => v.id === lvId);
        if (view && view.pending_tasks > 0) view.pending_tasks--;
        
        // Update field if applicable
        if (t.field_id) {
          const field = fields[lvId]?.find(f => f.id === t.field_id);
          if (field && field.semantic) {
            field.semantic.decision_status = 'CONFIRMED';
            field.semantic.confidence = 1.0; 
          }
        }
        
        // Check if all tasks done to upgrade status
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
      if (!objectCandidates[lvId] || objectCandidates[lvId].length === 0) {
        objectCandidates[lvId] = [{
          id: `oc_${Date.now()}`, logical_view_id: lvId, name: 'GeneratedObject_A', 
          primary_identifier: 'id', attributes: ['attr_1', 'attr_2', 'created_at'], relations: [], confidence: 0.92, mapping: []
        }, {
          id: `oc_${Date.now()}_2`, logical_view_id: lvId, name: 'GeneratedObject_B', 
          primary_identifier: 'uuid', attributes: ['name', 'status'], relations: [], confidence: 0.78, mapping: []
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
