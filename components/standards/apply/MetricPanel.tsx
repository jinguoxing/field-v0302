import React from 'react';
import { BarChart3, Star, Globe, Shield, Activity, GitCommit, ArrowRight } from 'lucide-react';
import { METRICS_MOCK } from '../../../constants';
import { Metric } from '../../../types';

export const MetricPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full gap-6">
       {/* Metrics List (Simplified for prototype) */}
       <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col shadow-lg backdrop-blur-sm flex-1 overflow-hidden">
          <div className="p-5 border-b border-slate-700 bg-slate-900/30 flex justify-between items-center">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="text-emerald-400" /> 指标管理 (Metrics)
             </h2>
             <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded text-xs font-medium hover:text-white">导出定义</button>
             </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6 grid grid-cols-1 gap-6">
             {METRICS_MOCK.map(metric => (
                <div key={metric.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-emerald-500/30 transition-colors group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                         <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-emerald-400 group-hover:scale-105 transition-transform shadow-inner">
                            <Activity size={24} />
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-lg font-bold text-slate-100">{metric.cnName}</h3>
                               {metric.isNorthStar && (
                                  <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                                     <Star size={10} fill="currentColor" /> 北极星指标
                                  </span>
                               )}
                               {metric.isPublic && (
                                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                                     <Globe size={10} /> 对外披露
                                  </span>
                               )}
                            </div>
                            <div className="text-xs font-mono text-slate-500 mb-2">{metric.name}</div>
                            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">{metric.definition}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider inline-block mb-2 ${metric.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                            {metric.status}
                         </div>
                         <div className="text-xs text-slate-500">Owner: {metric.owner}</div>
                      </div>
                   </div>

                   {/* Technical Definition */}
                   <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 mb-4">
                      <div className="flex items-center gap-6 text-xs text-slate-400 mb-3 border-b border-slate-700/50 pb-2">
                         <span className="flex items-center gap-1"><span className="text-slate-500">周期:</span> <span className="text-slate-200">{metric.period}</span></span>
                         <span className="flex items-center gap-1"><span className="text-slate-500">维度:</span> <span className="text-slate-200">{metric.dimensions.join(', ')}</span></span>
                      </div>
                      <div className="font-mono text-xs text-indigo-300 bg-slate-900 p-2 rounded border border-slate-700">
                         {metric.expression}
                      </div>
                   </div>

                   {/* Lineage / Actions */}
                   <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                         <GitCommit size={14} />
                         <span>字段溯源: </span>
                         <span className="text-slate-400 underline decoration-slate-600 cursor-pointer hover:text-emerald-400">t_order.amount</span>
                         <ArrowRight size={10} />
                         <span className="text-slate-400 underline decoration-slate-600 cursor-pointer hover:text-emerald-400">std:Transaction_Amt</span>
                      </div>
                      <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
                         查看影响分析 <ArrowRight size={12} />
                      </button>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};