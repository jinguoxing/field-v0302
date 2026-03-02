
import React, { useState } from 'react';
import { 
  X, Edit3, Share2, Trash2, CheckCircle, Copy, GitBranch, 
  Database, LayoutList, History, FileText, Sparkles, Wand2, 
  Shield, AlertTriangle, Link as LinkIcon, Save, ArrowRight,
  MoreVertical, Send, Ban, Clock, ChevronRight, Lock, Eye,
  Code, Table as TableIcon, Box, Activity, Ruler, Hash,
  Sigma, Calendar, Users, Tag, GitCommit, Search, Brain, ThumbsUp, ThumbsDown,
  ArrowUpRight, Split, Merge, RefreshCw, Network, Terminal, Settings2, Sliders, Filter, AlignLeft, Book, Zap, PlayCircle, Plus, PieChart, CheckCircle2, AlertOctagon
} from 'lucide-react';
import { StandardItem, StandardType } from '../../../types';
import { METRIC_VERSIONS_MOCK, METRIC_ASSETS_MOCK } from '../../../constants';
import { AIAssistantDock } from './AIAssistantDock';

interface StandardDetailDrawerProps {
  item: StandardItem;
  onClose: () => void;
}

type Tab = 'definition' | 'constraints' | 'items' | 'mapping' | 'parameters' | 'formula' | 'implementation' | 'implementations' | 'scope_rules' | 'dictionary' | 'lint_preview' | 'relations' | 'references' | 'ai_insights' | 'audit';

