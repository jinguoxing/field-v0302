
import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Database, AlertCircle, Wand2, UploadCloud, Rocket, CheckCircle2 } from 'lucide-react';
import { mockApi, useAsync, SemanticStatus } from '../../lib/semantic';
import { AgentCockpit } from '../../components/semantic/AgentCockpit';
import { PublishWizard } from '../../components/semantic/PublishWizard';

const Badge = ({ status }: { status: SemanticStatus }) => {
  const statusConfig: Record<SemanticStatus, { label: string; color: string }> = {
    'SCANNED': { label: '已扫描', color: 'bg-slate-700 text-slate-400 border-slate-600' },
    'PENDING_UNDERSTANDING': { label: '待理解', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'UNDERSTANDING_RUNNING': { label: '理解中...', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse' },
    'NEED_DECISION': { label: '待裁决', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    'SEMANTIC_CONFIRMED': { label: '已确认', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    'OBJECT_CANDIDATES_READY': { label: '候选就绪', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
    'PUBLISHED_PREVIEW': { label: '预览发布', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    'PUBLISHED_FORMAL': { label: '正式发布', color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 font-bold' },
  };
  const cfg = statusConfig[status] || { label: status, color: 'bg-slate-700' };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

export const SemanticModelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('structure');
  const [showCockpit, setShowCockpit] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [publishType, setPublishType] = useState<'PREVIEW' | 'FORMAL'>('PREVIEW');
  const [cockpitFieldId, setCockpitFieldId] = useState<string | undefined>(undefined);

  const { value: view, execute: refreshView } = useAsync(() => mockApi.getLogicalView(id!), true);
  const { value: fields, execute: refreshFields } = useAsync(() => mockApi.getFields(id!), true);
  const { value: objectCandidates, execute: refreshObjects } = useAsync(() => mockApi.getObjectCandidates(id!), true);

  const handleRunSemantic = async () => {
    await mockApi.createSemanticRun(id!);
    refreshView(); 
  };

  const handleOpenCockpit = (fieldId?: string) => {
    setCockpitFieldId(fieldId);
    setShowCockpit(true);
  };

  const handleDecisionMade = useCallback(() => {
    refreshView();
    refreshFields();
  }, [refreshView, refreshFields]);

  const handleGenerateObjects = async () => {
    await mockApi.generateObjectCandidates(id!);
    refreshView();
    refreshObjects();
    setActiveTab('objects');
  };

  const openPublish = (type: 'PREVIEW' | 'FORMAL') => {
    setPublishType(type);
    setShowPublish(true);
  };

  if (!view) return <div className="p-10 text-slate-500">Loading semantic model...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-300">
      {/* Header */}
      <header className="px-8 py-5 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('/semantic-models')} className="p-2 hover:bg-slate-700 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-400 hover:text-white" /></button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
              {view.name} 
              <Badge status={view.semantic_status} />
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                <Database size={12} /> {view.datasource} <span className="text-slate-600">/</span> {view.schema}
            </p>
          </div>
          <div className="ml-auto flex gap-3">
            {view.semantic_status !== 'UNDERSTANDING_RUNNING' && view.semantic_status !== 'PUBLISHED_FORMAL' && (
              <button onClick={handleRunSemantic} className="flex items-center gap-2 px-4 py-2 border border-slate-600 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white font-medium text-sm transition-colors">
                <Play className="w-4 h-4" /> 重新理解
              </button>
            )}
            {view.semantic_status === 'SEMANTIC_CONFIRMED' && (
              <button onClick={handleGenerateObjects} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 font-medium text-sm shadow-lg shadow-violet-900/20 transition-colors">
                <Wand2 className="w-4 h-4" /> 生成候选对象
              </button>
            )}
            {(view.semantic_status === 'SCANNED' || view.semantic_status === 'SEMANTIC_CONFIRMED') && (
              <button onClick={() => openPublish('PREVIEW')} className="flex items-center gap-2 px-4 py-2 bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-900/50 font-medium text-sm transition-colors">
                <UploadCloud className="w-4 h-4" /> 预览发布
              </button>
            )}
            {view.semantic_status === 'SEMANTIC_CONFIRMED' && (
              <button onClick={() => openPublish('FORMAL')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-medium text-sm shadow-lg shadow-emerald-900/20 transition-colors">
                <Rocket className="w-4 h-4" /> 正式上架
              </button>
            )}
          </div>
        </div>

        {/* Status Stepper (Visual) */}
        <div className="flex items-center gap-2 max-w-3xl">
          {['字段理解', '表级理解', '对象候选', '可发布'].map((step, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i <= 2 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`}></div>
          ))}
        </div>
      </header>

      {/* Tabs */}
      <div className="px-8 mt-6 shrink-0">
        <div className="flex gap-8 border-b border-slate-700">
          {['structure', 'status', 'objects'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab === 'structure' ? '结构与语义 (Structure)' : tab === 'status' ? '理解状态 (Status)' : '业务对象 (Objects)'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="px-8 py-6 flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'structure' && (
          <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 overflow-hidden backdrop-blur-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">字段名</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">类型</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">语义类型</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">字段角色</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">置信度</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {fields?.map(f => (
                  <tr key={f.id} className="hover:bg-slate-700/30 group transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-200">{f.name}</td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{f.type}</td>
                    <td className="px-6 py-3">
                      {f.semantic ? <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-[10px] border border-blue-500/20">{f.semantic.semantic_type}</span> : '-'}
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-400">{f.semantic?.field_role || '-'}</td>
                    <td className="px-6 py-3">
                      {f.semantic ? <span className={`font-mono text-xs font-bold ${f.semantic.confidence > 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>{(f.semantic.confidence * 100).toFixed(0)}%</span> : '-'}
                    </td>
                    <td className="px-6 py-3">
                      {f.semantic?.decision_status === 'PENDING' ? <span className="text-amber-400 text-xs font-bold">待确认</span> : <span className="text-emerald-400 text-xs">已确认</span>}
                    </td>
                    <td className="px-6 py-3">
                      {f.semantic?.decision_status === 'PENDING' && (
                        <button onClick={() => handleOpenCockpit(f.id)} className="text-indigo-400 hover:text-indigo-300 text-xs font-bold hover:underline">
                          处理待办
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">当前状态：<Badge status={view.semantic_status} /></h3>
              {view.semantic_status === 'UNDERSTANDING_RUNNING' ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-slate-400 text-sm">AI 正在分析元数据与数据分布...</p>
                </div>
              ) : view.semantic_status === 'NEED_DECISION' ? (
                <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                    <AlertCircle className="w-5 h-5" /> 存在 {view.pending_tasks} 个阻塞项
                  </div>
                  <button onClick={() => handleOpenCockpit()} className="mt-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded text-xs font-bold transition-colors">
                    打开驾驶舱处理
                  </button>
                </div>
              ) : (
                <div className="text-emerald-400 flex items-center gap-2 bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" /> 
                  <span className="font-bold text-sm">所有语义已确认，可进行下一步。</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'objects' && (
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
            {objectCandidates && objectCandidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objectCandidates.map(oc => (
                  <div key={oc.id} className="border border-slate-700 bg-slate-800 p-4 rounded-lg hover:border-violet-500/50 hover:shadow-lg transition-all">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-lg text-white">{oc.name}</h3>
                      <span className="text-emerald-400 font-mono text-sm font-bold">{(oc.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2 font-mono">主键: {oc.primary_identifier}</p>
                    <div className="flex flex-wrap gap-2">
                      {oc.attributes.map(attr => <span key={attr} className="bg-slate-900 border border-slate-600 px-2 py-1 rounded text-xs text-slate-300">{attr}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>暂无候选对象，请在语义确认后生成。</p>
              </div>
            )}
          </div>
        )}
      </main>

      <AgentCockpit 
        isOpen={showCockpit} 
        onClose={() => setShowCockpit(false)} 
        logicalViewId={id!} 
        fieldId={cockpitFieldId}
        onDecisionMade={handleDecisionMade}
      />

      <PublishWizard 
        isOpen={showPublish}
        onClose={() => setShowPublish(false)}
        logicalViewId={id!}
        type={publishType}
        onSuccess={() => refreshView()}
      />
    </div>
  );
};
