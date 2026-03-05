import React from "react";
import { EntityList, ListItem, SectionTitle, TextField, Select, Toggle, NumberField, ChipsInput, TextArea, cls } from "./components";
import { TypeDictionaryPayload, TypeDefinition, TypeGroup } from "./types";

interface TypeDictionaryEditorProps {
  config: TypeDictionaryPayload;
  setConfig: (config: TypeDictionaryPayload) => void;
}

const DEFAULT_GROUPS = ["IDENTIFIER", "TEXTUAL", "TIME", "MONEY_QTY", "STATUS_ENUM", "NETWORK_CONTACT", "UNKNOWN_GROUP"];

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      {title && <SectionTitle title={title} />}
      {children}
    </div>
  );
}

export const TypeDictionaryEditor: React.FC<TypeDictionaryEditorProps> = ({ config, setConfig }) => {
  const [selectedCode, setSelectedCode] = React.useState<string>(() => Object.keys(config.types)[0] || "UNKNOWN");

  const items: ListItem[] = Object.entries(config.types).map(([code, t]) => ({
    id: code,
    title: `${t.zh} (${code})`,
    subtitle: config.groups[t.group]?.zh || t.group,
    badges: [
      { text: t.active ? "Active" : "Disabled", tone: t.active ? "green" : "gray" },
      { text: t.advanced ? "Advanced" : "Common", tone: t.advanced ? "blue" : "gray" },
    ],
  }));

  const selected = config.types[selectedCode];
  const groupOptions = Object.entries(config.groups).map(([g, v]) => ({ label: `${v.zh} (${g})`, value: g }));

  function updateType(code: string, updater: (t: TypeDefinition) => void) {
    setConfig({
      ...config,
      types: { ...config.types, [code]: { ...config.types[code], ...updater(config.types[code]) } },
    });
  }

  function syncTypeToGroup(d: TypeDictionaryPayload, code: string, newGroup: string) {
    const newGroups = { ...d.groups };
    // Remove from old group
    Object.keys(newGroups).forEach((g) => {
      newGroups[g] = {
        ...newGroups[g],
        items: (newGroups[g]?.items || []).filter((x) => x !== code),
      };
    });
    // Add to new group
    if (!newGroups[newGroup]) {
      newGroups[newGroup] = { zh: newGroup, items: [] };
    }
    if (!newGroups[newGroup].items.includes(code)) {
      newGroups[newGroup].items.push(code);
    }
    return newGroups;
  }

  function renameType(oldCode: string, newCode: string) {
    const nc = newCode.trim();
    if (!nc || nc === oldCode || config.types[nc]) return;

    const newTypes = { ...config.types };
    newTypes[nc] = config.types[oldCode];
    delete newTypes[oldCode];

    const newGroups = { ...config.groups };
    Object.keys(newGroups).forEach((g) => {
      newGroups[g] = {
        ...newGroups[g],
        items: (newGroups[g]?.items || []).map((x) => x === oldCode ? nc : x),
      };
    });

    setConfig({ types: newTypes, groups: newGroups });
    setSelectedCode(nc);
  }

  function createType() {
    const code = `NEW_TYPE_${Date.now()}`;
    setConfig({
      ...config,
      types: {
        ...config.types,
        [code]: { zh: "新类型", group: "UNKNOWN_GROUP", active: true, advanced: false, bias: 0.0, aliases: [], tooltip: { def: "", example: [], anti: [] } },
      },
      groups: {
        ...config.groups,
        UNKNOWN_GROUP: {
          ...config.groups.UNKNOWN_GROUP,
          items: [...(config.groups.UNKNOWN_GROUP?.items || []), code],
        },
      },
    });
    setSelectedCode(code);
  }

  function deleteType(code: string) {
    if (!confirm(`删除 Type ${code}？`)) return;
    const newTypes = { ...config.types };
    delete newTypes[code];

    const newGroups = { ...config.groups };
    Object.keys(newGroups).forEach((g) => {
      newGroups[g] = {
        ...newGroups[g],
        items: (newGroups[g]?.items || []).filter((x) => x !== code),
      };
    });

    setConfig({ types: newTypes, groups: newGroups });
    const next = Object.keys(newTypes).filter((x) => x !== code)[0] || "UNKNOWN";
    setSelectedCode(next);
  }

  if (!selected) {
    return <div className="text-center py-12 text-slate-500">无类型定义</div>;
  }

  return (
    <div className="flex gap-6">
      {/* Left: List */}
      <div className="w-80 flex-shrink-0">
        <EntityList
          items={items}
          selectedId={selectedCode}
          onSelect={setSelectedCode}
          header={{ title: "Types", desc: "语义类型字典（分组/别名/tooltip/bias）" }}
        />
      </div>

      {/* Right: Editor */}
      <div className="flex-1 min-w-0">
        <div className="space-y-6">
          {/* Basic Info */}
          <Card title="基础信息">
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="type_code"
                value={selectedCode}
                onChange={(v) => renameType(selectedCode, v)}
              />
              <TextField
                label="中文名"
                value={selected.zh}
                onChange={(v) => updateType(selectedCode, { zh: v })}
              />
            </div>
            <div className="mt-4">
              <Select
                label="分组"
                value={selected.group}
                onChange={(v) => {
                  const newGroups = syncTypeToGroup(config, selectedCode, v);
                  setConfig({ ...config, types: config.types, groups: newGroups });
                  updateType(selectedCode, { group: v });
                }}
                options={groupOptions}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Toggle
                label="启用"
                value={selected.active}
                onChange={(v) => updateType(selectedCode, { active: v })}
              />
              <Toggle
                label="高级（默认隐藏）"
                value={selected.advanced}
                onChange={(v) => updateType(selectedCode, { advanced: v })}
              />
              <NumberField
                label="bias"
                value={selected.bias}
                onChange={(v) => updateType(selectedCode, { bias: v })}
                step={0.01}
              />
            </div>
          </Card>

          {/* Aliases */}
          <Card title="Aliases" desc="用于搜索与命名归一（多语言/缩写）">
            <ChipsInput
              label="aliases"
              value={selected.aliases || []}
              onChange={(v) => updateType(selectedCode, { aliases: v })}
            />
          </Card>

          {/* Tooltip */}
          <Card title="Tooltip">
            <TextArea
              label="定义"
              value={selected.tooltip?.def || ""}
              onChange={(v) => updateType(selectedCode, { tooltip: { ...selected.tooltip, def: v } })}
              rows={2}
            />
            <div className="mt-4">
              <ChipsInput
                label="例子"
                value={selected.tooltip?.example || []}
                onChange={(v) => updateType(selectedCode, { tooltip: { ...selected.tooltip, example: v } })}
              />
            </div>
            <div className="mt-4">
              <ChipsInput
                label="反例"
                value={selected.tooltip?.anti || []}
                onChange={(v) => updateType(selectedCode, { tooltip: { ...selected.tooltip, anti: v } })}
              />
            </div>
          </Card>

          {/* Actions */}
          <Card title="Type Actions">
            <div className="flex gap-2">
              <button
                onClick={createType}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
              >
                + 新建类型
              </button>
              <button
                onClick={() => deleteType(selectedCode)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all"
              >
                删除类型
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
