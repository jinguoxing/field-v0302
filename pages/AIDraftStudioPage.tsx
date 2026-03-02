import React from 'react';
import { GitMerge, Sparkles } from 'lucide-react';
import { SourceSelector } from '../components/standards/ai/SourceSelector';
import { GenerationConfig } from '../components/standards/ai/GenerationConfig';
import { DraftList } from '../components/standards/ai/DraftList';

export const AIDraftStudioPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 animate-in fade-in duration-500">
       
       {/* Header */}
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <GitMerge className="text-cyan-400" /> AI 标准工厂 <span className="text-slate-600">/</span> 草案工作台
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               让 AI 完成 90% 的基础定义工作，您只需负责最后的确认与发布。
             </p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-900/30 px-4 py-2 rounded-lg border border-indigo-500/20">
             <Sparkles size={16} className="text-indigo-400 animate-pulse" />
             <span className="text-sm font-medium text-indigo-200">AI 引擎就绪: Nexus-LLM-v3 (Governance-Tuned)</span>
          </div>
       </div>

       {/* Workspace Layout */}
       <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Left: Input Selection (25%) */}
          <div className="col-span-12 lg:col-span-3 min-h-[400px]">
             <SourceSelector />
          </div>

          {/* Middle: Configuration (25%) */}
          <div className="col-span-12 lg:col-span-3 min-h-[400px]">
             <GenerationConfig />
          </div>

          {/* Right: Draft Preview (50%) */}
          <div className="col-span-12 lg:col-span-6 min-h-[400px]">
             <DraftList />
          </div>
       </div>
    </div>
  );
};