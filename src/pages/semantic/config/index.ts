// Types
export * from './types';

// Main Components
export { ConfigEditorView } from './ConfigEditorView';
export { DomainSidebar } from './DomainSidebar';
export { SimulationPanel } from './SimulationPanel';
export { WeightsEditor } from './WeightsEditor';

// Rule Editing (Legacy - for naming_rules)
export { RuleList } from './RuleList';
export { RuleEditor } from './RuleEditor';
export { CreateRuleModal } from './CreateRuleModal';
export type { PartialRule } from './CreateRuleModal';

// New Domain Editors
export { ProfileRulesEditor } from './ProfileRulesEditor';
export { MetadataRulesEditor } from './MetadataRulesEditor';
export { UsageRulesEditor } from './UsageRulesEditor';
export { StandardsRulesEditor } from './StandardsRulesEditor';
export { ConsistencyRulesEditor } from './ConsistencyRulesEditor';
export { CompatMatrixEditor } from './CompatMatrixEditor';
export { IgnoreLLMEditor } from './IgnoreLLMEditor';

// Dictionary Editors
export { TypeDictionaryEditor } from './TypeDictionaryEditor';
export { RoleDictionaryEditor } from './RoleDictionaryEditor';
export { NamingRulesEditor } from './NamingRulesEditor';

// UI Components
export * from './components';

// Defaults
export { defaultDomains } from './defaults';
