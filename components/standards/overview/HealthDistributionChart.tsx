import React from 'react';
import { Activity } from 'lucide-react';

const ChartBar = ({ label, height, color, value, isRisk }: any) => (
  <div className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer">
     <div className="relative w-full max-w-[40px] h-full flex items-end">
        <div 
          className={`w-full rounded-t-sm transition-all duration-500 relative group-hover:opacity-80 ${color} ${isRisk ? 'animate-pulse' : ''}`} 
          style={{ height: height }}
        >
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
              {value}
           </div>
        </div>
     </div>
     <span className={`text-[10px] mt-2 font-medium ${isRisk ? 'text-amber-400' : 'text-slate-500'}`}>{label}</span>
  </div>
);

export const HealthDistributionChart: React.FC = () => {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 shadow-sm">
       <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
             <Activity size={16} className="text-cyan-400" /> 标准健康度分布
          </h3>
          <div className="flex gap-2">
             <select className="bg-slate-900 border border-slate-700 text-xs text-slate-400 rounded px-2 py-1 outline-none">
                <option>按数据域</option>
                <option>按资产类型</option>
             </select>
          </div>
       </div>
       
       {/* Visual Mock of Distribution */}
       <div className="h-48 flex items-end justify-between gap-4 px-4 pb-2 border-b border-slate-700/50">
          <ChartBar label="客户域" height="80%" color="bg-cyan-500" value="95" />
          <ChartBar label="产品域" height="60%" color="bg-indigo-500" value="72" />
          <ChartBar label="财务域" height="90%" color="bg-emerald-500" value="98" />
          <ChartBar label="供应链" height="40%" color="bg-amber-500" value="55" isRisk />
          <ChartBar label="人力资源" height="75%" color="bg-blue-500" value="88" />
          <ChartBar label="风险控制" height="65%" color="bg-violet-500" value="76" />
       </div>
       <div className="mt-4 flex gap-6 justify-center">
          <div className="flex items-center gap-2 text-xs text-slate-400">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 健康 (&gt;90)
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
             <span className="w-2 h-2 rounded-full bg-blue-500"></span> 良好 (70-90)
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
             <span className="w-2 h-2 rounded-full bg-amber-500"></span> 风险 (&lt;70)
          </div>
       </div>
    </div>
  );
};