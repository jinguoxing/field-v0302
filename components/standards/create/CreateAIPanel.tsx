import React, { useState } from 'react';
import { Sparkles, Wand2, Copy, Search, ArrowLeft, RefreshCw, Zap, ArrowRight, Check } from 'lucide-react';

interface Suggestion {
  id: string;
  field: string;
  value: string;
  reason: string;
}

export const CreateAIPanel: React.FC = () => {
  const [context, setContext] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { id: '1', field: 'cnName', value: '客户统一标识', reason: 'Translated from "Customer_ID"' },
    { id: '2', field: 'definition', value: '企业范围内唯一标识一个自然人客户的编码，通常由系统自动生成。', reason: 'Generated based on standard naming patterns.' }
  ]);

  return (
    <div className="w-96 bg-slate-900/80 border-l border-slate-700 flex flex-col h-full backdrop-blur-sm animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-700 bg-indigo-950/20">
        <h3 className="text-sm font-bold text-indigo-200 flex items-center gap-2">
           <Sparkles size={16} className="text-indigo-400" /> AI 辅助 (Copilot)
        </h3>
        <p className="text-xs text-indigo-300/70 mt-1">提供上下文以生成元数据。</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
         {/* Context Picker */}
         <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">上下文来源 (Context)</label>
            <div className="relative group">
               <input 
                 type="text" 
                 placeholder="选择表 / 文档 / 文本..." 
                 className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 pl-3 pr-8 text-xs text-slate-200 focus:border-indigo-500 outline-none transition-colors"
                 value={context}
                 onChange={(e) => setContext(e.target.value)}
               />
               <Search size={14} className="absolute right-2.5 top-2.5 text-slate-500" />
            </div>
            <div className="flex gap-2">
               <button className="flex-1 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded text-[10px] text-slate-300 transition-colors flex items-center justify-center gap-1">
                  <Copy size={10} /> 粘贴 (Paste)
               </button>
               <button className="flex-1 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded text-[10px] text-slate-300 transition-colors flex items-center justify-center gap-1">
                  <Search size={10} /> 浏览 (Browse)
               </button>
            </div>
         </div>

         {/* Actions */}
         <div className="grid grid-cols-2 gap-2">
            <button className="p-3 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex flex-col items-center gap-2 transition-all group">
               <Wand2 size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />
               <span className="text-xs font-medium text-indigo-200">智能生成</span>
            </button>
            <button className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex flex-col items-center gap-2 transition-all group">
               <RefreshCw size={20} className="text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
               <span className="text-xs font-medium text-slate-300">查重 & 一致性</span>
            </button>
         </div>

         {/* Suggestions List */}
         <div>
            <div className="flex justify-between items-center mb-3">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI 建议</h4>
               <button className="text-[10px] text-indigo-400 hover:text-indigo-300">全部应用</button>
            </div>
            
            <div className="space-y-3">
               {suggestions.map(s => (
                  <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-indigo-500/30 transition-colors group">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">{s.field}</span>
                        <button className="p-1 hover:bg-indigo-600 hover:text-white text-slate-500 rounded transition-colors" title="Apply">
                           <Check size={12} />
                        </button>
                     </div>
                     <p className="text-xs text-slate-200 font-medium my-1">{s.value}</p>
                     <p className="text-[10px] text-indigo-300 flex items-center gap-1">
                        <Zap size={10} /> {s.reason}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};