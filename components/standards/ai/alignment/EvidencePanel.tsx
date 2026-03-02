import React from 'react';
import { Eye, Regex, TableProperties, Network } from 'lucide-react';
import { AlignmentTask } from '../../../../types';

interface EvidencePanelProps {
  task: AlignmentTask;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ task }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col h-full overflow-hidden shadow-lg backdrop-blur-sm">
       <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
             <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
             辅助判断证据
          </h3>
          <p className="text-xs text-slate-500 mt-1">数据特征与上下文信息</p>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Sample Data */}
          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Eye size={12} /> 实际数据采样
             </h4>
             <div className="bg-slate-900 rounded-lg border border-slate-700 p-3 space-y-2">
                {task.samples.map((sample, i) => (
                   <div key={i} className="text-xs font-mono text-emerald-400 bg-slate-800 px-2 py-1 rounded border border-slate-700/50">
                      {sample}
                   </div>
                ))}
                <div className="text-[10px] text-slate-500 pt-1 text-center">共采样 1,000 行，空值率 0%</div>
             </div>
          </div>

          {/* Regex / Format */}
          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Regex size={12} /> 格式特征
             </h4>
             <div className="space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-slate-400">数据类型</span>
                   <span className="text-slate-200 font-mono">VARCHAR(20)</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-slate-400">平均长度</span>
                   <span className="text-slate-200 font-mono">8.2 chars</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-slate-400">主要模式</span>
                   <span className="text-amber-400 font-mono">^[A-Z]\d{7}$</span>
                </div>
             </div>
          </div>

          {/* Context */}
          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <TableProperties size={12} /> 上下文推断
             </h4>
             <p className="text-xs text-slate-300 leading-relaxed bg-slate-800 p-2 rounded border border-slate-700">
                该表 <span className="font-mono text-cyan-400">{task.tableName}</span> 位于 HR 库中，同表包含 <span className="font-mono">dept_id</span>, <span className="font-mono">join_date</span>，推测为员工主档表。
             </p>
          </div>

       </div>
    </div>
  );
};