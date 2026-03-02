import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronRight, Check, Sparkles, Database, FileText, Code, 
  Layers, ShieldCheck, Zap, AlertTriangle, Calculator, Clock, Play,
  CheckCircle2, Box, Eye
} from 'lucide-react';
import { StepIndicator } from '../../components/standards/create/StepIndicator';
import { STANDARD_ITEMS_MOCK } from '../../constants';

// --- Types for Wizard State ---
interface WizardState {
  basicInfo: {
    name: string;
    cnName: string;
    code: string;
    domain: string;
    owner: string;
    steward: string;
    description: string;
  };
  method: 'Standard' | 'AI' | 'SQL';
  methodConfig: {
    standardId?: string;
    aiPrompt?: string;
    dataScope?: string;
    sql?: string;
  };
  definition: {
    metricType: string;
    grain: string;
    timeWindow: string;
    dimensions: string[];
    measures: { name: string; agg: string; expr: string }[];
    filters: string[];
  };
  implementation: {
    mode: 'AUTO_SQL' | 'SQL' | 'CANVAS';
    sql: string;
    isValidated: boolean;
  };
}

const INITIAL_STATE: WizardState = {
  basicInfo: { name: '', cnName: '', code: '', domain: '', owner: 'Admin', steward: 'Data Steward', description: '' },
  method: 'Standard',
  methodConfig: {},
  definition: {
    metricType: 'Atomic',
    grain: '',
    timeWindow: 'Daily',
    dimensions: [],
    measures: [],
    filters: []
  },
  implementation: { mode: 'AUTO_SQL', sql: '', isValidated: false }
};

