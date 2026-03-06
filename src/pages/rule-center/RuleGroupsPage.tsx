
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Search, Filter, Plus, MoreHorizontal, ShieldCheck, CheckCircle2, Clock, AlertCircle, BarChart3, Activity, FileText } from 'lucide-react';

export const RuleGroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const groups = [
    { id: 'G-001', name: '财务审批上位规则群', type: '上位规则群', status: '生效中', lastUpdate: '2024-03-21', count: '12' },
    { id: 'G-002', name: '差旅报销区间覆盖群', type: '区间覆盖', status: '生效中', lastUpdate: '2024-03-20', count: '8' },
    { id: 'G-003', name: '采购合同合规性群', type: '上位规则群', status: '待优化', lastUpdate: '2024-03-19', count: '15' },
    { id: 'G-004', name: '供应商准入资质群', type: '区间覆盖', status: '生效中', lastUpdate: '2024-03-18', count: '10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Layers className="text-indigo-400" size={28} />
            规则群
          </h1>
          <p className="text-slate-400 mt-1">管理上位规则群与区间覆盖规则，确保规则的层次与覆盖完整性</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-900/20">
          <Plus size={18} />
          新建规则群
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="搜索规则群名称、ID或类型..."
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
              <th className="px-6 py-4 font-semibold">规则群 ID</th>
              <th className="px-6 py-4 font-semibold">规则群名称</th>
              <th className="px-6 py-4 font-semibold">类型</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">包含规则数</th>
              <th className="px-6 py-4 font-semibold">最后更新</th>
              <th className="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {groups.map((group) => (
              <tr 
                key={group.id} 
                onClick={() => navigate(`/rule-center/groups/${group.id}`)}
                className="hover:bg-slate-700/20 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 text-sm font-mono text-cyan-400/80">{group.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-200">{group.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{group.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[11px] font-medium ${group.status === '生效中' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {group.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{group.count}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{group.lastUpdate}</td>
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
