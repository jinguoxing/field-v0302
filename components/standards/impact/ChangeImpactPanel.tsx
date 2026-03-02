import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Box, FileText, Database, Layers, GitPullRequest, Info, CheckCircle2 } from 'lucide-react';
import { IMPACT_ANALYSIS_MOCK } from '../../../constants';
import { AffectedAsset } from '../../../types';

export const ChangeImpactPanel: React.FC = () => {
  const [analysis, setAnalysis] = useState(IMPACT_ANALYSIS_MOCK);

  return (
    <div className="flex flex-col h-full gap-6">
       
       {/* 1. Selector & Summary */}
       <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between items-start mb-6">
             <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                   <GitPullRequest className="text-indigo-400" /> 变更模拟
                </h2>
                <div className="flex items-center gap-4 text-sm">
                   <select className="bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-slate-200 outline-none focus:border-indigo-500">
                      <option>Standard: Customer_Status_Enum (v1.0 → v1.1)</option>
                      <option>Standard: Order_Type (v2.1 → v2.2)</option>
                   </select>
                   <span className="text-slate-500 text-xs">{analysis.description}</span>
                </div>
             </div>
             <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors">
                重新分析
             </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
             <SummaryCard label="影响资产总数" value={analysis.summary.total} icon={<Layers size={18} />} color="blue" />
             <SummaryCard label="高风险项" value={analysis.summary.highRisk} icon={<AlertTriangle size={18} />} color="red" />
             <SummaryCard label="涉及 API" value={analysis.summary.apis} icon={<Box size={18} />} color="amber" />
             <SummaryCard label="涉及报表" value={analysis.summary.reports} icon={<FileText size={18} />} color="emerald" />
          </div>
       </div>

       {/* 2. Recommendation */}
       <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 flex gap-4 items-start">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 mt-1">
             <Info size={20} />
          </div>
          <div>
             <h3 className="text-sm font-bold text-indigo-200 mb-1">变更策略建议</h3>
             <p className="text-sm text-slate-300 leading-relaxed">{analysis.recommendation}</p>
          </div>
       </div>

       {/* 3. Detailed Impact List */}
       <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-lg backdrop-blur-sm">
          <div className="p-4 border-b border-slate-700 bg-slate-900/50">
             <h3 className="text-sm font-bold text-slate-200">影响明细 (Impact Details)</h3>
          </div>
          <div className="flex-1 overflow-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-500 text-xs font-bold uppercase sticky top-0 z-10">
                   <tr>
                      <th className="px-6 py-3">资产名称</th>
                      <th className="px-6 py-3">类型</th>
                      <th className="px-6 py-3">风险等级</th>
                      <th className="px-6 py-3">责任团队</th>
                      <th className="px-6 py-3">具体影响</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                   {analysis.affectedAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-700/30">
                         <td className="px-6 py-4 font-bold text-slate-200">{asset.name}</td>
                         <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-400">
                               {getAssetIcon(asset.type)} {asset.type}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${asset.riskLevel === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : asset.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                               {asset.riskLevel}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-slate-400 text-xs">{asset.owner}</td>
                         <td className="px-6 py-4 text-slate-300 text-xs max-w-md truncate" title={asset.impactDescription}>{asset.impactDescription}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, color }: any) => {
   const colors: any = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      red: 'bg-red-500/10 text-red-400 border-red-500/20',
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
   };
   return (
      <div className={`p-4 rounded-lg border ${colors[color]} flex items-center justify-between`}>
         <div>
            <p className="text-[10px] opacity-70 uppercase font-bold mb-1">{label}</p>
            <p className="text-2xl font-mono font-bold">{value}</p>
         </div>
         <div className="opacity-80">{icon}</div>
      </div>
   );
};

const getAssetIcon = (type: string) => {
   switch (type) {
      case 'Table': return <Database size={12} />;
      case 'API': return <Box size={12} />;
      case 'Report': return <FileText size={12} />;
      case 'Metric': return <Layers size={12} />;
      default: return <Database size={12} />;
   }
};