import React from 'react';
import { 
  Library, ShieldCheck, Settings, 
  BookOpen, AlertOctagon, 
  GitMerge, CheckCircle2, ArrowRight, Plus, Layers, Zap
} from 'lucide-react';

import { KPICard } from '../components/standards/overview/KPICard';
import { HealthDistributionChart } from '../components/standards/overview/HealthDistributionChart';
import { RiskTable } from '../components/standards/overview/RiskTable';
import { InboxList } from '../components/standards/overview/InboxList';
import { AIRecommendations } from '../components/standards/overview/AIRecommendations';
import { RecentActivity } from '../components/standards/overview/RecentActivity';

export const StandardsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 pb-10 animate-in fade-in duration-500">
      
      {/* 1. Header Area with Quick Actions */}
      <div className="flex items-end justify-between mb-2">
         <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
               <BookOpen className="text-cyan-400" /> 标准总览
               <span className="text-xs font-mono font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Standards Overview</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">
              监控企业级数据标准的建设进度、落标执行情况与变更影响。
            </p>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-3 py-2 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2">
               <Settings size={16} /> 设置仪表盘
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2">
               <Plus size={16} /> 新建标准
            </button>
         </div>
      </div>

      {/* 2. Top KPI Cards - 5 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
         <KPICard 
           label="标准总数" 
           value="1,248" 
           subtext="本周新增 +12" 
           icon={<Library size={20} />} 
           trend="up"
           color="cyan"
         />
         <KPICard 
           label="落标覆盖率" 
           value="72.0%" 
           subtext="较上月 +0.5%" 
           icon={<Layers size={20} />} 
           trend="up"
           color="indigo"
         />
         <KPICard 
           label="合规通过率" 
           value="92.4%" 
           subtext="拦截异常 23 次" 
           icon={<ShieldCheck size={20} />} 
           trend="up"
           color="emerald"
         />
         <KPICard 
           label="待解决冲突" 
           value="14" 
           subtext="需人工介入" 
           icon={<AlertOctagon size={20} />} 
           trend="down"
           color="amber"
         />
         <KPICard 
           label="高影响变更" 
           value="3" 
           subtext="涉及核心资产" 
           icon={<Zap size={20} />} 
           trend="up"
           color="rose"
         />
      </div>

      {/* 3. Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
         
         {/* Left Column (8/12) */}
         <div className="xl:col-span-8 flex flex-col gap-6">
            <HealthDistributionChart />
            <RiskTable />
         </div>

         {/* Right Column (4/12) */}
         <div className="xl:col-span-4 flex flex-col gap-6">
            <InboxList />
            <AIRecommendations />
         </div>
      </div>

      {/* 4. Recent Activity */}
      <div>
         <RecentActivity />
      </div>
    </div>
  );
};