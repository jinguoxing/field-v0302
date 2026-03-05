import React from "react";
import { EntityList, ListItem, SectionTitle, NumberField, Select, DeltaTable, JsonTextArea } from "./components";
import { StandardsPayload, StandardsMapping } from "./types";

const TYPE_OPTIONS = ["ID", "DIM", "MEASURE", "TIME", "STATUS", "CATEGORY", "PHONE", "CODE"];
const ROLE_OPTIONS = ["DIMENSION", "MEASURE", "PRIMARY_KEY", "FOREIGN_KEY"];
const MATCH_TYPE_OPTIONS = [
  { label: "业务术语 (TERM)", value: "TERM" },
  { label: "数据元 (DATA_ELEMENT)", value: "DATA_ELEMENT" },
  { label: "码表 (CODELIST)", value: "CODELIST" },
  { label: "命名规则 (NAMING_RULE)", value: "NAMING_RULE" },
];

interface StandardsRulesEditorProps {
  config: StandardsPayload;
  setConfig: (config: StandardsPayload) => void;
}

export const StandardsRulesEditor: React.FC<StandardsRulesEditorProps> = ({ config, setConfig }) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const items: ListItem[] = config.mappings.map((m, idx) => ({
    id: String(idx),
    title: m.ref_id,
    subtitle: `${m.match_type} → ${JSON.stringify(m.type_delta)}`,
    badges: [{ text: m.match_type, tone: "blue" }],
  }));

  const selected = config.mappings[selectedIndex];

  function updateMapping(updater: (m: StandardsMapping) => StandardsMapping) {
    setConfig({
      ...config,
      mappings: config.mappings.map((m, idx) => (idx === selectedIndex ? updater(m) : m)),
    });
  }

  return (
    <div className="space-y-6">
      {/* Global Setting */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <NumberField
          label="最小匹配分数 (min_match_score)"
          value={config.min_match_score}
          onChange={(v) => setConfig({ ...config, min_match_score: v })}
          min={0}
          max={1}
          step={0.05}
        />
      </div>

      <div className="flex gap-6">
        {/* Left: List */}
        <div className="w-80 flex-shrink-0">
          <EntityList
            items={items}
            selectedId={String(selectedIndex)}
            onSelect={(id) => setSelectedIndex(Number(id))}
            header={{ title: "标准映射", desc: "与标准中心的术语/数据元/码表匹配规则" }}
          />
        </div>

        {/* Right: Editor */}
        <div className="flex-1 min-w-0">
          {!selected ? (
            <div className="text-center py-12 text-slate-500">未选择映射</div>
          ) : (
            <div className="space-y-6">
              <SectionTitle title={selected.ref_id} desc="标准引用配置" />

              {/* Match Type */}
              <Select
                label="匹配类型"
                value={selected.match_type}
                onChange={(v) => updateMapping((m) => ({ ...m, match_type: v as any }))}
                options={MATCH_TYPE_OPTIONS}
              />

              {/* Ref ID */}
              <div>
                <div className="text-xs text-slate-300 mb-1">标准引用 ID (ref_id)</div>
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100"
                  value={selected.ref_id}
                  onChange={(e) => updateMapping((m) => ({ ...m, ref_id: e.target.value }))}
                />
              </div>

              {/* Type Delta */}
              <DeltaTable
                label="类型贡献度"
                value={selected.type_delta}
                onChange={(v) => updateMapping((m) => ({ ...m, type_delta: v }))}
                keys={TYPE_OPTIONS}
              />

              {/* Role Delta (optional) */}
              {selected.role_delta && (
                <DeltaTable
                  label="角色贡献度"
                  value={selected.role_delta}
                  onChange={(v) => updateMapping((m) => ({ ...m, role_delta: v }))}
                  keys={ROLE_OPTIONS}
                />
              )}

              {/* Meta */}
              <JsonTextArea
                label="元数据 (meta)"
                value={selected.meta || {}}
                onChange={(v) => updateMapping((m) => ({ ...m, meta: v }))}
                rows={3}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
