
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Database, Globe, Table, Wand2, Sparkles, 
  UserCheck, Users, Play, Save, Info, CheckCircle2, AlertCircle,
  MessageSquare, LayoutList, Bot, ArrowRight, Activity, Zap,
  Search, ShieldCheck, Brain, Lightbulb, ChevronRight, User,
  RefreshCcw, Settings2
} from 'lucide-react';

interface RequestCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any, startNow: boolean) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    domain?: string;
    datasource?: string;
    assets?: string[];
    planGenerated?: boolean;
  };
}

export const RequestCreateModal: React.FC<RequestCreateModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [mode, setMode] = useState<'chat' | 'form'>('chat');
  const [domain, setDomain] = useState('retail');
  const [datasource, setDatasource] = useState('pg_prod_01');
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['public.orders', 'public.customers']);
  const [useCurrentContext, setUseCurrentContext] = useState(false);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是你的 AI 运营助手。请告诉我你想完成什么任务？例如：“帮我扫描零售域订单相关的表，并自动生成逻辑视图和核心指标建议”',
      timestamp: new Date()
    }
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState({
    id: 'emp-l2-semantic',
    name: '数据语义理解 (L2)',
    level: 'L2',
    scopeMatch: true,
    specialty: '语义建模、指标定义、画像分析'
  });

  const employees = {
    semantic: {
      id: 'emp-l2-semantic',
      name: '数据语义理解 (L2)',
      level: 'L2',
      scopeMatch: true,
      specialty: '语义建模、指标定义、画像分析'
    },
    quality: {
      id: 'emp-l1-quality',
      name: '数据质量专家 (L1)',
      level: 'L1',
      scopeMatch: true,
      specialty: '质量规则配置、异常检测、波动分析'
    }
  };

  const planTemplates = {
    full: [
      { id: 'A', name: '数据源配置', enabled: true, icon: <Database size={14} /> },
      { id: 'B', name: '扫描与画像', enabled: true, icon: <Search size={14} /> },
      { id: 'C', name: '质量检测', enabled: true, icon: <ShieldCheck size={14} /> },
      { id: 'D', name: '语义理解', enabled: true, icon: <Brain size={14} /> },
      { id: 'E', name: '对象生成', enabled: true, icon: <Lightbulb size={14} /> },
    ],
    quality: [
      { id: 'A', name: '数据源配置', enabled: true, icon: <Database size={14} /> },
      { id: 'B', name: '扫描与画像', enabled: true, icon: <Search size={14} /> },
      { id: 'C', name: '质量检测', enabled: true, icon: <ShieldCheck size={14} /> },
      { id: 'D', name: '语义理解', enabled: false, icon: <Brain size={14} /> },
      { id: 'E', name: '对象生成', enabled: false, icon: <Lightbulb size={14} /> },
    ]
  };

  // Predicted plan based on description
  const [predictedPlan, setPredictedPlan] = useState<any[]>(planTemplates.full);

  const [aiTip, setAiTip] = useState('当前需求复杂度为 LOW，L2 引擎可实现 90% 以上的自动化覆盖。建议开启 Stage C 以确保数据质量。');

  const analyzeRequest = (input: string) => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setDescription('');
    setIsAnalyzing(true);

    // Mock AI Response
    setTimeout(() => {
      setIsAnalyzing(false);
      
      let content = '';
      
      if (input.includes('质量') || input.includes('检测')) {
        content = `识别到您的需求侧重于 **数据质量治理**。我已为您匹配了 **数据质量专家 (L1)**，并优化了执行计划，重点开启质量检测环节。`;
        setSelectedEmployee(employees.quality);
        setPredictedPlan(planTemplates.quality);
        setAiTip('已为您切换至质量治理模式。Stage C 将应用行业标准的质量规则模版，建议保持开启以发现潜在数据风险。');
      } else if (input.includes('扫描')) {
        content = `已为您配置 **扫描与画像** 专项任务。该任务将深入分析表结构、数据分布及血缘关系。`;
        setPredictedPlan(planTemplates.full.map(s => ({ ...s, enabled: s.id === 'A' || s.id === 'B' })));
        setAiTip('扫描任务将消耗较多计算资源，建议在业务低峰期执行。');
      } else {
        content = `我已理解您的需求。我将为您在 **零售业务域** 执行全流程治理。识别到涉及资产：**public.orders**, **public.customers**。我已为您匹配了 **数据语义理解 (L2)** 引擎。`;
        setSelectedEmployee(employees.semantic);
        setPredictedPlan(planTemplates.full);
        setAiTip('全流程治理模式下，L2 引擎将自动完成从扫描到对象生成的闭环，预计可节省 80% 的人工投入。');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: content,
        timestamp: new Date(),
        metadata: {
          domain: 'retail',
          datasource: 'pg_prod_01',
          assets: ['public.orders', 'public.customers'],
          planGenerated: true
        }
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1500);
  };

  const handleSendMessage = () => {
    analyzeRequest(description);
  };

  const handleQuickPrompt = (label: string) => {
    analyzeRequest(label);
  };

  const toggleStep = (id: string) => {
    setPredictedPlan(prev => prev.map(step => 
      step.id === id ? { ...step, enabled: !step.enabled } : step
    ));
  };

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '一键运行全流程 (L2)', icon: <Sparkles size={14} /> },
    { label: '执行数据质量检测', icon: <ShieldCheck size={14} /> },
    { label: '只跑扫描与画像', icon: <Database size={14} /> },
    { label: '生成语义候选对象', icon: <Table size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">发起 AI 运营需求</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">System Ready</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">L2 引擎在线</span>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button 
              onClick={() => setMode('chat')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <MessageSquare size={14} /> 对话模式
            </button>
            <button 
              onClick={() => setMode('form')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'form' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <LayoutList size={14} /> 表单模式
            </button>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Main Input Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar border-r border-slate-800">
            {mode === 'chat' ? (
              <>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                        msg.role === 'assistant' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                      </div>
                      <div className={`max-w-[80%] space-y-3 ${msg.role === 'user' ? 'items-end' : ''}`}>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'assistant' 
                            ? 'bg-slate-800/50 border border-slate-700 text-slate-200 rounded-tl-none' 
                            : 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-900/20'
                        }`}>
                          {msg.content}
                        </div>
                        
                        {msg.metadata && (
                          <div className="flex flex-wrap gap-2 animate-in fade-in zoom-in-95 duration-500 delay-300">
                            {msg.metadata.domain && (
                              <div className="px-3 py-1.5 bg-slate-800/80 border border-cyan-500/30 rounded-full text-[10px] text-cyan-400 flex items-center gap-1.5 font-bold">
                                <Globe size={12} /> {msg.metadata.domain === 'retail' ? '零售业务域' : msg.metadata.domain}
                              </div>
                            )}
                            {msg.metadata.assets?.map(asset => (
                              <div key={asset} className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-full text-[10px] text-slate-400 flex items-center gap-1.5">
                                <Table size={12} /> {asset}
                              </div>
                            ))}
                            <button className="px-3 py-1.5 bg-slate-800/80 border border-dashed border-slate-700 rounded-full text-[10px] text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center gap-1.5">
                              <RefreshCcw size={12} /> 重新识别
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isAnalyzing && (
                    <div className="flex gap-4 animate-in fade-in duration-300">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <Bot size={20} />
                      </div>
                      <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">AI 正在思考并解析您的需求...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input Area */}
                <div className="p-8 pt-0 space-y-4 shrink-0">
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map(prompt => (
                      <button 
                        key={prompt.label}
                        onClick={() => handleQuickPrompt(prompt.label)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-400 hover:text-indigo-400 transition-all"
                      >
                        {prompt.icon}
                        {prompt.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="在此输入您的需求或指令..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-[24px] p-6 pr-16 text-sm text-slate-200 min-h-[100px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 shadow-inner resize-none"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!description.trim() || isAnalyzing}
                      className="absolute bottom-4 right-4 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl shadow-lg shadow-indigo-900/40 transition-all active:scale-95"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Form Mode Content (Original Sections A & B) */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Database size={16} className="text-cyan-400" /> Section A: 上下文
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-500 ml-1">业务域</label>
                      <select 
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      >
                        <option value="retail">零售业务域</option>
                        <option value="finance">财务域</option>
                        <option value="supply_chain">供应链域</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-500 ml-1">数据源</label>
                      <select 
                        value={datasource}
                        onChange={(e) => setDatasource(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      >
                        <option value="pg_prod_01">PostgreSQL 生产库 01</option>
                        <option value="dw_snowflake">Snowflake 数据仓库</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 ml-1">资产选择</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-xl min-h-[44px]">
                      {selectedAssets.map(asset => (
                        <div key={asset} className="flex items-center gap-1.5 bg-slate-700 text-slate-200 px-2 py-1 rounded-lg text-xs border border-slate-600">
                          <Table size={12} className="text-cyan-400" />
                          {asset}
                          <X size={12} className="cursor-pointer hover:text-rose-400" onClick={() => setSelectedAssets(prev => prev.filter(a => a !== asset))} />
                        </div>
                      ))}
                      <button className="text-xs text-slate-500 hover:text-cyan-400 flex items-center gap-1 px-2 py-1">
                        <Zap size={12} /> 添加表...
                      </button>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-400" /> Section B: 需求描述
                  </h3>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="描述你要 AI 完成什么..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm text-slate-200 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </section>
              </div>
            )}

            {/* Section C: Employee Resolve (Shared) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <UserCheck size={16} className="text-emerald-400" /> Section C: 员工推荐
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                  <Zap size={10} className="text-indigo-400" /> 自动匹配最佳引擎
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-indigo-500/30 rounded-[24px] p-6 relative overflow-hidden group transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Bot size={100} />
                </div>
                
                <div className="flex items-center gap-6 relative z-10">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-900/40">
                      <Bot size={36} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-900 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={10} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h4 className="font-bold text-white text-lg tracking-tight">{selectedEmployee.name}</h4>
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-500/30">{selectedEmployee.level} ENGINE</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className={`flex items-center gap-1.5 font-bold transition-colors ${isAnalyzing ? 'text-indigo-400' : 'text-emerald-400'}`}>
                        {isAnalyzing ? <RefreshCcw size={12} className="animate-spin" /> : <Activity size={12} />}
                        {isAnalyzing ? '正在匹配最佳引擎...' : '匹配度: 100%'}
                      </div>
                      <div className="w-px h-3 bg-slate-700"></div>
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <Zap size={12} className="text-indigo-400" /> 擅长: {selectedEmployee.specialty}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/20 active:scale-95">
                      确认使用
                    </button>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-bold border border-slate-700 transition-all">
                      更换员工
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Side Panel: Plan Preview */}
          <div className="w-96 bg-slate-900/50 p-8 space-y-8 overflow-y-auto custom-scrollbar shrink-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <LayoutList size={16} className="text-indigo-400" /> 预估执行计划
                </h3>
                <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
                  <Settings2 size={14} />
                </button>
              </div>

              <div className="space-y-4">
                {predictedPlan.map((step, idx) => (
                  <div 
                    key={step.id} 
                    onClick={() => toggleStep(step.id)}
                    className={`relative pl-10 pr-4 py-3 rounded-2xl border transition-all cursor-pointer group ${
                      step.enabled 
                        ? 'bg-slate-800/50 border-slate-700 hover:border-indigo-500/50' 
                        : 'bg-slate-900/30 border-slate-800 opacity-50 grayscale'
                    }`}
                  >
                    {idx < predictedPlan.length - 1 && (
                      <div className={`absolute left-4 top-10 bottom-[-16px] w-px ${step.enabled ? 'bg-slate-700' : 'bg-slate-800'}`}></div>
                    )}
                    <div className={`absolute left-2 top-3 w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      step.enabled ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-600 border border-slate-700'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-bold transition-colors ${step.enabled ? 'text-slate-200' : 'text-slate-500'}`}>{step.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Stage {step.id}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        step.enabled ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700 bg-transparent'
                      }`}>
                        {step.enabled && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">预估耗时</p>
                    <p className="text-sm text-slate-200 font-mono">~15 mins</p>
                  </div>
                  <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">预估消耗</p>
                    <p className="text-sm text-slate-200 font-mono">~2.4k Tokens</p>
                  </div>
                </div>
                
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Info size={12} /> AI 提示
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {aiTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-xs">治理规则将遵循企业级安全合规标准</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onCreate({ domain, datasource, selectedAssets, description }, false)}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-sm font-bold border border-slate-700 transition-all flex items-center gap-2"
            >
              <Save size={18} /> 仅保存草稿
            </button>
            <button 
              onClick={() => onCreate({ domain, datasource, selectedAssets, description }, true)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-900/40 transition-all flex items-center gap-2 active:scale-95"
            >
              <Play size={18} /> 确认并启动流程
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
