import React from 'react';
import {
    X, Database, Info, BarChart3, Share2, List, Book, History as HistoryIcon, ShieldCheck, Brain, CheckCircle2, ChevronRight, RefreshCw, Sparkles, ArrowRight, Wand2, Clock, AlertCircle, AlertTriangle
} from 'lucide-react';
import { FieldItem, HistoryEntry } from '../types';
import { typeMap, roleMap, queueMap } from '../constants';

interface DrawerModalsProps {
    activeDrawer: string | null;
    setActiveDrawer: (drawer: any) => void;
    activeModal: string | null;
    setActiveModal: (modal: any) => void;
    currentField: FieldItem;
    fields: FieldItem[];
    handleFieldSelect: (id: string) => void;
    handleSwitchPlan: (type: string, role: string) => void;
    isSaving: boolean;
    selectedIds: string[];
    showHistory: boolean;
    setShowHistory: (val: boolean) => void;
    historyMap: Record<string, HistoryEntry[]>;
    handleRollback: (snapshot: FieldItem) => void;
}

export const DrawerModals: React.FC<DrawerModalsProps> = ({
    activeDrawer,
    setActiveDrawer,
    activeModal,
    setActiveModal,
    currentField,
    fields,
    handleFieldSelect,
    handleSwitchPlan,
    isSaving,
    selectedIds,
    showHistory,
    setShowHistory,
    historyMap,
    handleRollback
}) => {
    return (
        <>
            {/* EvidenceDrawer (Single Evidence Detail) */}
            {activeDrawer === 'EVIDENCE' && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setActiveDrawer(null)}></div>
                    <div className="relative w-[500px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">元数据对齐证据</h3>
                                    <p className="text-xs text-slate-500">维度: Metadata Alignment</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">推断结论</span>
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold">置信度: 98%</span>
                                </div>
                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                                    <p className="text-sm font-bold text-slate-200">字段名 {currentField.name} 与标准库中的 {currentField.name === 'order_id' ? '订单ID' : '标准字段'} 语义高度匹配</p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">关键信号 (信号)</span>
                                <div className="space-y-2">
                                    {[{ label: '名称相似度', value: '0.98', desc: '编辑距离与语义嵌入' }, { label: '类型兼容性', value: '匹配', desc: 'BIGINT 匹配标准 INTEGER/LONG' }].map(s => (
                                        <div key={s.label} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-300">{s.label}</span>
                                                <span className="text-[10px] text-slate-500">{s.desc}</span>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-indigo-400">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* CandidatesDrawer */}
            {activeDrawer === 'CANDIDATES' && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setActiveDrawer(null)}></div>
                    <div className="relative w-[480px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <Brain className="text-indigo-400" size={20} />
                                <h2 className="text-lg font-bold text-white">语义备选方案列表</h2>
                            </div>
                            <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {[
                                { type: 'ID', role: 'PK', conf: 0.98, desc: 'Top 1: 订单主键，具有极高的唯一性和业务关联度。' },
                                { type: 'DIM', role: 'CODE', conf: 0.65, desc: 'Top 2: 业务代码，作为普通维度属性进行切分。' },
                            ].map((cand, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 bg-slate-950 border rounded-xl space-y-3 transition-all ${currentField.type === cand.type && currentField.role === cand.role ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-bold text-slate-200">{typeMap[cand.type] || cand.type} / {roleMap[cand.role] || cand.role}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${cand.conf * 100}%` }}></div>
                                                </div>
                                                <span className="text-[10px] text-slate-500">{(cand.conf * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                        {currentField.type === cand.type && currentField.role === cand.role ? (
                                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold"><CheckCircle2 size={12} /> 当前应用</span>
                                        ) : (
                                            <button onClick={() => handleSwitchPlan(cand.type, cand.role)} disabled={isSaving} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 disabled:opacity-50">
                                                切换到此方案
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500">{cand.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* BatchPreviewModal */}
            {activeModal === 'BATCH_PREVIEW' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal(null)}></div>
                    <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">批量裁决预览</h3>
                                    <p className="text-xs text-slate-500">正在对 {selectedIds.length} 个字段进行批量确认</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            <div className="border border-slate-800 rounded-2xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                                        <tr><th className="px-4 py-3 font-bold">字段名</th><th className="px-4 py-3 font-bold">当前决策</th><th className="px-4 py-3 font-bold"></th><th className="px-4 py-3 font-bold">更新后决策</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {fields.filter(f => selectedIds.includes(f.id)).map(f => (
                                            <tr key={f.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 font-mono text-slate-300">{f.name}</td>
                                                <td className="px-4 py-3 text-slate-500">未知</td>
                                                <td className="px-4 py-3"><ArrowRight size={12} className="text-slate-600" /></td>
                                                <td className="px-4 py-3 font-bold text-emerald-400">{typeMap[f.type] || f.type} / {roleMap[f.role] || f.role}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-4">
                            <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-bold border border-slate-700">取消</button>
                            <button className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2"><CheckCircle2 size={18} /> 确认提交变更</button>
                        </div>
                    </div>
                </div>
            )}

            {/* HistoryModal */}
            {showHistory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowHistory(false)}></div>
                    <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                                    <HistoryIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">审计日志与回滚</h3>
                                    <p className="text-xs text-slate-500 mt-1">字段: {currentField?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar space-y-6">
                            <div className="relative border-l border-slate-800 ml-4 space-y-6 pb-4">
                                {(historyMap[currentField.id] || []).map((entry, idx) => (
                                    <div key={entry.id} className="relative pl-6">
                                        <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-900 border-2 border-indigo-500"></div>
                                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-bold text-slate-200">{entry.action}</span>
                                                <span className="text-[10px] text-slate-500 font-mono">{entry.timestamp}</span>
                                            </div>
                                            {Object.keys(entry.changes).length > 0 && (
                                                <div className="mt-3 space-y-2 bg-slate-950 rounded-lg p-3 border border-slate-800/50">
                                                    {Object.entries(entry.changes).map(([key, val]: any) => (
                                                        <div key={key} className="flex items-center gap-2 text-xs">
                                                            <span className="text-slate-500 w-12">{key}:</span>
                                                            <span className="text-rose-400 line-through">{val.from}</span>
                                                            <ArrowRight size={12} className="text-slate-600" />
                                                            <span className="text-emerald-400">{val.to}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {idx !== 0 && (
                                                <div className="mt-4 flex justify-end">
                                                    <button onClick={() => handleRollback(entry.snapshot)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1.5"><HistoryIcon size={12} /> 回滚至此版本</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* GateDrawer */}
            {activeDrawer === 'GATE' && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setActiveDrawer(null)}></div>
                    <div className="relative w-[500px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={20} className="text-rose-400" />
                                <h3 className="text-lg font-bold text-white">质量门禁检测结果</h3>
                            </div>
                            <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                            {[
                                { type: 'MUST', title: '维度基数检查不匹配', desc: '字段 base_id 被标注为维度，但其基数 (Cardinality) 高达 100%，建议调整为标识 (ID)。', status: 'UNRESOLVED' },
                                { type: 'SHOULD', title: '缺少 PII 标注说明', desc: '检测到正则匹配手机号，建议开启 PII 标志并添加脱敏说明。', status: 'UNRESOLVED' }
                            ].map((gate, i) => (
                                <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${gate.type === 'MUST' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>{gate.type === 'MUST' ? '强制阻止 (MUST)' : '建议修复 (SHOULD)'}</span>
                                        <button className="text-[10px] font-bold text-indigo-400">去修复</button>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-200">{gate.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{gate.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ReAnalyzePlanModal */}
            {activeModal === 'REANALYZE' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal(null)}></div>
                    <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                                    <RefreshCw size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">重新启动语义分析</h3>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <p className="text-sm text-slate-400 leading-relaxed">系统将基于最新的算法版本扫描字段元数据及数据特征。这可能会覆盖部分现有的“系统推荐”方案。</p>
                        </div>
                        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                            <button onClick={() => setActiveModal(null)} className="px-6 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-700">我再想想</button>
                            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">开始分析</button>
                        </div>
                    </div>
                </div>
            )}

            {/* AllEvidenceDrawer */}
            {activeDrawer === 'ALL_EVIDENCE' && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setActiveDrawer(null)}></div>
                    <div className="relative w-[600px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <List className="text-indigo-400" size={20} />
                                <h2 className="text-lg font-bold text-white">语义证据合集 (全视角)</h2>
                            </div>
                            <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {[
                                { title: '元数据路径 (Metadata Match)', icon: <Database size={16} />, score: 98, level: 'STRONG', tags: ['Name Alignment', 'Type Affinity'], desc: '字段名 order_id 在标准词库( retail_orders_v1 )中匹配率为 96%。类型 BIGINT 符合标识键规范。' },
                                { title: '数据画像探查 (Data Profiling)', icon: <BarChart3 size={16} />, score: 85, level: 'STRONG', tags: ['100% Unique', 'Not Null'], desc: '采样 1,000,000 行，无重复值，唯一性 1.0。空值率为 0%。' },
                                { title: '血缘拓扑关系 (Lineage context)', icon: <Share2 size={16} />, score: 62, level: 'MED', tags: ['Join Key', 'P-Key'], desc: '该字段在下游 15 个 Join 操作中作为主键参与关联，主要连接 retail_order_items 表。' },
                                { title: '业务规则引擎 (Domain Rules)', icon: <Book size={16} />, score: 45, level: 'MED', tags: ['Retail Pack'], desc: '满足零售域标准模型对“订单唯一标识”的强制约束规则 R-102。' }
                            ].map((ev, i) => (
                                <div key={i} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                                                {ev.icon}
                                            </div>
                                            <span className="text-sm font-bold text-slate-200">{ev.title}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ev.level === 'STRONG' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>置信度: {ev.score}%</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">{ev.desc}</p>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {ev.tags.map(t => (
                                            <span key={t} className="px-2 py-0.5 bg-slate-900 text-slate-500 rounded text-[10px] font-bold border border-slate-800">#{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
