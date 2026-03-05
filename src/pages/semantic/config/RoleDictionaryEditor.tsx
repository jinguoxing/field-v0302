import React from "react";
import { EntityList, ListItem, SectionTitle, TextField, Select, Toggle, NumberField, ChipsInput, TextArea } from "./components";
import { RoleDictionaryPayload, RoleDefinition } from "./types";

interface RoleDictionaryEditorProps {
  config: RoleDictionaryPayload;
  setConfig: (config: RoleDictionaryPayload) => void;
}

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      {title && <SectionTitle title={title} />}
      {children}
    </div>
  );
}

export const RoleDictionaryEditor: React.FC<RoleDictionaryEditorProps> = ({ config, setConfig }) => {
  const [selectedCode, setSelectedCode] = React.useState<string>(() => Object.keys(config.roles)[0] || "PRIMARY_KEY");

  const items: ListItem[] = Object.entries(config.roles).map(([code, r]) => ({
    id: code,
    title: `${r.zh} (${code})`,
    subtitle: config.groups[r.group]?.zh || r.group,
    badges: [
      { text: r.active ? "Active" : "Disabled", tone: r.active ? "green" : "gray" },
      { text: r.advanced ? "Advanced" : "Common", tone: r.advanced ? "blue" : "gray" },
    ],
  }));

  const selected = config.roles[selectedCode];
  const groupOptions = Object.entries(config.groups).map(([g, v]) => ({ label: `${v.zh} (${g})`, value: g }));

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
        [code]: { zh: "新角色", group: "GOVERN_TECH", active: true, advanced: false, bias: 0.0, tooltip: { def: "", example: [], anti: [] } },
      },
      groups: {
        ...config.groups,
        GOVERN_TECH: {
          ...config.groups.GOVERN_TECH,
          items: [...(config.groups.GOVERN_TECH?.items || []), code],
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
    const next = Object.keys(newRoles).filter((x) => x !== code)[0] || "PRIMARY_KEY";
    setSelectedCode(next);
  }

  if (!selected) {
    return <div className="text-center py-12 text-slate-500">无角色定义</div>;
  }

  return (
    <div className="flex gap-6">
      {/* Left: List */}
      <div className="w-80 flex-shrink-0">
        <EntityList
          items={items}
          selectedId={selectedCode}
          onSelect={setSelectedCode}
          header={{ title: "Roles", desc: "字段角色字典（分组/tooltip/advanced/bias）" }}
        />
      </div>

      {/* Right: Editor */}
      <div className="flex-1 min-w-0">
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
      </div>
    </div>
  );
};
