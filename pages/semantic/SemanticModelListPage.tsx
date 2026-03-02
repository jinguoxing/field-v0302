
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertTriangle, TableProperties } from 'lucide-react';
import { useAsync, mockApi, SemanticStatus } from '../../lib/semantic';

const Badge = ({ status }: { status: SemanticStatus }) => {
  const statusConfig: Record<SemanticStatus, { label: string; color: string }> = {
    'SCANNED': { label: '已扫描', color: 'bg-slate-700 text-slate-400 border-slate-600' },
    'PENDING_UNDERSTANDING': { label: '待理解', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'UNDERSTANDING_RUNNING': { label: '理解中...', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse' },
    'NEED_DECISION': { label: '待裁决', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    'SEMANTIC_CONFIRMED': { label: '已确认', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    'OBJECT_CANDIDATES_READY': { label: '候选就绪', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
    'PUBLISHED_PREVIEW': { label: '预览发布', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    'PUBLISHED_FORMAL': { label: '正式发布', color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 font-bold' },
  };
  const cfg = statusConfig[status] || { label: status, color: 'bg-slate-700' };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

export const SemanticModelListPage: React.FC = () => {
  const navigate = useNavigate();
  const { value: views, isLoading } = useAsync(mockApi.getLogicalViews);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
             <TableProperties className="text-indigo-400" /> 语义模型资产
          </h1>
          <p className="text-slate-400 text-sm mt-1">管理逻辑视图的语义理解、对象映射与发布状态。</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 transition font-medium text-sm">
          全局驾驶舱
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="搜索表名、描述..." 
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm" 
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 text-sm transition-colors">
          <Filter className="w-4 h-4" /> 状态筛选
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">逻辑视图名称</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">语义状态</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">待办任务</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">置信度</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">风险</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">发布层级</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {isLoading ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">加载中...</td></tr>
            ) : views?.map((view) => (
              <tr 
                key={view.id} 
                onClick={() => navigate(`/semantic-models/${view.id}`)}
                className="hover:bg-slate-700/30 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
                        <TableProperties className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{view.name}</div>
                      <div className="text-xs text-slate-500">{view.datasource} · {view.field_total} fields</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><Badge status={view.semantic_status} /></td>
                <td className="px-6 py-4">
                  {view.pending_tasks > 0 ? (
                    <span className="inline-flex items-center gap-1 text-amber-400 font-medium text-sm animate-pulse">
                      <AlertTriangle className="w-4 h-4" /> {view.pending_tasks}
                    </span>
                  ) : <span className="text-slate-600">-</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${view.avg_confidence * 100}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block font-mono">{(view.avg_confidence * 100).toFixed(0)}%</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${view.risk_level === 'HIGH' ? 'bg-red-500/10 text-red-400 border-red-500/20' : view.risk_level === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                    {view.risk_level}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {view.publish_level === 'NONE' || !view.publish_level ? <span className="text-slate-600 text-xs">未发布</span> : 
                   <span className="text-xs font-bold text-indigo-400 bg-indigo-900/20 px-2 py-0.5 rounded border border-indigo-500/20">{view.publish_level}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
