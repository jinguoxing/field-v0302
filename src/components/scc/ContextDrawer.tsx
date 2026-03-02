
import React from 'react';
import { X, GitBranch, History, Share2, FileText } from 'lucide-react';

interface ContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContextDrawer: React.FC<ContextDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 z-40 flex flex-col">
      <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-800">
        <h3 className="font-bold text-white">上下文信息</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Section 1: Lineage */}
        <section>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <GitBranch size={14} /> 血缘影响
          </h4>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 h-48 flex items-center justify-center text-slate-600 text-sm">
            [ 血缘图谱占位符 ]
          </div>
          <div className="mt-2 text-xs text-slate-500">
            当前变更将影响下游 <span className="text-white font-bold">12</span> 个报表和 <span className="text-white font-bold">3</span> 个 API。
          </div>
        </section>

        {/* Section 2: History */}
        <section>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <History size={14} /> 最近变更
          </h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0"></div>
              <div>
                <div className="text-sm text-slate-300">自动采纳了 15 个高置信度字段</div>
                <div className="text-xs text-slate-500 mt-1">10 分钟前 • AI Agent</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-600 shrink-0"></div>
              <div>
                <div className="text-sm text-slate-300">人工修正了 user_id 映射</div>
                <div className="text-xs text-slate-500 mt-1">2 小时前 • Admin</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Evidence */}
        <section>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText size={14} /> 核心证据
          </h4>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 text-xs text-slate-400 leading-relaxed">
            该表的元数据特征与 <span className="text-indigo-400">Customer_Master</span> 标准高度吻合 (98%)。主要依据是主键分布和列名相似度。
          </div>
        </section>

      </div>
    </div>
  );
};
