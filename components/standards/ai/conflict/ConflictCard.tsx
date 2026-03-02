import React from 'react';
import { GitMerge, ArrowRightLeft, AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';
import { ConflictItem } from '../../../../types';

interface ConflictCardProps {
  conflict: ConflictItem;
}

const RiskBadge = ({ level }: { level: 'High' | 'Medium' | 'Low' }) => {
   const colors = {
      High: 'bg-red-500/10 text-red-400 border-red-500/20',
      Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      Low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
   };
   return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors[level]}`}>
         {level} Risk
      </span>
   );
};

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-colors">
       <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                <GitMerge size={20} />
             </div>
             <div>
                <h3 className="text-base font-bold text-slate-200">{conflict.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">ID: {conflict.id}</p>
             </div>
          </div>
          <RiskBadge level={conflict.riskLevel} />
       </div>

       {/* Comparison Area */}
       <div className="flex items-stretch gap-4 mb-4 relative">
          {/* A */}
          <div className="flex-1 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
             <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Standard A</div>
             <div className="text-sm font-bold text-slate-200 mb-1">{conflict.itemA.name}</div>
             <div className="text-xs text-cyan-400 bg-cyan-900/20 px-1.5 py-0.5 rounded w-fit mb-2">{conflict.itemA.domain}</div>
             <p className="text-xs text-slate-400 leading-relaxed">{conflict.itemA.desc}</p>
          </div>
          
          {/* Center Connector */}
          <div className="flex flex-col items-center justify-center text-slate-600 relative z-10">
             <div className="text-[10px] font-bold bg-slate-800 px-2 py-1 rounded-full border border-slate-700 mb-2">
                {conflict.similarity}% 相似
             </div>
             <ArrowRightLeft size={16} />
          </div>

          {/* B */}
          <div className="flex-1 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
             <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Standard B</div>
             <div className="text-sm font-bold text-slate-200 mb-1">{conflict.itemB.name}</div>
             <div className="text-xs text-cyan-400 bg-cyan-900/20 px-1.5 py-0.5 rounded w-fit mb-2">{conflict.itemB.domain}</div>
             <p className="text-xs text-slate-400 leading-relaxed">{conflict.itemB.desc}</p>
          </div>
       </div>

       {/* AI Suggestion */}
       <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-3 mb-4 flex gap-3">
          <ShieldAlert size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
             <span className="text-xs font-bold text-indigo-300 block mb-1">AI 治理建议</span>
             <p className="text-xs text-slate-300 leading-relaxed">{conflict.aiSuggestion}</p>
          </div>
       </div>

       {/* Actions */}
       <div className="flex gap-3 pt-2 border-t border-slate-700/50">
          <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-2">
             <Check size={14} /> 采纳 AI 方案
          </button>
          <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-bold transition-colors">
             人工介入
          </button>
          <button className="py-2 px-3 text-slate-500 hover:text-slate-300 transition-colors">
             <X size={16} />
          </button>
       </div>
    </div>
  );
};