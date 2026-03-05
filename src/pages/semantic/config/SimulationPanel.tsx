import React from 'react';
import { Play, RefreshCw, Save, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { SimulationSource, SimulationMode, SimulationResult, LogicView, ErrorSample, confidenceLevel, toPct } from './types';
import { cls } from './components';

interface SimulationPanelProps {
  simulationSource: SimulationSource;
  onSourceChange: (source: SimulationSource) => void;
  simulationInput: string;
  onInputChange: (input: string) => void;
  isSimulating: boolean;
  onSimulate: () => void;
  onSaveAsGolden: () => void;
  // New props for BASELINE/WHAT_IF modes
  mode: SimulationMode;
  onModeChange: (mode: SimulationMode) => void;
  baselineResult?: SimulationResult;
  whatIfResult?: SimulationResult;
  logicViews?: LogicView[];
  errorSamples?: ErrorSample[];
  // Collapse state
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  simulationSource,
  onSourceChange,
  simulationInput,
  onInputChange,
  isSimulating,
  onSimulate,
  onSaveAsGolden,
  mode,
  onModeChange,
  baselineResult,
  whatIfResult,
  logicViews = [
    { id: 'lv_user_profile', name: '用户画像视图', fields: ['user_id', 'user_name', 'age', 'gender', 'city_id'] },
    { id: 'lv_order_detail', name: '订单详情视图', fields: ['order_id', 'buyer_id', 'seller_id', 'amount', 'pay_time'] },
  ],
  errorSamples = [
    { id: 'err_001', field: 'status_code', table: 'dim_users', error: 'DIM 误判为 MEASURE' },
    { id: 'err_002', field: 'temp_col_01', table: 'fact_orders', error: 'UNKNOWN 误判为 DIM' },
    { id: 'err_003', field: 'user_phone', table: 'dim_users', error: 'NONE 误判为 FK' },
  ],
  collapsed = false,
  onToggleCollapse,
}) => {
  const currentResult = mode === 'BASELINE' ? baselineResult : whatIfResult;
  const currentErrorSample = errorSamples.find(s => s.id === simulationInput);
  const displayField = currentErrorSample?.field || simulationInput.split(':')[1] || simulationInput;
  const displayTable = currentErrorSample?.table || 'dim_users';

  return (
    <aside className={cls(
      "flex flex-col bg-slate-900/40 flex-shrink-0 transition-all duration-300 relative",
      collapsed ? "w-12" : "w-96"
    )}>
      <div className="p-4 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Play size={16} className="text-emerald-400" />
              即时仿真 (Live Simulation)
            </h2>
          )}
          <div className="flex items-center gap-1">
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className={cls(
                  "p-1.5 rounded-md transition-colors z-10",
                  collapsed
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                )}
                title={collapsed ? "展开仿真面板" : "收起仿真面板"}
              >
                <ChevronLeft size={14} className={cls("transition-transform", collapsed && "rotate-180")} />
              </button>
            )}
            {!collapsed && (
              <button
                onClick={onSimulate}
                className={`p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-md transition-colors ${isSimulating ? 'animate-spin' : ''}`}
                title="刷新仿真"
              >
                <RefreshCw size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {!collapsed && (
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar relative">
        {isSimulating && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="text-indigo-400 animate-spin" size={24} />
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">计算中...</span>
            </div>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => onModeChange('WHAT_IF')}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${
              mode === 'WHAT_IF'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            WHAT-IF
          </button>
          <button
            onClick={() => onModeChange('BASELINE')}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${
              mode === 'BASELINE'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            BASELINE
          </button>
        </div>

        {/* Data Source Selection */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">选择数据源 (Data Source)</h3>
          <div className="flex bg-slate-950 rounded-lg border border-slate-800 p-1">
            {[
              { id: 'Field ID' as const, label: '字段 ID' },
              { id: 'LV + Field' as const, label: '逻辑视图' },
              { id: 'Error Sample' as const, label: '错误样本' }
            ].map(src => (
              <button
                key={src.id}
                onClick={() => {
                  onSourceChange(src.id);
                  if (src.id === 'Field ID') onInputChange('fld_10293847');
                  if (src.id === 'LV + Field') onInputChange(`lv_user_profile:user_id`);
                  if (src.id === 'Error Sample') onInputChange('err_001');
                }}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${
                  simulationSource === src.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>

          {simulationSource === 'Field ID' && (
            <div className="relative">
              <input
                type="text"
                value={simulationInput}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="输入 Field ID..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
              />
              <button onClick={onSimulate} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors">
                <ArrowRight size={12} />
              </button>
            </div>
          )}

          {simulationSource === 'LV + Field' && (
            <div className="space-y-2">
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                onChange={(e) => {
                  const lv = logicViews.find(l => l.id === e.target.value);
                  if (lv) onInputChange(`${lv.id}:${lv.fields[0]}`);
                }}
              >
                {logicViews.map(lv => (
                  <option key={lv.id} value={lv.id}>{lv.name}</option>
                ))}
              </select>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                value={simulationInput.split(':')[1]}
                onChange={(e) => {
                  const lvId = simulationInput.split(':')[0];
                  onInputChange(`${lvId}:${e.target.value}`);
                }}
              >
                {logicViews.find(lv => lv.id === simulationInput.split(':')[0])?.fields.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          )}

          {simulationSource === 'Error Sample' && (
            <div className="space-y-2">
              <div className="max-h-40 overflow-y-auto border border-slate-800 rounded-lg bg-slate-950 custom-scrollbar">
                {errorSamples.map(sample => (
                  <button
                    key={sample.id}
                    onClick={() => onInputChange(sample.id)}
                    className={`w-full text-left p-2 border-b border-slate-800/50 last:border-0 transition-colors ${
                      simulationInput === sample.id ? 'bg-indigo-500/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-bold ${simulationInput === sample.id ? 'text-indigo-400' : 'text-slate-300'}`}>{sample.field}</span>
                      <span className="text-[9px] text-rose-400 bg-rose-500/10 px-1 rounded">{sample.error}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-mono">{sample.table}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
            <p className="text-[10px] text-slate-400 font-mono">字段 (Field): <span className="text-white">{displayField}</span></p>
            <p className="text-[10px] text-slate-400 font-mono">表 (Table): <span className="text-white">{displayTable}</span></p>
            <p className="text-[10px] text-slate-400 font-mono">类型 (Type): <span className="text-white">BIGINT</span></p>
          </div>
        </div>

        {/* Display Output */}
        {currentResult && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
              仿真输出 (Simulation Output)
              <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{mode === 'BASELINE' ? '基线' : '编辑'}版本</span>
            </h3>

            {/* Queue Status Pills */}
            <div className="flex flex-wrap gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentResult.queue === 'CONFLICT' ? 'bg-rose-900/40 text-rose-200 border border-rose-700/50' :
                currentResult.queue === 'AUTO_PASS' ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-700/50' :
                'bg-amber-900/40 text-amber-200 border border-amber-700/50'
              }`}>
                {currentResult.queue}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded-full">
                完整度 {toPct(currentResult.completeness)}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded-full">
                差距 {toPct(currentResult.gap12)}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded-full">
                忽略分 {toPct(currentResult.ignoreScore)}
              </span>
            </div>

            {/* Top 3 Predictions */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400">联合预测结果 (Joint Top 3)</p>
              {currentResult.jointTop3.map((pred, i) => (
                <div key={i} className={`flex items-center justify-between p-2 rounded-lg border ${
                  i === 0 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold ${i === 0 ? 'text-emerald-400' : 'text-slate-500'}`}>#{i + 1}</span>
                    <span className="text-xs font-bold text-white">{pred.semanticType} / {pred.role}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${i === 0 ? 'text-emerald-400' : 'text-slate-400'}`}>{toPct(pred.confidence)}</span>
                </div>
              ))}
              <div className="flex justify-between px-1 mt-1">
                <span className="text-[9px] text-slate-500">置信度差距 (Gap): <span className="text-emerald-400">{toPct(currentResult.gap12)}</span></span>
              </div>
            </div>

            {/* Evidence Top 3 */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400">核心证据 (Evidence Top 3)</p>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 space-y-2">
                {currentResult.evidenceTop3.map((ev, i) => (
                  <div key={i} className="flex justify-between text-[10px]">
                    <span className="text-slate-300">{ev.title}</span>
                    <span className="font-mono text-emerald-400">+{toPct(ev.contribution)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown by Dimension */}
            {currentResult.breakdownByDimension && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400">维度贡献 (Breakdown)</p>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 space-y-1">
                  {currentResult.breakdownByDimension.map((b, i) => (
                    <div key={i} className="flex justify-between text-[10px]">
                      <span className="text-slate-400">{b.key}</span>
                      <span className="font-mono text-emerald-400">+{toPct(b.contributionTop1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compat Warning */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-400">兼容性校验: OK</p>
                <p className="text-[10px] text-emerald-400/70 mt-0.5">类型 (ID) 与角色 (PK) 高度兼容。</p>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {!collapsed && (
      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <button
          onClick={onSaveAsGolden}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 hover:border-indigo-500/50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <Save size={14} />
          保存为回归样本 (Golden Set)
        </button>
      </div>
      )}
    </aside>
  );
};
