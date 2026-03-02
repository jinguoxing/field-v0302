import React from 'react';
import { EVALUATION_METRICS_MOCK } from '../../../../constants';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const EvaluationMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
       {EVALUATION_METRICS_MOCK.map((metric, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 shadow-sm">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{metric.label}</p>
             <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white font-mono">{metric.value}</span>
                <span className={`text-xs font-medium flex items-center gap-1 px-2 py-0.5 rounded ${metric.trendDir === 'up' ? 'text-emerald-400 bg-emerald-900/20' : 'text-red-400 bg-red-900/20'}`}>
                   {metric.trendDir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                   {metric.trend}
                </span>
             </div>
          </div>
       ))}
    </div>
  );
};