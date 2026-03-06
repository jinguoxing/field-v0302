import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Play, Save, AlertTriangle, CheckCircle2, 
  ChevronDown, ChevronRight, Network, Zap, GitMerge, 
  FileText, FileSearch, Activity, SlidersHorizontal,
  ArrowRightLeft, Plus, Trash2, ShieldAlert
} from 'lucide-react';

type ResolutionMode = 'replace' | 'merge' | 'coexist' | 'boundary';

export const RuleWorkbenchResolvePage: React.FC = () => {
  const { draftId } = useParams();
  const [searchParams] = useSearchParams();
  const scanId = searchParams.get('scanId') || 'SCN-20240321-001';
  const navigate = useNavigate();

  const [expandedNav, setExpandedNav] = useState<string[]>(['conflicts', 'coverage']);
  const [activeIssueId, setActiveIssueId] = useState('R-042');
  const [resolutionMode, setResolutionMode] = useState<ResolutionMode>('boundary');
  
  const [coexistRemark, setCoexistRemark] = useState('');
  const [showCoexistInput, setShowCoexistInput] = useState(false);
  const [isRescanning, setIsRescanning] = useState(false);

  const toggleNav = (section: string) => {
    setExpandedNav(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleRescan = () => {
    setIsRescanning(true);
    setTimeout(() => {
      setIsRescanning(false);
      // Mock success or new state
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 animate-in fade-in duration-500">
      {/* Top Action Bar */}
      <div className="h-16 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold flex items-center gap-1">
                <ShieldAlert size={10} /> 处置工作台
              </span>
              <span className="text-xs text-slate-500 font-mono">Draft: {draftId || 'D-002'} | Scan: {scanId}</span>
            </div>
            <h1 className="text-lg font-bold text-white mt-0.5">差旅标准动态调整 - 异常处置</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowCoexistInput(!showCoexistInput)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              <Save size={16} />
              并存入库
            </button>
            {showCoexistInput && (
              <div className="absolute top-full right-0 mt-2 w-72 p-4 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-slate-300 mb-2">例外场景备注 (必填)</label>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 resize-none" 
                  rows={3}
                  placeholder="请说明为何允许冲突规则并存..."
                  value={coexistRemark}
                  onChange={e => setCoexistRemark(e.target.value)}
                />
                <div className="flex justify-end mt-3 gap-2">
                  <button 
                    onClick={() => setShowCoexistInput(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-slate-300 text-xs font-medium"
                  >
                    取消
                  </button>
                  <button 
                    disabled={!coexistRemark.trim()}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-amber-900/20"
                  >
                    确认提交
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleRescan}
            disabled={isRescanning}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isRescanning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={16} />}
            修改后再体检
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Issue Navigator */}
        <div className="w-64 border-r border-slate-800/60 bg-slate-900/30 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-slate-800/60">
            <h2 className="text-sm font-bold text-slate-300">体检异常导航</h2>
            <p className="text-xs text-slate-500 mt-1">需处理 2 个高危冲突</p>
          </div>

          <div className="p-2 space-y-1">
            {/* Conflicts */}
            <div>
              <button 
                onClick={() => toggleNav('conflicts')}
                className="w-full flex items-center justify-between p-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  {expandedNav.includes('conflicts') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  同级冲突 (Conflicts)
                </div>
                <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded text-[10px] font-bold">1</span>
              </button>
              {expandedNav.includes('conflicts') && (
                <div className="pl-6 pr-2 py-1 space-y-1">
                  <button 
                    onClick={() => setActiveIssueId('R-042')}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors border ${
                      activeIssueId === 'R-042' 
                        ? 'bg-slate-800 border-slate-600 text-white' 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-rose-400">R-042</span>
                      <span className="text-[9px] px-1 bg-rose-500/20 text-rose-400 rounded">BLOCK</span>
                    </div>
                    <div className="truncate">采购金额审批阈值冲突</div>
                  </button>
                </div>
              )}
            </div>

            {/* Coverage */}
            <div>
              <button 
                onClick={() => toggleNav('coverage')}
                className="w-full flex items-center justify-between p-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  {expandedNav.includes('coverage') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  区间一致性 (Coverage)
                </div>
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-bold">1</span>
              </button>
              {expandedNav.includes('coverage') && (
                <div className="pl-6 pr-2 py-1 space-y-1">
                  <button 
                    onClick={() => setActiveIssueId('COV-001')}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors border ${
                      activeIssueId === 'COV-001' 
                        ? 'bg-slate-800 border-slate-600 text-white' 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-amber-400">COV-001</span>
                      <span className="text-[9px] px-1 bg-amber-500/20 text-amber-400 rounded">WARN</span>
                    </div>
                    <div className="truncate">逾期天数区间覆盖空白</div>
                  </button>
                </div>
              )}
            </div>

            {/* Policy Links */}
            <div>
              <button 
                onClick={() => toggleNav('policy')}
                className="w-full flex items-center justify-between p-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  {expandedNav.includes('policy') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  制度关联 (Policy)
                </div>
                <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">0</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Resolution Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950/50">
          <div className="p-6 border-b border-slate-800/60">
            <h2 className="text-lg font-bold text-white mb-4">处置方案画布 (Resolution Canvas)</h2>
            
            {/* Resolution Mode Switch */}
            <div className="flex p-1 bg-slate-900 border border-slate-700 rounded-lg w-fit">
              <button 
                onClick={() => setResolutionMode('replace')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  resolutionMode === 'replace' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                替换旧规则
              </button>
              <button 
                onClick={() => setResolutionMode('merge')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  resolutionMode === 'merge' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                合并规则
              </button>
              <button 
                onClick={() => setResolutionMode('boundary')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  resolutionMode === 'boundary' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                修改区间边界
              </button>
              <button 
                onClick={() => setResolutionMode('coexist')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  resolutionMode === 'coexist' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                增加并存例外
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Target Picker (Visible for Replace/Merge) */}
              {(resolutionMode === 'replace' || resolutionMode === 'merge') && (
                <section className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                    <ArrowRightLeft size={16} className="text-indigo-400" />
                    选择目标旧规则 (Target Picker)
                  </h3>
                  <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-700 rounded-lg">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs font-mono border border-slate-700">R-042</span>
                    <span className="text-sm text-slate-300">采购金额审批阈值校验</span>
                    <button className="ml-auto text-xs text-indigo-400 hover:text-indigo-300">更改目标</button>
                  </div>
                </section>
              )}

              {/* Boundary Editor (Visible for Boundary mode) */}
              {resolutionMode === 'boundary' && (
                <section className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-amber-400" />
                    区间边界重划 (Boundary Editor)
                  </h3>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="mb-4 text-xs text-slate-400">拖拽或输入数值以补齐空白区间 [90, 120)</div>
                    
                    {/* Visual Slider Mock */}
                    <div className="relative h-12 bg-slate-800 rounded-lg flex items-center px-2 mb-6">
                      <div className="absolute left-[0%] w-[30%] h-8 bg-slate-700 border border-slate-600 rounded flex items-center justify-center text-xs text-slate-400 opacity-50">
                        [0, 30)
                      </div>
                      <div className="absolute left-[30%] w-[60%] h-8 bg-slate-700 border border-slate-600 rounded flex items-center justify-center text-xs text-slate-400 opacity-50">
                        [30, 90)
                      </div>
                      
                      {/* Editable New Boundary */}
                      <div className="absolute left-[90%] w-[80%] h-8 bg-emerald-500/20 border border-emerald-500/50 rounded flex items-center justify-between px-2 text-xs text-emerald-400 cursor-ew-resize group">
                        <div className="w-1.5 h-4 bg-emerald-500 rounded-full group-hover:scale-y-150 transition-transform"></div>
                        <span className="font-bold">&gt;= 90 (原为 120)</span>
                        <div className="w-1.5 h-4 bg-emerald-500 rounded-full group-hover:scale-y-150 transition-transform"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">新规则下界 (Min)</label>
                        <div className="flex items-center gap-2">
                          <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50">
                            <option>&gt;=</option>
                            <option>&gt;</option>
                          </select>
                          <input type="number" defaultValue={90} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-cyan-500/50" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">新规则上界 (Max)</label>
                        <div className="flex items-center gap-2">
                          <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50">
                            <option>无上限</option>
                            <option>&lt;=</option>
                            <option>&lt;</option>
                          </select>
                          <input type="text" disabled placeholder="∞" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Editable Rule Builder */}
              <section className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <Network size={16} className="text-cyan-400" />
                  规则逻辑调整 (Editable Rule Builder)
                </h3>
                
                {/* IF */}
                <div className="mb-6">
                  <span className="inline-block px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-xs font-mono mb-3">IF</span>
                  <div className="space-y-3 pl-4 border-l-2 border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 grid grid-cols-12 gap-2">
                        <div className="col-span-4">
                          <input type="text" value="逾期天数" readOnly className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300" />
                        </div>
                        <div className="col-span-3">
                          <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-400 font-medium">
                            <option>&gt;=</option>
                            <option>&gt;</option>
                          </select>
                        </div>
                        <div className="col-span-5">
                          <input type="number" defaultValue={resolutionMode === 'boundary' ? 90 : 120} className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-sm transition-colors ${resolutionMode === 'boundary' ? 'border-emerald-500/50 text-emerald-400' : 'border-slate-700 text-slate-300'}`} />
                        </div>
                      </div>
                      <button className="p-2 text-slate-600 hover:text-rose-400 transition-all"><Trash2 size={16} /></button>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400 mt-2"><Plus size={14} /> 添加条件</button>
                  </div>
                </div>

                {/* THEN */}
                <div className="mb-6">
                  <span className="inline-block px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-xs font-mono mb-3">THEN</span>
                  <div className="space-y-3 pl-4 border-l-2 border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 grid grid-cols-12 gap-2">
                        <div className="col-span-3">
                          <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-400 font-medium">
                            <option>阻断 (BLOCK)</option>
                          </select>
                        </div>
                        <div className="col-span-9">
                          <input type="text" value="禁止发起新的采购申请" readOnly className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300" />
                        </div>
                      </div>
                      <button className="p-2 text-slate-600 hover:text-rose-400 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>

                {/* EXCEPTIONS */}
                {resolutionMode === 'coexist' && (
                  <div className="mb-2 animate-in fade-in slide-in-from-top-2">
                    <span className="inline-block px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-xs font-mono mb-3">UNLESS (例外)</span>
                    <div className="space-y-3 pl-4 border-l-2 border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 grid grid-cols-12 gap-2">
                          <div className="col-span-4">
                            <input type="text" placeholder="选择变量..." className="w-full bg-slate-950 border border-rose-500/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-rose-400" />
                          </div>
                          <div className="col-span-3">
                            <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-400 font-medium">
                              <option>等于 (==)</option>
                              <option>包含 (IN)</option>
                            </select>
                          </div>
                          <div className="col-span-5">
                            <input type="text" placeholder="输入值..." className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300" />
                          </div>
                        </div>
                        <button className="p-2 text-slate-600 hover:text-rose-400 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                )}
              </section>

            </div>
          </div>
        </div>

        {/* Right: Context Panel */}
        <div className="w-80 border-l border-slate-800/60 bg-slate-900/30 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-slate-800/60">
            <h2 className="text-sm font-bold text-slate-300">上下文参考 (Context Panel)</h2>
          </div>

          <div className="p-5 space-y-6">
            {/* Affected Rule Details */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" />
                受影响规则详情 (只读)
              </h3>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">R-102</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">现存规则</span>
                </div>
                <div className="text-sm font-medium text-slate-200 mb-3">逾期30-90天预警</div>
                <div className="space-y-2 font-mono text-xs text-slate-400 bg-slate-900 p-2 rounded">
                  <div><span className="text-slate-500">IF</span> 逾期天数 &gt;= 30 AND &lt; 90</div>
                  <div><span className="text-slate-500">THEN</span> <span className="text-amber-400">WARN</span> 采购总监</div>
                </div>
              </div>
            </section>

            {/* Policy Excerpt */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileSearch size={14} className="text-emerald-400" />
                制度条款摘录
              </h3>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-xs font-bold text-slate-400 mb-2">《供应商管理规范 v2.0》 第4.1条</div>
                <div className="text-xs text-slate-400 italic leading-relaxed border-l-2 border-emerald-500/50 pl-2">
                  "对于逾期交货超过90天的供应商，系统应自动冻结其交易权限，禁止发起新的采购申请，直至逾期问题解决并经采购VP特批。"
                </div>
                <div className="mt-3 text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  AI 提示：新规则阈值(120天)与制度要求(90天)不符。
                </div>
              </div>
            </section>

            {/* Historical Hits */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity size={14} className="text-indigo-400" />
                历史命中样本
              </h3>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 mb-3">过去 30 天内，[90, 120) 区间发生的真实业务数据：</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded">
                    <span className="text-slate-300">PO-202403-088</span>
                    <span className="text-rose-400 font-mono">逾期 105 天</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded">
                    <span className="text-slate-300">PO-202403-112</span>
                    <span className="text-rose-400 font-mono">逾期 98 天</span>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-500 text-center">
                  共 14 笔订单落入此空白区间
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
};
