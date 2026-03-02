import React from 'react';
import { BarChart2 } from 'lucide-react';
import { OpsDashboard } from '../components/standards/ops/OpsDashboard';

export const OpsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <BarChart2 className="text-violet-400" /> 运营度量 <span className="text-slate-600">/</span> Operations Measurement
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               量化标准建设成果，AI 驱动治理决策与效能提升。
             </p>
          </div>
       </div>
       <OpsDashboard />
    </div>
  );
};