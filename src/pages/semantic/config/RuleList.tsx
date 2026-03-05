import React from 'react';
import { Search, Plus, X } from 'lucide-react';
import { Rule } from './types';

interface RuleListProps {
  rules: Rule[];
  selectedRuleId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRuleSelect: (id: string) => void;
  onRuleToggle: (id: string) => void;
  onRuleDelete: (id: string) => void;
  onCreateRule: () => void;
}

export const RuleList: React.FC<RuleListProps> = ({
  rules,
  selectedRuleId,
  searchQuery,
  onSearchChange,
  onRuleSelect,
  onRuleToggle,
  onRuleDelete,
  onCreateRule,
}) => {
  const filteredRules = rules.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.regex.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      <div className="p-3 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300">规则列表</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
            <input
              type="text"
              placeholder="搜索规则..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-48 bg-slate-950 border border-slate-800 rounded-md pl-7 pr-3 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={onCreateRule}
            className="p-1 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500">状态</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500">优先级</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500">规则名称</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500">匹配条件</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredRules.length > 0 ? filteredRules.map(rule => (
              <tr
                key={rule.id}
                onClick={() => onRuleSelect(rule.id)}
                className={`${selectedRuleId === rule.id ? 'bg-indigo-500/10' : 'hover:bg-white/[0.02]'} transition-colors cursor-pointer group`}
              >
                <td className="px-4 py-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRuleToggle(rule.id);
                    }}
                    className={`w-6 h-3 rounded-full relative transition-colors ${rule.enabled ? 'bg-emerald-500/20' : 'bg-slate-800'}`}
                  >
                    <div className={`absolute top-0.5 w-2 h-2 rounded-full transition-all ${
                      rule.enabled ? 'right-0.5 bg-emerald-500' : 'left-0.5 bg-slate-500'
                    }`}></div>
                  </button>
                </td>
                <td className="px-4 py-2 text-[10px] font-mono text-slate-400">{rule.priority}</td>
                <td className={`px-4 py-2 text-[10px] font-bold ${selectedRuleId === rule.id ? 'text-indigo-400' : 'text-slate-300'}`}>{rule.name}</td>
                <td className="px-4 py-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>name ~ /{rule.regex}/</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRuleDelete(rule.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all"
                  >
                    <X size={12} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[10px] text-slate-500 italic">
                  该配置域下暂无规则，点击右上角 "+" 新建。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
