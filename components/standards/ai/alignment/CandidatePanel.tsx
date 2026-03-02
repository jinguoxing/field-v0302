import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { AlignmentTask } from '../../../../types';

interface CandidatePanelProps {
  task: AlignmentTask;
}

export const CandidatePanel: React.FC<CandidatePanelProps> = ({ task }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col h-full overflow-hidden shadow-lg backdrop-blur-sm relative">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles size={120} />
       </div>

       <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
             <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
             AI 推荐标准
          </h3>
          <p className="text-xs text-slate-500 mt-1">基于语义、数据指纹与全域引用关系推荐</p>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {task.candidates.map((cand, idx) => (
             <div key={cand.id} className={`rounded-xl border p-4 transition-all relative ${idx === 0 ? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-slate-800 border-slate-700 opacity-80 hover:opacity-100'}`}>
                {idx === 0 && (
                   <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles size={10} /> Top Pick
                   </div>
                )}
                
                <div className="flex justify-between items-start mb-3">
                   <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                         {cand.name}
                         <span className="text-xs font-normal text-slate-400 bg-slate-900 px-1.5 rounded">{cand.type}</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{cand.cnName}</p>
                   </div>
                   <div className={`text-lg font-bold font-mono ${cand.confidence > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {cand.confidence}%
                   </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-2 text-xs text-slate-300 mb-3 border border-slate-700/50">
                   {cand.reason}
                </div>

                {cand.isConflict && (
                   <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-900/20 p-2 rounded mb-3 border border-amber-500/20">
                      <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                      <span>检测到潜在冲突：该标准已映射到同表的 "staff_code" 字段。</span>
                   </div>
                )}

                <button className={`w-full py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${idx === 0 ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
                   {task.selectedCandidateId === cand.id ? (
                      <>
                         <CheckCircle2 size={14} /> 已选择
                      </>
                   ) : (
                      <>
                         <ArrowRight size={14} /> 选择此标准
                      </>
                   )}
                </button>
             </div>
          ))}

          {task.candidates.length === 0 && (
             <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <AlertTriangle size={32} className="mb-2 opacity-50" />
                <p className="text-sm">未找到高置信度匹配</p>
                <button className="mt-4 text-cyan-400 text-xs hover:underline">手动搜索标准库</button>
             </div>
          )}
       </div>
    </div>
  );
};