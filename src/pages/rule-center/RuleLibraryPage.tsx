
import React, { useState } from 'react';
import { 
  Library, Search, Filter, Plus, MoreHorizontal, ShieldCheck, 
  CheckCircle2, Clock, AlertCircle, Download, RefreshCw, Send,
  ChevronDown, LayoutGrid, List, FileText, Activity, Copy, Eye,
  AlertTriangle, XCircle, ShieldAlert, Play
} from 'lucide-react';

// Mock Data
const MOCK_RULES = [
  {
    id: 'R-001',
    name: '差旅超标预警规则',
    group: '费用合规群',
    domain: '财务合规',
    scope: '差旅报销单 / 全集团',
    health: 'PASS',
    healthTime: '2024-03-20 10:00',
    source: '制度提取',
    status: 'ACTIVE',
    effectiveFrom: '2024-01-01',
    effectiveTo: '2099-12-31',
    hits7d: 142,
    hits30d: 580,
  },
  {
    id: 'R-002',
    name: '供应商黑名单拦截',
    group: '准入控制群',
    domain: '风险控制',
    scope: '采购合同 / 供应链',
    health: 'BLOCK',
    healthTime: '2024-03-19 15:30',
    source: '系统同步',
    status: 'ACTIVE',
    effectiveFrom: '2023-06-01',
    effectiveTo: '2099-12-31',
    hits7d: 12,
    hits30d: 45,
  },
  {
    id: 'R-003',
    name: '异常折扣率检测',
    group: '价格合规群',
    domain: '销售合规',
    scope: '销售订单 / 华东大区',
    health: 'WARN',
    healthTime: '2024-03-18 09:15',
    source: '行为挖掘',
    status: 'CANDIDATE',
    effectiveFrom: '2024-04-01',
    effectiveTo: '2024-12-31',
    hits7d: 0,
    hits30d: 0,
  },
  {
    id: 'R-004',
    name: '关联交易未申报',
    group: '合规审计群',
    domain: '审计合规',
    scope: '所有合同 / 全集团',
    health: 'PASS',
    healthTime: '2024-03-20 11:20',
    source: '手工录入',
    status: 'DEPRECATED',
    effectiveFrom: '2022-01-01',
    effectiveTo: '2024-01-01',
    hits7d: 0,
    hits30d: 0,
  }
];

const HealthBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'PASS':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 size={12} /> PASS</span>;
    case 'WARN':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><AlertTriangle size={12} /> WARN</span>;
    case 'BLOCK':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle size={12} /> BLOCK</span>;
    default:
      return null;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'ACTIVE':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">ACTIVE</span>;
    case 'CANDIDATE':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">CANDIDATE</span>;
    case 'DEPRECATED':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">DEPRECATED</span>;
    default:
      return null;
  }
};

export const RuleLibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRules, setSelectedRules] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedRules.length === MOCK_RULES.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(MOCK_RULES.map(r => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedRules.includes(id)) {
      setSelectedRules(selectedRules.filter(r => r !== id));
    } else {
      setSelectedRules([...selectedRules, id]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Library className="text-cyan-400" size={28} />
            规则库 <span className="text-slate-600 font-light">/ Rule Library</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">全量查看已入库规则，管理规则生命周期与健康状态。</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700">
            <Download size={16} />
            导入 Agent 推荐
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
              selectedRules.length > 0 
                ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border-indigo-500/30' 
                : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
            }`}
          >
            <RefreshCw size={16} />
            批量再体检 {selectedRules.length > 0 && `(${selectedRules.length})`}
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
              selectedRules.length > 0 
                ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
            }`}
          >
            <Send size={16} />
            发布变更集
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-cyan-900/20">
            <Plus size={16} />
            新建规则
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex flex-wrap items-center gap-3 shrink-0 backdrop-blur-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="搜索规则名 / 规则文本 / 变量名..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 appearance-none pr-8 relative">
            <option value="">规则来源 (全部)</option>
            <option value="sync">系统同步</option>
            <option value="manual">手工录入</option>
            <option value="extract">制度提取</option>
            <option value="mining">行为挖掘</option>
          </select>
          
          <select className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 appearance-none pr-8">
            <option value="">状态 (全部)</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="CANDIDATE">CANDIDATE</option>
            <option value="DEPRECATED">DEPRECATED</option>
          </select>

          <select className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 appearance-none pr-8">
            <option value="">体检结果 (全部)</option>
            <option value="PASS">PASS</option>
            <option value="WARN">WARN</option>
            <option value="BLOCK">BLOCK</option>
          </select>

          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            <Filter size={14} />
            更多筛选
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col backdrop-blur-sm">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
              <tr className="text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold w-10 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30"
                    checked={selectedRules.length === MOCK_RULES.length && MOCK_RULES.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 font-semibold">规则名 / ID</th>
                <th className="px-4 py-3 font-semibold">状态</th>
                <th className="px-4 py-3 font-semibold">规则群 / 检测域</th>
                <th className="px-4 py-3 font-semibold">Scope 摘要</th>
                <th className="px-4 py-3 font-semibold">最近体检</th>
                <th className="px-4 py-3 font-semibold">来源</th>
                <th className="px-4 py-3 font-semibold">生效期</th>
                <th className="px-4 py-3 font-semibold text-right">命中 (7/30天)</th>
                <th className="px-4 py-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {MOCK_RULES.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-700/30 transition-colors group">
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30"
                      checked={selectedRules.includes(rule.id)}
                      onChange={() => toggleSelect(rule.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-cyan-400 transition-colors cursor-pointer">{rule.name}</span>
                      <span className="text-xs font-mono text-slate-500">{rule.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={rule.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-300 flex items-center gap-1"><LayoutGrid size={12} className="text-slate-500"/> {rule.group}</span>
                      <span className="text-[10px] text-slate-500">{rule.domain}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50">
                      {rule.scope}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 items-start">
                      <HealthBadge status={rule.health} />
                      <span className="text-[10px] text-slate-500 font-mono">{rule.healthTime}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-400">{rule.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300 font-mono">{rule.effectiveFrom}</span>
                      <span className="text-[10px] text-slate-500 font-mono">至 {rule.effectiveTo}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-slate-300">{rule.hits7d}</span>
                      <span className="text-xs text-slate-500">/ {rule.hits30d}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded transition-colors" title="详情">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded transition-colors" title="再体检">
                        <Play size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors" title="复制">
                        <Copy size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded transition-colors" title="下线">
                        <AlertTriangle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-700/50 bg-slate-900/50 flex items-center justify-between text-sm text-slate-400">
          <div>共 {MOCK_RULES.length} 条规则</div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 hover:text-slate-200 transition-colors disabled:opacity-50">上一页</button>
            <span className="px-2 py-1 bg-slate-800 rounded text-slate-200">1</span>
            <button className="px-2 py-1 hover:text-slate-200 transition-colors disabled:opacity-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

