import React from "react";
import { EntityList, ListItem, SectionTitle, Toggle, Select, JsonTextArea, DeltaTable, NumberField } from "./components";
import { MetadataPayload, MetadataRule } from "./types";

const ROLE_OPTIONS = ["PRIMARY_KEY", "FOREIGN_KEY", "PARTITION_KEY", "DIMENSION", "MEASURE", "EVENT_TIME", "AUDIT_FIELD"];
const TYPE_OPTIONS = ["ID", "DIM", "MEASURE", "TIME"];

interface MetadataRulesEditorProps {
  config: MetadataPayload;
  setConfig: (config: MetadataPayload) => void;
}

export const MetadataRulesEditor: React.FC<MetadataRulesEditorProps> = ({ config, setConfig }) => {
  const [selectedId, setSelectedId] = React.useState<string>(config.rules[0]?.rule_id || "");

  const items: ListItem[] = config.rules.map((r) => ({
    id: r.rule_id,
    title: r.rule_id,
    subtitle: JSON.stringify(r.condition),
    badges: [
      { text: r.enabled ? "Enabled" : "Disabled", tone: r.enabled ? "green" : "gray" },
      { text: `P${r.priority}`, tone: "gray" },
    ],
  }));

  const selected = config.rules.find((r) => r.rule_id === selectedId);

  function updateRule(updater: (r: MetadataRule) => MetadataRule) {
    setConfig({
      ...config,
      rules: config.rules.map((r) => (r.rule_id === selectedId ? updater(r) : r)),
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
          header={{ title: "元数据规则", desc: "基于数据库元数据的推断规则" }}
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
              <SectionTitle title={selected.rule_id} />
              <div className="flex items-center gap-4">
                <Toggle
                  label="启用"
                  value={selected.enabled}
                  onChange={(v) => updateRule((r) => ({ ...r, enabled: v }))}
                />
                <NumberField
                  label="优先级"
                  value={selected.priority}
                  onChange={(v) => updateRule((r) => ({ ...r, priority: v }))}
                  min={0}
                  max={1000}
                />
              </div>
            </div>

            {/* Condition */}
            <JsonTextArea
              label="匹配条件 (condition)"
              value={selected.condition}
              onChange={(v) => updateRule((r) => ({ ...r, condition: v }))}
              rows={4}
            />

            {/* Role Delta */}
            <DeltaTable
              label="角色贡献度 (role_delta)"
              value={selected.role_delta}
              onChange={(v) => updateRule((r) => ({ ...r, role_delta: v }))}
              keys={ROLE_OPTIONS}
            />

            {/* Type Delta (optional) */}
            {selected.type_delta && (
              <DeltaTable
                label="类型贡献度 (type_delta)"
                value={selected.type_delta}
                onChange={(v) => updateRule((r) => ({ ...r, type_delta: v }))}
                keys={TYPE_OPTIONS}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
