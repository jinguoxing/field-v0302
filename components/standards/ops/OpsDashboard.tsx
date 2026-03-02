import React, { useState } from 'react';
import { Layers, ShieldCheck, Zap, Recycle, ArrowUpRight, ArrowDownRight, TrendingUp, Filter, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Brain } from 'lucide-react';
import { OPS_OVERVIEW_MOCK, GOVERNANCE_PRIORITIES_MOCK, REUSE_STATS_MOCK } from '../../../constants';

// --- Sub-components ---

const KpiCard = ({ label, value, subtext, trend, trendDir, icon, color }: any) => {
   const colors: any = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
   };
   
   return (
      <div className={`p-5 rounded-xl border ${colors[color]} backdrop-blur-sm shadow-lg flex flex-col justify-between h-32`}>
         <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
            <div className={`p-2 rounded-lg bg-slate-900/30`}>{icon}</div>
         </div>
         <div>
            <div className="text-3xl font-bold font-mono">{value}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-medium">
               {trendDir === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
               <span>{trend}%</span>
               <span className="opacity-50 ml-1">{subtext}</span>
            </div>
         </div>
      </div>
   );
};

const PriorityItem: React.FC<{ item: any, index: number }> = ({ item, index }) => (
   <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg flex items-start gap-3 hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-700 mt-0.5 font-mono">
         {index + 1}
      </div>
      <div className="flex-1 min-w-0">
         <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-bold text-slate-200 truncate pr-2 group-hover:text-indigo-300 transition-colors">{item.title}</h4>
            <span className="text-xs font-bold text-indigo-400 font-mono bg-indigo-900/20 px-1.5 py-0.5 rounded border border-indigo-500/20">
               {item.roiScore} ROI
            </span>
         </div>
         <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">{item.domain}</span>
            <p className="text-xs text-slate-500 truncate">{item.reason}</p>
         </div>
         <button className="text-xs flex items-center gap-1 text-indigo-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
            执行: {item.action} <ArrowRight size={12} />
         </button>
      </div>
   </div>
);

