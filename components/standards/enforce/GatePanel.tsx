import React from 'react';
import { DoorClosed, ShieldCheck, Settings, Play, Check, AlertTriangle, X } from 'lucide-react';
import { GATE_POLICIES_MOCK } from '../../../constants';

export const GatePanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full gap-6">
       {/* Policy Cards */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {GATE_POLICIES_MOCK.map(policy => (
             <div key={policy.id} className={`bg-slate-800/50 border rounded-xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden group ${policy.status === 'Active' ? 'border-indigo-500/30' : 'border-slate-700 opacity-70'}`}>
                {policy.status === 'Active' && <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8 z-0"></div>}
                
                <div className="relative z-10 flex justify-between items-start mb-4">
                   <div>
                      <h3 className="text-sm font-bold text-white mb-1">{policy.name}</h3>
                      <p className="text-xs text-slate-400">{policy.scope}</p>
                   </div>
                   <div className={`p-2 rounded-lg ${policy.status === 'Active' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-500'}`}>
                      <DoorClosed size={18} />
                   </div>
                </div>

                <div className="space-y-2 mb-4 relative z-10">
                   {policy.requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                         <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                         {req}
                      </div>
                   ))}
                </div>

                <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between relative z-10">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">最近通过率</span>
                      <span className={`text-lg font-bold font-mono ${policy.lastCheckRate >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                         {policy.lastCheckRate}%
                      </span>
                   </div>
                   <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors">
                      配置
                   </button>
                </div>
             </div>
          ))}
       </div>

       {/* Simulation / Check Area */}
       <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg backdrop-blur-sm flex flex-col min-h-0">
          <div className="p-5 border-b border-slate-700 bg-slate-900/30 flex justify-between items-center">
             <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" /> 发布检查模拟 (Dry Run)
             </h3>
             <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                <Play size={14} /> 运行检查
             </button>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
             {/* Mock Report */}
             <div className="space-y-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                         <Check size={16} />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-slate-200">Table: t_hr_employee_v2</h4>
                         <p className="text-xs text-slate-500">核心表发布门禁 • Passed</p>
                      </div>
                   </div>
                   <button className="text-xs text-slate-400 hover:text-white underline">查看详情</button>
                </div>

                <div className="bg-slate-800 border border-red-500/30 rounded-lg p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                         <X size={16} />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-slate-200">Metric: DAU_V2</h4>
                         <p className="text-xs text-red-400">指标上线检查 • Failed (缺少维度定义)</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs hover:text-white">修复</button>
                      <button className="px-3 py-1 border border-slate-600 text-slate-400 rounded text-xs hover:border-slate-500">豁免</button>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};