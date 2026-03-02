import React from 'react';
import { Sparkles, X, Lightbulb, Copy, Zap, ArrowRight } from 'lucide-react';

export const LibraryAISidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-indigo-950/20">
        <div className="flex items-center gap-2 text-indigo-400 font-bold">
           <Sparkles size={18} /> AI 治理助手
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
           <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Card 1: Quality Hints */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-amber-500/30 transition-colors group">
           <div className="flex items-start gap-3 mb-2">
              <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                 <Lightbulb size={16} />
              </div>
              <div>
                 <h4 className="text-sm font-bold text-slate-200">质量提示 (Quality Hints)</h4>
                 <p className="text-[10px] text-slate-500 mt-1">检测到 2 个标准信息不全。</p>
              </div>
           </div>
           <div className="space-y-2 mt-3 pl-1">
              <div className="text-xs text-slate-300 flex justify-between items-center p-2 rounded bg-slate-900/50 border border-slate-700/50">
                 <span>Term: DAU (缺少Owner)</span>
                 <button className="text-[10px] text-indigo-400 hover:text-indigo-300 underline">修复</button>
              </div>
              <div className="text-xs text-slate-300 flex justify-between items-center p-2 rounded bg-slate-900/50 border border-slate-700/50">
                 <span>Code: Gender (缺少枚举值)</span>
                 <button className="text-[10px] text-indigo-400 hover:text-indigo-300 underline">修复</button>
              </div>
           </div>
        </div>

        {/* Card 2: Possible Duplicates */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-red-500/30 transition-colors">
           <div className="flex items-start gap-3 mb-2">
              <div className="p-1.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                 <Copy size={16} />
              </div>
              <div>
                 <h4 className="text-sm font-bold text-slate-200">潜在重复 (Duplicates)</h4>
                 <p className="text-[10px] text-slate-500 mt-1">发现语义高度相似的项。</p>
              </div>
           </div>
           <div className="bg-slate-900 rounded p-2 border border-slate-700 mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                 <span className="text-slate-300">User_ID</span>
                 <span className="text-slate-500 text-[10px]">&harr;</span>
                 <span className="text-slate-300">Cust_Unique_ID</span>
              </div>
              <p className="text-[10px] text-red-400 font-bold mt-1">相似度 98%</p>
           </div>
           <button className="w-full mt-3 py-1.5 text-xs border border-slate-600 text-slate-300 hover:bg-slate-700 rounded transition-colors">
              处理重复
           </button>
        </div>

        {/* Card 3: Quick Create */}
        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-xl p-4">
           <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-indigo-300" />
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">智能创建</h4>
           </div>
           <p className="text-xs text-slate-300 leading-relaxed mb-3">
              输入业务描述，AI 自动生成标准草案。
           </p>
           <div className="relative">
              <input type="text" placeholder="e.g. 用户的注册手机号" className="w-full bg-slate-900/50 border border-indigo-500/30 rounded px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-400" />
              <button className="absolute right-1 top-1 p-0.5 text-indigo-400 hover:text-white bg-indigo-500/20 rounded">
                 <ArrowRight size={12} />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};