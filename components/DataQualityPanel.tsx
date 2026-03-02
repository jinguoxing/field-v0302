import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, AlertOctagon, BarChart3, ChevronRight, Play, TrendingUp, Filter, Download, ArrowUpRight, Calendar } from 'lucide-react';
import { QUALITY_OVERVIEW_MOCK, QUALITY_RULES_MOCK } from '../constants';
import { QualityRule } from '../types';

export const DataQualityPanel: React.FC = () => {
  const { score, dimensions, scannedRows, failedRows, lastScan } = QUALITY_OVERVIEW_MOCK;

  // Mock data for trend chart
  const trendData = [82, 83, 81, 85, 84, 86, 87];
  
  // Mock data for top issues
  const topIssues = [
    { type: '有效性', count: 85, color: 'bg-red-500', text: 'text-red-400' },
    { type: '完整性', count: 24, color: 'bg-amber-500', text: 'text-amber-400' },
    { type: '一致性', count: 12, color: 'bg-blue-500', text: 'text-blue-400' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Health Score Card */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-cyan-500/20 transition-colors"></div>
          <div className="z-10 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Activity size={12} /> 健康评分
              </h3>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold font-mono ${score >= 90 ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : score >= 80 ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'text-amber-400'}`}>
                  {score}
                </span>
                <span className="text-sm text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900/50 py-1.5 px-3 rounded-lg border border-slate-700 w-fit">
               <Clock size={12} className="text-slate-500" />
               上次: {lastScan.split(' ')[0]}
            </div>
          </div>
          <div className="w-24 h-24 rounded-full border-8 border-slate-700 flex items-center justify-center relative bg-slate-900 shadow-inner">
             <svg className="absolute w-full h-full transform -rotate-90">
               <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
               <circle cx="48" cy="48" r="40" stroke={score >= 90 ? '#34d399' : score >= 80 ? '#22d3ee' : '#fbbf24'} strokeWidth="8" fill="transparent" strokeDasharray={`${score * 2.51} 251`} strokeLinecap="round" className="drop-shadow-[0_0_5px_currentColor]" />
             </svg>
             <div className={`text-2xl font-bold ${score >= 80 ? 'text-cyan-400' : 'text-amber-400'}`}>A</div>
          </div>
        </div>

        {/* 2. Quality Trend Chart (New) */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg relative overflow-hidden flex flex-col">
           <div className="flex justify-between items-start mb-4 relative z-10">
             <div>
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">7日趋势</h3>
               <p className="text-xs text-slate-400">过去一周的质量评分</p>
             </div>
             <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
               <TrendingUp size={12} /> +2.4%
             </div>
           </div>
           
           <div className="flex-1 flex items-end justify-between gap-2 h-24 pt-2">
              {trendData.map((val, idx) => {
                 const height = ((val - 70) / 30) * 100; // Normalize for visuals
                 return (
                   <div key={idx} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                      <div className="w-full relative h-full flex items-end bg-slate-700/30 rounded-t-sm overflow-hidden">
                        <div 
                          className="w-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-all duration-300 relative"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{val}</span>
                   </div>
                 )
              })}
           </div>
        </div>

        {/* 3. Scan Statistics & Issues */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full"></div>
           
           <div>
             <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider relative z-10">扫描概览</h3>
             <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                   <p className="text-[10px] text-slate-500 mb-1">扫描行数</p>
                   <p className="text-lg font-mono font-medium text-white">{scannedRows.toLocaleString()}</p>
                </div>
                <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                   <p className="text-[10px] text-red-400 mb-1">失败行数</p>
                   <p className="text-lg font-mono font-medium text-red-400">{failedRows.toLocaleString()}</p>
                </div>
             </div>
           </div>

           <div>
              <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">主要问题</p>
              <div className="flex flex-col gap-2">
                {topIssues.map((issue, idx) => (
                  <div key={idx} className="flex items-center text-xs justify-between">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${issue.color}`}></div>
                        <span className="text-slate-300">{issue.type}</span>
                     </div>
                     <span className={`font-mono ${issue.text}`}>{issue.count}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Row 2: Dimensions Breakdown */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">质量维度</h3>
             <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
               查看报告 <ArrowUpRight size={12} />
             </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
            <DimensionBar label="完整性" value={dimensions.completeness} color="bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <DimensionBar label="有效性" value={dimensions.validity} color="bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            <DimensionBar label="一致性" value={dimensions.consistency} color="bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <DimensionBar label="唯一性" value={dimensions.uniqueness} color="bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <DimensionBar label="及时性" value={dimensions.timeliness} color="bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <DimensionBar label="准确性" value={dimensions.accuracy} color="bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          </div>
      </div>

      {/* Row 3: Rules Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden flex-1 flex flex-col">
         <div className="px-6 py-4 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 bg-slate-900/30">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-400">
               <AlertOctagon size={18} />
             </div>
             <div>
                <h3 className="font-bold text-slate-200 text-sm">规则执行详情</h3>
                <p className="text-xs text-slate-500 mt-0.5">发现 {QUALITY_RULES_MOCK.length} 条活跃规则</p>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 p-1">
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="筛选">
                  <Filter size={14} />
                </button>
                <div className="w-px h-4 bg-slate-700 mx-1"></div>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="导出">
                  <Download size={14} />
                </button>
             </div>
             <button className="text-xs flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white border border-cyan-500/30 rounded-lg hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all font-medium">
               <Play size={12} className="fill-current" /> 运行扫描
             </button>
           </div>
         </div>
         
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead>
               <tr className="border-b border-slate-700 bg-slate-900/50">
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">规则名称</th>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">字段</th>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">维度</th>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">优先级</th>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">通过率</th>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">失败数</th>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">状态</th>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-700">
               {QUALITY_RULES_MOCK.map((rule) => (
                 <tr key={rule.id} className="hover:bg-slate-700/40 transition-colors group">
                   <td className="px-6 py-4">
                     <div className="font-medium text-slate-300 text-sm group-hover:text-white transition-colors">{rule.name}</div>
                   </td>
                   <td className="px-6 py-4">
                     <code className="text-xs bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400 font-mono">{rule.column}</code>
                   </td>
                   <td className="px-6 py-4">
                     <span className="text-xs text-slate-500">{rule.type}</span>
                   </td>
                   <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${rule.priority === 'High' ? 'text-red-400' : rule.priority === 'Medium' ? 'text-amber-400' : 'text-blue-400'}`}>
                        {rule.priority}
                      </span>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                       <div className="w-16 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                         <div 
                           className={`h-full rounded-full ${rule.passRate === 100 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : rule.passRate > 90 ? 'bg-cyan-500' : 'bg-red-500'}`}
                           style={{ width: `${rule.passRate}%` }}
                         ></div>
                       </div>
                       <span className="text-xs text-slate-400 font-mono">{rule.passRate}%</span>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <span className={`text-sm font-mono ${rule.failedRows > 0 ? 'text-red-400 font-medium' : 'text-slate-600'}`}>
                       {rule.failedRows}
                     </span>
                   </td>
                   <td className="px-6 py-4">
                     <RuleStatusBadge status={rule.status} />
                   </td>
                   <td className="px-6 py-4 text-right">
                      <button className="text-cyan-500 hover:text-cyan-300 text-xs font-medium flex items-center justify-end gap-1 ml-auto transition-colors">
                        详情 <ChevronRight size={12} />
                      </button>
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

const DimensionBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-slate-500 w-24 font-medium truncate" title={label}>{label}</span>
    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }}></div>
    </div>
    <span className="text-xs font-mono font-medium text-slate-300 w-8 text-right">{value}%</span>
  </div>
);

const RuleStatusBadge = ({ status }: { status: QualityRule['status'] }) => {
  if (status === 'pass') return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle size={10} /> 通过
    </span>
  );
  if (status === 'fail') return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
      <AlertOctagon size={10} /> 失败
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <AlertTriangle size={10} /> 警告
    </span>
  );
};