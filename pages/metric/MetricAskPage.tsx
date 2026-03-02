
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bot, Send, Sparkles, User, RefreshCw, 
  CheckCircle2, AlertTriangle, Shield, Code, Copy, 
  ExternalLink, BarChart3, Database, GitBranch, 
  AlertOctagon, Key, Lock, Info
} from 'lucide-react';
import { METRIC_ASSETS_MOCK, METRIC_VERSIONS_MOCK } from '../../constants';

// --- Types ---
interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  isThinking?: boolean;
}

interface AskResult {
  metricId?: string;
  versionId?: string;
  metricName?: string;
  metricCode?: string;
  versionNo?: string;
  compliance?: 'Compliant' | 'Warning' | 'NonCompliant';
  isRecommended?: boolean; // New: Official Recommendation
  isWaived?: boolean; // New: Waived Status
  confidence?: number;
  reasons?: string[];
  sql?: string;
  params?: { name: string; value: string; type: string }[];
  evidence?: {
    sources: string[];
    coverage: number;
    lastValidated: string;
  };
  gateStatus: 'Pass' | 'Fail';
  gateReason?: string;
  alternatives?: { id: string; name: string }[];
}

// --- Component: Recommendation Card ---
const RecommendationCard = ({ result }: { result: AskResult }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg relative overflow-hidden">
    {/* Decorative BG */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-900/30 rounded-lg border border-cyan-500/20 text-cyan-400">
             {result.isRecommended ? <Sparkles size={18} className="fill-current" /> : <BarChart3 size={18} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
               <h3 className="text-lg font-bold text-white tracking-tight">{result.metricName}</h3>
               {result.isRecommended && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                     <Sparkles size={8} className="fill-current" /> Official
                  </span>
               )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono text-slate-400">{result.metricCode}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="text-xs font-mono text-cyan-400">{result.versionNo}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
          result.compliance === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
          {result.compliance === 'Compliant' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
          {result.compliance}
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          Confidence: <span className="font-mono text-white">{result.confidence}%</span>
        </div>
      </div>
    </div>

    {result.isWaived && (
       <div className="flex items-center gap-2 mb-4 p-2 rounded bg-amber-900/10 border border-amber-500/20 text-xs text-amber-300">
          <Info size={14} className="flex-shrink-0" />
          <span>该指标包含豁免项，使用时请注意潜在风险。</span>
       </div>
    )}

    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 mb-4">
      <p className="text-xs font-bold text-slate-400 uppercase mb-2">推荐理由 (Why this metric?)</p>
      <ul className="space-y-1.5">
        {result.reasons?.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
            <CheckCircle2 size={12} className="text-indigo-400 mt-0.5 shrink-0" />
            {r}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// --- Component: Query Card ---
const QueryCard = ({ result }: { result: AskResult }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Code size={16} className="text-indigo-400" /> 查询构建 (Query Builder)
        </h3>
        <button 
          onClick={handleCopy}
          className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy SQL'}
        </button>
      </div>

      {/* Params */}
      <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
        {result.params?.map((param, i) => (
          <div key={i} className="bg-slate-900 border border-slate-600 rounded-lg p-2 min-w-[120px]">
            <label className="text-[10px] text-slate-500 uppercase block mb-1">{param.name}</label>
            <input 
              type="text" 
              defaultValue={param.value} 
              className="w-full bg-transparent text-xs text-white outline-none font-mono focus:text-cyan-400"
            />
          </div>
        ))}
        <button className="flex items-center justify-center bg-slate-800 border border-slate-600 border-dashed rounded-lg p-2 min-w-[40px] text-slate-500 hover:text-white hover:border-slate-500 transition-colors">
          +
        </button>
      </div>

      {/* Code */}
      <div className="flex-1 bg-slate-950 rounded-lg p-3 overflow-auto font-mono text-xs text-slate-300 border border-slate-800 relative group">
        <pre>{result.sql}</pre>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="p-1 bg-slate-800 rounded text-slate-400 hover:text-white"><ExternalLink size={12} /></button>
        </div>
      </div>
    </div>
  );
};

// --- Component: Evidence Card ---
const EvidenceCard = ({ result }: { result: AskResult }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
      <Shield size={16} className="text-emerald-400" /> 信任与血缘 (Trust)
    </h3>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-center">
        <div className="text-[10px] text-slate-500 uppercase mb-1 flex items-center justify-center gap-1">
           <Database size={10} /> Sources
        </div>
        <div className="text-xs font-bold text-slate-200 truncate" title={result.evidence?.sources.join(', ')}>
           {result.evidence?.sources[0]} +{result.evidence ? result.evidence.sources.length - 1 : 0}
        </div>
      </div>
      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-center">
        <div className="text-[10px] text-slate-500 uppercase mb-1 flex items-center justify-center gap-1">
           <GitBranch size={10} /> Coverage
        </div>
        <div className="text-xs font-bold text-emerald-400 font-mono">
           {result.evidence?.coverage}%
        </div>
      </div>
      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-center">
        <div className="text-[10px] text-slate-500 uppercase mb-1 flex items-center justify-center gap-1">
           <CheckCircle2 size={10} /> Validated
        </div>
        <div className="text-[10px] font-bold text-slate-300">
           {result.evidence?.lastValidated}
        </div>
      </div>
    </div>
  </div>
);

// --- Component: Gate Card ---
const GateCard = ({ result }: { result: AskResult }) => (
  <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-6 shadow-lg animate-in shake duration-300">
    <div className="flex items-center gap-3 mb-4 text-red-400">
      <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
        <Lock size={20} />
      </div>
      <div>
        <h3 className="text-lg font-bold">访问被拦截 (Gate Blocked)</h3>
        <p className="text-xs opacity-80">{result.gateReason}</p>
      </div>
    </div>
    
    <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/10 mb-4 text-sm text-slate-300">
       <p className="mb-2">根据企业数据安全规范，该指标涉及敏感信息 (PII/L4)，无法直接返回明细数据。</p>
       <p className="text-xs text-slate-500">规则ID: GATE_SEC_001</p>
    </div>

    <div className="flex flex-col gap-3">
       <div className="text-xs font-bold text-slate-400 uppercase">推荐替代方案</div>
       {result.alternatives?.map(alt => (
          <button key={alt.id} className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all group">
             <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-cyan-400" />
                <span className="text-sm text-slate-200 group-hover:text-white">{alt.name}</span>
             </div>
             <ArrowLeft size={14} className="rotate-180 text-slate-500 group-hover:text-cyan-400" />
          </button>
       ))}
       <button className="w-full py-3 mt-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
          <Key size={14} /> 申请特殊权限
       </button>
    </div>
  </div>
);

// --- Main Page ---
export const MetricAskPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: '您好，我是指标智能助手。请告诉我您想查询的业务数据。', timestamp: 'Now' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeResult, setActiveResult] = useState<AskResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isThinking]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText, timestamp: 'Now' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);
    setActiveResult(null); // Clear previous result while thinking

    // Simulate AI Latency
    setTimeout(() => {
      const lowerText = userMsg.text.toLowerCase();
      let result: AskResult | null = null;
      let replyText = '';

      if (lowerText.includes('gmv') || lowerText.includes('sales')) {
         // Success Case: Hit Recommended Version
         result = {
            metricId: 'ma_001',
            versionId: 'mv_001_v2',
            metricName: 'GMV Daily (日成交总额)',
            metricCode: 'M_TRD_GMV_DAY',
            versionNo: 'v2.0.0',
            compliance: 'Compliant',
            isRecommended: true, // Official
            confidence: 99,
            reasons: ['Official Recommended Metric', 'Standard Bound (v2.0)', 'High usage rank'],
            sql: "SELECT\n  date_trunc('day', pay_time) as stat_date,\n  region,\n  SUM(pay_amount) as gmv\nFROM t_dwd_order\nWHERE status = 'paid'\nGROUP BY 1, 2",
            params: [{ name: 'Date Range', value: 'Last 7 Days', type: 'date' }, { name: 'Region', value: 'East', type: 'string' }],
            evidence: { sources: ['t_dwd_order'], coverage: 100, lastValidated: '2h ago' },
            gateStatus: 'Pass'
         };
         replyText = '为您找到官方推荐的指标 **GMV Daily (v2.0.0)**。';
      } else if (lowerText.includes('login')) {
         // Warning Case: Waived
         result = {
            metricId: 'ma_005',
            versionId: 'mv_005_v1',
            metricName: 'Login Success Rate',
            metricCode: 'M_SEC_LOGIN_RATE',
            versionNo: 'v1.0.0',
            compliance: 'Warning',
            isWaived: true,
            confidence: 75,
            reasons: ['Matched keywords', 'Waived Status (Low Priority)'],
            sql: "SELECT count(success) / count(*) FROM logs...",
            params: [{ name: 'Time', value: 'Last Hour', type: 'string' }],
            evidence: { sources: ['logs'], coverage: 60, lastValidated: '3d ago' },
            gateStatus: 'Pass'
         };
         replyText = '找到相关指标，但该指标处于豁免状态，请注意数据质量风险。';
      } else if (lowerText.includes('salary') || lowerText.includes('phone') || lowerText.includes('sensitive')) {
         // Gate Fail Case
         result = {
            gateStatus: 'Fail',
            gateReason: 'Sensitive Data Access Control (Level 4)',
            alternatives: [{ id: 'alt_1', name: 'Avg_Salary_By_Dept (Desensitized)' }, { id: 'alt_2', name: 'Staff_Headcount' }]
         };
         replyText = '抱歉，您查询的内容涉及敏感数据，已被安全门禁拦截。';
      } else {
         // Generic / Fallback
         result = {
            metricId: 'ma_002',
            versionId: 'mv_002_v1',
            metricName: 'DAU (日活跃用户数)',
            metricCode: 'M_OPS_DAU',
            versionNo: 'v1.2.0',
            compliance: 'Compliant',
            confidence: 85,
            reasons: ['Common metric for general queries', 'Verified standard'],
            sql: "SELECT\n  dt,\n  COUNT(DISTINCT user_id)\nFROM dws_user_active\nWHERE dt = '${biz_date}'",
            params: [{ name: 'Date', value: 'Yesterday', type: 'date' }],
            evidence: { sources: ['dws_user_active'], coverage: 100, lastValidated: '1d ago' },
            gateStatus: 'Pass'
         };
         replyText = '未能精确匹配，为您推荐相关的活跃度指标 **DAU**。';
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: replyText, timestamp: 'Now' }]);
      setActiveResult(result);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] animate-in fade-in duration-500 bg-slate-900 overflow-hidden">
       {/* LEFT: Chat Panel (35%) */}
       <div className="w-[400px] flex flex-col border-r border-slate-700 bg-slate-800/30">
          {/* Chat Header */}
          <div className="h-14 border-b border-slate-700 flex items-center px-4 justify-between bg-slate-800/50 backdrop-blur">
             <div className="flex items-center gap-2 text-white font-bold">
                <Bot size={18} className="text-cyan-400" /> 指标 Copilot
             </div>
             <button onClick={() => setMessages([messages[0]])} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors" title="Reset">
                <RefreshCw size={14} />
             </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                      {msg.role === 'ai' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-slate-300" />}
                   </div>
                   <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' : 'bg-indigo-600 text-white rounded-tr-none shadow-md'}`}>
                      {msg.text}
                   </div>
                </div>
             ))}
             {isThinking && (
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
                      <Bot size={16} className="text-white" />
                   </div>
                   <div className="bg-slate-800 p-3 rounded-xl rounded-tl-none border border-slate-700 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                   </div>
                </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/50">
             <div className="relative">
                <input 
                   type="text" 
                   value={inputText}
                   onChange={e => setInputText(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                   placeholder="e.g. 华东地区最近7天的GMV是多少?" 
                   className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
                />
                <button 
                   onClick={handleSendMessage}
                   disabled={!inputText.trim() || isThinking}
                   className="absolute right-2 top-2 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   <Send size={16} />
                </button>
             </div>
             <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                {['看下昨日 GMV', '登录成功率 (豁免测试)', '订单退款率', '工资报表'].map(hint => (
                   <button 
                      key={hint} 
                      onClick={() => setInputText(hint)}
                      className="whitespace-nowrap px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-full text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                   >
                      {hint}
                   </button>
                ))}
             </div>
          </div>
       </div>

       {/* RIGHT: Result Workbench (65%) */}
       <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden relative">
          
          <div className="h-14 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-800/30">
             <h2 className="font-bold text-slate-200 flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-400" /> 分析工作台
             </h2>
             <button onClick={() => navigate('/metrics')} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                <ArrowLeft size={12} /> 返回指标列表
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 relative">
             {/* Background Placeholder if empty */}
             {!activeResult && !isThinking && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 opacity-30 pointer-events-none">
                   <Sparkles size={64} className="mb-4" />
                   <p className="text-lg font-bold">Waiting for query...</p>
                </div>
             )}

             {activeResult && (
                <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500">
                   
                   {activeResult.gateStatus === 'Pass' ? (
                      <>
                         {/* 1. Top Recommendation */}
                         <RecommendationCard result={activeResult} />

                         {/* 2. Main Content Grid */}
                         <div className="grid grid-cols-12 gap-6 h-[400px]">
                            {/* SQL/Query */}
                            <div className="col-span-8 h-full">
                               <QueryCard result={activeResult} />
                            </div>
                            
                            {/* Evidence/Meta */}
                            <div className="col-span-4 flex flex-col gap-6 h-full">
                               <EvidenceCard result={activeResult} />
                               
                               {/* Actions */}
                               <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-center gap-3">
                                  <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-indigo-900/20">
                                     在 BI 中打开
                                  </button>
                                  <button className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors">
                                     下载 CSV
                                  </button>
                               </div>
                            </div>
                         </div>
                      </>
                   ) : (
                      /* GATE FAILURE VIEW */
                      <div className="max-w-2xl mx-auto mt-10">
                         <GateCard result={activeResult} />
                      </div>
                   )}
                </div>
             )}
          </div>
       </div>
    </div>
  );
};
