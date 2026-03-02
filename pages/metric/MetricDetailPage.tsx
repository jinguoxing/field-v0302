
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, GitBranch, CheckCircle2, AlertTriangle, Database, Activity, 
  Code, Layers, History, ShieldCheck, Edit3, Share2, Play, GitCommit, 
  FileText, LayoutTemplate, Network, Box, MoreVertical, User, 
  Calendar, Copy, BarChart3, Globe, Sparkles, X, ChevronRight,
  ArrowRightLeft, FileJson, Search, AlertOctagon, TrendingUp, Binary,
  Shield, Check
} from 'lucide-react';
import { METRIC_ASSETS_MOCK, METRIC_VERSIONS_MOCK, STANDARD_ITEMS_MOCK } from '../../constants';
import { MetricAsset, MetricVersion } from '../../types';

// --- Local Types & Mocks extension ---
interface ExtendedMetricAsset extends MetricAsset {
  usage: {
    dailyQueries: number;
    reportCount: number;
    apiCount: number;
    askHitRate: number;
  };
  steward: string;
}

// Enriching mock data locally for the UI
const getEnrichedAsset = (id: string): ExtendedMetricAsset | undefined => {
  const asset = METRIC_ASSETS_MOCK.find(m => m.id === id);
  if (!asset) return undefined;
  return {
    ...asset,
    steward: 'Data Governance Team',
    usage: {
      dailyQueries: Math.floor(Math.random() * 5000) + 100,
      reportCount: Math.floor(Math.random() * 20) + 2,
      apiCount: Math.floor(Math.random() * 10) + 1,
      askHitRate: 85 + Math.floor(Math.random() * 10)
    }
  };
};

// --- Sub-Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles = status === 'Active' || status === 'Published' 
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
    : 'bg-slate-700 text-slate-400 border-slate-600';
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles}`}>
      {status}
    </span>
  );
};

const ComplianceBadge = ({ status, onClick }: { status: string, onClick?: () => void }) => {
  const config = {
    'Compliant': { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    'Warning': { icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    'NonCompliant': { icon: AlertOctagon, color: 'text-red-400 bg-red-500/10 border-red-500/20' }
  };
  // @ts-ignore - Assuming status is valid key
  const style = config[status] || config['Warning'];
  
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all hover:opacity-80 ${style.color}`}
    >
      <style.icon size={12} />
      {status}
    </button>
  );
};

// --- Modals & Drawers ---

const CreateVersionModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-[600px] overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <GitBranch size={18} className="text-cyan-400" /> 创建新版本 (Create Version)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-4">
          <label className="flex items-start gap-4 p-4 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700/50 cursor-pointer transition-colors group">
            <div className="mt-1">
              <input type="radio" name="strategy" className="w-4 h-4 bg-slate-900 border-slate-500 text-cyan-500 focus:ring-offset-slate-900" defaultChecked />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm mb-1 group-hover:text-cyan-400">基于标准定义创建 (From Standard)</div>
              <p className="text-xs text-slate-400">选择一个已发布的指标标准版本 (Standard Version)，继承其口径定义，仅需补充实现逻辑。</p>
            </div>
          </label>

          <label className="flex items-start gap-4 p-4 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700/50 cursor-pointer transition-colors group">
            <div className="mt-1">
              <input type="radio" name="strategy" className="w-4 h-4 bg-slate-900 border-slate-500 text-cyan-500 focus:ring-offset-slate-900" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm mb-1 group-hover:text-cyan-400">克隆最新版本 (Clone Latest)</div>
              <p className="text-xs text-slate-400">基于当前最新版本 v2.0.0 创建副本，适用于口径微调或修复。</p>
            </div>
          </label>

          <label className="flex items-start gap-4 p-4 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700/50 cursor-pointer transition-colors group">
            <div className="mt-1">
              <input type="radio" name="strategy" className="w-4 h-4 bg-slate-900 border-slate-500 text-cyan-500 focus:ring-offset-slate-900" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm mb-1 group-hover:text-cyan-400">从 SQL 导入 (Import SQL)</div>
              <p className="text-xs text-slate-400">粘贴现有 SQL 代码，AI 自动反向解析出指标定义与依赖。</p>
            </div>
          </label>
        </div>

        <div className="p-5 border-t border-slate-700 bg-slate-900/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">取消</button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-bold bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/20 transition-colors flex items-center gap-2">
            下一步 <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ComplianceDrawer = ({ isOpen, onClose, version }: { isOpen: boolean, onClose: () => void, version: MetricVersion }) => {
  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-5 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400" /> 合规检测报告
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
           <div className="text-xs text-slate-500 uppercase mb-2">绑定标准</div>
           <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <FileText size={14} className="text-indigo-400" />
              {version.standardBinding?.standardId || 'STD_GMV_DEF'}
              <span className="text-xs font-normal text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">{version.standardBinding?.standardVersion}</span>
           </div>
        </div>

        <div>
           <h4 className="text-sm font-bold text-slate-300 mb-3">差异检测 (Diff Analysis)</h4>
           <div className="space-y-3">
              <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-3">
                 <div className="flex items-start gap-2 mb-2">
                    <AlertOctagon size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-red-300">维度缺失</span>
                 </div>
                 <p className="text-xs text-red-200/70 mb-2">标准要求必须包含 `Channel` 维度，但在当前实现中未发现。</p>
                 <button className="text-[10px] bg-red-900/30 text-red-300 border border-red-500/30 px-2 py-1 rounded hover:bg-red-900/50 transition-colors">
                    自动添加维度
                 </button>
              </div>
              
              <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg p-3">
                 <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-emerald-300">计算口径一致</span>
                 </div>
                 <p className="text-xs text-emerald-200/70 mt-1">SQL 聚合函数 SUM 与标准定义匹配。</p>
              </div>
           </div>
        </div>

        <div className="bg-indigo-900/20 rounded-xl p-4 border border-indigo-500/20">
           <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs mb-2">
              <Sparkles size={14} /> AI 修复建议
           </div>
           <p className="text-xs text-indigo-200/70 leading-relaxed mb-3">
              建议修改 SQL 添加 GROUP BY channel，并更新元数据定义。
           </p>
           <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-colors">
              一键应用修复
           </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export const MetricDetailPage: React.FC = () => {
  const { metricId } = useParams();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showComplianceDrawer, setShowComplianceDrawer] = useState(false);

  const asset = getEnrichedAsset(metricId || '') || getEnrichedAsset(METRIC_ASSETS_MOCK[0].id);
  // @ts-ignore
  const versions = METRIC_VERSIONS_MOCK.filter(v => v.metricId === asset.id);
  const latestVersion = versions[0]; // Assuming sorted or pick first

  // Standard Comparison Logic
  const boundStandardId = latestVersion?.standardBinding?.standardId;
  const boundStandard = boundStandardId ? STANDARD_ITEMS_MOCK.find(s => s.id === boundStandardId) : null;
  
  const isStandardOutdated = boundStandard && latestVersion?.standardBinding?.standardVersion !== boundStandard.version;
  const isRecommended = latestVersion?.isRecommended;
  const canBeRecommended = latestVersion?.compliance === 'Compliant' && latestVersion?.standardBinding;

  if (!asset) return <div>Metric not found</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-300 bg-slate-900">
       
       {/* 1. Page Header */}
       <div className="h-16 px-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/metrics')} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
             </button>
             <div>
                <div className="flex items-center gap-3">
                   <h1 className="text-lg font-bold text-white tracking-tight">{asset.cnName}</h1>
                   <StatusBadge status={asset.status} />
                   {isRecommended && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                         <Sparkles size={10} /> Official Rec.
                      </span>
                   )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono">
                   {asset.code}
                   <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                   v{latestVersion?.versionNo}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-cyan-900/20">
                <GitBranch size={14} /> 创建新版本
             </button>
             <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-2">
                <Edit3 size={14} /> 编辑信息
             </button>
             <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <MoreVertical size={18} />
             </button>
          </div>
       </div>

       {/* Alert Banner for Standard Update */}
       {isStandardOutdated && (
          <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
             <div className="flex items-center gap-2 text-xs text-amber-300">
                <AlertTriangle size={14} />
                <span>
                   标准已有新版本更新 (Current: {latestVersion?.standardBinding?.standardVersion} → Latest: {boundStandard?.version})。
                   请尽快评估影响并升级。
                </span>
             </div>
             <button className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-3 py-1 rounded transition-colors" onClick={() => navigate(`/metrics/${metricId}/versions/${latestVersion.id}`)}>
                查看差异
             </button>
          </div>
       )}

       {/* 2. Main Content Layout */}
       <div className="flex flex-1 min-h-0">
          
          {/* Left: Main Workspace (75%) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
             
             {/* A. Summary Card */}
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                   <div className="max-w-3xl">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                         <LayoutTemplate size={14} /> 业务定义 (Business Definition)
                      </h3>
                      <p className="text-base text-slate-200 leading-relaxed">
                         {asset.description}
                         <span className="block mt-2 text-sm text-slate-400">
                            统计周期内所有已支付订单的金额总和，包含运费，不包含退款金额。
                         </span>
                      </p>
                   </div>
                   
                   {/* Standard Binding Box */}
                   <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 w-72">
                      <div className="flex justify-between items-center mb-2">
                         <div className="text-xs text-slate-500 uppercase font-bold">标准绑定状态</div>
                         {/* Toggle Recommendation */}
                         {latestVersion?.compliance === 'Compliant' && latestVersion.standardBinding && (
                            <button 
                               title={isRecommended ? "Set as Normal" : "Set as Official Recommended"}
                               className={`p-1 rounded transition-colors ${isRecommended ? 'text-indigo-400 bg-indigo-900/30' : 'text-slate-600 hover:text-indigo-400'}`}
                            >
                               <Sparkles size={14} className={isRecommended ? 'fill-current' : ''} />
                            </button>
                         )}
                      </div>
                      
                      {latestVersion?.standardBinding ? (
                         <>
                            <div className="flex items-center gap-2 mb-2">
                               <FileText size={16} className="text-indigo-400" />
                               <span className="text-sm font-bold text-white truncate">{latestVersion.standardBinding.standardId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${isStandardOutdated ? 'bg-amber-900/30 text-amber-400 border border-amber-500/30' : 'text-slate-500 bg-slate-900'}`}>
                                  {latestVersion.standardBinding.standardVersion}
                                  {isStandardOutdated && <span className="ml-1 text-[8px] bg-amber-500 text-slate-900 px-1 rounded">OUTDATED</span>}
                               </span>
                               <ComplianceBadge status={latestVersion.compliance} onClick={() => setShowComplianceDrawer(true)} />
                            </div>
                         </>
                      ) : (
                         <div className="text-sm text-slate-400 italic">未绑定标准</div>
                      )}
                   </div>
                </div>

                {/* Shortcuts */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-700/50 relative z-10">
                   <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                      查看完整定义 <ChevronRight size={12} />
                   </button>
                   <div className="w-px h-3 bg-slate-700"></div>
                   <button className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                      <ArrowRightLeft size={12} /> 版本对比
                   </button>
                   <div className="w-px h-3 bg-slate-700"></div>
                   <button className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                      <Network size={12} /> 全链路血缘
                   </button>
                </div>
                
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             </div>

             {/* B. Evidence Summary */}
             <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                   <div className="text-xs text-slate-500 uppercase font-bold flex items-center gap-2">
                      <Database size={12} /> 数据来源 (Sources)
                   </div>
                   <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> t_dwd_order
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> dim_channel
                      </div>
                   </div>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                   <div className="text-xs text-slate-500 uppercase font-bold flex items-center gap-2">
                      <Network size={12} /> 字段溯源 (Trace)
                   </div>
                   <div className="mt-2">
                      <div className="text-2xl font-bold text-emerald-400 font-mono">100%</div>
                      <div className="text-[10px] text-slate-500">覆盖率 (Coverage)</div>
                   </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                   <div className="text-xs text-slate-500 uppercase font-bold flex items-center gap-2">
                      <ShieldCheck size={12} /> 数据质量 (Quality)
                   </div>
                   <div className="mt-2 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                      <div>
                         <div className="text-sm font-bold text-white">Pass</div>
                         <div className="text-[10px] text-slate-500">Last check: 2h ago</div>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                   <div className="text-xs text-slate-500 uppercase font-bold flex items-center gap-2">
                      <Activity size={12} /> 活跃度 (Activity)
                   </div>
                   <div className="mt-2">
                      <div className="text-2xl font-bold text-indigo-400 font-mono">High</div>
                      <div className="text-[10px] text-slate-500">Top 10% used</div>
                   </div>
                </div>
             </div>

             {/* C. Version Timeline */}
             <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-700 bg-slate-900/30 flex items-center justify-between">
                   <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <History size={16} className="text-slate-400" /> 版本历史 (Version History)
                   </h3>
                   <div className="flex gap-2">
                      <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Search size={14} /></button>
                   </div>
                </div>
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-900/50 text-slate-500 text-xs font-bold uppercase">
                      <tr>
                         <th className="px-6 py-3">版本号</th>
                         <th className="px-6 py-3">状态</th>
                         <th className="px-6 py-3">发布人 / 时间</th>
                         <th className="px-6 py-3">变更说明</th>
                         <th className="px-6 py-3 text-right">操作</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/50">
                      {versions.map((v) => (
                         <tr 
                            key={v.id} 
                            onClick={() => navigate(`/metrics/${asset.id}/versions/${v.id}`)}
                            className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                         >
                            <td className="px-6 py-4 font-mono text-slate-300 font-medium">
                               <div className="flex items-center gap-2">
                                  <GitCommit size={14} className="text-slate-600" />
                                  <span className="group-hover:text-cyan-400 group-hover:underline transition-colors">{v.versionNo}</span>
                                  {latestVersion.id === v.id && <span className="text-[9px] bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 px-1.5 rounded">Latest</span>}
                                  {v.isRecommended && <Sparkles size={10} className="text-indigo-400 fill-current" />}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <StatusBadge status={v.status} />
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="text-xs text-white">{v.createdBy}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{v.publishedAt || v.createdAt}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">
                               Initial release with standard definitions.
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors group-hover:bg-slate-700" title="View"><FileText size={14} /></button>
                                  <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

          </div>

          {/* Right: Sidebar Info (25%) */}
          <div className="w-80 border-l border-slate-700 bg-slate-900/50 p-6 flex flex-col gap-8 overflow-y-auto">
             
             {/* 1. People */}
             <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">治理与责任 (Governance)</h4>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600">
                         {asset.owner.charAt(0)}
                      </div>
                      <div>
                         <div className="text-sm font-bold text-slate-200">{asset.owner}</div>
                         <div className="text-xs text-slate-500">Business Owner</div>
                      </div>
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-300 border border-indigo-500/30">
                         ST
                      </div>
                      <div>
                         <div className="text-sm font-bold text-slate-200">{asset.steward}</div>
                         <div className="text-xs text-slate-500">Data Steward</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="h-px bg-slate-700/50"></div>

             {/* 2. Taxonomy & Tags */}
             <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">分类与标签 (Taxonomy)</h4>
                <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Domain</span>
                      <span className="text-slate-200">{asset.domain}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subject</span>
                      <span className="text-slate-200">Transaction</span>
                   </div>
                </div>
                <div className="flex flex-wrap gap-2">
                   {asset.tags.map(t => (
                      <span key={t} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded">
                         {t}
                      </span>
                   ))}
                </div>
             </div>

             <div className="h-px bg-slate-700/50"></div>

             {/* 3. Usage Stats */}
             <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">使用情况 (Usage)</h4>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-slate-500 uppercase mb-1">Daily Queries</div>
                      <div className="text-lg font-bold text-white font-mono">{asset.usage.dailyQueries.toLocaleString()}</div>
                   </div>
                   <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-slate-500 uppercase mb-1">Ask Success</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono">{asset.usage.askHitRate}%</div>
                   </div>
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                   <div className="flex justify-between items-center bg-slate-800/30 p-2 rounded hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2"><BarChart3 size={12} /> Reports</div>
                      <span className="font-mono text-white">{asset.usage.reportCount}</span>
                   </div>
                   <div className="flex justify-between items-center bg-slate-800/30 p-2 rounded hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2"><Box size={12} /> APIs</div>
                      <span className="font-mono text-white">{asset.usage.apiCount}</span>
                   </div>
                </div>
             </div>

             <div className="h-px bg-slate-700/50"></div>

             {/* 4. Related Standards */}
             <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">相关标准 (Related)</h4>
                <div className="flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-400 cursor-pointer transition-colors">
                   <FileText size={12} />
                   <span>Term: Gross Merchandise Value</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-400 cursor-pointer transition-colors">
                   <Binary size={12} />
                   <span>DE: Order_Amount</span>
                </div>
             </div>

          </div>
       </div>

       {/* Overlays */}
       <CreateVersionModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
       <ComplianceDrawer isOpen={showComplianceDrawer} onClose={() => setShowComplianceDrawer(false)} version={latestVersion} />

    </div>
  );
};
