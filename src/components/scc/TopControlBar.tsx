
import React, { useState } from 'react';
import { Search, Zap, Filter, ChevronDown, Command } from 'lucide-react';

interface TopControlBarProps {
  onIntentSubmit: (intent: string) => void;
  onQuickAction: (action: string) => void;
}

export const TopControlBar: React.FC<TopControlBarProps> = ({ onIntentSubmit, onQuickAction }) => {
  const [intent, setIntent] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && intent.trim()) {
      onIntentSubmit(intent);
      setIntent('');
    }
  };

  return (
    <div className="h-16 border-b border-slate-700 bg-slate-800/80 backdrop-blur flex items-center justify-between px-6 shrink-0 z-20 relative">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2 text-slate-300 font-bold tracking-tight">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-500/30">
            <Command size={18} />
          </div>
          <span>语义控制中心</span>
        </div>

        <div className="h-6 w-px bg-slate-700 mx-2"></div>

        {/* Natural Language Input */}
        <div className="relative flex-1 max-w-2xl group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all shadow-sm"
            placeholder="输入你想做什么... (例如: '自动采纳所有高置信度字段' 或 '解决 t_user 表的冲突')"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-slate-600 border border-slate-700 rounded px-1.5 py-0.5">Enter</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
          <button 
            onClick={() => onQuickAction('high_confidence')}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Zap size={12} className="text-amber-400" /> 处理高置信
          </button>
          <div className="w-px bg-slate-700 my-1"></div>
          <button 
            onClick={() => onQuickAction('resolve_conflict')}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Filter size={12} className="text-red-400" /> 仅解决冲突
          </button>
          <div className="w-px bg-slate-700 my-1"></div>
          <button 
            onClick={() => onQuickAction('publish_ready')}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Zap size={12} className="text-emerald-400" /> 推进到可发布
          </button>
        </div>

        <div className="h-6 w-px bg-slate-700 mx-2"></div>

        {/* Scope Selector */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-300 transition-colors">
          <span>当前域: 客户中心</span>
          <ChevronDown size={14} className="text-slate-500" />
        </button>
      </div>
    </div>
  );
};
