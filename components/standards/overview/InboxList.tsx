import React from 'react';
import { CheckSquare, Users, GitMerge, Bot } from 'lucide-react';

const TaskItem = ({ type, title, time, user, urgent }: any) => {
   let icon = <CheckSquare size={14} className="text-slate-400" />;
   let bg = "bg-slate-800";
   
   if (type === 'approval') {
      icon = <Users size={14} className="text-blue-400" />;
      bg = "bg-blue-500/10 border-blue-500/20";
   } else if (type === 'conflict') {
      icon = <GitMerge size={14} className="text-amber-400" />;
      bg = "bg-amber-500/10 border-amber-500/20";
   } else if (type === 'mapping') {
      icon = <Bot size={14} className="text-indigo-400" />;
      bg = "bg-indigo-500/10 border-indigo-500/20";
   }

   return (
      <div className={`p-3 rounded-lg border ${bg} flex items-start gap-3 cursor-pointer hover:shadow-md transition-shadow`}>
         <div className="mt-0.5">{icon}</div>
         <div className="flex-1">
            <div className="flex justify-between items-start">
               <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{title}</h4>
               {urgent && <span className="text-[9px] bg-red-500 text-white px-1 rounded ml-2 whitespace-nowrap">紧急</span>}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 flex justify-between">
               <span>来自: {user}</span>
               <span>{time}</span>
            </p>
         </div>
      </div>
   );
};

export const InboxList: React.FC = () => {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 shadow-sm">
       <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
             <CheckSquare size={16} className="text-blue-400" /> 我的待办 (Inbox)
          </h3>
          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">5</span>
       </div>
       <div className="space-y-3">
          <TaskItem 
             type="approval" 
             title="发布申请：客户状态码表" 
             time="2小时前" 
             user="张三"
          />
          <TaskItem 
             type="conflict" 
             title="冲突裁决：User_ID vs UID" 
             time="4小时前" 
             user="System"
             urgent
          />
          <TaskItem 
             type="mapping" 
             title="确认映射：t_order.c_id -> CustID" 
             time="昨天" 
             user="AI Bot"
          />
          <button className="w-full py-2 mt-2 text-xs text-slate-400 border border-slate-700 border-dashed rounded hover:bg-slate-800 hover:text-slate-200 transition-colors">
             查看更多已办
          </button>
       </div>
    </div>
  );
};