
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitPullRequest, Search, Filter, Plus, MoreHorizontal, ShieldCheck, 
  CheckCircle2, Clock, AlertCircle, Bot, User, CircleDashed, Loader2, 
  AlertTriangle, ChevronRight, FileText, Play, Check, X, Edit3, Save
} from 'lucide-react';

// Mock Data
type QueueType = 'NOT_SCANNED' | 'SCANNING' | 'PASS' | 'WARN_BLOCK';

interface DraftRule {
  id: string;
  name: string;
  source: 'Agent 推荐' | '手工录入' | '制度提取';
  scope: string;
  queue: QueueType;
  scanConclusion: string;
  evidence: string;
  ruleText: string;
  createdAt: string;
  author: string;
}

const MOCK_DRAFTS: DraftRule[] = [
  { 
    id: 'D-001', 
    name: '新版市场推广费审批规则', 
    source: '手工录入', 
    scope: '市场部 / 推广费报销',
    queue: 'NOT_SCANNED',
    scanConclusion: '-',
    evidence: '-',
    ruleText: '当报销单类型为"市场推广费"且金额大于50000元时，必须包含"事前审批单"附件，否则阻断提交。',
    createdAt: '2024-03-21 10:30', 
    author: '张三' 
  },
  { 
    id: 'D-002', 
    name: '差旅标准动态调整', 
    source: 'Agent 推荐', 
    scope: '全集团 / 差旅报销',
    queue: 'WARN_BLOCK',
    scanConclusion: '存在逻辑冲突 (WARN)',
    evidence: '与现存规则 R-001 (费用报销额度校验) 存在重叠。新规则建议"一线城市住宿上限上浮15%"，但R-001中硬性规定了绝对值上限。建议合并或增加优先级判断。',
    ruleText: '若出差目的地为"一线城市"（北上广深），且出差时间包含法定节假日，住宿标准上限自动上浮15%。',
    createdAt: '2024-03-20 14:15', 
    author: 'AI Agent' 
  },
  { 
    id: 'D-003', 
    name: '供应商资质自动复核逻辑', 
    source: 'Agent 推荐', 
    scope: '供应链 / 供应商准入',
    queue: 'PASS',
    scanConclusion: '无冲突，逻辑严密 (PASS)',
    evidence: '已扫描全局规则库，未发现与现有准入规则冲突。变量定义清晰，可直接入库。',
    ruleText: '供应商入库满1年时，系统自动触发资质复核流程。若营业执照过期或风险评级降为C级以下，自动冻结交易权限。',
    createdAt: '2024-03-19 09:00', 
    author: 'AI Agent' 
  },
  { 
    id: 'D-004', 
    name: '年度审计合规性补充规则', 
    source: '制度提取', 
    scope: '财务部 / 年度审计',
    queue: 'SCANNING',
    scanConclusion: '扫描中...',
    evidence: '正在进行全库一致性校验与影响面分析...',
    ruleText: '所有涉及跨国交易的合同，必须在归档前补充"税务合规审查表"及"反洗钱承诺书"。',
    createdAt: '2024-03-18 16:45', 
    author: '李四' 
  },
  { 
    id: 'D-005', 
    name: '异常采购价格拦截', 
    source: 'Agent 推荐', 
    scope: '采购部 / 采购订单',
    queue: 'WARN_BLOCK',
    scanConclusion: '高危风险 (BLOCK)',
    evidence: '规则条件过于宽泛，可能导致正常采购业务被大面积拦截。建议增加"物料类别"或"历史均价容差"等限制条件。',
    ruleText: '当采购单价高于历史最低价20%时，直接拦截订单并触发合规审计。',
    createdAt: '2024-03-17 11:20', 
    author: 'AI Agent' 
  },
];

const QUEUES = [
  { id: 'NOT_SCANNED', label: '待体检', icon: CircleDashed, color: 'text-slate-400', count: MOCK_DRAFTS.filter(d => d.queue === 'NOT_SCANNED').length },
  { id: 'SCANNING', label: '体检中', icon: Loader2, color: 'text-indigo-400', count: MOCK_DRAFTS.filter(d => d.queue === 'SCANNING').length },
  { id: 'PASS', label: '可直接入库', icon: CheckCircle2, color: 'text-emerald-400', count: MOCK_DRAFTS.filter(d => d.queue === 'PASS').length },
  { id: 'WARN_BLOCK', label: '需处置', icon: AlertTriangle, color: 'text-amber-400', count: MOCK_DRAFTS.filter(d => d.queue === 'WARN_BLOCK').length },
];

