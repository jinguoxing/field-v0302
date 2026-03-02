import React from 'react';
import { GitCommit } from 'lucide-react';
import { VersionHistoryPanel } from '../components/standards/collab/VersionHistoryPanel';

export const CollabHistoryPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <GitCommit className="text-cyan-400" /> 变更记录 <span className="text-slate-600">/</span> Version History
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               全量标准版本的发布时间轴与回滚管理。
             </p>
          </div>
       </div>
       <VersionHistoryPanel />
    </div>
  );
};