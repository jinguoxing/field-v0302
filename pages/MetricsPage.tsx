import React from 'react';
import { PieChart } from 'lucide-react';
import { MetricPanel } from '../components/standards/apply/MetricPanel';

export const MetricsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <PieChart className="text-emerald-400" /> 指标落标 <span className="text-slate-600">/</span> Metrics
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               统一管理原子指标与派生指标，确保口径一致性与可追溯性。
             </p>
          </div>
       </div>
       <MetricPanel />
    </div>
  );
};