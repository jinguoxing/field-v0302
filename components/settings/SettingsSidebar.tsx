import React from 'react';
import { LayoutGrid, GitPullRequest, FileCode, Book, Sparkles } from 'lucide-react';

interface SettingsSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'taxonomy', label: '分类体系', icon: LayoutGrid },
    { id: 'workflow', label: '审批工作流', icon: GitPullRequest },
    { id: 'templates', label: '标准模板', icon: FileCode },
    { id: 'dictionary', label: '词根与词典', icon: Book },
    { id: 'ai', label: 'AI 引擎配置', icon: Sparkles },
  ];

  return (
    <div className="w-64 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-lg backdrop-blur-sm h-full">
       <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="text-sm font-bold text-slate-200">系统设置</h3>
       </div>
       <div className="p-2 space-y-1">
          {tabs.map(tab => (
             <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}
             >
                <tab.icon size={16} />
                {tab.label}
             </button>
          ))}
       </div>
    </div>
  );
};