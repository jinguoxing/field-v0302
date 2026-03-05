import React from "react";
import { SectionTitle, NumberField, Select, JsonTextArea, TextField, ChipsInput } from "./components";
import { ConsistencyPayload } from "./types";

type ConsistencySubTab = "intra" | "inter";

interface ConsistencyRulesEditorProps {
  config: ConsistencyPayload;
  setConfig: (config: ConsistencyPayload) => void;
}

const GROUPING_TYPE_OPTIONS = [
  { label: "后缀 (suffix)", value: "suffix" },
  { label: "前缀 (prefix)", value: "prefix" },
  { label: "语义 (semantic)", value: "semantic" },
  { label: "正则 (regex)", value: "regex" },
];

export const ConsistencyRulesEditor: React.FC<ConsistencyRulesEditorProps> = ({ config, setConfig }) => {
  const [subTab, setSubTab] = React.useState<ConsistencySubTab>("intra");

  return (
    <div className="space-y-6">
      <SectionTitle title="一致性规则 (D6+D7)" desc="表内 (intra) 与 表间 (inter) 一致性推断" />

      {/* Sub-tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSubTab("intra")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            subTab === "intra"
              ? "bg-indigo-600 text-white"
              : "bg-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          表内一致性 (Intra)
        </button>
        <button
          onClick={() => setSubTab("inter")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            subTab === "inter"
              ? "bg-indigo-600 text-white"
              : "bg-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          表间一致性 (Inter)
        </button>
      </div>

      {/* Intra Tab */}
      {subTab === "intra" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-semibold text-slate-100">表内一致性 (Intra-table)</h3>

          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="相关性权重 (relUniqueWeight)"
              value={config.intra.relUniqueWeight}
              onChange={(v) =>
                setConfig({
                  ...config,
                  intra: { ...config.intra, relUniqueWeight: v },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
            <NumberField
              label="使用权重 (relUsageWeight)"
              value={config.intra.relUsageWeight}
              onChange={(v) =>
                setConfig({
                  ...config,
                  intra: { ...config.intra, relUsageWeight: v },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <div>
            <div className="text-xs text-slate-300 mb-3">分组规则 (groupingRules)</div>
            <div className="space-y-3">
              {config.intra.groupingRules.map((rule, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Select
                      label="类型"
                      value={rule.type}
                      onChange={(v) =>
                        setConfig({
                          ...config,
                          intra: {
                            ...config.intra,
                            groupingRules: config.intra.groupingRules.map((r, i) =>
                              i === idx ? { ...r, type: v as any } : r
                            ),
                          },
                        })
                      }
                      options={GROUPING_TYPE_OPTIONS}
                    />
                    <TextField
                      label="值"
                      value={rule.value}
                      onChange={(v) =>
                        setConfig({
                          ...config,
                          intra: {
                            ...config.intra,
                            groupingRules: config.intra.groupingRules.map((r, i) =>
                              i === idx ? { ...r, value: v } : r
                            ),
                          },
                        })
                      }
                    />
                    {rule.weight !== undefined && (
                      <NumberField
                        label="权重"
                        value={rule.weight}
                        onChange={(v) =>
                          setConfig({
                            ...config,
                            intra: {
                              ...config.intra,
                              groupingRules: config.intra.groupingRules.map((r, i) =>
                                i === idx ? { ...r, weight: v } : r
                              ),
                            },
                          })
                        }
                        step={0.1}
                      />
                    )}
                    <button
                      onClick={() =>
                        setConfig({
                          ...config,
                          intra: {
                            ...config.intra,
                            groupingRules: config.intra.groupingRules.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="px-2 py-1 bg-rose-900/30 text-rose-400 text-xs rounded hover:bg-rose-900/50"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                setConfig({
                  ...config,
                  intra: {
                    ...config.intra,
                    groupingRules: [
                      ...config.intra.groupingRules,
                      { type: "suffix", value: "", weight: 1.0 },
                    ],
                  },
                })
              }
              className="w-full mt-3 px-3 py-2 border border-dashed border-slate-700 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600"
            >
              + 添加分组规则
            </button>
          </div>
        </div>
      )}

      {/* Inter Tab */}
      {subTab === "inter" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-semibold text-slate-100">表间一致性 (Inter-table)</h3>

          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="名称相似度权重 (nameSimWeight)"
              value={config.inter.nameSimWeight}
              onChange={(v) =>
                setConfig({
                  ...config,
                  inter: { ...config.inter, nameSimWeight: v },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
            <NumberField
              label="值重叠权重 (valueOverlapWeight)"
              value={config.inter.valueOverlapWeight}
              onChange={(v) =>
                setConfig({
                  ...config,
                  inter: { ...config.inter, valueOverlapWeight: v },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
            <NumberField
              label="Join 证据权重 (joinEvidenceWeight)"
              value={config.inter.joinEvidenceWeight}
              onChange={(v) =>
                setConfig({
                  ...config,
                  inter: { ...config.inter, joinEvidenceWeight: v },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
            <NumberField
              label="强匹配阈值 (strongMatchThreshold)"
              value={config.inter.strongMatchThreshold}
              onChange={(v) =>
                setConfig({
                  ...config,
                  inter: { ...config.inter, strongMatchThreshold: v },
                })
              }
              min={0}
              max={1}
              step={0.05}
            />
          </div>

          <NumberField
            label="Top K 目标数 (topKTargets)"
            value={config.inter.topKTargets}
            onChange={(v) =>
              setConfig({
                ...config,
                inter: { ...config.inter, topKTargets: v },
              })
            }
            min={1}
            max={10}
            step={1}
          />
        </div>
      )}
    </div>
  );
};
