import React, { useState } from 'react';
import { Database, Search, Filter, AlertTriangle, CheckCircle2, MoreHorizontal, Link as LinkIcon, Shield } from 'lucide-react';
import { LOGICAL_VIEWS_MOCK } from '../../../constants';
import { LogicalView } from '../../../types';

export const LogicalViewPanel: React.FC = () => {
  const [selectedView, setSelectedView] = useState<LogicalView>(LOGICAL_VIEWS_MOCK[0]);

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar List */}
      <div className="w-72 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-lg backdrop-blur-sm">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
           <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Database size={14} className="text-cyan-400" /> 逻辑视图列表
           </h3>
           <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
              <input type="text" placeholder="搜索视图..." className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
           {LOGICAL_VIEWS_MOCK.map(view => (
              <div 
                key={view.id} 
                onClick={() => setSelectedView(view)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${selectedView.id === view.id ? 'bg-cyan-900/20 border-cyan-500/30 shadow-md' : 'hover:bg-slate-700/50 border-transparent text-slate-400'}`}
              >
                 <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-bold ${selectedView.id === view.id ? 'text-cyan-400' : 'text-slate-200'}`}>{view.cnName}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${view.complianceScore >= 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                       {view.complianceScore}%
                    </span>
                 </div>
                 <div className="text-xs text-slate-500 font-mono truncate">{view.name}</div>
                 <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">{view.domain}</span>
                    <span>{view.mappedCount}/{view.fieldCount} 已落标</span>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-lg backdrop-blur-sm">
         {/* View Header */}
         <div className="p-6 border-b border-slate-700 bg-slate-900/30 flex justify-between items-start">
            <div>
               <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">{selectedView.cnName}</h2>
                  <span className="text-sm font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{selectedView.name}</span>
               </div>
               <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                  <span>所属域: <span className="text-slate-200">{selectedView.domain}</span></span>
                  <span>字段数: <span className="text-slate-200">{selectedView.fieldCount}</span></span>
                  <span>映射率: <span className="text-emerald-400 font-mono">{Math.round((selectedView.mappedCount / selectedView.fieldCount) * 100)}%</span></span>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 bg-slate-700 text-slate-300 hover:text-white rounded text-xs font-medium transition-colors">批量自动绑定</button>
               <button className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-500 rounded text-xs font-medium transition-colors">发布视图</button>
            </div>
         </div>

         {/* Field Table */}
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-900/50 sticky top-0 z-10 text-slate-500 text-xs font-bold uppercase">
                  <tr>
                     <th className="px-6 py-3 border-b border-slate-700">字段名称</th>
                     <th className="px-6 py-3 border-b border-slate-700">数据类型</th>
                     <th className="px-6 py-3 border-b border-slate-700">绑定标准 (数据元/术语)</th>
                     <th className="px-6 py-3 border-b border-slate-700">码表 / 规则</th>
                     <th className="px-6 py-3 border-b border-slate-700">合规状态</th>
                     <th className="px-6 py-3 border-b border-slate-700 text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-700/50">
                  {selectedView.fields.map(field => (
                     <tr key={field.id} className="hover:bg-slate-700/30 group">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-200">{field.cnName}</div>
                           <div className="text-xs text-slate-500 font-mono">{field.name}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{field.type}</td>
                        <td className="px-6 py-4">
                           {field.boundStandard ? (
                              <div className="flex items-center gap-2 text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20 w-fit cursor-pointer hover:bg-cyan-900/30 transition-colors">
                                 <LinkIcon size={12} />
                                 <span className="font-mono text-xs">{field.boundStandard.name}</span>
                              </div>
                           ) : (
                              <button className="text-xs text-slate-500 hover:text-indigo-400 border border-slate-600 border-dashed px-2 py-1 rounded hover:border-indigo-500 transition-colors">
                                 + 绑定标准
                              </button>
                           )}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1">
                              {field.boundCodeTable && (
                                 <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 w-fit">
                                    {field.boundCodeTable}
                                 </span>
                              )}
                              {field.boundRules?.map(rule => (
                                 <span key={rule} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 w-fit">
                                    <Shield size={8} className="inline mr-1 text-emerald-500" />
                                    {rule}
                                 </span>
                              ))}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           {field.complianceStatus === 'passed' ? (
                              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                                 <CheckCircle2 size={14} /> 通过
                              </span>
                           ) : field.complianceStatus === 'failed' ? (
                              <span className="flex items-center gap-1.5 text-xs text-red-400">
                                 <AlertTriangle size={14} /> 违规
                              </span>
                           ) : (
                              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                 豁免
                              </span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors">
                              <MoreHorizontal size={16} />
                           </button>
                        </td>
                     </tr>
                  ))}
                  {selectedView.fields.length === 0 && (
                     <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                           该视图暂无字段定义，请先同步物理表结构或手动添加。
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};