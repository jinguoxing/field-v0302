import React, { useState } from 'react';
import { Sparkles, X, AlertTriangle, Zap, GitCompare, ThumbsUp, ThumbsDown, ArrowRight, BarChart2, Lightbulb, FileText, Tag, Network, GitMerge, Check, Plus, RefreshCw, ChevronDown, ChevronUp, Brain, Binary, Regex, Hash } from 'lucide-react';

interface AIAssistantDockProps {
  contextData: any; 
  onClose: () => void;
}

export const AIAssistantDock: React.FC<AIAssistantDockProps> = ({ contextData, onClose }) => {
  const [activeDiff, setActiveDiff] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>('def_gen');

  const isTerm = contextData?.type === 'Term';
  const isDataElement = contextData?.type === 'DataElement';

  // --- TERM SPECIFIC LOGIC ---
  
  const termActions = [
    {
      id: 'def_gen',
      title: '生成定义与范围 (Definition Gen)',
      icon: <FileText size={16} className="text-cyan-400" />,
      desc: '基于关联资产与文档上下文生成标准定义。',
      inputs: ['引用资产: 15个 (t_cust, api_user...)', '文档: PRD_User_Module_v2.pdf'],
      preview: {
        def: '指在平台完成注册流程，拥有唯一身份标识（ID）且账户状态正常的自然人或机构。',
        scope: '包含：正式会员、试用会员。不包含：游客、已注销用户。',
        nonExample: '临时访客 (Guest)'
      },
      btnLabel: '应用草案'
    },
    {
      id: 'alias_sug',
      title: '建议同义词 (Synonyms)',
      icon: <Tag size={16} className="text-blue-400" />,
      desc: '基于字段注释和使用习惯挖掘别名。',
      suggestions: [
        { val: 'Client_ID', reason: 'CRM系统常用 (Freq: High)' },
        { val: 'User_Unique_Code', reason: '老旧报表字段' }
      ],
      btnLabel: '一键添加'
    },
    {
      id: 'taxonomy',
      title: '层级关系建议 (Taxonomy)',
      icon: <Network size={16} className="text-indigo-400" />,
      desc: '基于业务对象模型构建上下位关系。',
      suggestions: [
        { rel: 'Parent', target: 'Party (参与方)', reason: '继承关系' },
        { rel: 'Child', target: 'VIP_Customer', reason: '特化子类' }
      ],
      btnLabel: '确认关联'
    },
    {
      id: 'conflict',
      title: '重复/冲突检测 (Conflicts)',
      icon: <GitMerge size={16} className="text-amber-400" />,
      desc: '发现语义高度重叠的现有标准。',
      risk: 'High',
      items: [
        { target: 'User_ID', type: '同义不同名', similarity: '99%' }
      ],
      btnLabel: '去处理'
    }
  ];

  // --- DATA ELEMENT SPECIFIC LOGIC ---

  const dataElementActions = [
    {
      id: 'infer_semantic',
      title: '识别语义类型 (Infer Semantic)',
      icon: <Brain size={16} className="text-purple-400" />,
      desc: '从字段名/注释/样例识别语义类型。',
      inputs: ['Name: mobile_phone', 'Comment: 联系方式', 'Sample: 139...'],
      preview: {
        type: 'Mobile Phone (CN)',
        format: '11位数字',
        confidence: '98%'
      },
      btnLabel: '应用语义'
    },
    {
      id: 'rec_datatype',
      title: '推荐数据类型 (Recommend Type)',
      icon: <Binary size={16} className="text-cyan-400" />,
      desc: '分析样本长度分布，推荐最优物理类型。',
      preview: {
        type: 'VARCHAR(20)',
        stats: 'Max Len: 11, Avg: 11',
        reason: 'Fits all samples with padding'
      },
      btnLabel: '应用类型'
    },
    {
      id: 'sug_regex',
      title: '生成校验规则 (Format & Regex)',
      icon: <Regex size={16} className="text-emerald-400" />,
      desc: '根据语义类型生成正则表达式或格式掩码。',
      preview: {
        regex: '^1[3-9]\\d{9}$',
        template: 'Rule: Mobile_Format_Check'
      },
      btnLabel: '绑定规则'
    },
    {
      id: 'sug_codeset',
      title: '建议码表 (Suggest CodeSet)',
      icon: <Hash size={16} className="text-amber-400" />,
      desc: '检测到值域离散且稳定，建议绑定码表。',
      suggestions: [
        { val: 'CS_GENDER', reason: 'Values: 0,1,2,9 match standard' }
      ],
      btnLabel: '绑定码表'
    }
  ];

  // --- GENERIC / OTHER LOGIC ---

  let currentActions = [];
  if (isTerm) currentActions = termActions;
  else if (isDataElement) currentActions = dataElementActions;
  else {
     // Generic fallback
     currentActions = [
        {
           id: 'generic_fix',
           title: 'Auto-Fix Metadata',
           icon: <Sparkles size={16} className="text-indigo-400" />,
           desc: 'Complete missing description based on name.',
           btnLabel: 'Auto Fix'
        }
     ];
  }

  const insights = isTerm ? [
    { type: 'risk', text: 'Detected ambiguity in current definition regarding "Inactive Users".', severity: 'Medium' },
    { type: 'gap', text: 'Missing connection to "Active User" metric.', severity: 'Low' }
  ] : isDataElement ? [
    { type: 'risk', text: 'Physical length (10) is shorter than some sample values (11).', severity: 'High' },
    { type: 'gap', text: 'Sensitive data (Phone) missing masking policy.', severity: 'Medium' }
  ] : [
    { type: 'risk', text: 'Metric definition conflicts with "Daily_Sales" SQL logic.', severity: 'High' },
    { type: 'gap', text: 'Missing dimension "Product_Category".', severity: 'Medium' }
  ];

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col h-full animate-in slide-in-from-right duration-300 shrink-0 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-indigo-950/20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-indigo-400 font-bold">
           <Sparkles size={18} /> AI 治理助手
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
           <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        
        {/* Section 1: Context & Health */}
        <section>
           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <BarChart2 size={12} /> 上下文概览 (Context)
           </h4>
           <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 grid grid-cols-2 gap-2">
              <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                 <div className="text-[10px] text-slate-500">引用热度</div>
                 <div className="text-sm font-bold text-white">{contextData?.refCount || 0} <span className="text-[10px] font-normal text-slate-400">Refs</span></div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                 <div className="text-[10px] text-slate-500">合规评分</div>
                 <div className={`${(contextData?.complianceScore || 0) > 90 ? 'text-emerald-400' : 'text-amber-400'} text-sm font-bold`}>
                    {contextData?.complianceScore || 85}
                 </div>
              </div>
           </div>
        </section>

        {/* Section 2: Smart Action Cards (Dynamic based on Type) */}
        <section>
           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap size={12} /> 智能治理动作 (Actions)
           </h4>
           
           <div className="space-y-3">
              {currentActions.map(action => (
                 <div key={action.id} className={`bg-slate-800 border ${expandedCard === action.id ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : 'border-slate-700'} rounded-xl overflow-hidden transition-all duration-300`}>
                    {/* Card Header */}
                    <div 
                       className="p-3 flex items-center justify-between cursor-pointer bg-slate-800 hover:bg-slate-750"
                       onClick={() => toggleCard(action.id)}
                    >
                       <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-700`}>
                             {action.icon}
                          </div>
                          <div>
                             <h5 className="text-sm font-bold text-slate-200">{action.title}</h5>
                             {!expandedCard && <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{action.desc}</p>}
                          </div>
                       </div>
                       {expandedCard === action.id ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                    </div>

                    {/* Expanded Content */}
                    {expandedCard === action.id && (
                       <div className="px-3 pb-3 pt-0 border-t border-slate-700/50 bg-slate-900/20">
                          <p className="text-xs text-slate-400 mt-2 mb-3 leading-relaxed">{action.desc}</p>
                          
                          {/* Input Context */}
                          {action.inputs && (
                             <div className="mb-3 space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase">输入参考</span>
                                {action.inputs.map((inp: string, i: number) => (
                                   <div key={i} className="text-[10px] text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-700/50 truncate">
                                      {inp}
                                   </div>
                                ))}
                             </div>
                          )}

                          {/* Preview / Suggestions */}
                          {action.preview && (
                             <div className="bg-slate-900 rounded p-2 border border-indigo-500/20 mb-3 space-y-2">
                                <div className="text-[10px] text-slate-500 uppercase">生成预览</div>
                                {Object.entries(action.preview).map(([key, val]) => (
                                   <div key={key}>
                                      <span className="text-[10px] text-indigo-300 font-bold capitalize">{key}: </span>
                                      <span className="text-xs text-slate-200">{String(val)}</span>
                                   </div>
                                ))}
                             </div>
                          )}

                          {action.suggestions && (
                             <div className="space-y-2 mb-3">
                                {action.suggestions.map((sug: any, i: number) => (
                                   <div key={i} className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-700">
                                      <div>
                                         <div className="text-xs font-bold text-slate-200">{sug.val || sug.target}</div>
                                         <div className="text-[10px] text-slate-500">{sug.reason}</div>
                                      </div>
                                      <button className="text-indigo-400 hover:text-white p-1"><Plus size={14} /></button>
                                   </div>
                                ))}
                             </div>
                          )}

                          {/* Action Button */}
                          <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
                             <Sparkles size={12} /> {action.btnLabel}
                          </button>
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </section>

        {/* Section 3: Insights (Standard) */}
        <section>
           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle size={12} /> 洞察与风险 (Insights)
           </h4>
           <div className="space-y-2">
              {insights.map((insight, idx) => (
                 <div key={idx} className={`p-2.5 rounded-lg border text-xs leading-relaxed flex gap-2 ${
                    insight.severity === 'High' ? 'bg-red-900/10 border-red-500/20 text-red-200' :
                    insight.severity === 'Medium' ? 'bg-amber-900/10 border-amber-500/20 text-amber-200' :
                    'bg-blue-900/10 border-blue-500/20 text-blue-200'
                 }`}>
                    <div className="mt-0.5 shrink-0"><Lightbulb size={12} /></div>
                    {insight.text}
                 </div>
              ))}
           </div>
        </section>

        {/* Section 4: Diff Preview */}
        <section>
           <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                 <GitCompare size={12} /> 变更预览 (Preview)
              </h4>
              <button onClick={() => setActiveDiff(!activeDiff)} className="text-[10px] text-indigo-400 hover:text-white underline">
                 {activeDiff ? '收起' : '展开'}
              </button>
           </div>
           {activeDiff && (
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 text-[10px] font-mono leading-relaxed overflow-x-auto">
                 <div className="text-slate-500 mb-1 border-b border-slate-800 pb-1">diff --git a/standard.json b/standard.json</div>
                 <div className="text-red-400/80 bg-red-900/10 px-1 rounded">- desc: "Unique ID"</div>
                 <div className="text-emerald-400/90 bg-emerald-900/10 px-1 rounded">+ desc: "Enterprise Unique Identifier (12-digits)"</div>
              </div>
           )}
        </section>

      </div>

      {/* Section 5: Feedback */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/50 shrink-0">
         <p className="text-[10px] text-slate-500 text-center mb-3">AI 建议是否有帮助？</p>
         <div className="flex justify-center gap-6">
            <button className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 transition-all">
               <ThumbsUp size={14} />
            </button>
            <button className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all">
               <ThumbsDown size={14} />
            </button>
         </div>
      </div>
    </div>
  );
};
