import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Play, Check, MoreHorizontal, FileText, 
  Settings, ShieldCheck, AlertTriangle, CheckCircle2, XCircle,
  Copy, Trash2, Bot, User, Loader2, LayoutGrid, Network, 
  GitMerge, Zap, FileSearch, AlertCircle, Plus, X, ChevronDown
} from 'lucide-react';
import { RuleScanReportModal } from '../../components/rule-center/RuleScanReportModal';

type ScanStatus = 'NOT_SCANNED' | 'SCANNING' | 'PASS' | 'WARN' | 'BLOCK';

export const DraftEditorPage: React.FC = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  
  const [scanStatus, setScanStatus] = useState<ScanStatus>('NOT_SCANNED');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleScan = () => {
    setScanStatus('SCANNING');
    setTimeout(() => {
      setScanStatus('WARN');
      setIsReportModalOpen(true);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 animate-in fade-in duration-500">
      {/* Top Action Bar (Fixed) */}
      <div className="h-16 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/rule-center/drafts')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-medium flex items-center gap-1">
                <Bot size={10} /> Agent 推荐
              </span>
              <span className="text-xs text-slate-500 font-mono">{draftId || 'D-002'}</span>
            </div>
            <h1 className="text-lg font-bold text-white mt-0.5">差旅标准动态调整</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700">
            <Save size={16} />
            保存草稿
          </button>
          <button 
            onClick={handleScan}
            disabled={scanStatus === 'SCANNING'}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {scanStatus === 'SCANNING' ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            规则一致性扫描
          </button>
          
          <div className="relative group">
            <button 
              disabled={scanStatus !== 'PASS'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                scanStatus === 'PASS' 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Check size={16} />
              审核通过 / 入库
            </button>
            {scanStatus !== 'PASS' && (
              <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-slate-800 text-slate-300 text-xs rounded shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                入库前必须先完成体检扫描且结果为 PASS。
              </div>
            )}
          </div>
          
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="更多">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Scanning Overlay */}
        {scanStatus === 'SCANNING' && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-md text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                <Loader2 size={48} className="text-indigo-400 animate-spin relative z-10" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">AI 正在进行全库一致性与兼容性扫描...</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                正在比对 1,284 条现存规则，分析逻辑冲突、变量映射完整度与全局影响面。
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-indigo-500 w-2/3 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Center: Main Edit Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            
            {/* Section A: Basic Info */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-bold text-slate-300 mb-5 flex items-center gap-2">
                <Settings size={16} className="text-cyan-400" />
                Section A：基础信息
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-2">规则名称</label>
                  <input 
                    type="text" 
                    defaultValue="差旅标准动态调整"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">检测域 / 分类 (Domain)</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 appearance-none">
                    <option>财务合规</option>
                    <option>风险控制</option>
                    <option>销售合规</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">规则群 (Group ID)</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 appearance-none">
                    <option>费用合规群 (GRP-FIN-01)</option>
                    <option>准入控制群 (GRP-RISK-02)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-2">规则来源</label>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-400">
                    <Bot size={16} className="text-indigo-400" />
                    Agent 推荐 (基于《2024版差旅管理办法》第3.2条自动提取)
                  </div>
                </div>
              </div>
            </section>

            {/* Section B: Scope Builder */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-bold text-slate-300 mb-5 flex items-center gap-2">
                <LayoutGrid size={16} className="text-emerald-400" />
                Section B：生效范围 (Scope Builder)
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">适用组织 (Org)</label>
                  <div className="flex flex-wrap gap-2 p-2 min-h-[42px] bg-slate-950 border border-slate-700 rounded-lg">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                      全集团 <X size={12} className="cursor-pointer hover:text-white" />
                    </span>
                    <button className="px-2 py-1 text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1">
                      <Plus size={12} /> 添加
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">业务对象 / 合同类型</label>
                  <div className="flex flex-wrap gap-2 p-2 min-h-[42px] bg-slate-950 border border-slate-700 rounded-lg">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                      差旅报销单 <X size={12} className="cursor-pointer hover:text-white" />
                    </span>
                    <button className="px-2 py-1 text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1">
                      <Plus size={12} /> 添加
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">触发生命周期节点</label>
                  <div className="flex flex-wrap gap-2 p-2 min-h-[42px] bg-slate-950 border border-slate-700 rounded-lg">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                      提交审批时 <X size={12} className="cursor-pointer hover:text-white" />
                    </span>
                    <button className="px-2 py-1 text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1">
                      <Plus size={12} /> 添加
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">接入系统</label>
                  <div className="flex flex-wrap gap-2 p-2 min-h-[42px] bg-slate-950 border border-slate-700 rounded-lg">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                      费控系统 (FMS) <X size={12} className="cursor-pointer hover:text-white" />
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section C: Condition Builder (IF) */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Network size={16} className="text-indigo-400" />
                  Section C：触发条件 (Condition Builder)
                </h2>
                <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-xs font-mono">IF</span>
              </div>
              
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-slate-400">满足以下</span>
                  <select className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-emerald-400 font-medium focus:outline-none focus:border-cyan-500/50">
                    <option>所有 (ALL)</option>
                    <option>任意 (ANY)</option>
                    <option>不满足 (NOT)</option>
                  </select>
                  <span className="text-sm text-slate-400">条件：</span>
                </div>

                <div className="space-y-3 pl-4 border-l-2 border-slate-800">
                  {/* Condition 1 */}
                  <div className="flex items-center gap-3 group">
                    <div className="flex-1 grid grid-cols-12 gap-2">
                      <div className="col-span-4 relative">
                        <input type="text" value="出差目的地" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 cursor-pointer" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="已映射到字典"></span>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-400 font-medium appearance-none">
                          <option>包含 (IN)</option>
                          <option>等于 (==)</option>
                        </select>
                      </div>
                      <div className="col-span-5">
                        <input type="text" value="一线城市 (北上广深)" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300" />
                      </div>
                    </div>
                    <button className="p-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Condition 2 */}
                  <div className="flex items-center gap-3 group">
                    <div className="flex-1 grid grid-cols-12 gap-2">
                      <div className="col-span-4 relative">
                        <input type="text" value="出差时间" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 cursor-pointer" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="已映射到字典"></span>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-400 font-medium appearance-none">
                          <option>重叠 (OVERLAPS)</option>
                          <option>包含 (CONTAINS)</option>
                        </select>
                      </div>
                      <div className="col-span-5">
                        <input type="text" value="法定节假日" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300" />
                      </div>
                    </div>
                    <button className="p-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <button className="flex items-center gap-1 text-sm text-cyan-500 hover:text-cyan-400 mt-2 transition-colors">
                    <Plus size={14} /> 添加条件
                  </button>
                </div>
              </div>
            </section>

            {/* Section D: Action Builder (THEN) */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Zap size={16} className="text-amber-400" />
                  Section D：执行动作 (Action Builder)
                </h2>
                <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-xs font-mono">THEN</span>
              </div>
              
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-3 group">
                  <div className="flex-1 grid grid-cols-12 gap-2">
                    <div className="col-span-3">
                      <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-400 font-medium appearance-none">
                        <option>修改变量 (MODIFY)</option>
                        <option>阻断 (BLOCK)</option>
                        <option>预警 (WARN)</option>
                        <option>路由审批 (ROUTE)</option>
                      </select>
                    </div>
                    <div className="col-span-4 relative">
                      <input type="text" value="住宿标准上限" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 cursor-pointer" />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="已映射到字典"></span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 appearance-none">
                        <option>上浮 (+%)</option>
                        <option>下调 (-%)</option>
                        <option>设为 (=)</option>
                      </select>
                    </div>
                    <div className="col-span-3 relative">
                      <input type="number" value="15" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 pr-8" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">%</span>
                    </div>
                  </div>
                  <button className="p-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
                <button className="flex items-center gap-1 text-sm text-cyan-500 hover:text-cyan-400 mt-4 transition-colors">
                  <Plus size={14} /> 添加动作
                </button>
              </div>
            </section>

            {/* Section E: Exceptions */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <GitMerge size={16} className="text-rose-400" />
                  Section E：例外情况 (Exceptions)
                </h2>
                <span className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-xs font-mono">UNLESS</span>
              </div>
              
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 border-dashed">
                <div className="flex items-center gap-3 group">
                  <div className="flex-1 grid grid-cols-12 gap-2">
                    <div className="col-span-4 relative">
                      <input type="text" value="随行人员职级" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 cursor-pointer" />
                    </div>
                    <div className="col-span-3">
                      <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-400 font-medium appearance-none">
                        <option>包含 (IN)</option>
                      </select>
                    </div>
                    <div className="col-span-5">
                      <input type="text" value="公司高管 (VP及以上)" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300" />
                    </div>
                  </div>
                  <button className="p-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </section>

            {/* Section F: Source & Evidence */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-bold text-slate-300 mb-5 flex items-center gap-2">
                <FileSearch size={16} className="text-slate-400" />
                Section F：来源与证据 (Source & Evidence)
              </h2>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs border border-slate-700">制度条款锚点</span>
                  <span className="text-sm text-slate-300">《2024版差旅管理办法》 第3.2条 特殊情况说明</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-700/50 rounded text-sm text-slate-400 italic leading-relaxed border-l-4 border-l-slate-600">
                  "对于前往北京、上海、广州、深圳等一线城市出差的员工，若出差期间跨越国家法定节假日，考虑到酒店价格普遍上涨，其住宿报销标准上限可在原标准基础上上浮15%。但若有VP及以上级别高管随行，则按高管标准实报实销，不适用此上浮比例。"
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Right: AI & Risk Sidebar */}
        <div className="w-80 border-l border-slate-800/60 bg-slate-900/30 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-5 border-b border-slate-800/60">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-cyan-400" />
              体检与风险状态
            </h3>
            
            {/* Scan Status Card */}
            {scanStatus === 'NOT_SCANNED' && (
              <div className="p-4 border-2 border-dashed border-slate-700 bg-slate-800/30 rounded-xl text-center">
                <ShieldCheck size={28} className="mx-auto text-slate-500 mb-2" />
                <div className="text-sm font-bold text-slate-300 mb-1">未扫描</div>
                <div className="text-xs text-slate-500">入库前必须先体检扫描</div>
              </div>
            )}

            {scanStatus === 'WARN' && (
              <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-xl animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                  <AlertTriangle size={20} />
                  发现异常 (WARN)
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  存在逻辑冲突，建议在入库前进行人工确认或修改。
                </div>
              </div>
            )}

            {scanStatus === 'PASS' && (
              <div className="p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-xl animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                  <CheckCircle2 size={20} />
                  通过 (PASS)
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  无冲突，逻辑严密，可直接入库。
                </div>
              </div>
            )}
          </div>

          {/* Health Warning Summary (Only show if scanned) */}
          {scanStatus === 'WARN' && (
            <div className="p-5 border-b border-slate-800/60 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">体检预警摘要</h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-slate-200 mb-1">逻辑冲突：R-001</div>
                      <div className="text-xs text-slate-400 leading-relaxed">
                        与现存规则 <span className="text-cyan-400">R-001 (费用报销额度校验)</span> 存在重叠。R-001 硬性规定了绝对值上限，未考虑上浮。
                      </div>
                      <button 
                        onClick={() => setIsReportModalOpen(true)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 font-medium"
                      >
                        查看冲突报告 &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Evidence Chain & Completeness */}
          <div className="p-5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">完整度检查</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">变量语义映射</span>
                  <span className="text-emerald-400">3/3 完整</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-slate-300">出差目的地</span>
                    <span className="text-slate-500 font-mono ml-auto">dict.city_tier</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-slate-300">出差时间</span>
                    <span className="text-slate-500 font-mono ml-auto">sys.travel_date</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-slate-300">住宿标准上限</span>
                    <span className="text-slate-500 font-mono ml-auto">var.hotel_limit</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-800/60">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">单位与阈值检查</span>
                  <span className="text-emerald-400">100%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="text-slate-300">上浮比例 (15%) 格式正确</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <RuleScanReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        status={scanStatus === 'WARN' || scanStatus === 'BLOCK' ? scanStatus : undefined}
      />
    </div>
  );
};
