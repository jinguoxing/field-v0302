import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, ChevronRight, Tag, Lock, AlertTriangle, Plus, Trash2, Bold, Italic, List, Link as LinkIcon, AlertCircle, Search, GitBranch, ArrowRightLeft, Binary, Shield, Database, Hash, EyeOff, Ruler, Table as TableIcon, Upload, Terminal, Code, Settings2, Sliders, Activity, Sigma, Clock, GitCommit, AlignLeft, Book, Check, X, Zap } from 'lucide-react';
import { StepIndicator } from '../components/standards/create/StepIndicator';
import { CreateAIPanel } from '../components/standards/create/CreateAIPanel';

// --- Helper Components ---

const RichTextEditor = ({ placeholder, minHeight = 'h-32' }: { placeholder?: string, minHeight?: string }) => (
  <div className="border border-slate-600 rounded-lg overflow-hidden bg-slate-800 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
    <div className="flex items-center gap-1 p-2 border-b border-slate-700 bg-slate-900/50 text-slate-400">
      <button className="p-1 hover:bg-slate-700 rounded transition-colors"><Bold size={14} /></button>
      <button className="p-1 hover:bg-slate-700 rounded transition-colors"><Italic size={14} /></button>
      <div className="w-px h-4 bg-slate-700 mx-1"></div>
      <button className="p-1 hover:bg-slate-700 rounded transition-colors"><List size={14} /></button>
      <button className="p-1 hover:bg-slate-700 rounded transition-colors"><LinkIcon size={14} /></button>
    </div>
    <textarea 
      className={`w-full ${minHeight} bg-slate-800 p-3 text-sm text-white outline-none resize-none placeholder:text-slate-500`}
      placeholder={placeholder}
    />
  </div>
);

const TagInput = ({ placeholder, tags = [] }: { placeholder: string, tags?: string[] }) => (
  <div className="flex flex-wrap gap-2 p-2 bg-slate-800 border border-slate-600 rounded-lg min-h-[42px] focus-within:border-cyan-500 transition-colors">
    {tags.map(tag => (
      <span key={tag} className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-xs border border-slate-600 flex items-center gap-1 animate-in fade-in zoom-in duration-200">
        {tag} <button className="hover:text-red-400"><Trash2 size={10} /></button>
      </span>
    ))}
    <input type="text" className="bg-transparent text-xs text-white outline-none flex-1 min-w-[120px]" placeholder={placeholder} />
  </div>
);

const RelationRow = ({ type, target, domain }: { type: string, target: string, domain: string }) => (
  <div className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-lg group hover:border-slate-600 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-slate-900 rounded border border-slate-700 text-indigo-400">
        <ArrowRightLeft size={14} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">{type}</span>
          <span className="text-slate-600">→</span>
          <span className="text-sm font-medium text-white">{target}</span>
        </div>
        <div className="text-[10px] text-slate-500">{domain}</div>
      </div>
    </div>
    <button className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
      <Trash2 size={14} />
    </button>
  </div>
);

