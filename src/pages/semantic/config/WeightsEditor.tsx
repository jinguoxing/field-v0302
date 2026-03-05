import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { WeightsConfig, DIMENSIONS } from './types';

interface WeightsEditorProps {
  config: WeightsConfig;
  setConfig: (config: WeightsConfig) => void;
}

export const WeightsEditor: React.FC<WeightsEditorProps> = ({ config, setConfig }) => {
  const typeSum = (Object.values(config.dimension_weights.type) as number[]).reduce((a, b) => a + b, 0);
  const roleSum = (Object.values(config.dimension_weights.role) as number[]).reduce((a, b) => a + b, 0);

  const isTypeSumValid = Math.abs(typeSum - 1) < 1e-6;
  const isRoleSumValid = Math.abs(roleSum - 1) < 1e-6;

  const queueConsistency = config.thresholds.queue.auto_pass.top1_conf_min > config.thresholds.queue.conflict.gap12_max;

  return (
    <div className="space-y-6">
      {/* Global Params */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-800/30">
          <h3 className="text-xs font-bold text-slate-300">全局参数 (Global Params)</h3>
          <p className="text-[9px] text-slate-500">影响置信度分布与联合候选计算</p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Softmax Tau (τ)</label>
            <input
              type="number"
              step="0.1"
              min="0.01"
              value={config.softmax.tau}
              onChange={(e) => setConfig({ ...config, softmax: { tau: parseFloat(e.target.value) || 0 } })}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[9px] text-slate-500 italic">控制预测分布的平滑度，必须 &gt; 0</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Joint Alpha (α)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={config.joint.alpha}
              onChange={(e) => setConfig({ ...config, joint: { alpha: parseFloat(e.target.value) || 0 } })}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[9px] text-slate-500 italic">联合预测权重，范围 [0, 1]</p>
          </div>
        </div>
      </section>

      {/* Dimension Weights */}
      <div className="grid grid-cols-2 gap-6">
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-300">类型权重 (Type Weights)</h3>
            <span className={`text-[10px] font-mono ${isTypeSumValid ? 'text-emerald-500' : 'text-rose-500'}`}>
              Sum: {typeSum.toFixed(4)}
            </span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {DIMENSIONS.map(dim => (
              <div key={dim} className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 w-4">{dim.slice(0, 4)}</span>
                <input
                  type="number"
                  step="0.01"
                  value={config.dimension_weights.type[dim]}
                  onChange={(e) => {
                    const newType = { ...config.dimension_weights.type, [dim]: parseFloat(e.target.value) || 0 };
                    setConfig({ ...config, dimension_weights: { ...config.dimension_weights, type: newType } });
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-300">角色权重 (Role Weights)</h3>
            <span className={`text-[10px] font-mono ${isRoleSumValid ? 'text-emerald-500' : 'text-rose-500'}`}>
              Sum: {roleSum.toFixed(4)}
            </span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {Object.entries(config.dimension_weights.role).map(([dim, val]) => (
              <div key={dim} className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 w-12 truncate">{dim}</span>
                <input
                  type="number"
                  step="0.01"
                  value={val}
                  onChange={(e) => {
                    const newRole = { ...config.dimension_weights.role, [dim]: parseFloat(e.target.value) || 0 };
                    setConfig({ ...config, dimension_weights: { ...config.dimension_weights, role: newRole } });
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Thresholds */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-800/30">
          <h3 className="text-xs font-bold text-slate-300">队列阈值 (Queue Thresholds)</h3>
          <p className="text-[9px] text-slate-500">影响左侧分流：AUTO_PASS / CONFLICT / IGNORE_CANDIDATE</p>
        </div>
        <div className="p-4 space-y-4">
          {/* Completeness Thresholds */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Completeness Low</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={config.thresholds.completeness_low}
                onChange={(e) => setConfig({ ...config, thresholds: { ...config.thresholds, completeness_low: parseFloat(e.target.value) || 0 } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Completeness LLM</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={config.thresholds.completeness_llm}
                onChange={(e) => setConfig({ ...config, thresholds: { ...config.thresholds, completeness_llm: parseFloat(e.target.value) || 0 } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Auto Pass */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="text-[10px] font-bold text-emerald-400">AUTO_PASS</div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="0.01"
                label="top1_conf_min"
                value={config.thresholds.queue.auto_pass.top1_conf_min}
                onChange={(e) => setConfig({
                  ...config,
                  thresholds: {
                    ...config.thresholds,
                    queue: {
                      ...config.thresholds.queue,
                      auto_pass: { ...config.thresholds.queue.auto_pass, top1_conf_min: parseFloat(e.target.value) || 0 }
                    }
                  }
                })}
                className="bg-slate-900 border border-slate-700 px-2 py-1 text-[10px] text-slate-300"
              />
              <input
                type="number"
                step="0.01"
                label="gap12_min"
                value={config.thresholds.queue.auto_pass.gap12_min}
                onChange={(e) => setConfig({
                  ...config,
                  thresholds: {
                    ...config.thresholds,
                    queue: {
                      ...config.thresholds.queue,
                      auto_pass: { ...config.thresholds.queue.auto_pass, gap12_min: parseFloat(e.target.value) || 0 }
                    }
                  }
                })}
                className="bg-slate-900 border border-slate-700 px-2 py-1 text-[10px] text-slate-300"
              />
              <input
                type="number"
                step="0.01"
                label="completeness_min"
                value={config.thresholds.queue.auto_pass.completeness_min}
                onChange={(e) => setConfig({
                  ...config,
                  thresholds: {
                    ...config.thresholds,
                    queue: {
                      ...config.thresholds.queue,
                      auto_pass: { ...config.thresholds.queue.auto_pass, completeness_min: parseFloat(e.target.value) || 0 }
                    }
                  }
                })}
                className="bg-slate-900 border border-slate-700 px-2 py-1 text-[10px] text-slate-300"
              />
            </div>
          </div>

          {/* Conflict */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[10px] font-bold text-rose-400 mb-2">CONFLICT</div>
            <input
              type="number"
              step="0.01"
              label="gap12_max"
              value={config.thresholds.queue.conflict.gap12_max}
              onChange={(e) => setConfig({
                ...config,
                thresholds: {
                  ...config.thresholds,
                  queue: {
                    ...config.thresholds.queue,
                    conflict: { gap12_max: parseFloat(e.target.value) || 0 }
                  }
                }
              })}
              className="w-full bg-slate-900 border border-slate-700 px-2 py-1 text-[10px] text-slate-300"
            />
          </div>

          {/* Ignore Candidate */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[10px] font-bold text-amber-400 mb-2">IGNORE_CANDIDATE</div>
            <input
              type="number"
              step="0.01"
              label="ignore_score_min"
              value={config.thresholds.queue.ignore_candidate.ignore_score_min}
              onChange={(e) => setConfig({
                ...config,
                thresholds: {
                  ...config.thresholds,
                  queue: {
                    ...config.thresholds.queue,
                    ignore_candidate: { ignore_score_min: parseFloat(e.target.value) || 0 }
                  }
                }
              })}
              className="w-full bg-slate-900 border border-slate-700 px-2 py-1 text-[10px] text-slate-300"
            />
          </div>
        </div>
      </section>

      {/* Unknown Policy */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-800/30">
          <h3 className="text-xs font-bold text-slate-300">未知策略 (Unknown Policy)</h3>
        </div>
        <div className="p-4 grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">When Completeness &lt;</label>
            <input
              type="number"
              step="0.05"
              value={config.unknown_policy.when_completeness_lt}
              onChange={(e) => setConfig({ ...config, unknown_policy: { ...config.unknown_policy, when_completeness_lt: parseFloat(e.target.value) || 0 } })}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Non-Unknown Penalty</label>
            <input
              type="number"
              step="0.1"
              value={config.unknown_policy.non_unknown_penalty}
              onChange={(e) => setConfig({ ...config, unknown_policy: { ...config.unknown_policy, non_unknown_penalty: parseFloat(e.target.value) || 0 } })}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Unknown Bonus</label>
            <input
              type="number"
              step="0.1"
              value={config.unknown_policy.unknown_bonus}
              onChange={(e) => setConfig({ ...config, unknown_policy: { ...config.unknown_policy, unknown_bonus: parseFloat(e.target.value) || 0 } })}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* LLM Policy */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-800/30">
          <h3 className="text-xs font-bold text-slate-300">LLM 介入限制 (LLM Policy)</h3>
          <p className="text-[9px] text-slate-500">LLM 仅用于解释与小幅调分（≤0.05）</p>
        </div>
        <div className="p-4 grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Max Calls Per LV</label>
            <input
              type="number"
              min="0"
              value={config.llm.max_calls_per_lv}
              onChange={(e) => setConfig({ ...config, llm: { ...config.llm, max_calls_per_lv: parseInt(e.target.value) || 0 } })}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Max Delta Per Candidate</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="0.05"
              value={config.llm.max_delta_per_candidate}
              onChange={(e) => setConfig({ ...config, llm: { ...config.llm, max_delta_per_candidate: parseFloat(e.target.value) || 0 } })}
              className={`w-full bg-slate-950 border rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 ${config.llm.max_delta_per_candidate > 0.05 ? 'border-rose-500' : 'border-slate-800'}`}
            />
            {config.llm.max_delta_per_candidate > 0.05 && <p className="text-[9px] text-rose-500">必须 ≤ 0.05</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Enabled Default</label>
            <button
              onClick={() => setConfig({ ...config, llm: { ...config.llm, enabled_default: !config.llm.enabled_default } })}
              className={`w-12 h-6 rounded-full border transition mt-1 ${
                config.llm.enabled_default ? 'bg-emerald-700/40 border-emerald-600' : 'bg-slate-800 border-slate-700'
              }`}
              type="button"
            >
              <span className={`block w-5 h-5 rounded-full bg-slate-200 transition translate-x-0.5 ${config.llm.enabled_default ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Table Type Prior */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-800/30">
          <h3 className="text-xs font-bold text-slate-300">表类型先验 (Table Type Prior)</h3>
        </div>
        <div className="p-4 space-y-3">
          {Object.entries(config.table_role_prior).map(([tableType, priors]) => (
            <div key={tableType} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="text-[10px] font-bold text-slate-300 mb-2">{tableType}</div>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(priors).map(([role, value]) => (
                  <div key={role} className="flex items-center gap-1">
                    <span className="text-[9px] text-slate-500 w-16 truncate">{role}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={value}
                      onChange={(e) => setConfig({
                        ...config,
                        table_role_prior: {
                          ...config.table_role_prior,
                          [tableType]: { ...config.table_role_prior[tableType], [role]: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      className="flex-1 bg-slate-900 border border-slate-700 px-2 py-1 text-[10px] text-slate-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Validation Summary */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          配置校验 (Config Validation)
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px]">
            {isTypeSumValid ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-rose-500" />}
            <span className={isTypeSumValid ? "text-slate-400" : "text-rose-400"}>类型权重和 = 1 (当前: {typeSum.toFixed(6)})</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            {isRoleSumValid ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-rose-500" />}
            <span className={isRoleSumValid ? "text-slate-400" : "text-rose-400"}>角色权重和 = 1 (当前: {roleSum.toFixed(6)})</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            {config.softmax.tau > 0 ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-rose-500" />}
            <span className={config.softmax.tau > 0 ? "text-slate-400" : "text-rose-400"}>Tau &gt; 0</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            {queueConsistency ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-rose-500" />}
            <span className={queueConsistency ? "text-slate-400" : "text-rose-400"}>队列阈值一致性 (Auto Pass top1_conf &gt; Conflict gap_max)</span>
          </div>
        </div>
      </section>
    </div>
  );
};