export const MetricCreateWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = ['基础信息', '创建方式', '口径确认', '技术实现', '预览提交'];

  const updateState = (section: keyof WizardState, data: any) => {
    setState(prev => {
      const prevSection = prev[section];
      if (typeof prevSection === 'object' && prevSection !== null && !Array.isArray(prevSection)) {
        return { ...prev, [section]: { ...prevSection, ...data } };
      }
      return { ...prev, [section]: data };
    });
  };

  // --- Handlers ---

  const handleNext = () => {
    if (currentStep === 2 && state.method === 'AI') {
       // Simulate AI Generation
       setIsGenerating(true);
       setTimeout(() => {
          updateState('definition', {
             metricType: 'Atomic',
             grain: 'Order',
             timeWindow: 'Daily',
             dimensions: ['Region', 'Channel'],
             measures: [{ name: 'gmv', agg: 'SUM', expr: 'pay_amount' }],
             filters: ["status = 'paid'"]
          });
          updateState('implementation', {
             sql: "SELECT date_trunc('day', pay_time), region, channel, SUM(pay_amount) FROM t_dwd_order WHERE status='paid' GROUP BY 1, 2, 3"
          });
          setIsGenerating(false);
          setCurrentStep(3);
       }, 1500);
    } else {
       setCurrentStep(Math.min(currentStep + 1, 5));
    }
  };

  const handleBack = () => setCurrentStep(Math.max(currentStep - 1, 1));

  // --- Render Steps ---

  const renderStep1_BasicInfo = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-300">
       <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-400">中文名称 (CN Name) <span className="text-red-400">*</span></label>
             <input 
                type="text" 
                value={state.basicInfo.cnName}
                onChange={e => updateState('basicInfo', { cnName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none" 
                placeholder="e.g. 核心交易总额" 
             />
          </div>
          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-400">英文名称 (Name) <span className="text-red-400">*</span></label>
             <input 
                type="text" 
                value={state.basicInfo.name}
                onChange={e => updateState('basicInfo', { name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none font-mono" 
                placeholder="e.g. Core_GMV" 
             />
          </div>
       </div>
       
       <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400">指标编码 (Code) <span className="text-red-400">*</span></label>
          <div className="relative">
             <input 
                type="text" 
                value={state.basicInfo.code}
                onChange={e => updateState('basicInfo', { code: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:border-cyan-500 outline-none font-mono" 
                placeholder="e.g. M_TRD_GMV_001" 
             />
             <div className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">AUTO</div>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-400">所属域 (Domain)</label>
             <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-cyan-500 outline-none">
                <option>交易域</option>
                <option>客户域</option>
                <option>运营域</option>
             </select>
          </div>
          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-400">业务负责人 (Owner)</label>
             <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-cyan-500 outline-none">
                <option>Admin User</option>
                <option>Alice Data</option>
             </select>
          </div>
       </div>

       <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400">业务描述 (Description)</label>
          <textarea 
             value={state.basicInfo.description}
             onChange={e => updateState('basicInfo', { description: e.target.value })}
             className="w-full h-24 bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none resize-none"
             placeholder="详细描述指标的业务含义与统计逻辑..."
          />
       </div>
    </div>
  );

  const renderStep2_Method = () => (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-300">
       <div className="grid grid-cols-3 gap-6 mb-8">
          <div 
             onClick={() => updateState('method', 'Standard')}
             className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${state.method === 'Standard' ? 'bg-indigo-900/20 border-indigo-500 shadow-lg' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
          >
             <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${state.method === 'Standard' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                <ShieldCheck size={20} />
             </div>
             <h3 className="font-bold text-white mb-1">引用标准 (Standard)</h3>
             <p className="text-xs text-slate-400">强烈推荐。基于已发布的指标标准直接实例化，确保口径统一。</p>
          </div>

          <div 
             onClick={() => updateState('method', 'AI')}
             className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${state.method === 'AI' ? 'bg-cyan-900/20 border-cyan-500 shadow-lg' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
          >
             <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${state.method === 'AI' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                <Sparkles size={20} />
             </div>
             <h3 className="font-bold text-white mb-1">AI 生成 (AI Native)</h3>
             <p className="text-xs text-slate-400">输入业务需求，AI 自动生成口径定义与 SQL 实现。</p>
          </div>

          <div 
             onClick={() => updateState('method', 'SQL')}
             className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${state.method === 'SQL' ? 'bg-slate-700/50 border-white/20 shadow-lg' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
          >
             <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${state.method === 'SQL' ? 'bg-slate-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                <Code size={20} />
             </div>
             <h3 className="font-bold text-white mb-1">SQL 导入 (Import)</h3>
             <p className="text-xs text-slate-400">粘贴现有 SQL 代码，反向解析指标元数据。</p>
          </div>
       </div>

       {/* Conditional Content */}
       <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 min-h-[200px]">
          {state.method === 'Standard' && (
             <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-400">选择指标标准 (Select Standard)</label>
                   <select className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none">
                      {STANDARD_ITEMS_MOCK.filter(i => i.type === 'Indicator').map(s => (
                         <option key={s.id} value={s.id}>{s.cnName} ({s.name}) - {s.version}</option>
                      ))}
                   </select>
                </div>
                <div className="p-3 bg-indigo-900/20 border border-indigo-500/20 rounded-lg text-xs text-indigo-300">
                   选择标准后，口径定义将自动锁定，仅需补充物理实现。
                </div>
             </div>
          )}

          {state.method === 'AI' && (
             <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-400">业务需求描述 (Prompt)</label>
                   <textarea 
                      className="w-full h-24 bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none resize-none"
                      placeholder="e.g. 我需要一个统计每天各地区已支付订单总额的指标..."
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-400">数据范围 (Context)</label>
                   <div className="flex gap-2">
                      <select className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none">
                         <option>选择逻辑视图...</option>
                         <option>v_order_summary</option>
                      </select>
                      <select className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none">
                         <option>选择业务对象...</option>
                         <option>SalesOrder</option>
                      </select>
                   </div>
                </div>
             </div>
          )}

          {state.method === 'SQL' && (
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">SQL 代码 (Paste SQL)</label>
                <textarea 
                   className="w-full h-32 bg-slate-950 border border-slate-600 rounded-lg p-3 text-sm font-mono text-cyan-400 focus:border-white outline-none resize-none"
                   placeholder="SELECT ..."
                />
             </div>
          )}
       </div>
    </div>
  );

  const renderStep3_Definition = () => (
    <div className="max-w-5xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-300">
       {/* AI Banner if auto-generated */}
       {state.method === 'AI' && (
          <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-3 flex items-center gap-3">
             <Sparkles size={16} className="text-cyan-400" />
             <p className="text-xs text-cyan-200">AI 已根据您的描述生成了初步口径，请确认或微调。</p>
          </div>
       )}

       <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="grid grid-cols-2 gap-8 mb-6">
             <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                      <Database size={12} /> 统计粒度 (Grain)
                   </label>
                   <select className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500">
                      <option>Order</option>
                      <option>User</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                      <Clock size={12} /> 时间窗口 (Time Window)
                   </label>
                   <select className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500">
                      <option>Daily</option>
                      <option>Monthly</option>
                   </select>
                </div>
             </div>

             <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                   <Layers size={12} /> 维度 (Dimensions)
                </label>
                <div className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-3 flex flex-wrap content-start gap-2">
                   {state.definition.dimensions.map(d => (
                      <span key={d} className="px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded border border-slate-700 flex items-center gap-1">
                         {d} <button className="hover:text-red-400"><span className="sr-only">Delete</span>&times;</button>
                      </span>
                   ))}
                   <button className="px-2 py-1 bg-slate-800/50 text-slate-500 text-xs rounded border border-slate-700 border-dashed hover:text-cyan-400">
                      + 添加
                   </button>
                </div>
             </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-2">
                <Calculator size={12} /> 度量定义 (Measures)
             </label>
             <div className="border border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                   <thead className="bg-slate-900 text-slate-500">
                      <tr>
                         <th className="px-4 py-2">Name</th>
                         <th className="px-4 py-2">Agg</th>
                         <th className="px-4 py-2">Expression</th>
                      </tr>
                   </thead>
                   <tbody className="bg-slate-800/50 text-slate-200">
                      {state.definition.measures.map((m, i) => (
                         <tr key={i} className="border-t border-slate-700/50">
                            <td className="px-4 py-2">{m.name}</td>
                            <td className="px-4 py-2 font-mono text-indigo-400">{m.agg}</td>
                            <td className="px-4 py-2 font-mono">{m.expr}</td>
                         </tr>
                      ))}
                      {state.definition.measures.length === 0 && (
                         <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500">暂无度量，请添加</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
       </div>
    </div>
  );

  const renderStep4_Implementation = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
       <div className="bg-slate-800 border border-slate-700 rounded-xl flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b border-slate-700 bg-slate-900/50">
             <button className="px-6 py-3 text-sm font-bold border-b-2 border-cyan-500 text-cyan-400 bg-cyan-900/10">
                Auto SQL
             </button>
             <button className="px-6 py-3 text-sm font-bold border-b-2 border-transparent text-slate-400 hover:text-white">
                Canvas
             </button>
          </div>
          
          <div className="flex-1 p-0 relative">
             <textarea 
                value={state.implementation.sql}
                onChange={e => updateState('implementation', { sql: e.target.value })}
                className="w-full h-full bg-slate-950 p-6 text-sm font-mono text-cyan-100 outline-none resize-none leading-relaxed"
             />
             <div className="absolute bottom-6 right-6 flex gap-3">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-slate-600 transition-colors flex items-center gap-2">
                   <Play size={14} className="text-emerald-400" /> 运行校验
                </button>
             </div>
          </div>
       </div>
       
       {/* Validation Panel Mock */}
       <div className="mt-4 bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
          <div className="flex gap-6 text-xs">
             <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={14} /> 语法校验通过
             </div>
             <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={14} /> 字段存在性通过
             </div>
             <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle size={14} /> 发现 1 个潜在性能问题
             </div>
          </div>
          <span className="text-[10px] text-slate-500">Last checked: Just now</span>
       </div>
    </div>
  );

  const renderStep5_Preview = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
       <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
             <Check size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">准备就绪</h2>
          <p className="text-slate-400 text-sm">指标创建完成后将进入草稿状态，提交审核后生效。</p>
       </div>

       <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
             <h3 className="font-bold text-white flex items-center gap-2">
                <Calculator size={16} className="text-cyan-400" /> {state.basicInfo.cnName}
             </h3>
             <span className="text-xs font-mono text-slate-500">{state.basicInfo.code}</span>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6 text-sm">
             <div>
                <span className="text-slate-500 text-xs block mb-1">业务定义</span>
                <p className="text-slate-300 bg-slate-900 p-2 rounded border border-slate-700">{state.basicInfo.description || '暂无描述'}</p>
             </div>
             <div className="space-y-4">
                <div>
                   <span className="text-slate-500 text-xs block mb-1">维度</span>
                   <div className="flex gap-2">
                      {state.definition.dimensions.map(d => (
                         <span key={d} className="text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-700">{d}</span>
                      ))}
                   </div>
                </div>
                <div>
                   <span className="text-slate-500 text-xs block mb-1">预览 SQL</span>
                   <div className="text-xs font-mono text-indigo-300 truncate bg-slate-900 p-2 rounded border border-slate-700">{state.implementation.sql}</div>
                </div>
             </div>
          </div>
          
          {/* Example Data Preview */}
          <div className="border-t border-slate-700 p-4 bg-slate-900/30">
             <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><Eye size={12} /> 数据预览 (Mock)</h4>
             <table className="w-full text-xs text-left text-slate-400">
                <thead>
                   <tr className="border-b border-slate-700">
                      <th className="pb-2">stat_date</th>
                      <th className="pb-2">region</th>
                      <th className="pb-2">channel</th>
                      <th className="pb-2 text-right">gmv</th>
                   </tr>
                </thead>
                <tbody>
                   <tr className="border-b border-slate-700/50">
                      <td className="py-2">2024-06-25</td>
                      <td>East</td>
                      <td>App</td>
                      <td className="text-right font-mono text-white">12,500.00</td>
                   </tr>
                   <tr>
                      <td className="py-2">2024-06-25</td>
                      <td>North</td>
                      <td>Web</td>
                      <td className="text-right font-mono text-white">8,230.50</td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );

  if (isGenerating) {
     return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 gap-6">
           <div className="relative">
              <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Sparkles size={24} className="text-cyan-400 animate-pulse" />
              </div>
           </div>
           <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">AI 正在生成指标定义...</h2>
              <p className="text-slate-400 text-sm">正在分析上下文、推导维度与度量、构建 SQL 逻辑</p>
           </div>
        </div>
     )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-900 animate-in fade-in duration-300">
       
       {/* 1. Wizard Header */}
       <div className="h-16 px-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/metrics')} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                   新建指标向导
                </h1>
             </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
             <StepIndicator currentStep={currentStep} steps={steps} />
          </div>

          <div className="flex items-center gap-3 w-[200px] justify-end">
             {/* Spacer to balance layout */}
          </div>
       </div>

       {/* 2. Main Step Content */}
       <div className="flex-1 overflow-y-auto p-8 relative">
          {currentStep === 1 && renderStep1_BasicInfo()}
          {currentStep === 2 && renderStep2_Method()}
          {currentStep === 3 && renderStep3_Definition()}
          {currentStep === 4 && renderStep4_Implementation()}
          {currentStep === 5 && renderStep5_Preview()}
       </div>

       {/* 3. Footer Actions */}
       <div className="h-20 border-t border-slate-700 bg-slate-800/50 backdrop-blur flex items-center justify-between px-8 shrink-0">
          <button 
             onClick={handleBack}
             disabled={currentStep === 1}
             className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
             上一步
          </button>
          
          <div className="flex items-center gap-4">
             <button className="text-xs text-slate-500 hover:text-slate-300 underline">保存为草稿</button>
             <button 
                onClick={handleNext}
                className="px-8 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2"
             >
                {currentStep === 5 ? '提交审核' : '下一步'} 
                {currentStep !== 5 && <ChevronRight size={16} />}
             </button>
          </div>
       </div>

    </div>
  );
};