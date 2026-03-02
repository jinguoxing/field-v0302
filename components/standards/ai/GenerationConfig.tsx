import React from 'react';
import { Sliders, Zap, Shield, Search } from 'lucide-react';

export const GenerationConfig: React.FC = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col h-full shadow-lg backdrop-blur-sm overflow-hidden">
       {/* Header */}
       <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
             <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
             2. 生成配置
          </h3>
          <p className="text-xs text-slate-500 mt-1">定制 AI 提取策略</p>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Target Types */}
          <div>
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">生成类型</label>
             <div className="grid grid-cols-2 gap-2">
                {['数据元', '业务术语', '指标口径', '质量规则'].map(type => (
                   <label key={type} className="flex items-center gap-2 p-2 bg-slate-800 border border-slate-700 rounded cursor-pointer hover:border-indigo-500/50 transition-colors">
                      <input type="checkbox" className="rounded bg-slate-900 border-slate-600 text-indigo-500 focus:ring-offset-slate-900" defaultChecked />
                      <span className="text-xs text-slate-300">{type}</span>
                   </label>
                ))}
             </div>
          </div>

          {/* Strategy Slider */}
          <div>
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block flex justify-between">
                <span>生成策略</span>
                <span className="text-cyan-400">均衡模式</span>
             </label>
             <input type="range" className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" min="0" max="2" step="1" defaultValue="1" />
             <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                <span>保守(高准)</span>
                <span>均衡</span>
                <span>激进(高全)</span>
             </div>
             <p className="text-[10px] text-slate-500 mt-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                平衡召回率与准确率，适合大多数场景。AI 将同时参考元数据注释与数据内容分布。
             </p>
          </div>

          {/* Evidence Requirements */}
          <div>
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">采信证据要求</label>
             <div className="space-y-2">
                <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                   <input type="checkbox" className="mt-0.5 rounded bg-slate-900 border-slate-600 text-indigo-500" defaultChecked />
                   <div>
                      <span className="text-slate-300 block">必须包含中文注释</span>
                      <span className="text-[10px] opacity-70">忽略纯英文或无意义的字段</span>
                   </div>
                </label>
                <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                   <input type="checkbox" className="mt-0.5 rounded bg-slate-900 border-slate-600 text-indigo-500" />
                   <div>
                      <span className="text-slate-300 block">必须有数据采样</span>
                      <span className="text-[10px] opacity-70">通过实际值验证类型准确性</span>
                   </div>
                </label>
             </div>
          </div>

       </div>

       {/* Action Button */}
       <div className="p-4 border-t border-slate-700 bg-slate-900/30">
          <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 group">
             <Zap size={18} className="fill-white group-hover:scale-110 transition-transform" />
             开始 AI 生成
          </button>
       </div>
    </div>
  );
};