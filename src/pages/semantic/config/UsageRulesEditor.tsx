import React from "react";
import { SectionTitle, NumberField } from "./components";
import { UsagePayload } from "./types";

interface UsageRulesEditorProps {
  config: UsagePayload;
  setConfig: (config: UsagePayload) => void;
}

export const UsageRulesEditor: React.FC<UsageRulesEditorProps> = ({ config, setConfig }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <SectionTitle title="使用规则 (D4)" desc="基于字段使用模式（join、group by、过滤等）的特征推断" />

      {/* Global Params */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-100">全局参数</h3>

        <NumberField
          label="P95 阈值 (p95_u)"
          value={config.p95_u}
          onChange={(v) => setConfig({ ...config, p95_u: v })}
          min={0}
        />

        <div className="pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-300 mb-2">变换函数 (function)</div>
          <div className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-400">
            {config.function} (logarithmic)
          </div>
        </div>
      </div>

      {/* Role Weights */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-100">角色权重配置</h3>

        <div className="space-y-3">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="text-xs font-medium text-slate-300 mb-3">FOREIGN_KEY</div>
            <NumberField
              label="join_weight"
              value={config.map.FOREIGN_KEY.join_weight}
              onChange={(v) =>
                setConfig({
                  ...config,
                  map: {
                    ...config.map,
                    FOREIGN_KEY: { ...config.map.FOREIGN_KEY, join_weight: v },
                  },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="text-xs font-medium text-slate-300 mb-3">DIMENSION</div>
            <NumberField
              label="groupby_weight"
              value={config.map.DIMENSION.groupby_weight}
              onChange={(v) =>
                setConfig({
                  ...config,
                  map: {
                    ...config.map,
                    DIMENSION: { ...config.map.DIMENSION, groupby_weight: v },
                  },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
            <NumberField
              label="filter_weight"
              value={config.map.DIMENSION.filter_weight}
              onChange={(v) =>
                setConfig({
                  ...config,
                  map: {
                    ...config.map,
                    DIMENSION: { ...config.map.DIMENSION, filter_weight: v },
                  },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="text-xs font-medium text-slate-300 mb-3">MEASURE</div>
            <NumberField
              label="agg_weight"
              value={config.map.MEASURE.agg_weight}
              onChange={(v) =>
                setConfig({
                  ...config,
                  map: {
                    ...config.map,
                    MEASURE: { ...config.map.MEASURE, agg_weight: v },
                  },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="text-xs font-medium text-slate-300 mb-3">EVENT_TIME</div>
            <NumberField
              label="time_range_weight"
              value={config.map.EVENT_TIME.time_range_weight}
              onChange={(v) =>
                setConfig({
                  ...config,
                  map: {
                    ...config.map,
                    EVENT_TIME: { ...config.map.EVENT_TIME, time_range_weight: v },
                  },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