export const DraftsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeQueue, setActiveQueue] = useState<QueueType>('WARN_BLOCK');
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(
    MOCK_DRAFTS.find(d => d.queue === 'WARN_BLOCK')?.id || null
  );

  const filteredDrafts = MOCK_DRAFTS.filter(d => d.queue === activeQueue);
  const selectedDraft = MOCK_DRAFTS.find(d => d.id === selectedDraftId);

  // Handle queue change
  const handleQueueChange = (queueId: QueueType) => {
    setActiveQueue(queueId);
    const firstInQueue = MOCK_DRAFTS.find(d => d.queue === queueId);
    setSelectedDraftId(firstInQueue ? firstInQueue.id : null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <GitPullRequest className="text-amber-400" size={28} />
            草稿与待审 <span className="text-slate-600 font-light">/ Drafts & Inbox</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">管理拟入库新规则，统一执行体检扫描闸门。</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700">
            <Bot size={16} className="text-indigo-400" />
            Agent 推荐
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-cyan-900/20">
            <Plus size={16} />
            新建草稿
          </button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Left Column: Queue Sidebar */}
        <div className="w-64 flex flex-col gap-2 shrink-0">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">处理队列</h3>
            <div className="space-y-1">
              {QUEUES.map(queue => {
                const isActive = activeQueue === queue.id;
                return (
                  <button
                    key={queue.id}
                    onClick={() => handleQueueChange(queue.id as QueueType)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive 
                        ? 'bg-slate-700/80 text-white shadow-sm border border-slate-600/50' 
                        : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <queue.icon size={16} className={`${queue.color} ${queue.id === 'SCANNING' ? 'animate-spin' : ''}`} />
                      <span className="font-medium">{queue.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                      isActive ? 'bg-slate-900/50 text-cyan-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {queue.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle Column: Draft List */}
        <div className="w-80 flex flex-col bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm shrink-0 overflow-hidden">
          <div className="p-3 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/30">
            <span className="text-sm font-medium text-slate-300">
              {QUEUES.find(q => q.id === activeQueue)?.label} ({filteredDrafts.length})
            </span>
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
              <Filter size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {filteredDrafts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                <CheckCircle2 size={32} className="mb-3 opacity-20" />
                <p className="text-sm">当前队列为空</p>
              </div>
            ) : (
              filteredDrafts.map(draft => {
                const isSelected = selectedDraftId === draft.id;
                return (
                  <div
                    key={draft.id}
                    onClick={() => setSelectedDraftId(draft.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                        : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`text-sm font-medium line-clamp-2 pr-2 ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                        {draft.name}
                      </h4>
                      {draft.source === 'Agent 推荐' ? (
                        <Bot size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                      ) : (
                        <User size={14} className="text-slate-500 shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 border border-slate-700 truncate max-w-[120px]">
                        {draft.scope}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{draft.id}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      {activeQueue === 'WARN_BLOCK' && <AlertTriangle size={12} className="text-amber-400" />}
                      {activeQueue === 'PASS' && <CheckCircle2 size={12} className="text-emerald-400" />}
                      {activeQueue === 'SCANNING' && <Loader2 size={12} className="text-indigo-400 animate-spin" />}
                      <span className="truncate">{draft.scanConclusion}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Draft Preview */}
        <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm overflow-hidden flex flex-col min-w-0">
          {selectedDraft ? (
            <>
              {/* Preview Header */}
              <div className="p-6 border-b border-slate-700/50 bg-slate-900/30 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs font-mono border border-slate-700">
                      {selectedDraft.id}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                      selectedDraft.source === 'Agent 推荐' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                    }`}>
                      {selectedDraft.source === 'Agent 推荐' ? <Bot size={12} /> : <User size={12} />}
                      {selectedDraft.source}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedDraft.name}</h2>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5"><FileText size={14} /> Scope: {selectedDraft.scope}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {selectedDraft.createdAt}</span>
                    <span className="flex items-center gap-1.5"><User size={14} /> {selectedDraft.author}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/rule-center/drafts/${selectedDraft.id}`)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700" 
                    title="编辑"
                  >
                    <Edit3 size={18} />
                  </button>
                  {selectedDraft.queue === 'NOT_SCANNED' || selectedDraft.queue === 'WARN_BLOCK' ? (
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-900/20">
                      <Play size={16} />
                      发起体检
                    </button>
                  ) : selectedDraft.queue === 'PASS' ? (
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-900/20">
                      <Check size={16} />
                      直接入库
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-400 rounded-lg cursor-not-allowed border border-slate-600">
                      <Loader2 size={16} className="animate-spin" />
                      扫描中...
                    </button>
                  )}
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                
                {/* Rule Text Snapshot */}
                <section>
                  <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-cyan-400" />
                    规则文本快照
                  </h3>
                  <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-300 text-sm leading-relaxed font-mono">
                    {selectedDraft.ruleText}
                  </div>
                </section>

                {/* Scan Conclusion & Evidence */}
                {(selectedDraft.queue === 'WARN_BLOCK' || selectedDraft.queue === 'PASS' || selectedDraft.queue === 'SCANNING') && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                      <ShieldCheck size={16} className={
                        selectedDraft.queue === 'WARN_BLOCK' ? 'text-amber-400' : 
                        selectedDraft.queue === 'PASS' ? 'text-emerald-400' : 'text-indigo-400'
                      } />
                      体检结论与证据摘要
                    </h3>
                    <div className={`p-4 rounded-xl border ${
                      selectedDraft.queue === 'WARN_BLOCK' ? 'bg-amber-500/5 border-amber-500/20' : 
                      selectedDraft.queue === 'PASS' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                      'bg-indigo-500/5 border-indigo-500/20'
                    }`}>
                      <div className={`font-bold mb-2 ${
                        selectedDraft.queue === 'WARN_BLOCK' ? 'text-amber-400' : 
                        selectedDraft.queue === 'PASS' ? 'text-emerald-400' : 'text-indigo-400'
                      }`}>
                        {selectedDraft.scanConclusion}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {selectedDraft.evidence}
                      </p>
                      
                      {selectedDraft.queue === 'WARN_BLOCK' && (
                        <div className="mt-4 pt-4 border-t border-amber-500/10 flex gap-3">
                          <button className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded text-sm font-medium transition-colors border border-amber-500/20">
                            查看冲突详情
                          </button>
                          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm font-medium transition-colors border border-slate-700">
                            忽略并强制入库
                          </button>
                        </div>
                      )}
                    </div>
                  </section>
                )}

              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700/50">
                <FileText size={24} className="text-slate-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">未选择草稿</h3>
              <p className="text-sm max-w-sm">请在左侧列表中选择一个草稿以查看详情、体检结论及执行操作。</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