export const StandardCreatePage: React.FC = () => {
  const { type } = useParams<{ type: string }>(); 
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [dataType, setDataType] = useState('VARCHAR');
  const [ruleType, setRuleType] = useState('regex');
  
  // Format title
  const getTitle = () => {
    switch (type) {
        case 'data-elements': return '新建数据元 (Data Element)';
        case 'terms': return '新建业务术语 (Term)';
        case 'code-sets': return '新建码表 (Code Set)';
        case 'metrics': return '新建指标 (Metric)';
        case 'rules': return '新建规则模板 (Rule Template)';
        case 'naming': return '新建命名规范 (Naming Convention)';
        default: return '新建标准 (Standard)';
    }
  };

  const steps = ['基础信息', '标准内容', '关联关系', '预览提交'];

  // Mock Duplicate Check
  const showNameWarning = name.length > 3 && name.includes('Order');

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-300 bg-slate-900">
       
       {/* 1. Header */}
       <div className="h-16 px-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h1 className="text-lg font-bold text-white tracking-tight">{getTitle()}</h1>
                <p className="text-xs text-slate-500">草稿 (Draft) / V1.0.0</p>
             </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
             <StepIndicator currentStep={currentStep} steps={steps} />
          </div>

          <div className="flex items-center gap-3">
             <button className="px-4 py-2 text-slate-300 hover:text-white text-xs font-medium hover:bg-slate-700 rounded-lg transition-colors">
                保存草稿
             </button>
             <div className="flex rounded-lg overflow-hidden shadow-[0_0_15px_rgba(8,145,178,0.4)]">
                {currentStep > 1 && (
                   <button 
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all border-r border-slate-600"
                   >
                      上一步
                   </button>
                )}
                <button 
                   onClick={() => setCurrentStep(prev => Math.min(prev + 1, 4))}
                   className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                   {currentStep === 4 ? '提交' : '下一步'} <ChevronRight size={14} />
                </button>
             </div>
          </div>
       </div>

       {/* 2. Main Content Area */}
       <div className="flex-1 flex min-h-0">
          
          {/* Left: Form Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
             <div className="max-w-4xl mx-auto space-y-8">
                
                {/* --- Step 1: Basic Info --- */}
                <section className={`space-y-4 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                   <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                      <span className="bg-cyan-500 w-1 h-4 rounded-full"></span>
                      <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">基础信息 (Identity)</h2>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-400">英文名称 (Name) <span className="text-red-400">*</span></label>
                         <div className="relative">
                            <input 
                               type="text" 
                               value={name}
                               onChange={(e) => setName(e.target.value)}
                               className={`w-full bg-slate-800 border ${showNameWarning ? 'border-amber-500' : 'border-slate-600'} rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors`} 
                               placeholder="e.g. Customer_ID" 
                            />
                            {showNameWarning && (
                               <div className="absolute right-3 top-2.5 text-amber-500">
                                  <AlertTriangle size={16} />
                               </div>
                            )}
                         </div>
                         {showNameWarning && (
                            <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                               检测到跨域同名术语 (Domain: 交易域). 建议复用或添加后缀。
                            </p>
                         )}
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-400">中文名称 (CN Name) <span className="text-red-400">*</span></label>
                         <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none" placeholder="e.g. 客户标识" />
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-400">所属域 (Domain) <span className="text-red-400">*</span></label>
                         <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-cyan-500">
                            <option>选择数据域...</option>
                            <option>客户域</option>
                            <option>交易域</option>
                            <option>产品域</option>
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-400">责任人 (Owner) <span className="text-red-400">*</span></label>
                         <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-cyan-500">
                            <option>Admin User</option>
                            <option>Data Steward</option>
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-400">状态 (Status)</label>
                         <div className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-500 cursor-not-allowed">
                            草稿 (Draft)
                         </div>
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400">标签 (Tags)</label>
                      <TagInput placeholder="+ 添加标签..." tags={['Core', 'MasterData']} />
                   </div>
                </section>

                {/* --- Step 2: Content (Type Specific) --- */}
                <section className={`space-y-6 ${currentStep === 2 ? 'block' : 'hidden'}`}>
                   
                   {/* -- Term Specific Form -- */}
                   {type === 'terms' && (
                      <>
                         {/* Extended Identity */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <Tag size={16} className="text-blue-400" /> 扩展标识 (Extended Identity)
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">别名 (Aliases)</label>
                                  <TagInput placeholder="输入别名，回车添加..." tags={['CustID', 'Client_ID']} />
                                  <p className="text-[10px] text-slate-500">支持批量粘贴，系统将自动去重。</p>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">缩写 (Abbreviation)</label>
                                  <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. CUST_ID" />
                               </div>
                            </div>
                         </div>

                         {/* Definition & Scope */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <List size={16} className="text-emerald-400" /> 业务定义 (Definition)
                            </h3>
                            
                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400">标准定义 (Definition) <span className="text-red-400">*</span></label>
                               <RichTextEditor placeholder="清晰、无歧义的业务定义..." minHeight="h-40" />
                               <p className="text-[10px] text-slate-500 text-right">字数: 0 / 500 (发布要求 &gt; 20 字)</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">包含范围 (Includes)</label>
                                  <textarea className="w-full h-24 bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-white outline-none focus:border-indigo-500 resize-none" placeholder="本术语适用的业务场景..." />
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">不包含范围 (Excludes)</label>
                                  <textarea className="w-full h-24 bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-white outline-none focus:border-indigo-500 resize-none" placeholder="明确排除的场景..." />
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">正例 (Examples)</label>
                                  <TagInput placeholder="e.g. 个人注册用户" />
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">反例 (Non-Examples)</label>
                                  <TagInput placeholder="e.g. 临时访客" />
                               </div>
                            </div>
                         </div>

                         {/* Ownership */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-6">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <Lock size={16} className="text-amber-400" /> 归属与依据 (Ownership)
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">业务子域 (Sub-Domain)</label>
                                  <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-indigo-500">
                                     <option>选择子域...</option>
                                     <option>个人客户</option>
                                     <option>企业客户</option>
                                  </select>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">权威依据 (Source of Truth)</label>
                                  <div className="relative">
                                     <input type="text" className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white outline-none focus:border-indigo-500" placeholder="文档链接或制度名称" />
                                     <LinkIcon size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
                                  </div>
                               </div>
                            </div>
                         </div>
                      </>
                   )}

                   {/* -- Data Element Specific Form -- */}
                   {type === 'data-elements' && (
                      <>
                        {/* 1. Identity & Semantics */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Binary size={16} className="text-cyan-400" /> 标识与语义 (Identity & Semantics)
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">标准编码 (Code)</label>
                                    <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 font-mono" placeholder="e.g. DE_MOBILE_001" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">语义类型 (Semantic Type) <span className="text-red-400">*</span></label>
                                    <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-cyan-500">
                                        <option value="">选择语义类型...</option>
                                        <option value="phone">手机号 (Phone)</option>
                                        <option value="email">电子邮箱 (Email)</option>
                                        <option value="id_card">身份证 (ID Card)</option>
                                        <option value="name">姓名/名称 (Name)</option>
                                        <option value="amount">金额 (Amount)</option>
                                        <option value="date">日期 (Date)</option>
                                        <option value="status">状态 (Status)</option>
                                        <option value="code">代码 (Code)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 2. Definition */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <List size={16} className="text-cyan-400" /> 定义与格式 (Definition)
                            </h3>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400">业务定义 (Definition) <span className="text-red-400">*</span></label>
                                <RichTextEditor placeholder="描述数据元的业务含义、用途..." minHeight="h-24" />
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">计量单位 (Unit)</label>
                                    <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" placeholder="e.g. 元, kg, 次" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">格式掩码 (Format)</label>
                                    <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 font-mono" placeholder="e.g. YYYY-MM-DD" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">示例值 (Example)</label>
                                    <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" placeholder="e.g. 2024-01-01" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Physical Constraints */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-6">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Ruler size={16} className="text-cyan-400" /> 物理约束 (Physical Constraints)
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">数据类型 (Data Type) <span className="text-red-400">*</span></label>
                                    <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-cyan-500 font-mono">
                                        <option value="VARCHAR">VARCHAR</option>
                                        <option value="CHAR">CHAR</option>
                                        <option value="INT">INT</option>
                                        <option value="BIGINT">BIGINT</option>
                                        <option value="DECIMAL">DECIMAL</option>
                                        <option value="DATE">DATE</option>
                                        <option value="TIMESTAMP">TIMESTAMP</option>
                                        <option value="BOOLEAN">BOOLEAN</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">长度 (Length)</label>
                                    <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" placeholder="e.g. 50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">精度 (Precision/Scale)</label>
                                    <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" placeholder="e.g. 18,2" />
                                </div>
                            </div>
                            <div className="flex items-center gap-8 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">必填 (Required)</span>
                                </label>
                                <div className="space-y-1.5 flex-1 max-w-xs">
                                    <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500" placeholder="默认值 (Default Value)..." />
                                </div>
                            </div>
                        </div>

                        {/* 4. Value Constraints & Security */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-8">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Shield size={16} className="text-cyan-400" /> 值域与安全 (Value & Security)
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">绑定码表 (Code Set)</label>
                                    <div className="relative">
                                        <input type="text" className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white outline-none focus:border-cyan-500" placeholder="搜索码表..." />
                                        <Hash size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">校验规则 (Validation)</label>
                                    <div className="relative">
                                        <input type="text" className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white outline-none focus:border-cyan-500" placeholder="添加规则模板..." />
                                        <Shield size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-700/50">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">安全分级 (Security Level)</label>
                                    <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-cyan-500">
                                        <option value="L1">L1 (Public)</option>
                                        <option value="L2">L2 (Internal)</option>
                                        <option value="L3">L3 (Confidential)</option>
                                        <option value="L4">L4 (Top Secret)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400">脱敏策略 (Masking)</label>
                                    <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-cyan-500">
                                        <option value="none">无 (None)</option>
                                        <option value="mask_all">全脱敏 (Mask All)</option>
                                        <option value="mask_middle">中间脱敏 (Mask Middle)</option>
                                        <option value="hash">哈希 (Hash)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                      </>
                   )}

                   {/* -- Code Set Specific Form -- */}
                   {type === 'code-sets' && (
                      <>
                         {/* 1. Identity & Structure */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <Hash size={16} className="text-violet-400" /> 码表标识与结构
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">码表代码 (Code) <span className="text-red-400">*</span></label>
                                  <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500 font-mono" placeholder="e.g. CS_GENDER_001" />
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">值类型 (Value Type)</label>
                                  <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500">
                                     <option value="string">String (字符串)</option>
                                     <option value="int">Integer (整型)</option>
                                     <option value="boolean">Boolean (布尔)</option>
                                  </select>
                               </div>
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400">结构类型 (Structure)</label>
                               <div className="flex gap-4">
                                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-700 bg-slate-800 hover:border-violet-500/50 w-full transition-colors">
                                     <input type="radio" name="struct" className="text-violet-500 bg-slate-900 border-slate-600 focus:ring-violet-500" defaultChecked />
                                     <div>
                                        <div className="text-sm font-bold text-slate-200">扁平 (Flat)</div>
                                        <div className="text-[10px] text-slate-500">简单的 Key-Value 列表</div>
                                     </div>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-700 bg-slate-800 hover:border-violet-500/50 w-full transition-colors">
                                     <input type="radio" name="struct" className="text-violet-500 bg-slate-900 border-slate-600 focus:ring-violet-500" />
                                     <div>
                                        <div className="text-sm font-bold text-slate-200">层级 (Hierarchical)</div>
                                        <div className="text-[10px] text-slate-500">树状结构，包含父子关系</div>
                                     </div>
                                  </label>
                               </div>
                            </div>
                         </div>

                         {/* 2. Definition */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <List size={16} className="text-violet-400" /> 业务定义
                            </h3>
                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400">标准定义 (Definition)</label>
                               <RichTextEditor placeholder="描述该码表的业务含义和使用场景..." minHeight="h-24" />
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400">适用范围 (Scope)</label>
                               <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500" placeholder="e.g. 适用于全集团人力资源系统" />
                            </div>
                         </div>

                         {/* 3. Items Editor */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-6">
                            <div className="flex justify-between items-center">
                               <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                  <TableIcon size={16} className="text-violet-400" /> 码值列表 (Items)
                               </h3>
                               <div className="flex gap-2">
                                  <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs flex items-center gap-1 transition-colors">
                                     <Upload size={12} /> 导入
                                  </button>
                                  <button className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded text-xs flex items-center gap-1 transition-colors">
                                     <Plus size={12} /> 添加行
                                  </button>
                               </div>
                            </div>
                            
                            <div className="border border-slate-700 rounded-lg overflow-hidden">
                               <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-900 text-slate-500 font-bold uppercase">
                                     <tr>
                                        <th className="px-3 py-2 w-10">#</th>
                                        <th className="px-3 py-2">Code</th>
                                        <th className="px-3 py-2">Label (CN)</th>
                                        <th className="px-3 py-2">Label (EN)</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2 w-10"></th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-700 bg-slate-800/30">
                                     <tr>
                                        <td className="px-3 py-2 text-slate-500">1</td>
                                        <td className="px-3 py-2"><input type="text" defaultValue="1" className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-violet-500 outline-none w-full font-mono text-cyan-400" /></td>
                                        <td className="px-3 py-2"><input type="text" defaultValue="男" className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-violet-500 outline-none w-full text-white" /></td>
                                        <td className="px-3 py-2"><input type="text" defaultValue="Male" className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-violet-500 outline-none w-full text-slate-400" /></td>
                                        <td className="px-3 py-2">
                                           <select className="bg-transparent text-emerald-400 outline-none cursor-pointer"><option>Active</option><option>Deprecated</option></select>
                                        </td>
                                        <td className="px-3 py-2 text-right"><button className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button></td>
                                     </tr>
                                     <tr>
                                        <td className="px-3 py-2 text-slate-500">2</td>
                                        <td className="px-3 py-2"><input type="text" defaultValue="2" className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-violet-500 outline-none w-full font-mono text-cyan-400" /></td>
                                        <td className="px-3 py-2"><input type="text" defaultValue="女" className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-violet-500 outline-none w-full text-white" /></td>
                                        <td className="px-3 py-2"><input type="text" defaultValue="Female" className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-violet-500 outline-none w-full text-slate-400" /></td>
                                        <td className="px-3 py-2">
                                           <select className="bg-transparent text-emerald-400 outline-none cursor-pointer"><option>Active</option><option>Deprecated</option></select>
                                        </td>
                                        <td className="px-3 py-2 text-right"><button className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button></td>
                                     </tr>
                                  </tbody>
                               </table>
                               <div className="p-2 text-center border-t border-slate-700 bg-slate-900/30">
                                  <span className="text-[10px] text-slate-500">共 2 项</span>
                               </div>
                            </div>
                         </div>
                      </>
                   )}

                   {/* -- Metric Standard Specific Form -- */}
                   {type === 'metrics' && (
                      <>
                         {/* 1. Identity & Metric Type */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <Activity size={16} className="text-emerald-400" /> 指标属性 (Metric Identity)
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">指标类型 (Metric Type) <span className="text-red-400">*</span></label>
                                  <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500">
                                     <option value="atomic">原子指标 (Atomic)</option>
                                     <option value="derivative">派生指标 (Derivative)</option>
                                     <option value="composite">复合指标 (Composite)</option>
                                  </select>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">统计类型 (Calculation)</label>
                                  <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500">
                                     <option value="count">计数 (Count)</option>
                                     <option value="sum">求和 (Sum)</option>
                                     <option value="avg">平均 (Avg)</option>
                                     <option value="ratio">比率 (Ratio)</option>
                                     <option value="max">最大值 (Max)</option>
                                     <option value="min">最小值 (Min)</option>
                                  </select>
                               </div>
                            </div>
                         </div>

                         {/* 2. Business Definition & Semantics */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <Sigma size={16} className="text-emerald-400" /> 业务口径 (Business Logic)
                            </h3>
                            
                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400">指标定义 (Definition) <span className="text-red-400">*</span></label>
                               <RichTextEditor placeholder="清晰描述指标的业务含义、统计范围..." minHeight="h-24" />
                            </div>

                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400">自然语言公式 (Formula)</label>
                               <textarea className="w-full h-20 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 resize-none font-mono" placeholder="e.g. 支付完成订单的总金额 = sum(order_amount) where status='paid'" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">统计粒度 (Grain)</label>
                                  <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500">
                                     <option value="user">用户 (User)</option>
                                     <option value="order">订单 (Order)</option>
                                     <option value="sku">商品 (SKU)</option>
                                     <option value="device">设备 (Device)</option>
                                  </select>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">时间窗口 (Time Window)</label>
                                  <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500">
                                     <option value="realtime">实时 (Real-time)</option>
                                     <option value="daily">天 (Daily)</option>
                                     <option value="weekly">周 (Weekly)</option>
                                     <option value="monthly">月 (Monthly)</option>
                                     <option value="custom">自定义窗口</option>
                                  </select>
                               </div>
                            </div>

                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400">维度 (Dimensions)</label>
                               <TagInput placeholder="+ 添加维度 (e.g. Region, Channel)..." tags={['Region', 'Platform']} />
                            </div>
                         </div>

                         {/* 3. Implementation & Lineage */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-6">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <GitCommit size={16} className="text-emerald-400" /> 实现与溯源 (Implementation)
                            </h3>
                            
                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400">语义来源 (Source)</label>
                               <div className="relative">
                                  <input type="text" className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white outline-none focus:border-emerald-500" placeholder="绑定业务对象或逻辑视图..." />
                                  <Database size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
                               </div>
                            </div>

                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400 flex justify-between">
                                  <span>计算逻辑 SQL (Implementation SQL)</span>
                                  <button className="text-[10px] text-indigo-400 hover:text-white flex items-center gap-1">
                                     <Settings2 size={10} /> 自动生成
                                  </button>
                               </label>
                               <div className="relative font-mono text-xs">
                                  <textarea className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 text-cyan-400 outline-none focus:border-emerald-500 resize-none" defaultValue="SELECT sum(amount) FROM t_order WHERE status = 1 AND pay_time >= '${biz_date}'" />
                                  <Code size={14} className="absolute right-3 top-3 text-slate-600" />
                               </div>
                            </div>
                         </div>
                      </>
                   )}

                   {/* -- Rule Template Specific Form -- */}
                   {type === 'rules' && (
                      <>
                         {/* 1. Identity & Rule Type */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <Shield size={16} className="text-amber-400" /> 规则属性 (Identity)
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">规则类型 (Rule Type) <span className="text-red-400">*</span></label>
                                  <select 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-amber-500"
                                    value={ruleType}
                                    onChange={(e) => setRuleType(e.target.value)}
                                  >
                                     <option value="regex">正则表达式 (Regex)</option>
                                     <option value="range">数值范围 (Range)</option>
                                     <option value="not_null">非空检查 (Not Null)</option>
                                     <option value="unique">唯一性 (Unique)</option>
                                     <option value="ref_integrity">引用完整性 (FK)</option>
                                     <option value="drift">数据漂移 (Drift)</option>
                                  </select>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">严重等级 (Severity)</label>
                                  <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-amber-500">
                                     <option value="error">Error (阻断)</option>
                                     <option value="warn">Warn (警告)</option>
                                     <option value="info">Info (提示)</option>
                                  </select>
                               </div>
                            </div>
                         </div>

                         {/* 2. Description & Scope */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <List size={16} className="text-amber-400" /> 描述与范围
                            </h3>
                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400">规则描述 (Description) <span className="text-red-400">*</span></label>
                               <RichTextEditor placeholder="描述规则的业务含义和预期效果..." minHeight="h-24" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">适用对象 (Applies To)</label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                     <label className="flex items-center gap-1 text-xs text-slate-300 bg-slate-900 border border-slate-600 px-2 py-1 rounded cursor-pointer hover:border-amber-500">
                                        <input type="checkbox" className="rounded bg-slate-800 border-slate-600 text-amber-500" defaultChecked /> Field
                                     </label>
                                     <label className="flex items-center gap-1 text-xs text-slate-300 bg-slate-900 border border-slate-600 px-2 py-1 rounded cursor-pointer hover:border-amber-500">
                                        <input type="checkbox" className="rounded bg-slate-800 border-slate-600 text-amber-500" /> Table
                                     </label>
                                     <label className="flex items-center gap-1 text-xs text-slate-300 bg-slate-900 border border-slate-600 px-2 py-1 rounded cursor-pointer hover:border-amber-500">
                                        <input type="checkbox" className="rounded bg-slate-800 border-slate-600 text-amber-500" /> Metric
                                     </label>
                                  </div>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">修复建议 (Remediation)</label>
                                  <textarea className="w-full h-10 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500 resize-none" placeholder="校验失败时的建议动作..." />
                               </div>
                            </div>
                         </div>

                         {/* 3. Parameters & Implementation */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-6">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <Settings2 size={16} className="text-amber-400" /> 参数与实现 (Implementation)
                            </h3>
                            
                            {/* Dynamic Parameters */}
                            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                               <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Sliders size={12} /> 规则参数配置</h4>
                               
                               {ruleType === 'regex' && (
                                  <div className="grid grid-cols-1 gap-4">
                                     <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400">Pattern (正则模式)</label>
                                        <div className="flex gap-2">
                                           <input type="text" className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-amber-500" placeholder="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" />
                                           <button className="px-3 py-2 bg-slate-700 text-slate-300 text-xs rounded hover:text-white">测试</button>
                                        </div>
                                     </div>
                                  </div>
                               )}

                               {ruleType === 'range' && (
                                  <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400">Min Value</label>
                                        <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500" placeholder="0" />
                                     </div>
                                     <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400">Max Value</label>
                                        <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500" placeholder="100" />
                                     </div>
                                  </div>
                               )}

                               {(ruleType === 'not_null' || ruleType === 'unique') && (
                                  <div className="text-xs text-slate-500 italic p-2">无需额外参数。</div>
                               )}
                            </div>

                            {/* Implementation Details */}
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">执行引擎 (Engine)</label>
                                  <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-amber-500">
                                     <option value="sql">SQL (Standard)</option>
                                     <option value="spark">Spark / Scala</option>
                                     <option value="python">Python Script</option>
                                  </select>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">预期结果 (Expected Result)</label>
                                  <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500" placeholder="count == 0" />
                               </div>
                            </div>

                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400 flex justify-between">
                                  <span>SQL 模板 (Check Template)</span>
                                  <span className="text-[10px] text-slate-500">支持 &#123;&#123;table&#125;&#125;, &#123;&#123;column&#125;&#125; 占位符</span>
                               </label>
                               <div className="relative font-mono text-xs">
                                  <textarea className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 text-emerald-400 outline-none focus:border-amber-500 resize-none" defaultValue="SELECT count(*) FROM {{table}} WHERE NOT REGEXP_LIKE({{column}}, '{{pattern}}')" />
                                  <Code size={14} className="absolute right-3 top-3 text-slate-600" />
                               </div>
                            </div>
                         </div>

                         {/* 4. Defaults */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-8">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <Ruler size={16} className="text-amber-400" /> 默认策略 (Defaults)
                            </h3>
                            <div className="flex items-center gap-8">
                               <div className="space-y-1.5 w-40">
                                  <label className="text-xs font-bold text-slate-400">默认阈值 (Threshold)</label>
                                  <div className="relative">
                                     <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500" placeholder="0%" />
                                  </div>
                               </div>
                               <div className="flex items-center gap-3 pt-6">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                     <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                     <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                                     <span className="ml-3 text-xs font-medium text-slate-300">允许申请豁免 (Allow Waiver)</span>
                                  </label>
                               </div>
                            </div>
                         </div>
                      </>
                   )}

                   {/* -- Naming Convention Specific Form -- */}
                   {type === 'naming' && (
                      <>
                         {/* 1. Scope Definition */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <AlignLeft size={16} className="text-pink-400" /> 适用范围 (Scope)
                            </h3>
                            <div className="space-y-3">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">应用对象类型 (Applies To)</label>
                                  <div className="flex flex-wrap gap-2">
                                     {['Table', 'Field', 'Business Object', 'Metric', 'API'].map(item => (
                                        <label key={item} className="flex items-center gap-1.5 px-3 py-2 rounded bg-slate-800 border border-slate-600 cursor-pointer hover:border-pink-500 transition-colors">
                                           <input type="checkbox" className="rounded bg-slate-900 border-slate-600 text-pink-500 focus:ring-offset-slate-900" />
                                           <span className="text-xs text-slate-300">{item}</span>
                                        </label>
                                     ))}
                                  </div>
                               </div>
                               
                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-1.5">
                                     <label className="text-xs font-bold text-slate-400">限定数据域 (Domain Scope)</label>
                                     <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-pink-500">
                                        <option value="all">全域通用 (All Domains)</option>
                                        <option value="cust">客户域</option>
                                        <option value="trade">交易域</option>
                                     </select>
                                  </div>
                                  <div className="space-y-1.5">
                                     <label className="text-xs font-bold text-slate-400">限定系统 (System Scope)</label>
                                     <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-pink-500" placeholder="可选: 仅适用于特定数据库..." />
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* 2. Naming Rules */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <Settings2 size={16} className="text-pink-400" /> 命名规则 (Rules)
                            </h3>
                            
                            <div className="space-y-4">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">命名模板 (Template)</label>
                                  <div className="flex gap-2">
                                     <input type="text" className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-pink-500" placeholder="{domain}_{entity}_{attribute}" />
                                     <select className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-pink-500">
                                        <option value="snake">snake_case</option>
                                        <option value="camel">camelCase</option>
                                        <option value="pascal">PascalCase</option>
                                        <option value="upper">UPPER_CASE</option>
                                     </select>
                                  </div>
                                  <p className="text-[10px] text-slate-500">支持变量: &#123;domain&#125;, &#123;system&#125;, &#123;entity&#125;, &#123;attribute&#125;, &#123;type_suffix&#125;</p>
                               </div>

                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-1.5">
                                     <label className="text-xs font-bold text-slate-400">长度限制 (Length)</label>
                                     <div className="flex items-center gap-2">
                                        <input type="number" className="w-20 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:border-pink-500" placeholder="Min" />
                                        <span className="text-slate-500">-</span>
                                        <input type="number" className="w-20 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:border-pink-500" placeholder="Max" />
                                     </div>
                                  </div>
                                  <div className="space-y-1.5">
                                     <label className="text-xs font-bold text-slate-400">正则校验 (Regex)</label>
                                     <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono outline-none focus:border-pink-500" placeholder="^[a-z][a-z0-9_]*$" />
                                  </div>
                               </div>

                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                     <Book size={12} /> 词典约束 (Word Dictionary)
                                  </label>
                                  <div className="flex flex-wrap gap-4 mt-1">
                                     <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input type="checkbox" className="rounded bg-slate-900 border-slate-600 text-pink-500 focus:ring-offset-slate-900" defaultChecked />
                                        <span className="text-xs text-slate-300">强制使用标准缩写</span>
                                     </label>
                                     <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input type="checkbox" className="rounded bg-slate-900 border-slate-600 text-pink-500 focus:ring-offset-slate-900" defaultChecked />
                                        <span className="text-xs text-slate-300">禁止使用保留字</span>
                                     </label>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* 3. Examples */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6 animate-in fade-in slide-in-from-bottom-6">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               <Check size={16} className="text-emerald-400" /> 示例 (Examples)
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-2">
                                  <label className="text-xs font-bold text-emerald-400 uppercase">正确示例 (Good)</label>
                                  <div className="space-y-2">
                                     <input type="text" className="w-full bg-slate-900/50 border border-emerald-500/30 rounded px-2 py-1.5 text-xs text-emerald-300 font-mono" defaultValue="cust_order_id" />
                                     <input type="text" className="w-full bg-slate-900/50 border border-emerald-500/30 rounded px-2 py-1.5 text-xs text-emerald-300 font-mono" defaultValue="prod_sku_code" />
                                     <button className="text-[10px] text-slate-500 hover:text-emerald-400 flex items-center gap-1">+ 添加</button>
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-xs font-bold text-red-400 uppercase">错误示例 (Bad)</label>
                                  <div className="space-y-2">
                                     <div className="flex gap-2">
                                        <input type="text" className="w-full bg-slate-900/50 border border-red-500/30 rounded px-2 py-1.5 text-xs text-red-300 font-mono" defaultValue="CustomerOrderID" />
                                        <input type="text" className="w-24 bg-slate-900/50 border border-red-500/30 rounded px-2 py-1.5 text-xs text-slate-400" defaultValue="驼峰命名" />
                                     </div>
                                     <div className="flex gap-2">
                                        <input type="text" className="w-full bg-slate-900/50 border border-red-500/30 rounded px-2 py-1.5 text-xs text-red-300 font-mono" defaultValue="temp_col1" />
                                        <input type="text" className="w-24 bg-slate-900/50 border border-red-500/30 rounded px-2 py-1.5 text-xs text-slate-400" defaultValue="无意义" />
                                     </div>
                                     <button className="text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1">+ 添加</button>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* 4. Auto Fix */}
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-8">
                            <div className="flex items-center justify-between">
                               <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                  <Zap size={16} className="text-amber-400" /> 自动修复建议 (Auto Fix)
                               </h3>
                               <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                               </label>
                            </div>
                            <p className="text-xs text-slate-400">开启后，系统将在落标检查时自动尝试将不合规的物理命名转换为标准命名。</p>
                            
                            <div className="bg-slate-900 rounded-lg p-3 border border-slate-700 space-y-2">
                               <div className="flex items-center gap-2 text-xs">
                                  <span className="text-slate-500 font-mono">phone_number</span>
                                  <ArrowRightLeft size={10} className="text-slate-600" />
                                  <span className="text-white font-mono">mobile_no</span>
                               </div>
                               <div className="flex items-center gap-2 text-xs">
                                  <span className="text-slate-500 font-mono">is_deleted</span>
                                  <ArrowRightLeft size={10} className="text-slate-600" />
                                  <span className="text-white font-mono">del_flag</span>
                               </div>
                               <button className="text-[10px] text-indigo-400 hover:text-white mt-2">+ 添加映射规则</button>
                            </div>
                         </div>
                      </>
                   )}

                   {/* -- Generic Fallback or other types (Simplified) -- */}
                   {type !== 'terms' && type !== 'data-elements' && type !== 'code-sets' && type !== 'rules' && type !== 'metrics' && type !== 'naming' && (
                      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center text-slate-500 py-20">
                         <p>Form configuration for {type} is loading...</p>
                         <p className="text-xs mt-2">Use 'terms', 'data-elements', 'code-sets', 'metrics', 'rules' or 'naming' type for full demo.</p>
                      </div>
                   )}
                </section>

                {/* --- Step 3: Relations --- */}
                <section className={`space-y-6 ${currentStep === 3 ? 'block' : 'hidden'}`}>
                   <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-right-4">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <ArrowRightLeft size={16} className="text-indigo-400" /> 关联关系 (Relations)
                         </h3>
                         <button className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center gap-1">
                            <Plus size={12} /> 添加关联
                         </button>
                      </div>

                      {/* Relation Picker Mock */}
                      <div className="grid grid-cols-4 gap-2 mb-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 border-dashed">
                         <div className="col-span-1">
                            <select className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white">
                               <option>同义词 (Synonym)</option>
                               <option>父级 (Parent)</option>
                               <option>子级 (Child)</option>
                               <option>相关 (Related)</option>
                            </select>
                         </div>
                         <div className="col-span-3 relative">
                            <Search size={12} className="absolute left-2.5 top-2 text-slate-500" />
                            <input type="text" placeholder="搜索标准以关联..." className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:border-indigo-500 outline-none" />
                         </div>
                      </div>

                      {/* Existing Relations */}
                      <div className="space-y-2">
                         <RelationRow type="同义词" target="Client_Unique_ID" domain="Legacy CRM" />
                         <RelationRow type="父级" target="Party_ID" domain="Common" />
                      </div>
                   </div>
                </section>

                {/* --- Step 4: Preview --- */}
                <section className={`space-y-6 ${currentStep === 4 ? 'block' : 'hidden'}`}>
                   <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center animate-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                         <Save size={32} />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">准备提交</h2>
                      <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                         您即将创建一个新的业务术语标准。提交后，该标准将进入 <span className="text-amber-400 font-mono">Review</span> 状态，并通知相关 Data Steward 进行审核。
                      </p>
                      
                      <div className="bg-slate-900 rounded-lg p-4 text-left max-w-lg mx-auto border border-slate-700 text-xs text-slate-300 space-y-2 font-mono">
                         <div className="flex justify-between">
                            <span className="text-slate-500">Name:</span>
                            <span className="text-white">{name || 'Customer_ID'}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-slate-500">Type:</span>
                            <span className="text-blue-400">Term</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-slate-500">Domain:</span>
                            <span>客户域</span>
                         </div>
                      </div>
                   </div>
                </section>

             </div>
          </div>

          {/* Right: AI Assistant */}
          <CreateAIPanel />

       </div>
    </div>
  );
};
