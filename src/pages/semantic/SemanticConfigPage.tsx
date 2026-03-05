
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Settings, Play, BarChart3, GitCompare, Send,
  History, Plus, ChevronRight, Save, RefreshCw,
  Search, Filter, AlertCircle, CheckCircle2,
  ArrowRight, Database, Brain, ShieldCheck,
  LayoutGrid, Binary, Zap, Layers, Activity,
  ChevronDown, X, FileText, Network, ChevronUp, Users
} from 'lucide-react';
import { ConfigEditorView } from './config';

type ConfigTab = 'versions' | 'editor' | 'simulate' | 'evaluate' | 'diff' | 'publish';

export const SemanticConfigPage: React.FC = () => {
  const { versionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Determine active tab from URL
  const getActiveTab = (): ConfigTab => {
    const path = location.pathname;
    if (path.endsWith('/editor')) return 'editor';
    if (path.endsWith('/simulate')) return 'simulate';
    if (path.endsWith('/evaluate')) return 'evaluate';
    if (path.endsWith('/diff')) return 'diff';
    if (path.endsWith('/publish')) return 'publish';
    return 'versions';
  };

  const activeTab = getActiveTab();

  const tabs = [
    { id: 'versions', label: '版本管理', icon: History },
    { id: 'editor', label: '配置编辑器', icon: Settings, disabled: !versionId },
    { id: 'simulate', label: '仿真回放', icon: Play, disabled: !versionId },
    { id: 'evaluate', label: '评测回归', icon: BarChart3, disabled: !versionId },
    { id: 'diff', label: '差异影响', icon: GitCompare, disabled: !versionId },
    { id: 'publish', label: '发布上线', icon: Send, disabled: !versionId },
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === 'versions') {
      navigate('/engine-config');
    } else {
      navigate(`/engine-config/${versionId}/${tabId}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-300">
      {/* Page Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">语义理解配置中心</h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <span>语义引擎</span>
              <ChevronRight size={10} />
              <span className={versionId ? 'text-indigo-400' : ''}>{versionId ? `当前版本: ${versionId}` : '版本管理'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
            <RefreshCw size={14} />
            刷新状态
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Plus size={14} />
            新建配置版本
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="flex items-center px-6 border-b border-slate-800 bg-slate-900/20 gap-8">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
                isActive 
                  ? 'border-indigo-500 text-white' 
                  : tab.disabled 
                    ? 'border-transparent text-slate-700 cursor-not-allowed' 
                    : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'versions' && <VersionManagementView onSelect={(id) => navigate(`/engine-config/${id}/editor`)} />}
        {activeTab === 'editor' && <ConfigEditorView versionId={versionId!} />}
        {activeTab === 'simulate' && <SimulationView versionId={versionId!} />}
        {activeTab === 'evaluate' && <EvaluationView versionId={versionId!} />}
        {activeTab === 'diff' && <DiffView versionId={versionId!} />}
        {activeTab === 'publish' && <PublishView versionId={versionId!} />}
      </div>

      {/* Create Version Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus size={16} className="text-indigo-400" />
                新建配置版本
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">基线版本</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500">
                  <option value="v2.3.5-stable">v2.3.5-stable (当前生产环境)</option>
                  <option value="v2.4.0-rc1">v2.4.0-rc1</option>
                  <option value="v2.3.4">v2.3.4</option>
                </select>
                <p className="text-[10px] text-slate-500">新版本将继承基线版本的所有配置规则</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">新版本号</label>
                <input 
                  type="text" 
                  placeholder="例如: v2.4.0-draft" 
                  defaultValue="v2.4.0-draft"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">版本描述 (Description)</label>
                <textarea 
                  rows={3}
                  placeholder="简要描述此版本的修改目的..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>
            </div>
            <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  navigate('/engine-config/v2.4.0-draft/editor');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
              >
                创建并编辑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Views ---

const VersionManagementView: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const versions = [
    { id: 'v2.4.0-rc1', status: 'DRAFT', creator: '张三', time: '2024-03-03 14:20', desc: '优化零售域订单状态识别规则' },
    { id: 'v2.3.5-stable', status: 'RELEASED', creator: '李四', time: '2024-02-28 10:15', desc: '生产环境当前版本' },
    { id: 'v2.3.4', status: 'ARCHIVED', creator: '王五', time: '2024-02-20 16:45', desc: '历史版本' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">配置版本列表</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="搜索版本号..." 
              className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-800">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">版本 ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">状态</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">描述</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">创建人</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">更新时间</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {versions.map(v => (
              <tr 
                key={v.id} 
                onClick={() => onSelect(v.id)}
                className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-mono font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">{v.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    v.status === 'RELEASED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    v.status === 'DRAFT' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{v.desc}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{v.creator}</td>
                <td className="px-6 py-4 text-xs text-slate-500 font-mono">{v.time}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    className="text-indigo-400 group-hover:text-indigo-300 text-xs font-bold flex items-center gap-1 ml-auto transition-colors"
                  >
                    配置详情 <ChevronRight size={14} />
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
const SimulationView: React.FC<{ versionId: string }> = ({ versionId }) => {
  const [activeQueue, setActiveQueue] = React.useState('HUMAN');
  const [selectedSample, setSelectedSample] = React.useState('user_code_id');

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 flex-shrink-0">
        <div>
          <h2 className="text-base font-bold text-white">仿真与回放 (Simulation & Trace)</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">针对异常字段，逐维度回放规则触发、贡献及 LLM 介入情况</p>
        </div>
        <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-500/20">
          <FileText size={14} />
          导出调参建议报告
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Sample Queue */}
        <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/30 flex-shrink-0">
          <div className="p-3 border-b border-slate-800">
            <div className="flex bg-slate-950 rounded-lg border border-slate-800 p-1">
              {['HUMAN', 'CONFLICT', 'GOLDEN'].map(q => (
                <button 
                  key={q}
                  onClick={() => setActiveQueue(q)}
                  className={`flex-1 text-[9px] font-bold py-1.5 rounded-md transition-all ${
                    activeQueue === q 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {q === 'HUMAN' ? '纠错' : q === 'CONFLICT' ? '冲突' : '回归'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {[
              { id: 'user_code_id', table: 'dim_users', status: 'HUMAN', old: 'MEASURE', new: 'ID' },
              { id: 'is_deleted', table: 'sales_orders', status: 'HUMAN', old: 'MEASURE', new: 'DIM' },
              { id: 'region_name', table: 'dim_region', status: 'HUMAN', old: 'UNKNOWN', new: 'DIM' },
            ].map(sample => (
              <button 
                key={sample.id}
                onClick={() => setSelectedSample(sample.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedSample === sample.id 
                    ? 'bg-indigo-500/10 border-indigo-500/30' 
                    : 'bg-slate-900/50 border-transparent hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${selectedSample === sample.id ? 'text-indigo-400' : 'text-slate-300'}`}>{sample.id}</span>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">人工纠错</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mb-2">{sample.table}</div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-rose-400 line-through">{sample.old}</span>
                  <ArrowRight size={10} className="text-slate-600" />
                  <span className="text-emerald-400 font-bold">{sample.new}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Middle: Evidence Timeline */}
        <main className="flex-1 border-r border-slate-800 flex flex-col bg-slate-950 min-w-0">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <History size={14} className="text-indigo-400" />
              证据链时间线 (Evidence Timeline)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Target: {selectedSample}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
            <div className="absolute left-10 top-6 bottom-6 w-px bg-slate-800"></div>
            
            <div className="space-y-8 relative">
              {[
                { d: 'D1', name: '命名规则 (Naming Rules)', source: '规则', rule: 'Code_Suffix_Rule', deltaType: '+0.45 (DIM)', deltaRole: '+0.10 (NONE)' },
                { d: 'D2', name: '特征阈值 (Profile Thresholds)', source: '规则', rule: 'High_Cardinality', deltaType: '+0.20 (ID)', deltaRole: '+0.30 (PK)' },
                { d: 'D3', name: '使用映射 (Usage Mapping)', source: '规则', rule: 'Group_By_Key', deltaType: '+0.15 (DIM)', deltaRole: '+0.00' },
                { d: 'D4', name: '标准映射 (Standards Mapping)', source: '规则', rule: 'No_Match', deltaType: '0.00', deltaRole: '0.00' },
                { d: 'D5', name: '语义大模型 (Semantic LLM)', source: 'LLM', rule: 'Context_Inference', deltaType: '+0.35 (ID)', deltaRole: '+0.40 (PK)', desc: 'LLM 根据 "code_id" 命名模式和高基数特征推断为 ID。' },
              ].map((ev, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 z-10 shrink-0">
                    {ev.d}
                  </div>
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{ev.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${ev.source === 'LLM' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                          {ev.source}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{ev.rule}</span>
                    </div>
                    {ev.desc && (
                      <p className="text-[10px] text-slate-400 italic bg-slate-950 p-2 rounded border border-slate-800/50">
                        {ev.desc}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/50">
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Δ 类型 (Type)</p>
                        <p className="text-xs font-mono font-bold text-emerald-400">{ev.deltaType}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Δ 角色 (Role)</p>
                        <p className="text-xs font-mono font-bold text-indigo-400">{ev.deltaRole}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right: Derivation Tree */}
        <aside className="w-96 flex flex-col bg-slate-900/40 flex-shrink-0">
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Network size={14} className="text-emerald-400" />
              推导树 (Derivation Tree)
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {/* RawType */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RawType(t)</h4>
                <span className="text-xs font-mono font-bold text-emerald-400">0.85 (ID)</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <p className="text-[9px] font-mono text-slate-500 mb-2 border-b border-slate-800 pb-2">
                  Σ w_d * s_d(t) + 偏置 (bias)
                </p>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400">D1: 命名规则</span>
                  <span className="text-slate-500">0.2 * 0.45 = 0.09</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400">D2: 特征阈值</span>
                  <span className="text-slate-500">0.3 * 0.20 = 0.06</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-purple-400">D5: LLM</span>
                  <span className="text-slate-500">0.5 * 0.35 = 0.175</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono border-t border-slate-800 pt-1 mt-1">
                  <span className="text-slate-400">偏置 (Bias - ID)</span>
                  <span className="text-slate-500">+ 0.525</span>
                </div>
              </div>
            </div>

            {/* RawRole */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RawRole(r)</h4>
                <span className="text-xs font-mono font-bold text-indigo-400">0.78 (PK)</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <p className="text-[9px] font-mono text-slate-500 mb-2 border-b border-slate-800 pb-2">
                  Σ w_d * s_d(r) + 先验 (prior)
                </p>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400">D2: 特征阈值</span>
                  <span className="text-slate-500">0.4 * 0.30 = 0.12</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-purple-400">D5: LLM</span>
                  <span className="text-slate-500">0.6 * 0.40 = 0.24</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono border-t border-slate-800 pt-1 mt-1">
                  <span className="text-slate-400">先验 (Prior - 维度表)</span>
                  <span className="text-slate-500">+ 0.42</span>
                </div>
              </div>
            </div>

            {/* JointScore */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JointScore</h4>
                <span className="text-sm font-mono font-bold text-white">0.86</span>
              </div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg space-y-2">
                <p className="text-[9px] font-mono text-indigo-400/70 mb-2 border-b border-indigo-500/20 pb-2">
                  α * ConfType + (1-α) * ConfRole + compat
                </p>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-300">α (0.6) * 0.85</span>
                  <span className="text-emerald-400">0.51</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-300">(1-α) * 0.78</span>
                  <span className="text-indigo-400">0.312</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono border-t border-indigo-500/20 pt-1 mt-1">
                  <span className="text-slate-300">Compat (ID, PK)</span>
                  <span className="text-emerald-400">+ 0.038</span>
                </div>
              </div>
            </div>
            
            {/* Final Result */}
            <div className="mt-4 p-4 bg-slate-900 border border-slate-700 rounded-xl text-center">
               <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">最终决策 (Final Decision)</p>
               <p className="text-lg font-bold text-white">ID / PK</p>
               <p className="text-[10px] text-emerald-400 mt-1">置信度: 高 (High)</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const EvaluationView: React.FC<{ versionId: string }> = ({ versionId }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold text-white">评测与回归 (Evaluation)</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">在 Golden Set 上运行回归测试，评估准确率、误伤率及混淆矩阵</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
            <History size={14} />
            对比历史版本
          </button>
          <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-500/20">
            <Play size={14} />
            一键跑回归 (Run Golden Set)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Core Metrics Grid */}
        <div className="grid grid-cols-6 gap-4">
          {[
            { label: '类型 Top1 准确率', value: '94.2%', change: '+1.2%', trend: 'up', desc: '在已标注样本上' },
            { label: '角色 Top1 准确率', value: '91.8%', change: '+0.5%', trend: 'up', desc: '在已标注样本上' },
            { label: '关键字段精确率', value: '98.5%', change: '0.0%', trend: 'neutral', desc: 'PK/FK/BK/EventTime' },
            { label: 'IGNORE 误伤率', value: '1.2%', change: '-0.4%', trend: 'down', desc: '误报 (False Positive)' },
            { label: '覆盖率变化', value: '99.1%', change: '+2.1%', trend: 'up', desc: 'IGNORE 不计分母' },
            { label: '冲突率 (Conflict)', value: '3.4%', change: '-1.1%', trend: 'down', desc: 'Gap < 0.10 的比例' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-indigo-500/30 transition-colors">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate" title={stat.label}>{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-xl font-mono font-bold text-white">{stat.value}</p>
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${
                  stat.trend === 'up' && stat.label.includes('率') && !stat.label.includes('Accuracy') && !stat.label.includes('Precision') ? 'text-rose-400' :
                  stat.trend === 'up' ? 'text-emerald-400' : 
                  stat.trend === 'down' && stat.label.includes('率') && !stat.label.includes('Accuracy') && !stat.label.includes('Precision') ? 'text-emerald-400' :
                  stat.trend === 'down' ? 'text-rose-400' : 
                  'text-slate-500'
                }`}>
                  {stat.change}
                  {stat.trend === 'up' ? <ChevronUp size={10} /> : stat.trend === 'down' ? <ChevronDown size={10} /> : null}
                </span>
              </div>
              <p className="text-[9px] text-slate-500">{stat.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Confusion Matrices */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <LayoutGrid size={14} className="text-indigo-400" />
                类型 (Type) 混淆矩阵
              </h3>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-[10px] font-mono text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border border-slate-800 bg-slate-950 text-slate-500">实际 \ 预测 (Actual \ Pred)</th>
                      {['ID', 'DIM', 'MEASURE', 'TIME', 'UNKNOWN'].map(t => (
                        <th key={t} className="p-2 border border-slate-800 bg-slate-800/30 text-slate-300">{t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: 'ID', vals: [985, 12, 0, 0, 3], colors: ['bg-emerald-500/40', 'bg-rose-500/20', '', '', 'bg-rose-500/10'] },
                      { type: 'DIM', vals: [5, 1240, 45, 10, 20], colors: ['bg-rose-500/10', 'bg-emerald-500/40', 'bg-rose-500/30', 'bg-rose-500/10', 'bg-rose-500/20'] },
                      { type: 'MEASURE', vals: [0, 32, 890, 0, 5], colors: ['', 'bg-rose-500/20', 'bg-emerald-500/40', '', 'bg-rose-500/10'] },
                      { type: 'TIME', vals: [0, 8, 0, 450, 2], colors: ['', 'bg-rose-500/10', '', 'bg-emerald-500/40', 'bg-rose-500/10'] },
                      { type: 'UNKNOWN', vals: [12, 45, 10, 5, 210], colors: ['bg-rose-500/10', 'bg-rose-500/30', 'bg-rose-500/10', 'bg-rose-500/10', 'bg-emerald-500/40'] },
                    ].map(row => (
                      <tr key={row.type}>
                        <td className="p-2 border border-slate-800 bg-slate-800/30 font-bold text-slate-300 text-left">{row.type}</td>
                        {row.vals.map((v, i) => (
                          <td key={i} className={`p-2 border border-slate-800 ${row.colors[i]} ${v > 0 ? 'text-white' : 'text-slate-600'}`}>
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <LayoutGrid size={14} className="text-emerald-400" />
                角色 (Role) 混淆矩阵
              </h3>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-[10px] font-mono text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border border-slate-800 bg-slate-950 text-slate-500">实际 \ 预测 (Actual \ Pred)</th>
                      {['PK', 'FK', 'BK', 'EVT_TIME', 'NONE'].map(t => (
                        <th key={t} className="p-2 border border-slate-800 bg-slate-800/30 text-slate-300">{t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: 'PK', vals: [450, 12, 0, 0, 5], colors: ['bg-emerald-500/40', 'bg-rose-500/20', '', '', 'bg-rose-500/10'] },
                      { type: 'FK', vals: [8, 890, 25, 0, 45], colors: ['bg-rose-500/10', 'bg-emerald-500/40', 'bg-rose-500/20', '', 'bg-rose-500/30'] },
                      { type: 'BK', vals: [0, 15, 320, 0, 10], colors: ['', 'bg-rose-500/10', 'bg-emerald-500/40', '', 'bg-rose-500/10'] },
                      { type: 'EVT_TIME', vals: [0, 0, 0, 210, 15], colors: ['', '', '', 'bg-emerald-500/40', 'bg-rose-500/20'] },
                      { type: 'NONE', vals: [2, 35, 12, 8, 1500], colors: ['bg-rose-500/10', 'bg-rose-500/30', 'bg-rose-500/10', 'bg-rose-500/10', 'bg-emerald-500/40'] },
                    ].map(row => (
                      <tr key={row.type}>
                        <td className="p-2 border border-slate-800 bg-slate-800/30 font-bold text-slate-300 text-left">{row.type}</td>
                        {row.vals.map((v, i) => (
                          <td key={i} className={`p-2 border border-slate-800 ${row.colors[i]} ${v > 0 ? 'text-white' : 'text-slate-600'}`}>
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Error Types */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-400" />
                Top 错误类型 (Error Analysis)
              </h3>
              <span className="text-[10px] text-slate-500">按发生频次排序</span>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
              {[
                { error: 'DIM 误判为 MEASURE', count: 45, impact: 'High', desc: '通常发生在包含数值状态码的维度字段上。', example: 'status_code, is_deleted' },
                { error: 'UNKNOWN 误判为 DIM', count: 45, impact: 'Medium', desc: '临时字段或无业务含义的字段被强行分配了维度。', example: 'temp_col_01, backup_data' },
                { error: 'NONE 误判为 FK', count: 35, impact: 'High', desc: '非外键的普通 ID 字段被错误识别为关联外键。', example: 'user_phone, session_id' },
                { type: 'role', error: 'FK 误判为 BK', count: 25, impact: 'Medium', desc: '业务主键与外键的特征重叠导致混淆。', example: 'out_trade_no' },
                { error: 'DIM 误判为 UNKNOWN', count: 20, impact: 'Low', desc: '命名极度不规范的维度字段未能被识别。', example: 'c1, c2, attr_val' },
              ].map((err, i) => (
                <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-rose-500/30 transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-rose-400">{err.error}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{err.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                        {err.count} 例 (cases)
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        err.impact === 'High' ? 'bg-rose-500/10 text-rose-400' : 
                        err.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 
                        'bg-slate-800 text-slate-400'
                      }`}>
                        影响程度 (Impact): {err.impact === 'High' ? '高' : err.impact === 'Medium' ? '中' : '低'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50">
                    <div className="text-[10px] font-mono text-slate-400 truncate pr-4">
                      <span className="text-slate-600">e.g.</span> {err.example}
                    </div>
                    <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Play size={10} />
                      仿真回放 (Trace)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiffView: React.FC<{ versionId: string }> = ({ versionId }) => {
  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">差异与影响分析 (Diff & Impact)</h2>
          <p className="text-xs text-slate-500 mt-1">对比当前配置与 Active 版本的规则变化及影响面</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-[10px] font-bold uppercase tracking-widest">
            vs Active (v2.3.5)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Diff Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <GitCompare size={16} className="text-indigo-400" />
              配置差异 (Configuration Diff)
            </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
            {/* Weights */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">权重 (Weights) 改动</h4>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>命名权重 (Naming_Weight):</span>
                  <span className="text-rose-400 line-through">0.5</span>
                  <ArrowRight size={12} />
                  <span className="text-emerald-400 font-bold">0.6</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 mt-1">
                  <span>特征权重 (Profile_Weight):</span>
                  <span className="text-rose-400 line-through">0.4</span>
                  <ArrowRight size={12} />
                  <span className="text-emerald-400 font-bold">0.3</span>
                </div>
              </div>
            </div>
            
            {/* Regex */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Regex 规则增删</h4>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">+</span>
                  <div>
                    <span className="text-slate-300">Rule: Is_Deleted_Flag</span>
                    <p className="text-[10px] text-emerald-400/70">name ~ /^is_.*_deleted$/ -{">"} DIM/STATUS</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">-</span>
                  <div>
                    <span className="text-slate-300">Rule: Old_Status_Rule</span>
                    <p className="text-[10px] text-rose-400/70 line-through">name ~ /_stat$/ -{">"} DIM/CODE</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">兼容性矩阵 (Compat Matrix) 变化</h4>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>[度量, 外键]:</span>
                  <span className="text-emerald-400">允许 (Allowed)</span>
                  <ArrowRight size={12} />
                  <span className="text-rose-400 font-bold">禁止 (Forbidden)</span>
                </div>
              </div>
            </div>

            {/* Ignore Rules */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ignore 规则变化</h4>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">+</span>
                  <div>
                    <span className="text-slate-300">Ignore_Temp_Tables</span>
                    <p className="text-[10px] text-emerald-400/70">table_name ~ /^temp_/ -{">"} IGNORE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Activity size={16} className="text-emerald-400" />
            影响评估 (Impact Assessment)
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
            {/* Golden Set */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">黄金样本集指标变化 (Golden Set)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-500 mb-1">类型准确率 (Type Accuracy)</p>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-white">94.2%</span>
                    <span className="text-xs font-bold text-emerald-400 mb-0.5">+1.2%</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-500 mb-1">冲突率 (Conflict Rate)</p>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-white">3.4%</span>
                    <span className="text-xs font-bold text-emerald-400 mb-0.5">-1.1%</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-500 mb-1">忽略误报 (IGNORE FP)</p>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-white">1.2%</span>
                    <span className="text-xs font-bold text-emerald-400 mb-0.5">-0.4%</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-500 mb-1">覆盖率 (Coverage)</p>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-white">99.1%</span>
                    <span className="text-xs font-bold text-emerald-400 mb-0.5">+2.1%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Offline Simulation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">离线仿真变化 (最近 100 张表)</h4>
                <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">运行仿真</button>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">预测发生变更的字段数</span>
                  <span className="font-mono font-bold text-amber-400">458 / 12,450</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '3.6%' }}></div>
                </div>
                <div className="pt-2 border-t border-slate-800/50 space-y-2">
                  <p className="text-[10px] text-slate-500">主要变更流向:</p>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">未知 (UNKNOWN) -{">"} 维度 (DIM)</span>
                    <span className="text-emerald-400">312 例</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">度量 (MEASURE) -{">"} 维度 (DIM)</span>
                    <span className="text-emerald-400">120 例</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublishView: React.FC<{ versionId: string }> = ({ versionId }) => {
  const [strategy, setStrategy] = React.useState('TABLE_TYPE');

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">发布策略 (Publish Strategy)</h2>
        <p className="text-sm text-slate-500">选择合适的灰度策略，将配置版本安全推送到生产环境</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { id: 'FULL', label: '全量发布', desc: '直接替换所有租户和表类型的当前线上 (Active) 配置。风险较高。', icon: Send, color: 'rose' },
          { id: 'TENANT', label: '租户灰度', desc: '按租户 ID 列表或比例逐步放量。适合 SaaS 多租户架构。', icon: Users, color: 'indigo' },
          { id: 'TABLE_TYPE', label: '表类型灰度', desc: '优先在事实表 (FACT) 或维度表 (DIM) 上生效，观察无误后再全量。', icon: Database, color: 'emerald' },
        ].map(s => {
          const Icon = s.icon;
          const isActive = strategy === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStrategy(s.id)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                isActive 
                  ? `bg-${s.color}-500/10 border-${s.color}-500/50 ring-1 ring-${s.color}-500/50` 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                isActive ? `bg-${s.color}-500/20 text-${s.color}-400` : 'bg-slate-800 text-slate-400'
              }`}>
                <Icon size={20} />
              </div>
              <h3 className={`text-sm font-bold mb-2 ${isActive ? 'text-white' : 'text-slate-300'}`}>{s.label}</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed">{s.desc}</p>
            </button>
          )
        })}
      </div>

      {strategy === 'TABLE_TYPE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database size={16} className="text-emerald-400" />
            表类型灰度配置 (Table Type Grayscale)
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">优先灰度表类型</label>
              <div className="flex gap-3">
                {['FACT (事实表)', 'DIM (维度表)', 'DWD (明细表)', 'DWS (汇总表)'].map(t => (
                  <label key={t} className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-emerald-500/30 transition-colors">
                    <input type="checkbox" defaultChecked={t.includes('FACT')} className="accent-emerald-500" />
                    <span className="text-xs font-bold text-slate-300">{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <p className="text-xs text-emerald-400/80 leading-relaxed">
                <strong className="text-emerald-400">策略说明：</strong> 新版本配置将仅对选中的表类型（如 FACT 表）生效。其他表类型将继续使用当前的 Active 版本。此策略可有效控制核心维度表的变更风险。
              </p>
            </div>
          </div>
        </div>
      )}

      {strategy === 'TENANT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users size={16} className="text-indigo-400" />
            租户灰度配置 (Tenant Grayscale)
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">灰度比例 (Grayscale Ratio)</span>
                <span className="text-indigo-400 font-bold">10%</span>
              </div>
              <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" defaultValue={10} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400">白名单租户 ID (可选)</label>
              <input type="text" placeholder="tenant_id_1, tenant_id_2..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>
      )}

      {strategy === 'FULL' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-400">高风险操作警告</h4>
              <p className="text-xs text-rose-400/80 mt-1 leading-relaxed">
                全量发布将立即替换所有环境的当前配置。请确保您已在“评测与回归”中充分验证了该版本在 Golden Set 上的表现，并确认离线仿真结果符合预期。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all">
          保存为草稿
        </button>
        <button className={`px-6 py-2.5 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2 ${
          strategy === 'FULL' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20' :
          strategy === 'TENANT' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20' :
          'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
        }`}>
          <Send size={16} />
          确认发布 (Version {versionId})
        </button>
      </div>
    </div>
  );
};
