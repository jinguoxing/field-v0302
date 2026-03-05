import React from "react";
import { EntityList, ListItem, SectionTitle, TextField, Select, Toggle, NumberField, ChipsInput, TextArea, cls } from "./components";
import { TypeDictionaryPayload, TypeDefinition, TypeGroup } from "./types";

interface TypeDictionaryEditorProps {
  config: TypeDictionaryPayload;
  setConfig: (config: TypeDictionaryPayload) => void;
}

const DEFAULT_GROUPS = ["IDENTIFIER", "TEXTUAL", "TIME", "MONEY_QTY", "STATUS_ENUM", "NETWORK_CONTACT", "UNKNOWN_GROUP"];

const GROUP_ICONS: Record<string, string> = {
  IDENTIFIER: "🔑",
  TEXTUAL: "📝",
  TIME: "⏰",
  MONEY_QTY: "💰",
  STATUS_ENUM: "📊",
  NETWORK_CONTACT: "📞",
  UNKNOWN_GROUP: "❓"
};

const GROUP_COLORS: Record<string, string> = {
  IDENTIFIER: "from-amber-500 to-orange-600",
  TEXTUAL: "from-blue-500 to-cyan-600",
  TIME: "from-emerald-500 to-teal-600",
  MONEY_QTY: "from-green-500 to-lime-600",
  STATUS_ENUM: "from-purple-500 to-pink-600",
  NETWORK_CONTACT: "from-sky-500 to-blue-600",
  UNKNOWN_GROUP: "from-slate-500 to-gray-600"
};

function Card({ children, title, desc }: { children: React.ReactNode; title?: string; desc?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      {title && <SectionTitle title={title} desc={desc} />}
      {children}
    </div>
  );
}

export const TypeDictionaryEditor: React.FC<TypeDictionaryEditorProps> = ({ config, setConfig }) => {
  // Collapse state for group panel
  const [groupsCollapsed, setGroupsCollapsed] = React.useState(false);

  // First level: select group
  const [selectedGroup, setSelectedGroup] = React.useState<string>(() => {
    const groups = Object.keys(config.groups);
    return groups[0] || "UNKNOWN_GROUP";
  });

  // Second level: select type within group
  const [selectedCode, setSelectedCode] = React.useState<string>(() => {
    const groupItems = config.groups[selectedGroup]?.items || [];
    return groupItems[0] || "UNKNOWN";
  });

  // Get all groups for the group selector
  const groupList = Object.entries(config.groups).map(([code, g]) => ({
    code,
    ...g,
    count: g.items?.length || 0
  }));

  // Get types for the selected group
  const typesInGroup = (config.groups[selectedGroup]?.items || [])
    .map(code => config.types[code])
    .filter(Boolean);

  // Convert to list items
  const items: ListItem[] = typesInGroup.map((t: TypeDefinition) => {
    const code = Object.keys(config.types).find(k => config.types[k] === t) || "";
    return {
      id: code,
      title: `${t.zh} (${code})`,
      subtitle: t.aliases?.slice(0, 3).join(", ") || "无别名",
      badges: [
        { text: t.active ? "Active" : "Disabled", tone: t.active ? "green" : "gray" },
        { text: t.advanced ? "Advanced" : "Common", tone: t.advanced ? "blue" : "gray" },
      ],
    };
  });

  const selected = config.types[selectedCode];
  const groupOptions = Object.entries(config.groups).map(([g, v]) => ({ label: `${v.zh} (${g})`, value: g }));

  // Update selected code when group changes
  React.useEffect(() => {
    const groupItems = config.groups[selectedGroup]?.items || [];
    if (groupItems.length > 0 && !groupItems.includes(selectedCode)) {
      setSelectedCode(groupItems[0]);
    }
  }, [selectedGroup, config.groups, selectedCode]);

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
        [code]: { zh: "新类型", group: selectedGroup, active: true, advanced: false, bias: 0.0, aliases: [], tooltip: { def: "", example: [], anti: [] } },
      },
      groups: {
        ...config.groups,
        [selectedGroup]: {
          ...config.groups[selectedGroup],
          items: [...(config.groups[selectedGroup]?.items || []), code],
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
    // Select next available type in the same group
    const remainingInGroup = newGroups[selectedGroup]?.items || [];
    const next = remainingInGroup[0] || Object.keys(newTypes)[0] || "UNKNOWN";
    setSelectedCode(next);
  }

  return (
    <div className="flex gap-6">
      {/* Left: Group List */}
      <div className={cls(
        "flex-shrink-0 transition-all duration-300",
        groupsCollapsed ? "w-10" : "w-56"
      )}>
        <div className="bg-slate-900 border border-slate-800 rounded-xl space-y-3 h-full relative overflow-visible">
          {!groupsCollapsed && (
            <div className="p-4">
              <div className="text-sm font-semibold text-slate-100">类型分组</div>
              <div className="text-[10px] text-slate-500">按语义类别归纳</div>
              <div className="space-y-2 mt-4">
                {groupList.map((g) => (
                  <button
                    key={g.code}
                    onClick={() => setSelectedGroup(g.code)}
                    className={cls(
                      "w-full text-left p-3 rounded-lg transition-all",
                      "bg-gradient-to-r",
                      selectedGroup === g.code
                        ? `${GROUP_COLORS[g.code] || "from-slate-600 to-slate-700"} text-white shadow-lg`
                        : "bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{GROUP_ICONS[g.code] || "📁"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{g.zh}</div>
                        <div className="text-[10px] opacity-70 truncate">{g.code}</div>
                      </div>
                      <div className={cls(
                        "text-xs font-bold px-1.5 py-0.5 rounded",
                        selectedGroup === g.code ? "bg-white/20" : "bg-slate-700"
                      )}>
                        {g.count}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setGroupsCollapsed(!groupsCollapsed)}
            className={cls(
              "absolute -right-3 top-2 z-10 p-1.5 rounded-lg transition-all shadow-lg",
              groupsCollapsed
                ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
            )}
            title={groupsCollapsed ? "展开分组" : "收起分组"}
          >
            <svg className={cls("w-4 h-4 transition-transform", groupsCollapsed && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Middle: Type List in Selected Group */}
      <div className="w-72 flex-shrink-0">
        <EntityList
          items={items}
          selectedId={selectedCode}
          onSelect={setSelectedCode}
          header={{
            title: config.groups[selectedGroup]?.zh || selectedGroup,
            desc: `${typesInGroup.length} 个类型`
          }}
        />
      </div>

      {/* Right: Editor */}
      <div className="flex-1 min-w-0">
        {!selected ? (
          <div className="text-center py-12 text-slate-500">
            该分组下无类型定义
          </div>
        ) : (
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
                    setSelectedGroup(v);
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
        )}
      </div>
    </div>
  );
};
