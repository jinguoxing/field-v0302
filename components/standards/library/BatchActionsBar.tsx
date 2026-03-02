import React from 'react';
import { Trash2, Edit, Tag, UserPlus, X, CheckSquare } from 'lucide-react';

interface BatchActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkEdit: () => void;
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({ selectedCount, onClearSelection, onBulkEdit }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-slate-600 shadow-2xl rounded-full px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-300">
       <div className="flex items-center gap-2 text-sm font-medium text-white border-r border-slate-600 pr-4">
          <div className="bg-cyan-500 text-white text-xs font-bold rounded px-1.5 min-w-[20px] text-center">
             {selectedCount}
          </div>
          <span>Selected</span>
          <button onClick={onClearSelection} className="ml-2 text-slate-400 hover:text-white">
             <X size={14} />
          </button>
       </div>

       <div className="flex items-center gap-2">
          <button onClick={onBulkEdit} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors group">
             <Edit size={14} className="text-indigo-400 group-hover:text-indigo-300" />
             Edit
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors group">
             <UserPlus size={14} className="text-emerald-400 group-hover:text-emerald-300" />
             Assign Owner
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors group">
             <Tag size={14} className="text-amber-400 group-hover:text-amber-300" />
             Tag
          </button>
          <div className="w-px h-4 bg-slate-600 mx-1"></div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400 text-xs font-medium transition-colors group">
             <Trash2 size={14} className="text-red-400 group-hover:text-red-300" />
             Delete
          </button>
       </div>
    </div>
  );
};