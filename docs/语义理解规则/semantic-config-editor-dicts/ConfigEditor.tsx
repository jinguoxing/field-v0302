import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { defaultDomains } from "./defaults";
import { simulate, updateSection, validateVersion } from "./mockApi";
import { ConfigState, TabDef, TabId, SimulationSampleRef, SimulationResult, NamingRule } from "./types";
import { ChipsInput, cls, NumberField, Pill, SectionTitle, Select, TextArea, TextField, Toggle } from "./components/ui";
import { EntityList, ListItem } from "./components/list";

const TABS: TabDef[] = [
  { id: "type_dictionary", title: "Type Dictionary", domain: "type_dictionary" },
  { id: "role_dictionary", title: "Role Dictionary", domain: "role_dictionary" },
  { id: "naming_rules", title: "Naming Rules (D1)", domain: "rules.naming" }
];

function deepClone<T>(v: T): T { return structuredClone(v); }
function toPct(x: number) { return `${Math.round(x * 100)}%`; }

function useDebouncedEffect(fn: () => void, deps: any[], delay: number) {
  const t = useRef<number | null>(null);
  useEffect(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(fn, delay);
    return () => { if (t.current) window.clearTimeout(t.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function ConfigEditor() {
  const { versionId = "v_demo" } = useParams();
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();

  const initialTab = (sp.get("tab") as TabId) || "type_dictionary";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const [config, setConfig] = useState<ConfigState>(() => ({
    versionId,
    versionName: "Draft v_demo",
    status: "DRAFT",
    baseVersionId: "v_active",
    domains: defaultDomains()
  }));
  const [dirty, setDirty] = useState(false);

  // selections
  const [selectedTypeCode, setSelectedTypeCode] = useState<string>(() => Object.keys(config.domains.type_dictionary.types)[0] || "UNKNOWN");
  const [selectedRoleCode, setSelectedRoleCode] = useState<string>(() => Object.keys(config.domains.role_dictionary.roles)[0] || "PRIMARY_KEY");
  const [selectedRuleId, setSelectedRuleId] = useState<string>(() => config.domains["rules.naming"].patterns[0]?.id);

  // simulation
  const [sample, setSample] = useState<SimulationSampleRef>({ mode: "FIELD_ID", fieldId: "f_demo" });
  const [baseline, setBaseline] = useState<SimulationResult | undefined>();
  const [whatIf, setWhatIf] = useState<SimulationResult | undefined>();
  const [simMode, setSimMode] = useState<"BASELINE" | "WHAT_IF">("WHAT_IF");
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    setSp((prev) => { prev.set("tab", activeTab); return prev; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    (async () => {
      const baseCfg: ConfigState = { ...config, domains: defaultDomains() };
      const res = await simulate(versionId, baseCfg, sample);
      setBaseline(res);
      setWhatIf(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionId]);

  useDebouncedEffect(() => {
    (async () => {
      setSimLoading(true);
      try {
        const res = await simulate(versionId, config, sample);
        setWhatIf(res);
      } finally { setSimLoading(false); }
    })();
  }, [config, sample, versionId], 300);

  function updateDomain(domain: keyof ConfigState["domains"], updater: (draft: any) => void) {
    setConfig((prev) => {
      const next = deepClone(prev);
      updater(next.domains[domain]);
      return next;
    });
    setDirty(true);
  }

  async function onSave() {
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab) return;
    await updateSection(versionId, tab.domain, (config.domains as any)[tab.domain]);
    setDirty(false);
    alert(`Mock 保存成功：${tab.domain}`);
  }
  async function onValidate() {
    const r = await validateVersion(versionId);
    alert(r.ok ? "Mock 校验通过" : `失败：${(r.errors || []).join("\n")}`);
  }

  // left lists
  const typeItems: ListItem[] = useMemo(() => {
    return Object.entries(config.domains.type_dictionary.types).map(([code, t]) => ({
      id: code,
      title: `${t.zh} (${code})`,
      subtitle: `${config.domains.type_dictionary.groups[t.group]?.zh || t.group}`,
      badges: [
        { text: t.active ? "Active" : "Disabled", tone: t.active ? "green" : "gray" },
        { text: t.advanced ? "Advanced" : "Common", tone: t.advanced ? "blue" : "gray" }
      ]
    }));
  }, [config.domains.type_dictionary]);

  const roleItems: ListItem[] = useMemo(() => {
    return Object.entries(config.domains.role_dictionary.roles).map(([code, r]) => ({
      id: code,
      title: `${r.zh} (${code})`,
      subtitle: `${config.domains.role_dictionary.groups[r.group]?.zh || r.group}`,
      badges: [
        { text: r.active ? "Active" : "Disabled", tone: r.active ? "green" : "gray" },
        { text: r.advanced ? "Advanced" : "Common", tone: r.advanced ? "blue" : "gray" }
      ]
    }));
  }, [config.domains.role_dictionary]);

  const namingItems: ListItem[] = useMemo(() => {
    return config.domains["rules.naming"].patterns.map((r) => ({
      id: r.id,
      title: r.id,
      subtitle: r.regex,
      badges: [
        { text: r.enabled ? "Enabled" : "Disabled", tone: r.enabled ? "green" : "gray" },
        { text: `P${r.priority}`, tone: "gray" }
      ]
    }));
  }, [config.domains]);

  // selected
  const selectedType = useMemo(() => config.domains.type_dictionary.types[selectedTypeCode], [config.domains.type_dictionary, selectedTypeCode]);
  const selectedRole = useMemo(() => config.domains.role_dictionary.roles[selectedRoleCode], [config.domains.role_dictionary, selectedRoleCode]);
  const selectedRule = useMemo(() => config.domains["rules.naming"].patterns.find((x) => x.id === selectedRuleId), [config.domains, selectedRuleId]);

  function renderLeftPane() {
    if (activeTab === "type_dictionary") {
      return <EntityList header={{ title: "Types", desc: "语义类型字典（分组/别名/tooltip/bias）" }} items={typeItems} selectedId={selectedTypeCode} onSelect={setSelectedTypeCode} />;
    }
    if (activeTab === "role_dictionary") {
      return <EntityList header={{ title: "Roles", desc: "字段角色字典（分组/tooltip/advanced/bias）" }} items={roleItems} selectedId={selectedRoleCode} onSelect={setSelectedRoleCode} />;
    }
    return <EntityList header={{ title: "Naming Rules", desc: "D1 命名规则（regex→delta）" }} items={namingItems} selectedId={selectedRuleId} onSelect={setSelectedRuleId} />;
  }

  function renderCenterPane() {
    // Type Dictionary editor
    if (activeTab === "type_dictionary" && selectedType) {
      const groupOptions = Object.entries(config.domains.type_dictionary.groups).map(([g, v]) => ({ label: `${v.zh} (${g})`, value: g }));
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="基础信息" />
            <TextField label="type_code" value={selectedTypeCode} onChange={(v) => renameType(selectedTypeCode, v)} />
            <div className="mt-3" />
            <TextField label="中文名" value={selectedType.zh} onChange={(v) => updateDomain("type_dictionary", (d:any) => { d.types[selectedTypeCode].zh = v; })} />
            <div className="mt-3" />
            <Select label="分组" value={selectedType.group} onChange={(v) => updateDomain("type_dictionary", (d:any) => { d.types[selectedTypeCode].group = v; syncTypeToGroup(d, selectedTypeCode, v); })} options={groupOptions} />
            <Toggle label="启用" value={selectedType.active} onChange={(v) => updateDomain("type_dictionary", (d:any) => { d.types[selectedTypeCode].active = v; })} />
            <Toggle label="高级（默认隐藏）" value={selectedType.advanced} onChange={(v) => updateDomain("type_dictionary", (d:any) => { d.types[selectedTypeCode].advanced = v; })} />
            <NumberField label="bias" value={selectedType.bias} onChange={(v) => updateDomain("type_dictionary", (d:any) => { d.types[selectedTypeCode].bias = v; })} step={0.01} />
          </Card>

          <Card>
            <SectionTitle title="Aliases" desc="用于搜索与命名归一（多语言/缩写）。" />
            <ChipsInput label="aliases" value={selectedType.aliases || []} onChange={(v) => updateDomain("type_dictionary", (d:any) => { d.types[selectedTypeCode].aliases = v; })} />
          </Card>

          <Card>
            <SectionTitle title="Tooltip" />
            <TextArea label="定义" value={selectedType.tooltip?.def || ""} onChange={(v) => updateDomain("type_dictionary", (d:any) => { d.types[selectedTypeCode].tooltip.def = v; })} rows={2} />
            <div className="mt-3" />
            <ChipsInput label="例子 example" value={selectedType.tooltip?.example || []} onChange={(v) => updateDomain("type_dictionary", (d:any) => { d.types[selectedTypeCode].tooltip.example = v; })} />
            <div className="mt-3" />
            <ChipsInput label="反例 anti" value={selectedType.tooltip?.anti || []} onChange={(v) => updateDomain("type_dictionary", (d:any) => { d.types[selectedTypeCode].tooltip.anti = v; })} />
          </Card>

          <Card>
            <SectionTitle title="Type Actions" />
            <div className="flex gap-2">
              <button className="btn" type="button" onClick={createType}>+ 新建类型</button>
              <button className="btn-danger" type="button" onClick={() => deleteType(selectedTypeCode)}>删除类型</button>
            </div>
          </Card>
        </div>
      );
    }

    // Role Dictionary editor
    if (activeTab === "role_dictionary" && selectedRole) {
      const groupOptions = Object.entries(config.domains.role_dictionary.groups).map(([g, v]) => ({ label: `${v.zh} (${g})`, value: g }));
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="基础信息" />
            <TextField label="role_code" value={selectedRoleCode} onChange={(v) => renameRole(selectedRoleCode, v)} />
            <div className="mt-3" />
            <TextField label="中文名" value={selectedRole.zh} onChange={(v) => updateDomain("role_dictionary", (d:any) => { d.roles[selectedRoleCode].zh = v; })} />
            <div className="mt-3" />
            <Select label="分组" value={selectedRole.group} onChange={(v) => updateDomain("role_dictionary", (d:any) => { d.roles[selectedRoleCode].group = v; syncRoleToGroup(d, selectedRoleCode, v); })} options={groupOptions} />
            <Toggle label="启用" value={selectedRole.active} onChange={(v) => updateDomain("role_dictionary", (d:any) => { d.roles[selectedRoleCode].active = v; })} />
            <Toggle label="高级（默认隐藏）" value={selectedRole.advanced} onChange={(v) => updateDomain("role_dictionary", (d:any) => { d.roles[selectedRoleCode].advanced = v; })} />
            <NumberField label="bias" value={selectedRole.bias} onChange={(v) => updateDomain("role_dictionary", (d:any) => { d.roles[selectedRoleCode].bias = v; })} step={0.01} />
          </Card>

          <Card>
            <SectionTitle title="Tooltip" />
            <TextArea label="定义" value={selectedRole.tooltip?.def || ""} onChange={(v) => updateDomain("role_dictionary", (d:any) => { d.roles[selectedRoleCode].tooltip.def = v; })} rows={2} />
            <div className="mt-3" />
            <ChipsInput label="例子 example" value={selectedRole.tooltip?.example || []} onChange={(v) => updateDomain("role_dictionary", (d:any) => { d.roles[selectedRoleCode].tooltip.example = v; })} />
            <div className="mt-3" />
            <ChipsInput label="反例 anti" value={selectedRole.tooltip?.anti || []} onChange={(v) => updateDomain("role_dictionary", (d:any) => { d.roles[selectedRoleCode].tooltip.anti = v; })} />
          </Card>

          <Card>
            <SectionTitle title="Role Actions" />
            <div className="flex gap-2">
              <button className="btn" type="button" onClick={createRole}>+ 新建角色</button>
              <button className="btn-danger" type="button" onClick={() => deleteRole(selectedRoleCode)}>删除角色</button>
            </div>
          </Card>
        </div>
      );
    }

    // Naming Rules editor
    if (activeTab === "naming_rules" && selectedRule) {
      const r = selectedRule;
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Rule Meta" />
            <Toggle label="enabled" value={r.enabled} onChange={(v) => updateDomain("rules.naming", (d:any) => setRuleById(d.patterns, r.id, { enabled: v }))} />
            <NumberField label="priority" value={r.priority} onChange={(v) => updateDomain("rules.naming", (d:any) => setRuleById(d.patterns, r.id, { priority: v }))} step={1} min={0} />
            <Select
              label="scope"
              value={r.scope}
              onChange={(v) => updateDomain("rules.naming", (d:any) => setRuleById(d.patterns, r.id, { scope: v }))}
              options={[
                { label: "field_name", value: "field_name" },
                { label: "comment", value: "comment" },
                { label: "table_name", value: "table_name" },
                { label: "qualified_name", value: "qualified_name" }
              ]}
            />
          </Card>

          <Card>
            <SectionTitle title="Pattern" desc="regex 命中后产生 NAMING evidence + delta。" />
            <TextField label="regex" value={r.regex} onChange={(v) => updateDomain("rules.naming", (d:any) => setRuleById(d.patterns, r.id, { regex: v }))} />
          </Card>

          <Card>
            <SectionTitle title="Delta Mapping" desc="简化为 JSON 文本编辑（生产版可用 DeltaTable）。" />
            <TextArea label="type_delta (JSON)" value={JSON.stringify(r.type_delta, null, 2)} onChange={(txt) => safeJsonUpdate(txt, (obj) => updateDomain("rules.naming", (d:any) => setRuleById(d.patterns, r.id, { type_delta: obj }))))} rows={6} />
            <div className="mt-3" />
            <TextArea label="role_delta (JSON)" value={JSON.stringify(r.role_delta, null, 2)} onChange={(txt) => safeJsonUpdate(txt, (obj) => updateDomain("rules.naming", (d:any) => setRuleById(d.patterns, r.id, { role_delta: obj }))))} rows={6} />
          </Card>

          <Card>
            <SectionTitle title="Evidence Template" />
            <TextField label="title_template" value={r.title_template || ""} onChange={(v) => updateDomain("rules.naming", (d:any) => setRuleById(d.patterns, r.id, { title_template: v }))} />
            <div className="mt-3" />
            <TextArea label="summary_template" value={r.summary_template || ""} onChange={(v) => updateDomain("rules.naming", (d:any) => setRuleById(d.patterns, r.id, { summary_template: v }))} rows={2} />
          </Card>

          <Card>
            <SectionTitle title="Rule Actions" />
            <div className="flex gap-2">
              <button className="btn" type="button" onClick={createRule}>+ 新建规则</button>
              <button className="btn-danger" type="button" onClick={() => deleteRule(r.id)}>删除规则</button>
            </div>
          </Card>
        </div>
      );
    }

    return <Card><SectionTitle title="请选择条目" desc="从左侧选择一个类型/角色/规则进行编辑。" /></Card>;
  }

  function renderRightPane() {
    const res = simMode === "BASELINE" ? baseline : whatIf;
    return (
      <div className="space-y-4">
        <Card>
          <SectionTitle title="即时仿真" desc="编辑配置后自动 WHAT-IF 重算（防抖 300ms）。" />
          <div className="flex items-center gap-2 mb-2">
            <button className={cls("px-2 py-1 rounded-md text-xs border", simMode === "WHAT_IF" ? "border-emerald-600 text-emerald-200" : "border-slate-700 text-slate-300")} onClick={() => setSimMode("WHAT_IF")} type="button">WHAT-IF</button>
            <button className={cls("px-2 py-1 rounded-md text-xs border", simMode === "BASELINE" ? "border-emerald-600 text-emerald-200" : "border-slate-700 text-slate-300")} onClick={() => setSimMode("BASELINE")} type="button">BASELINE</button>
            {simLoading && <Pill tone="yellow">Simulating…</Pill>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-md bg-slate-900 border border-slate-700 px-2 py-2 text-xs text-slate-100" value={sample.fieldId} placeholder="fieldId" onChange={(e) => setSample({ mode: "FIELD_ID", fieldId: e.target.value })} />
            <button className="rounded-md border border-slate-700 bg-slate-900/40 px-2 py-2 text-xs text-slate-200 hover:border-slate-600" onClick={async () => { setSimLoading(true); try { const r = await simulate(versionId, config, sample); setWhatIf(r); } finally { setSimLoading(false); } }} type="button">Run</button>
          </div>

          {res && (
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                <Pill tone={res.queue === "CONFLICT" ? "red" : res.queue === "AUTO_PASS" ? "green" : "yellow"}>{res.queue}</Pill>
                <Pill>{`completeness ${toPct(res.completeness)}`}</Pill>
                <Pill>{`gap ${toPct(res.gap12)}`}</Pill>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-xs font-semibold text-slate-100 mb-2">Joint Top3</div>
                <div className="space-y-1">
                  {res.jointTop3.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                      <div>{i + 1}. {c.semanticType} + {c.role}</div>
                      <Pill tone={c.confidenceLevel === "HIGH" ? "green" : c.confidenceLevel === "MED" ? "yellow" : "gray"}>{toPct(c.confidence)}</Pill>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-100">Evidence Top3</div>
                {res.evidenceTop3.map((e) => (
                  <div key={e.evidenceId} className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-100">{e.title}</div>
                      <div className="flex items-center gap-2">
                        <Pill>{e.dimension}</Pill>
                        <Pill tone={e.source === "RULE" ? "gray" : "yellow"}>{e.source}</Pill>
                        <Pill tone="green">{`+${toPct(e.contribution)}`}</Pill>
                      </div>
                    </div>
                    {e.keySignals && <div className="mt-1 text-[11px] text-slate-500">{JSON.stringify(e.keySignals)}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // actions: Type Dictionary
  function createType() {
    const code = `NEW_TYPE_${Date.now()}`;
    updateDomain("type_dictionary", (d:any) => {
      d.types[code] = { zh: "新类型", group: "UNKNOWN_GROUP", active: true, advanced: false, bias: 0.0, aliases: [], tooltip: { def: "", example: [], anti: [] } };
      d.groups.UNKNOWN_GROUP.items = Array.from(new Set([...(d.groups.UNKNOWN_GROUP.items || []), code]));
    });
    setSelectedTypeCode(code);
  }
  function deleteType(code: string) {
    if (!confirm(`删除 Type ${code}？`)) return;
    updateDomain("type_dictionary", (d:any) => {
      delete d.types[code];
      Object.keys(d.groups).forEach((g) => { d.groups[g].items = (d.groups[g].items || []).filter((x:string) => x !== code); });
    });
    const next = Object.keys(config.domains.type_dictionary.types).filter((x) => x !== code)[0] || "UNKNOWN";
    setSelectedTypeCode(next);
  }
  function renameType(oldCode: string, newCode: string) {
    const nc = newCode.trim();
    if (!nc || nc === oldCode) return;
    updateDomain("type_dictionary", (d:any) => {
      if (d.types[nc]) return;
      d.types[nc] = d.types[oldCode];
      delete d.types[oldCode];
      Object.keys(d.groups).forEach((g) => { d.groups[g].items = (d.groups[g].items || []).map((x:string) => x === oldCode ? nc : x); });
    });
    setSelectedTypeCode(nc);
  }

  // actions: Role Dictionary
  function createRole() {
    const code = `NEW_ROLE_${Date.now()}`;
    updateDomain("role_dictionary", (d:any) => {
      d.roles[code] = { zh: "新角色", group: "GOVERN_TECH", active: true, advanced: false, bias: 0.0, tooltip: { def: "", example: [], anti: [] } };
      d.groups.GOVERN_TECH.items = Array.from(new Set([...(d.groups.GOVERN_TECH.items || []), code]));
    });
    setSelectedRoleCode(code);
  }
  function deleteRole(code: string) {
    if (!confirm(`删除 Role ${code}？`)) return;
    updateDomain("role_dictionary", (d:any) => {
      delete d.roles[code];
      Object.keys(d.groups).forEach((g) => { d.groups[g].items = (d.groups[g].items || []).filter((x:string) => x !== code); });
    });
    const next = Object.keys(config.domains.role_dictionary.roles).filter((x) => x !== code)[0] || "PRIMARY_KEY";
    setSelectedRoleCode(next);
  }
  function renameRole(oldCode: string, newCode: string) {
    const nc = newCode.trim();
    if (!nc || nc === oldCode) return;
    updateDomain("role_dictionary", (d:any) => {
      if (d.roles[nc]) return;
      d.roles[nc] = d.roles[oldCode];
      delete d.roles[oldCode];
      Object.keys(d.groups).forEach((g) => { d.groups[g].items = (d.groups[g].items || []).map((x:string) => x === oldCode ? nc : x); });
    });
    setSelectedRoleCode(nc);
  }

  // actions: Naming Rules
  function createRule() {
    const id = `new_rule_${Date.now()}`;
    updateDomain("rules.naming", (d:any) => { d.patterns.push({ id, enabled: true, priority: 100, scope: "field_name", regex: ".*", type_delta: {}, role_delta: {} }); });
    setSelectedRuleId(id);
  }
  function deleteRule(id: string) {
    if (!confirm(`删除规则 ${id}？`)) return;
    updateDomain("rules.naming", (d:any) => { d.patterns = d.patterns.filter((x:NamingRule) => x.id !== id); });
    const next = config.domains["rules.naming"].patterns.filter((x) => x.id !== id)[0]?.id;
    setSelectedRuleId(next);
  }
  function safeJsonUpdate(txt: string, apply: (obj:any) => void) { try { const obj = JSON.parse(txt); apply(obj); } catch { /* ignore */ } }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopBar
        versionId={config.versionId}
        status={config.status}
        baseVersionId={config.baseVersionId}
        dirty={dirty}
        onSave={onSave}
        onValidate={onValidate}
        onDiff={() => nav(`/semantic/config/${versionId}/diff`)}
        onPublish={() => nav(`/semantic/config/${versionId}/publish`)}
      />

      <div className="mx-auto max-w-[1400px] px-4 py-4 grid grid-cols-12 gap-4">
        <div className="col-span-2">
          <div className="sticky top-[72px] space-y-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={cls(
                  "w-full text-left rounded-xl border px-3 py-2 text-xs transition",
                  activeTab === t.id ? "border-emerald-600 bg-emerald-900/20" : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                )}
                onClick={() => setActiveTab(t.id)}
                type="button"
              >
                {t.title}
                <div className="mt-1 text-[11px] text-slate-400">{t.domain}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-3">{renderLeftPane()}</div>
        </div>

        <div className="col-span-4">{renderCenterPane()}</div>

        <div className="col-span-3">{renderRightPane()}</div>
      </div>
    </div>
  );

  function syncTypeToGroup(d:any, code:string, newGroup:string){
    Object.keys(d.groups).forEach((g)=>{ d.groups[g].items = (d.groups[g].items||[]).filter((x:string)=>x!==code); });
    d.groups[newGroup] = d.groups[newGroup] || { zh:newGroup, items:[] };
    if (!d.groups[newGroup].items.includes(code)) d.groups[newGroup].items.push(code);
  }
  function syncRoleToGroup(d:any, code:string, newGroup:string){
    Object.keys(d.groups).forEach((g)=>{ d.groups[g].items = (d.groups[g].items||[]).filter((x:string)=>x!==code); });
    d.groups[newGroup] = d.groups[newGroup] || { zh:newGroup, items:[] };
    if (!d.groups[newGroup].items.includes(code)) d.groups[newGroup].items.push(code);
  }
}

function TopBar({
  versionId,
  status,
  baseVersionId,
  dirty,
  onSave,
  onValidate,
  onDiff,
  onPublish
}:{
  versionId:string; status:string; baseVersionId?:string; dirty:boolean;
  onSave:()=>void; onValidate:()=>void; onDiff:()=>void; onPublish:()=>void;
}){
  return (
    <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold">配置编辑器</div>
          <Pill>{versionId}</Pill>
          <Pill tone={status === "DRAFT" ? "yellow" : "green"}>{status}</Pill>
          {baseVersionId && <Pill>{`base ${baseVersionId}`}</Pill>}
          {dirty && <Pill tone="red">Unsaved</Pill>}
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold" onClick={onSave} type="button">保存</button>
          <button className="rounded-md border border-slate-700 px-3 py-1.5 text-xs" onClick={onValidate} type="button">校验</button>
          <button className="rounded-md border border-slate-700 px-3 py-1.5 text-xs" onClick={onDiff} type="button">生成Diff</button>
          <button className="rounded-md border border-rose-700 bg-rose-900/30 px-3 py-1.5 text-xs" onClick={onPublish} type="button">发布/灰度</button>
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      {children}
      <style>{`
        .btn{border:1px solid #334155;background:rgba(15,23,42,.4);padding:.5rem .75rem;border-radius:.375rem;font-size:.75rem;color:#e2e8f0;}
        .btn:hover{border-color:#475569;}
        .btn-danger{border:1px solid rgba(244,63,94,.6);background:rgba(136,19,55,.25);padding:.5rem .75rem;border-radius:.375rem;font-size:.75rem;color:#fecdd3;}
        .btn-danger:hover{border-color:rgba(244,63,94,.85);}
      `}</style>
    </div>
  );
}

function setRuleById(arr: NamingRule[], id: string, patch: Partial<NamingRule>) {
  const idx = arr.findIndex((x) => x.id === id);
  if (idx >= 0) arr[idx] = { ...arr[idx], ...patch };
}
