import React from 'react';
import { Save } from 'lucide-react';
import { DomainSidebar } from './DomainSidebar';
import { WeightsEditor } from './WeightsEditor';
import { ProfileRulesEditor } from './ProfileRulesEditor';
import { MetadataRulesEditor } from './MetadataRulesEditor';
import { UsageRulesEditor } from './UsageRulesEditor';
import { StandardsRulesEditor } from './StandardsRulesEditor';
import { ConsistencyRulesEditor } from './ConsistencyRulesEditor';
import { CompatMatrixEditor } from './CompatMatrixEditor';
import { IgnoreLLMEditor } from './IgnoreLLMEditor';
import { TypeDictionaryEditor } from './TypeDictionaryEditor';
import { RoleDictionaryEditor } from './RoleDictionaryEditor';
import { NamingRulesEditor } from './NamingRulesEditor';
import { SimulationPanel } from './SimulationPanel';
import { defaultDomains } from './defaults';
import {
  ConfigState,
  ConfigDomains,
  TABS,
  SimulationMode,
  SimulationResult,
  SimulationSampleRef,
  TabId,
  toPct,
} from './types';

interface ConfigEditorViewProps {
  versionId: string;
}

// ==================== Debounce Hook ====================
function useDebouncedEffect(fn: () => void, deps: any[], delay: number) {
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => fn(), delay);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ==================== Mock Simulation API ====================
async function mockApiSimulate(
  _versionId: string,
  _config: ConfigState,
  _sample: SimulationSampleRef
): Promise<SimulationResult> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const tau = _config.domains.weights.softmax.tau;
  const alpha = _config.domains.weights.joint.alpha;

  const base = Math.max(0.1, Math.min(0.95, 1 - (tau - 0.5) * 0.4));
  const top1 = base * (0.6 + alpha * 0.3);
  const top2 = top1 - 0.12;
  const gap = Math.max(0.02, Math.min(0.3, top1 - top2));

  return {
    typeTop3: [
      { type: 'DATETIME', confidence: top1, level: top1 >= 0.85 ? 'HIGH' : top1 >= 0.6 ? 'MED' : 'LOW' },
      { type: 'DATE', confidence: top2, level: top2 >= 0.85 ? 'HIGH' : top2 >= 0.6 ? 'MED' : 'LOW' },
      { type: 'UNKNOWN', confidence: 0.25, level: 'LOW' },
    ],
    roleTop3: [
      { role: 'EVENT_TIME', confidence: top1 - 0.05, level: (top1 - 0.05) >= 0.85 ? 'HIGH' : (top1 - 0.05) >= 0.6 ? 'MED' : 'LOW' },
      { role: 'AUDIT_FIELD', confidence: top2 - 0.05, level: (top2 - 0.05) >= 0.85 ? 'HIGH' : (top2 - 0.05) >= 0.6 ? 'MED' : 'LOW' },
      { role: 'DIMENSION', confidence: 0.3, level: 'LOW' },
    ],
    jointTop3: [
      { semanticType: 'DATETIME', role: 'EVENT_TIME', confidence: top1, confidenceLevel: top1 >= 0.85 ? 'HIGH' : top1 >= 0.6 ? 'MED' : 'LOW', gap12: gap },
      { semanticType: 'DATETIME', role: 'AUDIT_FIELD', confidence: top2, confidenceLevel: top2 >= 0.85 ? 'HIGH' : top2 >= 0.6 ? 'MED' : 'LOW', gap12: gap },
      { semanticType: 'UNKNOWN', role: 'DIMENSION', confidence: 0.18, confidenceLevel: 'LOW', gap12: gap },
    ],
    completeness: 0.82,
    gap12: gap,
    ignoreScore: 0.08,
    queue: gap < 0.1 ? 'CONFLICT' : top1 >= 0.85 ? 'AUTO_PASS' : 'NEEDS_CONFIRM',
    evidenceTop3: [
      { evidenceId: 'ev_1', dimension: 'NAMING', source: 'RULE', title: '命名命中 created_at', contribution: 0.12 },
      { evidenceId: 'ev_2', dimension: 'PROFILE', source: 'RULE', title: '非空率高', contribution: 0.1 },
      { evidenceId: 'ev_3', dimension: 'USAGE', source: 'RULE', title: '常用于时间范围过滤', contribution: 0.08 },
    ],
    breakdownByDimension: [
      { key: 'NAMING', contributionTop1: 0.12 },
      { key: 'PROFILE', contributionTop1: 0.1 },
      { key: 'USAGE', contributionTop1: 0.08 },
    ],
  };
}

