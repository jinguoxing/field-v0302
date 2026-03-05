import React from "react";
import { EntityList, ListItem, SectionTitle, Toggle, Select, TextField, JsonTextArea, DeltaTable, NumberField } from "./components";
import { ProfilePayload, ProfileDetector } from "./types";

const TYPE_OPTIONS = ["ID", "DIM", "MEASURE", "TIME", "STATUS", "CATEGORY", "PHONE", "CODE", "UNKNOWN"];
const ROLE_OPTIONS = ["PRIMARY_KEY", "FOREIGN_KEY", "DIMENSION", "MEASURE", "EVENT_TIME", "AUDIT_FIELD", "STATUS"];
const FUNCTION_OPTIONS = [
  { label: "Piecewise Linear (分段线性)", value: "piecewise_linear" },
  { label: "Logistic (逻辑函数)", value: "logistic" },
];

interface ProfileRulesEditorProps {
  config: ProfilePayload;
  setConfig: (config: ProfilePayload) => void;
}

export const ProfileRulesEditor: React.FC<ProfileRulesEditorProps> = ({ config, setConfig }) => {
  const [selectedId, setSelectedId] = React.useState<string>(config.detectors[0]?.detector_id || "");

  const items: ListItem[] = config.detectors.map((d) => ({
    id: d.detector_id,
    title: d.detector_id,
    subtitle: d.title_template || "",
    badges: [{ text: d.enabled ? "Enabled" : "Disabled", tone: d.enabled ? "green" : "gray" }],
  }));

  const selected = config.detectors.find((d) => d.detector_id === selectedId);

  function updateDetector(updater: (d: ProfileDetector) => ProfileDetector) {
    setConfig({
      ...config,
      detectors: config.detectors.map((d) => (d.detector_id === selectedId ? updater(d) : d)),
    });
  }

  return (
    <div className="flex gap-6">
      {/* Left: List */}
      <div className="w-80 flex-shrink-0">
        <EntityList
          items={items}
          selectedId={selectedId}
          onSelect={setSelectedId}
          header={{ title: "探测规则", desc: "基于字段统计分布的特征检测器" }}
        />
      </div>

      {/* Right: Editor */}
      <div className="flex-1 min-w-0">
        {!selected ? (
          <div className="text-center py-12 text-slate-500">未选择规则</div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <SectionTitle title={selected.detector_id} desc={selected.title_template} />
              <Toggle
                label="启用"
                value={selected.enabled}
                onChange={(v) => updateDetector((d) => ({ ...d, enabled: v }))}
              />
            </div>

            {/* Function Type */}
            <Select
              label="函数类型"
              value={selected.function}
              onChange={(v) => updateDetector((d) => ({ ...d, function: v as any }))}
              options={FUNCTION_OPTIONS}
            />

            {/* Params */}
            <JsonTextArea
              label="参数配置 (JSON)"
              value={selected.params}
              onChange={(v) => updateDetector((d) => ({ ...d, params: v }))}
              rows={4}
            />

            {/* Type Delta */}
            <DeltaTable
              label="类型贡献度 (type_delta)"
              value={selected.type_delta}
              onChange={(v) => updateDetector((d) => ({ ...d, type_delta: v }))}
              keys={TYPE_OPTIONS}
            />

            {/* Role Delta */}
            <DeltaTable
              label="角色贡献度 (role_delta)"
              value={selected.role_delta || {}}
              onChange={(v) => updateDetector((d) => ({ ...d, role_delta: v }))}
              keys={ROLE_OPTIONS}
            />

            {/* Template */}
            <TextField
              label="标题模板 (title_template)"
              value={selected.title_template || ""}
              onChange={(v) => updateDetector((d) => ({ ...d, title_template: v }))}
              placeholder="例如: 唯一/非空支持标识"
            />

            {/* Signal Keys */}
            <div>
              <div className="text-xs text-slate-300 mb-2">信号字段 (signal_keys)</div>
              <div className="bg-slate-900 border border-slate-700 rounded-md p-2 text-xs text-slate-400">
                {selected.signal_keys?.join(", ") || "(无)"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
