
import React from 'react';
import { Database, Globe, Table, Bot, ExternalLink, Settings2 } from 'lucide-react';

interface ChatContextBarProps {
  domain: string;
  datasource: string;
  assets: string[];
  employee: {
    name: string;
    version: string;
    level: string;
  };
}

export const ChatContextBar: React.FC<ChatContextBarProps> = ({ domain, datasource, assets, employee }) => {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        {/* Domain Chip */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-medium text-slate-300 whitespace-nowrap">
          <Globe size={12} className="text-cyan-400" />
          {domain}
        </div>

        {/* Datasource Chip */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-medium text-slate-300 whitespace-nowrap">
          <Database size={12} className="text-emerald-400" />
          {datasource}
        </div>

        {/* Asset Chip */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-medium text-slate-300 whitespace-nowrap">
          <Table size={12} className="text-amber-400" />
          {assets.length > 1 ? `${assets[0]} +${assets.length - 1}` : assets[0]}
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-slate-700 mx-1"></div>

        {/* Employee Chip */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-[11px] font-medium text-indigo-300 whitespace-nowrap">
          <Bot size={12} className="text-indigo-400" />
          <span>{employee.name}</span>
          <span className="text-[9px] opacity-60">v{employee.version}</span>
          <span className="px-1 bg-indigo-500 text-white text-[8px] font-bold rounded-sm leading-tight">{employee.level}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-white transition-colors">
          <Settings2 size={12} /> 设置默认版本
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          <ExternalLink size={12} /> 查看台账
        </button>
      </div>
    </div>
  );
};
