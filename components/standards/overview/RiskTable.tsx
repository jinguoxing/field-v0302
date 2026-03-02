import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const RiskRow = ({ asset, riskType, severity, owner }: any) => (
  <tr className="hover:bg-slate-700/30 transition-colors group cursor-pointer border-b border-slate-700/50 last:border-0">
     <td className="px-5 py-3 font-mono text-slate-300 group-hover:text-cyan-400 transition-colors text-xs">{asset}</td>
     <td className="px-5 py-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-400">
           {riskType}
        </span>
     </td>
     <td className="px-5 py-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${severity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
           {severity === 'High' && <ShieldAlert size={10} />}
           {severity}
        </span>
     </td>
     <td className="px-5 py-3 text-slate-400 text-xs">{owner}</td>
     <td className="px-5 py-3 text-right">
        <button className="text-xs text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 px-3 py-1 rounded transition-colors">Fix</button>
     </td>
  </tr>
);

export const RiskTable: React.FC = () => {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col">
       <div className="px-5 py-3 border-b border-slate-700 flex justify-between items-center bg-slate-900/30">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
             <AlertTriangle size={16} className="text-amber-400" /> 重点风险资产 (Top Risks)
          </h3>
          <button className="text-xs text-cyan-400 hover:text-cyan-300">查看全部</button>
       </div>
       <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-900/50 text-slate-500 text-xs uppercase font-medium">
                <tr>
                   <th className="px-5 py-3">资产 (Asset)</th>
                   <th className="px-5 py-3">风险类型 (Risk Type)</th>
                   <th className="px-5 py-3">严重程度 (Severity)</th>
                   <th className="px-5 py-3">责任人 (Owner)</th>
                   <th className="px-5 py-3 text-right">操作 (Action)</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-700/50">
                <RiskRow asset="t_scm_orders" riskType="标准未映射" severity="High" owner="W. Chen" />
                <RiskRow asset="t_crm_leads_v2" riskType="枚举值漂移" severity="Medium" owner="S. Li" />
                <RiskRow asset="api_user_profile" riskType="命名规范违规" severity="High" owner="J. Doe" />
                <RiskRow asset="rpt_finance_q3" riskType="指标口径冲突" severity="Medium" owner="M. Wang" />
                <RiskRow asset="m_active_users" riskType="计算逻辑变更" severity="High" owner="Admin" />
             </tbody>
          </table>
       </div>
    </div>
  );
};