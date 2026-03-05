import React from 'react';
import { Plus, X } from 'lucide-react';
import { PartialRule, TYPE_OPTIONS, ROLE_OPTIONS } from './types';

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  newRuleForm: PartialRule;
  onFormChange: (form: PartialRule) => void;
}

export type { PartialRule };

export const CreateRuleModal: React.FC<CreateRuleModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  newRuleForm,
  onFormChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus size={16} className="text-indigo-400" />
            新建裁决规则
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">规则名称</label>
              <input
                type="text"
                value={newRuleForm.name || ''}
                onChange={(e) => onFormChange({ ...newRuleForm, name: e.target.value })}
                placeholder="例如: Custom_Regex_Rule"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">优先级</label>
              <input
                type="number"
                value={newRuleForm.priority || 50}
                onChange={(e) => onFormChange({ ...newRuleForm, priority: parseInt(e.target.value) || 50 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">匹配条件 (Regex)</label>
            <input
              type="text"
              value={newRuleForm.regex || ''}
              onChange={(e) => onFormChange({ ...newRuleForm, regex: e.target.value })}
              placeholder="例如: .*_status$"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">映射类型 (Type)</label>
              <select
                value={newRuleForm.type || 'ID'}
                onChange={(e) => onFormChange({ ...newRuleForm, type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {TYPE_OPTIONS.slice(0, 4).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">映射角色 (Role)</label>
              <select
                value={newRuleForm.role || 'PK'}
                onChange={(e) => onFormChange({ ...newRuleForm, role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {ROLE_OPTIONS.slice(0, 4).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
            <p className="text-[10px] text-indigo-400/80 leading-relaxed">
              <strong className="text-indigo-400">提示：</strong> 规则创建后将立即进入"待生效"状态，您可以在保存配置前通过右侧的"即时仿真"面板验证规则效果。
            </p>
          </div>
        </div>
        <div className="p-5 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={onCreate}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            创建规则
          </button>
        </div>
      </div>
    </div>
  );
};
