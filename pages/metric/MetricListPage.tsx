
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Filter, Calculator, MoreVertical, CheckCircle2, 
  AlertTriangle, ShieldCheck, Tag, User, SortAsc, LayoutList, 
  LayoutGrid, ChevronDown, Copy, FileText, AlertOctagon,
  ArrowRight, GitBranch, Layers, Activity, GitMerge, Bot
} from 'lucide-react';
import { METRIC_ASSETS_MOCK, METRIC_VERSIONS_MOCK } from '../../constants';
import { MetricAsset, MetricVersion, MetricComplianceStatus } from '../../types';

export const MetricListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State for Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('All');
  const [filterStatus, setFilterStatus] = useState('Active'); // Active, Deprecated, All
  const [filterCompliance, setFilterCompliance] = useState('All'); // All, Compliant, Warning, NonCompliant
  const [filterOwner, setFilterOwner] = useState('All');
  const [publishedOnly, setPublishedOnly] = useState(true);
  const [sortBy, setSortBy] = useState('Recommended');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  // Derive unique options from data
  const domains = ['All', ...Array.from(new Set(METRIC_ASSETS_MOCK.map(m => m.domain)))];
  const owners = ['All', ...Array.from(new Set(METRIC_ASSETS_MOCK.map(m => m.owner)))];

  // Filter Logic
  const filteredMetrics = useMemo(() => {
    return METRIC_ASSETS_MOCK.filter(metric => {
      const latestVersion = METRIC_VERSIONS_MOCK.find(v => v.id === metric.latestVersionId);
      
      // Keyword Search
      const matchesSearch = 
        metric.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        metric.cnName.includes(searchTerm) ||
        metric.code.toLowerCase().includes(searchTerm.toLowerCase());

      // Domain Filter
      const matchesDomain = filterDomain === 'All' || metric.domain === filterDomain;

      // Status Filter
      const matchesStatus = filterStatus === 'All' || metric.status === filterStatus;

      // Compliance Filter
      const matchesCompliance = 
        filterCompliance === 'All' || 
        latestVersion?.compliance === filterCompliance;

      // Owner Filter
      const matchesOwner = filterOwner === 'All' || metric.owner === filterOwner;

      // Published Only
      const matchesPublished = !publishedOnly || (latestVersion?.status === 'Published');

      return matchesSearch && matchesDomain && matchesStatus && matchesCompliance && matchesOwner && matchesPublished;
    }).sort((a, b) => {
        // Mock Sort Logic
        if (sortBy === 'RecentlyUpdated') {
            const vA = METRIC_VERSIONS_MOCK.find(v => v.id === a.latestVersionId);
            const vB = METRIC_VERSIONS_MOCK.find(v => v.id === b.latestVersionId);
            return (vB?.publishedAt || '').localeCompare(vA?.publishedAt || '');
        }
        return 0; // Default
    });
  }, [searchTerm, filterDomain, filterStatus, filterCompliance, filterOwner, publishedOnly, sortBy]);

  // Helper for Badge Rendering
  const ComplianceBadge = ({ status }: { status: MetricComplianceStatus | undefined }) => {
     if (!status) return <span className="text-slate-500 text-xs">-</span>;
     
     const config = {
        'Compliant': { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', text: 'Compliant' },
        'Warning': { icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', text: 'Warning' },
        'NonCompliant': { icon: AlertOctagon, color: 'text-red-400 bg-red-500/10 border-red-500/20', text: 'Non-Compliant' }
     };
     const C = config[status];
     
     return (
        <span className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded border uppercase font-bold w-fit ${C.color} cursor-pointer hover:opacity-80 transition-opacity`}>
           <C.icon size={12} /> {C.text}
        </span>
     );
  };

  const MetricTypeBadge = ({ type }: { type: string }) => {
     const colors: Record<string, string> = {
        'Atomic': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
        'Derivative': 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
        'Composite': 'text-violet-400 border-violet-500/30 bg-violet-500/10'
     };
     return (
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${colors[type] || 'text-slate-400 border-slate-600'}`}>
           {type?.substring(0, 1)}
        </span>
     );
  }

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500">
       
       {/* 1. Header */}
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Calculator className="text-cyan-400" /> 指标中心 (Metric Hub)
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               企业级指标资产的统一定义、版本管理与实现溯源。
             </p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => navigate('/metrics/ask')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2"
             >
                <Bot size={16} /> AI 问指标
             </button>
             <button 
                onClick={() => navigate('/metrics/new')}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(8,145,178,0.4)] border border-cyan-400/20 transition-all flex items-center gap-2"
             >
                <Plus size={16} /> 新建指标
             </button>
          </div>
       </div>

       {/* 2. Toolbar & Advanced Filters */}
       <div className="flex flex-col gap-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
             {/* Search */}
             <div className="flex-1 relative group min-w-[240px]">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-slate-200 placeholder:text-slate-500 transition-all shadow-inner outline-none"
                   placeholder="搜索指标名称、编码或业务含义..."
                />
             </div>

             {/* Filters Group */}
             <div className="flex flex-wrap gap-2 items-center">
                {/* Domain */}
                <div className="relative">
                   <select 
                      value={filterDomain} 
                      onChange={(e) => setFilterDomain(e.target.value)}
                      className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                   >
                      {domains.map(d => <option key={d} value={d}>{d === 'All' ? '所有域' : d}</option>)}
                   </select>
                   <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
                </div>

                {/* Status */}
                <div className="relative">
                   <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                   >
                      <option value="All">所有状态</option>
                      <option value="Active">Active</option>
                      <option value="Deprecated">Deprecated</option>
                   </select>
                   <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
                </div>

                {/* Compliance */}
                <div className="relative">
                   <select 
                      value={filterCompliance} 
                      onChange={(e) => setFilterCompliance(e.target.value)}
                      className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                   >
                      <option value="All">所有合规性</option>
                      <option value="Compliant">Compliant</option>
                      <option value="Warning">Warning</option>
                      <option value="NonCompliant">Non-Compliant</option>
                   </select>
                   <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
                </div>

                {/* Owner */}
                <div className="relative">
                   <select 
                      value={filterOwner} 
                      onChange={(e) => setFilterOwner(e.target.value)}
                      className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                   >
                      {owners.map(o => <option key={o} value={o}>{o === 'All' ? '所有负责人' : o}</option>)}
                   </select>
                   <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
                </div>
             </div>

             <div className="h-6 w-px bg-slate-700 mx-2"></div>

             {/* Sort */}
             <div className="relative">
                <select 
                   value={sortBy} 
                   onChange={(e) => setSortBy(e.target.value)}
                   className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs rounded-lg pl-8 pr-8 py-2 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                >
                   <option value="Recommended">智能推荐</option>
                   <option value="RecentlyPublished">最近发布</option>
                   <option value="MostUsed">引用最多</option>
                   <option value="RecentlyUpdated">最近更新</option>
                </select>
                <SortAsc size={12} className="absolute left-2.5 top-2.5 text-slate-500 pointer-events-none" />
                <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
             </div>

             {/* View Toggle */}
             <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 ml-auto">
                <button 
                   onClick={() => setViewMode('list')}
                   className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   <LayoutList size={16} />
                </button>
                <button 
                   onClick={() => setViewMode('card')}
                   className={`p-1.5 rounded-md transition-all ${viewMode === 'card' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   <LayoutGrid size={16} />
                </button>
             </div>
          </div>
          
          {/* Active Filters Summary */}
          <div className="flex items-center gap-3 text-xs">
             <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input 
                   type="checkbox" 
                   checked={publishedOnly} 
                   onChange={(e) => setPublishedOnly(e.target.checked)}
                   className="rounded bg-slate-900 border-slate-600 text-cyan-500 focus:ring-offset-slate-900" 
                />
                仅显示已发布 (Published Only)
             </label>
             <span className="text-slate-500">|</span>
             <span className="text-slate-500">
                Found <span className="text-white font-bold">{filteredMetrics.length}</span> metrics
             </span>
          </div>
       </div>

       {/* 3. Content Area */}
       <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg overflow-hidden flex flex-col min-h-0 relative">
          
          {filteredMetrics.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                <div className="p-4 bg-slate-900 rounded-full border border-slate-700">
                   <Search size={32} className="opacity-20" />
                </div>
                <p className="text-sm">未找到符合条件的指标</p>
                <div className="flex gap-3">
                   <button className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                      <Bot size={12} /> AI 辅助创建
                   </button>
                   <button className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                      <LayoutList size={12} /> 从标准库导入
                   </button>
                </div>
             </div>
          ) : viewMode === 'list' ? (
             <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                   <thead className="bg-slate-900/90 text-xs font-semibold text-slate-500 uppercase sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                      <tr>
                         <th className="px-6 py-4 border-b border-slate-700 w-1/4">指标名称 (Name)</th>
                         <th className="px-4 py-4 border-b border-slate-700">域 (Domain)</th>
                         <th className="px-4 py-4 border-b border-slate-700">类型 (Type)</th>
                         <th className="px-4 py-4 border-b border-slate-700">版本 (Ver)</th>
                         <th className="px-4 py-4 border-b border-slate-700">标准绑定 (Std)</th>
                         <th className="px-4 py-4 border-b border-slate-700">合规 (Status)</th>
                         <th className="px-4 py-4 border-b border-slate-700">责任人 (Owner)</th>
                         <th className="px-4 py-4 border-b border-slate-700">最近发布 (Published)</th>
                         <th className="px-6 py-4 border-b border-slate-700 text-right">操作</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/50">
                      {filteredMetrics.map(metric => {
                         const latestVersion = METRIC_VERSIONS_MOCK.find(v => v.id === metric.latestVersionId);
                         const versionType = latestVersion?.definition.metricType || 'Atomic';
                         
                         return (
                            <tr 
                              key={metric.id} 
                              className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                              onClick={() => navigate(`/metrics/${metric.id}`)}
                            >
                               <td className="px-6 py-4">
                                  <div className="flex items-start gap-3">
                                     <div className="mt-1 p-1.5 rounded bg-slate-800 border border-slate-700 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
                                        <Calculator size={16} />
                                     </div>
                                     <div>
                                        <div className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors text-sm">{metric.cnName}</div>
                                        <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                                           {metric.code}
                                           {metric.tags.map(t => (
                                              <span key={t} className="bg-slate-800 px-1 rounded text-[9px] text-slate-400 border border-slate-700">{t}</span>
                                           ))}
                                        </div>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-4 py-4">
                                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs border border-slate-700 whitespace-nowrap">
                                     {metric.domain}
                                  </span>
                               </td>
                               <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                     <MetricTypeBadge type={versionType} />
                                     <span className="text-xs text-slate-400">{versionType}</span>
                                  </div>
                               </td>
                               <td className="px-4 py-4">
                                  {latestVersion ? (
                                     <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                                           {latestVersion.versionNo}
                                        </span>
                                        {latestVersion.status === 'Published' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                                     </div>
                                  ) : <span className="text-slate-500 text-xs">-</span>}
                               </td>
                               <td className="px-4 py-4">
                                  {latestVersion?.standardBinding ? (
                                     <span className="text-xs text-indigo-400 hover:text-white transition-colors bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1 w-fit">
                                        <ShieldCheck size={10} /> {latestVersion.standardBinding.standardVersion}
                                     </span>
                                  ) : (
                                     <span className="text-xs text-slate-500 italic">未绑定</span>
                                  )}
                               </td>
                               <td className="px-4 py-4">
                                  <ComplianceBadge status={latestVersion?.compliance} />
                               </td>
                               <td className="px-4 py-4">
                                  <div className="flex items-center gap-2 text-xs text-slate-400">
                                     <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] border border-slate-600">
                                        {metric.owner.charAt(0)}
                                     </div>
                                     <span className="truncate max-w-[80px]">{metric.owner}</span>
                                  </div>
                               </td>
                               <td className="px-4 py-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                                  {latestVersion?.publishedAt || latestVersion?.createdAt || '-'}
                               </td>
                               <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Copy Link">
                                        <Copy size={14} />
                                     </button>
                                     <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="More">
                                        <MoreVertical size={14} />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          ) : (
             // Card View (Optional Implementation as per toggle)
             <div className="overflow-auto flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredMetrics.map(metric => {
                   const latestVersion = METRIC_VERSIONS_MOCK.find(v => v.id === metric.latestVersionId);
                   return (
                      <div 
                        key={metric.id} 
                        className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/30 transition-all cursor-pointer group flex flex-col"
                        onClick={() => navigate(`/metrics/${metric.id}`)}
                      >
                         <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-slate-900 rounded-lg text-cyan-400 border border-slate-700">
                               <Calculator size={20} />
                            </div>
                            <ComplianceBadge status={latestVersion?.compliance} />
                         </div>
                         <h3 className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors mb-1">{metric.cnName}</h3>
                         <div className="text-xs text-slate-500 font-mono mb-3">{metric.code}</div>
                         <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1">{metric.description}</p>
                         <div className="pt-3 border-t border-slate-700 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                               <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-300">
                                  {metric.owner.charAt(0)}
                               </div>
                               <span className="text-slate-400">{metric.owner}</span>
                            </div>
                            <span className="font-mono text-slate-500">{latestVersion?.versionNo}</span>
                         </div>
                      </div>
                   )
                })}
             </div>
          )}
       </div>
    </div>
  );
};
