import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Check, X, ArrowRight, User } from 'lucide-react';
import { CollabTask } from '../../../types';
import { REVIEW_DETAIL_MOCK } from '../../../constants';

interface ReviewDetailPanelProps {
  task: CollabTask;
}

export const ReviewDetailPanel: React.FC<ReviewDetailPanelProps> = ({ task }) => {
  // In a real app, fetch details based on task.id
  const details = REVIEW_DETAIL_MOCK; 

  return (
    <div className="flex flex-col h-full">
       {/* Header */}
       <div className="p-6 border-b border-slate-700 bg-slate-900/30">
          <div className="flex justify-between items-start mb-4">
             <div>
                <h2 className="text-xl font-bold text-white mb-2">{task.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                   <span className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                      <User size={12} /> {task.requester}
                   </span>
                   <span>Created: {task.createTime}</span>
                   <span className="font-mono text-slate-500">ID: {task.id}</span>
                </div>
             </div>
             <div className="flex gap-2">
                <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded text-xs font-bold flex items-center gap-2 transition-colors">
                   <X size={14} /> 拒绝 (Reject)
                </button>
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-colors">
                   <Check size={14} /> 批准 (Approve)
                </button>
             </div>
          </div>
          <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded border border-slate-700/50">
             {details.description}
          </p>
       </div>

       <div className="flex-1 overflow-auto p-6 space-y-6">
          
          {/* Diff Viewer */}
          <div>
             <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                变更对比 (Diff)
             </h3>
             <div className="border border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-900/80 text-xs font-bold text-slate-500 uppercase">
                      <tr>
                         <th className="px-4 py-2 w-1/4">字段</th>
                         <th className="px-4 py-2 w-1/3 text-red-400">变更前 (Before)</th>
                         <th className="px-4 py-2 w-1/3 text-emerald-400">变更后 (After)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/50 bg-slate-800/20">
                      {details.diffs.map((diff, i) => (
                         <tr key={i} className="hover:bg-slate-700/30">
                            <td className="px-4 py-3 font-medium text-slate-300">{diff.field}</td>
                            <td className="px-4 py-3 text-red-300/70 font-mono text-xs break-all bg-red-900/5">{diff.oldValue}</td>
                            <td className="px-4 py-3 text-emerald-300/90 font-mono text-xs break-all bg-emerald-900/5 font-bold">{diff.newValue}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Voting & Comments */}
          <div className="grid grid-cols-3 gap-6">
             {/* Voting */}
             <div className="col-span-1 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">当前投票</h4>
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2 text-emerald-400">
                      <ThumbsUp size={16} /> <span className="font-bold">{details.votes.approve}</span> 赞成
                   </div>
                   <div className="h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[100%]"></div>
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-red-400">
                      <ThumbsDown size={16} /> <span className="font-bold">{details.votes.reject}</span> 反对
                   </div>
                   <div className="h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[0%]"></div>
                   </div>
                </div>
             </div>

             {/* Comments */}
             <div className="col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                   <span>讨论 ({details.comments.length})</span>
                   <button className="text-indigo-400 hover:text-white flex items-center gap-1 text-[10px]">
                      <MessageSquare size={10} /> 添加评论
                   </button>
                </h4>
                <div className="space-y-3">
                   {details.comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                         <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-bold border border-slate-600">
                            {comment.user.charAt(0)}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                               <span className="text-xs font-bold text-slate-300">{comment.user}</span>
                               <span className="text-[10px] text-slate-500">{comment.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-700/50">
                               {comment.content}
                            </p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};