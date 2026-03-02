import React from 'react';
import { 
  Check, X, Edit3, Layers, AlertTriangle, MessageSquare, 
  Mic, Send, ArrowRight, Bot, ChevronUp 
} from 'lucide-react';
import { SemanticField } from '../../../types';

interface RightDecisionPanelProps {
  viewType: 'field' | 'table' | 'mapping';
  selectedField?: SemanticField;
  batchCount: number;
}

export const RightDecisionPanel: React.FC<RightDecisionPanelProps> = ({ viewType, selectedField, batchCount }) => {
  return (
    <div className="w-[360px] flex flex-col h-full bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
       
       {/* 1. Task Status Card */}
       <div className="p-5 border-b border-slate-700 bg-slate-900/50">
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">当前任务进度</h3>
             <span className="text-xs font-mono text-emerald-400">85%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
             <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '85%' }}></div>
          </div>
          <div className="flex gap-4 text-xs text-slate-500">
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 5 阻塞项</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 12 影响报表</span>
          </div>
       </div>

       {/* 2. Decision Action Area */}
       <div className="flex-1 overflow-y-auto p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
             <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
             决策操作 (Decision)
          </h3>

          {/* Contextual Actions */}
          {batchCount > 0 ? (
             <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-lg text-sm text-indigo-300 mb-2">
                   已选中 <span className="font-bold text-white">{batchCount}</span> 个字段进行批量操作。
                </div>
                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2">
                   <Check size={16} /> 批量接受推荐
                </button>
                <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2">
                   <X size={16} /> 批量忽略
                </button>
             </div>
          ) : viewType === 'field' && selectedField ? (
             <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 group">
                   <Check size={16} /> 接受 AI 推荐
                   <span className="text-[10px] bg-white/20 px-1.5 rounded text-white/90 group-hover:bg-white/30">置信度 95%</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                   <button className="py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                      <Edit3 size={14} /> 修改类型
                   </button>
                   <button className="py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                      <Layers size={14} /> 指定角色
                   </button>
                </div>
                <button className="w-full py-2.5 border border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-500/50 rounded-lg text-xs font-medium transition-all">
                   标记为忽略 / 误报
                </button>
             </div>
          ) : (
             <div className="h-32 flex items-center justify-center text-slate-500 text-sm italic border-2 border-dashed border-slate-700 rounded-xl">
                请在左侧选择对象以开始决策
             </div>
          )}

          {/* Risk Warning */}
          <div className="mt-6 bg-red-900/10 border border-red-500/20 rounded-xl p-4">
             <div className="flex items-center gap-2 text-red-400 mb-2 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle size={14} /> 风险提示
             </div>
             <ul className="space-y-2 text-xs text-red-200/80 list-disc list-inside">
                <li>变更可能影响 3 张下游报表。</li>
                <li>涉及 PII 敏感字段，需同步更新权限配置。</li>
             </ul>
          </div>
       </div>

       {/* 3. Agent Copilot Chat (Collapsible) */}
       <div className="border-t border-slate-700 bg-slate-900/80 flex flex-col">
          <div className="p-3 border-b border-slate-700/50 flex justify-between items-center cursor-pointer hover:bg-slate-800/50 transition-colors">
             <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Bot size={16} /> Copilot 助手
             </div>
             <ChevronUp size={14} className="text-slate-500" />
          </div>
          
          <div className="h-48 flex flex-col p-3 gap-3">
             {/* Chat History Mock */}
             <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                <div className="flex items-start gap-2">
                   <div className="w-6 h-6 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center"><Bot size={12} className="text-white"/></div>
                   <div className="bg-slate-800 p-2 rounded-lg rounded-tl-none text-xs text-slate-300">
                      已为您分析该字段，推荐映射为 "Mobile_Phone"。
                   </div>
                </div>
                <div className="flex items-start gap-2 flex-row-reverse">
                   <div className="w-6 h-6 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center"><span className="text-[9px] text-white">ME</span></div>
                   <div className="bg-indigo-900/50 p-2 rounded-lg rounded-tr-none text-xs text-indigo-100">
                      为什么不是 "Telephone"?
                   </div>
                </div>
             </div>

             {/* Quick Prompts */}
             <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button className="whitespace-nowrap px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-400 transition-colors border border-slate-700">解释冲突原因</button>
                <button className="whitespace-nowrap px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-400 transition-colors border border-slate-700">查找相似项</button>
             </div>

             {/* Input */}
             <div className="relative">
                <input type="text" placeholder="向 AI 提问..." className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                <button className="absolute right-2 top-2 text-slate-500 hover:text-indigo-400">
                   <Send size={14} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
