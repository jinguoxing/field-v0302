import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { SettingsSidebar } from '../components/settings/SettingsSidebar';
import { TaxonomyPanel } from '../components/settings/TaxonomyPanel';
import { WorkflowPanel } from '../components/settings/WorkflowPanel';
import { TemplatePanel } from '../components/settings/TemplatePanel';
import { DictionaryPanel } from '../components/settings/DictionaryPanel';
import { AIConfigPanel } from '../components/settings/AIConfigPanel';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('taxonomy');

  const renderContent = () => {
     switch (activeTab) {
        case 'taxonomy': return <TaxonomyPanel />;
        case 'workflow': return <WorkflowPanel />;
        case 'templates': return <TemplatePanel />;
        case 'dictionary': return <DictionaryPanel />;
        case 'ai': return <AIConfigPanel />;
        default: return <TaxonomyPanel />;
     }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Settings className="text-slate-400" /> 系统配置 <span className="text-slate-600">/</span> Settings
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               全域分类标准、审批流、元数据模板与 AI 引擎参数管理。
             </p>
          </div>
       </div>
       
       <div className="flex flex-1 gap-6 min-h-0">
          <SettingsSidebar activeTab={activeTab} onSelectTab={setActiveTab} />
          <div className="flex-1 min-w-0">
             {renderContent()}
          </div>
       </div>
    </div>
  );
};