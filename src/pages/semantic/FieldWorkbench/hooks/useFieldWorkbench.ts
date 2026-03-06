import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FieldItem, QueueType } from '../types';
import { initialFields, compatibilityMap, typeMap, roleMap, queueMap } from '../constants';

export const useFieldWorkbench = () => {
    const { lvId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const stage = searchParams.get('stage');
    const queue = searchParams.get('queue') || 'ALL';
    const fieldId = searchParams.get('fieldId');
    const focus = searchParams.get('focus');

    const [fields, setFields] = React.useState<FieldItem[]>(initialFields);
    const [selectedField, setSelectedField] = React.useState<string | null>(fieldId || initialFields[0]?.id || null);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [confidenceFilter, setConfidenceFilter] = React.useState<'ALL' | '高' | '中' | '低'>('ALL');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);
    const [activeDrawer, setActiveDrawer] = React.useState<'EVIDENCE' | 'ALL_EVIDENCE' | 'GATE' | 'CANDIDATES' | null>(null);
    const [activeModal, setActiveModal] = React.useState<'BATCH_PREVIEW' | 'REANALYZE' | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);
    const [saveStatus, setSaveStatus] = React.useState<'IDLE' | 'SAVING' | 'SUCCESS'>('IDLE');
    const [showHistory, setShowHistory] = React.useState(false);

    const [showAllTypes, setShowAllTypes] = React.useState(false);
    const [semanticSearchQuery, setSemanticSearchQuery] = React.useState('');
    const [expandedGroups, setExpandedGroups] = React.useState<string[]>([]);
    const [showMoreRoles, setShowMoreRoles] = React.useState(false);
    const [expandedRoleGroups, setExpandedRoleGroups] = React.useState<string[]>(['键与关系 (Keys & Relations)', '分析建模 (Analytics)']);
    const [isRoleLocked, setIsRoleLocked] = React.useState(false);
    const [linkageMessage, setLinkageMessage] = React.useState<string | null>(null);

    const [editValues, setEditValues] = React.useState<{
        type: string;
        role: string;
        bizName: string;
        bizDesc: string;
        tags: string[];
    }>({
        type: '',
        role: '',
        bizName: '',
        bizDesc: '',
        tags: []
    });

    const [historyMap, setHistoryMap] = React.useState<Record<string, any[]>>(() => {
        const map: Record<string, any[]> = {};
        initialFields.forEach(f => {
            map[f.id] = [
                {
                    id: `init-${f.id}`,
                    timestamp: new Date(Date.now() - 120000).toLocaleString(),
                    operator: 'L2 引擎',
                    action: 'AI 初始推荐',
                    changes: {},
                    snapshot: { ...f }
                }
            ];
        });
        return map;
    });

    const currentField = fields.find(f => f.id === selectedField) || fields[0];

    React.useEffect(() => {
        if (currentField && isEditing) {
            setEditValues({
                type: currentField.type,
                role: currentField.role,
                bizName: currentField.name === 'order_id' ? '订单主键 ID' : currentField.name,
                bizDesc: `该字段在表 ${currentField.table} 中表现为唯一标识符，且符合标准模型中的订单主键定义。画像显示其基数与行数完全一致。`,
                tags: ['Join', 'Metric', 'Filter', 'PII']
            });
        }
    }, [currentField.id, isEditing]);

    const recordHistory = (fieldId: string, action: string, oldState: FieldItem, newState: FieldItem) => {
        const changes: any = {};
        if (oldState.type !== newState.type) changes.type = { from: typeMap[oldState.type] || oldState.type, to: typeMap[newState.type] || newState.type };
        if (oldState.role !== newState.role) changes.role = { from: roleMap[oldState.role] || oldState.role, to: roleMap[newState.role] || newState.role };
        if (oldState.route !== newState.route) changes.route = { from: queueMap[oldState.route] || oldState.route, to: queueMap[newState.route] || newState.route };

        if (Object.keys(changes).length === 0 && action !== '回滚版本') return;

        setHistoryMap(prev => ({
            ...prev,
            [fieldId]: [
                {
                    id: Date.now().toString(),
                    timestamp: new Date().toLocaleString(),
                    operator: '当前用户',
                    action,
                    changes,
                    snapshot: { ...newState }
                },
                ...(prev[fieldId] || [])
            ]
        }));
    };

    const getConfidenceLevel = (conf: number) => {
        if (conf >= 0.9) return '高';
        if (conf >= 0.7) return '中';
        return '低';
    };

    const filteredFields = fields
        .filter(f => queue === 'ALL' || f.route === queue)
        .filter(f => confidenceFilter === 'ALL' || getConfidenceLevel(f.confidence) === confidenceFilter)
        .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.table.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            const getQueueOrder = (q: string) => {
                const order: Record<string, number> = { 'CONFLICT': 0, 'ANOMALY': 1, 'NEEDS_CONFIRM': 2, 'AUTO_PASS': 3, 'IGNORE_CANDIDATE': 4 };
                return order[q] ?? 99;
            };
            const qA = getQueueOrder(a.route);
            const qB = getQueueOrder(b.route);
            if (qA !== qB) return qA - qB;
            if (a.isKeyField !== b.isKeyField) return a.isKeyField ? -1 : 1;
            if (b.impact !== a.impact) return b.impact - a.impact;
            return a.confidence - b.confidence;
        });

    const handleFieldSelect = (id: string) => {
        setSelectedField(id);
        setSearchParams(prev => {
            prev.set('fieldId', id);
            return prev;
        });
    };

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredFields.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredFields.map(f => f.id));
        }
    };

    const checkCompatibility = (type: string, role: string) => {
        const rules = compatibilityMap[type];
        if (!rules) return 'UNKNOWN';
        if (rules.whitelist.includes(role)) {
            if (rules.defaultRole === role) return 'HIGH';
            return 'MED';
        }
        return 'LOW';
    };

    const handleTypeChange = (newType: string, newRole?: string) => {
        setEditValues((prev: any) => {
            const rules = compatibilityMap[newType];
            const targetRole = newRole || prev.role;

            if (rules && !rules.whitelist.includes(targetRole)) {
                if (!isRoleLocked) {
                    setLinkageMessage(`字段角色已不兼容（${newType} × ${targetRole}）。已为你推荐 ${rules.defaultRole}。`);
                    setTimeout(() => setLinkageMessage(null), 4000);
                    return { ...prev, type: newType, role: rules.defaultRole };
                } else {
                    setLinkageMessage(`注意：当前锁定的角色 ${targetRole} 与类型 ${newType} 不兼容。`);
                    setTimeout(() => setLinkageMessage(null), 4000);
                    return { ...prev, type: newType };
                }
            }
            return { ...prev, type: newType, role: targetRole };
        });
    };

    const handleRoleChange = (newRole: string) => {
        setEditValues((prev: any) => {
            let recommendedType = '';
            if (['MEASURE', 'VALUE'].includes(newRole)) recommendedType = 'MEASURE';
            else if (['EVENT_TIME', 'AUDIT_FIELD', 'PARTITION_KEY', 'AUDIT', 'PARTITION'].includes(newRole)) recommendedType = 'TIME';
            else if (['PRIMARY_KEY', 'FOREIGN_KEY', 'BUSINESS_KEY', 'PK', 'FK', 'UK'].includes(newRole)) recommendedType = 'ID';

            if (recommendedType && prev.type !== recommendedType) {
                setLinkageMessage(`你选择了角色 ${newRole}，语义类型更可能是 ${recommendedType}（已为你排序置顶）。`);
                setTimeout(() => setLinkageMessage(null), 4000);
            }
            return { ...prev, role: newRole };
        });
    };

    const handleSelectTaxonomy = (code: string, role: string) => {
        handleTypeChange(code, role);
        setShowAllTypes(false);
    };

    const autoNext = () => {
        const currentIndex = filteredFields.findIndex(f => f.id === selectedField);
        if (currentIndex !== -1 && currentIndex < filteredFields.length - 1) {
            handleFieldSelect(filteredFields[currentIndex + 1].id);
        }
    };

    const handleConfirmTop1 = () => {
        setIsSaving(true);
        setSaveStatus('SAVING');
        setTimeout(() => {
            const oldState = fields.find(f => f.id === currentField.id)!;
            const newState = { ...oldState, route: 'AUTO_PASS' as QueueType };
            setFields(prev => prev.map(f => f.id === currentField.id ? newState : f));
            recordHistory(currentField.id, '确认推荐方案', oldState, newState);
            setIsSaving(false);
            setSaveStatus('SUCCESS');
            setTimeout(() => setSaveStatus('IDLE'), 2000);
            setIsEditing(false);
            autoNext();
        }, 400);
    };

    const handleSwitchPlan = (type: string, role: string) => {
        setIsSaving(true);
        setSaveStatus('SAVING');
        setTimeout(() => {
            const oldState = fields.find(f => f.id === currentField.id)!;
            const newState = { ...oldState, type, role, route: 'AUTO_PASS' as QueueType };
            setFields(prev => prev.map(f => f.id === currentField.id ? newState : f));
            recordHistory(currentField.id, '切换并确认方案', oldState, newState);
            setIsSaving(false);
            setSaveStatus('SUCCESS');
            setTimeout(() => setSaveStatus('IDLE'), 2000);
            setIsEditing(false);
            setActiveDrawer(null);
            autoNext();
        }, 400);
    };

    const handleAcceptTop2 = () => handleSwitchPlan('DIM', 'CODE');

    const handleConfirmAndNext = () => {
        setIsSaving(true);
        setSaveStatus('SAVING');
        setTimeout(() => {
            const oldState = fields.find(f => f.id === currentField.id)!;
            const newState = { ...oldState, type: editValues.type, role: editValues.role, route: 'AUTO_PASS' as QueueType };
            setFields(prev => prev.map(f => f.id === currentField.id ? newState : f));
            recordHistory(currentField.id, '确认并进入下一项', oldState, newState);
            setIsSaving(false);
            setSaveStatus('SUCCESS');
            setTimeout(() => setSaveStatus('IDLE'), 2000);
            setIsEditing(false);
            autoNext();
        }, 400);
    };

    const handleSaveDraft = () => {
        setIsSaving(true);
        setSaveStatus('SAVING');
        setTimeout(() => {
            const oldState = fields.find(f => f.id === currentField.id)!;
            const newState = { ...oldState, type: editValues.type, role: editValues.role };
            setFields(prev => prev.map(f => f.id === currentField.id ? newState : f));
            recordHistory(currentField.id, '保存草案', oldState, newState);
            setIsSaving(false);
            setSaveStatus('SUCCESS');
            setTimeout(() => setSaveStatus('IDLE'), 2000);
        }, 400);
    };

    const handleBatchPassHighConfidence = () => {
        setIsSaving(true);
        setSaveStatus('SAVING');
        setTimeout(() => {
            setFields(prev => {
                const newFields = [...prev];
                newFields.forEach((f, idx) => {
                    if (f.confidence >= 0.9 && f.route !== 'AUTO_PASS') {
                        const newState = { ...f, route: 'AUTO_PASS' as QueueType };
                        newFields[idx] = newState;
                        recordHistory(f.id, '一键高置信通过', f, newState);
                    }
                });
                return newFields;
            });
            setIsSaving(false);
            setSaveStatus('SUCCESS');
            setTimeout(() => setSaveStatus('IDLE'), 2000);
        }, 600);
    };

    const handleBatchIgnore = () => {
        setIsSaving(true);
        setSaveStatus('SAVING');
        setTimeout(() => {
            setFields(prev => {
                const newFields = [...prev];
                newFields.forEach((f, idx) => {
                    if (selectedIds.includes(f.id)) {
                        const newState = { ...f, type: 'UNKNOWN', role: 'IGNORE', route: 'IGNORE_CANDIDATE' as QueueType };
                        newFields[idx] = newState;
                        recordHistory(f.id, '批量忽略', f, newState);
                    }
                });
                return newFields;
            });
            setSelectedIds([]);
            setIsSaving(false);
            setSaveStatus('SUCCESS');
            setTimeout(() => setSaveStatus('IDLE'), 2000);
        }, 600);
    };

    const handleBatchApplySimilar = () => {
        if (!currentField) return;
        setIsSaving(true);
        setSaveStatus('SAVING');
        setTimeout(() => {
            setFields(prev => {
                const newFields = [...prev];
                newFields.forEach((f, idx) => {
                    if (selectedIds.includes(f.id) && f.id !== currentField.id) {
                        const newState = { ...f, type: currentField.type, role: currentField.role, route: 'AUTO_PASS' as QueueType };
                        newFields[idx] = newState;
                        recordHistory(f.id, '批量应用相似规则', f, newState);
                    }
                });
                return newFields;
            });
            setSelectedIds([]);
            setIsSaving(false);
            setSaveStatus('SUCCESS');
            setTimeout(() => setSaveStatus('IDLE'), 2000);
        }, 600);
    };

    const handleRollback = (snapshot: FieldItem) => {
        setIsSaving(true);
        setSaveStatus('SAVING');
        setTimeout(() => {
            const oldState = fields.find(f => f.id === currentField.id)!;
            const newState = { ...snapshot };
            setFields(prev => prev.map(f => f.id === currentField.id ? newState : f));
            recordHistory(currentField.id, '回滚版本', oldState, newState);
            setEditValues((prev: any) => ({ ...prev, type: newState.type, role: newState.role }));
            setIsSaving(false);
            setSaveStatus('SUCCESS');
            setTimeout(() => setSaveStatus('IDLE'), 2000);
            setShowHistory(false);
        }, 400);
    };

    const toggleGroup = (group: string) => setExpandedGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]);
    const toggleRoleGroup = (group: string) => setExpandedRoleGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]);

    return {
        stage,
        queue,
        fieldId,
        fields,
        selectedField,
        setSelectedField,
        selectedIds,
        setSelectedIds,
        confidenceFilter,
        setConfidenceFilter,
        searchQuery,
        setSearchQuery,
        isEditing,
        setIsEditing,
        activeDrawer,
        setActiveDrawer,
        activeModal,
        setActiveModal,
        isSaving,
        saveStatus,
        showHistory,
        setShowHistory,
        showAllTypes,
        setShowAllTypes,
        semanticSearchQuery,
        setSemanticSearchQuery,
        expandedGroups,
        showMoreRoles,
        setShowMoreRoles,
        expandedRoleGroups,
        isRoleLocked,
        setIsRoleLocked,
        linkageMessage,
        editValues,
        setEditValues,
        historyMap,
        currentField,
        filteredFields,
        handleFieldSelect,
        toggleSelect,
        handleSelectAll,
        checkCompatibility,
        handleTypeChange,
        handleRoleChange,
        handleSelectTaxonomy,
        handleConfirmTop1,
        handleAcceptTop2,
        handleConfirmAndNext,
        handleSaveDraft,
        handleBatchPassHighConfidence,
        handleBatchIgnore,
        handleBatchApplySimilar,
        handleRollback,
        handleSwitchPlan,
        toggleGroup,
        toggleRoleGroup,
        setSearchParams
    };
};
