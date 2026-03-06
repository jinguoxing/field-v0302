import React from 'react';
import {
    Search, LayoutGrid, AlertCircle, AlertTriangle, Clock, CheckCircle2, X, Sparkles, Wand2, Archive
} from 'lucide-react';
import { FieldItem, QueueType } from '../types';
import { typeMap, roleMap, riskMap } from '../constants';

interface QueuePanelProps {
    queue: string;
    setSearchParams: (params: any) => void;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    confidenceFilter: string;
    setConfidenceFilter: (val: any) => void;
    filteredFields: FieldItem[];
    selectedField: string | null;
    handleFieldSelect: (id: string) => void;
    selectedIds: string[];
    handleSelectAll: () => void;
    toggleSelect: (id: string, e: React.MouseEvent) => void;
    setSelectedIds: (ids: string[]) => void;
    setActiveModal: (modal: any) => void;
    handleBatchApplySimilar: () => void;
    handleBatchIgnore: () => void;
}

export const FieldQueuePanel: React.FC<QueuePanelProps> = ({
    queue,
    setSearchParams,
    searchQuery,
    setSearchQuery,
    confidenceFilter,
    setConfidenceFilter,
    filteredFields,
    selectedField,
    handleFieldSelect,
    selectedIds,
    handleSelectAll,
    toggleSelect,
    setSelectedIds,
    setActiveModal,
    handleBatchApplySimilar,
    handleBatchIgnore
}) => {
    const getQueueOrder = (q: string) => {
        const order: Record<string, number> = {
            'CONFLICT': 0,
            'ANOMALY': 1,
            'NEEDS_CONFIRM': 2,
            'AUTO_PASS': 3,
            'IGNORE_CANDIDATE': 4,
        };
        return order[q] ?? 99;
    };

    const getConfidenceLevel = (conf: number) => {
        if (conf >= 0.9) return '高';
        if (conf >= 0.7) return '中';
        return '低';
    };

    return (
        <aside className="w-[400px] border-r border-slate-800 flex flex-col bg-slate-900/40 relative">
            <div className="flex items-center border-b border-slate-800 bg-slate-900/60">
                {[
                    { id: 'ALL', label: '全部', icon: <LayoutGrid size={14} /> },
                    { id: 'CONFLICT', label: '冲突', icon: <AlertCircle size={14} />, color: 'text-rose-400' },
                    { id: 'ANOMALY', label: '异常', icon: <AlertTriangle size={14} />, color: 'text-amber-400' },
                    { id: 'NEEDS_CONFIRM', label: '待确认', icon: <Clock size={14} />, color: 'text-cyan-400' },
                    { id: 'AUTO_PASS', label: '自动', icon: <CheckCircle2 size={14} />, color: 'text-emerald-400' },
                    { id: 'IGNORE_CANDIDATE', label: '忽略', icon: <X size={14} />, color: 'text-slate-500' },
                ].map((q) => (
                    <button
                        key={q.id}
                        onClick={() => setSearchParams({ queue: q.id })}
                        className={`flex-1 flex flex-col items-center gap-1 py-2.5 border-b-2 transition-all ${queue === q.id
                                ? 'border-indigo-500 bg-indigo-500/5 text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                            }`}
                    >
                        <span className={queue === q.id ? q.color : ''}>{q.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{q.label}</span>
                    </button>
                ))}
            </div>

            <div className="p-3 border-b border-slate-800 space-y-3 bg-slate-900/20">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="搜索字段..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                        {['高', '中', '低'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setConfidenceFilter((prev: any) => prev === level ? 'ALL' : level as any)}
                                className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${confidenceFilter === level
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 cursor-pointer hover:text-slate-300">
                        <input
                            type="checkbox"
                            checked={filteredFields.length > 0 && selectedIds.length === filteredFields.length}
                            onChange={handleSelectAll}
                            className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50"
                        />
                        全选 ({filteredFields.length})
                    </label>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => setSelectedIds([])}
                            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            取消选择
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-slate-800/50">
                    {filteredFields.map((f) => {
                        const isConflict = f.route === 'CONFLICT';
                        const isAnomaly = f.route === 'ANOMALY';
                        const hasIssue = isConflict || isAnomaly;

                        return (
                            <div
                                key={f.id}
                                onClick={() => handleFieldSelect(f.id)}
                                className={`group p-3 cursor-pointer transition-all relative ${selectedField === f.id
                                        ? hasIssue ? 'bg-rose-500/10' : 'bg-indigo-500/10'
                                        : hasIssue ? 'hover:bg-rose-500/5 bg-rose-500/5' : 'hover:bg-white/5'
                                    }`}
                            >
                                {selectedField === f.id && (
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 shadow-[0_0_10px_rgba(99,102,241,0.5)] ${hasIssue ? 'bg-rose-500 shadow-rose-500/50' : 'bg-indigo-500'}`}></div>
                                )}

                                <div className="flex items-start gap-3">
                                    <div
                                        onClick={(e) => toggleSelect(f.id, e)}
                                        className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedIds.includes(f.id)
                                                ? hasIssue ? 'bg-rose-600 border-rose-500' : 'bg-indigo-600 border-indigo-500'
                                                : 'border-slate-700 bg-slate-950 group-hover:border-slate-500'
                                            }`}
                                    >
                                        {selectedIds.includes(f.id) && <CheckCircle2 size={10} className="text-white" />}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className={`text-xs font-mono font-bold truncate ${hasIssue && selectedField === f.id ? 'text-rose-200' : 'text-slate-200'}`}>{f.name}</span>
                                                <span className="text-[9px] text-slate-500 font-mono bg-slate-800/50 px-1 rounded uppercase">{f.dataType}</span>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {isConflict && <span className="px-1 py-0.5 bg-rose-500/20 text-rose-300 rounded text-[8px] font-bold border border-rose-500/30 flex items-center gap-0.5"><AlertCircle size={8} /> 冲突</span>}
                                                {isAnomaly && <span className="px-1 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[8px] font-bold border border-amber-500/30 flex items-center gap-0.5"><AlertTriangle size={8} /> 异常</span>}
                                                {f.route === 'AUTO_PASS' && <span className="px-1 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[8px] font-bold flex items-center gap-0.5"><CheckCircle2 size={8} /> 已确认</span>}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${hasIssue ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'
                                                }`}>
                                                <span>{typeMap[f.type] || f.type}</span>
                                                <span className={hasIssue ? 'text-rose-500/50' : 'text-slate-600'}>/</span>
                                                <span>{roleMap[f.role] || f.role}</span>
                                            </div>

                                            <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getConfidenceLevel(f.confidence) === '高' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    getConfidenceLevel(f.confidence) === '中' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                {getConfidenceLevel(f.confidence)} ({(f.confidence * 100).toFixed(0)}%)
                                            </div>

                                            {isConflict && f.gap !== undefined && (
                                                <div className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded text-[9px] font-bold border border-rose-500/30">
                                                    Gap: {f.gap.toFixed(2)}
                                                </div>
                                            )}

                                            {f.risks.map(risk => (
                                                <div key={risk} className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${risk === 'PII' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        risk === 'KeyField' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                            'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                    }`}>
                                                    {riskMap[risk] || risk}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {selectedIds.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4 bg-indigo-600 rounded-xl shadow-2xl shadow-indigo-500/40 p-3 flex items-center justify-between animate-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                            {selectedIds.length}
                        </div>
                        <span className="text-xs font-bold text-white">已选择</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setActiveModal('BATCH_PREVIEW')}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-all"
                            title="批量预览"
                        >
                            <Sparkles size={14} />
                        </button>
                        <button
                            onClick={handleBatchApplySimilar}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-all"
                            title="应用当前字段规则到所选字段"
                        >
                            <Wand2 size={14} />
                        </button>
                        <button
                            onClick={handleBatchIgnore}
                            className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-200 transition-all"
                            title="批量忽略"
                        >
                            <Archive size={14} />
                        </button>
                        <div className="w-px h-4 bg-white/20 mx-1"></div>
                        <button
                            onClick={() => setSelectedIds([])}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-all"
                            title="取消选择"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};
