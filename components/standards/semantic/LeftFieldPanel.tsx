import React from 'react';
import { Search, Filter, Key, AlertTriangle, Shield, CheckCircle2, ChevronRight, Hash, Eye } from 'lucide-react';
import { SemanticField } from '../../../types';

interface LeftFieldPanelProps {
  fields: SemanticField[];
  selectedIds: string[];
  onSelect: (field: SemanticField) => void;
  onToggleId: (id: string) => void;
  selectedFieldId?: string;
}

const ConfidenceBar = ({ value }: { value: number }) => {
  let color = 'bg-red-500';
  if (value >= 80) color = 'bg-emerald-500';
  else if (value >= 50) color = 'bg-amber-500';

  return (
    <div className="h-1 w-16 bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
    </div>
  );
};

export const LeftFieldPanel: React.FC<LeftFieldPanelProps> = ({ fields, selectedIds, onSelect, onToggleId, selectedFieldId }) => {
  const statusMap: Record<string, string> = {
    'All': '全部',
    'Pending': '待处理',
    'Conflict': '冲突'
  };

  return (
    <div className="w-[280px] flex flex-col h-full bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
      {/* 1. Header Stats Bar */}
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 grid grid-cols-3 gap-2">
         <div className="text-center">
            <span className="text-[10px] text-slate-500 uppercase block">总数 (Total)</span>
            <span className="text-sm font-bold text-white">{fields.length}</span>
         </div>
         <div className="text-center border-l border-slate-700">
            <span className="text-[10px] text-slate-500 uppercase block">待处理</span>
            <span className="text-sm font-bold text-amber-400">{fields.filter(f => f.status !== 'Resolved').length}</span>
         </div>
         <div className="text-center border-l border-slate-700">
            <span className="text-[10px] text-slate-500 uppercase block">高风险</span>
            <span className="text-sm font-bold text-red-400">{fields.filter(f => f.riskLevel === 'High').length}</span>
         </div>
      </div>

      {/* 2. Filter Action Area */}
      <div className="p-3 border-b border-slate-700 bg-slate-900/30 flex flex-col gap-3">
         {/* Status Segmented Control */}
         <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            {['All', 'Pending', 'Conflict'].map(status => (
               <button key={status} className="flex-1 py-1 text-[10px] font-medium rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  {statusMap[status] || status}
               </button>
            ))}
         </div>
         
         {/* Filters */}
         <div className="flex gap-2">
            <div className="relative flex-1">
               <input type="text" placeholder="筛选字段..." className="w-full pl-2 pr-6 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 outline-none focus:border-indigo-500" />
               <Filter size={10} className="absolute right-2 top-2 text-slate-500" />
            </div>
            <button className="p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-400 hover:text-white">
               <Key size={12} />
            </button>
         </div>
      </div>

      {/* 3. Field List Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
         {/* Header Batch Actions */}
         <div className="flex items-center justify-between px-2 py-1">
            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
               <input type="checkbox" className="rounded bg-slate-800 border-slate-600 text-indigo-500" />
               全选
            </label>
            <span className="text-[10px] text-slate-600">按风险排序</span>
         </div>

         {/* Field Cards */}
         {fields.map(field => {
            const isSelected = selectedFieldId === field.id;
            const isChecked = selectedIds.includes(field.id);

            return (
               <div 
                  key={field.id}
                  onClick={() => onSelect(field)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all group relative overflow-hidden ${isSelected ? 'bg-indigo-900/20 border-indigo-500/50 shadow-md' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
               >
                  {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                  
                  <div className="flex items-start gap-3">
                     <div onClick={(e) => { e.stopPropagation(); onToggleId(field.id); }}>
                        <input 
                           type="checkbox" 
                           checked={isChecked}
                           readOnly
                           className="mt-1 rounded bg-slate-900 border-slate-600 text-indigo-500 focus:ring-offset-slate-900 cursor-pointer" 
                        />
                     </div>
                     <div className="flex-1 min-w-0">
                        {/* Title Row */}
                        <div className="flex justify-between items-start mb-1">
                           <div className="flex items-center gap-1.5 truncate">
                              <span className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>{field.name}</span>
                              {field.tags.includes('PK') && <Key size={10} className="text-amber-400 flex-shrink-0" />}
                              {field.tags.includes('PII') && <Shield size={10} className="text-red-400 flex-shrink-0" />}
                           </div>
                           {field.status === 'Resolved' && <CheckCircle2 size={12} className="text-emerald-500" />}
                           {field.status === 'Conflict' && <AlertTriangle size={12} className="text-amber-500" />}
                        </div>

                        {/* Semantic Row */}
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                           <span className="font-mono text-[10px]">{field.dataType}</span>
                           <span className={`px-1.5 py-0.5 rounded text-[10px] border ${field.riskLevel === 'High' ? 'bg-red-900/20 text-red-400 border-red-500/20' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                              {field.currentSemanticType || '未知'}
                           </span>
                        </div>

                        {/* Status Row */}
                        <div className="flex items-center justify-between">
                           <ConfidenceBar value={field.confidence} />
                           <span className="text-[10px] text-slate-500 font-mono">{field.confidence}%</span>
                        </div>
                     </div>
                  </div>
               </div>
            );
         })}
      </div>
    </div>
  );
};
