import React from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';

interface BulkEditModalProps {
  count: number;
  onClose: () => void;
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({ count, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-[500px] overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
          <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
             <h3 className="font-bold text-white text-lg">Bulk Edit ({count} Items)</h3>
             <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
          </div>
          
          <div className="p-6 space-y-4">
             <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-400 mt-0.5" />
                <p className="text-xs text-amber-200/80">Changes applied here will affect all {count} selected standards. This action creates a new draft version for published items.</p>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Change Status</label>
                <select className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-indigo-500">
                   <option value="">No Change</option>
                   <option value="Draft">Draft</option>
                   <option value="Review">Review</option>
                   <option value="Published">Published</option>
                   <option value="Deprecated">Deprecated</option>
                </select>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Assign Owner</label>
                <input type="text" placeholder="Enter username..." className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Add Tags</label>
                <input type="text" placeholder="e.g. Core, PII..." className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
             </div>
          </div>

          <div className="p-5 border-t border-slate-700 bg-slate-900/50 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">Cancel</button>
             <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 transition-colors flex items-center gap-2">
                <Save size={16} /> Apply Changes
             </button>
          </div>
       </div>
    </div>
  );
};