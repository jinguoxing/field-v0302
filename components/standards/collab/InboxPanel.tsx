import React, { useState } from 'react';
import { CheckSquare, Filter, Clock, AlertTriangle, Users, Bot, Search, ChevronRight } from 'lucide-react';
import { COLLAB_TASKS_MOCK } from '../../../constants';
import { CollabTask } from '../../../types';
import { ReviewDetailPanel } from './ReviewDetailPanel';

const TaskIcon = ({ type }: { type: string }) => {
   switch (type) {
      case 'approval': return <Users size={16} className="text-blue-400" />;
      case 'mapping': return <Bot size={16} className="text-indigo-400" />;
      case 'conflict': return <AlertTriangle size={16} className="text-amber-400" />;
      default: return <CheckSquare size={16} className="text-slate-400" />;
   }
};

const PriorityBadge = ({ priority }: { priority: string }) => {
   const colors: any = {
      'High': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Medium': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'Low': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
   };
   return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors[priority]} font-bold uppercase`}>
         {priority}
      </span>
   );
};

export const InboxPanel: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<CollabTask | null>(COLLAB_TASKS_MOCK[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTasks = COLLAB_TASKS_MOCK.filter(t => filterType === 'all' || t.type === filterType);

  return (
    <div className="flex h-full gap-6">
       {/* Task List (Sidebar) */}
       <div className="w-80 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-lg backdrop-blur-sm flex-shrink-0">
          <div className="p-4 border-b border-slate-700 bg-slate-900/50">
             <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                   <CheckSquare size={16} className="text-emerald-400" /> 待办事项
                </h3>
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">{filteredTasks.length}</span>
             </div>
             
             {/* Filter Tabs */}
             <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 mb-2">
                {['all', 'approval', 'mapping', 'conflict'].map(type => (
                   <button 
                     key={type}
                     onClick={() => setFilterType(type)}
                     className={`flex-1 py-1 text-[10px] font-medium rounded transition-colors ${filterType === type ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                      {type === 'all' ? '全部' : type === 'approval' ? '审批' : type === 'mapping' ? '映射' : '冲突'}
                   </button>
                ))}
             </div>

             <div className="relative">
                <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500" />
                <input type="text" placeholder="搜索任务..." className="w-full pl-7 pr-3 py-1.5 bg-slate-800 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50" />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {filteredTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border group relative ${selectedTask?.id === task.id ? 'bg-slate-700 border-emerald-500/50 shadow-md' : 'hover:bg-slate-700/50 border-transparent bg-slate-800/30'}`}
                >
                   {/* Left Border Indicator */}
                   {selectedTask?.id === task.id && <div className="absolute left-0 top-3 bottom-3 w-1 bg-emerald-500 rounded-r"></div>}
                   
                   <div className="flex justify-between items-start mb-1 pl-2">
                      <span className="text-xs font-bold text-slate-200 line-clamp-1">{task.title}</span>
                      {selectedTask?.id === task.id && <ChevronRight size={14} className="text-emerald-400" />}
                   </div>
                   
                   <div className="pl-2">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="p-1 rounded bg-slate-900 border border-slate-700">
                            <TaskIcon type={task.type} />
                         </div>
                         <span className="text-[10px] text-slate-400 truncate">{task.targetName}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                         <PriorityBadge priority={task.priority} />
                         <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock size={10} /> {task.createTime}
                         </span>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Detail View */}
       <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm flex flex-col min-w-0">
          {selectedTask ? (
             <ReviewDetailPanel task={selectedTask} />
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <CheckSquare size={48} className="opacity-20 mb-4" />
                <p>选择一个任务开始处理</p>
             </div>
          )}
       </div>
    </div>
  );
};