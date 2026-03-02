import React from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

export const LibraryFilters: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-lg mb-6">
      <div className="flex items-center gap-4">
         {/* Semantic Search Bar */}
         <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search size={16} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input 
               type="text" 
               className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-slate-200 placeholder:text-slate-500 transition-all shadow-inner"
               placeholder="搜索标准 (支持语义搜索，如: '用户的唯一标识')"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles size={10} className="mr-1" /> 语义增强
               </span>
            </div>
         </div>

         {/* Primary Filters */}
         <div className="flex items-center gap-2">
            <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 outline-none hover:bg-slate-800 transition-colors cursor-pointer">
               <option>所有领域</option>
               <option>客户域</option>
               <option>供应链</option>
               <option>财务域</option>
            </select>
            <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 outline-none hover:bg-slate-800 transition-colors cursor-pointer">
               <option>所有状态</option>
               <option>已发布</option>
               <option>草稿中</option>
               <option>审核中</option>
            </select>
            <button className="p-2.5 text-slate-400 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-colors relative" title="更多筛选">
               <SlidersHorizontal size={18} />
               <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full border border-slate-900"></span>
            </button>
         </div>
      </div>
      
      {/* Active Tags / secondary info */}
      <div className="flex items-center gap-2 text-xs">
         <span className="text-slate-500">推荐标签:</span>
         <button className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 hover:bg-cyan-900/30 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/30">核心主数据</button>
         <button className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 hover:bg-cyan-900/30 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/30">PII 敏感</button>
         <button className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 hover:bg-cyan-900/30 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/30">待废弃</button>
      </div>
    </div>
  );
};