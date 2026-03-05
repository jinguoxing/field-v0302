import React from "react";
import { EntityList, ListItem, SectionTitle, TextField, Select, Toggle, NumberField, ChipsInput, TextArea, cls } from "./components";
import { RoleDictionaryPayload, RoleDefinition } from "./types";

interface RoleDictionaryEditorProps {
  config: RoleDictionaryPayload;
  setConfig: (config: RoleDictionaryPayload) => void;
}

const GROUP_ICONS: Record<string, string> = {
  KEYS: "🔗",
  ANALYTICS: "📊",
  TIME_PARTITION: "⏰",
  GOVERN_TECH: "⚙️"
};

const GROUP_COLORS: Record<string, string> = {
  KEYS: "from-amber-500 to-orange-600",
  ANALYTICS: "from-blue-500 to-indigo-600",
  TIME_PARTITION: "from-emerald-500 to-teal-600",
  GOVERN_TECH: "from-slate-500 to-gray-600"
};

function Card({ children, title, desc }: { children: React.ReactNode; title?: string; desc?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      {title && <SectionTitle title={title} desc={desc} />}
      {children}
    </div>
  );
}

export const RoleDictionaryEditor: React.FC<RoleDictionaryEditorProps> = ({ config, setConfig }) => {
  // First level: select group
  const [selectedGroup, setSelectedGroup] = React.useState<string>(() => {
    const groups = Object.keys(config.groups);
    return groups[0] || "KEYS";
  });

  // Second level: select role within group
  const [selectedCode, setSelectedCode] = React.useState<string>(() => {
    const groupItems = config.groups[selectedGroup]?.items || [];
    return groupItems[0] || "PRIMARY_KEY";
  });

  // Get all groups for the group selector
  const groupList = Object.entries(config.groups).map(([code, g]) => ({
    code,
    ...g,
    count: g.items?.length || 0
  }));

  // Get roles for the selected group
  const rolesInGroup = (config.groups[selectedGroup]?.items || [])
    .map(code => config.roles[code])
    .filter(Boolean);

  // Convert to list items
  const items: ListItem[] = rolesInGroup.map((r: RoleDefinition) => {
    const code = Object.keys(config.roles).find(k => config.roles[k] === r) || "";
    return {
      id: code,
      title: `${r.zh} (${code})`,
      subtitle: r.tooltip?.def?.slice(0, 30) || "暂无定义",
      badges: [
        { text: r.active ? "Active" : "Disabled", tone: r.active ? "green" : "gray" },
        { text: r.advanced ? "Advanced" : "Common", tone: r.advanced ? "blue" : "gray" },
      ],
    };
  });

  const selected = config.roles[selectedCode];
  const groupOptions = Object.entries(config.groups).map(([g, v]) => ({ label: `${v.zh} (${g})`, value: g }));

  // Update selected code when group changes
  React.useEffect(() => {
    const groupItems = config.groups[selectedGroup]?.items || [];
    if (groupItems.length > 0 && !groupItems.includes(selectedCode)) {
      setSelectedCode(groupItems[0]);
    }
  }, [selectedGroup, config.groups, selectedCode]);

  function updateRole(code: string, updater: (r: RoleDefinition) => void) {
    setConfig({
      ...config,
      roles: { ...config.roles, [code]: { ...config.roles[code], ...updater(config.roles[code]) } },
    });
  }

  function syncRoleToGroup(d: RoleDictionaryPayload, code: string, newGroup: string) {
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

  function renameRole(oldCode: string, newCode: string) {
    const nc = newCode.trim();
    if (!nc || nc === oldCode || config.roles[nc]) return;

    const newRoles = { ...config.roles };
    newRoles[nc] = config.roles[oldCode];
    delete newRoles[oldCode];

    const newGroups = { ...config.groups };
    Object.keys(newGroups).forEach((g) => {
      newGroups[g] = {
        ...newGroups[g],
        items: (newGroups[g]?.items || []).map((x) => x === oldCode ? nc : x),
      };
    });

    setConfig({ roles: newRoles, groups: newGroups });
    setSelectedCode(nc);
  }

  function createRole() {
    const code = `NEW_ROLE_${Date.now()}`;
    setConfig({
      ...config,
      roles: {
        ...config.roles,
        [code]: { zh: "新角色", group: selectedGroup, active: true, advanced: false, bias: 0.0, tooltip: { def: "", example: [], anti: [] } },
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

  function deleteRole(code: string) {
    if (!confirm(`删除 Role ${code}？`)) return;
    const newRoles = { ...config.roles };
    delete newRoles[code];

    const newGroups = { ...config.groups };
    Object.keys(newGroups).forEach((g) => {
      newGroups[g] = {
        ...newGroups[g],
        items: (newGroups[g]?.items || []).filter((x) => x !== code),
      };
    });

    setConfig({ roles: newRoles, groups: newGroups });
    // Select next available role in the same group
    const remainingInGroup = newGroups[selectedGroup]?.items || [];
    const next = remainingInGroup[0] || Object.keys(newRoles)[0] || "PRIMARY_KEY";
    setSelectedCode(next);
  }

  return (
    <div className="flex gap-6">
      {/* Left: Group List */}
      <div className="w-56 flex-shrink-0">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="text-sm font-semibold text-slate-100">角色分组</div>
          <div className="text-[10px] text-slate-500">按功能类别归纳</div>
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
      </div>

      {/* Middle: Role List in Selected Group */}
      <div className="w-72 flex-shrink-0">
        <EntityList
          items={items}
          selectedId={selectedCode}
          onSelect={setSelectedCode}
          header={{
            title: config.groups[selectedGroup]?.zh || selectedGroup,
            desc: `${rolesInGroup.length} 个角色`
          }}
        />
      </div>

      {/* Right: Editor */}
      <div className="flex-1 min-w-0">
        {!selected ? (
          <div className="text-center py-12 text-slate-500">
            该分组下无角色定义
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basic Info */}
            <Card title="基础信息">
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="role_code"
                  value={selectedCode}
                  onChange={(v) => renameRole(selectedCode, v)}
                />
                <TextField
                  label="中文名"
                  value={selected.zh}
                  onChange={(v) => updateRole(selectedCode, { zh: v })}
                />
              </div>
              <div className="mt-4">
                <Select
                  label="分组"
                  value={selected.group}
                  onChange={(v) => {
                    const newGroups = syncRoleToGroup(config, selectedCode, v);
                    setConfig({ ...config, roles: config.roles, groups: newGroups });
                    updateRole(selectedCode, { group: v });
                    setSelectedGroup(v);
                  }}
                  options={groupOptions}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <Toggle
                  label="启用"
                  value={selected.active}
                  onChange={(v) => updateRole(selectedCode, { active: v })}
                />
                <Toggle
                  label="高级（默认隐藏）"
                  value={selected.advanced}
                  onChange={(v) => updateRole(selectedCode, { advanced: v })}
                />
                <NumberField
                  label="bias"
                  value={selected.bias}
                  onChange={(v) => updateRole(selectedCode, { bias: v })}
                  step={0.01}
                />
              </div>
            </Card>

            {/* Tooltip */}
            <Card title="Tooltip">
              <TextArea
                label="定义"
                value={selected.tooltip?.def || ""}
                onChange={(v) => updateRole(selectedCode, { tooltip: { ...selected.tooltip, def: v } })}
                rows={2}
              />
              <div className="mt-4">
                <ChipsInput
                  label="例子"
                  value={selected.tooltip?.example || []}
                  onChange={(v) => updateRole(selectedCode, { tooltip: { ...selected.tooltip, example: v } })}
                />
              </div>
              <div className="mt-4">
                <ChipsInput
                  label="反例"
                  value={selected.tooltip?.anti || []}
                  onChange={(v) => updateRole(selectedCode, { tooltip: { ...selected.tooltip, anti: v } })}
                />
              </div>
            </Card>

            {/* Actions */}
            <Card title="Role Actions">
              <div className="flex gap-2">
                <button
                  onClick={createRole}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
                >
                  + 新建角色
                </button>
                <button
                  onClick={() => deleteRole(selectedCode)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all"
                >
                  删除角色
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
