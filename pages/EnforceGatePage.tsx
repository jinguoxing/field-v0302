import React from 'react';
import { DoorClosed } from 'lucide-react';
import { GatePanel } from '../components/standards/enforce/GatePanel';

export const EnforceGatePage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <DoorClosed className="text-indigo-400" /> 发布门禁 <span className="text-slate-600">/</span> Publish Gates
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               定义数据模型发布上线必须满足的硬性标准与检查策略。
             </p>
          </div>
       </div>
       <GatePanel />
    </div>
  );
};