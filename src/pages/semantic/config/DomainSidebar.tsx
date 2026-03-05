import React from 'react';
import { DOMAINS } from './types';

interface DomainSidebarProps {
  activeDomain: string;
  onDomainChange: (domain: string) => void;
}

export const DomainSidebar: React.FC<DomainSidebarProps> = ({ activeDomain, onDomainChange }) => {
  return (
    <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/30 flex-shrink-0">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">配置域导航 (Tabs)</h3>
      </div>
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {DOMAINS.map(domain => (
          <button
            key={domain}
            onClick={() => onDomainChange(domain)}
            className={`w-full text-left px-6 py-3 text-xs font-medium transition-all border-l-2 ${
              activeDomain === domain
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'
            }`}
          >
            {domain}
          </button>
        ))}
      </div>
    </aside>
  );
};
