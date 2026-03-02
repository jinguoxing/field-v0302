import React from 'react';
import { Search, Key, Hash, Type, AlertCircle, Check } from 'lucide-react';
import { ALIGNMENT_TASKS_MOCK } from '../../../../constants';
import { AlignmentTask } from '../../../../types';

interface FieldListPanelProps {
  selectedTaskId: string;
  onSelectTask: (task: AlignmentTask) => void;
}

export const FieldListPanel: React.FC<FieldListPanelProps> = ({ selectedTaskId, onSelectTask }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col h-full overflow-hidden shadow-lg backdrop-blur-sm">
       <div className="p-3 border-b border-slate-700 bg-slate-900/50 flex items-center gap-2">
          <div className="relative flex-1">
             <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
             <input type="text" placeholder="搜索字段..." className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" />
          </div>
       </div>

       <div className="flex-1 overflow-y-auto">
          {ALIGNMENT_TASKS_MOCK.map(task => {
             const isSelected = selectedTaskId === task.id;
             const hasMatch = task.candidates.some(c => c.confidence > 80);
             
             return (
                <div 
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className={`p-3 border-b border-slate-700/50 cursor-pointer transition-colors group ${isSelected ? 'bg-cyan-900/20 border-l-2 border-l-cyan-500' : 'hover:bg-slate-800 border-l-2 border-l-transparent'}`}
                >
                   <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                         {task.fieldName}
                      </div>
                      {task.status === 'mapped' ? (
                         <Check size={14} className="text-emerald-500" />
                      ) : hasMatch ? (
                         <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      ) : (
                         <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                      )}
                   </div>
                   <div className="text-xs text-slate-500 mb-2">{task.fieldComment}</div>
                   
                   <div className="flex gap-2">
                      <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-400 font-mono">VARCHAR</span>
                      {hasMatch && (
                         <span className="px-1.5 py-0.5 bg-cyan-900/30 border border-cyan-500/20 text-cyan-400 rounded text-[10px]">AI 命中</span>
                      )}
                   </div>
                </div>
             )
          })}
       </div>
    </div>
  );
};