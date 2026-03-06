import React from 'react';
import {
    ShieldCheck, Share2, Calculator, Clock, AlertTriangle, MoreHorizontal, Sparkles, Brain, ChevronDown, Database, BarChart3, RefreshCw, CheckCircle2, X, Wand2, ChevronRight, AlertCircle
} from 'lucide-react';
import { FieldItem } from '../types';
import { typeMap, roleMap, riskMap } from '../constants';

interface CanvasProps {
    currentField: FieldItem;
    setShowHistory: (val: boolean) => void;
    setActiveDrawer: (drawer: any) => void;
    handleConfirmTop1: () => void;
    handleAcceptTop2: () => void;
    setIsEditing: (val: boolean) => void;
    isSaving: boolean;
}

export const DecisionCanvas: React.FC<CanvasProps> = ({
    currentField,
    setShowHistory,
    setActiveDrawer,
    handleConfirmTop1,
    handleAcceptTop2,
    setIsEditing,
    isSaving
}) => {
    return (
        <main className="flex-1 flex flex-col bg-slate-950 min-w-0 border-r border-slate-800 overflow-y-auto custom-scrollbar">
            {/* C1 FieldHeader */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-mono font-bold text-white">{currentField.name}</h2>
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs font-mono">{currentField.dataType}</span>
                        <span className="text-slate-600">@</span>
                        <span className="text-sm text-slate-400 font-medium">{currentField.table}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {[
                        { label: 'KeyCandidate', icon: <ShieldCheck size={12} />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                        { label: 'UsedAsJoin', icon: <Share2 size={12} />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                        { label: 'UsedAsAgg', icon: <Calculator size={12} />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                        { label: 'TimeFilter', icon: <Clock size={12} />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                        { label: 'PII', icon: <AlertTriangle size={12} />, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
                    ].map(badge => (
                        <div key={badge.label} className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border ${badge.color}`}>
                            {badge.icon}
                            {badge.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* C2 CurrentDecisionStrip */}
            <div className="px-6 py-3 bg-indigo-500/5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="text-xs text-slate-500">当前裁决:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{typeMap[currentField.type] || currentField.type}</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-sm font-bold text-white">{roleMap[currentField.role] || currentField.role}</span>
                        <span className="text-xs text-slate-400 ml-2">({currentField.name === 'order_id' ? '订单ID' : '字段业务名'})</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-slate-500 border border-slate-700">
                        来源: 系统
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowHistory(true)} className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors">回滚</button>
                    <div className="w-px h-3 bg-slate-800"></div>
                    <button onClick={() => setShowHistory(true)} className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors">审计日志</button>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* C3 PackageRecommendationArea */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={14} className="text-indigo-400" />
                            AI 推荐方案 (Packages)
                        </h3>
                        <span className="text-[10px] text-slate-600">基于 L2 语义引擎推断</span>
                    </div>

                    <div className="space-y-4">
                        {/* Top1PackageCard (Large) */}
                        <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-bl-xl">
                                TOP 1 推荐方案
                            </div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-white">{typeMap[currentField.type] || currentField.type}</span>
                                        <span className="text-slate-600 text-xl">/</span>
                                        <span className="text-xl font-bold text-white">{roleMap[currentField.role] || currentField.role}</span>
                                    </div>
                                    <p className="text-lg font-bold text-indigo-400">{currentField.name === 'order_id' ? '订单主键 ID' : '业务名称'}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-mono font-bold text-emerald-400">{(currentField.confidence * 100).toFixed(0)}%</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">置信度</div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                该字段在表 {currentField.table} 中表现为唯一标识符，且符合标准模型中的订单主键定义。
                                画像显示其基数与行数完全一致，且被多个下游视图作为关联键使用。
                            </p>

                            <div className="flex items-center gap-2 mb-8">
                                {['Join', 'Filter', 'KeyField'].map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-700">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleConfirmTop1}
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                    确认并应用此方案
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all border border-slate-700"
                                >
                                    编辑详情
                                </button>
                            </div>
                        </div>

                        {/* Top2PackageCard (Small) */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:bg-slate-900/60 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                                    <Brain size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-200">维度 / 代码</span>
                                        <span className="text-[10px] text-slate-500 font-mono">65% 置信度</span>
                                    </div>
                                    <p className="text-xs text-slate-500">备选方案：作为普通维度代码处理</p>
                                </div>
                            </div>
                            <button
                                onClick={handleAcceptTop2}
                                disabled={isSaving}
                                className="px-3 py-1.5 text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all disabled:opacity-50"
                            >
                                切换到此方案
                            </button>
                        </div>

                        {/* MoreCandidatesAccordion */}
                        <button
                            onClick={() => setActiveDrawer('CANDIDATES')}
                            className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest"
                        >
                            <ChevronDown size={14} />
                            查看更多备选方案 (3)
                        </button>
                    </div>
                </section>

                {/* C4 KeyEvidenceTop3 */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            核心推断证据 (Top 3)
                        </h3>
                        <button
                            onClick={() => setActiveDrawer('ALL_EVIDENCE')}
                            className="text-[10px] font-bold text-indigo-400 hover:underline"
                        >
                            查看全维度证据列表
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { title: '元数据对齐', icon: <Database size={16} />, source: 'RULE', contribution: 45, signals: ['Name: 98%', 'Type: Match'] },
                            { title: '数据画像特征', icon: <BarChart3 size={16} />, source: 'LLM', contribution: 32, signals: ['Unique: 100%', 'Null: 0%'] },
                            { title: '血缘关联拓扑', icon: <Share2 size={16} />, source: 'RULE', contribution: 18, signals: ['Join: 12 times', 'Downstream: 5'] },
                        ].map((ev, i) => (
                            <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="p-1.5 bg-slate-800 rounded-lg text-slate-400 group-hover:text-indigo-400 transition-colors">
                                        {ev.icon}
                                    </div>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${ev.source === 'RULE' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                        {ev.source === 'RULE' ? '规则' : '模型'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-200">{ev.title}</p>
                                    <p className="text-[10px] text-emerald-400 font-bold mt-1">+{ev.contribution}% 贡献度</p>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {ev.signals.map(s => (
                                        <span key={s} className="text-[9px] text-slate-500 font-mono bg-slate-950 px-1 rounded">{s}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setActiveDrawer('EVIDENCE')}
                                    className="w-full pt-2 border-t border-slate-800 text-[9px] font-bold text-slate-600 group-hover:text-slate-400 flex items-center justify-center gap-1"
                                >
                                    展开详情 <ChevronRight size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* C5 ImpactAndNext */}
                <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">影响分析与评估</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        确认后将自动关联至 <span className="text-indigo-400 font-bold">零售交易对象</span>，并支持 12 个相关指标的自动计算。
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        门禁预估：<span className="text-emerald-400 font-bold">MUST 冲突 -1</span>，覆盖率预计提升至 <span className="text-emerald-400 font-bold">94.5%</span>。
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">快速操作</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-all flex items-center gap-2">
                                    <Wand2 size={12} /> 应用到相似 (5)
                                </button>
                                <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-all flex items-center gap-2">
                                    <Clock size={12} /> 标记待复核
                                </button>
                                <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-all flex items-center gap-2">
                                    <AlertCircle size={12} /> 降级为未知
                                </button>
                                <button className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-[10px] font-bold border border-rose-500/20 transition-all flex items-center gap-2">
                                    <X size={12} /> 设为忽略
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};
