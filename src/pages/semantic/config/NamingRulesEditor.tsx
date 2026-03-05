import React from "react";
import { EntityList, ListItem, SectionTitle, Toggle, NumberField, Select, TextField, TextArea, JsonTextArea } from "./components";
import { NamingPayload, NamingRule } from "./types";

interface NamingRulesEditorProps {
  config: NamingPayload;
  setConfig: (config: NamingPayload) => void;
}

const SCOPE_OPTIONS = [
  { label: "field_name (字段名)", value: "field_name" },
  { label: "comment (注释)", value: "comment" },
  { label: "table_name (表名)", value: "table_name" },
  { label: "qualified_name (完整名)", value: "qualified_name" },
];

function Card({ children, title, desc }: { children: React.ReactNode; title?: string; desc?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      {(title || desc) && <SectionTitle title={title || ""} desc={desc} />}
      {children}
    </div>
  );
}

function setRuleById(arr: NamingRule[], id: string, patch: Partial<NamingRule>) {
  const idx = arr.findIndex((x) => x.id === id);
  if (idx >= 0) arr[idx] = { ...arr[idx], ...patch };
}

export const NamingRulesEditor: React.FC<NamingRulesEditorProps> = ({ config, setConfig }) => {
  const [selectedId, setSelectedId] = React.useState<string>(() => config.patterns[0]?.id || "");

  const items: ListItem[] = config.patterns.map((r) => ({
    id: r.id,
    title: r.id,
    subtitle: r.regex,
    badges: [
      { text: r.enabled ? "Enabled" : "Disabled", tone: r.enabled ? "green" : "gray" },
      { text: `P${r.priority}`, tone: "gray" },
    ],
  }));

  const selected = config.patterns.find((x) => x.id === selectedId);

  function updateRule(updater: (r: NamingRule) => NamingRule) {
    setConfig({
      ...config,
      patterns: config.patterns.map((r) => (r.id === selectedId ? updater(r) : r)),
    });
  }

  function safeJsonUpdate(txt: string, apply: (obj: any) => void) {
    try {
      const obj = JSON.parse(txt);
      apply(obj);
    } catch {
      // ignore JSON errors
    }
  }

  function createRule() {
    const id = `new_rule_${Date.now()}`;
    setConfig({
      ...config,
      patterns: [
        ...config.patterns,
        {
          id,
          enabled: true,
          priority: 100,
          scope: "field_name",
          regex: ".*",
          type_delta: {},
          role_delta: {},
        },
      ],
    });
    setSelectedId(id);
  }

  function deleteRule(id: string) {
    if (!confirm(`删除规则 ${id}？`)) return;
    const next = config.patterns.filter((x) => x.id !== id);
    setConfig({ ...config, patterns: next });
    const nextSelected = next[0]?.id;
    setSelectedId(nextSelected || "");
  }

  if (!selected) {
    return (
      <div className="text-center py-12 text-slate-500 space-y-4">
        <div>无命名规则</div>
        <button
          onClick={createRule}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
        >
          + 新建规则
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Left: List */}
      <div className="w-80 flex-shrink-0">
        <EntityList
          items={items}
          selectedId={selectedId}
          onSelect={setSelectedId}
          header={{ title: "Naming Rules", desc: "D1 命名规则（regex→delta）" }}
          onCreate={createRule}
        />
      </div>

      {/* Right: Editor */}
      <div className="flex-1 min-w-0">
        <div className="space-y-6">
          {/* Rule Meta */}
          <Card title="Rule Meta">
            <div className="grid grid-cols-3 gap-4">
              <Toggle
                label="enabled"
                value={selected.enabled}
                onChange={(v) => updateRule((r) => setRuleById(config.patterns, r.id, { enabled: v }))}
              />
              <NumberField
                label="priority"
                value={selected.priority}
                onChange={(v) => updateRule((r) => setRuleById(config.patterns, r.id, { priority: v }))}
                step={1}
                min={0}
              />
            </div>
            <div className="mt-4">
              <Select
                label="scope"
                value={selected.scope}
                onChange={(v) => updateRule((r) => setRuleById(config.patterns, r.id, { scope: v }))}
                options={SCOPE_OPTIONS}
              />
            </div>
          </Card>

          {/* Pattern */}
          <Card title="Pattern" desc="regex 命中后产生 NAMING evidence + delta">
            <TextField
              label="regex"
              value={selected.regex}
              onChange={(v) => updateRule((r) => setRuleById(config.patterns, r.id, { regex: v }))}
            />
          </Card>

          {/* Delta Mapping */}
          <Card title="Delta Mapping" desc="简化为 JSON 文本编辑（生产版可用 DeltaTable）">
            <JsonTextArea
              label="type_delta (JSON)"
              value={selected.type_delta}
              onChange={(v) => safeJsonUpdate(v, (obj) => updateRule((r) => setRuleById(config.patterns, r.id, { type_delta: obj })))}
              rows={6}
            />
            <JsonTextArea
              label="role_delta (JSON)"
              value={selected.role_delta}
              onChange={(v) => safeJsonUpdate(v, (obj) => updateRule((r) => setRuleById(config.patterns, r.id, { role_delta: obj })))}
              rows={6}
            />
          </Card>

          {/* Evidence Template */}
          <Card title="Evidence Template">
            <TextField
              label="title_template"
              value={selected.title_template || ""}
              onChange={(v) => updateRule((r) => setRuleById(config.patterns, r.id, { title_template: v }))}
            />
            <TextArea
              label="summary_template"
              value={selected.summary_template || ""}
              onChange={(v) => updateRule((r) => setRuleById(config.patterns, r.id, { summary_template: v }))}
              rows={2}
            />
          </Card>

          {/* Actions */}
          <Card title="Rule Actions">
            <div className="flex gap-2">
              <button
                onClick={createRule}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
              >
                + 新建规则
              </button>
              <button
                onClick={() => deleteRule(selected.id)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all"
              >
                删除规则
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
