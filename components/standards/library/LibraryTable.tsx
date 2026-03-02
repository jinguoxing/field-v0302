import React from 'react';
import { MoreHorizontal, FileText, Binary, Activity, ShieldAlert, CheckCircle2, Clock, User, AlertTriangle, Layers, Hash, AlignLeft, Download, Upload, Settings, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { StandardItem } from '../../../types';

interface LibraryTableProps {
  items: StandardItem[];
  selectedIds: string[];
  onSelectItem: (item: StandardItem) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Term': return <FileText size={16} className="text-blue-400" />;
    case 'DataElement': return <Binary size={16} className="text-cyan-400" />;
    case 'Indicator': return <Activity size={16} className="text-emerald-400" />;
    case 'Rule': return <ShieldAlert size={16} className="text-amber-400" />;
    case 'CodeSet': return <Hash size={16} className="text-violet-400" />;
    case 'NamingConvention': return <AlignLeft size={16} className="text-pink-400" />;
    default: return <Layers size={16} className="text-slate-400" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Published': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Draft': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    'Review': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Deprecated': 'bg-red-500/10 text-red-400 border-red-500/20 decoration-line-through',
  };
  
  const labels: Record<string, string> = {
    'Published': '已发布',
    'Draft': '草稿',
    'Review': '审核中',
    'Deprecated': '已废弃',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${styles[status] || styles['Draft']}`}>
      {labels[status] || status}
    </span>
  );
};

const SortableHeader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-300 group">
    {label}
    <ArrowUpDown size={12} className="text-slate-600 group-hover:text-slate-400" />
  </div>
);

export const LibraryTable: React.FC<LibraryTableProps> = ({ items, selectedIds, onSelectItem, onToggleSelect, onToggleSelectAll }) => {
  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const indeterminate = selectedIds.length > 0 && selectedIds.length < items.length;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg overflow-hidden flex-1 flex flex-col min-h-0">
      
      {/* Table Toolbar */}
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/30 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{items.length} Items</span>
         </div>
         <div className="flex items-center gap-2">
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Manage Columns">
               <Settings size={14} />
            </button>
            <div className="h-4 w-px bg-slate-700 mx-1"></div>
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Export">
               <Download size={14} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Import">
               <Upload size={14} />
            </button>
         </div>
      </div>

      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-900/90 sticky top-0 z-10 backdrop-blur-sm shadow-sm text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 border-b border-slate-700 w-12">
                <input 
                  type="checkbox" 
                  className="rounded bg-slate-800 border-slate-600 text-cyan-600 focus:ring-offset-slate-900 cursor-pointer"
                  checked={allSelected}
                  ref={input => { if (input) input.indeterminate = indeterminate; }}
                  onChange={onToggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 border-b border-slate-700"><SortableHeader label="名称 (Name)" /></th>
              <th className="px-4 py-4 border-b border-slate-700"><SortableHeader label="类型 (Type)" /></th>
              <th className="px-4 py-4 border-b border-slate-700"><SortableHeader label="状态 (Status)" /></th>
              <th className="px-4 py-4 border-b border-slate-700"><SortableHeader label="域 (Domain)" /></th>
              <th className="px-4 py-4 border-b border-slate-700"><SortableHeader label="引用 (Ref)" /></th>
              <th className="px-4 py-4 border-b border-slate-700"><SortableHeader label="健康度 (Health)" /></th>
              <th className="px-4 py-4 border-b border-slate-700"><SortableHeader label="Owner" /></th>
              <th className="px-4 py-4 border-b border-slate-700"><SortableHeader label="更新时间" /></th>
              <th className="px-6 py-4 border-b border-slate-700 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {items.map((item) => (
              <tr 
                key={item.id} 
                className={`hover:bg-slate-700/30 transition-colors cursor-pointer group ${selectedIds.includes(item.id) ? 'bg-indigo-900/10' : ''}`}
                onClick={() => onSelectItem(item)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input 
                     type="checkbox" 
                     className="rounded bg-slate-800 border-slate-600 text-cyan-600 focus:ring-offset-slate-900 cursor-pointer" 
                     checked={selectedIds.includes(item.id)}
                     onChange={() => onToggleSelect(item.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors font-mono">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.cnName}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                   <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-slate-800 border border-slate-700">
                         <TypeIcon type={item.type} />
                      </div>
                      <span className="text-xs text-slate-400">{item.type}</span>
                   </div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400 border border-slate-700">
                    {item.domain}
                  </span>
                </td>
                <td className="px-4 py-4">
                   <span className="text-xs font-mono text-slate-300">{item.refCount}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                     {item.complianceScore >= 90 ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                     ) : item.complianceScore > 60 ? (
                        <AlertTriangle size={14} className="text-amber-500" />
                     ) : (
                        <ShieldAlert size={14} className="text-red-500" />
                     )}
                     <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.complianceScore >= 90 ? 'bg-emerald-500' : item.complianceScore > 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${item.complianceScore}%` }}></div>
                     </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                   <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-400 border border-slate-600">
                         {item.owner.charAt(0)}
                      </div>
                      <span className="truncate max-w-[80px]">{item.owner}</span>
                   </div>
                </td>
                <td className="px-4 py-4">
                   <div className="text-xs text-slate-500 font-mono">
                      {item.updatedAt}
                   </div>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="px-6 py-3 border-t border-slate-700 bg-slate-800/50 flex items-center justify-between">
         <span className="text-xs text-slate-500">显示 1-10 共 {items.length} 条</span>
         <div className="flex gap-2">
            <button className="px-3 py-1 text-xs text-slate-400 border border-slate-600 rounded hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50">上一页</button>
            <button className="px-3 py-1 text-xs text-slate-400 border border-slate-600 rounded hover:bg-slate-700 hover:text-white transition-colors">下一页</button>
         </div>
      </div>
    </div>
  );
};