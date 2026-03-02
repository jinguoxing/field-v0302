import React, { useState } from 'react';
import { AlertOctagon, Filter } from 'lucide-react';
import { ConflictCard } from '../components/standards/ai/conflict/ConflictCard';
import { CONFLICT_ITEMS_MOCK } from '../constants';
import { ConflictType } from '../types';

export const AIConflictHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConflictType | 'all'>('all');

  const tabs = [
     { id: 'all', label: '全部' },
     { id: 'homonym', label: '同名不同义' },
     { id: 'synonym', label: '同义不同名' },
     { id: 'overlap', label: '语义重叠' },
     { id: 'indicator_clash', label: '指标口径冲突' },
  ];

  const filteredConflicts = activeTab === 'all' 
     ? CONFLICT_ITEMS_MOCK 
     : CONFLICT_ITEMS_MOCK.filter(c => c.type === activeTab);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 animate-in fade-in duration-500">
       
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <AlertOctagon className="text-amber-400" /> 冲突合并中心 <span className="text-slate-600">/</span> Conflict Hub
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               自动检测并解决标准定义中的冗余与冲突。
             </p>
          </div>
       </div>

       {/* Filters */}
       <div className="flex items-center justify-between bg-slate-800/50 p-1 rounded-xl border border-slate-700">
          <div className="flex gap-1">
             {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                   {tab.label}
                </button>
             ))}
          </div>
          <button className="p-2 text-slate-400 hover:text-white mr-2">
             <Filter size={18} />
          </button>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-y-auto min-h-0 pb-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
             {filteredConflicts.map(item => (
                <ConflictCard key={item.id} conflict={item} />
             ))}
          </div>
          
          {filteredConflicts.length === 0 && (
             <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                <p>当前分类下暂无冲突</p>
             </div>
          )}
       </div>
    </div>
  );
};