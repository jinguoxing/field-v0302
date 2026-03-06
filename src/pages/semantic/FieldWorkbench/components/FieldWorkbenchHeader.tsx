import React from 'react';
import {
    Table2, ChevronRight, Sparkles, RefreshCw, CheckCircle2, LayoutGrid, AlertTriangle, ShieldCheck
} from 'lucide-react';

interface HeaderProps {
    stage: string | null;
    setSearchParams: (params: any) => void;
    isSaving: boolean;
    handleBatchPassHighConfidence: () => void;
    setActiveModal: (modal: any) => void;
    setActiveDrawer: (drawer: any) => void;
}

export const FieldWorkbenchHeader: React.FC<HeaderProps> = ({
    stage,
    setSearchParams,
    isSaving,
    handleBatchPassHighConfidence,
    setActiveModal,
    setActiveDrawer
}) => {
    return (
        <header className="border-b border-slate-800 bg-slate-900 flex flex-col px-6 py-3 flex-shrink-0 gap-3">
            <div className="flex items-center justify-between">
                {/* Left: Breadcrumb & Identity */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Table2 size={16} />
                        <span className="text-xs font-medium hover:text-slate-200 cursor-pointer">零售域订单模型</span>
                        <ChevronRight size={14} />
                        <span className="text-xs font-bold text-white">字段裁决</span>
                    </div>

                    <div className="h-4 w-px bg-slate-800"></div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-200">retail_orders_lv</span>
                        <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-1.5 py-0.5 rounded">retail.sales.orders</span>
                        <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px] font-bold uppercase tracking-wider">
                            草稿
                        </span>
                    </div>
                </div>

                {/* Middle: StageStepper */}
                <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setSearchParams({ stage: 'field' })}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${!stage || stage === 'field'
                                    ? 'bg-indigo-500/20 text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            1. 字段语义
                        </button>
                        <ChevronRight size={14} className="text-slate-600" />
                        <button
                            onClick={() => setSearchParams({ stage: 'table' })}
                            className={`px-3 py-1 rounded text-xs font-medium transition-all ${stage === 'table'
                                    ? 'bg-indigo-500/20 text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            2. 表结构
                        </button>
                        <ChevronRight size={14} className="text-slate-600" />
                        <button
                            onClick={() => setSearchParams({ stage: 'object' })}
                            className={`px-3 py-1 rounded text-xs font-medium transition-all ${stage === 'object'
                                    ? 'bg-indigo-500/20 text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            3. 对象生成
                        </button>
                    </div>
                </div>

                {/* Right: Global Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-2">
                        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                            <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50" />
                            仅看冲突
                        </label>
                    </div>

                    <button
                        onClick={handleBatchPassHighConfidence}
                        disabled={isSaving}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                        {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        一键高置信通过
                    </button>

                    <button
                        onClick={() => setActiveModal('REANALYZE')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                        <RefreshCw size={14} />
                        重新分析
                    </button>

                    <button
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled
                        title="门禁未通过：存在 2 个 MUST 冲突"
                    >
                        <CheckCircle2 size={14} />
                        预览并发布
                    </button>
                </div>
            </div>

            {/* Sub-header: GateBar */}
            <div className="flex items-center gap-4 text-xs bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                <div
                    onClick={() => setActiveDrawer('GATE')}
                    className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 px-2 py-1 rounded transition-colors"
                >
                    <ShieldCheck size={14} className="text-rose-400" />
                    <span className="text-slate-400">门禁 (强制):</span>
                    <span className="font-bold text-rose-400">2 个未解决</span>
                </div>
                <div className="w-px h-3 bg-slate-800"></div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 px-2 py-1 rounded transition-colors">
                    <LayoutGrid size={14} className="text-emerald-400" />
                    <span className="text-slate-400">覆盖率:</span>
                    <span className="font-bold text-emerald-400">92%</span>
                    <span className="text-[10px] text-slate-500">(阈值 90%)</span>
                </div>
                <div className="w-px h-3 bg-slate-800"></div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 px-2 py-1 rounded transition-colors">
                    <AlertTriangle size={14} className="text-amber-400" />
                    <span className="text-slate-400">风险指数:</span>
                    <span className="font-bold text-amber-400">中</span>
                </div>
            </div>
        </header>
    );
};