const ReuseRow: React.FC<{ item: any, rank: number }> = ({ item, rank }) => (
   <div className="flex items-center justify-between text-xs py-2 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 px-2 rounded transition-colors">
      <div className="flex items-center gap-3">
         <span className={`font-mono w-4 text-center ${rank <= 3 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{rank}</span>
         <div>
            <div className="font-medium text-slate-300">{item.name}</div>
            <div className="text-[10px] text-slate-500">{item.type}</div>
         </div>
      </div>
      <div className="font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
         {item.count}
      </div>
   </div>
);

// --- Main Component ---

export const OpsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coverage' | 'compliance' | 'adoption'>('coverage');

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
       {/* Top KPIs */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard 
             label="标准覆盖率" 
             value={`${OPS_OVERVIEW_MOCK.coverage.field}%`} 
             subtext="vs 上周" 
             trend={OPS_OVERVIEW_MOCK.coverage.trend} 
             trendDir="up" 
             icon={<Layers size={20} />} 
             color="blue" 
          />
          <KpiCard 
             label="合规通过率" 
             value={`${OPS_OVERVIEW_MOCK.compliance.rulePassRate}%`} 
             subtext="vs 上周" 
             trend={OPS_OVERVIEW_MOCK.compliance.trend} 
             trendDir="up" 
             icon={<ShieldCheck size={20} />} 
             color="emerald" 
          />
          <KpiCard 
             label="AI 采纳率" 
             value={`${OPS_OVERVIEW_MOCK.adoption.rate}%`} 
             subtext="持续优化中" 
             trend={OPS_OVERVIEW_MOCK.adoption.trend} 
             trendDir="up" 
             icon={<Zap size={20} />} 
             color="violet" 
          />
          <KpiCard 
             label="平均复用度" 
             value={OPS_OVERVIEW_MOCK.reuse.avgRefCount} 
             subtext="引用/标准" 
             trend={0.2} 
             trendDir="up" 
             icon={<Recycle size={20} />} 
             color="amber" 
          />
       </div>

       <div className="grid grid-cols-12 gap-6 min-h-0 flex-1">
          {/* Main Chart Area (Left 8) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
             
             {/* Middle Charts */}
             <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-sm min-h-[300px]">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex gap-4">
                      <button 
                        onClick={() => setActiveTab('coverage')}
                        className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'coverage' ? 'text-blue-400 border-blue-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                      >
                         覆盖率分析
                      </button>
                      <button 
                        onClick={() => setActiveTab('compliance')}
                        className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'compliance' ? 'text-emerald-400 border-emerald-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                      >
                         合规性趋势
                      </button>
                      <button 
                        onClick={() => setActiveTab('adoption')}
                        className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'adoption' ? 'text-violet-400 border-violet-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                      >
                         AI 采纳漏斗
                      </button>
                   </div>
                   <button className="text-slate-500 hover:text-white"><Filter size={16} /></button>
                </div>

                {/* Chart Content Area (Mock Visuals) */}
                <div className="h-64 w-full flex items-end justify-between gap-8 px-4">
                   {activeTab === 'coverage' && (
                      <>
                         <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                            <div className="w-16 bg-blue-500/20 border border-blue-500/50 rounded-t h-[68%] relative group">
                               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-300 opacity-0 group-hover:opacity-100">68%</div>
                            </div>
                            <span className="text-xs text-slate-400">字段级</span>
                         </div>
                         <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                            <div className="w-16 bg-blue-500/20 border border-blue-500/50 rounded-t h-[82%] relative group">
                               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-300 opacity-0 group-hover:opacity-100">82%</div>
                            </div>
                            <span className="text-xs text-slate-400">对象级</span>
                         </div>
                         <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                            <div className="w-16 bg-blue-500/20 border border-blue-500/50 rounded-t h-[75%] relative group">
                               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-300 opacity-0 group-hover:opacity-100">75%</div>
                            </div>
                            <span className="text-xs text-slate-400">指标级</span>
                         </div>
                         <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                            <div className="w-16 bg-blue-500/20 border border-blue-500/50 rounded-t h-[45%] relative group">
                               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-300 opacity-0 group-hover:opacity-100">45%</div>
                            </div>
                            <span className="text-xs text-slate-400">API</span>
                         </div>
                      </>
                   )}

                   {activeTab === 'compliance' && (
                      <div className="w-full flex items-center justify-around h-full">
                         {/* Circle Chart Mock */}
                         <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                               <circle cx="50%" cy="50%" r="70" stroke="#1e293b" strokeWidth="12" fill="none" />
                               <circle cx="50%" cy="50%" r="70" stroke="#34d399" strokeWidth="12" fill="none" strokeDasharray="400 440" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                               <span className="text-3xl font-bold text-white">94%</span>
                               <span className="text-xs text-slate-500">规则通过</span>
                            </div>
                         </div>
                         <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                               <circle cx="50%" cy="50%" r="70" stroke="#1e293b" strokeWidth="12" fill="none" />
                               <circle cx="50%" cy="50%" r="70" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="20 440" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                               <span className="text-3xl font-bold text-white">4%</span>
                               <span className="text-xs text-slate-500">豁免率</span>
                            </div>
                         </div>
                      </div>
                   )}

                   {activeTab === 'adoption' && (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                         {OPS_OVERVIEW_MOCK.adoption.funnel.map((step, i) => (
                            <div key={i} className="w-full flex items-center justify-center">
                               <div 
                                 className="h-12 bg-violet-600/20 border border-violet-500/30 rounded flex items-center justify-between px-4 text-sm text-violet-200"
                                 style={{ width: `${100 - (i * 20)}%` }}
                               >
                                  <span>{step.stage}</span>
                                  <div className="flex gap-4">
                                     <span className="font-bold">{step.count}</span>
                                     <span className="text-xs opacity-70 bg-violet-900 px-1 rounded">{step.rate}%</span>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             </div>

             {/* Bottom Left: Reuse Stats */}
             <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-sm flex-1">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Recycle size={16} className="text-amber-400" /> 复用红黑榜
                   </h3>
                   <div className="flex bg-slate-900 rounded p-0.5">
                      <button className="px-3 py-1 text-xs bg-slate-700 text-white rounded shadow-sm">Top 5 热门</button>
                      <button className="px-3 py-1 text-xs text-slate-500 hover:text-slate-300">沉睡标准</button>
                   </div>
                </div>
                <div className="space-y-1">
                   {REUSE_STATS_MOCK.topUsed.map((item, i) => (
                      <ReuseRow key={i} item={item} rank={i + 1} />
                   ))}
                </div>
             </div>

          </div>

          {/* Right Sidebar: AI Priority (4) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
             
             {/* AI List Header */}
             <div className="bg-gradient-to-br from-indigo-900/80 to-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden flex-1 flex flex-col">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                   <Brain size={120} className="text-indigo-400" />
                </div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles size={18} className="text-indigo-400" /> 
                      下周治理建议
                   </h3>
                   <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-indigo-500/20">AI Generated</span>
                </div>
                
                <p className="text-xs text-indigo-200/80 mb-6 relative z-10 leading-relaxed">
                   基于 <span className="font-bold text-white">使用热度 × 风险等级 × 影响范围</span> 综合计算，优先解决以下高收益问题。
                </p>

                <div className="space-y-3 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                   {GOVERNANCE_PRIORITIES_MOCK.map((item, i) => (
                      <PriorityItem key={item.id} item={item} index={i} />
                   ))}
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-500/20 relative z-10">
                   <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> 一键生成工单
                   </button>
                </div>
             </div>

             {/* Secondary Card: Clean-up Suggestions */}
             <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                   <AlertTriangle size={16} className="text-slate-400" />
                   <h4 className="text-sm font-bold text-slate-300">废弃建议</h4>
                </div>
                <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-200 font-bold">Old_Category_Code</span>
                      <span className="text-[10px] text-red-400 bg-red-900/20 px-1.5 rounded">320天无引用</span>
                   </div>
                   <p className="text-[10px] text-slate-500">建议与 `Category_Enum` 合并或直接废弃。</p>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};
