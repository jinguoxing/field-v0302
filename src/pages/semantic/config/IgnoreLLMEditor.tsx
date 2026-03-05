import React from "react";
import { SectionTitle, Toggle, NumberField, TextField, JsonTextArea, ChipsInput } from "./components";
import { IgnoreLLMPayload } from "./types";

interface IgnoreLLMEditorProps {
  config: IgnoreLLMPayload;
  setConfig: (config: IgnoreLLMPayload) => void;
}

type SubTab = "ignore" | "llm";

export const IgnoreLLMEditor: React.FC<IgnoreLLMEditorProps> = ({ config, setConfig }) => {
  const [subTab, setSubTab] = React.useState<SubTab>("ignore");

  return (
    <div className="space-y-6">
      <SectionTitle title="忽略 + LLM" desc="字段过滤规则与 LLM 干预配置" />

      {/* Sub-tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSubTab("ignore")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            subTab === "ignore"
              ? "bg-indigo-600 text-white"
              : "bg-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          忽略规则 (Ignore)
        </button>
        <button
          onClick={() => setSubTab("llm")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            subTab === "llm"
              ? "bg-indigo-600 text-white"
              : "bg-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          LLM 配置
        </button>
      </div>

      {/* Ignore Tab */}
      {subTab === "ignore" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-semibold text-slate-100">字段忽略规则</h3>

          <ChipsInput
            label="技术噪声模式 (techNoisePatterns)"
            value={config.ignore.techNoisePatterns}
            onChange={(v) =>
              setConfig({
                ...config,
                ignore: { ...config.ignore, techNoisePatterns: v },
              })
            }
            placeholder="输入正则模式后回车，如 ^_"
          />

          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="空值率高阈值 (nullRateHigh)"
              value={config.ignore.nullRateHigh}
              onChange={(v) =>
                setConfig({
                  ...config,
                  ignore: { ...config.ignore, nullRateHigh: v },
                })
              }
              min={0}
              max={1}
              step={0.05}
            />
            <NumberField
              label="低基数阈值 (distinctLow)"
              value={config.ignore.distinctLow}
              onChange={(v) =>
                setConfig({
                  ...config,
                  ignore: { ...config.ignore, distinctLow: v },
                })
              }
              min={0}
              max={1000}
              step={1}
            />
            <NumberField
              label="忽略分数最小值 (ignoreScoreMin)"
              value={config.ignore.ignoreScoreMin}
              onChange={(v) =>
                setConfig({
                  ...config,
                  ignore: { ...config.ignore, ignoreScoreMin: v },
                })
              }
              min={0}
              max={1}
              step={0.05}
            />
            <NumberField
              label="高频使用上限 (highUsageCap)"
              value={config.ignore.highUsageCap}
              onChange={(v) =>
                setConfig({
                  ...config,
                  ignore: { ...config.ignore, highUsageCap: v },
                })
              }
              min={0}
              max={1}
              step={0.05}
            />
          </div>

          <Toggle
            label="禁止键候选字段 (forbidIfKeyCandidate)"
            value={config.ignore.forbidIfKeyCandidate}
            onChange={(v) =>
              setConfig({
                ...config,
                ignore: { ...config.ignore, forbidIfKeyCandidate: v },
              })
            }
          />
        </div>
      )}

      {/* LLM Tab */}
      {subTab === "llm" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-semibold text-slate-100">LLM 干预配置</h3>

          <Toggle
            label="启用 LLM (enabled)"
            value={config.llm.enabled}
            onChange={(v) =>
              setConfig({
                ...config,
                llm: { ...config.llm, enabled: v },
              })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="完整度触发阈值 (completenessLt)"
              value={config.llm.trigger.completenessLt}
              onChange={(v) =>
                setConfig({
                  ...config,
                  llm: {
                    ...config.llm,
                    trigger: { ...config.llm.trigger, completenessLt: v },
                  },
                })
              }
              min={0}
              max={1}
              step={0.05}
            />
            <NumberField
              label="差距触发阈值 (gapLt)"
              value={config.llm.trigger.gapLt}
              onChange={(v) =>
                setConfig({
                  ...config,
                  llm: {
                    ...config.llm,
                    trigger: { ...config.llm.trigger, gapLt: v },
                  },
                })
              }
              min={0}
              max={1}
              step={0.05}
            />
          </div>

          <NumberField
            label="每候选最大增量 (maxDeltaPerCandidate)"
            value={config.llm.maxDeltaPerCandidate}
            onChange={(v) =>
              setConfig({
                ...config,
                llm: { ...config.llm, maxDeltaPerCandidate: v },
              })
            }
            min={0}
            max={0.1}
            step={0.01}
          />

          <TextField
            label="提示词版本 (promptVersion)"
            value={config.llm.promptVersion}
            onChange={(v) =>
              setConfig({
                ...config,
                llm: { ...config.llm, promptVersion: v },
              })
            }
          />

          <TextField
            label="模型 (model)"
            value={config.llm.model}
            onChange={(v) =>
              setConfig({
                ...config,
                llm: { ...config.llm, model: v },
              })
            }
          />

          <JsonTextArea
            label="输出模式 (outputSchema)"
            value={config.llm.outputSchema}
            onChange={(v) =>
              setConfig({
                ...config,
                llm: { ...config.llm, outputSchema: v },
              })
            }
            rows={6}
          />
        </div>
      )}
    </div>
  );
};
