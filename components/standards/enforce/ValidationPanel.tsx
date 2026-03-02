import React, { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, XCircle, Clock, ChevronRight, AlertOctagon, RefreshCw } from 'lucide-react';
import { VALIDATION_RUNS_MOCK } from '../../../constants';
import { ValidationRun } from '../../../types';

export const ValidationPanel: React.FC = () => {
  const [selectedRun, setSelectedRun] = useState<ValidationRun>(VALIDATION_RUNS_MOCK[0]);

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar List */}
      <div className="w-80 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-lg backdrop-blur-sm">
         <div className="p-4 border-b border-slate-700 bg-slate-900/50">
            <h3 className="text-sm font-bold text-slate-200 mb-2">执行历史 (Run History)</h3>
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-2">
               <Play size={12} /> 立即执行校验
            </button>
         </div>
         <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {VALIDATION_RUNS_MOCK.map(run => (
               <div 
                 key={run.id} 
                 onClick={() => setSelectedRun(run)}
                 className={`p-3 rounded-lg cursor-pointer transition-all border flex items-start gap-3 ${selectedRun.id === run.id ? 'bg-slate-700/50 border-cyan-500/30' : 'hover:bg-slate-700/30 border-transparent'}`}
               >
                  <div className={`mt-0.5 ${run.status === 'success' ? 'text-emerald-400' : run.status === 'warning' ? 'text-amber-400' : 'text-red-400'}`}>
                     {run.status === 'success' ? <CheckCircle2 size={16} /> : run.status === 'warning' ? <AlertTriangle size={16} /> : <XCircle size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-200 truncate">{run.ruleSet}</span>
                     </div>
                     <div className="text-[10px] text-slate-500 font-mono mb-1">{run.startTime}</div>
                     <div className="flex gap-2 text-[10px]">
                        <span className="text-emerald-400">{run.resultSummary.passed} Pass</span>
                        {run.resultSummary.failed > 0 && <span className="text-red-400 font-bold">{run.resultSummary.failed} Fail</span>}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-lg backdrop-blur-sm">
         <div className="p-6 border-b border-slate-700 bg-slate-900/30 flex justify-between items-start">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">{selectedRun.ruleSet}</h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${selectedRun.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : selectedRun.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                     {selectedRun.status}
                  </span>
               </div>
               <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock size={12} /> 耗时: {selectedRun.duration}</span>
                  <span>范围: {selectedRun.scope}</span>
                  <span>ID: {selectedRun.id}</span>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 bg-slate-700 text-slate-300 hover:text-white rounded text-xs font-medium transition-colors flex items-center gap-2">
                  <RefreshCw size={12} /> 重跑失败项
               </button>
            </div>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-3 border-b border-slate-700 bg-slate-800/30">
            <div className="p-4 border-r border-slate-700 text-center">
               <div className="text-2xl font-bold text-white font-mono">{selectedRun.resultSummary.total}</div>
               <div className="text-xs text-slate-500 uppercase">总检查项</div>
            </div>
            <div className="p-4 border-r border-slate-700 text-center">
               <div className="text-2xl font-bold text-emerald-400 font-mono">{selectedRun.resultSummary.passed}</div>
               <div className="text-xs text-slate-500 uppercase">通过</div>
            </div>
            <div className="p-4 text-center">
               <div className="text-2xl font-bold text-red-400 font-mono">{selectedRun.resultSummary.failed}</div>
               <div className="text-xs text-slate-500 uppercase">失败</div>
            </div>
         </div>

         {/* Issue List */}
         <div className="flex-1 overflow-auto p-4 space-y-4">
            {selectedRun.issues.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <CheckCircle2 size={48} className="text-emerald-500/50 mb-4" />
                  <p>无异常发现，校验通过。</p>
               </div>
            ) : (
               selectedRun.issues.map(issue => (
                  <div key={issue.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-red-500/30 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <AlertOctagon size={16} className="text-red-400" />
                           <span className="text-sm font-bold text-slate-200">{issue.targetName}</span>
                           <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">{issue.targetType}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-bold uppercase">{issue.severity}</span>
                     </div>
                     <p className="text-xs text-slate-300 mb-3">{issue.message}</p>
                     <div className="bg-indigo-900/20 border border-indigo-500/20 rounded p-3 flex gap-3">
                        <div className="mt-0.5"><CheckCircle2 size={14} className="text-indigo-400" /></div>
                        <div>
                           <span className="text-xs font-bold text-indigo-300 block mb-1">AI 修复建议</span>
                           <p className="text-xs text-slate-400">{issue.suggestion}</p>
                           <div className="flex gap-2 mt-2">
                              <button className="text-[10px] text-indigo-400 hover:text-white underline">应用建议</button>
                              <button className="text-[10px] text-slate-500 hover:text-white underline">申请豁免</button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
    </div>
  );
};