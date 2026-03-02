
import React from 'react';
import { ChevronRight, AlertOctagon, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { SemanticState, ExceptionItem } from '../../types/scc';

interface SemanticStateBoardProps {
  state: SemanticState;
  onBlockerClick: (item: ExceptionItem) => void;
  onStepClick?: (stepId: string) => void;
}

const STEPS = [
  { id: 'SCAN', label: '扫描' },
  { id: 'FIELD_DECISION', label: '字段裁决' },
  { id: 'TABLE_UNDERSTANDING', label: '表理解' },
  { id: 'OBJECT_GENERATION', label: '对象生成' },
  { id: 'MAPPING_CONFIRM', label: '映射确认' },
  { id: 'PUBLISH', label: '发布' },
];

export const SemanticStateBoard: React.FC<SemanticStateBoardProps> = ({ state, onBlockerClick, onStepClick }) => {
  const currentStepIndex = STEPS.findIndex(s => s.id === state.current_step);

  return (
    <div className="p-6 space-y-6">
      
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider z-10">当前状态</div>
          <div className="text-2xl font-bold text-white z-10 flex items-center gap-2">
            {state.status === 'RUNNING' && <Loader2 className="animate-spin text-indigo-400" />}
            {state.status}
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 size={80} />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-red-500/50 transition-colors">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider z-10">必须修复 (MUST)</div>
          <div className="text-4xl font-mono font-bold text-red-400 z-10">{state.metrics.must_fix_count}</div>
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity text-red-500">
            <AlertOctagon size={80} />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider z-10">语义覆盖率</div>
          <div className="text-4xl font-mono font-bold text-emerald-400 z-10">{state.metrics.coverage}%</div>
          <div className="w-full bg-slate-700/50 h-1.5 rounded-full mt-2 z-10">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${state.metrics.coverage}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider z-10">风险等级</div>
          <div className={`text-2xl font-bold z-10 ${state.metrics.risk_level === 'HIGH' ? 'text-red-400' : state.metrics.risk_level === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {state.metrics.risk_level}
          </div>
          <div className="text-xs text-slate-500 z-10 mt-1">影响 {state.metrics.impact_tables} 张表</div>
        </div>
      </div>

      {/* State Machine Progress Bar */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[800px]">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                <div 
                  className="flex flex-col items-center gap-3 relative group cursor-pointer"
                  onClick={() => onStepClick && onStepClick(step.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                    isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' :
                    isCurrent ? 'bg-slate-900 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' :
                    'bg-slate-800 border-slate-700 text-slate-600'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={20} /> : 
                     isCurrent ? <Loader2 size={20} className="animate-spin" /> :
                     <div className="w-2 h-2 rounded-full bg-slate-600" />}
                  </div>
                  <span className={`text-xs font-bold whitespace-nowrap ${
                    isCurrent ? 'text-indigo-400' : 
                    isCompleted ? 'text-slate-300' : 
                    'text-slate-600'
                  }`}>
                    {step.label}
                  </span>
                  
                  {/* Step Status Tooltip/Indicator could go here */}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 relative ${isCompleted ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                    {isCurrent && (
                      <div className="absolute right-0 -top-1.5 w-3 h-3 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Blockers / Exceptions Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <AlertOctagon size={16} className="text-red-400" /> 关键阻塞点 (Blockers)
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {state.blockers.map(blocker => (
            <div 
              key={blocker.id}
              onClick={() => onBlockerClick(blocker)}
              className="bg-slate-800 border border-slate-700 hover:border-red-500/50 hover:bg-slate-800/80 p-4 rounded-lg cursor-pointer transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 group-hover:scale-110 transition-transform">
                  <AlertOctagon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{blocker.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{blocker.description || '需要人工介入处理'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-slate-900 rounded text-xs font-mono font-bold text-red-400 border border-slate-700">
                  {blocker.count}
                </span>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400" />
              </div>
            </div>
          ))}
          
          {state.blockers.length === 0 && (
            <div className="col-span-2 p-8 border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 bg-slate-800/20">
              <CheckCircle2 size={32} className="text-emerald-500/50 mb-3" />
              <p className="text-sm">没有发现关键阻塞点</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
