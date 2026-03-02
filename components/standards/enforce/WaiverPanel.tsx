import React from 'react';
import { FileSignature, CheckCircle2, Clock, XCircle, Plus } from 'lucide-react';
import { WAIVER_REQUESTS_MOCK } from '../../../constants';

const StatusBadge = ({ status }: { status: string }) => {
   const styles: Record<string, string> = {
      'Approved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20',
   };
   const icons: Record<string, React.ReactNode> = {
      'Approved': <CheckCircle2 size={12} />,
      'Pending': <Clock size={12} />,
      'Rejected': <XCircle size={12} />,
   };

   return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 w-fit ${styles[status]}`}>
         {icons[status]} {status}
      </span>
   );
};

export const WaiverPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full gap-6">
       <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col shadow-lg backdrop-blur-sm flex-1 overflow-hidden">
          <div className="p-5 border-b border-slate-700 bg-slate-900/30 flex justify-between items-center">
             <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FileSignature size={16} className="text-indigo-400" /> 豁免申请管理
             </h3>
             <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-2">
                <Plus size={14} /> 新增申请
             </button>
          </div>

          <div className="flex-1 overflow-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-500 text-xs font-bold uppercase">
                   <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">申请人</th>
                      <th className="px-6 py-4">豁免对象</th>
                      <th className="px-6 py-4">原因</th>
                      <th className="px-6 py-4">风险等级</th>
                      <th className="px-6 py-4">到期日</th>
                      <th className="px-6 py-4">状态</th>
                      <th className="px-6 py-4 text-right">操作</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                   {WAIVER_REQUESTS_MOCK.map(req => (
                      <tr key={req.id} className="hover:bg-slate-700/30">
                         <td className="px-6 py-4 font-mono text-xs text-slate-500">{req.id}</td>
                         <td className="px-6 py-4 text-slate-300">{req.applicant}</td>
                         <td className="px-6 py-4 text-slate-300 font-medium">{req.target}</td>
                         <td className="px-6 py-4 text-slate-400 text-xs max-w-xs truncate">{req.reason}</td>
                         <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold ${req.riskLevel === 'High' ? 'text-red-400' : req.riskLevel === 'Medium' ? 'text-amber-400' : 'text-blue-400'}`}>
                               {req.riskLevel}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-xs text-slate-400 font-mono">{req.expiryDate}</td>
                         <td className="px-6 py-4">
                            <StatusBadge status={req.status} />
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-xs text-slate-400 hover:text-white underline">详情</button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};