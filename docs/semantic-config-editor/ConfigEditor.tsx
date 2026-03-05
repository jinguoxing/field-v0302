import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { defaultDomains } from "./defaults";
import { simulate, updateSection, validateVersion } from "./mockApi";
import {
  ConfigState,
  TabDef,
  TabId,
  SimulationSampleRef,
  SimulationResult,
  NamingRule,
  ProfileDetector,
  MetadataRule,
  StandardsMapping,
} from "./types";
import { ChipsInput, cls, JsonTextArea, NumberField, Pill, SectionTitle, Select, TextArea, TextField, Toggle } from "./components/ui";
import { EntityList, ListItem } from "./components/list";

// ---------------- Tabs ----------------
const TABS: TabDef[] = [
  { id: "weights_thresholds", title: "Weights & Thresholds", domain: "weights" },
  { id: "naming_rules", title: "Naming Rules (D1)", domain: "rules.naming" },
  { id: "profile_rules", title: "Profile Rules (D2)", domain: "rules.profile" },
  { id: "metadata_rules", title: "Metadata Rules (D3)", domain: "rules.metadata" },
  { id: "usage_rules", title: "Usage Rules (D4)", domain: "rules.usage" },
  { id: "standards_rules", title: "Standards Rules (D5)", domain: "rules.standards" },
  { id: "consistency_rules", title: "Consistency Rules (D6+D7)", domain: "rules.consistency" },
  { id: "compat_matrix", title: "Compat Matrix", domain: "compat" },
  { id: "ignore_llm", title: "Ignore + LLM", domain: "ignore_llm" },
];

function toPct(x: number) {
  return `${Math.round(x * 100)}%`;
}

