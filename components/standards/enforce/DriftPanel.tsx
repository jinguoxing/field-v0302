import React from 'react';
import { History, ArrowRight, AlertTriangle, RefreshCcw, GitCompare } from 'lucide-react';
import { DRIFT_ITEMS_MOCK } from '../../../constants';

export const DriftPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full gap-6">
       <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col shadow-lg backdrop-blur-sm flex-1 overflow-hidden">
          <div className="p-5 border-b border-slate-700 bg-slate-900/30 flex justify-between items-center">
             <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <History size={16} className="text-amber-400" /> 漂移检测日志
             </h3>
             <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <RefreshCcw size={12} /> 重新扫描
             </button>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-4">
             {DRIFT_ITEMS_MOCK.map(drift => (
                <div key={drift.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-amber-500/30 transition-colors">
                   <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${drift.severity === 'High' ? 'bg-red-500/10 text-red-400' : drift.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            <GitCompare size={20} />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-slate-200">{drift.target}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 rounded">{drift.type}</span>
                               <span className="text-[10px] text-slate-500">{drift.detectedAt}</span>
                            </div>
                         </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${drift.severity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : drift.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                         {drift.severity} Impact
                      </span>
                   </div>

                   <p className="text-sm text-slate-300 mb-4 bg-slate-900/50 p-3 rounded border border-slate-700/50">
                      {drift.description}
                   </p>

                   <div className="flex items-center justify-between border-t border-slate-700/50 pt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                         <AlertTriangle size={12} className="text-amber-400" />
                         建议动作: <span className="text-slate-300">{drift.action}</span>
                      </div>
                      <button className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors flex items-center gap-2">
                         执行修复 <ArrowRight size={12} />
                      </button>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};