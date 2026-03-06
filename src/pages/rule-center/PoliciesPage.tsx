
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, Plus, MoreHorizontal, ShieldCheck, CheckCircle2, Clock, AlertCircle, BarChart3, Activity, Link as LinkIcon } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const navigate = useNavigate();
  const policies = [
    { id: 'P-001', name: '集团财务管理制度 v2.0', type: '财务制度', status: '生效中', lastUpdate: '2024-03-21', links: '12' },
    { id: 'P-002', name: '员工差旅管理办法', type: '行政制度', status: '生效中', lastUpdate: '2024-03-20', links: '8' },
    { id: 'P-003', name: '采购招标管理规定', type: '采购制度', status: '待修订', lastUpdate: '2024-03-19', links: '15' },
    { id: 'P-004', name: '供应商准入管理细则', type: '准入制度', status: '生效中', lastUpdate: '2024-03-18', links: '10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="text-blue-400" size={28} />
            制度文件
          </h1>
          <p className="text-slate-400 mt-1">管理制度库文件及其关联的业务规则，确保制度与执行的一致性</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-900/20">
          <Plus size={18} />
          上传制度
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="搜索制度名称、ID或类型..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
              <Filter size={16} />
              筛选
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/30 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">制度 ID</th>
              <th className="px-6 py-4 font-semibold">制度名称</th>
              <th className="px-6 py-4 font-semibold">类型</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">关联规则数</th>
              <th className="px-6 py-4 font-semibold">最后更新</th>
              <th className="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {policies.map((policy) => (
              <tr 
                key={policy.id} 
                onClick={() => navigate(`/rule-center/policies/${policy.id}`)}
                className="hover:bg-slate-700/20 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 text-sm font-mono text-cyan-400/80">{policy.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-200">{policy.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{policy.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[11px] font-medium ${policy.status === '生效中' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {policy.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <LinkIcon size={14} />
                    <span className="text-sm">{policy.links}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{policy.lastUpdate}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 text-slate-500 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
