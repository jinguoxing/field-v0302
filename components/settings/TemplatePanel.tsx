import React from 'react';
import { FileCode, Clock, Edit2 } from 'lucide-react';
import { STANDARD_TEMPLATES } from '../../constants';

export const TemplatePanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden animate-in fade-in">
       <div className="p-6 border-b border-slate-700 bg-slate-900/30 flex justify-between items-center">
          <div>
             <h2 className="text-lg font-bold text-white">标准模板库 (Templates)</h2>
             <p className="text-xs text-slate-400 mt-1">预定义各类数据资产的属性结构与元数据要求。</p>
          </div>
       </div>

       <div className="flex-1 overflow-auto p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {STANDARD_TEMPLATES.map(tpl => (
             <div key={tpl.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-cyan-500/30 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 text-cyan-400">
                         <FileCode size={20} />
                      </div>
                      <div>
                         <h3 className="text-sm font-bold text-slate-200">{tpl.name}</h3>
                         <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 rounded">{tpl.type}</span>
                      </div>
                   </div>
                   <button className="p-2 text-slate-500 hover:text-white bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
                      <Edit2 size={14} />
                   </button>
                </div>
                
                <p className="text-xs text-slate-400 mb-4 h-8 line-clamp-2">{tpl.description}</p>

                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 mb-3">
                   <p className="text-[10px] text-slate-500 uppercase mb-2">包含字段</p>
                   <div className="flex flex-wrap gap-2">
                      {tpl.fields.map(field => (
                         <span key={field} className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700 font-mono">
                            {field}
                         </span>
                      ))}
                   </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                   <Clock size={10} /> 更新于: {tpl.lastUpdated}
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};