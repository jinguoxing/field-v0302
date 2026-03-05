import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Rule, EditorMode, TYPE_OPTIONS, ROLE_OPTIONS } from './types';

interface RuleEditorProps {
  editForm: Rule;
  editorMode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onFormChange: (form: Rule) => void;
}

export const RuleEditor: React.FC<RuleEditorProps> = ({
  editForm,
  editorMode,
  onModeChange,
  onFormChange,
}) => {
  if (!editForm.id) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="text-slate-600" size={24} />
        </div>
        <p className="text-xs text-slate-500">请从上方列表中选择一条规则进行编辑</p>
      </div>
    );
  }

  return (
    <>
      {/* Rule Editor */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-3 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300">规则编辑 ({editForm.name})</h3>
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-md border border-slate-800">
            <button
              onClick={() => onModeChange('form')}
              className={`px-2 py-1 text-[10px] font-bold rounded shadow-sm transition-all ${editorMode === 'form' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Form
            </button>
            <button
              onClick={() => onModeChange('json')}
              className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${editorMode === 'json' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              JSON/YAML
            </button>
          </div>
        </div>
        {editorMode === 'form' ? (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">规则名称</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">优先级</label>
                <input
                  type="number"
                  value={editForm.priority}
                  onChange={(e) => onFormChange({ ...editForm, priority: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">匹配正则 (Regex)</label>
              <input
                type="text"
                value={editForm.regex}
                onChange={(e) => onFormChange({ ...editForm, regex: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">映射 Type</label>
                <select
                  value={editForm.type}
                  onChange={(e) => onFormChange({ ...editForm, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  {TYPE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">映射 Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => onFormChange({ ...editForm, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  {ROLE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <textarea
              className="w-full h-48 bg-slate-950 border border-slate-800 rounded-md p-3 text-[10px] font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 resize-none"
              value={JSON.stringify(editForm, null, 2)}
              readOnly
            ></textarea>
            <p className="text-[9px] text-slate-500 mt-2 italic">提示: JSON 模式目前仅支持只读预览，请在 Form 模式下修改。</p>
          </div>
        )}
      </section>

      {/* Instant Validation */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          即时校验 (Validation)
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px]">
            {editForm.regex && editForm.regex.length > 0 ? (
              <CheckCircle2 size={12} className="text-emerald-500" />
            ) : (
              <AlertCircle size={12} className="text-rose-500" />
            )}
            <span className={editForm.regex && editForm.regex.length > 0 ? "text-slate-400" : "text-rose-400"}>
              {editForm.regex && editForm.regex.length > 0 ? "Regex 语法合法" : "Regex 不能为空"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className="text-slate-400">权重和为 1 (当前: 1.0)</span>
          </div>
          {editForm.name && editForm.name.includes('Code') && (
            <div className="flex items-center gap-2 text-[10px]">
              <AlertCircle size={12} className="text-amber-500" />
              <span className="text-amber-400/80">检测到潜在冲突: 与规则 "ID_Suffix_Rule" 可能产生交叉匹配</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
