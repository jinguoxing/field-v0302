
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, Table, Share2, Settings, Menu, Bell, User, Hexagon, BookOpen, LayoutDashboard, Library, GitMerge, ShieldCheck, AlertOctagon, BarChart3, Bot, Layers, Box, PieChart, Gavel, PlaySquare, DoorClosed, TrendingUp, FileSignature, GitPullRequest, Network, Zap, BarChart2, Users, CheckSquare, GitCommit, FileText, Binary, Hash, AlignLeft, Brain, Calculator, TableProperties } from 'lucide-react';

const SidebarItem = ({ to, icon, label, depth = 0 }: { to: string; icon: React.ReactNode; label: string; depth?: number }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg mb-1 relative overflow-hidden group
        ${depth > 0 ? 'ml-4 text-xs' : ''}
        ${isActive 
          ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-900/50' 
          : 'text-slate-400 hover:text-cyan-100 hover:bg-slate-700/50 border border-transparent'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>}
          <div className={`${isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'group-hover:text-cyan-200'}`}>
            {icon}
          </div>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
};

export const Layout: React.FC = () => {
  const location = useLocation();
  const isStandardsSection = location.pathname.startsWith('/standards');
  const isMetricsSection = location.pathname.startsWith('/metrics');
  const isSemanticSection = location.pathname.startsWith('/semantic-models');

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Sidebar - Lighter background (slate-800/50) */}
      <aside className="w-64 bg-slate-800/50 border-r border-slate-700/60 backdrop-blur-xl flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-700/60">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-cyan-400 relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full"></div>
            <Hexagon className="relative z-10 w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-white tracking-wide">NEXUS<span className="text-cyan-400 font-light">OS</span></span>
        </div>

        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">核心模块 (Core Modules)</p>
            <SidebarItem to="/" icon={<Table size={18} />} label="数据源管理" />
            <SidebarItem to="/fields/t1" icon={<LayoutGrid size={18} />} label="表结构详情" />
            <SidebarItem to="/relationships" icon={<Share2 size={18} />} label="图谱视图" />
            <SidebarItem to="/standards/apply/logical-views" icon={<TableProperties size={18} />} label="语义建模" />
            <SidebarItem to="/standards/ai/workbench" icon={<Brain size={18} />} label="字段裁决" />
          </div>

          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              模型资产 (Model Assets)
              {isSemanticSection && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>}
            </p>
            <div className="space-y-0.5">
               <SidebarItem to="/semantic-models" icon={<Box size={18} />} label="资产总览" />
            </div>
          </div>

          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              指标中心 (Metric Center)
              {isMetricsSection && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>}
            </p>
            <div className="space-y-0.5">
               <SidebarItem to="/metrics" icon={<Calculator size={18} />} label="指标管理 (Metric Hub)" />
            </div>
          </div>

          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              运营中心 (Operations Center)
              {location.pathname.startsWith('/aiops') && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>}
            </p>
            <div className="space-y-0.5">
               <SidebarItem to="/aiops/workbench" icon={<Bot size={18} />} label="AI 运营工作台" />
            </div>
          </div>

          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              标准中心 (Standard Center)
              {isStandardsSection && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>}
            </p>
            <div className="space-y-0.5">
              <SidebarItem to="/standards/overview" icon={<ShieldCheck size={18} />} label="标准总览" />
            </div>
          </div>

          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              管理科学库 (Rule Center)
            </p>
            <div className="space-y-0.5">
              <SidebarItem to="/rule-center/library" icon={<Library size={18} />} label="规则库" />
              <SidebarItem to="/rule-center/drafts" icon={<GitPullRequest size={18} />} label="草案与待审" />
              <SidebarItem to="/rule-center/health" icon={<ShieldCheck size={18} />} label="规则体检" />
              <SidebarItem to="/rule-center/groups" icon={<Layers size={18} />} label="规则群" />
              <SidebarItem to="/rule-center/policies" icon={<FileText size={18} />} label="制度文件" />
            </div>
          </div>
          
          <div>
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">系统管理</p>
            <SidebarItem to="/settings" icon={<Settings size={18} />} label="配置中心" />
            <SidebarItem to="/engine-config" icon={<Binary size={18} />} label="语义理解配置" />
          </div>
        </div>

        <div className="p-4 border-t border-slate-700/60 bg-slate-800/30">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/20 border border-slate-600">
              <User size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">Admin User</p>
              <p className="text-xs text-slate-500">系统管理员</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Lighter gradient (slate-800 to slate-900) */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-900">
        <header className="h-16 border-b border-slate-700/60 px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-slate-900/50">
          <div className="flex items-center text-slate-400 text-sm">
             <span className="text-cyan-400 font-mono">system://工作台</span>
              {location.pathname.startsWith('/metrics') ? (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-cyan-400 font-bold">指标中心 (Metric Hub)</span>
                </>
             ) : location.pathname.startsWith('/semantic-models') ? (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-cyan-400 font-bold">语义建模</span>
                </>
             ) : location.pathname.startsWith('/aiops') ? (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-cyan-400 font-bold">运营中心</span>
                </>
             ) : location.pathname.startsWith('/rule-center') ? (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-indigo-400 font-bold">管理科学库</span>
                </>
             ) : (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-slate-200">标准中心</span>
                </>
             )}
             
             {location.pathname.includes('ai') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-indigo-400 font-bold">AI 工厂</span>
                </>
             )}
             {location.pathname.includes('apply') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-emerald-400 font-bold">落标执行</span>
                </>
             )}
             {location.pathname.includes('enforce') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-red-400 font-bold">治理门禁</span>
                </>
             )}
             {location.pathname.includes('impact') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-amber-400 font-bold">影响分析</span>
                </>
             )}
             {location.pathname.includes('collab') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-blue-400 font-bold">协作审批</span>
                </>
             )}
             {location.pathname.includes('ops') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-violet-400 font-bold">运营度量</span>
                </>
             )}
             {location.pathname.includes('library') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-cyan-400 font-bold">{location.pathname.includes('rule-center') ? '规则库' : '标准库'}</span>
                </>
             )}
             {location.pathname.includes('drafts') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-amber-400 font-bold">草案与待审</span>
                </>
             )}
             {location.pathname.includes('health') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-emerald-400 font-bold">规则体检</span>
                </>
             )}
             {location.pathname.includes('groups') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-indigo-400 font-bold">规则群</span>
                </>
             )}
             {location.pathname.includes('policies') && (
                <>
                   <span className="mx-2 text-slate-600">/</span>
                   <span className="text-blue-400 font-bold">制度文件</span>
                </>
             )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
               <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
               <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors">
                 <Bell size={20} />
               </button>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
