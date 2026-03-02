
import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Database, AlertCircle, Wand2, UploadCloud, Rocket, CheckCircle2, Box, Layers, ArrowRight, ShieldAlert, BarChart3 } from 'lucide-react';
import { mockApi } from '../api/mockApi';
import { useAsync } from '../hooks/useAsync';
import { Badge } from '../components/ui/Badge';
import { AgentCockpit } from '../components/AgentCockpit/AgentCockpit';
import { PublishWizard } from '../components/PublishWizard/PublishWizard';

export default function LogicalViewDetail() {
  const { logicalViewId } = useParams<{ logicalViewId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('structure');
  const [showCockpit, setShowCockpit] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [publishType, setPublishType] = useState<'PREVIEW' | 'FORMAL'>('PREVIEW');
  const [cockpitFieldId, setCockpitFieldId] = useState<string | undefined>(undefined);

  const { value: view, execute: refreshView } = useAsync(() => mockApi.getLogicalView(logicalViewId!), true);
  const { value: fields, execute: refreshFields } = useAsync(() => mockApi.getFields(logicalViewId!), true);
  const { value: objectCandidates, execute: refreshObjects } = useAsync(() => mockApi.getObjectCandidates(logicalViewId!), true);

  const handleRunSemantic = async () => {
    await mockApi.createSemanticRun(logicalViewId!);
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
    await mockApi.generateObjectCandidates(logicalViewId!);
    refreshView();
    refreshObjects();
    setActiveTab('objects');
  };

  const openPublish = (type: 'PREVIEW' | 'FORMAL') => {
    setPublishType(type);
    setShowPublish(true);
  };

  if (!view) return <div className="flex h-[calc(100vh-64px)] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  const isObjectsReady = ['OBJECT_CANDIDATES_READY', 'PUBLISHED_PREVIEW', 'PUBLISHED_FORMAL'].includes(view.semantic_status);
  const isAnalysisComplete = view.semantic_status !== 'SCANNED' && view.semantic_status !== 'PENDING_UNDERSTANDING' && view.semantic_status !== 'UNDERSTANDING_RUNNING';

  // Process Steps
  const stepStatus = {
    understanding: ['PENDING_UNDERSTANDING', 'UNDERSTANDING_RUNNING', 'NEED_DECISION', 'SEMANTIC_CONFIRMED', 'OBJECT_CANDIDATES_READY', 'PUBLISHED_PREVIEW', 'PUBLISHED_FORMAL'].includes(view.semantic_status),
    confirmed: ['SEMANTIC_CONFIRMED', 'OBJECT_CANDIDATES_READY', 'PUBLISHED_PREVIEW', 'PUBLISHED_FORMAL'].includes(view.semantic_status),
    candidates: ['OBJECT_CANDIDATES_READY', 'PUBLISHED_PREVIEW', 'PUBLISHED_FORMAL'].includes(view.semantic_status),
    published: ['PUBLISHED_PREVIEW', 'PUBLISHED_FORMAL'].includes(view.semantic_status)
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 animate-in fade-in duration-300">
      {/* 1. Header (Unified Skeleton) */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/semantic-modeling/logical-views')} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
             <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
          </button>
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{view.name}</h1>
               <Badge status={view.semantic_status} />
            </div>
            <div className="flex items-center gap-6 mt-2 text-xs text-slate-500">
               <span className="flex items-center gap-1.5"><Database size={12} /> {view.datasource} / {view.schema}</span>
               <span className="flex items-center gap-1.5"><Layers size={12} /> {view.field_total} Fields</span>
               <span className="flex items-center gap-1.5"><BarChart3 size={12} /> Conf: {(view.avg_confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
          
          <div className="ml-auto flex gap-3">
            {view.semantic_status === 'NEED_DECISION' && (
               <button onClick={() => handleOpenCockpit()} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-sm shadow-md transition-all animate-pulse">
                  <AlertCircle className="w-4 h-4" /> 处理 {view.pending_tasks} 个待办
               </button>
            )}

            {['SCANNED', 'PENDING_UNDERSTANDING', 'NEED_DECISION', 'SEMANTIC_CONFIRMED'].includes(view.semantic_status) && (
              <button onClick={handleRunSemantic} className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm">
                <Play className="w-4 h-4" /> {view.semantic_status === 'SCANNED' ? '开始理解' : '重新理解'}
              </button>
            )}
            
            {view.semantic_status === 'SEMANTIC_CONFIRMED' && (
              <button onClick={handleGenerateObjects} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm shadow-sm transition-colors">
                <Wand2 className="w-4 h-4" /> 生成候选对象
              </button>
            )}
            
            {(isObjectsReady) && (
              <button onClick={() => openPublish('PREVIEW')} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 font-medium text-sm transition-colors">
                <UploadCloud className="w-4 h-4" /> 预览发布
              </button>
            )}
            
            {(view.semantic_status === 'PUBLISHED_PREVIEW' || view.semantic_status === 'PUBLISHED_FORMAL') && (
              <button onClick={() => openPublish('FORMAL')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm shadow-sm transition-colors">
                <Rocket className="w-4 h-4" /> 正式上架
              </button>
            )}
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between gap-4 max-w-4xl px-2">
           <StepItem label="字段扫描 & 理解" active={stepStatus.understanding} completed={stepStatus.confirmed} />
           <StepLine completed={stepStatus.confirmed} />
           <StepItem label="语义确认" active={stepStatus.confirmed} completed={stepStatus.candidates} />
           <StepLine completed={stepStatus.candidates} />
           <StepItem label="对象生成" active={stepStatus.candidates} completed={stepStatus.published} />
           <StepLine completed={stepStatus.published} />
           <StepItem label="已发布" active={stepStatus.published} completed={view.semantic_status === 'PUBLISHED_FORMAL'} />
        </div>
      </header>

      {/* Tabs */}
      <div className="px-8 mt-6 shrink-0">
        <div className="flex gap-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('structure')}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'structure' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
          >
            结构与语义 (Structure)
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'status' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
          >
            理解状态 (Status)
          </button>
          <button
            disabled={!isObjectsReady}
            onClick={() => setActiveTab('objects')}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'objects' ? 'text-indigo-600 border-indigo-600' : isObjectsReady ? 'text-slate-500 hover:text-slate-700' : 'text-slate-300 border-transparent cursor-not-allowed'}`}
          >
            业务对象 (Objects)
            {!isObjectsReady && <span className="text-[9px] bg-slate-100 text-slate-400 px-1.5 rounded border border-slate-200">Pending</span>}
          </button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <main className="px-8 py-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
        
        {/* TAB: STRUCTURE */}
        {activeTab === 'structure' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
            {view.semantic_status === 'UNDERSTANDING_RUNNING' ? (
               <div className="flex flex-col items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-6"></div>
                  <h3 className="text-lg font-bold text-slate-800">AI 正在深入理解数据语义...</h3>
                  <p className="text-slate-500 mt-2 text-sm">正在分析数据分布、列名特征与血缘关系</p>
               </div>
            ) : (
               <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                     <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">字段名</th>
                     <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">物理类型</th>
                     {isAnalysisComplete && <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">推断语义</th>}
                     {isAnalysisComplete && <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">字段角色</th>}
                     {isAnalysisComplete && <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">AI 置信度</th>}
                     {isAnalysisComplete && <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">确认状态</th>}
                     <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">操作</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {fields?.map(f => (
                     <tr key={f.id} className="hover:bg-slate-50 group transition-colors">
                       <td className="px-6 py-3 font-medium text-slate-900 font-mono text-sm">{f.name}</td>
                       <td className="px-6 py-3 text-slate-500 font-mono text-xs">{f.type}</td>
                       
                       {isAnalysisComplete ? (
                         <>
                           <td className="px-6 py-3">
                             {f.semantic ? <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs border border-indigo-100 font-medium">{f.semantic.semantic_type}</span> : '-'}
                           </td>
                           <td className="px-6 py-3 text-sm text-slate-600">{f.semantic?.field_role || '-'}</td>
                           <td className="px-6 py-3">
                             {f.semantic ? (
                                <div className="flex items-center gap-2">
                                   <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full ${f.semantic.confidence > 0.8 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${f.semantic.confidence * 100}%` }}></div>
                                   </div>
                                   <span className="text-xs font-mono text-slate-500">{(f.semantic.confidence * 100).toFixed(0)}%</span>
                                </div>
                             ) : '-'}
                           </td>
                           <td className="px-6 py-3">
                             {f.semantic?.decision_status === 'PENDING' ? 
                                <span className="text-amber-600 text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> 待确认</span> : 
                                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={14}/> 已确认</span>
                             }
                           </td>
                         </>
                       ) : (
                         // Placeholders for pre-analysis
                         <>
                           <td className="px-6 py-3 text-slate-300 text-xs">-</td>
                           <td className="px-6 py-3 text-slate-300 text-xs">-</td>
                           <td className="px-6 py-3 text-slate-300 text-xs">-</td>
                           <td className="px-6 py-3 text-slate-300 text-xs">-</td>
                         </>
                       )}

                       <td className="px-6 py-3">
                         {isAnalysisComplete && f.semantic?.decision_status === 'PENDING' && (
                           <button onClick={() => handleOpenCockpit(f.id)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold hover:underline">
                             处理待办
                           </button>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            )}
          </div>
        )}

        {/* TAB: STATUS */}
        {activeTab === 'status' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">当前状态：<Badge status={view.semantic_status} /></h3>
              {view.semantic_status === 'NEED_DECISION' ? (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                    <AlertCircle className="w-5 h-5" /> 存在 {view.pending_tasks} 个语义冲突
                  </div>
                  <p className="text-xs text-amber-700 mb-4 leading-relaxed">
                     系统检测到部分字段存在多义性或低置信度，需要人工辅助决策。
                  </p>
                  <button onClick={() => handleOpenCockpit()} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-xs font-bold transition-colors shadow-sm flex items-center gap-2">
                    <ShieldAlert size={14} /> 打开驾驶舱 (Agent Cockpit)
                  </button>
                </div>
              ) : (
                <div className="text-emerald-600 flex items-center gap-3 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" /> 
                  <div>
                     <span className="font-bold text-sm block">状态健康</span>
                     <span className="text-xs text-emerald-700">当前流程节点无阻塞项。</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: OBJECTS (Preview/Entry) */}
        {activeTab === 'objects' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
            {objectCandidates && objectCandidates.length > 0 ? (
              <>
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                       <Layers size={16} className="text-indigo-500" />
                       <span>生成的业务对象候选 (Candidates)</span>
                    </div>
                    {view.publish_level === 'NONE' && (
                       <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100">
                          预览模式 (Preview)
                       </span>
                    )}
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {objectCandidates.map(oc => (
                     <div key={oc.id} className="border border-slate-200 bg-slate-50 p-5 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                       <div className="flex justify-between mb-3">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 text-purple-600 group-hover:scale-110 transition-transform">
                               <Box size={20} />
                            </div>
                            <div>
                               <h3 className="font-bold text-lg text-slate-800">{oc.name}</h3>
                               <p className="text-xs text-slate-500 font-mono">PK: {oc.primary_identifier}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="text-emerald-600 font-mono text-sm font-bold block">{(oc.confidence * 100).toFixed(0)}%</span>
                            <span className="text-[10px] text-slate-400">Match Score</span>
                         </div>
                       </div>
                       
                       <div className="flex flex-wrap gap-2 mb-4">
                         {oc.attributes.map(attr => (
                            <span key={attr} className="bg-white border border-slate-200 px-2 py-1 rounded text-xs text-slate-600 font-medium">
                               {attr}
                            </span>
                         ))}
                         {oc.attributes.length > 5 && <span className="text-xs text-slate-400 self-center">...</span>}
                       </div>

                       <div className="pt-3 border-t border-slate-200 flex justify-end">
                          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                             查看对象详情 <ArrowRight size={12} />
                          </button>
                       </div>
                     </div>
                   ))}
                 </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400">
                <Box className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>暂无候选对象，请在语义确认后点击 "生成候选对象"。</p>
              </div>
            )}
          </div>
        )}
      </main>

      <AgentCockpit 
        isOpen={showCockpit} 
        onClose={() => setShowCockpit(false)} 
        logicalViewId={logicalViewId!} 
        fieldId={cockpitFieldId}
        onDecisionMade={handleDecisionMade}
      />

      <PublishWizard 
        isOpen={showPublish}
        onClose={() => setShowPublish(false)}
        logicalViewId={logicalViewId!}
        type={publishType}
        onSuccess={() => refreshView()}
      />
    </div>
  );
}

const StepItem = ({ label, active, completed }: { label: string, active: boolean, completed: boolean }) => (
   <div className="flex flex-col items-center gap-2 relative z-10">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-500
         ${completed ? 'bg-indigo-600 border-indigo-600 text-white' : active ? 'bg-white border-indigo-600 text-indigo-600' : 'bg-slate-100 border-slate-300 text-slate-400'}
      `}>
         {completed ? <CheckCircle2 size={16} /> : active ? <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></div> : <div className="w-2.5 h-2.5 bg-slate-300 rounded-full"></div>}
      </div>
      <span className={`text-[10px] font-medium transition-colors ${active || completed ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
   </div>
);

const StepLine = ({ completed }: { completed: boolean }) => (
   <div className="flex-1 h-0.5 bg-slate-200 -mt-6">
      <div className={`h-full bg-indigo-600 transition-all duration-700 ease-in-out ${completed ? 'w-full' : 'w-0'}`}></div>
   </div>
);
