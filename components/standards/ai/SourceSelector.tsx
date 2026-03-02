import React from 'react';
import { Database, FileText, Upload, Check } from 'lucide-react';
import { DATA_SOURCES } from '../../../constants';

export const SourceSelector: React.FC = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col h-full shadow-lg backdrop-blur-sm overflow-hidden">
       {/* Header */}
       <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
             <div className="w-1.5 h-4 bg-cyan-500 rounded-full"></div>
             1. 输入源选择
          </h3>
          <p className="text-xs text-slate-500 mt-1">选择AI分析的数据范围</p>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Section 1: Databases */}
          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Database size={12} /> 结构化数据
             </h4>
             <div className="space-y-2">
                {DATA_SOURCES.slice(0, 3).map(ds => (
                   <label key={ds.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 cursor-pointer transition-colors group">
                      <div className="relative flex items-center justify-center">
                         <input type="checkbox" className="peer w-4 h-4 appearance-none rounded border border-slate-500 checked:bg-cyan-500 checked:border-cyan-500 transition-colors" defaultChecked={ds.id === 'ds1'} />
                         <Check size={10} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      <div className="flex-1">
                         <div className="text-sm font-medium text-slate-300 group-hover:text-white">{ds.name}</div>
                         <div className="text-[10px] text-slate-500">{ds.type} • {ds.tableCount} tables</div>
                      </div>
                   </label>
                ))}
             </div>
          </div>

          {/* Section 2: Documents */}
          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText size={12} /> 非结构化文档
             </h4>
             <div className="border border-dashed border-slate-600 rounded-lg p-4 text-center hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan-900/30 group-hover:text-cyan-400 transition-colors">
                   <Upload size={18} />
                </div>
                <p className="text-xs text-slate-400 mb-1">拖拽或点击上传</p>
                <p className="text-[10px] text-slate-600">支持 PDF, Word, Excel (Max 50MB)</p>
             </div>
             
             {/* Uploaded Files Mock */}
             <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 p-2 bg-slate-800 rounded border border-slate-700">
                   <FileText size={14} className="text-indigo-400" />
                   <span className="text-xs text-slate-300 truncate flex-1">产品需求文档_v2.0.pdf</span>
                   <button className="text-slate-500 hover:text-red-400"><span className="sr-only">Delete</span>&times;</button>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};