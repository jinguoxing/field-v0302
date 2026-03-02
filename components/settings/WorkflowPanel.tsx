import React from 'react';
import { GitPullRequest, ArrowRight, User, Bot, Plus } from 'lucide-react';
import { APPROVAL_WORKFLOWS } from '../../constants';

export const WorkflowPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden animate-in fade-in">
       <div className="p-6 border-b border-slate-700 bg-slate-900/30 flex justify-between items-center">
          <div>
             <h2 className="text-lg font-bold text-white">审批工作流 (Workflows)</h2>
             <p className="text-xs text-slate-400 mt-1">配置不同标准类型的发布审批链。</p>
          </div>
          <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-2">
             <Plus size={14} /> 新建流程
          </button>
       </div>

       <div className="flex-1 overflow-auto p-6 space-y-6">
          {APPROVAL_WORKFLOWS.map(wf => (
             <div key={wf.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                         <GitPullRequest size={20} />
                      </div>
                      <div>
                         <h3 className="text-sm font-bold text-slate-200">{wf.targetType} Flow</h3>
                         <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${wf.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                            {wf.isActive ? 'Active' : 'Inactive'}
                         </span>
                      </div>
                   </div>
                   <button className="text-xs text-slate-400 hover:text-white underline">编辑配置</button>
                </div>

                {/* Steps Visualization */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                   {wf.steps.map((step, idx) => (
                      <React.Fragment key={step.id}>
                         <div className="flex flex-col items-center gap-2 min-w-[100px]">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${step.type === 'auto' ? 'bg-slate-900 border-slate-600 text-slate-400' : 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300'}`}>
                               {step.type === 'auto' ? <Bot size={18} /> : <User size={18} />}
                            </div>
                            <div className="text-center">
                               <p className="text-xs font-bold text-slate-300">{step.name}</p>
                               <p className="text-[10px] text-slate-500">{step.approverRole}</p>
                            </div>
                         </div>
                         {idx < wf.steps.length - 1 && (
                            <div className="h-px w-8 bg-slate-600 mb-8"></div>
                         )}
                      </React.Fragment>
                   ))}
                   
                   {/* End Node */}
                   <div className="h-px w-8 bg-slate-600 mb-8"></div>
                   <div className="flex flex-col items-center gap-2 mb-8">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                         <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      </div>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};