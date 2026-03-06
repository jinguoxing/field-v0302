import React from 'react';
import {
    CheckCircle2, Wand2, FileText, History, X, Info, Search, ChevronUp, ChevronDown, RefreshCw, AlertTriangle, Database, AlertCircle
} from 'lucide-react';
import { FieldItem } from '../types';
import { typeMap, roleMap, compatibilityMap, roleTaxonomy, semanticTaxonomy } from '../constants';

interface ExecutionPanelProps {
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    currentField: FieldItem;
    saveStatus: string;
    isSaving: boolean;
    handleConfirmTop1: () => void;
    handleAcceptTop2: () => void;
    handleConfirmAndNext: () => void;
    handleSaveDraft: () => void;
    setShowHistory: (val: boolean) => void;
    editValues: any;
    setEditValues: (val: any) => void;
    linkageMessage: string | null;
    showAllTypes: boolean;
    setShowAllTypes: (val: boolean) => void;
    semanticSearchQuery: string;
    setSemanticSearchQuery: (val: string) => void;
    expandedGroups: string[];
    toggleGroup: (group: string) => void;
    handleSelectTaxonomy: (code: string, role: string) => void;
    isRoleLocked: boolean;
    setIsRoleLocked: (val: boolean) => void;
    showMoreRoles: boolean;
    setShowMoreRoles: (val: boolean) => void;
    expandedRoleGroups: string[];
    toggleRoleGroup: (group: string) => void;
    handleRoleChange: (role: string) => void;
    checkCompatibility: (type: string, role: string) => string;
    handleTypeChange: (type: string, role?: string) => void;
    setActiveDrawer: (drawer: any) => void;
}

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
    isEditing,
    setIsEditing,
    currentField,
    saveStatus,
    isSaving,
    handleConfirmTop1,
    handleAcceptTop2,
    handleConfirmAndNext,
    handleSaveDraft,
    setShowHistory,
    editValues,
    setEditValues,
    linkageMessage,
    showAllTypes,
    setShowAllTypes,
    semanticSearchQuery,
    setSemanticSearchQuery,
    expandedGroups,
    toggleGroup,
    handleSelectTaxonomy,
    isRoleLocked,
    setIsRoleLocked,
    showMoreRoles,
    setShowMoreRoles,
    expandedRoleGroups,
    toggleRoleGroup,
    handleRoleChange,
    checkCompatibility,
    handleTypeChange,
    setActiveDrawer
}) => {
    if (!isEditing) {
        return (
            <aside className="w-[400px] bg-slate-900/30 border-l border-slate-800 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">当前裁决详情</h3>
                        {saveStatus === 'SUCCESS' && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold animate-in fade-in slide-in-from-left-2">
                                <CheckCircle2 size={10} /> 已保存
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-bold border border-indigo-500/20 transition-all flex items-center gap-1.5"
                    >
                        <Wand2 size={12} />
                        编辑裁决
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">语义类型</p>
                                <p className="text-sm font-bold text-white">{typeMap[currentField.type] || currentField.type}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">字段角色</p>
                                <p className="text-sm font-bold text-white">{roleMap[currentField.role] || currentField.role}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">业务名称</p>
                            <p className="text-sm font-bold text-white">{currentField.name === 'order_id' ? '订单主键 ID' : '业务名称'}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">业务描述 / 场景</p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                该字段在表 {currentField.table} 中表现为唯一标识符，且符合标准模型中的订单主键定义。
                                画像显示其基数与行数完全一致，且被多个下游视图作为关联键使用。
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-2">
                                {['Join', 'Metric', 'Filter', 'PII'].map(tag => (
                                    <span key={tag} className="px-1.5 py-0.5 bg-slate-800 text-slate-500 rounded text-[9px] font-bold border border-slate-700">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 space-y-3">
                        <button
                            onClick={handleConfirmTop1}
                            disabled={isSaving}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            确认 Top 1 推荐
                        </button>
                        <button
                            onClick={handleAcceptTop2}
                            disabled={isSaving}
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            接受 Top 2 方案
                        </button>
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-[400px] bg-slate-900/30 border-l border-slate-800 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-indigo-500/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">编辑语义裁决</h3>
                    {saveStatus === 'SUCCESS' && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold animate-in fade-in slide-in-from-left-2">
                            <CheckCircle2 size={10} /> 已保存
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowHistory(true)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-400 transition-all" title="审计日志">
                        <History size={16} />
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {linkageMessage && (
                <div className="mx-6 mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                    <Info size={14} className="text-indigo-400 mt-0.5" />
                    <p className="text-xs text-indigo-300 leading-relaxed">{linkageMessage}</p>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Section 1: 语义类型 */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Section 1: 语义类型</h4>
                        <button
                            onClick={() => setShowAllTypes(!showAllTypes)}
                            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            {showAllTypes ? '收起全量类型' : '完整类型检索'}
                        </button>
                    </div>

                    {!showAllTypes ? (
                        <div className="space-y-3">
                            <label
                                onClick={() => handleTypeChange(currentField.type, currentField.role)}
                                className={`block p-3 rounded-xl border cursor-pointer transition-all ${editValues.type === currentField.type && editValues.role === currentField.role
                                    ? 'bg-indigo-500/10 border-indigo-500/50'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <input type="radio" checked={editValues.type === currentField.type && editValues.role === currentField.role} readOnly className="hidden" />
                                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${editValues.type === currentField.type && editValues.role === currentField.role ? 'border-indigo-500' : 'border-slate-700'}`}>
                                            {editValues.type === currentField.type && editValues.role === currentField.role && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                        </div>
                                        <span className={`text-sm font-bold ${editValues.type === currentField.type && editValues.role === currentField.role ? 'text-white' : 'text-slate-300'}`}>
                                            {typeMap[currentField.type] || currentField.type} / {roleMap[currentField.role] || currentField.role}
                                        </span>
                                    </div>
                                    <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[9px] font-bold">推荐</span>
                                </div>
                            </label>

                            <label
                                onClick={() => handleTypeChange('DIM', 'CODE')}
                                className={`block p-3 rounded-xl border cursor-pointer transition-all ${editValues.type === 'DIM' && editValues.role === 'CODE'
                                    ? 'bg-indigo-500/10 border-indigo-500/50'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <input type="radio" checked={editValues.type === 'DIM' && editValues.role === 'CODE'} readOnly className="hidden" />
                                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${editValues.type === 'DIM' && editValues.role === 'CODE' ? 'border-indigo-500' : 'border-slate-700'}`}>
                                            {editValues.type === 'DIM' && editValues.role === 'CODE' && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                        </div>
                                        <span className={`text-sm font-bold ${editValues.type === 'DIM' && editValues.role === 'CODE' ? 'text-white' : 'text-slate-300'}`}>
                                            维度 / 代码
                                        </span>
                                    </div>
                                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-bold">备选</span>
                                </div>
                            </label>

                            <button
                                onClick={() => setActiveDrawer('CANDIDATES')}
                                className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest border border-dashed border-slate-800 rounded-xl hover:border-slate-700"
                            >
                                <ChevronDown size={14} />
                                更多候选 (3)
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input
                                    type="text"
                                    value={semanticSearchQuery}
                                    onChange={(e) => setSemanticSearchQuery(e.target.value)}
                                    placeholder="搜索中文名 / CODE / 别名 / 分组..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {semanticTaxonomy.map(group => {
                                    const isExpanded = expandedGroups.includes(group.group) || semanticSearchQuery.length > 0;
                                    const filteredItems = group.items.filter(item =>
                                        item.name.includes(semanticSearchQuery) ||
                                        item.code.includes(semanticSearchQuery.toUpperCase()) ||
                                        group.group.includes(semanticSearchQuery)
                                    );

                                    if (semanticSearchQuery && filteredItems.length === 0) return null;

                                    return (
                                        <div key={group.group} className="border border-slate-800 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => toggleGroup(group.group)}
                                                className="w-full flex items-center justify-between p-3 bg-slate-900/80 hover:bg-slate-800 transition-colors"
                                            >
                                                <span className="text-xs font-bold text-slate-300">{group.group}</span>
                                                {isExpanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                                            </button>

                                            {isExpanded && (
                                                <div className="p-2 bg-slate-950 space-y-1">
                                                    {filteredItems.map(item => (
                                                        <button
                                                            key={`${item.code}-${item.role}-${item.name}`}
                                                            onClick={() => handleSelectTaxonomy(item.code, item.role)}
                                                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-indigo-500/10 text-left group transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-400">{item.name}</span>
                                                                <span className="text-[10px] text-slate-600 font-mono">{item.code}</span>
                                                            </div>
                                                            <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">选择</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>

                {/* Section 2: 字段角色 */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Section 2: 字段角色</h4>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <div
                                    onClick={() => setIsRoleLocked(!isRoleLocked)}
                                    className={`w-6 h-3.5 rounded-full transition-colors relative ${isRoleLocked ? 'bg-indigo-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-0.5 bottom-0.5 w-2.5 rounded-full bg-white transition-all ${isRoleLocked ? 'left-3' : 'left-0.5'}`}></div>
                                </div>
                                <span className="text-[10px] text-slate-400">锁定角色</span>
                            </label>
                        </div>
                        <button
                            onClick={() => setShowMoreRoles(!showMoreRoles)}
                            className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors"
                        >
                            {showMoreRoles ? '收起角色' : '更多角色'} {showMoreRoles ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                        </button>
                    </div>

                    {!showMoreRoles ? (
                        <div className="space-y-3">
                            <label
                                onClick={() => handleRoleChange(currentField.role)}
                                className={`block p-3 rounded-xl border cursor-pointer transition-all ${editValues.role === currentField.role
                                    ? 'bg-indigo-500/10 border-indigo-500/50'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <input type="radio" checked={editValues.role === currentField.role} readOnly className="hidden" />
                                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${editValues.role === currentField.role ? 'border-indigo-500' : 'border-slate-700'}`}>
                                            {editValues.role === currentField.role && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                        </div>
                                        <span className={`text-sm font-bold ${editValues.role === currentField.role ? 'text-white' : 'text-slate-300'}`}>
                                            {roleMap[currentField.role] || currentField.role}
                                        </span>
                                    </div>
                                    <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[9px] font-bold">推荐</span>
                                </div>
                            </label>

                            <label
                                onClick={() => handleRoleChange(editValues.type === 'TIME' ? 'PARTITION_KEY' : 'DIMENSION')}
                                className={`block p-3 rounded-xl border cursor-pointer transition-all ${editValues.role === (editValues.type === 'TIME' ? 'PARTITION_KEY' : 'DIMENSION')
                                    ? 'bg-indigo-500/10 border-indigo-500/50'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <input type="radio" checked={editValues.role === (editValues.type === 'TIME' ? 'PARTITION_KEY' : 'DIMENSION')} readOnly className="hidden" />
                                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${editValues.role === (editValues.type === 'TIME' ? 'PARTITION_KEY' : 'DIMENSION') ? 'border-indigo-500' : 'border-slate-700'}`}>
                                            {editValues.role === (editValues.type === 'TIME' ? 'PARTITION_KEY' : 'DIMENSION') && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                        </div>
                                        <span className={`text-sm font-bold ${editValues.role === (editValues.type === 'TIME' ? 'PARTITION_KEY' : 'DIMENSION') ? 'text-white' : 'text-slate-300'}`}>
                                            {roleMap[editValues.type === 'TIME' ? 'PARTITION_KEY' : 'DIMENSION'] || (editValues.type === 'TIME' ? '分区键' : '维度')}
                                        </span>
                                    </div>
                                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-bold">备选</span>
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {roleTaxonomy.map(group => {
                                const isExpanded = expandedRoleGroups.includes(group.group);
                                const visibleItems = group.items.filter(item => {
                                    if (isRoleLocked) return true;
                                    const rules = compatibilityMap[editValues.type];
                                    return !rules || rules.whitelist.includes(item.code);
                                });

                                if (visibleItems.length === 0) return null;

                                return (
                                    <div key={group.group} className="border border-slate-800 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleRoleGroup(group.group)}
                                            className="w-full flex items-center justify-between p-3 bg-slate-900/80 hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="text-xs font-bold text-slate-300">{group.group}</span>
                                            {isExpanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                                        </button>

                                        {isExpanded && (
                                            <div className="p-2 bg-slate-950 space-y-1">
                                                {visibleItems.map(item => {
                                                    const compat = checkCompatibility(editValues.type, item.code);
                                                    return (
                                                        <label
                                                            key={item.code}
                                                            onClick={() => handleRoleChange(item.code)}
                                                            className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all group ${editValues.role === item.code
                                                                ? 'bg-indigo-500/10 border-indigo-500/50'
                                                                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-xs font-bold ${editValues.role === item.code ? 'text-white' : 'text-slate-300'}`}>
                                                                        {item.name}
                                                                    </span>
                                                                    {item['advanced'] && <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[8px] font-bold">高级</span>}
                                                                    {compat === 'HIGH' && <span className="text-[10px] text-emerald-400 flex items-center gap-0.5"><CheckCircle2 size={10} /> 兼容</span>}
                                                                    {compat === 'MED' && <span className="text-[10px] text-amber-400 flex items-center gap-0.5"><AlertTriangle size={10} /> 弱兼容</span>}
                                                                    {compat === 'LOW' && <span className="text-[10px] text-rose-400 flex items-center gap-0.5"><X size={10} /> 不兼容</span>}
                                                                </div>
                                                                <span className="text-[9px] text-slate-500 font-mono">{item.code}</span>
                                                            </div>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Section 3: 业务名/描述/场景 */}
                <section className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Section 3: 业务名 / 描述 / 场景</h4>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-600">业务名称 (BizName)</label>
                            <input
                                type="text"
                                value={editValues.bizName}
                                onChange={(e) => setEditValues((prev: any) => ({ ...prev, bizName: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-600">业务描述 (BizDesc)</label>
                            <textarea
                                rows={3}
                                value={editValues.bizDesc}
                                onChange={(e) => setEditValues((prev: any) => ({ ...prev, bizDesc: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-600">场景标签 (ScenarioTags)</label>
                            <div className="flex flex-wrap gap-2">
                                {['Join', 'Metric', 'Filter', 'PII', 'Audit'].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setEditValues((prev: any) => ({
                                            ...prev,
                                            tags: prev.tags.includes(tag) ? prev.tags.filter((t: string) => t !== tag) : [...prev.tags, tag]
                                        }))}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-all ${editValues.tags.includes(tag)
                                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                            : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:border-slate-700'
                                            }`}
                                    >
                                        {tag}
                                        {editValues.tags.includes(tag) && <X size={10} />}
                                    </button>
                                ))}
                                <button className="px-2 py-1 bg-slate-800 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-700 border-dashed flex items-center gap-1">
                                    + 添加
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/60 space-y-2">
                <button
                    onClick={handleConfirmAndNext}
                    disabled={isSaving}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    确认并下一步
                </button>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-700 flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                        <FileText size={12} />
                        保存草案
                    </button>
                    <button className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-700">
                        标记复核
                    </button>
                </div>
            </div>
        </aside>
    );
};
