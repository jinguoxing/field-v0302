
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertTriangle, TableProperties, ArrowRight, Clock, Activity, AlertOctagon } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { mockApi } from '../api/mockApi';
import { Badge } from '../components/ui/Badge';
import { SemanticStatus, LogicalView } from '../types/domain';

export default function LogicalViewList() {
  const navigate = useNavigate();
  const { value: views, isLoading } = useAsync(mockApi.getLogicalViews);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<SemanticStatus | 'ALL'>('ALL');
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'>('ALL');

  const filteredViews = views?.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.datasource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || v.semantic_status === filterStatus;
    const matchesRisk = filterRisk === 'ALL' || v.risk_level === filterRisk;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getRiskBadge = (level: LogicalView['risk_level']) => {
    const colors = {
      'HIGH': 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-100',
      'MEDIUM': 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100',
      'LOW': 'bg-slate-50 text-slate-600 border-slate-200'
    };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${colors[level]} flex items-center gap-1 w-fit`}>
        {level === 'HIGH' && <AlertOctagon size={10} />}
        {level}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200">
               <TableProperties size={24} />
             </div>
             逻辑视图
          </h1>
          <p className="text-slate-500 text-sm mt-2 ml-1">管理逻辑视图的语义理解、对象映射与发布状态。</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition font-medium text-sm flex items-center gap-2">
          <Filter size={16} /> 打开全局驾驶舱
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="搜索逻辑视图名称、数据源..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all" 
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">所有状态</option>
            <option value="SCANNED">已扫描</option>
            <option value="NEED_DECISION">待裁决 (Action)</option>
            <option value="SEMANTIC_CONFIRMED">已确认</option>
            <option value="PUBLISHED_FORMAL">已发布</option>
          </select>
          
          <select 
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">所有风险等级</option>
            <option value="HIGH">高风险 (High)</option>
            <option value="MEDIUM">中风险 (Medium)</option>
            <option value="LOW">低风险 (Low)</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">逻辑视图</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">当前状态</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">待办任务</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">语义置信度</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">风险等级</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">最近运行</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">发布层级</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={8} className="p-12 text-center text-slate-500">加载数据中...</td></tr>
            ) : filteredViews?.length === 0 ? (
              <tr><td colSpan={8} className="p-12 text-center text-slate-500">未找到匹配的逻辑视图</td></tr>
            ) : filteredViews?.map((view) => (
              <tr 
                key={view.id} 
                onClick={() => navigate(`/semantic-modeling/logical-views/${view.id}`)}
                className="hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{view.name}</div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                       <Database size={10} /> {view.datasource} <span className="text-slate-300">|</span> {view.field_total} Fields
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><Badge status={view.semantic_status} /></td>
                <td className="px-6 py-4">
                  {view.pending_tasks > 0 ? (
                    <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                      <AlertTriangle className="w-3 h-3" /> {view.pending_tasks} Items
                    </span>
                  ) : <span className="text-slate-400 text-xs">-</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 w-24">
                    <div className="flex justify-between text-[10px] text-slate-500">
                       <span>Score</span>
                       <span className="font-mono">{(view.avg_confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${view.avg_confidence > 0.8 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${view.avg_confidence * 100}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getRiskBadge(view.risk_level)}
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock size={12} />
                      <span className="font-mono">{view.last_run_at ? new Date(view.last_run_at).toLocaleDateString() : '-'}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                  {view.publish_level === 'NONE' || !view.publish_level ? (
                    <span className="text-slate-400 text-xs italic">未发布</span> 
                  ) : (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${view.publish_level === 'FORMAL' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                      {view.publish_level}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Database = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
);
