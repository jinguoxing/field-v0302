import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Check } from 'lucide-react';
import { AlignmentScopeBar } from '../components/standards/ai/alignment/AlignmentScopeBar';
import { FieldListPanel } from '../components/standards/ai/alignment/FieldListPanel';
import { CandidatePanel } from '../components/standards/ai/alignment/CandidatePanel';
import { EvidencePanel } from '../components/standards/ai/alignment/EvidencePanel';
import { ALIGNMENT_TASKS_MOCK } from '../constants';
import { AlignmentTask } from '../types';

export const AIAlignStudioPage: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<AlignmentTask>(ALIGNMENT_TASKS_MOCK[0]);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       
       {/* Header */}
       <div className="flex items-center justify-between shrink-0 mb-2">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <ShieldCheck className="text-cyan-400" /> 对齐工作台 <span className="text-slate-600">/</span> Align Studio
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               字段落标映射主战场，AI 辅助快速完成物理与逻辑层对齐。
             </p>
          </div>
       </div>

       {/* Scope Bar */}
       <div className="shrink-0">
          <AlignmentScopeBar />
       </div>

       {/* Workspace Layout */}
       <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 pb-16 relative">
          {/* Left: Field List (25%) */}
          <div className="col-span-12 lg:col-span-3 min-h-[400px]">
             <FieldListPanel selectedTaskId={selectedTask.id} onSelectTask={setSelectedTask} />
          </div>

          {/* Middle: Candidates (50%) */}
          <div className="col-span-12 lg:col-span-6 min-h-[400px]">
             <CandidatePanel task={selectedTask} />
          </div>

          {/* Right: Evidence (25%) */}
          <div className="col-span-12 lg:col-span-3 min-h-[400px]">
             <EvidencePanel task={selectedTask} />
          </div>

          {/* Sticky Bottom Batch Action */}
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-slate-900/90 backdrop-blur-md border-t border-slate-700 flex items-center justify-between px-6 z-20 rounded-xl shadow-[0_-5px_20px_rgba(0,0,0,0.3)] mx-1">
             <div className="text-sm text-slate-400">
                已选中 <span className="text-white font-bold">1</span> 个字段，其中 <span className="text-cyan-400 font-bold">1</span> 个有高置信度推荐
             </div>
             <div className="flex gap-3">
                <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-xs font-bold transition-colors">
                   暂不处理
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2">
                   <Check size={14} /> 确认并下一条
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};