import React from 'react';
import { FileSignature } from 'lucide-react';
import { WaiverPanel } from '../components/standards/enforce/WaiverPanel';

export const EnforceWaiverPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <FileSignature className="text-cyan-400" /> 豁免管理 <span className="text-slate-600">/</span> Waivers
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               处理标准执行过程中的例外情况申请与风险备案。
             </p>
          </div>
       </div>
       <WaiverPanel />
    </div>
  );
};