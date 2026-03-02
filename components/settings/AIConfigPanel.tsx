import React from 'react';
import { Sparkles, Save, RefreshCcw } from 'lucide-react';
import { AI_CONFIG_MOCK } from '../../constants';

export const AIConfigPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden animate-in fade-in">
       <div className="p-6 border-b border-slate-700 bg-slate-900/30 flex justify-between items-center">
          <div>
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-400" /> AI 引擎配置
             </h2>
             <p className="text-xs text-slate-400 mt-1">调整模型参数、置信度阈值与生成策略。</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2">
             <Save size={16} /> 保存配置
          </button>
       </div>

       <div className="flex-1 overflow-auto p-8 max-w-4xl mx-auto w-full">
          <div className="space-y-8">
             {/* Model Selection */}
             <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 block">基础模型 (Base Model)</label>
                <div className="grid grid-cols-2 gap-4">
                   <div className="border-2 border-indigo-500 bg-indigo-900/20 p-4 rounded-xl cursor-pointer">
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-bold text-white">Nexus-LLM-v3</span>
                         <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full">Recommended</span>
                      </div>
                      <p className="text-xs text-indigo-200">针对数据治理微调，擅长中文术语理解。</p>
                   </div>
                   <div className="border border-slate-700 bg-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-500">
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-bold text-slate-300">GPT-4-Turbo</span>
                      </div>
                      <p className="text-xs text-slate-500">通用能力强，推理成本较高。</p>
                   </div>
                </div>
             </div>

             {/* Thresholds */}
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-sm font-bold text-slate-300 flex justify-between">
                      自动采纳阈值
                      <span className="text-emerald-400 font-mono">{AI_CONFIG_MOCK.autoAcceptThreshold}%</span>
                   </label>
                   <input type="range" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" min="80" max="100" defaultValue={AI_CONFIG_MOCK.autoAcceptThreshold} />
                   <p className="text-xs text-slate-500">置信度高于此值时，无需人工复核直接进入草稿库。</p>
                </div>
                <div className="space-y-3">
                   <label className="text-sm font-bold text-slate-300 flex justify-between">
                      推荐展示阈值
                      <span className="text-amber-400 font-mono">{AI_CONFIG_MOCK.confidenceThreshold}%</span>
                   </label>
                   <input type="range" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" min="50" max="90" defaultValue={AI_CONFIG_MOCK.confidenceThreshold} />
                   <p className="text-xs text-slate-500">置信度低于此值的建议将被自动过滤。</p>
                </div>
             </div>

             {/* Strategy */}
             <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 block">生成策略 (Strategy)</label>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                   {['Conservative', 'Balanced', 'Aggressive'].map(s => (
                      <button 
                        key={s}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${s === AI_CONFIG_MOCK.strategy ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                         {s}
                      </button>
                   ))}
                </div>
             </div>

             {/* Prompts */}
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <label className="text-sm font-bold text-slate-300">提示词版本 (System Prompt)</label>
                   <span className="text-xs text-slate-500 font-mono">{AI_CONFIG_MOCK.promptVersion}</span>
                </div>
                <textarea 
                   className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-400 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                   defaultValue="You are an expert Data Steward. Analyze the provided schema and suggest standardized data elements based on the ISO-11179 framework..."
                   readOnly
                ></textarea>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                   <RefreshCcw size={12} /> 检查更新
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};