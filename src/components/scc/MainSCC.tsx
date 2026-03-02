
import React, { useState, useEffect } from 'react';
import { TopControlBar } from './TopControlBar';
import { ExecutionPlanPanel } from './ExecutionPlanPanel';
import { SemanticStateBoard } from './SemanticStateBoard';
import { ExceptionCenter } from './ExceptionCenter';
import { ContextDrawer } from './ContextDrawer';
import { TableUnderstandingBoard } from './TableUnderstandingBoard';
import { ObjectGenerationBoard } from './ObjectGenerationBoard';
import { SemanticState, ExecutionPlan, ExceptionItem } from '../../types/scc';

// Mock Initial State
const INITIAL_STATE: SemanticState = {
  status: 'WAITING_DECISION',
  metrics: {
    must_fix_count: 2,
    coverage: 84,
    risk_level: 'MEDIUM',
    impact_tables: 12
  },
  current_step: 'FIELD_DECISION',
  blockers: [
    { id: 'b1', type: 'FIELD_CONFLICT', title: '字段类型冲突', count: 4, description: '物理类型与推断语义类型不兼容' },
    { id: 'b2', type: 'MAPPING_CONFLICT', title: '映射冲突', count: 2, description: '多个字段映射到同一业务属性' }
  ]
};

// ... (MOCK_PLAN remains same)
const MOCK_PLAN: ExecutionPlan = {
  id: 'plan-01',
  intent: '',
  scope: ['retail_orders', 'retail_customers'],
  actions: [
    { type: 'ACCEPT_HIGH_CONF_FIELDS', label: '接受高置信度字段', count: 124 },
    { type: 'RESOLVE_MAPPING_CONFLICTS', label: '解决映射冲突', count: 4 },
    { type: 'UPDATE_TABLE_TYPE', label: '更新表类型', count: 2 }
  ],
  impact: {
    coverage: { before: 84, after: 96, trend: 'UP' },
    risk: { before: 'MEDIUM', after: 'LOW', trend: 'DOWN' },
    must_fix: { before: 2, after: 0, trend: 'DOWN' }
  },
  status: 'DRAFT'
};

export const MainSCC: React.FC = () => {
  const [state, setState] = useState<SemanticState>(INITIAL_STATE);
  const [activePlan, setActivePlan] = useState<ExecutionPlan | null>(null);
  const [activeException, setActiveException] = useState<ExceptionItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handlers
  const handleIntentSubmit = (intent: string) => {
    // Simulate AI generating a plan
    console.log('Generating plan for:', intent);
    setActivePlan({ ...MOCK_PLAN, intent });
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
    setActivePlan({ ...MOCK_PLAN, intent: `Quick Action: ${action}` });
  };

  const handleExecutePlan = () => {
    // Simulate execution
    setActivePlan(null);
    setState(prev => ({
      ...prev,
      status: 'READY',
      metrics: {
        must_fix_count: 0,
        coverage: 96,
        risk_level: 'LOW',
        impact_tables: 12
      },
      current_step: 'TABLE_UNDERSTANDING', // Move to next step
      blockers: []
    }));
  };

  const handleResolveException = (exceptionId: string, count: number) => {
    setState(prev => {
      const newBlockers = prev.blockers.map(b => {
        if (b.id === exceptionId) {
          return { ...b, count: Math.max(0, b.count - count) };
        }
        return b;
      }).filter(b => b.count > 0);

      const totalMustFix = newBlockers.reduce((acc, b) => acc + b.count, 0);

      return {
        ...prev,
        blockers: newBlockers,
        metrics: {
          ...prev.metrics,
          must_fix_count: totalMustFix
        }
      };
    });
  };

  const handleStepClick = (stepId: string) => {
    setState(prev => ({ ...prev, current_step: stepId as any }));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Top Control Bar */}
      <TopControlBar 
        onIntentSubmit={handleIntentSubmit}
        onQuickAction={handleQuickAction}
      />

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
          
          {/* 2. Execution Plan Panel (Conditional) */}
          {activePlan && (
            <ExecutionPlanPanel 
              plan={activePlan} 
              onExecute={handleExecutePlan}
              onCancel={() => setActivePlan(null)}
            />
          )}

          {/* 3. Semantic State Board or Detail View */}
          {state.current_step === 'TABLE_UNDERSTANDING' ? (
             <TableUnderstandingBoard />
          ) : state.current_step === 'OBJECT_GENERATION' ? (
             <ObjectGenerationBoard />
          ) : (
             <SemanticStateBoard 
               state={state} 
               onBlockerClick={setActiveException}
               onStepClick={handleStepClick}
             />
          )}

        </div>

        {/* 5. Context Drawer */}
        <ContextDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
        />
        
        {/* Toggle for Drawer (Floating) */}
        {!isDrawerOpen && (
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-slate-800 border-l border-t border-b border-slate-700 p-2 rounded-l-lg hover:bg-slate-700 transition-colors shadow-lg"
          >
            <span className="writing-vertical-rl text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Context</span>
          </button>
        )}

      </div>

      {/* 4. Exception Center (Modal/Overlay) */}
      <ExceptionCenter 
        activeException={activeException} 
        onClose={() => setActiveException(null)} 
        onResolve={handleResolveException}
      />

    </div>
  );
};
