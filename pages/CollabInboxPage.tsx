import React from 'react';
import { CheckSquare } from 'lucide-react';
import { InboxPanel } from '../components/standards/collab/InboxPanel';

export const CollabInboxPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <CheckSquare className="text-emerald-400" /> 协作待办 <span className="text-slate-600">/</span> Inbox & Reviews
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               集中处理审批、映射确认与冲突裁决任务。
             </p>
          </div>
       </div>
       <InboxPanel />
    </div>
  );
};