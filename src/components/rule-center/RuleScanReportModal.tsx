import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, AlertTriangle, ShieldCheck, Download, FileText, LayoutGrid, 
  Network, Zap, GitMerge, FileSearch, CheckCircle2, AlertCircle,
  ArrowRight, Bot, Link, ArrowRightLeft
} from 'lucide-react';

interface RuleScanReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanId?: string;
  scanTime?: string;
  status?: 'WARN' | 'BLOCK';
  draftId?: string;
}

export const RuleScanReportModal: React.FC<RuleScanReportModalProps> = ({
  isOpen,
  onClose,
  scanId = 'SCN-20240321-001',
  scanTime = '2024-03-21 10:35:12',
  status = 'WARN',
  draftId = 'D-002'
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'conflicts' | 'duplicates' | 'coverage' | 'policy'>('conflicts');
  const [coexistRemark, setCoexistRemark] = useState('');
  const [showCoexistInput, setShowCoexistInput] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[95vw] h-[95vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${status === 'WARN' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI 规则体检报告
                <span className={`px-2 py-0.5 rounded text-xs font-mono border ${
                  status === 'WARN' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {status}
                </span>
              </h2>
              <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-3">
                <span>Scan ID: {scanId}</span>
                <span>Time: {scanTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700">
              <Download size={16} />
              导出报告 (PDF)
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body: Left-Right Split */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: New Rule Panel */}
          <div className="w-1/3 min-w-[400px] border-r border-slate-800 bg-slate-900/30 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <FileText size={16} className="text-cyan-400" />
                拟入库新规则 (New Rule)
              </h3>
            </div>
            
            <div className="p-5 space-y-6">
              {/* Scope */}
              <section>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <LayoutGrid size={14} /> Scope 摘要
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">全集团</span>
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">差旅报销单</span>
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">提交审批时</span>
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">费控系统(FMS)</span>
                </div>
              </section>

              {/* IF Condition */}
              <section>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Network size={14} /> IF 条件
                </h4>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2 font-mono text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-12 shrink-0">AND</span>
                    <span className="text-emerald-400">出差目的地 IN ('北京', '上海', '广州', '深圳')</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-12 shrink-0">AND</span>
                    <span className="text-emerald-400">出差时间 OVERLAPS 法定节假日</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-400 italic border-l-2 border-slate-700 pl-2">
                  原文: 若出差目的地为"一线城市"（北上广深），且出差时间包含法定节假日...
                </div>
              </section>

              {/* THEN Action */}
              <section>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap size={14} /> THEN 动作
                </h4>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold w-16 shrink-0">MODIFY</span>
                    <span className="text-cyan-400">住宿标准上限 = 住宿标准上限 * 1.15</span>
                  </div>
                </div>
              </section>

              {/* Exceptions */}
              <section>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <GitMerge size={14} /> 例外 Exceptions
                </h4>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg border-dashed font-mono text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold w-16 shrink-0">UNLESS</span>
                    <span className="text-slate-300">随行人员职级 IN ('公司高管 (VP及以上)')</span>
                  </div>
                </div>
              </section>

              {/* Source */}
              <section>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileSearch size={14} /> 来源
                </h4>
                <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500/5 border border-indigo-500/20 rounded-lg text-xs text-indigo-300">
                  <Bot size={14} />
                  Agent 推荐 (基于《2024版差旅管理办法》第3.2条自动提取)
                </div>
              </section>
            </div>
          </div>

          {/* Right: Impact Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-900/80 px-4 shrink-0">
              <button
                onClick={() => setActiveTab('conflicts')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'conflicts' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                同级冲突 (Conflicts)
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px]">2</span>
              </button>
              <button
                onClick={() => setActiveTab('duplicates')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'duplicates' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                同级重复 (Duplicates)
              </button>
              <button
                onClick={() => setActiveTab('coverage')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'coverage' ? 'border-indigo-400 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                上位规则关联与一致性
                <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[10px]">1</span>
              </button>
              <button
                onClick={() => setActiveTab('policy')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'policy' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                制度文件关联
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px]">1</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 flex overflow-hidden">
              {activeTab === 'conflicts' && (
                <>
                  {/* Left List: IssueList */}
                  <div className="w-64 border-r border-slate-800 bg-slate-900/30 overflow-y-auto custom-scrollbar p-3">
                    {/* BLOCK issue */}
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg cursor-pointer mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-rose-400">R-042</span>
                        <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded text-[10px] font-bold">BLOCK</span>
                      </div>
                      <div className="text-sm font-medium text-slate-200">采购金额审批阈值冲突</div>
                      <div className="text-[10px] text-slate-500 mt-2">检测类型: 同级冲突 (阈值)</div>
                    </div>
                    {/* WARN issue */}
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-amber-400">R-088</span>
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-bold">WARN</span>
                      </div>
                      <div className="text-sm font-medium text-slate-200">诉讼管辖地拦截规则</div>
                      <div className="text-[10px] text-slate-500 mt-2">检测类型: 同级冲突 (语义等价)</div>
                    </div>
                  </div>
                  {/* Right Detail Diff: DiffViewer */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="mb-6 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">逻辑冲突分析</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          检测到新规则与现存规则在条件阈值和语义表述上存在潜在冲突，可能导致执行结果不一致。
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          onClose();
                          navigate(`/rule-center/workbench/${draftId}?scanId=${scanId}`);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shrink-0 shadow-lg shadow-indigo-900/20"
                      >
                        进入工作台处置
                        <ArrowRight size={16} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Scenario A: Threshold Diff */}
                      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="p-3 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-300">条件 Diff (阈值冲突)</span>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-4">
                          <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                            <div className="text-xs text-slate-500 mb-1">现存规则 R-042</div>
                            <div className="font-mono text-sm text-rose-400 line-through decoration-rose-500/50">采购金额 &gt; 100,000 元</div>
                          </div>
                          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                            <div className="text-xs text-slate-500 mb-1">拟入库新规则</div>
                            <div className="font-mono text-sm text-emerald-400">采购金额 &gt; 150,000 元</div>
                          </div>
                        </div>
                      </div>

                      {/* Scenario B: Semantic Equivalence */}
                      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="p-3 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-300">语义等价提示</span>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                            <div className="flex-1">
                              <div className="text-xs text-slate-500 mb-1">现存规则 R-088</div>
                              <div className="font-mono text-sm text-slate-300">诉讼地 == '丰台区人民法院'</div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-amber-400 px-4">
                              <ArrowRightLeft size={20} className="mb-1" />
                              <span className="text-[10px] font-bold">语义等价 (98%)</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-slate-500 mb-1">拟入库新规则</div>
                              <div className="font-mono text-sm text-slate-300">诉讼地 == '丰台'</div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-3 italic">
                            AI 提示："丰台" 与 "丰台区人民法院" 在当前上下文中被判定为高度语义等价，可能导致规则重复触发或逻辑覆盖。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'duplicates' && (
                <div className="flex-1 flex items-center justify-center text-slate-500 flex-col">
                  <CheckCircle2 size={48} className="mb-4 opacity-20" />
                  <p>未检测到同级重复规则</p>
                </div>
              )}

              {activeTab === 'coverage' && (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  {/* CoverageTimeline */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-2">上位规则关联与区间一致性</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      检测到当前规则群存在数值区间覆盖空白。
                    </p>
                  </div>
                  <div className="p-6 bg-slate-900 border border-slate-700 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-300 mb-6">逾期天数 (Days) 规则覆盖视图</h4>
                    <div className="relative h-12 bg-slate-800 rounded-lg flex items-center px-2">
                      {/* Existing Band 1 */}
                      <div className="absolute left-[0%] w-[30%] h-8 bg-slate-700 border border-slate-600 rounded flex items-center justify-center text-xs text-slate-300" title="R-101: [0, 30)">
                        [0, 30)
                      </div>
                      {/* Existing Band 2 */}
                      <div className="absolute left-[30%] w-[60%] h-8 bg-slate-700 border border-slate-600 rounded flex items-center justify-center text-xs text-slate-300" title="R-102: [30, 90)">
                        [30, 90)
                      </div>
                      {/* Blank Interval Highlight */}
                      <div className="absolute left-[90%] w-[30%] h-8 bg-amber-500/20 border-2 border-dashed border-amber-500/50 rounded flex items-center justify-center text-xs text-amber-400 font-bold" title="空白区间: [90, 120)">
                        空白区间: [90, 120)
                      </div>
                      {/* New Rule Band */}
                      <div className="absolute left-[120%] w-[80%] h-8 bg-emerald-500/20 border border-emerald-500/50 rounded flex items-center justify-center text-xs text-emerald-400" title="New Rule: >= 120">
                        &gt;= 120
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                      <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-300">
                        <span className="font-bold text-amber-400">发现覆盖漏洞：</span>
                        新规则定义了 <code className="text-cyan-400 bg-slate-800 px-1 rounded">&gt;= 120</code> 天的处置动作，但现存规则最高仅覆盖到 <code className="text-cyan-400 bg-slate-800 px-1 rounded">90</code> 天。区间 <code className="text-amber-400 bg-amber-500/20 px-1 rounded">[90, 120)</code> 将处于无规则管控状态。建议补充该区间的规则。
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'policy' && (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  {/* PolicyEvidenceCard */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-2">制度文件关联</h3>
                  </div>
                  <div className="p-5 bg-slate-900 border border-slate-700 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-200">《2024版差旅管理办法》</div>
                        <div className="text-xs text-slate-500">命中制度文档名</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">条款定位</div>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-400 italic leading-relaxed border-l-4 border-l-emerald-500/50">
                        "第3.2条 特殊情况说明：对于前往北京、上海、广州、深圳等一线城市出差的员工，若出差期间跨越国家法定节假日，考虑到酒店价格普遍上涨，其住宿报销标准上限可在原标准基础上上浮15%。"
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-indigo-300">
                        <Link size={16} />
                        建议建立追溯关系，以便未来制度更新时自动预警此规则。
                      </div>
                      <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition-colors">
                        确认关联
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: 4 Actions */}
        <div className="h-24 border-t border-slate-800 bg-slate-900 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Action 1: Replace Old Rule */}
            <div className="flex flex-col">
              <button 
                onClick={() => {
                  onClose();
                  navigate(`/rule-center/workbench/${draftId}?scanId=${scanId}`);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-sm font-medium transition-colors"
              >
                替换旧规则
              </button>
              <span className="text-[10px] text-slate-500 mt-1 text-center">选择并覆盖旧规则</span>
            </div>

            {/* Action 2: Reject/Modify */}
            <div className="flex flex-col">
              <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-sm font-medium transition-colors">
                驳回 / 修改新规则
              </button>
              <span className="text-[10px] text-slate-500 mt-1 text-center">返回编辑页修改</span>
            </div>

            {/* Action 3: Coexist & Publish */}
            <div className="flex flex-col relative">
              <button 
                onClick={() => setShowCoexistInput(!showCoexistInput)}
                className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-lg text-sm font-medium transition-colors"
              >
                并存入库
              </button>
              <span className="text-[10px] text-slate-500 mt-1 text-center">需填写例外备注</span>
              
              {showCoexistInput && (
                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl animate-in slide-in-from-bottom-2">
                  <label className="block text-xs font-medium text-slate-300 mb-2">例外场景备注 (必填)</label>
                  <textarea 
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 resize-none" 
                    rows={3}
                    placeholder="请说明为何允许冲突规则并存..."
                    value={coexistRemark}
                    onChange={e => setCoexistRemark(e.target.value)}
                  />
                  <button 
                    disabled={!coexistRemark.trim()}
                    className="mt-2 w-full py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
                  >
                    确认并存入库
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action 4: Confirm Association & Publish (Recommended) */}
          <div className="flex flex-col items-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-emerald-900/20">
              <CheckCircle2 size={16} />
              确认关联并入库
            </button>
            <span className="text-[10px] text-emerald-400/70 mt-1">推荐：无逻辑冲突，仅关联命中</span>
          </div>
        </div>

      </div>
    </div>
  );
};
