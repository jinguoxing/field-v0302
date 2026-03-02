import React from 'react';
import { BarChart3 } from 'lucide-react';
import { EvaluationMetrics } from '../components/standards/ai/evaluation/EvaluationMetrics';
import { RegressionTable } from '../components/standards/ai/evaluation/RegressionTable';

export const AIEvaluationPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 animate-in fade-in duration-500">
       
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <BarChart3 className="text-violet-400" /> 评测与回归 <span className="text-slate-600">/</span> Evaluation
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               持续监控 AI 治理引擎的性能指标与准确率。
             </p>
          </div>
       </div>

       <EvaluationMetrics />
       <RegressionTable />
    </div>
  );
};