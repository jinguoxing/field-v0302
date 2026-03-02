import React from 'react';
import { Check, X, History } from 'lucide-react';
import { REGRESSION_CASES_MOCK } from '../../../../constants';

export const RegressionTable: React.FC = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg flex-1 flex flex-col min-h-0">
       <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
             <History size={16} className="text-indigo-400" /> 回归测试集 (Regression Replay)
          </h3>
          <div className="flex gap-2">
             <button className="text-xs px-3 py-1.5 bg-slate-800 border border-slate-600 rounded text-slate-300 hover:text-white">导出报告</button>
             <button className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded">运行回归</button>
          </div>
       </div>

       <div className="overflow-auto">
          <table className="w-full text-left">
             <thead className="bg-slate-900/50 text-xs font-bold text-slate-500 uppercase">
                <tr>
                   <th className="px-6 py-3">Case ID</th>
                   <th className="px-6 py-3">输入 (Input)</th>
                   <th className="px-6 py-3">AI 预测 (Output)</th>
                   <th className="px-6 py-3">人工决策 (Truth)</th>
                   <th className="px-6 py-3">结果</th>
                   <th className="px-6 py-3">日期</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-700/50 text-sm">
                {REGRESSION_CASES_MOCK.map(item => (
                   <tr key={item.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-3 font-mono text-slate-500 text-xs">{item.id}</td>
                      <td className="px-6 py-3 text-slate-300">{item.input}</td>
                      <td className="px-6 py-3 font-mono text-cyan-400">{item.aiOutput}</td>
                      <td className="px-6 py-3 font-mono text-emerald-400">{item.humanOutput}</td>
                      <td className="px-6 py-3">
                         {item.result === 'match' ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-bold"><Check size={12} /> Match</span>
                         ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-red-500 font-bold"><X size={12} /> Mismatch</span>
                         )}
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-500">{item.date}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};