
import React, { useState, useEffect } from 'react';
import { X, Check, MessageSquare, ListTodo, Sparkles } from 'lucide-react';
import { InboxTask, TaskContext, mockApi } from '../../lib/semantic';

interface AgentCockpitProps {
  isOpen: boolean;
  onClose: () => void;
  logicalViewId: string;
  fieldId?: string; // Optional filter
  onDecisionMade: () => void;
}

export const AgentCockpit = ({ isOpen, onClose, logicalViewId, fieldId, onDecisionMade }: AgentCockpitProps) => {
  const [activeTab, setActiveTab] = useState<'TODO' | 'CHAT'>('TODO');
  const [tasks, setTasks] = useState<InboxTask[]>([]);
  const [currentTask, setCurrentTask] = useState<InboxTask | null>(null);
  const [context, setContext] = useState<TaskContext | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      mockApi.getTasks(logicalViewId).then(allTasks => {
        const filtered = fieldId ? allTasks.filter(t => t.field_id === fieldId) : allTasks;
        setTasks(filtered);
        if (filtered.length > 0) {
          fetchContext(filtered[0].id);
        } else {
          setCurrentTask(null);
          setLoading(false);
        }
      });
    }
  }, [isOpen, logicalViewId, fieldId]);

  const fetchContext = async (taskId: string) => {
    setLoading(true);
    const task = tasks.find(t => t.id === taskId);
    setCurrentTask(task || null);
    if (task) {
      const ctx = await mockApi.getTaskContext(taskId);
      setContext(ctx as TaskContext);
    }
    setLoading(false);
  };

  const handleDecision = async (action: 'ACCEPT' | 'REJECT') => {
    if (!currentTask) return;
    setLoading(true);
    await mockApi.postDecision({ taskId: currentTask.id, action });
    onDecisionMade();
    
    const remaining = tasks.filter(t => t.id !== currentTask.id);
    setTasks(remaining);
    if (remaining.length > 0) {
      fetchContext(remaining[0].id);
    } else {
      setCurrentTask(null);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] bg-slate-900 border-l border-slate-700 flex flex-col z-50 transform transition-transform duration-300 shadow-2xl">
      {/* Header */}
      <div className="h-14 border-b border-slate-700 px-4 flex items-center justify-between bg-slate-800">
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Semantic Copilot</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 bg-slate-800/50">
        <button onClick={() => setActiveTab('TODO')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'TODO' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
          待办 ({tasks.length})
        </button>
        <button onClick={() => setActiveTab('CHAT')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'CHAT' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
          对话
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-900">
        {loading ? (
          <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div></div>
        ) : activeTab === 'TODO' && currentTask && context ? (
          <div className="space-y-6">
            {/* Task Card */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-1 rounded border border-slate-700">{currentTask.id}</span>
                {currentTask.must && <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-500/20">阻塞发布</span>}
              </div>
              <h3 className="font-medium text-slate-200 mb-1">{currentTask.reason}</h3>
              <p className="text-sm text-slate-500">
                影响下游: {currentTask.impact.downstream} 个报表 · {currentTask.impact.objects} 个对象
              </p>
            </div>

            {/* Candidates */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI 推荐候选</h4>
              {context.candidates.map((cand, idx) => (
                <div key={idx} className={`p-3 rounded border cursor-pointer transition-colors ${idx === 0 ? 'bg-cyan-900/10 border-cyan-500/50 ring-1 ring-cyan-500/20' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-200">{cand.label}</span>
                    <span className="text-xs font-mono text-emerald-400">{(cand.score * 100).toFixed(0)}%</span>
                  </div>
                  {cand.tags && (
                    <div className="mt-1 flex gap-1">
                      {cand.tags.map(t => <span key={t} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-slate-600">{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Evidence Chain */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">判决依据</h4>
              {context.evidence_chain.map((ev, i) => (
                <div key={i} className="flex gap-3 text-sm text-slate-400 border-l-2 border-slate-700 pl-3 py-1">
                  <span className="font-mono text-xs text-indigo-400 w-16 shrink-0">{ev.type}</span>
                  <span>{ev.summary}</span>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'TODO' ? (
          <div className="text-center text-slate-500 mt-20">
            <ListTodo className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>暂无待办任务</p>
          </div>
        ) : (
          <div className="text-center text-slate-500 mt-20">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>Chat 功能开发中...</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {activeTab === 'TODO' && currentTask && (
        <div className="p-4 border-t border-slate-700 bg-slate-800 flex gap-3">
          <button onClick={() => handleDecision('REJECT')} className="flex-1 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 font-medium text-sm transition-colors">
            修正/拒绝
          </button>
          <button onClick={() => handleDecision('ACCEPT')} className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
            <Check className="w-4 h-4" /> 采纳推荐
          </button>
        </div>
      )}
    </div>
  );
};
