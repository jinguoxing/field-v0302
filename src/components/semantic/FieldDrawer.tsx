
import React from 'react';
import { 
  X, Brain, Layers, Info, ChevronRight, 
  Check, RotateCw, Sparkles, ShieldCheck,
  MoreHorizontal, RefreshCw
} from 'lucide-react';

interface FieldDrawerProps {
  fieldId: string | null;
  onClose: () => void;
  onConfirm?: (fieldId: string) => void;
  onIgnore?: (fieldId: string) => void;
}

export const FieldDrawer: React.FC<FieldDrawerProps> = ({ fieldId, onClose, onConfirm, onIgnore }) => {
  if (!fieldId) return null;

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="text-indigo-400" size={20} /> 字段语义决策
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">{fieldId}</p>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Top1 Conf', value: '76%', color: 'text-amber-400' },
            { label: 'Gap 1-2', value: '0.05', color: 'text-rose-400' },
            { label: 'Completeness', value: '88%', color: 'text-emerald-400' },
            { label: 'Ignore Score', value: '0.12', color: 'text-slate-500' },
          ].map((stat, i) => (
            <div key={i} className="p-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">{stat.label}</p>
              <p className={`text-sm font-mono font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* TopK Candidates */}
        <section>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-indigo-400" /> TopK 联合候选 (Joint Candidates)
          </h4>
          <div className="space-y-3">
            {[
              { type: 'DIM', role: 'STATUS', score: 0.76, breakdown: { type: 0.85, role: 0.92, compat: 0.95, penalty: 0.02 } },
              { type: 'DIM', role: 'CATEGORY', score: 0.71, breakdown: { type: 0.85, role: 0.82, compat: 0.88, penalty: 0.05 } },
              { type: 'MEASURE', role: 'COUNT', score: 0.32, breakdown: { type: 0.45, role: 0.32, compat: 0.40, penalty: 0.15 } },
            ].map((cand, i) => (
              <div key={i} className={`p-4 rounded-2xl border transition-all cursor-pointer ${i === 0 ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-indigo-400 rounded text-[10px] font-bold font-mono">{cand.type}</span>
                    <span className="text-slate-700">/</span>
                    <span className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[10px] font-bold font-mono">{cand.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{cand.score}</span>
                    {i === 0 && <Check className="text-emerald-500" size={14} />}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800/50">
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase">ConfT</p>
                    <p className="text-[10px] font-mono text-slate-300">{cand.breakdown.type}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase">ConfR</p>
                    <p className="text-[10px] font-mono text-slate-300">{cand.breakdown.role}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase">Compat</p>
                    <p className="text-[10px] font-mono text-slate-300">{cand.breakdown.compat}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase">Penal</p>
                    <p className="text-[10px] font-mono text-rose-400">-{cand.breakdown.penalty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Evidence Chains */}
        <section>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" /> Evidence Chains (D1~D8)
          </h4>
          <div className="space-y-2">
            {[
              { id: 'D1', title: '元数据名称匹配', content: '字段名 "order_status" 与业务术语 "订单状态" 语义相似度 0.94', status: 'positive' },
              { id: 'D2', title: '数据画像分布', content: '数值分布符合金额特征，无负数，均值 124.5', status: 'positive' },
              { id: 'D3', title: '血缘传播证据', content: '上游字段 "raw_amount" 已确认为 AMOUNT 类型', status: 'positive' },
              { id: 'D4', title: '查询日志上下文', content: '常用于 SUM() 聚合函数，与 order_id 关联', status: 'neutral' },
              { id: 'D8', title: '模型冲突检测', content: '检测到 Top2 (CATEGORY) 在当前域下存在语义重叠。', status: 'negative' },
            ].map((ev, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-slate-800/60 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                    <span className="text-indigo-400">{ev.id}</span> {ev.title}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${ev.status === 'positive' ? 'bg-emerald-500' : ev.status === 'negative' ? 'bg-rose-500' : 'bg-slate-500'}`}></div>
                </div>
                <div className="p-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-700/30">
                  {ev.content}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md grid grid-cols-2 gap-3">
        <button 
          onClick={() => onConfirm?.(fieldId)}
          className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
        >
          <Check size={14} /> 确认 Top1
        </button>
        <button className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all">
          选择 Top2
        </button>
        <button 
          onClick={() => onIgnore?.(fieldId)}
          className="py-2.5 bg-slate-900/50 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 rounded-xl text-xs font-bold border border-dashed border-slate-700 hover:border-rose-500/30 transition-all"
        >
          标记忽略 (IGNORE)
        </button>
        <button className="py-2.5 bg-slate-900/50 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2">
          <RotateCw size={14} /> 重新运行
        </button>
      </div>
    </div>
  );
};