// Mock Data Generators for Specific Types
const getMockConstraints = (type: StandardType) => {
  switch (type) {
    case 'DataElement':
      return {
        dataType: 'VARCHAR',
        length: 50,
        precision: 0,
        format: 'Email',
        isRequired: true,
        defaultValue: 'N/A',
        securityLevel: 'L2 (Internal)',
        masking: 'Mask Middle',
        codeSet: 'CS_GENDER',
        validationRules: ['Regex_Email_V2', 'Not_Null']
      };
    case 'CodeSet':
      return {
        valueType: 'String',
        structureType: 'Flat',
        items: [
          { code: '1', name: 'Male', labelEn: 'Male', status: 'Active', desc: 'Biological male' },
          { code: '2', name: 'Female', labelEn: 'Female', status: 'Active', desc: 'Biological female' },
          { code: '0', name: 'Unknown', labelEn: 'Unknown', status: 'Deprecated', desc: 'Use 9 instead' },
          { code: '9', name: 'Not Applicable', labelEn: 'N/A', status: 'Active', desc: 'Not applicable context' }
        ],
        mappings: [
           { system: 'Legacy CRM', systemCode: 'M', standardCode: '1', status: 'Mapped' },
           { system: 'Legacy CRM', systemCode: 'F', standardCode: '2', status: 'Mapped' },
           { system: 'ERP SAP', systemCode: '01', standardCode: '1', status: 'Mapped' },
        ],
        sourceStandard: 'GB/T 2261.1'
      };
    case 'Indicator':
      return {
        metricType: 'Derivative',
        calcType: 'Sum',
        formula: 'SUM(order_amount) WHERE status = "paid"', // Tech formula
        bizFormula: '支付完成的订单总金额', // Natural language
        grain: 'User (Daily)',
        timeWindow: 'T+1 (Daily)',
        dimensions: ['Region', 'Channel', 'Product_Category'],
        filters: ['Exclude Test Users', 'Valid Orders Only'],
        implementation: {
            source: 'v_order_details',
            sql: "SELECT date, region, channel, SUM(amount) FROM v_order_details WHERE status = 'paid' GROUP BY date, region, channel",
            lineage: [
               { source: 't_order.amt', target: 'std:Trade_Amount', type: 'Field -> DataElement' },
               { source: 'std:Trade_Amount', target: 'std:GMV', type: 'DataElement -> Indicator' }
            ]
        }
      };
    case 'Rule':
      return {
        ruleType: 'Regex Match',
        severity: 'Error',
        description: 'Ensures the value matches a valid email pattern.',
        appliesTo: ['Field', 'ObjectAttribute'],
        remediation: 'Contact the user to update their email address.',
        parameters: [
            { name: 'pattern', type: 'String', required: true, description: 'Regex pattern', value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' },
            { name: 'caseSensitive', type: 'Boolean', required: false, defaultValue: 'false' }
        ],
        implementation: {
            engine: 'SQL',
            template: "SELECT count(*) FROM ${table} WHERE NOT REGEXP_LIKE(${column}, '${pattern}')",
            expectedResult: 'count == 0'
        },
        defaultThreshold: '0%',
        allowWaiver: true
      };
    case 'NamingConvention':
      return {
        appliesTo: ['Table', 'View'],
        domainScope: ['Transaction', 'Customer'],
        namingPattern: {
           template: '{layer}_{domain}_{entity}_{suffix}',
           casePolicy: 'snake_case',
           regex: '^[a-z][a-z0-9_]*$',
           lengthMin: 5,
           lengthMax: 64
        },
        examples: {
           good: ['t_trd_order_item', 'v_cust_profile_stat'],
           bad: ['T_Order', 'customerInfo', 'temp_table_1']
        },
        dictionary: {
           requiredAbbreviations: ['cust (Customer)', 'trd (Transaction)', 'stat (Statistics)'],
           forbiddenWords: ['temp', 'backup', 'old', 'new']
        },
        lintResults: [
           { asset: 't_order_master', status: 'Failed', reason: 'Missing domain prefix (trd)', suggestion: 't_trd_order_master' },
           { asset: 'v_customer_info', status: 'Failed', reason: 'Abbreviation required (customer -> cust)', suggestion: 'v_cust_info' },
           { asset: 't_trd_payment', status: 'Passed', reason: '', suggestion: '' }
        ]
      };
    default:
      return {};
  }
};

export const StandardDetailDrawer: React.FC<StandardDetailDrawerProps> = ({ item, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('definition');
  const [isEditing, setIsEditing] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Mock extended data
  const constraintsData = getMockConstraints(item.type);
  const extendedData = {
    aliases: ['Cust_ID', 'C_ID', 'Customer_Num'],
    scope: {
        includes: '全集团范围内有效，适用于线上及线下业务的所有自然人客户标识。',
        excludes: '不包含企业客户 (Corporate Client) 及临时访客 (Guest) 标识。'
    },
    examples: ['C20230001', 'C88888888'],
    nonExamples: ['G_Temp_001', 'Admin_User'],
    tags: item.tags || ['Core', 'MasterData'],
    relations: [
      { type: 'Synonym', target: 'Client_ID', domain: 'Legacy CRM', note: 'Historical mapping' },
      { type: 'Child Of', target: 'Party_ID', domain: 'Common', note: 'Inheritance' },
      { type: 'Related', target: 'Account_ID', domain: 'Finance', note: 'One-to-many relation' }
    ],
    aiSuggestedRelations: [
      { type: 'Semantic Link', target: 'Business Object: Customer', reason: 'High semantic similarity (98%)', confidence: 98 },
      { type: 'Calculated From', target: 'Field: t_order.user_id', reason: 'Frequent usage trace', confidence: 85 }
    ],
    references: {
      stats: { objects: 3, tables: 15, apis: 8, reports: 4 },
      list: [
        { type: 'Table', name: 't_crm_cust', status: 'Compliant', lastSeen: '2024-06-25' },
        { type: 'API', name: 'User Service API', status: 'Non-Compliant', lastSeen: '2024-06-24' },
        { type: 'Report', name: 'Daily Sales', status: 'Compliant', lastSeen: '2024-06-20' },
      ]
    },
    audit: [
      { version: 'v2.1.0', date: '2024-06-22', user: 'Admin', action: 'Update Definition', note: 'Refined scope description.' },
      { version: 'v2.0.0', date: '2024-05-10', user: 'System', action: 'Migration', note: 'Imported from legacy system.' }
    ],
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      'Published': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Draft': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      'Review': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'Deprecated': 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${styles[status] || styles['Draft']}`}>
        {status}
      </span>
    );
  };

  // Determine available tabs based on type
  const tabs: { id: Tab, label: string, icon: React.ElementType }[] = [
      { id: 'definition', label: '定义 (Definition)', icon: FileText },
  ];

  if (item.type === 'CodeSet') {
     tabs.push({ id: 'items', label: '码值 (Items)', icon: TableIcon });
     tabs.push({ id: 'mapping', label: '映射 (Mappings)', icon: Network });
  } else if (item.type === 'Rule') {
     tabs.push({ id: 'parameters', label: '参数 (Params)', icon: Sliders });
     tabs.push({ id: 'implementation', label: '实现 (Impl)', icon: Code });
  } else if (item.type === 'Indicator') {
     tabs.push({ id: 'formula', label: '口径 (Formula)', icon: Sigma });
     tabs.push({ id: 'implementations', label: '实现版本 (Impls)', icon: GitBranch });
  } else if (item.type === 'NamingConvention') {
     tabs.push({ id: 'scope_rules', label: '范围与规则', icon: Settings2 });
     tabs.push({ id: 'dictionary', label: '词典 (Dict)', icon: Book });
     tabs.push({ id: 'lint_preview', label: '合规预览', icon: PlayCircle });
  } else {
     // Constraints for non-CodeSet/Rule/Metric/Naming
     if (item.type !== 'Term') {
        tabs.push({ id: 'constraints', label: '约束 (Constraints)', icon: Ruler });
     }
  }

  // Common tabs
  tabs.push(
     { id: 'relations', label: '关系 (Relations)', icon: Share2 },
     { id: 'references', label: '引用 (Ref)', icon: Database },
     // Removed "AI Insights" tab as it is now in the dock
     { id: 'audit', label: '变更 (Changes)', icon: History },
  );

  // Find linked metric implementations
  const linkedImplementations = item.type === 'Indicator' 
    ? METRIC_VERSIONS_MOCK.filter(v => v.standardBinding?.standardId === item.id)
    : [];

  return (
    <div className={`fixed inset-y-0 right-0 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex animate-in slide-in-from-right duration-300 font-sans transition-[width] ${showAIAssistant ? 'w-[1150px]' : 'w-[850px]'}`}>
      
      {/* MAIN DRAWER CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 1. Header (Read-only + Actions) */}
        <div className="px-6 py-5 border-b border-slate-700 bg-slate-800 relative shrink-0">
          <div className="flex items-start justify-between mb-4">
             <div>
                <div className="flex items-center gap-3 mb-2">
                   {isEditing && item.status === 'Draft' ? (
                      <input type="text" defaultValue={item.name} className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-lg font-bold text-white font-mono focus:border-cyan-500 outline-none" />
                   ) : (
                      <h2 className="text-2xl font-bold text-white font-mono tracking-tight">{item.name}</h2>
                   )}
                   <StatusBadge status={item.status} />
                </div>
                <p className="text-sm text-slate-400 font-medium">{item.cnName}</p>
             </div>
             
             <div className="flex items-center gap-2">
                <button 
                   onClick={() => setShowAIAssistant(!showAIAssistant)}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${showAIAssistant ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-900/50' : 'bg-slate-800 text-indigo-400 border-indigo-500/30 hover:bg-indigo-900/20'}`}
                >
                   <Sparkles size={14} className={showAIAssistant ? 'fill-current' : ''} />
                   AI 助手
                </button>
                {!isEditing ? (
                   <>
                      {item.status === 'Draft' && (
                         <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                            <Edit3 size={18} />
                         </button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="More Actions">
                         <MoreVertical size={18} />
                      </button>
                      <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors ml-2">
                         <X size={24} />
                      </button>
                   </>
                ) : (
                   <div className="flex gap-2">
                      <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600">Cancel</button>
                      <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-500">Save</button>
                   </div>
                )}
             </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 items-center">
             <div className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded border border-slate-700">
                <GitBranch size={12} className="text-cyan-500" />
                <span className="font-mono text-slate-200">{item.version}</span>
             </div>
             <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Domain:</span>
                <span className="text-slate-200 font-medium">{item.domain}</span>
             </div>
             <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Owner:</span>
                <div className="flex items-center gap-1">
                   <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[8px] text-white">
                      {item.owner.charAt(0)}
                   </div>
                   <span className="text-slate-200">{item.owner}</span>
                </div>
             </div>
             
             {/* New Badges */}
             <div className="h-4 w-px bg-slate-700 mx-2"></div>
             <div className="flex items-center gap-2">
                <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                   <CheckCircle size={10} /> Certified
                </span>
                {item.refCount > 0 && (
                   <span className="text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <Database size={10} /> {item.refCount} Refs
                   </span>
                )}
             </div>
          </div>
        </div>

        {/* 2. Detail Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800/50 px-6 shrink-0 overflow-x-auto">
           {tabs.map(tab => (
              <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                 <tab.icon size={16} />
                 {tab.label}
              </button>
           ))}
        </div>

        {/* 3. Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-900/50">
           {/* Definition Tab */}
           {activeTab === 'definition' && (
              <div className="space-y-6">
                 {/* Basic Info */}
                 <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                       <FileText size={16} className="text-cyan-400" /> 基础信息
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="text-xs text-slate-500 block mb-1">中文名称</label>
                          <div className="text-sm text-slate-200">{item.cnName}</div>
                       </div>
                       <div>
                          <label className="text-xs text-slate-500 block mb-1">英文名称</label>
                          <div className="text-sm text-slate-200 font-mono">{item.name}</div>
                       </div>
                       <div className="col-span-2">
                          <label className="text-xs text-slate-500 block mb-1">描述</label>
                          <div className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded border border-slate-700/50">
                             {item.description}
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Extended Attributes (Mock) */}
                 {extendedData && (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
                       <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Settings2 size={16} className="text-indigo-400" /> 扩展属性
                       </h3>
                       <div className="grid grid-cols-2 gap-4 text-sm">
                          {extendedData.scope && (
                             <div className="col-span-2">
                                <label className="text-xs text-slate-500 block mb-1">适用范围</label>
                                <div className="text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                   <span className="text-emerald-400 font-bold mr-1">Includes:</span> {extendedData.scope.includes}
                                   <br/>
                                   <span className="text-red-400 font-bold mr-1">Excludes:</span> {extendedData.scope.excludes}
                                </div>
                             </div>
                          )}
                          {extendedData.aliases && (
                             <div>
                                <label className="text-xs text-slate-500 block mb-1">别名</label>
                                <div className="flex gap-2 flex-wrap">
                                   {extendedData.aliases.map(a => (
                                      <span key={a} className="bg-slate-700 px-2 py-0.5 rounded text-xs text-slate-300">{a}</span>
                                   ))}
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 )}
              </div>
           )}

           {/* Implementations Tab (New for Rule 7) */}
           {activeTab === 'implementations' && (
              <div className="space-y-4">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-white">绑定实现列表 (Implementations)</h3>
                    <span className="text-xs text-slate-500">{linkedImplementations.length} total</span>
                 </div>
                 
                 {linkedImplementations.length === 0 ? (
                    <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed text-slate-500 text-xs">
                       暂无绑定指标
                    </div>
                 ) : (
                    linkedImplementations.map(impl => {
                       const asset = METRIC_ASSETS_MOCK.find(m => m.id === impl.metricId);
                       return (
                          <div key={impl.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/30 transition-colors">
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                   <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-200">{asset?.cnName}</span>
                                      <span className="text-xs text-slate-500 font-mono">v{impl.versionNo}</span>
                                      {impl.isRecommended && (
                                         <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 rounded border border-indigo-500/30 flex items-center gap-1">
                                            <Sparkles size={8} /> Official
                                         </span>
                                      )}
                                   </div>
                                   <div className="text-xs text-slate-500 font-mono mt-0.5">{asset?.code}</div>
                                </div>
                                <div className="flex flex-col items-end">
                                   <span className={`text-[10px] px-2 py-0.5 rounded border ${impl.compliance === 'Compliant' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : impl.compliance === 'Warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                                      {impl.compliance}
                                   </span>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-700/50 text-xs">
                                <div>
                                   <span className="text-slate-500 block mb-1">Data Sources</span>
                                   <div className="flex flex-wrap gap-1">
                                      {impl.evidence.sources.map(src => (
                                         <span key={src} className="bg-slate-900 px-1.5 rounded text-slate-300 border border-slate-700">{src}</span>
                                      ))}
                                   </div>
                                </div>
                                <div>
                                   <span className="text-slate-500 block mb-1">Validation</span>
                                   <span className={`font-bold ${impl.evidence.lastValidationResult === 'Pass' ? 'text-emerald-400' : 'text-red-400'}`}>
                                      {impl.evidence.lastValidationResult}
                                   </span>
                                </div>
                             </div>
                          </div>
                       );
                    })
                 )}
              </div>
           )}

           {/* Constraints Tab */}
           {activeTab === 'constraints' && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                    <Ruler size={16} className="text-cyan-400" /> 约束条件
                 </h3>
                 <pre className="bg-slate-900 p-4 rounded-lg text-xs text-slate-300 font-mono overflow-auto">
                    {JSON.stringify(constraintsData, null, 2)}
                 </pre>
              </div>
           )}

           {/* Other Tabs Placeholder */}
           {['items', 'mapping', 'parameters', 'formula', 'implementation', 'scope_rules', 'dictionary', 'lint_preview', 'relations', 'references', 'audit'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
                 <div className="p-4 bg-slate-800 rounded-full mb-3">
                    <Wand2 size={24} className="text-slate-600" />
                 </div>
                 <p className="text-sm font-medium">Content for {activeTab} is being generated...</p>
              </div>
           )}
        </div>
      </div>

      {/* RIGHT DOCK (AI Assistant) */}
      {showAIAssistant && (
         <AIAssistantDock contextData={item} onClose={() => setShowAIAssistant(false)} />
      )}
    </div>
  );
};
