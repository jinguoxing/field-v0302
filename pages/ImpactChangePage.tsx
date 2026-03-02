import React from 'react';
import { GitPullRequest } from 'lucide-react';
import { ChangeImpactPanel } from '../components/standards/impact/ChangeImpactPanel';

export const ImpactChangePage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <GitPullRequest className="text-red-400" /> 变更影响分析 <span className="text-slate-600">/</span> Change Impact
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               评估标准版本变更对下游资产、API及报表的潜在影响范围与风险。
             </p>
          </div>
       </div>
       <ChangeImpactPanel />
    </div>
  );
};