// ==================== Main Component ====================
export const ConfigEditorView: React.FC<ConfigEditorViewProps> = ({ versionId }) => {
  // State
  const [activeTabId, setActiveTabId] = React.useState<TabId>('weights_thresholds');

  // Simulation state
  const [simulationSource, setSimulationSource] = React.useState<'Field ID' | 'LV + Field' | 'Error Sample'>('Field ID');
  const [simulationInput, setSimulationInput] = React.useState('created_at');
  const [simMode, setSimMode] = React.useState<SimulationMode>('WHAT_IF');
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [baselineResult, setBaselineResult] = React.useState<SimulationResult | undefined>(undefined);
  const [whatIfResult, setWhatIfResult] = React.useState<SimulationResult | undefined>(undefined);

  // Config state - using the new ConfigDomains structure
  const [config, setConfig] = React.useState<ConfigState>(() => ({
    versionId,
    versionName: 'Draft v_demo',
    status: 'DRAFT',
    baseVersionId: 'v_active',
    domains: defaultDomains(),
  }));

  const [dirty, setDirty] = React.useState(false);

  // Helper to update a specific domain
  function updateDomain<K extends keyof ConfigDomains>(domain: K, updater: (draft: ConfigDomains[K]) => void) {
    setConfig(prev => {
      const next = { ...prev, domains: { ...prev.domains } };
      updater(next.domains[domain]);
      return next;
    });
    setDirty(true);
  }

  // Get active tab info
  const activeTab = TABS.find(t => t.id === activeTabId);

  // ==================== Effects ====================

  // Load baseline once
  React.useEffect(() => {
    (async () => {
      const sample: SimulationSampleRef = { mode: 'FIELD_ID', fieldId: simulationInput };
      const res = await mockApiSimulate(versionId, config, sample);
      setBaselineResult(res);
      setWhatIfResult(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionId]);

  // What-if simulation on config change (debounced)
  useDebouncedEffect(
    () => {
      (async () => {
        setIsSimulating(true);
        try {
          const sample: SimulationSampleRef = { mode: 'FIELD_ID', fieldId: simulationInput };
          const res = await mockApiSimulate(versionId, config, sample);
          setWhatIfResult(res);
        } finally {
          setIsSimulating(false);
        }
      })();
    },
    [config, simulationInput, versionId],
    300
  );

  // ==================== Handlers ====================

  const handleSave = () => {
    // Mock save
    console.log('Saving config:', config);
    setDirty(false);
    alert(`Mock 保存成功：${activeTab?.domain}（请替换为真实 API）`);
  };

  const handleDiscard = () => {
    // Reset to defaults for current domain
    const defaults = defaultDomains();
    const domainKey = activeTab?.domain as keyof ConfigDomains;
    if (domainKey && defaults[domainKey]) {
      updateDomain(domainKey, () => defaults[domainKey]);
    }
    setDirty(false);
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const sample: SimulationSampleRef = { mode: 'FIELD_ID', fieldId: simulationInput };
      const res = await mockApiSimulate(versionId, config, sample);
      setWhatIfResult(res);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSaveAsGolden = () => {
    alert('已成功保存为回归样本');
  };

  // ==================== Render ====================

  return (
    <div className="flex h-full overflow-hidden bg-slate-950">
      {/* Left: Configuration Domain Navigation */}
      <DomainSidebar activeDomain={activeTab?.title || ''} onDomainChange={(title) => {
        const tab = TABS.find(t => t.title === title);
        if (tab) setActiveTabId(tab.id);
      }} />

      {/* Middle: Rule Editing Area */}
      <main className="flex-1 flex flex-col border-r border-slate-800 min-w-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-base font-bold text-white">{activeTab?.title}</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {activeTabId === 'weights_thresholds' && '配置全局权重、阈值与LLM参数'}
              {activeTabId === 'type_dictionary' && '语义类型字典（分组/别名/tooltip/bias）'}
              {activeTabId === 'role_dictionary' && '字段角色字典（分组/tooltip/advanced/bias）'}
              {activeTabId === 'naming_rules' && '基于字段名称模式的语义推断规则'}
              {activeTabId === 'profile_rules' && '基于字段统计分布的特征检测器'}
              {activeTabId === 'metadata_rules' && '基于数据库元数据的推断规则'}
              {activeTabId === 'usage_rules' && '基于字段使用模式的特征推断'}
              {activeTabId === 'standards_rules' && '与标准中心术语/数据元/码表的映射规则'}
              {activeTabId === 'consistency_rules' && '表内与表间一致性推断配置'}
              {activeTabId === 'compat_matrix' && '类型与角色的兼容性矩阵'}
              {activeTabId === 'ignore_llm' && '字段过滤规则与LLM干预配置'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscard}
              disabled={!dirty}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              丢弃更改
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
            >
              <Save size={14} />
              保存配置
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTabId === 'weights_thresholds' && (
            <WeightsEditor
              config={config.domains.weights}
              setConfig={(weights) => updateDomain('weights', () => weights)}
            />
          )}
          {activeTabId === 'type_dictionary' && (
            <TypeDictionaryEditor
              config={config.domains.type_dictionary}
              setConfig={(payload) => updateDomain('type_dictionary', () => payload)}
            />
          )}
          {activeTabId === 'role_dictionary' && (
            <RoleDictionaryEditor
              config={config.domains.role_dictionary}
              setConfig={(payload) => updateDomain('role_dictionary', () => payload)}
            />
          )}
          {activeTabId === 'naming_rules' && (
            <NamingRulesEditor
              config={config.domains['rules.naming']}
              setConfig={(payload) => updateDomain('rules.naming', () => payload)}
            />
          )}
          {activeTabId === 'profile_rules' && (
            <ProfileRulesEditor
              config={config.domains['rules.profile']}
              setConfig={(payload) => updateDomain('rules.profile', () => payload)}
            />
          )}
          {activeTabId === 'metadata_rules' && (
            <MetadataRulesEditor
              config={config.domains['rules.metadata']}
              setConfig={(payload) => updateDomain('rules.metadata', () => payload)}
            />
          )}
          {activeTabId === 'usage_rules' && (
            <UsageRulesEditor
              config={config.domains['rules.usage']}
              setConfig={(payload) => updateDomain('rules.usage', () => payload)}
            />
          )}
          {activeTabId === 'standards_rules' && (
            <StandardsRulesEditor
              config={config.domains['rules.standards']}
              setConfig={(payload) => updateDomain('rules.standards', () => payload)}
            />
          )}
          {activeTabId === 'consistency_rules' && (
            <ConsistencyRulesEditor
              config={config.domains['rules.consistency']}
              setConfig={(payload) => updateDomain('rules.consistency', () => payload)}
            />
          )}
          {activeTabId === 'compat_matrix' && (
            <CompatMatrixEditor
              config={config.domains.compat}
              setConfig={(payload) => updateDomain('compat', () => payload)}
            />
          )}
          {activeTabId === 'ignore_llm' && (
            <IgnoreLLMEditor
              config={config.domains.ignore_llm}
              setConfig={(payload) => updateDomain('ignore_llm', () => payload)}
            />
          )}
        </div>
      </main>

      {/* Right: Live Simulation Panel */}
      <SimulationPanel
        simulationSource={simulationSource}
        onSourceChange={setSimulationSource}
        simulationInput={simulationInput}
        onInputChange={setSimulationInput}
        isSimulating={isSimulating}
        onSimulate={handleSimulate}
        onSaveAsGolden={handleSaveAsGolden}
        mode={simMode}
        onModeChange={setSimMode}
        baselineResult={baselineResult}
        whatIfResult={whatIfResult}
      />
    </div>
  );
};
