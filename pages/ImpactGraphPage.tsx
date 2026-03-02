import React from 'react';
import { Network } from 'lucide-react';
import { DependencyGraphPanel } from '../components/standards/impact/DependencyGraphPanel';

export const ImpactGraphPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Network className="text-cyan-400" /> 依赖图谱 <span className="text-slate-600">/</span> Dependency Graph
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               全景可视化标准与业务对象、逻辑视图及指标间的血缘依赖关系。
             </p>
          </div>
       </div>
       <DependencyGraphPanel />
    </div>
  );
};