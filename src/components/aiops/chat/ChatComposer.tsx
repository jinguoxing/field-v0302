
import React, { useState } from 'react';
import { 
  Send, Play, Pause, Database, Globe, Table, 
  Wand2, Sparkles, Plus, Info
} from 'lucide-react';

interface ChatComposerProps {
  onSend: (message: string, attachContext: boolean) => void;
  onStartResume: () => void;
  isRunning: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ onSend, onStartResume, isRunning }) => {
  const [message, setMessage] = useState('');
  const [attachContext, setAttachContext] = useState(true);

  const intentButtons = [
    { label: '一键运行全流程 (L2)', icon: <Sparkles size={14} /> },
    { label: '只跑扫描', icon: <Database size={14} /> },
    { label: '只跑语义理解', icon: <Globe size={14} /> },
    { label: '生成候选对象', icon: <Table size={14} /> },
    { label: '生成质量规则草案', icon: <Wand2 size={14} /> },
  ];

  const handleSend = () => {
    if (message.trim()) {
      onSend(message, attachContext);
      setMessage('');
    }
  };

  return (
    <div className="p-6 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-md">
      <div className="flex flex-wrap gap-2 mb-4">
        {intentButtons.map((btn) => (
          <button 
            key={btn.label}
            onClick={() => setMessage(btn.label)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-[11px] text-slate-400 hover:text-indigo-400 transition-all"
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      <div className="relative group">
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="输入指令或提问，例如：'生成本阶段报告'..." 
          className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl py-4 pl-6 pr-32 text-sm text-slate-200 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 resize-none"
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {/* Attach Context Toggle */}
          <button 
            onClick={() => setAttachContext(!attachContext)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
              attachContext 
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                : 'bg-slate-700 border-slate-600 text-slate-500'
            }`}
            title="是否附带当前表上下文"
          >
            <Info size={12} /> 上下文
          </button>

          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/40 active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><kbd className="px-1 bg-slate-800 border border-slate-700 rounded text-[9px]">Enter</kbd> 发送</span>
          <span className="flex items-center gap-1"><kbd className="px-1 bg-slate-800 border border-slate-700 rounded text-[9px]">Shift + Enter</kbd> 换行</span>
        </div>

        <button 
          onClick={onStartResume}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
            isRunning 
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-amber-900/20' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
          }`}
        >
          {isRunning ? (
            <>
              <Pause size={14} /> 暂停执行
            </>
          ) : (
            <>
              <Play size={14} /> 开始 / 恢复执行
            </>
          )}
        </button>
      </div>
    </div>
  );
};
