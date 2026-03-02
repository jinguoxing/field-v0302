import React from 'react';
import { Clock, User } from 'lucide-react';

const ChangeLogItem = ({ action, target, time, user, impact }: any) => (
  <div className="relative group">
     <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-cyan-500 transition-colors z-10"></div>
     <div className="mb-1 flex items-center justify-between">
        <span className={`text-xs font-bold ${action === '废弃' ? 'text-red-400' : 'text-slate-300'}`}>{action}</span>
        <span className="text-[10px] text-slate-500 font-mono">{time}</span>
     </div>
     <div className="text-xs text-slate-400 mb-0.5">{target}</div>
     <div className="flex items-center gap-2 text-[10px] text-slate-500">
        <User size={10} /> {user}
        {impact && <span className="text-amber-400 border border-amber-500/30 px-1 rounded bg-amber-500/5">{impact}</span>}
     </div>
  </div>
);

export const RecentChanges: React.FC = () => {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 shadow-sm flex-1">
       <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
             <Clock size={16} className="text-slate-400" /> 最近变更
          </h3>
       </div>
       <div className="relative pl-2 border-l border-slate-700 space-y-6">
          <ChangeLogItem 
             action="发布" 
             target="标准数据元：手机号" 
             time="10:23" 
             user="Admin" 
             impact="高影响"
          />
          <ChangeLogItem 
             action="废弃" 
             target="旧版_地区码表" 
             time="昨天" 
             user="Li.W" 
             impact="低"
          />
          <ChangeLogItem 
             action="更新" 
             target="规则：邮箱校验_V2" 
             time="2天前" 
             user="System" 
          />
          <ChangeLogItem 
             action="创建" 
             target="指标：DAU_核心口径" 
             time="3天前" 
             user="Wang.K" 
          />
       </div>
    </div>
  );
};