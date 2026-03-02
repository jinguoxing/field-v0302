
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Database, Settings, TableProperties, 
  Bot, Brain, Table2, Share2, Box, BarChart3, ShieldCheck, 
  FileCheck, Hexagon, LayoutGrid, Calculator, FileText, Binary
} from 'lucide-react';

export default function App() {
  const location = useLocation();

  const menuItems = [
    {
      section: "核心模块 (Core Modules)",
      items: [
        { path: "/datasource", label: "数据源管理", icon: Database },
        { path: "/schema", label: "表结构详情", icon: LayoutGrid },
        { path: "/graph", label: "图谱视图", icon: Share2 },
        { path: "/semantic-modeling/logical-views", label: "语义建模", icon: TableProperties },
        { path: "/semantic/workbench/default?stage=field", label: "字段裁决", icon: Brain },
         { path: "/semantic/workbench/default?stage=field", label: "字段裁决v3", icon: Brain },
      ]
    },
    {
      section: "模型资产 (Model Assets)",
      items: [
        { path: "/assets", label: "资产总览", icon: Box },
      ]
    },
    {
      section: "指标中心 (Metric Center)",
      items: [
        { path: "/metrics", label: "指标管理 (Metric Hub)", icon: Calculator },
      ]
    },
    {
      section: "运营中心 (Operations Center)",
      items: [
        { path: "/aiops/workbench", label: "AI 运营工作台", icon: Bot },
      ]
    },
    {
      section: "标准中心 (Standard Center)",
      items: [
        { path: "/standards", label: "标准总览", icon: ShieldCheck },
      ]
    },
    {
      section: "系统管理",
      items: [
        { path: "/settings", label: "配置中心", icon: Settings },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col fixed inset-y-0 border-r border-white/5 shadow-2xl">
        <div className="h-16 flex items-center px-6 gap-3 border-b border-white/5">
          <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <Hexagon className="text-cyan-400 w-5 h-5" fill="currentColor" fillOpacity={0.2} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            NEXUS<span className="text-cyan-400">OS</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-7 overflow-y-auto custom-scrollbar">
          {menuItems.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="px-4 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-80">
                {section.section}
              </h3>
              
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path.split('?')[0]));
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                        isActive 
                          ? 'bg-cyan-500/10 text-white' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                      )}
                      <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span className={`text-[14px] font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 bg-slate-950">
        <Outlet />
      </main>
    </div>
  );
}