// debounce
function useDebouncedEffect(fn: () => void, deps: any[], delay: number) {
  const t = useRef<number | null>(null);
  useEffect(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(fn, delay);
    return () => {
      if (t.current) window.clearTimeout(t.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function deepClone<T>(v: T): T {
  return structuredClone(v);
}

export default function ConfigEditor() {
  const { versionId = "v_demo" } = useParams();
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();

  const initialTab = (sp.get("tab") as TabId) || "weights_thresholds";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const [config, setConfig] = useState<ConfigState>(() => ({
    versionId,
    versionName: "Draft v_demo",
    status: "DRAFT",
    baseVersionId: "v_active",
    domains: defaultDomains(),
  }));

  const [dirty, setDirty] = useState(false);

  // selections for list-based tabs
  const [selectedNamingId, setSelectedNamingId] = useState<string>(config.domains["rules.naming"].patterns[0]?.id);
  const [selectedDetectorId, setSelectedDetectorId] = useState<string>(config.domains["rules.profile"].detectors[0]?.detector_id);
  const [selectedMetaRuleId, setSelectedMetaRuleId] = useState<string>(config.domains["rules.metadata"].rules[0]?.rule_id);
  const [selectedMappingIndex, setSelectedMappingIndex] = useState<number>(0);

  // consistency subtab & compat selected type
  const [consistencySubTab, setConsistencySubTab] = useState<"intra" | "inter">("intra");
  const [compatType, setCompatType] = useState<string>(() => Object.keys(config.domains.compat.matrix)[0] || "DATETIME");

  // simulation
  const [sample, setSample] = useState<SimulationSampleRef>({ mode: "FIELD_ID", fieldId: "f_demo" });
  const [baseline, setBaseline] = useState<SimulationResult | undefined>();
  const [whatIf, setWhatIf] = useState<SimulationResult | undefined>();
  const [simMode, setSimMode] = useState<"BASELINE" | "WHAT_IF">("WHAT_IF");
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    setSp((prev) => {
      prev.set("tab", activeTab);
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // baseline init
  useEffect(() => {
    (async () => {
      const baseCfg: ConfigState = {
        ...config,
        domains: defaultDomains(),
      };
      const res = await simulate(versionId, baseCfg, sample);
      setBaseline(res);
      setWhatIf(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionId]);

  // what-if on edit
  useDebouncedEffect(
    () => {
      (async () => {
        setSimLoading(true);
        try {
          const res = await simulate(versionId, config, sample);
          setWhatIf(res);
        } finally {
          setSimLoading(false);
        }
      })();
    },
    [config, sample, versionId],
    300
  );

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
    const domain = tab.domain as keyof ConfigState["domains"];
    await updateSection(versionId, tab.domain, (config.domains as any)[domain]);
    setDirty(false);
    alert(`Mock 保存成功：${tab.domain}（请替换为真实 API）`);
  }

  async function onValidate() {
    const r = await validateVersion(versionId);
    alert(r.ok ? "Mock 校验通过（请替换为真实 API）" : `校验失败：${(r.errors || []).join("\n")}`);
  }

  function onDiff() {
    nav(`/semantic/config/${versionId}/diff`);
  }
  function onPublish() {
    nav(`/semantic/config/${versionId}/publish`);
  }

  // ---------- helpers to build list items ----------
  const namingItems: ListItem[] = useMemo(
    () =>
      config.domains["rules.naming"].patterns.map((r) => ({
        id: r.id,
        title: r.id,
        subtitle: r.regex,
        badges: [
          { text: r.enabled ? "Enabled" : "Disabled", tone: r.enabled ? "green" : "gray" },
          { text: `P${r.priority}`, tone: "gray" },
        ],
      })),
    [config.domains]
  );

  const profileItems: ListItem[] = useMemo(
    () =>
      config.domains["rules.profile"].detectors.map((d) => ({
        id: d.detector_id,
        title: d.detector_id,
        subtitle: d.title_template || "",
        badges: [{ text: d.enabled ? "Enabled" : "Disabled", tone: d.enabled ? "green" : "gray" }],
      })),
    [config.domains]
  );

  const metadataItems: ListItem[] = useMemo(
    () =>
      config.domains["rules.metadata"].rules.map((r) => ({
        id: r.rule_id,
        title: r.rule_id,
        subtitle: JSON.stringify(r.condition),
        badges: [{ text: r.enabled ? "Enabled" : "Disabled", tone: r.enabled ? "green" : "gray" }, { text: `P${r.priority}` }],
      })),
    [config.domains]
  );

  // ---------- selected entities ----------
  const selectedNaming = useMemo(
    () => config.domains["rules.naming"].patterns.find((r) => r.id === selectedNamingId),
    [config.domains, selectedNamingId]
  );
  const selectedDetector = useMemo(
    () => config.domains["rules.profile"].detectors.find((d) => d.detector_id === selectedDetectorId),
    [config.domains, selectedDetectorId]
  );
  const selectedMetaRule = useMemo(
    () => config.domains["rules.metadata"].rules.find((r) => r.rule_id === selectedMetaRuleId),
    [config.domains, selectedMetaRuleId]
  );

  // ---------- render: left pane ----------
  function renderLeftPane() {
    if (activeTab === "naming_rules") {
      return (
        <EntityList
          header={{ title: "Naming Rules", desc: "选择规则编辑；用于 D1 命名证据。" }}
          items={namingItems}
          selectedId={selectedNamingId}
          onSelect={(id) => setSelectedNamingId(id)}
        />
      );
    }
    if (activeTab === "profile_rules") {
      return (
        <EntityList
          header={{ title: "Profile Detectors", desc: "画像探测器；用于 D2 画像证据。" }}
          items={profileItems}
          selectedId={selectedDetectorId}
          onSelect={(id) => setSelectedDetectorId(id)}
        />
      );
    }
    if (activeTab === "metadata_rules") {
      return (
        <EntityList
          header={{ title: "Metadata Rules", desc: "硬约束映射；用于 D3 元数据证据。" }}
          items={metadataItems}
          selectedId={selectedMetaRuleId}
          onSelect={(id) => setSelectedMetaRuleId(id)}
        />
      );
    }
    if (activeTab === "standards_rules") {
      const mappings = config.domains["rules.standards"].mappings;
      const items: ListItem[] = mappings.map((m, idx) => ({
        id: String(idx),
        title: `${m.match_type}:${m.ref_id}`,
        subtitle: `type_delta keys=${Object.keys(m.type_delta || {}).length}`,
      }));
      return (
        <EntityList
          header={{ title: "Standard Mappings", desc: "标准命中映射；用于 D5 标准证据。" }}
          items={items}
          selectedId={String(selectedMappingIndex)}
          onSelect={(id) => setSelectedMappingIndex(Number(id))}
        />
      );
    }
    if (activeTab === "consistency_rules") {
      const items: ListItem[] = [
        { id: "intra", title: "同表一致性 (D6)", subtitle: "竞争组/冗余识别" },
        { id: "inter", title: "跨表匹配 (D7)", subtitle: "FK 目标匹配权重/阈值" },
      ];
      return (
        <EntityList
          header={{ title: "Consistency", desc: "D6+D7 规则配置" }}
          items={items}
          selectedId={consistencySubTab}
          onSelect={(id) => setConsistencySubTab(id as any)}
        />
      );
    }
    if (activeTab === "compat_matrix") {
      const types = Object.keys(config.domains.compat.matrix);
      const items: ListItem[] = types.map((t) => ({ id: t, title: t, subtitle: "Type" }));
      return (
        <EntityList header={{ title: "Types", desc: "选择一个语义类型编辑其 Role 兼容矩阵" }} items={items} selectedId={compatType} onSelect={setCompatType} />
      );
    }

    // weights/usage/ignore tab: show a simple section list
    return (
      <div className="space-y-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-200">本 Tab 无列表</div>
        <div className="text-[11px] text-slate-400">右侧即时仿真会随配置变化更新。</div>
      </div>
    );
  }

  // ---------- render: center pane ----------
  function renderCenterPane() {
    // 1) weights
    if (activeTab === "weights_thresholds") {
      const w = config.domains.weights;
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Softmax & Joint" desc="影响置信度分布与联合候选。" />
            <NumberField label="tau" value={w.softmax.tau} onChange={(v) => updateDomain("weights", (d: any) => (d.softmax.tau = v))} min={0.01} max={2} step={0.01} />
            <NumberField label="alpha" value={w.joint.alpha} onChange={(v) => updateDomain("weights", (d: any) => (d.joint.alpha = v))} min={0} max={1} step={0.01} />
          </Card>

          <Card>
            <SectionTitle title="Queue Thresholds" desc="分流阈值：AUTO_PASS / CONFLICT / IGNORE_CANDIDATE" />
            <NumberField
              label="AUTO_PASS top1_conf_min"
              value={w.thresholds.queue.auto_pass.top1_conf_min}
              onChange={(v) => updateDomain("weights", (d: any) => (d.thresholds.queue.auto_pass.top1_conf_min = v))}
              min={0}
              max={1}
            />
            <NumberField
              label="AUTO_PASS gap12_min"
              value={w.thresholds.queue.auto_pass.gap12_min}
              onChange={(v) => updateDomain("weights", (d: any) => (d.thresholds.queue.auto_pass.gap12_min = v))}
              min={0}
              max={1}
            />
            <NumberField
              label="CONFLICT gap12_max"
              value={w.thresholds.queue.conflict.gap12_max}
              onChange={(v) => updateDomain("weights", (d: any) => (d.thresholds.queue.conflict.gap12_max = v))}
              min={0}
              max={1}
            />
            <NumberField
              label="IGNORE ignore_score_min"
              value={w.thresholds.queue.ignore_candidate.ignore_score_min}
              onChange={(v) => updateDomain("weights", (d: any) => (d.thresholds.queue.ignore_candidate.ignore_score_min = v))}
              min={0}
              max={1}
            />
          </Card>

          <Card>
            <SectionTitle title="UNKNOWN Policy" desc="证据不足时对 UNKNOWN 的兜底策略。" />
            <NumberField
              label="when_completeness_lt"
              value={w.unknown_policy.when_completeness_lt}
              onChange={(v) => updateDomain("weights", (d: any) => (d.unknown_policy.when_completeness_lt = v))}
              min={0}
              max={1}
            />
            <NumberField
              label="non_unknown_penalty"
              value={w.unknown_policy.non_unknown_penalty}
              onChange={(v) => updateDomain("weights", (d: any) => (d.unknown_policy.non_unknown_penalty = v))}
              step={0.01}
            />
            <NumberField
              label="unknown_bonus"
              value={w.unknown_policy.unknown_bonus}
              onChange={(v) => updateDomain("weights", (d: any) => (d.unknown_policy.unknown_bonus = v))}
              step={0.01}
            />
          </Card>

          <Card>
            <SectionTitle title="LLM Policy" desc="LLM 仅用于解释/缺失提示/小幅调分（<=0.05）。" />
            <Toggle label="enabled_default" value={w.llm.enabled_default} onChange={(v) => updateDomain("weights", (d: any) => (d.llm.enabled_default = v))} />
            <NumberField label="max_calls_per_lv" value={w.llm.max_calls_per_lv} onChange={(v) => updateDomain("weights", (d: any) => (d.llm.max_calls_per_lv = v))} step={1} min={0} />
            <NumberField
              label="max_delta_per_candidate"
              value={w.llm.max_delta_per_candidate}
              onChange={(v) => updateDomain("weights", (d: any) => (d.llm.max_delta_per_candidate = v))}
              min={0}
              max={0.05}
              step={0.01}
            />
          </Card>

          <Card>
            <SectionTitle title="Raw (debug)" desc="示例：展示 weights JSON（你可替换为 YAML RawEditor）。" />
            <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">{JSON.stringify(w, null, 2)}</pre>
          </Card>
        </div>
      );
    }

    // 2) naming rules
    if (activeTab === "naming_rules" && selectedNaming) {
      const r = selectedNaming;
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Rule Meta" />
            <Toggle label="enabled" value={r.enabled} onChange={(v) => updateDomain("rules.naming", (d: any) => setRuleById(d.patterns, r.id, { enabled: v }))} />
            <NumberField label="priority" value={r.priority} onChange={(v) => updateDomain("rules.naming", (d: any) => setRuleById(d.patterns, r.id, { priority: v }))} step={1} min={0} />
            <Select
              label="scope"
              value={r.scope}
              onChange={(v) => updateDomain("rules.naming", (d: any) => setRuleById(d.patterns, r.id, { scope: v as any }))}
              options={[
                { label: "field_name", value: "field_name" },
                { label: "comment", value: "comment" },
                { label: "table_name", value: "table_name" },
                { label: "qualified_name", value: "qualified_name" },
              ]}
            />
          </Card>

          <Card>
            <SectionTitle title="Pattern" desc="regex 命中后产生 NAMING evidence + delta。" />
            <TextField label="regex" value={r.regex} onChange={(v) => updateDomain("rules.naming", (d: any) => setRuleById(d.patterns, r.id, { regex: v }))} />
          </Card>

          <Card>
            <SectionTitle title="Delta Mapping" desc="使用 JSON 编辑（生产版可替换 DeltaTable）。" />
            <JsonTextArea label="type_delta" value={r.type_delta} onChange={(v) => updateDomain("rules.naming", (d: any) => setRuleById(d.patterns, r.id, { type_delta: v }))} />
            <div className="mt-3" />
            <JsonTextArea label="role_delta" value={r.role_delta} onChange={(v) => updateDomain("rules.naming", (d: any) => setRuleById(d.patterns, r.id, { role_delta: v }))} />
          </Card>

          <Card>
            <SectionTitle title="Evidence Template" />
            <TextField
              label="title_template"
              value={r.title_template || ""}
              onChange={(v) => updateDomain("rules.naming", (d: any) => setRuleById(d.patterns, r.id, { title_template: v }))}
            />
            <div className="mt-3" />
            <TextArea
              label="summary_template"
              value={r.summary_template || ""}
              onChange={(v) => updateDomain("rules.naming", (d: any) => setRuleById(d.patterns, r.id, { summary_template: v }))}
              rows={2}
            />
          </Card>

          <Card>
            <SectionTitle title="Rule Actions" />
            <div className="flex gap-2">
              <button
                className="rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-xs text-slate-200 hover:border-slate-600"
                type="button"
                onClick={() =>
                  updateDomain("rules.naming", (d: any) =>
                    d.patterns.push({
                      id: `new_rule_${Date.now()}`,
                      enabled: true,
                      priority: 100,
                      scope: "field_name",
                      regex: ".*",
                      type_delta: {},
                      role_delta: {},
                    })
                  )
                }
              >
                + 新建规则
              </button>
              <button
                className="rounded-md border border-rose-700 bg-rose-900/30 px-3 py-2 text-xs text-rose-200 hover:border-rose-600"
                type="button"
                onClick={() =>
                  updateDomain("rules.naming", (d: any) => {
                    d.patterns = d.patterns.filter((x: NamingRule) => x.id !== r.id);
                    setSelectedNamingId(d.patterns[0]?.id);
                  })
                }
              >
                删除规则
              </button>
            </div>
          </Card>
        </div>
      );
    }

    // 3) profile detectors
    if (activeTab === "profile_rules" && selectedDetector) {
      const d0 = selectedDetector;
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Detector Meta" />
            <Toggle
              label="enabled"
              value={d0.enabled}
              onChange={(v) => updateDomain("rules.profile", (d: any) => setDetectorById(d.detectors, d0.detector_id, { enabled: v }))}
            />
            <Select
              label="function"
              value={d0.function}
              onChange={(v) => updateDomain("rules.profile", (d: any) => setDetectorById(d.detectors, d0.detector_id, { function: v as any }))}
              options={[
                { label: "piecewise_linear", value: "piecewise_linear" },
                { label: "logistic", value: "logistic" },
              ]}
            />
            <TextField
              label="detector_id"
              value={d0.detector_id}
              onChange={(v) =>
                updateDomain("rules.profile", (d: any) => {
                  // rename detector_id: ensure uniqueness
                  const idx = d.detectors.findIndex((x: ProfileDetector) => x.detector_id === d0.detector_id);
                  if (idx >= 0) d.detectors[idx].detector_id = v;
                  setSelectedDetectorId(v);
                })
              }
            />
          </Card>

          <Card>
            <SectionTitle title="Params (JSON)" desc="画像阈值/分段函数参数。" />
            <JsonTextArea label="params" value={d0.params} onChange={(v) => updateDomain("rules.profile", (d: any) => setDetectorById(d.detectors, d0.detector_id, { params: v }))} />
          </Card>

          <Card>
            <SectionTitle title="Delta Mapping" />
            <JsonTextArea label="type_delta" value={d0.type_delta} onChange={(v) => updateDomain("rules.profile", (d: any) => setDetectorById(d.detectors, d0.detector_id, { type_delta: v }))} />
            <div className="mt-3" />
            <JsonTextArea
              label="role_delta"
              value={d0.role_delta || {}}
              onChange={(v) => updateDomain("rules.profile", (d: any) => setDetectorById(d.detectors, d0.detector_id, { role_delta: v }))}
            />
          </Card>

          <Card>
            <SectionTitle title="Evidence Template" />
            <TextField
              label="title_template"
              value={d0.title_template || ""}
              onChange={(v) => updateDomain("rules.profile", (d: any) => setDetectorById(d.detectors, d0.detector_id, { title_template: v }))}
            />
            <div className="mt-3" />
            <ChipsInput
              label="signal_keys"
              value={d0.signal_keys || []}
              onChange={(v) => updateDomain("rules.profile", (d: any) => setDetectorById(d.detectors, d0.detector_id, { signal_keys: v }))}
            />
          </Card>

          <Card>
            <SectionTitle title="Detector Actions" />
            <div className="flex gap-2">
              <button
                className="rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-xs text-slate-200 hover:border-slate-600"
                type="button"
                onClick={() =>
                  updateDomain("rules.profile", (d: any) =>
                    d.detectors.push({
                      detector_id: `new_detector_${Date.now()}`,
                      enabled: true,
                      function: "piecewise_linear",
                      params: {},
                      type_delta: {},
                      role_delta: {},
                    })
                  )
                }
              >
                + 新建探测器
              </button>
              <button
                className="rounded-md border border-rose-700 bg-rose-900/30 px-3 py-2 text-xs text-rose-200 hover:border-rose-600"
                type="button"
                onClick={() =>
                  updateDomain("rules.profile", (d: any) => {
                    d.detectors = d.detectors.filter((x: ProfileDetector) => x.detector_id !== d0.detector_id);
                    setSelectedDetectorId(d.detectors[0]?.detector_id);
                  })
                }
              >
                删除探测器
              </button>
            </div>
          </Card>
        </div>
      );
    }

    // 4) metadata rules
    if (activeTab === "metadata_rules" && selectedMetaRule) {
      const r = selectedMetaRule;
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Rule Meta" />
            <Toggle label="enabled" value={r.enabled} onChange={(v) => updateDomain("rules.metadata", (d: any) => setMetaRuleById(d.rules, r.rule_id, { enabled: v }))} />
            <NumberField label="priority" value={r.priority} onChange={(v) => updateDomain("rules.metadata", (d: any) => setMetaRuleById(d.rules, r.rule_id, { priority: v }))} step={1} min={0} />
            <TextField
              label="rule_id"
              value={r.rule_id}
              onChange={(v) =>
                updateDomain("rules.metadata", (d: any) => {
                  const idx = d.rules.findIndex((x: MetadataRule) => x.rule_id === r.rule_id);
                  if (idx >= 0) d.rules[idx].rule_id = v;
                  setSelectedMetaRuleId(v);
                })
              }
            />
          </Card>

          <Card>
            <SectionTitle title="Condition (JSON)" desc="例如 {isPK:true} / {isFK:true} / {isPartition:true}。" />
            <JsonTextArea label="condition" value={r.condition} onChange={(v) => updateDomain("rules.metadata", (d: any) => setMetaRuleById(d.rules, r.rule_id, { condition: v }))} />
          </Card>

          <Card>
            <SectionTitle title="Delta Mapping" desc="元数据规则通常是强证据（role_delta 更重要）。" />
            <JsonTextArea label="role_delta" value={r.role_delta} onChange={(v) => updateDomain("rules.metadata", (d: any) => setMetaRuleById(d.rules, r.rule_id, { role_delta: v }))} />
            <div className="mt-3" />
            <JsonTextArea label="type_delta (optional)" value={r.type_delta || {}} onChange={(v) => updateDomain("rules.metadata", (d: any) => setMetaRuleById(d.rules, r.rule_id, { type_delta: v }))} />
          </Card>

          <Card>
            <SectionTitle title="Rule Actions" />
            <div className="flex gap-2">
              <button
                className="rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-xs text-slate-200 hover:border-slate-600"
                type="button"
                onClick={() =>
                  updateDomain("rules.metadata", (d: any) =>
                    d.rules.push({
                      rule_id: `new_meta_${Date.now()}`,
                      enabled: true,
                      priority: 100,
                      condition: {},
                      role_delta: {},
                    })
                  )
                }
              >
                + 新建规则
              </button>
              <button
                className="rounded-md border border-rose-700 bg-rose-900/30 px-3 py-2 text-xs text-rose-200 hover:border-rose-600"
                type="button"
                onClick={() =>
                  updateDomain("rules.metadata", (d: any) => {
                    d.rules = d.rules.filter((x: MetadataRule) => x.rule_id !== r.rule_id);
                    setSelectedMetaRuleId(d.rules[0]?.rule_id);
                  })
                }
              >
                删除规则
              </button>
            </div>
          </Card>
        </div>
      );
    }

    // 5) usage rules
    if (activeTab === "usage_rules") {
      const u = config.domains["rules.usage"];
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Normalization" desc="u(x)=min(1, log(1+x)/log(1+U))，U=p95_u" />
            <NumberField label="p95_u" value={u.p95_u} onChange={(v) => updateDomain("rules.usage", (d: any) => (d.p95_u = v))} step={1} min={1} />
            <Select label="function" value={u.function} onChange={(v) => updateDomain("rules.usage", (d: any) => (d.function = v))} options={[{ label: "log", value: "log" }]} />
          </Card>

          <Card>
            <SectionTitle title="Usage → Role Mapping" />
            <NumberField
              label="FOREIGN_KEY.join_weight"
              value={u.map.FOREIGN_KEY.join_weight}
              onChange={(v) => updateDomain("rules.usage", (d: any) => (d.map.FOREIGN_KEY.join_weight = v))}
              step={0.05}
            />
            <NumberField
              label="DIMENSION.groupby_weight"
              value={u.map.DIMENSION.groupby_weight}
              onChange={(v) => updateDomain("rules.usage", (d: any) => (d.map.DIMENSION.groupby_weight = v))}
              step={0.05}
            />
            <NumberField
              label="DIMENSION.filter_weight"
              value={u.map.DIMENSION.filter_weight}
              onChange={(v) => updateDomain("rules.usage", (d: any) => (d.map.DIMENSION.filter_weight = v))}
              step={0.05}
            />
            <NumberField
              label="MEASURE.agg_weight"
              value={u.map.MEASURE.agg_weight}
              onChange={(v) => updateDomain("rules.usage", (d: any) => (d.map.MEASURE.agg_weight = v))}
              step={0.05}
            />
            <NumberField
              label="EVENT_TIME.time_range_weight"
              value={u.map.EVENT_TIME.time_range_weight}
              onChange={(v) => updateDomain("rules.usage", (d: any) => (d.map.EVENT_TIME.time_range_weight = v))}
              step={0.05}
            />
          </Card>

          <Card>
            <SectionTitle title="Raw (debug)" />
            <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">{JSON.stringify(u, null, 2)}</pre>
          </Card>
        </div>
      );
    }

    // 6) standards rules
    if (activeTab === "standards_rules") {
      const s = config.domains["rules.standards"];
      const mapping = s.mappings[selectedMappingIndex];
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Match Threshold" />
            <NumberField
              label="min_match_score"
              value={s.min_match_score}
              onChange={(v) => updateDomain("rules.standards", (d: any) => (d.min_match_score = v))}
              min={0}
              max={1}
              step={0.01}
            />
          </Card>

          <Card>
            <SectionTitle title="Selected Mapping" desc="从左侧列表选择一条 mapping 进行编辑。" />
            {!mapping ? (
              <div className="text-xs text-slate-400">没有 mapping，请先新增。</div>
            ) : (
              <div className="space-y-3">
                <Select
                  label="match_type"
                  value={mapping.match_type}
                  onChange={(v) =>
                    updateDomain("rules.standards", (d: any) => {
                      d.mappings[selectedMappingIndex].match_type = v;
                    })
                  }
                  options={[
                    { label: "TERM", value: "TERM" },
                    { label: "DATA_ELEMENT", value: "DATA_ELEMENT" },
                    { label: "CODELIST", value: "CODELIST" },
                    { label: "NAMING_RULE", value: "NAMING_RULE" },
                  ]}
                />
                <TextField
                  label="ref_id"
                  value={mapping.ref_id}
                  onChange={(v) =>
                    updateDomain("rules.standards", (d: any) => {
                      d.mappings[selectedMappingIndex].ref_id = v;
                    })
                  }
                />
                <JsonTextArea
                  label="type_delta"
                  value={mapping.type_delta}
                  onChange={(v) =>
                    updateDomain("rules.standards", (d: any) => {
                      d.mappings[selectedMappingIndex].type_delta = v;
                    })
                  }
                />
                <div className="mt-3" />
                <JsonTextArea
                  label="role_delta (optional)"
                  value={mapping.role_delta || {}}
                  onChange={(v) =>
                    updateDomain("rules.standards", (d: any) => {
                      d.mappings[selectedMappingIndex].role_delta = v;
                    })
                  }
                />
                <div className="mt-3" />
                <JsonTextArea
                  label="meta (optional)"
                  value={mapping.meta || {}}
                  onChange={(v) =>
                    updateDomain("rules.standards", (d: any) => {
                      d.mappings[selectedMappingIndex].meta = v;
                    })
                  }
                />
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle title="Mapping Actions" />
            <div className="flex gap-2">
              <button
                className="rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-xs text-slate-200 hover:border-slate-600"
                type="button"
                onClick={() =>
                  updateDomain("rules.standards", (d: any) => {
                    d.mappings.push({ match_type: "TERM", ref_id: "new_ref", type_delta: {}, role_delta: {} });
                    setSelectedMappingIndex(d.mappings.length - 1);
                  })
                }
              >
                + 新增 mapping
              </button>
              <button
                className="rounded-md border border-rose-700 bg-rose-900/30 px-3 py-2 text-xs text-rose-200 hover:border-rose-600"
                type="button"
                onClick={() =>
                  updateDomain("rules.standards", (d: any) => {
                    d.mappings.splice(selectedMappingIndex, 1);
                    setSelectedMappingIndex(Math.max(0, selectedMappingIndex - 1));
                  })
                }
              >
                删除 mapping
              </button>
            </div>
          </Card>

          <Card>
            <SectionTitle title="Raw (debug)" />
            <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">{JSON.stringify(s, null, 2)}</pre>
          </Card>
        </div>
      );
    }

    // 7) consistency rules
    if (activeTab === "consistency_rules") {
      const c = config.domains["rules.consistency"];
      if (consistencySubTab === "intra") {
        return (
          <div className="space-y-6">
            <Card>
              <SectionTitle title="Intra-table (D6)" desc="同表竞争：relUnique/relUsage 加权 + 分组规则。" />
              <NumberField
                label="relUniqueWeight"
                value={c.intra.relUniqueWeight}
                onChange={(v) => updateDomain("rules.consistency", (d: any) => (d.intra.relUniqueWeight = v))}
                min={0}
                max={1}
                step={0.01}
              />
              <NumberField
                label="relUsageWeight"
                value={c.intra.relUsageWeight}
                onChange={(v) => updateDomain("rules.consistency", (d: any) => (d.intra.relUsageWeight = v))}
                min={0}
                max={1}
                step={0.01}
              />
            </Card>

            <Card>
              <SectionTitle title="Grouping Rules" desc="suffix/prefix/semantic/regex，决定竞争组如何形成。" />
              <div className="space-y-2">
                {c.intra.groupingRules.map((g: any, idx: number) => (
                  <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                    <Select
                      label="type"
                      value={g.type}
                      onChange={(v) => updateDomain("rules.consistency", (d: any) => (d.intra.groupingRules[idx].type = v))}
                      options={[
                        { label: "suffix", value: "suffix" },
                        { label: "prefix", value: "prefix" },
                        { label: "semantic", value: "semantic" },
                        { label: "regex", value: "regex" },
                      ]}
                    />
                    <div className="mt-2" />
                    <TextField label="value" value={g.value} onChange={(v) => updateDomain("rules.consistency", (d: any) => (d.intra.groupingRules[idx].value = v))} />
                    <div className="mt-2" />
                    <NumberField
                      label="weight(optional)"
                      value={g.weight ?? 1}
                      onChange={(v) => updateDomain("rules.consistency", (d: any) => (d.intra.groupingRules[idx].weight = v))}
                      step={0.1}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        className="text-xs text-rose-200 hover:text-rose-100"
                        type="button"
                        onClick={() => updateDomain("rules.consistency", (d: any) => d.intra.groupingRules.splice(idx, 1))}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-xs text-slate-200 hover:border-slate-600"
                  type="button"
                  onClick={() =>
                    updateDomain("rules.consistency", (d: any) => d.intra.groupingRules.push({ type: "suffix", value: "_id", weight: 1.0 }))
                  }
                >
                  + 添加规则
                </button>
              </div>
            </Card>

            <Card>
              <SectionTitle title="Raw (debug)" />
              <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">{JSON.stringify(c.intra, null, 2)}</pre>
            </Card>
          </div>
        );
      }

      // inter
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Inter-table (D7)" desc="跨表匹配：nameSim/valueOverlap/joinEvidence 加权。" />
            <NumberField
              label="nameSimWeight"
              value={c.inter.nameSimWeight}
              onChange={(v) => updateDomain("rules.consistency", (d: any) => (d.inter.nameSimWeight = v))}
              min={0}
              max={1}
              step={0.01}
            />
            <NumberField
              label="valueOverlapWeight"
              value={c.inter.valueOverlapWeight}
              onChange={(v) => updateDomain("rules.consistency", (d: any) => (d.inter.valueOverlapWeight = v))}
              min={0}
              max={1}
              step={0.01}
            />
            <NumberField
              label="joinEvidenceWeight"
              value={c.inter.joinEvidenceWeight}
              onChange={(v) => updateDomain("rules.consistency", (d: any) => (d.inter.joinEvidenceWeight = v))}
              min={0}
              max={1}
              step={0.01}
            />
            <NumberField
              label="strongMatchThreshold"
              value={c.inter.strongMatchThreshold}
              onChange={(v) => updateDomain("rules.consistency", (d: any) => (d.inter.strongMatchThreshold = v))}
              min={0}
              max={1}
              step={0.01}
            />
            <NumberField
              label="topKTargets"
              value={c.inter.topKTargets}
              onChange={(v) => updateDomain("rules.consistency", (d: any) => (d.inter.topKTargets = Math.max(1, Math.min(10, Math.round(v)))))}
              step={1}
              min={1}
              max={10}
            />
          </Card>

          <Card>
            <SectionTitle title="Raw (debug)" />
            <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">{JSON.stringify(c.inter, null, 2)}</pre>
          </Card>
        </div>
      );
    }

    // 8) compat matrix
    if (activeTab === "compat_matrix") {
      const compat = config.domains.compat;
      const entry = compat.matrix[compatType] || { ALLOW: [], WEAK: [], DENY: [], reason: {} };
      const [roleDraft, setRoleDraft] = useState("");
      // Simple add/remove role codes (no drag)
      function addRole(group: "ALLOW" | "WEAK" | "DENY") {
        const rc = roleDraft.trim();
        if (!rc) return;
        updateDomain("compat", (d: any) => {
          d.matrix[compatType] = d.matrix[compatType] || { ALLOW: [], WEAK: [], DENY: [], reason: {} };
          const arr = d.matrix[compatType][group] as string[];
          if (!arr.includes(rc)) arr.push(rc);
        });
        setRoleDraft("");
      }
      function removeRole(group: "ALLOW" | "WEAK" | "DENY", rc: string) {
        updateDomain("compat", (d: any) => {
          const arr = d.matrix[compatType]?.[group] as string[];
          d.matrix[compatType][group] = arr.filter((x) => x !== rc);
        });
      }

      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Defaults" desc="allow_bonus/weak_penalty/deny_penalty" />
            <NumberField label="allow_bonus" value={compat.defaults.allow_bonus} onChange={(v) => updateDomain("compat", (d: any) => (d.defaults.allow_bonus = v))} step={0.01} />
            <NumberField label="weak_penalty" value={compat.defaults.weak_penalty} onChange={(v) => updateDomain("compat", (d: any) => (d.defaults.weak_penalty = v))} step={0.01} />
            <NumberField label="deny_penalty" value={compat.defaults.deny_penalty} onChange={(v) => updateDomain("compat", (d: any) => (d.defaults.deny_penalty = v))} step={0.01} />
          </Card>

          <Card>
            <SectionTitle title={`Matrix: ${compatType}`} desc="用简单列表维护 allow/weak/deny（生产版可换拖拽三列）。" />
            <TextField label="role_code (输入后点击添加)" value={roleDraft} onChange={setRoleDraft} placeholder="例如 EVENT_TIME" />
            <div className="mt-2 flex gap-2">
              <button className="rounded-md border border-slate-700 px-3 py-2 text-xs hover:border-slate-600" type="button" onClick={() => addRole("ALLOW")}>
                添加到 ALLOW
              </button>
              <button className="rounded-md border border-slate-700 px-3 py-2 text-xs hover:border-slate-600" type="button" onClick={() => addRole("WEAK")}>
                添加到 WEAK
              </button>
              <button className="rounded-md border border-slate-700 px-3 py-2 text-xs hover:border-slate-600" type="button" onClick={() => addRole("DENY")}>
                添加到 DENY
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <CompatList title="ALLOW" items={entry.ALLOW} onRemove={(rc) => removeRole("ALLOW", rc)} />
              <CompatList title="WEAK" items={entry.WEAK} onRemove={(rc) => removeRole("WEAK", rc)} />
              <CompatList title="DENY" items={entry.DENY} onRemove={(rc) => removeRole("DENY", rc)} />
            </div>

            <div className="mt-4">
              <JsonTextArea
                label="reason (optional) 例：{MEASURE: '时间戳不应作为度量'}"
                value={entry.reason || {}}
                onChange={(v) => updateDomain("compat", (d: any) => { d.matrix[compatType] = d.matrix[compatType] || { ALLOW:[], WEAK:[], DENY:[], reason:{} }; d.matrix[compatType].reason = v; })}
              />
            </div>
          </Card>

          <Card>
            <SectionTitle title="Raw (debug)" />
            <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">{JSON.stringify(entry, null, 2)}</pre>
          </Card>
        </div>
      );
    }

    // 9) ignore + llm
    if (activeTab === "ignore_llm") {
      const ig = config.domains.ignore_llm.ignore;
      const llm = config.domains.ignore_llm.llm;
      const [sub, setSub] = useState<"ignore" | "llm">("ignore");
      return (
        <div className="space-y-6">
          <Card>
            <SectionTitle title="SubTab" />
            <div className="flex gap-2">
              <button
                className={cls("px-3 py-2 text-xs rounded-md border", sub === "ignore" ? "border-emerald-600 text-emerald-200" : "border-slate-700 text-slate-300")}
                type="button"
                onClick={() => setSub("ignore")}
              >
                IGNORE
              </button>
              <button
                className={cls("px-3 py-2 text-xs rounded-md border", sub === "llm" ? "border-emerald-600 text-emerald-200" : "border-slate-700 text-slate-300")}
                type="button"
                onClick={() => setSub("llm")}
              >
                LLM
              </button>
            </div>
          </Card>

          {sub === "ignore" ? (
            <div className="space-y-6">
              <Card>
                <SectionTitle title="IGNORE Core Params" />
                <ChipsInput
                  label="techNoisePatterns"
                  value={ig.techNoisePatterns}
                  onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.ignore.techNoisePatterns = v))}
                />
                <div className="mt-3" />
                <NumberField label="nullRateHigh" value={ig.nullRateHigh} onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.ignore.nullRateHigh = v))} min={0} max={1} step={0.01} />
                <NumberField label="distinctLow" value={ig.distinctLow} onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.ignore.distinctLow = Math.max(1, Math.round(v))))} step={1} min={1} />
                <NumberField label="ignoreScoreMin" value={ig.ignoreScoreMin} onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.ignore.ignoreScoreMin = v))} min={0} max={1} step={0.01} />
                <NumberField label="highUsageCap" value={ig.highUsageCap} onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.ignore.highUsageCap = v))} min={0} max={1} step={0.01} />
                <Toggle label="forbidIfKeyCandidate" value={ig.forbidIfKeyCandidate} onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.ignore.forbidIfKeyCandidate = v))} />
              </Card>

              <Card>
                <SectionTitle title="Raw (debug)" />
                <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">{JSON.stringify(ig, null, 2)}</pre>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <SectionTitle title="LLM Trigger & Bounds" />
                <Toggle label="enabled" value={llm.enabled} onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.llm.enabled = v))} />
                <NumberField
                  label="trigger.completenessLt"
                  value={llm.trigger.completenessLt}
                  onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.llm.trigger.completenessLt = v))}
                  min={0}
                  max={1}
                  step={0.01}
                />
                <NumberField
                  label="trigger.gapLt"
                  value={llm.trigger.gapLt}
                  onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.llm.trigger.gapLt = v))}
                  min={0}
                  max={1}
                  step={0.01}
                />
                <NumberField
                  label="maxDeltaPerCandidate"
                  value={llm.maxDeltaPerCandidate}
                  onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.llm.maxDeltaPerCandidate = v))}
                  min={0}
                  max={0.05}
                  step={0.01}
                />
              </Card>

              <Card>
                <SectionTitle title="Prompt & Model" />
                <TextField label="promptVersion" value={llm.promptVersion} onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.llm.promptVersion = v))} />
                <div className="mt-3" />
                <TextField label="model" value={llm.model} onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.llm.model = v))} />
              </Card>

              <Card>
                <SectionTitle title="Output Schema (JSON)" />
                <JsonTextArea label="outputSchema" value={llm.outputSchema} onChange={(v) => updateDomain("ignore_llm", (d: any) => (d.llm.outputSchema = v))} rows={10} />
              </Card>
            </div>
          )}
        </div>
      );
    }

    // fallback
    return (
      <Card>
        <SectionTitle title="Not Implemented" desc="该 Tab 未在此简化包中实现（可按同模式扩展）。" />
        <div className="text-xs text-slate-400">当前只实现：Weights / Naming / Profile / Metadata / Usage / Standards / Consistency / Compat / Ignore+LLM</div>
      </Card>
    );
  }

  // ---------- render: right pane ----------
  function renderRightPane() {
    const res = simMode === "BASELINE" ? baseline : whatIf;
    return (
      <div className="space-y-4">
        <Card>
          <SectionTitle title="即时仿真" desc="编辑配置后自动 WHAT-IF 重算（防抖 300ms）。" />
          <div className="flex items-center gap-2 mb-2">
            <button
              className={cls("px-2 py-1 rounded-md text-xs border", simMode === "WHAT_IF" ? "border-emerald-600 text-emerald-200" : "border-slate-700 text-slate-300")}
              onClick={() => setSimMode("WHAT_IF")}
              type="button"
            >
              WHAT-IF
            </button>
            <button
              className={cls("px-2 py-1 rounded-md text-xs border", simMode === "BASELINE" ? "border-emerald-600 text-emerald-200" : "border-slate-700 text-slate-300")}
              onClick={() => setSimMode("BASELINE")}
              type="button"
            >
              BASELINE
            </button>
            {simLoading && <Pill tone="yellow">Simulating…</Pill>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              className="rounded-md bg-slate-900 border border-slate-700 px-2 py-2 text-xs text-slate-100"
              value={sample.mode === "FIELD_ID" ? sample.fieldId : ""}
              placeholder="fieldId"
              onChange={(e) => setSample({ mode: "FIELD_ID", fieldId: e.target.value })}
            />
            <button
              className="rounded-md border border-slate-700 bg-slate-900/40 px-2 py-2 text-xs text-slate-200 hover:border-slate-600"
              onClick={async () => {
                setSimLoading(true);
                try {
                  const r = await simulate(versionId, config, sample);
                  setWhatIf(r);
                } finally {
                  setSimLoading(false);
                }
              }}
              type="button"
            >
              Run
            </button>
          </div>

          {res && (
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                <Pill tone={res.queue === "CONFLICT" ? "red" : res.queue === "AUTO_PASS" ? "green" : "yellow"}>{res.queue}</Pill>
                <Pill>{`completeness ${toPct(res.completeness)}`}</Pill>
                <Pill>{`gap ${toPct(res.gap12)}`}</Pill>
                <Pill>{`ignore ${toPct(res.ignoreScore)}`}</Pill>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-xs font-semibold text-slate-100 mb-2">Joint Top3</div>
                <div className="space-y-1">
                  {res.jointTop3.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                      <div>
                        {i + 1}. {c.semanticType} + {c.role}
                      </div>
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

        <Card>
          <SectionTitle title="Breakdown" desc="按维度/按规则贡献（简化展示）。" />
          {res?.breakdownByDimension?.map((b) => (
            <div key={b.key} className="flex items-center justify-between text-[11px] text-slate-300 py-1">
              <span>{b.key}</span>
              <Pill tone="green">{`+${toPct(b.contributionTop1)}`}</Pill>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* TopBar */}
      <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold">配置编辑器</div>
            <Pill>{config.versionId}</Pill>
            <Pill tone={config.status === "DRAFT" ? "yellow" : "green"}>{config.status}</Pill>
            {config.baseVersionId && <Pill>{`base ${config.baseVersionId}`}</Pill>}
            {dirty && <Pill tone="red">Unsaved</Pill>}
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold" onClick={onSave} type="button">
              保存
            </button>
            <button className="rounded-md border border-slate-700 px-3 py-1.5 text-xs" onClick={onValidate} type="button">
              校验
            </button>
            <button className="rounded-md border border-slate-700 px-3 py-1.5 text-xs" onClick={onDiff} type="button">
              生成Diff
            </button>
            <button className="rounded-md border border-rose-700 bg-rose-900/30 px-3 py-1.5 text-xs" onClick={onPublish} type="button">
              发布/灰度
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-[1400px] px-4 py-4 grid grid-cols-12 gap-4">
        {/* Left Nav */}
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

        {/* Left Pane */}
        <div className="col-span-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-3">{renderLeftPane()}</div>
        </div>

        {/* Center Pane */}
        <div className="col-span-4">{renderCenterPane()}</div>

        {/* Right Pane */}
        <div className="col-span-3">{renderRightPane()}</div>
      </div>
    </div>
  );
}

// --------- small reusable UI wrappers ----------
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">{children}</div>;
}

function CompatList({ title, items, onRemove }: { title: string; items: string[]; onRemove: (role: string) => void }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/20 p-3">
      <div className="text-xs font-semibold text-slate-100 mb-2">{title}</div>
      <div className="space-y-2">
        {items.length === 0 && <div className="text-[11px] text-slate-500">空</div>}
        {items.map((rc) => (
          <div key={rc} className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-2 py-1">
            <div className="text-[11px] text-slate-200">{rc}</div>
            <button className="text-[11px] text-rose-200 hover:text-rose-100" type="button" onClick={() => onRemove(rc)}>
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --------- list update helpers ----------
function setRuleById(arr: NamingRule[], id: string, patch: Partial<NamingRule>) {
  const idx = arr.findIndex((x) => x.id === id);
  if (idx >= 0) arr[idx] = { ...arr[idx], ...patch };
}
function setDetectorById(arr: ProfileDetector[], id: string, patch: Partial<ProfileDetector>) {
  const idx = arr.findIndex((x) => x.detector_id === id);
  if (idx >= 0) arr[idx] = { ...arr[idx], ...patch };
}
function setMetaRuleById(arr: MetadataRule[], id: string, patch: Partial<MetadataRule>) {
  const idx = arr.findIndex((x) => x.rule_id === id);
  if (idx >= 0) arr[idx] = { ...arr[idx], ...patch };
}
