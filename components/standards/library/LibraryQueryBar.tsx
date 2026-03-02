import React from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles, LayoutList, LayoutGrid, ChevronDown, SortAsc } from 'lucide-react';

interface LibraryQueryBarProps {
  viewMode: 'list' | 'card';
  setViewMode: (mode: 'list' | 'card') => void;
}

export const LibraryQueryBar: React.FC<LibraryQueryBarProps> = ({ viewMode, setViewMode }) => {
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
               className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-slate-200 placeholder:text-slate-500 transition-all shadow-inner outline-none"
               placeholder="语义搜索 (e.g. '用户的唯一标识')"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 cursor-pointer hover:bg-indigo-500/20">
                  <Sparkles size={10} className="mr-1" /> Semantic
               </span>
            </div>
         </div>

         {/* View Toggle */}
         <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button 
               onClick={() => setViewMode('list')}
               className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
               <LayoutList size={16} />
            </button>
            <button 
               onClick={() => setViewMode('card')}
               className={`p-1.5 rounded-md transition-all ${viewMode === 'card' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
               <LayoutGrid size={16} />
            </button>
         </div>
      </div>
      
      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
         {/* Filter Dropdowns */}
         <div className="flex gap-2">
            {['Domain', 'Status', 'Owner', 'Tag', 'Version'].map(filter => (
               <div key={filter} className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-colors">
                     {filter}
                     <ChevronDown size={12} className="text-slate-500 group-hover:text-slate-300" />
                  </button>
               </div>
            ))}
         </div>

         <div className="h-4 w-px bg-slate-700 mx-2"></div>

         {/* Sort */}
         <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-colors">
            <SortAsc size={14} className="text-slate-500" />
            Sort by: Updated
         </button>

         {/* Active Chips (Mock) */}
         <div className="flex items-center gap-2 ml-auto">
            <span className="px-2 py-0.5 rounded-full bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 text-[10px] flex items-center gap-1 cursor-pointer hover:bg-cyan-900/50">
               Status: Published <span className="opacity-50 hover:opacity-100">&times;</span>
            </span>
            <button className="text-[10px] text-slate-500 hover:text-red-400 underline">Clear all</button>
         </div>
      </div>
    </div>
  );
};