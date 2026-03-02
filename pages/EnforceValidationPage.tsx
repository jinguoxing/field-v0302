import React from 'react';
import { PlaySquare } from 'lucide-react';
import { ValidationPanel } from '../components/standards/enforce/ValidationPanel';

export const EnforceValidationPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <PlaySquare className="text-emerald-400" /> 校验执行 <span className="text-slate-600">/</span> Validation Runs
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               查看周期性或触发式的标准校验任务结果与修复建议。
             </p>
          </div>
       </div>
       <ValidationPanel />
    </div>
  );
};