import React from 'react';
import { Database, Table as TableIcon, CheckCircle2, SlidersHorizontal } from 'lucide-react';

export const AlignmentScopeBar: React.FC = () => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 shadow-lg mb-6">
       
       <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700">
             <Database size={14} className="text-slate-400" />
             <span className="text-sm text-slate-200">HR_Master_DB</span>
             <span className="text-slate-600">/</span>
             <TableIcon size={14} className="text-cyan-400" />
             <span className="text-sm font-bold text-white">t_hr_employee_v2</span>
          </div>
          
          <div className="h-6 w-px bg-slate-700"></div>

          <div className="flex items-center gap-6 text-xs">
             <div>
                <span className="text-slate-500 block">待处理字段</span>
                <span className="text-white font-mono font-bold">12</span>
             </div>
             <div>
                <span className="text-slate-500 block">自动匹配率</span>
                <span className="text-emerald-400 font-mono font-bold">85%</span>
             </div>
          </div>
       </div>

       <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
             <CheckCircle2 size={12} className="text-cyan-500" />
             <span>AI 已预选置信度 &gt; 90% 的项</span>
          </div>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
             <SlidersHorizontal size={16} />
          </button>
       </div>
    </div>
  );
};