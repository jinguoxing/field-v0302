import React from 'react';
import { TrendingUp } from 'lucide-react';
import { DriftPanel } from '../components/standards/enforce/DriftPanel';

export const EnforceDriftPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <TrendingUp className="text-amber-400" /> 漂移检测 <span className="text-slate-600">/</span> Data Drift
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               监控数据分布、码表值域与Schema的非预期变更。
             </p>
          </div>
       </div>
       <DriftPanel />
    </div>
  );
};