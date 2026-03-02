import React from 'react';
import { Book, Plus, Search, Ban, ArrowRight, CaseSensitive } from 'lucide-react';
import { DICTIONARY_ENTRIES } from '../../constants';

export const DictionaryPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden animate-in fade-in">
       <div className="p-6 border-b border-slate-700 bg-slate-900/30 flex justify-between items-center">
          <div>
             <h2 className="text-lg font-bold text-white">命名词典 (Glossary)</h2>
             <p className="text-xs text-slate-400 mt-1">管理标准缩写、同义词库与禁用词根。</p>
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2 text-slate-500" />
                <input type="text" placeholder="搜索词条..." className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" />
             </div>
             <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-2">
                <Plus size={14} /> 添加词条
             </button>
          </div>
       </div>

       <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-900/50 text-slate-500 text-xs font-bold uppercase sticky top-0 z-10">
                <tr>
                   <th className="px-6 py-4">词条 (Term)</th>
                   <th className="px-6 py-4">类型</th>
                   <th className="px-6 py-4">对应值 / 建议</th>
                   <th className="px-6 py-4">状态</th>
                   <th className="px-6 py-4 text-right">操作</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-700/50">
                {DICTIONARY_ENTRIES.map(entry => (
                   <tr key={entry.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-200">{entry.term}</td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            entry.type === 'Forbidden' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                            entry.type === 'Abbreviation' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                         }`}>
                            {entry.type === 'Forbidden' && <Ban size={10} />}
                            {entry.type === 'Abbreviation' && <CaseSensitive size={10} />}
                            {entry.type}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                         {entry.type === 'Forbidden' ? (
                            <div className="flex items-center gap-2 text-xs">
                               <span className="text-red-400 line-through">{entry.term}</span>
                               <ArrowRight size={12} className="text-slate-500" />
                               <span className="text-emerald-400 font-bold">{entry.replacement}</span>
                            </div>
                         ) : (
                            <span className="font-mono text-cyan-400 bg-slate-900 px-1.5 rounded">{entry.abbreviation}</span>
                         )}
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-[10px] text-emerald-400 bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-500/20">{entry.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-xs text-slate-400 hover:text-white underline">编辑</button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};