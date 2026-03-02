import React from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export const AIRecommendations: React.FC = () => {
  const recommendations = [
    { id: 1, title: '合并重复术语 "User_ID"', impact: 'High', type: 'Deduplication' },
    { id: 2, title: '补全 "Trade_Amount" 业务定义', impact: 'Medium', type: 'Enrichment' },
    { id: 3, title: '修复 "Phone" 字段脱敏规则', impact: 'High', type: 'Compliance' },
    { id: 4, title: '建立 "Order" 与 "Payment" 的关联', impact: 'Low', type: 'Relation' },
    { id: 5, title: '废弃低频引用指标 "Old_GMV"', impact: 'Medium', type: 'Cleanup' },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800 border border-indigo-500/20 rounded-xl p-5 shadow-sm">
       <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-indigo-100 flex items-center gap-2">
             <Sparkles size={16} className="text-indigo-400" /> AI 治理建议 (Top 10)
          </h3>
          <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-lg shadow-indigo-500/20">AI Generated</span>
       </div>
       <div className="space-y-3">
          {recommendations.map(rec => (
             <div key={rec.id} className="bg-slate-900/50 p-3 rounded-lg border border-indigo-500/10 hover:border-indigo-500/30 transition-colors cursor-pointer group flex items-center justify-between">
                <div>
                   <div className="text-xs text-slate-200 font-medium mb-0.5 group-hover:text-indigo-300 transition-colors">{rec.title}</div>
                   <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 rounded border ${rec.impact === 'High' ? 'text-red-300 border-red-500/20 bg-red-500/10' : rec.impact === 'Medium' ? 'text-amber-300 border-amber-500/20 bg-amber-500/10' : 'text-blue-300 border-blue-500/20 bg-blue-500/10'}`}>
                         {rec.impact} Impact
                      </span>
                      <span className="text-[9px] text-slate-500">{rec.type}</span>
                   </div>
                </div>
                <button className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600 hover:text-white">
                   <Zap size={12} />
                </button>
             </div>
          ))}
       </div>
       <button className="w-full mt-4 py-2 text-xs text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg transition-colors flex items-center justify-center gap-1">
          查看全部建议 <ArrowRight size={12} />
       </button>
    </div>
  );
};