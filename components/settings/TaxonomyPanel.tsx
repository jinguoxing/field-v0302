import React from 'react';
import { Plus, MoreHorizontal, Folder, FolderOpen, Layers } from 'lucide-react';
import { TAXONOMY_TREE } from '../../constants';

export const TaxonomyPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden animate-in fade-in">
       <div className="p-6 border-b border-slate-700 bg-slate-900/30 flex justify-between items-center">
          <div>
             <h2 className="text-lg font-bold text-white">分类体系 (Taxonomy)</h2>
             <p className="text-xs text-slate-400 mt-1">定义数据资产的域、主题与业务线层级结构。</p>
          </div>
          <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-2">
             <Plus size={14} /> 新增域
          </button>
       </div>

       <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
             {TAXONOMY_TREE.map(node => (
                <div key={node.id} className="border border-slate-700 rounded-xl bg-slate-800/50 overflow-hidden">
                   <div className="p-4 flex items-center justify-between bg-slate-800 hover:bg-slate-700/50 transition-colors group">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <FolderOpen size={18} />
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                               <h3 className="text-sm font-bold text-slate-200">{node.name}</h3>
                               <span className="text-[10px] bg-slate-900 px-1.5 rounded text-slate-500 font-mono border border-slate-700">{node.code}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Owner: {node.owner}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-600"><Plus size={14} /></button>
                         <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-600"><MoreHorizontal size={14} /></button>
                      </div>
                   </div>
                   
                   {/* Children */}
                   {node.children && node.children.length > 0 && (
                      <div className="border-t border-slate-700/50 bg-slate-900/20 p-2 space-y-1">
                         {node.children.map(child => (
                            <div key={child.id} className="flex items-center justify-between p-2 pl-4 rounded-lg hover:bg-slate-700/30 group/child ml-8 border-l border-slate-700">
                               <div className="flex items-center gap-3">
                                  <Layers size={14} className="text-slate-500" />
                                  <span className="text-sm text-slate-300">{child.name}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{child.code}</span>
                               </div>
                               <span className="text-xs text-slate-500 mr-4 opacity-0 group-hover/child:opacity-100 transition-opacity">Owner: {child.owner}</span>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};