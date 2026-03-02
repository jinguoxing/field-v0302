import React from 'react';
import { Check, X, Edit2, Wand2, ArrowRight, MoreHorizontal, AlertCircle, FileText, Binary, Activity, Layers } from 'lucide-react';
import { AI_DRAFTS_MOCK } from '../../../constants';
import { AIDraft } from '../../../types';

const ConfidenceBadge = ({ score }: { score: number }) => {
   let color = 'bg-red-500/10 text-red-400 border-red-500/20';
   if (score >= 90) color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
   else if (score >= 70) color = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

   return (
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${color}`}>
         {score}% 置信
      </span>
   );
};

const TypeIcon = ({ type }: { type: string }) => {
   switch (type) {
      case 'Term': return <FileText size={14} className="text-blue-400" />;
      case 'DataElement': return <Binary size={14} className="text-cyan-400" />;
      case 'Indicator': return <Activity size={14} className="text-emerald-400" />;
      default: return <Layers size={14} className="text-slate-400" />;
   }
};

const DraftCard: React.FC<{ draft: AIDraft }> = ({ draft }) => (
   <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors group">
      <div className="flex justify-between items-start mb-2">
         <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 rounded border border-slate-700">
               <TypeIcon type={draft.type} />
            </div>
            <div>
               <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  {draft.cnName} 
                  <span className="text-slate-500 font-normal font-mono text-xs hidden sm:inline">({draft.name})</span>
               </h4>
               <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                  来源: <span className="font-mono text-slate-400 bg-slate-900 px-1 rounded">{draft.sourceOrigin}</span>
               </p>
            </div>
         </div>
         <ConfidenceBadge score={draft.confidence} />
      </div>
      
      <div className="bg-slate-900/50 rounded p-3 mb-3 border border-slate-700/50">
         <p className="text-xs text-slate-300 leading-relaxed">{draft.description}</p>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-4 bg-indigo-900/10 p-2 rounded border border-indigo-500/10">
         <Wand2 size={12} className="text-indigo-400" />
         <span className="text-indigo-300 font-bold">证据:</span> 
         <span className="truncate">{draft.evidence}</span>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-700 pt-3 mt-auto">
         <button className="flex-1 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-600/20 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1">
            <Check size={14} /> 采纳
         </button>
         <button className="flex-1 py-1.5 bg-slate-700/30 hover:bg-slate-700 text-slate-300 border border-slate-600/30 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1">
            <Edit2 size={14} /> 微调
         </button>
         <button className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded transition-colors">
            <X size={16} />
         </button>
      </div>
   </div>
);

export const DraftList: React.FC = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col h-full shadow-lg backdrop-blur-sm overflow-hidden">
       {/* Header */}
       <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
          <div>
             <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                3. 草案工作台
             </h3>
             <p className="text-xs text-slate-500 mt-1">已生成 5 条高置信度草案</p>
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-1.5 bg-slate-700 text-slate-300 hover:text-white rounded text-xs font-medium transition-colors">批量忽略</button>
             <button className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-500 rounded text-xs font-medium transition-colors shadow-lg shadow-emerald-900/20">全部采纳</button>
          </div>
       </div>

       {/* List Content */}
       <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
             {AI_DRAFTS_MOCK.map(draft => (
                <DraftCard key={draft.id} draft={draft} />
             ))}
             
             {/* Empty State / Loading State could go here */}
          </div>
       </div>
    </div>
  );
};
