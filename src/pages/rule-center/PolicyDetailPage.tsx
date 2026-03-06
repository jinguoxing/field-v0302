import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Search, Plus, List, 
  ChevronRight, ChevronDown, Link as LinkIcon, 
  CheckCircle2, AlertTriangle, Activity, Bot,
  MessageSquare, ArrowRight
} from 'lucide-react';

export const PolicyDetailPage: React.FC = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  
  const [expandedSections, setExpandedSections] = useState<string[]>(['ch3', 'ch3.2']);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [activeClause, setActiveClause] = useState<string | null>('3.2');

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 10) {
      setSelectedText(selection.toString());
    } else {
      setSelectedText(null);
    }
  };

  const handleGenerateDraft = () => {
    // Navigate to draft editor with selected text as context
    navigate(`/rule-center/drafts/new?source=policy&policyId=${policyId}&clause=${activeClause}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 animate-in fade-in duration-500">
      {/* Top Action Bar */}
      <div className="h-16 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/rule-center/policies')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold flex items-center gap-1">
                <FileText size={10} /> 制度详情
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {policyId || 'P-002'}</span>
            </div>
            <h1 className="text-lg font-bold text-white mt-0.5">《员工差旅管理办法 v2.0》</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedText ? (
            <button 
              onClick={handleGenerateDraft}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-900/20 animate-in slide-in-from-right-4"
            >
              <Bot size={16} />
              从选中条款生成规则草稿
            </button>
          ) : (
            <div className="text-xs text-slate-500 italic flex items-center gap-2">
              <MessageSquare size={14} />
              划选正文文本以生成规则
            </div>
          )}
          <div className="w-px h-6 bg-slate-800 mx-2"></div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700">
            <Activity size={16} />
            查看关联体检记录
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Directory Tree */}
        <div className="w-64 border-r border-slate-800/60 bg-slate-900/30 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <List size={16} /> 目录大纲
            </h2>
          </div>
          <div className="p-2 space-y-1 text-sm text-slate-300">
            {/* Chapter 1 */}
            <div>
              <button onClick={() => toggleSection('ch1')} className="w-full flex items-center gap-2 p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-left">
                {expandedSections.includes('ch1') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                第一章 总则
              </button>
            </div>
            {/* Chapter 2 */}
            <div>
              <button onClick={() => toggleSection('ch2')} className="w-full flex items-center gap-2 p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-left">
                {expandedSections.includes('ch2') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                第二章 差旅申请与审批
              </button>
            </div>
            {/* Chapter 3 */}
            <div>
              <button onClick={() => toggleSection('ch3')} className="w-full flex items-center gap-2 p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-left text-emerald-400 font-medium">
                {expandedSections.includes('ch3') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                第三章 差旅标准与报销
              </button>
              {expandedSections.includes('ch3') && (
                <div className="pl-6 pr-2 py-1 space-y-1">
                  <button className="w-full text-left p-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800/30 transition-colors">
                    3.1 交通费标准
                  </button>
                  <button 
                    onClick={() => setActiveClause('3.2')}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${activeClause === '3.2' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:bg-slate-800/30'}`}
                  >
                    3.2 住宿费标准及特殊情况
                  </button>
                  <button className="w-full text-left p-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800/30 transition-colors">
                    3.3 差旅补贴
                  </button>
                </div>
              )}
            </div>
            {/* Chapter 4 */}
            <div>
              <button onClick={() => toggleSection('ch4')} className="w-full flex items-center gap-2 p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-left">
                {expandedSections.includes('ch4') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                第四章 附则
              </button>
            </div>
          </div>
        </div>

        {/* Center: Text Reader */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950/50 overflow-y-auto custom-scrollbar" onMouseUp={handleTextSelection}>
          <div className="max-w-3xl mx-auto w-full p-10">
            <div className="prose prose-invert prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-4">第三章 差旅标准与报销</h2>
              
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-slate-200 mb-4">3.1 交通费标准</h3>
                  <p className="text-slate-400 leading-relaxed">
                    员工出差应优先选择公共交通工具。原则上，总监及以上级别可乘坐飞机经济舱或高铁一等座；其他员工乘坐高铁二等座或硬卧。特殊情况需乘坐飞机者，须经部门负责人及分管副总裁审批。
                  </p>
                </section>

                <section className={`p-4 -mx-4 rounded-xl transition-colors ${activeClause === '3.2' ? 'bg-slate-900/80 border border-slate-800' : ''}`}>
                  <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    3.2 住宿费标准及特殊情况
                    {activeClause === '3.2' && <LinkIcon size={16} className="text-slate-500" />}
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    员工出差住宿标准按出差目的地城市级别划分，具体标准见附件《城市住宿标准明细表》。
                  </p>
                  <div className="p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-lg">
                    <p className="text-slate-300 leading-relaxed">
                      对于前往北京、上海、广州、深圳等一线城市出差的员工，若出差期间跨越国家法定节假日，考虑到酒店价格普遍上涨，其住宿报销标准上限可在原标准基础上上浮15%。但若有VP及以上级别高管随行，则按高管标准实报实销，不适用此上浮比例。
                    </p>
                  </div>
                  <p className="text-slate-400 leading-relaxed mt-4">
                    超标部分原则上由员工个人承担。如遇大型展会等特殊情况导致房源紧张且价格普遍超标，需提供两家以上同级别酒店比价截图，并经部门负责人特批后方可全额报销。
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-slate-200 mb-4">3.3 差旅补贴</h3>
                  <p className="text-slate-400 leading-relaxed">
                    差旅补贴按出差自然天数计算，标准为 100元/天，包含市内交通及餐饮补助。出差期间若由接待方提供餐饮或交通，则相应减半发放补贴。
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Linked Rules List */}
        <div className="w-80 border-l border-slate-800/60 bg-slate-900/30 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-slate-800/60">
            <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <LinkIcon size={16} className="text-indigo-400" />
              关联规则 (Linked Rules)
            </h2>
            <p className="text-xs text-slate-500 mt-1">当前条款 (3.2) 关联 2 条规则</p>
          </div>

          <div className="p-4 space-y-4">
            {/* Linked Rule 1 */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-indigo-400">R-001</span>
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px]">生效中</span>
              </div>
              <div className="text-sm font-medium text-slate-200 mb-2">费用报销额度校验</div>
              <div className="text-xs text-slate-400 line-clamp-2 mb-3">
                校验差旅报销单中的住宿费是否超过城市标准上限。
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  体检通过 (2024-03-21)
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>

            {/* Linked Rule 2 (Draft) */}
            <div className="p-4 bg-slate-950 border border-slate-800 border-dashed rounded-xl hover:border-amber-500/50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-amber-400">D-002</span>
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px]">草稿中</span>
              </div>
              <div className="text-sm font-medium text-slate-200 mb-2">节假日一线城市住宿上浮</div>
              <div className="text-xs text-slate-400 line-clamp-2 mb-3">
                若出差目的地为北上广深且包含法定节假日，住宿标准上限上浮15%。
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-1 text-[10px] text-amber-500">
                  <AlertTriangle size={12} />
                  存在同级冲突 (R-001)
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>

            {/* AI Prompt */}
            <div className="mt-6 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Bot size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-300 leading-relaxed">
                  AI 自动识别：体检报告已将 <span className="font-mono text-amber-400">D-002</span> 与本条款建立追溯关联。未来若本条款修订，系统将自动预警关联规则。
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
