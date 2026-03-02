
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockAIOpsRequests } from '../../data/aiopsMock';
import { AIOpsRequest, StageId } from '../../types/aiops';
import { 
  ArrowLeft, MessageSquare, Play, CheckCircle2, AlertCircle, 
  Clock, FileText, ChevronRight, X, Send, Bot, User,
  ListTodo, Package, Activity, Info
} from 'lucide-react';
import { StageDetailContent } from '../../components/aiops/stages/StageDetailContent';
import { ChatContextBar } from '../../components/aiops/chat/ChatContextBar';
import { ChatMessageStream } from '../../components/aiops/chat/ChatMessageStream';
import { ChatComposer } from '../../components/aiops/chat/ChatComposer';
import { ChatMessage } from '../../types/aiops';
import { RunConsole } from '../../components/aiops/console/RunConsole';

export const AIOpsRequestDetailPage: React.FC = () => {
  const { requestId, stageId } = useParams<{ requestId: string; stageId?: StageId }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<AIOpsRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'runs' | 'tasks' | 'deliverables'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(true);

  useEffect(() => {
    const found = mockAIOpsRequests.find(r => r.id === requestId);
    if (found) {
      setRequest(found);
      // Mock initial messages
      setMessages([
        {
          id: '1',
          type: 'user',
          content: '帮我扫描零售域订单相关的表，并自动生成逻辑视图和核心指标建议',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          sender: 'user'
        },
        {
          id: '2',
          type: 'plan',
          timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
          sender: 'ai',
          data: {
            steps: [
              { title: '元数据扫描', description: '扫描所选 4 张表的结构与元数据' },
              { title: '数据画像分析', description: '分析字段分布、空值率与唯一性' },
              { title: '语义关联识别', description: '识别主外键关系与业务术语匹配' },
              { title: '候选对象生成', description: '生成 3 个逻辑视图与 5 个核心指标' }
            ]
          }
        },
        {
          id: '3',
          type: 'progress',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          sender: 'ai',
          data: {
            progress: 65,
            stats: [
              { label: '已扫描表', value: '4/4' },
              { label: '识别字段', value: '156' },
              { label: '画像完成度', value: '100%' },
              { label: '语义匹配数', value: '12' }
            ]
          }
        },
        {
          id: '4',
          type: 'blocker',
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          sender: 'ai',
          data: {
            blockers: [
              { type: 'hard', title: '客户表地址字段空值率过高 (85%)，影响画像准确性' },
              { type: 'soft', title: '建议补充商品分类枚举值映射，以提升语义理解质量' }
            ]
          }
        }
      ]);
    }
  }, [requestId]);

  if (!request) return <div className="p-10 text-center text-slate-500">加载中...</div>;

  const handleSend = (content: string, attachContext: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
      sender: 'user'
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Mock AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'deliverable',
        timestamp: new Date().toISOString(),
        sender: 'ai',
        data: {
          items: [
            { name: '零售域元数据扫描报告', type: 'PDF' },
            { name: '数据质量检测明细', type: 'Excel' }
          ]
        }
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleStageClick = (sId: StageId) => {
    navigate(`/aiops/workbench/requests/${requestId}/stages/${sId}`);
  };

  const handleConfirmPlan = (msgId: string) => {
    if (request) {
      const updatedRequest = { ...request };
      updatedRequest.runs = [...updatedRequest.runs, {
        id: Date.now().toString(),
        stageId: 'A',
        startTime: new Date().toISOString(),
        status: 'running' as const,
        progress: 0
      }];
      setRequest(updatedRequest);
      
      const systemMsg: ChatMessage = {
        id: Date.now().toString(),
        type: 'progress',
        timestamp: new Date().toISOString(),
        sender: 'ai',
        data: {
          progress: 5,
          stats: [
            { label: '当前状态', value: '正在初始化' },
            { label: '预计耗时', value: '15m' }
          ]
        }
      };
      setMessages(prev => [...prev, systemMsg]);
    }
  };

  const handleModifyPlan = (msgId: string) => {
    handleSend("我想修改一下执行计划，能帮我调整吗？", false);
  };

  const handleIgnoreBlocker = (msgId: string, blockerIdx: number) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId && msg.type === 'blocker') {
        const newBlockers = [...msg.data.blockers];
        newBlockers.splice(blockerIdx, 1);
        return { ...msg, data: { ...msg.data, blockers: newBlockers } };
      }
      return msg;
    }));
  };

  const handleResolveBlocker = (msgId: string, blockerIdx: number) => {
    // For demo, navigate to stage B
    handleStageClick('B');
  };

  const closeDrawer = () => {
    navigate(`/aiops/workbench/requests/${requestId}`);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/aiops/workbench" className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{request.title}</h1>
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                {request.status === 'active' ? '进行中' : '草稿'}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">{request.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors border border-slate-700">
            暂停需求
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-900/20">
            完成交付
          </button>
        </div>
      </div>

      {/* Main Content Area: Split Layout */}
      <div className="flex-1 flex gap-6 min-h-0 relative">
        {/* Left Column: Chat & Plan */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-800/40 rounded-2xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/30 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={14} className="text-indigo-400" /> 对话与计划
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">AI 助手在线</span>
              </div>
              {!isConsoleExpanded && (
                <button 
                  onClick={() => setIsConsoleExpanded(true)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700 flex items-center gap-2"
                >
                  <ListTodo size={14} />
                  <span className="text-[10px] font-bold uppercase">展开控制台</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0">
            <ChatContextBar 
              domain="零售业务域" 
              datasource="PostgreSQL 生产库 01" 
              assets={['public.orders', 'public.order_items', 'public.products', 'public.customers']}
              employee={{ name: '数据语义理解 (L2)', version: '1.2.4', level: 'L2' }}
            />
            <ChatMessageStream 
              messages={messages} 
              onConfirmPlan={handleConfirmPlan}
              onModifyPlan={handleModifyPlan}
              onIgnoreBlocker={handleIgnoreBlocker}
              onResolveBlocker={handleResolveBlocker}
            />
            <ChatComposer 
              onSend={handleSend} 
              onStartResume={() => {
                if (request) {
                  const isRunning = request.runs.some(r => r.status === 'running');
                  const updatedRequest = { ...request };
                  if (isRunning) {
                    updatedRequest.runs = updatedRequest.runs.map(r => r.status === 'running' ? { ...r, status: 'completed' as const } : r);
                  } else {
                    updatedRequest.runs = [...updatedRequest.runs, {
                      id: Date.now().toString(),
                      stageId: 'D',
                      startTime: new Date().toISOString(),
                      status: 'running' as const,
                      progress: 0
                    }];
                  }
                  setRequest(updatedRequest);
                }
              }} 
              isRunning={request.runs.some(r => r.status === 'running')} 
            />
          </div>
        </div>

        {/* Right Column: Console (Collapsible) */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col min-h-0 relative ${isConsoleExpanded ? 'w-[500px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
          <div className="h-full w-[500px]">
            <RunConsole request={request} onStageClick={handleStageClick} />
          </div>
          
          {/* Collapse Toggle Button */}
          <button 
            onClick={() => setIsConsoleExpanded(false)}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-10 shadow-xl"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Stage Detail Drawer */}
      {stageId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeDrawer}></div>
          <div className="relative w-[600px] h-full bg-slate-900 border-l border-slate-700 shadow-2xl animate-in slide-in-from-right duration-300">
            <button 
              onClick={closeDrawer}
              className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white z-20"
            >
              <X size={20} />
            </button>
            <StageDetailContent stageId={stageId} requestId={requestId!} />
          </div>
        </div>
      )}
    </div>
  );
};
