import React from 'react';
import { GitCommit, RotateCcw, Calendar, User, Tag, CheckCircle2 } from 'lucide-react';
import { CHANGE_LOG_MOCK } from '../../../constants';

export const VersionHistoryPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full gap-6">
       <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col shadow-lg backdrop-blur-sm flex-1 overflow-hidden">
          <div className="p-5 border-b border-slate-700 bg-slate-900/30">
             <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <GitCommit size={16} className="text-cyan-400" /> 版本发布记录 (Release History)
             </h3>
          </div>

          <div className="flex-1 overflow-auto p-8 relative">
             {/* Timeline Line */}
             <div className="absolute left-9 top-8 bottom-8 w-px bg-slate-700"></div>

             <div className="space-y-8">
                {CHANGE_LOG_MOCK.map((log, idx) => (
                   <div key={log.id} className="relative flex gap-6 group">
                      {/* Node */}
                      <div className={`relative z-10 w-4 h-4 rounded-full border-2 mt-1.5 flex-shrink-0 bg-slate-900 transition-all ${idx === 0 ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] scale-110' : 'border-slate-600 group-hover:border-cyan-500'}`}></div>
                      
                      {/* Content Card */}
                      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-cyan-500/30 transition-all shadow-sm">
                         <div className="flex justify-between items-start mb-3">
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-lg font-bold text-white font-mono">{log.version}</h4>
                                  {log.status === 'Active' ? (
                                     <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                                        <CheckCircle2 size={10} /> Active
                                     </span>
                                  ) : (
                                     <span className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded text-[10px] font-bold uppercase decoration-line-through">
                                        {log.status}
                                     </span>
                                  )}
                               </div>
                               <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span className="flex items-center gap-1"><Calendar size={12} /> {log.date}</span>
                                  <span className="flex items-center gap-1"><User size={12} /> {log.publisher}</span>
                               </div>
                            </div>
                            
                            {log.canRollback && (
                               <button className="px-3 py-1.5 bg-slate-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-transparent rounded text-xs font-medium transition-all flex items-center gap-2 group/btn">
                                  <RotateCcw size={12} className="group-hover/btn:-rotate-180 transition-transform duration-500" /> 
                                  回滚至此版本
                               </button>
                            )}
                         </div>

                         <p className="text-sm text-slate-300 mb-3 leading-relaxed">{log.description}</p>

                         <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-700/50 flex items-center gap-2 text-xs text-slate-400">
                            <Tag size={12} className="text-indigo-400" />
                            <span className="font-bold text-indigo-300">影响范围:</span>
                            {log.impactSummary}
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};