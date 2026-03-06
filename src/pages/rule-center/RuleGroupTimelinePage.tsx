import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Layers, Plus, ShieldCheck, AlertTriangle, 
  CheckCircle2, FileText, Activity, Search, Filter,
  MoreHorizontal, Network, GitMerge, AlertCircle,
  ArrowRight, LayoutGrid
} from 'lucide-react';

export const RuleGroupTimelinePage: React.FC = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [hoveredBand, setHoveredBand] = useState<string | null>(null);

  const groupName = groupId === 'G-002' ? '差旅报销区间覆盖群' : '逾期天数处置规则群';
  const mainAxis = groupId === 'G-002' ? '住宿标准上限 (元)' : '逾期天数 (Days)';

  const rules = [
    { id: 'R-101', name: '轻度逾期预警', interval: '[0, 30)', action: 'WARN 采购专员', status: 'PASS', lastScan: '2024-03-21' },
    { id: 'R-102', name: '中度逾期升级', interval: '[30, 90)', action: 'WARN 采购总监', status: 'PASS', lastScan: '2024-03-21' },
    { id: 'R-103', name: '严重逾期冻结', interval: '>= 120', action: 'BLOCK 采购申请', status: 'PASS', lastScan: '2024-03-21' },
  ];

  const handleCreateFromGap = (min: number, max: number) => {
    navigate(`/rule-center/drafts/new?groupId=${groupId}&min=${min}&max=${max}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/rule-center/groups')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-bold flex items-center gap-1">
                <Layers size={10} /> 规则群视图
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {groupId || 'G-001'}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-3">
              {groupName}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/rule-center/drafts/new?groupId=${groupId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-900/20"
          >
            <Plus size={18} />
            新建规则
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content: Timeline & Rules Table */}
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* Timeline Board (Core) */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Network className="text-cyan-400" size={20} />
                  区间覆盖视图 (Timeline Board)
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  主轴变量: <code className="text-cyan-400 bg-slate-800 px-1.5 py-0.5 rounded">{mainAxis}</code>
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-700 rounded"></div> 正常覆盖</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-500/20 border border-amber-500/50 rounded"></div> 覆盖缺口 (Gap)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-500/20 border border-rose-500/50 rounded"></div> 区间重叠 (Overlap)</div>
              </div>
            </div>

            {/* Timeline Visualization */}
            <div className="relative pt-8 pb-12 px-4">
              {/* Axis Line */}
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 rounded-full"></div>
              
              {/* Axis Markers */}
              <div className="absolute top-1/2 left-[4%] -translate-y-1/2 w-0.5 h-3 bg-slate-600"></div>
              <div className="absolute top-[calc(50%+12px)] left-[4%] -translate-x-1/2 text-[10px] text-slate-500 font-mono">0</div>
              
              <div className="absolute top-1/2 left-[34%] -translate-y-1/2 w-0.5 h-3 bg-slate-600"></div>
              <div className="absolute top-[calc(50%+12px)] left-[34%] -translate-x-1/2 text-[10px] text-slate-500 font-mono">30</div>
              
              <div className="absolute top-1/2 left-[64%] -translate-y-1/2 w-0.5 h-3 bg-slate-600"></div>
              <div className="absolute top-[calc(50%+12px)] left-[64%] -translate-x-1/2 text-[10px] text-slate-500 font-mono">90</div>
              
              <div className="absolute top-1/2 left-[84%] -translate-y-1/2 w-0.5 h-3 bg-slate-600"></div>
              <div className="absolute top-[calc(50%+12px)] left-[84%] -translate-x-1/2 text-[10px] text-slate-500 font-mono">120</div>

              {/* Interval Bands */}
              <div className="relative h-16 flex items-center">
                {/* Rule 1: [0, 30) */}
                <div 
                  className={`absolute left-[4%] w-[30%] h-10 bg-slate-700 border border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${hoveredBand === 'R-101' ? 'ring-2 ring-cyan-500/50 bg-slate-600 z-10 scale-105' : 'hover:bg-slate-600'}`}
                  onMouseEnter={() => setHoveredBand('R-101')}
                  onMouseLeave={() => setHoveredBand(null)}
                >
                  <span className="text-xs font-bold text-slate-200">R-101</span>
                  <span className="text-[10px] text-slate-400 font-mono">[0, 30)</span>
                </div>

                {/* Rule 2: [30, 90) */}
                <div 
                  className={`absolute left-[34%] w-[30%] h-10 bg-slate-700 border border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${hoveredBand === 'R-102' ? 'ring-2 ring-cyan-500/50 bg-slate-600 z-10 scale-105' : 'hover:bg-slate-600'}`}
                  onMouseEnter={() => setHoveredBand('R-102')}
                  onMouseLeave={() => setHoveredBand(null)}
                >
                  <span className="text-xs font-bold text-slate-200">R-102</span>
                  <span className="text-[10px] text-slate-400 font-mono">[30, 90)</span>
                </div>

                {/* Gap: [90, 120) */}
                <div className="absolute left-[64%] w-[20%] h-10 bg-amber-500/10 border-2 border-dashed border-amber-500/50 rounded-lg flex flex-col items-center justify-center group">
                  <div className="absolute -top-10 bg-slate-800 border border-slate-700 text-amber-400 text-xs px-3 py-1.5 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 flex items-center gap-2 pointer-events-none">
                    <AlertTriangle size={14} />
                    发现覆盖缺口 [90, 120)
                  </div>
                  <span className="text-xs font-bold text-amber-400">GAP</span>
                  <button 
                    onClick={() => handleCreateFromGap(90, 120)}
                    className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-600 hover:bg-amber-500 text-white text-[10px] px-2 py-1 rounded shadow-lg flex items-center gap-1 z-20"
                  >
                    <Plus size={12} /> 补充规则
                  </button>
                </div>

                {/* Rule 3: >= 120 */}
                <div 
                  className={`absolute left-[84%] w-[12%] h-10 bg-slate-700 border border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${hoveredBand === 'R-103' ? 'ring-2 ring-cyan-500/50 bg-slate-600 z-10 scale-105' : 'hover:bg-slate-600'}`}
                  onMouseEnter={() => setHoveredBand('R-103')}
                  onMouseLeave={() => setHoveredBand(null)}
                >
                  <span className="text-xs font-bold text-slate-200">R-103</span>
                  <span className="text-[10px] text-slate-400 font-mono">&gt;= 120</span>
                </div>
              </div>
            </div>

            {/* Gap Alert Banner */}
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-400">检测到 1 处区间覆盖缺口</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    在主轴变量 <code className="text-cyan-400 bg-slate-800 px-1 rounded">逾期天数</code> 上，区间 <code className="text-amber-400 bg-amber-500/20 px-1 rounded">[90, 120)</code> 目前没有任何规则覆盖。当业务数据落入此区间时，系统将无法执行任何拦截或预警动作。
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleCreateFromGap(90, 120)}
                className="shrink-0 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                一键补充规则
              </button>
            </div>
          </div>

          {/* Rules Table */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LayoutGrid size={20} className="text-indigo-400" />
                群内规则列表
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="搜索规则..."
                  className="w-64 bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">规则 ID</th>
                  <th className="px-6 py-4 font-semibold">规则名称</th>
                  <th className="px-6 py-4 font-semibold">覆盖区间</th>
                  <th className="px-6 py-4 font-semibold">执行动作</th>
                  <th className="px-6 py-4 font-semibold">最近体检</th>
                  <th className="px-6 py-4 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {rules.map((rule) => (
                  <tr 
                    key={rule.id} 
                    className={`transition-colors group ${hoveredBand === rule.id ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
                    onMouseEnter={() => setHoveredBand(rule.id)}
                    onMouseLeave={() => setHoveredBand(null)}
                  >
                    <td className="px-6 py-4 text-sm font-mono text-cyan-400/80">{rule.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-200">{rule.name}</td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-300 bg-slate-950/50 rounded px-2 py-1 inline-block mt-3 border border-slate-800">{rule.interval}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${
                        rule.action.includes('BLOCK') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {rule.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span className="text-xs text-slate-400">{rule.lastScan}</span>
                      </div>
                    </td>
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

        {/* Side Panel: Context */}
        <div className="w-80 shrink-0 space-y-6">
          {/* Associated Policies */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-slate-700/50">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <FileText size={16} className="text-emerald-400" />
                关联制度文档
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-emerald-500/50 transition-colors">
                <div className="text-xs font-mono text-emerald-400 mb-1">DOC-2024-005</div>
                <div className="text-sm font-medium text-slate-200 mb-2">《供应商管理规范 v2.0》</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <CheckCircle2 size={12} /> 已建立追溯关系
                </div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-emerald-500/50 transition-colors">
                <div className="text-xs font-mono text-emerald-400 mb-1">DOC-2023-012</div>
                <div className="text-sm font-medium text-slate-200 mb-2">《采购合同违约处理办法》</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <CheckCircle2 size={12} /> 已建立追溯关系
                </div>
              </div>
            </div>
          </div>

          {/* Associated Process Nodes */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-slate-700/50">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <GitMerge size={16} className="text-indigo-400" />
                关联流程节点
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                采购申请提交
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                供应商付款审批
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                合同归档
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
