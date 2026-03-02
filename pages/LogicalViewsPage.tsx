import React from 'react';
import { Layers } from 'lucide-react';
import { LogicalViewPanel } from '../components/standards/apply/LogicalViewPanel';

export const LogicalViewsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Layers className="text-cyan-400" /> 逻辑视图落标 <span className="text-slate-600">/</span> Logical Views
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               管理数据服务层的逻辑视图定义及其与标准的映射关系。
             </p>
          </div>
       </div>
       <LogicalViewPanel />
    </div>
  );
};