
import React from 'react';
import { StageId } from '../../../types/aiops';
import { FieldDrawer } from '../../semantic/FieldDrawer';
import { 
  Database, Search, ShieldCheck, Brain, Lightbulb, ArrowLeft,
  CheckCircle2, AlertCircle, Settings, RefreshCcw, Eye,
  Shield, Zap, Clock, Target, ExternalLink, Activity,
  MousePointer2, GitBranch, AlertOctagon, ArrowUpRight,
  ListFilter, Layers, FileJson, ArrowUp, Table2, GitCompare,
  AlertTriangle, EyeOff, ChevronRight, X, Info, Check, RotateCw,
  LayoutGrid, BarChart3, GitMerge, Box, Fingerprint, Link2, Scissors,
  Combine, Move, Download
} from 'lucide-react';

interface StageDetailProps {
  stageId: StageId;
  requestId: string;
  onBack?: () => void;
}

export const StageDetailContent: React.FC<StageDetailProps> = ({ stageId, requestId, onBack }) => {
  const [selectedField, setSelectedField] = React.useState<string | null>(null);

  const renderFieldDrawer = () => {
    if (!selectedField) return null;

    return (
      <div className="fixed inset-y-0 right-0 w-[450px] z-50">
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setSelectedField(null)}></div>
        <div className="relative h-full">
          <FieldDrawer 
            fieldId={selectedField} 
            onClose={() => setSelectedField(null)}
            onConfirm={(id) => {
              console.log('Confirmed field:', id);
              setSelectedField(null);
            }}
            onIgnore={(id) => {
              console.log('Ignored field:', id);
              setSelectedField(null);
            }}
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (stageId) {
      case 'A':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section 1: Connection Status */}
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Database className="text-cyan-400" size={18} /> 连接状态
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-bold uppercase">已连接</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">认证模式</p>
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-indigo-400" />
                    <p className="text-sm font-medium text-slate-200">Vault (企业级)</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">最后测试时间</p>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <p className="text-sm font-medium text-slate-200">2024-02-28 10:15:32</p>
                  </div>
                </div>
              </div>

              {/* Error display if any (mocking no error) */}
              {/* 
              <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-rose-400 mt-0.5" size={16} />
                <p className="text-xs text-rose-300 leading-relaxed">Failed to connect: Connection timeout after 30s. Please check your firewall settings.</p>
              </div>
              */}
            </div>

            {/* Section 2: Scope & Budget */}
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider mb-6">
                <Target className="text-indigo-400" size={18} /> 范围与预算
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-3">包含 / 排除规则</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-mono">include: public.*</span>
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-mono">include: sales.*</span>
                    <span className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-mono">exclude: *.tmp_*</span>
                    <span className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-mono">exclude: test.*</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center gap-1">
                      <Zap size={10} /> 扫描预算
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">最大行数</span>
                        <span className="text-slate-200 font-mono">10,000,000</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">QPS 限制</span>
                        <span className="text-slate-200 font-mono">500</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center gap-1">
                      <Clock size={10} /> 性能配置
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">并发数</span>
                        <span className="text-slate-200 font-mono">8</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">超时时间</span>
                        <span className="text-slate-200 font-mono">60s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2">
                <Settings size={16} /> 前往数据源设置
              </button>
              <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2">
                <RefreshCcw size={16} /> 重试阶段 A
              </button>
            </div>
            
            <button className="w-full py-3 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-bold border border-dashed border-slate-700 transition-all flex items-center justify-center gap-2">
              <Eye size={16} /> 查看数据源详情 <ExternalLink size={14} />
            </button>
          </div>
        );
      case 'B':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section 1: Summary Metrics (Four Quadrants) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="text-cyan-400" size={16} />
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Schema Coverage</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-xs text-slate-500">字段 (PK: 4, FK: 12)</p>
                </div>
              </div>
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="text-emerald-400" size={16} />
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Profile Completeness</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-emerald-400">98.2%</p>
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '98.2%' }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MousePointer2 className="text-indigo-400" size={16} />
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Usage Coverage</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-white">85.0%</p>
                  <p className="text-xs text-slate-500">2.4k Queries</p>
                </div>
              </div>
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <GitBranch className="text-amber-400" size={16} />
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Lineage Coverage</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-white">72.5%</p>
                  <p className="text-xs text-slate-500">Upstream: 3</p>
                </div>
              </div>
            </div>

            {/* Section 2: Degraded Notice (Mocking a warning) */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                  <AlertOctagon size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-amber-400 mb-1">检测到数据画像降级 (Degraded)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    原因：<span className="text-slate-200">timeout (扫描超时)</span>。由于 `public.order_items` 表数据量过大，部分深度画像指标已跳过。
                  </p>
                  <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 mb-3">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">潜在影响预测</p>
                    <div className="flex items-center gap-2">
                      <Brain size={14} className="text-indigo-400" />
                      <p className="text-xs text-slate-300">Stage D 语义识别可能从 <span className="text-emerald-400 font-bold">L2</span> 降级为 <span className="text-amber-400 font-bold">L1</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">自动重试已触发</span>
                    <span className="text-[10px] text-slate-500 italic">策略：降低采样率至 0.1% (成功)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Fields Profile Table */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">字段画像明细 (Drilldown)</h4>
                <button className="text-[10px] font-bold text-cyan-400 hover:underline flex items-center gap-1">
                  查看完整扫描报告 <ArrowUpRight size={12} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-700/50">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">字段名称</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">非空率</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">唯一性</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">枚举数</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Top Values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {[
                      { name: 'order_id', null: '100%', unique: 'Yes', distinct: '1.2M', top: '-' },
                      { name: 'status', null: '100%', unique: 'No', distinct: '5', top: 'paid, shipped...' },
                      { name: 'cust_id', null: '99.8%', unique: 'No', distinct: '450k', top: '-' },
                      { name: 'total_amt', null: '100%', unique: 'No', distinct: '85k', top: '0.00, 99.00...' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-slate-300">{row.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-400 text-center">{row.null}</td>
                        <td className="px-4 py-3 text-xs text-slate-400 text-center">{row.unique}</td>
                        <td className="px-4 py-3 text-xs text-slate-400 text-center">{row.distinct}</td>
                        <td className="px-4 py-3 text-[10px] text-slate-500 italic">{row.top}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2">
                <Settings size={16} /> 调整扫描策略
              </button>
              <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2">
                <RefreshCcw size={16} /> 降低采样率重试
              </button>
            </div>
          </div>
        );
      case 'C':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section 1: Rules Draft Summary */}
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <ShieldCheck className="text-emerald-400" size={18} /> 质量规则草案摘要
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">45</span>
                  <span className="text-xs text-slate-500 uppercase font-bold">条规则已生成</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <ListFilter size={12} /> 按类型分布 (By Type)
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: '非空约束 (Not Null)', count: 18, color: 'bg-indigo-500' },
                      { label: '唯一性 (Unique)', count: 8, color: 'bg-cyan-500' },
                      { label: '数值范围 (Range)', count: 6, color: 'bg-emerald-500' },
                      { label: '正则校验 (Regex)', count: 5, color: 'bg-amber-500' },
                      { label: '外键关联 (FK)', count: 4, color: 'bg-rose-500' },
                      { label: '波动率 (Volatility)', count: 4, color: 'bg-slate-500' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                          <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{item.label}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <Layers size={12} /> 按优先级 (By Level)
                  </p>
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold">P1</span>
                        <span className="text-xs text-slate-300">核心阻塞</span>
                      </div>
                      <span className="text-sm font-bold text-white">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] font-bold">P2</span>
                        <span className="text-xs text-slate-300">常规预警</span>
                      </div>
                      <span className="text-sm font-bold text-white">33</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[9px] text-slate-500 italic leading-relaxed">L2 语义引擎默认生成 P1/P2 级规则，建议人工复核后提升至 P0。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Top Findings */}
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <AlertCircle className="text-rose-400" size={18} /> 检测发现 (Top Findings)
                </h3>
                <div className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
                  <span className="text-xs font-bold">156 处违规</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { rule: 'cust_id 关联完整性校验', count: 84, field: 'public.orders.cust_id', reason: '存在 12% 的孤立订单' },
                  { rule: 'total_amt 非负校验', count: 42, field: 'public.order_items.total_amt', reason: '发现 3 笔负数金额记录' },
                  { rule: 'status 枚举值校验', count: 30, field: 'public.orders.status', reason: '存在未知状态码 "REFUNDING"' },
                ].map((finding, i) => (
                  <div key={i} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 group hover:border-rose-500/30 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-200">{finding.rule}</h4>
                      <span className="text-[10px] font-mono text-rose-400 font-bold">{finding.count} 错误</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">{finding.field}</span>
                      <span className="text-slate-700">•</span>
                      <span className="text-[10px] text-slate-400 italic">{finding.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2">
                <ExternalLink size={16} /> 打开质量草案工作台
              </button>
              <button className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2">
                <ArrowUp size={16} /> 批量提升规则等级
              </button>
              <button className="col-span-2 py-3 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-bold border border-dashed border-slate-700 transition-all flex items-center justify-center gap-2">
                <FileJson size={16} /> 导出规则集 (JSON/SQL)
              </button>
            </div>
          </div>
        );
      case 'D':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* D.1 Table Summary */}
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider mb-6">
                <Table2 className="text-cyan-400" size={18} /> 表级语义摘要 (Table Summary)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">表类型 (Type)</p>
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-bold">FACT</span>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">粒度建议 (Grain)</p>
                  <p className="text-xs text-slate-200 font-medium">订单行 (Order Item)</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">主实体 (Entity)</p>
                  <p className="text-xs text-slate-200 font-medium">零售订单 (Sales Order)</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">时间字段 (Time)</p>
                  <p className="text-xs text-slate-200 font-mono">created_at</p>
                </div>
              </div>
            </div>

            {/* D.2 Route Distribution */}
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <GitCompare className="text-indigo-400" size={18} /> 路由分布总览 (Route Distribution)
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">自动确认率</p>
                    <p className="text-sm font-bold text-emerald-400">78.5%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">未知占比</p>
                    <p className="text-sm font-bold text-amber-400">12.0%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex h-3 rounded-full overflow-hidden bg-slate-700">
                  <div className="h-full bg-emerald-500" style={{ width: '65%' }} title="AUTO_PASS"></div>
                  <div className="h-full bg-indigo-500" style={{ width: '15%' }} title="NEEDS_CONFIRM"></div>
                  <div className="h-full bg-rose-500" style={{ width: '8%' }} title="CONFLICT"></div>
                  <div className="h-full bg-amber-500" style={{ width: '7%' }} title="ANOMALY"></div>
                  <div className="h-full bg-slate-500" style={{ width: '5%' }} title="IGNORE_CANDIDATE"></div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {[
                    { label: 'AUTO_PASS', color: 'bg-emerald-500', count: 102 },
                    { label: 'NEEDS_CONFIRM', color: 'bg-indigo-500', count: 24 },
                    { label: 'CONFLICT', color: 'bg-rose-500', count: 12 },
                    { label: 'ANOMALY', color: 'bg-amber-500', count: 11 },
                    { label: 'IGNORE', color: 'bg-slate-500', count: 7 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                      <span className="text-[10px] text-slate-400 font-bold">{item.label}</span>
                      <span className="text-[10px] text-slate-600 font-mono">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* D.3 Hotspots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5">
                <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> 语义冲突 (Top Conflicts)
                </h4>
                <div className="space-y-2">
                  {['cust_type', 'order_status', 'pay_method'].map((field, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <span className="text-xs font-mono text-slate-300">{field}</span>
                      <ChevronRight size={12} className="text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertTriangle size={14} /> 异常识别 (Top Anomalies)
                </h4>
                <div className="space-y-2">
                  {['discount_amt', 'tax_rate', 'shipping_fee'].map((field, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <span className="text-xs font-mono text-slate-300">{field}</span>
                      <ChevronRight size={12} className="text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <EyeOff size={14} /> 忽略建议 (Top Ignore)
                </h4>
                <div className="space-y-2">
                  {['temp_id', 'sync_ts', 'row_version'].map((field, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <span className="text-xs font-mono text-slate-300">{field}</span>
                      <ChevronRight size={12} className="text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* D.4 Fields Decision Table */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/30">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">字段决策明细 (Decision Table)</h4>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                      type="text" 
                      placeholder="搜索字段..." 
                      className="bg-slate-900 border border-slate-700 rounded-lg py-1.5 pl-8 pr-3 text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-700/50">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">字段名称</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Top1 类型/角色</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">置信度/Gap</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">完整度</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">忽略分</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">路由</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {[
                      { name: 'order_id', type: 'ID / PRIMARY_KEY', conf: '0.98', gap: '0.45', comp: '100%', ignore: '0.02', route: 'AUTO_PASS' },
                      { name: 'cust_id', type: 'ID / FOREIGN_KEY', conf: '0.92', gap: '0.38', comp: '99%', ignore: '0.05', route: 'AUTO_PASS' },
                      { name: 'total_amt', type: 'MEASURE / AMOUNT', conf: '0.85', gap: '0.12', comp: '100%', ignore: '0.01', route: 'NEEDS_CONFIRM' },
                      { name: 'status', type: 'DIM / CATEGORY', conf: '0.72', gap: '0.05', comp: '100%', ignore: '0.08', route: 'CONFLICT' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-700/20 transition-colors group">
                        <td className="px-4 py-3 text-xs font-mono text-slate-300">{row.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">{row.type}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-mono text-slate-200">{row.conf}</span>
                            <span className="text-[9px] text-slate-600 font-mono">Δ {row.gap}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400 text-center">{row.comp}</td>
                        <td className="px-4 py-3 text-xs text-slate-400 text-center">{row.ignore}</td>
                        <td className="px-4 py-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            row.route === 'AUTO_PASS' ? 'bg-emerald-500/10 text-emerald-400' :
                            row.route === 'NEEDS_CONFIRM' ? 'bg-indigo-500/10 text-indigo-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {row.route}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => setSelectedField(row.name)}
                            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-white transition-all"
                          >
                            <ArrowUpRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-slate-900/30 border-t border-slate-700/50 text-center">
                <button className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-2 mx-auto">
                  打开完整语义工作台 <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      case 'E':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* E.1 Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <LayoutGrid className="text-cyan-400" size={18} />
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">候选对象总数</h4>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">12</p>
                  <p className="text-xs text-slate-500">个对象建议</p>
                </div>
              </div>
              
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="text-emerald-400" size={18} />
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">评分分布</h4>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-emerald-400">高 (0.8+)</span>
                      <span className="text-slate-400">5</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-amber-400">中 (0.5-0.8)</span>
                      <span className="text-slate-400">4</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <GitMerge className="text-indigo-400" size={18} />
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">合并/拆分建议</h4>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">3</p>
                  <p className="text-xs text-slate-500">处潜在优化</p>
                </div>
              </div>
            </div>

            {/* E.2 Candidate List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Box className="text-amber-400" size={18} /> 候选对象列表 (Top Candidates)
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { 
                    name: 'SalesOrder (销售订单)', 
                    score: 0.94, 
                    metrics: { identity: 0.98, cohesion: 0.92, separation: 0.88, support: 0.95 } 
                  },
                  { 
                    name: 'CustomerProfile (客户画像)', 
                    score: 0.88, 
                    metrics: { identity: 0.85, cohesion: 0.90, separation: 0.82, support: 0.88 } 
                  },
                  { 
                    name: 'ProductCatalog (商品目录)', 
                    score: 0.76, 
                    metrics: { identity: 0.72, cohesion: 0.80, separation: 0.75, support: 0.82 },
                    suggestion: '建议与 Inventory 合并'
                  },
                ].map((obj, i) => (
                  <div key={i} className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                          <Box className="text-slate-500 group-hover:text-indigo-400" size={24} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">{obj.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">ScoreObject</span>
                            <span className="text-sm font-mono font-bold text-emerald-400">{obj.score}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all">
                          合并/拆分建议
                        </button>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/20 transition-all">
                          在建模页打开
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      {[
                        { label: '身份强度', icon: <Fingerprint size={12} />, value: obj.metrics.identity },
                        { label: '内聚度', icon: <Combine size={12} />, value: obj.metrics.cohesion },
                        { label: '分离度', icon: <Move size={12} />, value: obj.metrics.separation },
                        { label: '关系支撑', icon: <Link2 size={12} />, value: obj.metrics.support },
                      ].map((m, j) => (
                        <div key={j} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                              {m.icon} {m.label}
                            </span>
                            <span className="text-[10px] font-mono text-slate-300">{m.value}</span>
                          </div>
                          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${m.value * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {obj.suggestion && (
                      <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center gap-2">
                        <AlertCircle className="text-amber-400" size={14} />
                        <p className="text-[11px] text-amber-400 font-medium">{obj.suggestion}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* E.3 Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2">
                <LayoutGrid size={16} /> 打开候选对象工作台
              </button>
              <button className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2">
                <Download size={16} /> 导出候选对象 (JSON/Excel)
              </button>
              <button className="col-span-2 py-3 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-bold border border-dashed border-slate-700 transition-all flex items-center justify-center gap-2">
                <RefreshCcw size={16} /> 基于最新语义裁决重新生成 (Rebuild)
              </button>
            </div>
          </div>
        );
      default:
        return <div>未知阶段</div>;
    }
  };

  const stageTitles: Record<StageId, string> = {
    A: '数据源配置与启用',
    B: '扫描与画像',
    C: '质量规则与检测',
    D: '语义理解结果',
    E: '候选对象建议'
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">阶段 {stageId} - {stageTitles[stageId]}</h2>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                已完成
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">最后更新: 2024-02-28 10:15:32 • 需求: {requestId}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {renderContent()}
      </div>
      {renderFieldDrawer()}
    </div>
  );
};
