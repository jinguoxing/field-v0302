
import React from 'react';
import { Play, Edit3, Eye, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ExecutionPlan } from '../../types/scc';

interface ExecutionPlanPanelProps {
  plan: ExecutionPlan | null;
  onExecute: () => void;
  onCancel: () => void;
}

export const ExecutionPlanPanel: React.FC<ExecutionPlanPanelProps> = ({ plan, onExecute, onCancel }) => {
  if (!plan) return null;

  return (
    <div className="bg-slate-900 border-b border-slate-700 p-6 animate-in slide-in-from-top-4 duration-300 shadow-xl relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Plan Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30">
              <Play size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">执行计划生成完毕</h2>
              <p className="text-sm text-slate-400">基于您的意图: <span className="text-indigo-300 italic">"{plan.intent}"</span></p>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">计划步骤</span>
              <span className="text-xs text-slate-500 font-mono">ID: {plan.id}</span>
            </div>
            <div className="divide-y divide-slate-700/50">
              {plan.actions.map((action, index) => (
                <div key={index} className="px-4 py-3 flex items-center gap-4 hover:bg-slate-700/30 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold border border-slate-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-200 font-medium">{action.label}</div>
                    {action.threshold && (
                      <div className="text-xs text-slate-500 mt-0.5">阈值设定: &gt;{action.threshold * 100}%</div>
                    )}
                  </div>
                  {action.count !== undefined && (
                    <div className="px-2 py-1 bg-slate-700/50 rounded text-xs font-mono text-slate-300 border border-slate-600">
                      {action.count} items
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={onExecute}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2"
            >
              <Play size={16} /> 执行计划
            </button>
            <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-sm border border-slate-600 transition-all flex items-center gap-2">
              <Eye size={16} /> 预览 Diff
            </button>
            <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-sm border border-slate-600 transition-all flex items-center gap-2">
              <Edit3 size={16} /> 修改参数
            </button>
            <button 
              onClick={onCancel}
              className="ml-auto px-4 py-2.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              取消
            </button>
          </div>
        </div>

        {/* Right: Impact Analysis */}
        <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" /> 预期影响分析
          </h3>
          
          <div className="space-y-6">
            {/* Coverage Impact */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">语义覆盖率 (Coverage)</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  {plan.impact.coverage.after}% <ArrowRight size={12} />
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                <div className="bg-slate-500 h-full" style={{ width: `${plan.impact.coverage.before}%` }}></div>
                <div className="bg-emerald-500 h-full opacity-50" style={{ width: `${Number(plan.impact.coverage.after) - Number(plan.impact.coverage.before)}%` }}></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-slate-500 font-mono">
                <span>{plan.impact.coverage.before}%</span>
                <span>目标: 100%</span>
              </div>
            </div>

            {/* Risk Impact */}
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-amber-500/10 rounded text-amber-400">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">风险等级</div>
                  <div className="text-sm font-bold text-slate-200">{plan.impact.risk.before}</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-600" />
              <div className="text-right">
                <div className="text-xs text-slate-500">预期</div>
                <div className="text-sm font-bold text-emerald-400">{plan.impact.risk.after}</div>
              </div>
            </div>

            {/* Must Fix Impact */}
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-red-500/10 rounded text-red-400">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">阻塞项 (MUST)</div>
                  <div className="text-sm font-bold text-slate-200">{plan.impact.must_fix.before} 个</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-600" />
              <div className="text-right">
                <div className="text-xs text-slate-500">预期</div>
                <div className="text-sm font-bold text-emerald-400">{plan.impact.must_fix.after} 个</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
