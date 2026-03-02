
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, ChevronRight, Brain, 
  CheckCircle2, AlertCircle, AlertTriangle, 
  Clock, Info, MoreHorizontal, ArrowRight,
  Database, Table2, LayoutGrid, List,
  History, Sparkles, Wand2, ShieldCheck,
  ChevronDown, ChevronUp, RefreshCw, X,
  Share2, Calculator, BarChart3, Book, FileText
} from 'lucide-react';
import { FieldDrawer } from '../../components/semantic/FieldDrawer';

type QueueType = 'AUTO_PASS' | 'NEEDS_CONFIRM' | 'CONFLICT' | 'ANOMALY' | 'IGNORE_CANDIDATE' | 'ALL';

interface FieldItem {
  id: string;
  name: string;
  dataType: string;
  table: string;
  type: string;
  role: string;
  confidence: number;
  gap?: number;
  route: QueueType;
  isKeyField: boolean;
  impact: number;
  risks: ('PII' | 'KeyField' | 'HighImpact')[];
  completeness: number;
}

// Mock Data
const initialFields: FieldItem[] = [
  { id: '1', name: 'order_id', dataType: 'BIGINT', table: 'orders', type: 'ID', role: 'PK', confidence: 0.98, gap: 0.85, completeness: 1.0, route: 'AUTO_PASS', isKeyField: true, impact: 95, risks: ['KeyField'] },
  { id: '2', name: 'cust_id', dataType: 'BIGINT', table: 'orders', type: 'ID', role: 'FK', confidence: 0.92, gap: 0.72, completeness: 0.98, route: 'AUTO_PASS', isKeyField: true, impact: 80, risks: ['KeyField'] },
  { id: '3', name: 'total_amt', dataType: 'DECIMAL', table: 'orders', type: 'MEASURE', role: 'VALUE', confidence: 0.85, gap: 0.12, completeness: 0.95, route: 'NEEDS_CONFIRM', isKeyField: false, impact: 70, risks: ['HighImpact'] },
  { id: '4', name: 'order_status', dataType: 'VARCHAR', table: 'orders', type: 'DIM', role: 'STATUS', confidence: 0.76, gap: 0.05, completeness: 0.88, route: 'CONFLICT', isKeyField: false, impact: 60, risks: [] },
  { id: '5', name: 'create_time', dataType: 'TIMESTAMP', table: 'orders', type: 'TIME', role: 'EVENT_TIME', confidence: 0.95, gap: 0.90, completeness: 1.0, route: 'AUTO_PASS', isKeyField: false, impact: 50, risks: [] },
  { id: '6', name: 'discount_code', dataType: 'VARCHAR', table: 'orders', type: 'DIM', role: 'CODE', confidence: 0.45, gap: 0.02, completeness: 0.32, route: 'ANOMALY', isKeyField: false, impact: 30, risks: [] },
  { id: '7', name: 'temp_col_01', dataType: 'VARCHAR', table: 'orders', type: 'UNKNOWN', role: 'NONE', confidence: 0.12, gap: 0.0, completeness: 0.05, route: 'IGNORE_CANDIDATE', isKeyField: false, impact: 10, risks: [] },
  { id: '8', name: 'user_phone', dataType: 'VARCHAR', table: 'users', type: 'DIM', role: 'PHONE', confidence: 0.88, gap: 0.15, completeness: 0.90, route: 'NEEDS_CONFIRM', isKeyField: false, impact: 85, risks: ['PII'] },
  { id: '9', name: 'payment_status', dataType: 'INT', table: 'orders', type: 'DIM', role: 'STATUS', confidence: 0.65, gap: 0.03, completeness: 0.75, route: 'CONFLICT', isKeyField: false, impact: 65, risks: [] },
];

export const FieldWorkbenchPage: React.FC = () => {
  const { lvId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const stage = searchParams.get('stage');
  const queue = searchParams.get('queue') || 'ALL';
  const fieldId = searchParams.get('fieldId');
  const focus = searchParams.get('focus');

  const [selectedField, setSelectedField] = React.useState<string | null>(fieldId);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [confidenceFilter, setConfidenceFilter] = React.useState<'ALL' | '高' | '中' | '低'>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeDrawer, setActiveDrawer] = React.useState<'EVIDENCE' | 'ALL_EVIDENCE' | 'GATE' | 'CANDIDATES' | null>(null);
  const [activeModal, setActiveModal] = React.useState<'BATCH_PREVIEW' | 'REANALYZE' | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'IDLE' | 'SAVING' | 'SUCCESS'>('IDLE');

  const [showAllTypes, setShowAllTypes] = React.useState(false);
  const [semanticSearchQuery, setSemanticSearchQuery] = React.useState('');
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([]);
  const [showMoreRoles, setShowMoreRoles] = React.useState(false);
  const [expandedRoleGroups, setExpandedRoleGroups] = React.useState<string[]>(['键与关系 (Keys & Relations)', '分析建模 (Analytics)']);
  const [isRoleLocked, setIsRoleLocked] = React.useState(false);
  const [linkageMessage, setLinkageMessage] = React.useState<string | null>(null);

  const compatibilityMap: Record<string, { whitelist: string[], defaultRole: string }> = {
    'TIME': {
      whitelist: ['EVENT_TIME', 'AUDIT_FIELD', 'PARTITION_KEY', 'DIMENSION', 'AUDIT', 'PARTITION'],
      defaultRole: 'EVENT_TIME'
    },
    'MEASURE': {
      whitelist: ['MEASURE', 'DIMENSION', 'AUDIT_FIELD', 'VALUE'],
      defaultRole: 'MEASURE'
    },
    'ID': {
      whitelist: ['PRIMARY_KEY', 'FOREIGN_KEY', 'BUSINESS_KEY', 'DIMENSION', 'PK', 'FK', 'UK'],
      defaultRole: 'PRIMARY_KEY'
    },
    'DIM': {
      whitelist: ['DIMENSION', 'SOFT_DELETE', 'DEGENERATE_DIM', 'TECHNICAL', 'IGNORE', 'STATUS', 'CODE', 'VALUE', 'CONTACT', 'PHONE'],
      defaultRole: 'DIMENSION'
    },
    'UNKNOWN': {
      whitelist: ['DIMENSION', 'TECHNICAL', 'IGNORE', 'NONE'],
      defaultRole: 'NONE'
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

  const roleTaxonomy = [
    {
      group: '键与关系 (Keys & Relations)',
      items: [
        { code: 'PRIMARY_KEY', name: '主键', desc: '唯一标识一行记录', example: '如 order_id', evidence: 'Unique Constraint' },
        { code: 'FOREIGN_KEY', name: '外键', desc: '关联其他表的主键', example: '如 user_id', evidence: 'Join Condition' },
        { code: 'BUSINESS_KEY', name: '业务主键', desc: '业务上的唯一标识', example: '如 order_sn', evidence: 'High Cardinality' }
      ]
    },
    {
      group: '分析建模 (Analytics)',
      items: [
        { code: 'DIMENSION', name: '维度', desc: '用于分组或过滤的属性', example: '如 status, type', evidence: 'Group By / Where' },
        { code: 'MEASURE', name: '度量', desc: '用于聚合计算的数值', example: '如 amount, count', evidence: 'Sum / Avg' },
        { code: 'DEGENERATE_DIM', name: '退化维度', desc: '没有对应维度表的维度属性', example: '如 order_no (订单号)', evidence: 'Group By without Join', advanced: true }
      ]
    },
    {
      group: '时间与分区 (Time & Partition)',
      items: [
        { code: 'EVENT_TIME', name: '事件时间', desc: '业务事件发生的物理时间', example: '如 create_time', evidence: 'Time Filter' },
        { code: 'PARTITION_KEY', name: '分区键', desc: '用于物理表分区的字段', example: '如 dt, p_date', evidence: 'Partition Pruning' },
        { code: 'AUDIT_FIELD', name: '审计字段', desc: '记录数据变更的时间或人员', example: '如 update_time', evidence: 'System Generated' }
      ]
    },
    {
      group: '治理与技术 (Governance & Technical)',
      items: [
        { code: 'SOFT_DELETE', name: '软删除', desc: '标记记录是否被删除', example: '如 is_deleted', evidence: 'Filter in all queries' },
        { code: 'TECHNICAL', name: '技术字段', desc: 'ETL过程产生的技术字段', example: '如 etl_job_id', evidence: 'No business usage' },
        { code: 'IGNORE', name: '忽略', desc: '业务无意义+低使用+低证据的最终处置', example: '如 temp_col', evidence: 'No usage' }
      ]
    }
  ];

  const toggleRoleGroup = (group: string) => {
    setExpandedRoleGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const semanticTaxonomy = [
    {
      group: '标识类',
      items: [
        { code: 'ID', role: 'PK', name: '主键/外键', highFreq: true },
        { code: 'DIM', role: 'CODE', name: '业务代码', highFreq: true },
        { code: 'ID', role: 'UK', name: 'UUID/哈希', highFreq: false }
      ]
    },
    {
      group: '名称文本类',
      items: [
        { code: 'DIM', role: 'VALUE', name: '名称', highFreq: true },
        { code: 'DIM', role: 'VALUE', name: '短文本', highFreq: true },
        { code: 'DIM', role: 'VALUE', name: '长描述', highFreq: false }
      ]
    },
    {
      group: '时间类',
      items: [
        { code: 'TIME', role: 'EVENT_TIME', name: '日期', highFreq: true },
        { code: 'TIME', role: 'EVENT_TIME', name: '日期时间', highFreq: true },
        { code: 'TIME', role: 'AUDIT', name: '时间', highFreq: false },
        { code: 'MEASURE', role: 'VALUE', name: '时长', highFreq: false }
      ]
    },
    {
      group: '金额数量类',
      items: [
        { code: 'MEASURE', role: 'VALUE', name: '金额', highFreq: true },
        { code: 'MEASURE', role: 'VALUE', name: '数量', highFreq: true },
        { code: 'MEASURE', role: 'VALUE', name: '单价', highFreq: false },
        { code: 'MEASURE', role: 'VALUE', name: '百分比', highFreq: false }
      ]
    },
    {
      group: '状态枚举类',
      items: [
        { code: 'DIM', role: 'STATUS', name: '状态', highFreq: true },
        { code: 'DIM', role: 'CODE', name: '枚举', highFreq: true },
        { code: 'DIM', role: 'STATUS', name: '布尔标志', highFreq: false }
      ]
    },
    {
      group: '联系方式网络类',
      items: [
        { code: 'DIM', role: 'PHONE', name: '电话', highFreq: true },
        { code: 'DIM', role: 'CONTACT', name: '邮箱', highFreq: true },
        { code: 'DIM', role: 'CONTACT', name: 'IP地址', highFreq: false },
        { code: 'DIM', role: 'CONTACT', name: '链接', highFreq: false }
      ]
    },
    {
      group: '未知',
      items: [
        { code: 'UNKNOWN', role: 'NONE', name: '未知', highFreq: true }
      ]
    }
  ];

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleTypeChange = (newType: string, newRole?: string) => {
    setEditValues(prev => {
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
      
      if (!newRole) {
        setLinkageMessage(`已根据语义类型 ${newType} 过滤字段角色候选。`);
        setTimeout(() => setLinkageMessage(null), 3000);
      }
      return { ...prev, type: newType, role: targetRole };
    });
  };

  const handleRoleChange = (newRole: string) => {
    setEditValues(prev => {
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

  // Action Handlers
  const handleConfirmTop1 = () => {
    setIsSaving(true);
    setSaveStatus('SAVING');
    setTimeout(() => {
      setFields(prev => prev.map(f => 
        f.id === currentField.id ? { ...f, route: 'AUTO_PASS' as QueueType } : f
      ));
      setIsSaving(false);
      setSaveStatus('SUCCESS');
      setTimeout(() => setSaveStatus('IDLE'), 2000);
      setIsEditing(false);
    }, 400);
  };

  const handleAcceptTop2 = () => {
    handleSwitchPlan('DIM', 'CODE');
  };

  const handleSwitchPlan = (type: string, role: string) => {
    setIsSaving(true);
    setSaveStatus('SAVING');
    setTimeout(() => {
      setFields(prev => prev.map(f => 
        f.id === currentField.id ? { ...f, type, role, route: 'AUTO_PASS' as QueueType } : f
      ));
      setIsSaving(false);
      setSaveStatus('SUCCESS');
      setTimeout(() => setSaveStatus('IDLE'), 2000);
      setIsEditing(false);
      setActiveDrawer(null);
    }, 400);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setSaveStatus('SAVING');
    setTimeout(() => {
      setFields(prev => prev.map(f => 
        f.id === currentField.id ? { ...f, type: editValues.type, role: editValues.role } : f
      ));
      setIsSaving(false);
      setSaveStatus('SUCCESS');
      setTimeout(() => setSaveStatus('IDLE'), 2000);
    }, 400);
  };

  const handleConfirmAndNext = () => {
    setIsSaving(true);
    setSaveStatus('SAVING');
    setTimeout(() => {
      // Update current field
      setFields(prev => prev.map(f => 
        f.id === currentField.id ? { ...f, type: editValues.type, role: editValues.role, route: 'AUTO_PASS' as QueueType } : f
      ));
      
      setIsSaving(false);
      setSaveStatus('SUCCESS');
      setTimeout(() => setSaveStatus('IDLE'), 2000);
      setIsEditing(false);
      
      // Find next field in queue
      const currentIndex = fields.findIndex(f => f.id === selectedField);
      if (currentIndex !== -1 && currentIndex < fields.length - 1) {
        setSelectedField(fields[currentIndex + 1].id);
      }
    }, 400);
  };

  // Mock Data
  const initialFields: FieldItem[] = [
    { id: '1', name: 'order_id', dataType: 'BIGINT', table: 'orders', type: 'ID', role: 'PK', confidence: 0.98, gap: 0.85, completeness: 1.0, route: 'AUTO_PASS', isKeyField: true, impact: 95, risks: ['KeyField'] },
    { id: '2', name: 'cust_id', dataType: 'BIGINT', table: 'orders', type: 'ID', role: 'FK', confidence: 0.92, gap: 0.72, completeness: 0.98, route: 'AUTO_PASS', isKeyField: true, impact: 80, risks: ['KeyField'] },
    { id: '3', name: 'total_amt', dataType: 'DECIMAL', table: 'orders', type: 'MEASURE', role: 'VALUE', confidence: 0.85, gap: 0.12, completeness: 0.95, route: 'NEEDS_CONFIRM', isKeyField: false, impact: 70, risks: ['HighImpact'] },
    { id: '4', name: 'order_status', dataType: 'VARCHAR', table: 'orders', type: 'DIM', role: 'STATUS', confidence: 0.76, gap: 0.05, completeness: 0.88, route: 'CONFLICT', isKeyField: false, impact: 60, risks: [] },
    { id: '5', name: 'create_time', dataType: 'TIMESTAMP', table: 'orders', type: 'TIME', role: 'EVENT_TIME', confidence: 0.95, gap: 0.90, completeness: 1.0, route: 'AUTO_PASS', isKeyField: false, impact: 50, risks: [] },
    { id: '6', name: 'discount_code', dataType: 'VARCHAR', table: 'orders', type: 'DIM', role: 'CODE', confidence: 0.45, gap: 0.02, completeness: 0.32, route: 'ANOMALY', isKeyField: false, impact: 30, risks: [] },
    { id: '7', name: 'temp_col_01', dataType: 'VARCHAR', table: 'orders', type: 'UNKNOWN', role: 'NONE', confidence: 0.12, gap: 0.0, completeness: 0.05, route: 'IGNORE_CANDIDATE', isKeyField: false, impact: 10, risks: [] },
    { id: '8', name: 'user_phone', dataType: 'VARCHAR', table: 'users', type: 'DIM', role: 'PHONE', confidence: 0.88, gap: 0.15, completeness: 0.90, route: 'NEEDS_CONFIRM', isKeyField: false, impact: 85, risks: ['PII'] },
    { id: '9', name: 'payment_status', dataType: 'INT', table: 'orders', type: 'DIM', role: 'STATUS', confidence: 0.65, gap: 0.03, completeness: 0.75, route: 'CONFLICT', isKeyField: false, impact: 65, risks: [] },
  ];

  const [fields, setFields] = React.useState<FieldItem[]>(initialFields);

  const getQueueOrder = (q: string) => {
    const order: Record<string, number> = {
      'CONFLICT': 0,
      'ANOMALY': 1,
      'NEEDS_CONFIRM': 2,
      'AUTO_PASS': 3,
      'IGNORE_CANDIDATE': 4,
    };
    return order[q] ?? 99;
  };

  const getConfidenceLevel = (conf: number) => {
    if (conf >= 0.9) return '高';
    if (conf >= 0.7) return '中';
    return '低';
  };

  const typeMap: Record<string, string> = {
    'ID': '标识',
    'DIM': '维度',
    'MEASURE': '度量',
    'TIME': '时间',
    'UNKNOWN': '未知'
  };

  const roleMap: Record<string, string> = {
    'PK': '主键',
    'FK': '外键',
    'UK': '唯一键',
    'STATUS': '状态',
    'CODE': '代码',
    'VALUE': '数值',
    'CONTACT': '联系方式',
    'EVENT_TIME': '事件时间',
    'AUDIT': '审计时间',
    'PARTITION': '分区键',
    'PHONE': '电话',
    'NONE': '无',
    'PRIMARY_KEY': '主键',
    'FOREIGN_KEY': '外键',
    'BUSINESS_KEY': '业务主键',
    'DIMENSION': '维度',
    'MEASURE': '度量',
    'DEGENERATE_DIM': '退化维度',
    'PARTITION_KEY': '分区键',
    'AUDIT_FIELD': '审计字段',
    'SOFT_DELETE': '软删除',
    'TECHNICAL': '技术字段',
    'IGNORE': '忽略'
  };

  const queueMap: Record<string, string> = {
    'CONFLICT': '冲突',
    'ANOMALY': '异常',
    'NEEDS_CONFIRM': '待确认',
    'AUTO_PASS': '自动通过',
    'IGNORE_CANDIDATE': '已忽略',
    'ALL': '全部'
  };

  const riskMap: Record<string, string> = {
    'PII': '敏感数据',
    'KeyField': '关键字段',
    'HighImpact': '高影响'
  };
  const filteredFields = fields
    .filter(f => queue === 'ALL' || f.route === queue)
    .filter(f => confidenceFilter === 'ALL' || getConfidenceLevel(f.confidence) === confidenceFilter)
    .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.table.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
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

  // Edit State
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

  const currentField = fields.find(f => f.id === selectedField) || fields[0];

  // Sync edit values when entering edit mode or changing field
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

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
      {/* TopBar */}
      <header className="border-b border-slate-800 bg-slate-900 flex flex-col px-6 py-3 flex-shrink-0 gap-3">
        {/* ... existing TopBar content ... */}
        <div className="flex items-center justify-between">
          {/* Left: Breadcrumb & Identity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Table2 size={16} />
              <span className="text-xs font-medium hover:text-slate-200 cursor-pointer">零售域订单模型</span>
              <ChevronRight size={14} />
              <span className="text-xs font-bold text-white">字段裁决</span>
            </div>
            
            <div className="h-4 w-px bg-slate-800"></div>
            
            {/* LvIdentityPill */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-200">retail_orders_lv</span>
              <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-1.5 py-0.5 rounded">retail.sales.orders</span>
              <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px] font-bold uppercase tracking-wider">
                草稿
              </span>
            </div>
          </div>

          {/* Middle: StageStepper */}
          <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs font-bold transition-all">
                1. 字段语义
              </button>
              <ChevronRight size={14} className="text-slate-600" />
              <button className="px-3 py-1 text-slate-500 hover:text-slate-300 rounded text-xs font-medium transition-all">
                2. 表结构
              </button>
              <ChevronRight size={14} className="text-slate-600" />
              <button className="px-3 py-1 text-slate-500 hover:text-slate-300 rounded text-xs font-medium transition-all">
                3. 对象生成
              </button>
            </div>
          </div>

          {/* Right: Global Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50" />
                仅看冲突
              </label>
            </div>
            
            <button className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
              <Sparkles size={14} />
              一键高置信通过
            </button>
            
            <button 
              onClick={() => setActiveModal('REANALYZE')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              重新分析
            </button>
            
            <button 
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
              title="门禁未通过：存在 2 个 MUST 冲突"
            >
              <CheckCircle2 size={14} />
              预览并发布
            </button>
          </div>
        </div>
        
        {/* Sub-header: GateBar */}
        <div className="flex items-center gap-4 text-xs bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
          <div 
            onClick={() => setActiveDrawer('GATE')}
            className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 px-2 py-1 rounded transition-colors"
          >
            <ShieldCheck size={14} className="text-rose-400" />
            <span className="text-slate-400">门禁 (强制):</span>
            <span className="font-bold text-rose-400">2 个未解决</span>
          </div>
          <div className="w-px h-3 bg-slate-800"></div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 px-2 py-1 rounded transition-colors">
            <LayoutGrid size={14} className="text-emerald-400" />
            <span className="text-slate-400">覆盖率:</span>
            <span className="font-bold text-emerald-400">92%</span>
            <span className="text-[10px] text-slate-500">(阈值 90%)</span>
          </div>
          <div className="w-px h-3 bg-slate-800"></div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 px-2 py-1 rounded transition-colors">
            <AlertTriangle size={14} className="text-amber-400" />
            <span className="text-slate-400">风险指数:</span>
            <span className="font-bold text-amber-400">中</span>
          </div>
        </div>
      </header>

      {/* Main Layout: 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: LeftPanel (Field Queue) */}
        <aside className="w-[400px] border-r border-slate-800 flex flex-col bg-slate-900/40 relative">
          {/* QueueTabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900/60">
            {[
              { id: 'ALL', label: '全部', icon: <LayoutGrid size={14} /> },
              { id: 'CONFLICT', label: '冲突', icon: <AlertCircle size={14} />, color: 'text-rose-400' },
              { id: 'ANOMALY', label: '异常', icon: <AlertTriangle size={14} />, color: 'text-amber-400' },
              { id: 'NEEDS_CONFIRM', label: '待确认', icon: <Clock size={14} />, color: 'text-cyan-400' },
              { id: 'AUTO_PASS', label: '自动', icon: <CheckCircle2 size={14} />, color: 'text-emerald-400' },
              { id: 'IGNORE_CANDIDATE', label: '忽略', icon: <X size={14} />, color: 'text-slate-500' },
            ].map((q) => (
              <button
                key={q.id}
                onClick={() => setSearchParams({ queue: q.id })}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 border-b-2 transition-all ${
                  queue === q.id 
                    ? 'border-indigo-500 bg-indigo-500/5 text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <span className={queue === q.id ? q.color : ''}>{q.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">{q.label}</span>
              </button>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="p-3 border-b border-slate-800 space-y-3 bg-slate-900/20">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索字段..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                {['高', '中', '低'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setConfidenceFilter(prev => prev === level ? 'ALL' : level as any)}
                    className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                      confidenceFilter === level 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FieldList */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="divide-y divide-slate-800/50">
              {filteredFields.map((f) => (
                <div 
                  key={f.id}
                  onClick={() => handleFieldSelect(f.id)}
                  className={`group p-3 cursor-pointer transition-all relative ${
                    selectedField === f.id ? 'bg-indigo-500/10' : 'hover:bg-white/5'
                  }`}
                >
                  {selectedField === f.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div 
                      onClick={(e) => toggleSelect(f.id, e)}
                      className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        selectedIds.includes(f.id) 
                          ? 'bg-indigo-600 border-indigo-500' 
                          : 'border-slate-700 bg-slate-950 group-hover:border-slate-500'
                      }`}
                    >
                      {selectedIds.includes(f.id) && <CheckCircle2 size={10} className="text-white" />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-mono font-bold text-slate-200 truncate">{f.name}</span>
                          <span className="text-[9px] text-slate-500 font-mono bg-slate-800/50 px-1 rounded uppercase">{f.dataType}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {f.route === 'CONFLICT' && <span className="px-1 py-0.5 bg-rose-500/10 text-rose-400 rounded text-[8px] font-bold">冲突</span>}
                          {f.route === 'ANOMALY' && <span className="px-1 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[8px] font-bold">异常</span>}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* CurrentDecisionBadge */}
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-800 rounded text-[9px] font-bold text-slate-300 border border-slate-700">
                          <span>{typeMap[f.type] || f.type}</span>
                          <span className="text-slate-600">/</span>
                          <span>{roleMap[f.role] || f.role}</span>
                        </div>

                        {/* ConfidenceLevel */}
                        <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                          getConfidenceLevel(f.confidence) === '高' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          getConfidenceLevel(f.confidence) === '中' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {getConfidenceLevel(f.confidence)} ({(f.confidence * 100).toFixed(0)}%)
                        </div>

                        {/* GapChip */}
                        {f.route === 'CONFLICT' && f.gap !== undefined && (
                          <div className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded text-[9px] font-bold border border-rose-500/30">
                            Gap: {f.gap.toFixed(2)}
                          </div>
                        )}

                        {/* RiskChips */}
                        {f.risks.map(risk => (
                          <div key={risk} className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                            risk === 'PII' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            risk === 'KeyField' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-orange-500/10 text-orange-400 border-orange-500/20'
                          }`}>
                            {riskMap[risk] || risk}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BatchSelectBar */}
          {selectedIds.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 bg-indigo-600 rounded-xl shadow-2xl shadow-indigo-500/40 p-3 flex items-center justify-between animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                  {selectedIds.length}
                </div>
                <span className="text-xs font-bold text-white">已选择</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setActiveModal('BATCH_PREVIEW')}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-all" 
                  title="批量预览"
                >
                  <Sparkles size={14} />
                </button>
                <button className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-all" title="应用到相似字段">
                  <Wand2 size={14} />
                </button>
                <button className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-200 transition-all" title="批量忽略">
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Column 2: Middle Content (Decision Canvas) */}
        <main className="flex-1 flex flex-col bg-slate-950 min-w-0 border-r border-slate-800 overflow-y-auto custom-scrollbar">
          {/* C1 FieldHeader */}
          <div className="p-6 border-b border-slate-800 bg-slate-900/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-mono font-bold text-white">{currentField.name}</h2>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs font-mono">{currentField.dataType}</span>
                <span className="text-slate-600">@</span>
                <span className="text-sm text-slate-400 font-medium">{currentField.table}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'KeyCandidate', icon: <ShieldCheck size={12} />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { label: 'UsedAsJoin', icon: <Share2 size={12} />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                { label: 'UsedAsAgg', icon: <Calculator size={12} />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                { label: 'TimeFilter', icon: <Clock size={12} />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                { label: 'PII', icon: <AlertTriangle size={12} />, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
              ].map(badge => (
                <div key={badge.label} className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border ${badge.color}`}>
                  {badge.icon}
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* C2 CurrentDecisionStrip */}
          <div className="px-6 py-3 bg-indigo-500/5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="text-xs text-slate-500">当前裁决:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{typeMap[currentField.type] || currentField.type}</span>
                <span className="text-slate-600">/</span>
                <span className="text-sm font-bold text-white">{roleMap[currentField.role] || currentField.role}</span>
                <span className="text-xs text-slate-400 ml-2">({currentField.name === 'order_id' ? '订单ID' : '字段业务名'})</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-slate-500 border border-slate-700">
                来源: 系统
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors">回滚</button>
              <div className="w-px h-3 bg-slate-800"></div>
              <button className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors">审计日志</button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* C3 PackageRecommendationArea */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-400" />
                  AI 推荐方案 (Packages)
                </h3>
                <span className="text-[10px] text-slate-600">基于 L2 语义引擎推断</span>
              </div>

              <div className="space-y-4">
                {/* Top1PackageCard (Large) */}
                <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-bl-xl">
                    TOP 1 推荐方案
                  </div>
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white">{typeMap[currentField.type] || currentField.type}</span>
                        <span className="text-slate-600 text-xl">/</span>
                        <span className="text-xl font-bold text-white">{roleMap[currentField.role] || currentField.role}</span>
                      </div>
                      <p className="text-lg font-bold text-indigo-400">{currentField.name === 'order_id' ? '订单主键 ID' : '业务名称'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-emerald-400">{(currentField.confidence * 100).toFixed(0)}%</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">置信度</div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    该字段在表 {currentField.table} 中表现为唯一标识符，且符合标准模型中的订单主键定义。
                    画像显示其基数与行数完全一致，且被多个下游视图作为关联键使用。
                  </p>

                  <div className="flex items-center gap-2 mb-8">
                    {['Join', 'Filter', 'KeyField'].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleConfirmTop1}
                      disabled={isSaving}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                      确认并应用此方案
                    </button>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all border border-slate-700"
                    >
                      编辑详情
                    </button>
                  </div>
                </div>

                {/* Top2PackageCard (Small) */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:bg-slate-900/60 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                      <Brain size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-200">维度 / 代码</span>
                        <span className="text-[10px] text-slate-500 font-mono">65% 置信度</span>
                      </div>
                      <p className="text-xs text-slate-500">备选方案：作为普通维度代码处理</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleAcceptTop2}
                    disabled={isSaving}
                    className="px-3 py-1.5 text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all disabled:opacity-50"
                  >
                    切换到此方案
                  </button>
                </div>

                {/* MoreCandidatesAccordion */}
                <button 
                  onClick={() => setActiveDrawer('CANDIDATES')}
                  className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest"
                >
                  <ChevronDown size={14} />
                  查看更多备选方案 (3)
                </button>
              </div>
            </section>

            {/* C4 KeyEvidenceTop3 */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  核心推断证据 (Top 3)
                </h3>
                <button 
                  onClick={() => setActiveDrawer('ALL_EVIDENCE')}
                  className="text-[10px] font-bold text-indigo-400 hover:underline"
                >
                  查看全维度证据列表
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: '元数据对齐', icon: <Database size={16} />, source: 'RULE', contribution: 45, signals: ['Name: 98%', 'Type: Match'] },
                  { title: '数据画像特征', icon: <BarChart3 size={16} />, source: 'LLM', contribution: 32, signals: ['Unique: 100%', 'Null: 0%'] },
                  { title: '血缘关联拓扑', icon: <Share2 size={16} />, source: 'RULE', contribution: 18, signals: ['Join: 12 times', 'Downstream: 5'] },
                ].map((ev, i) => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 bg-slate-800 rounded-lg text-slate-400 group-hover:text-indigo-400 transition-colors">
                        {ev.icon}
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${ev.source === 'RULE' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {ev.source === 'RULE' ? '规则' : '模型'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{ev.title}</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1">+{ev.contribution}% 贡献度</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ev.signals.map(s => (
                        <span key={s} className="text-[9px] text-slate-500 font-mono bg-slate-950 px-1 rounded">{s}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => setActiveDrawer('EVIDENCE')}
                      className="w-full pt-2 border-t border-slate-800 text-[9px] font-bold text-slate-600 group-hover:text-slate-400 flex items-center justify-center gap-1"
                    >
                      展开详情 <ChevronRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* C5 ImpactAndNext */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">影响分析与评估</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        确认后将自动关联至 <span className="text-indigo-400 font-bold">零售交易对象</span>，并支持 12 个相关指标的自动计算。
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        门禁预估：<span className="text-emerald-400 font-bold">MUST 冲突 -1</span>，覆盖率预计提升至 <span className="text-emerald-400 font-bold">94.5%</span>。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">快速操作</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-all flex items-center gap-2">
                      <Wand2 size={12} /> 应用到相似 (5)
                    </button>
                    <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-all flex items-center gap-2">
                      <Clock size={12} /> 标记待复核
                    </button>
                    <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-all flex items-center gap-2">
                      <AlertCircle size={12} /> 降级为未知
                    </button>
                    <button className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-[10px] font-bold border border-rose-500/20 transition-all flex items-center gap-2">
                      <X size={12} /> 设为忽略
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Column 3: RightPanel (Execution) */}
        <aside className="w-[400px] bg-slate-900/30 border-l border-slate-800 flex flex-col overflow-hidden">
          {!isEditing ? (
            /* D1 ReadOnlySummary */
            <div className="flex-1 flex flex-col">
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
            </div>
          ) : (
            /* D2 EditMode */
            <div className="flex-1 flex flex-col">
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
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 transition-all"
                >
                  <X size={16} />
                </button>
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
                      {/* Top 1 Recommendation */}
                      <label 
                        onClick={() => handleTypeChange(currentField.type, currentField.role)}
                        className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                          editValues.type === currentField.type && editValues.role === currentField.role
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
                        <div className="flex flex-wrap gap-1.5 pl-5.5">
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-medium border border-slate-700">命名 98%</span>
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-medium border border-slate-700">画像 100%</span>
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-medium border border-slate-700">血缘关联</span>
                        </div>
                      </label>

                      {/* Top 2 Candidate */}
                      <label 
                        onClick={() => handleTypeChange('DIM', 'CODE')}
                        className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                          editValues.type === 'DIM' && editValues.role === 'CODE'
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
                        <div className="flex flex-wrap gap-1.5 pl-5.5">
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-medium border border-slate-700">标准库匹配</span>
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-medium border border-slate-700">命名 65%</span>
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
                      <label className="flex items-center gap-1.5 cursor-pointer" onClick={(e) => e.stopPropagation()}>
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
                      {/* Top 1 Role */}
                      <label 
                        onClick={() => handleRoleChange(currentField.role)}
                        className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                          editValues.role === currentField.role
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
                        <div className="flex flex-wrap gap-1.5 pl-5.5">
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-medium border border-slate-700">基于血缘推断</span>
                        </div>
                      </label>

                      {/* Top 2 Role Candidate */}
                      <label 
                        onClick={() => handleRoleChange(editValues.type === 'TIME' ? 'PARTITION_KEY' : 'DIMENSION')}
                        className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                          editValues.role === (editValues.type === 'TIME' ? 'PARTITION_KEY' : 'DIMENSION')
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
                        <div className="flex flex-wrap gap-1.5 pl-5.5">
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-medium border border-slate-700">备选方案</span>
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
                                    className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all group ${
                                      editValues.role === item.code 
                                        ? 'bg-indigo-500/10 border-indigo-500/50' 
                                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <input type="radio" checked={editValues.role === item.code} readOnly className="hidden" />
                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${editValues.role === item.code ? 'border-indigo-500' : 'border-slate-700'}`}>
                                          {editValues.role === item.code && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                                        </div>
                                        <span className={`text-xs font-bold ${editValues.role === item.code ? 'text-white' : 'text-slate-300'}`}>
                                          {item.name}
                                        </span>
                                        {item.advanced && <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[8px] font-bold">高级</span>}
                                        {compat === 'HIGH' && <span className="text-[10px] text-emerald-400 flex items-center gap-0.5"><CheckCircle2 size={10}/> 兼容</span>}
                                        {compat === 'MED' && <span className="text-[10px] text-amber-400 flex items-center gap-0.5"><AlertTriangle size={10}/> 弱兼容</span>}
                                        {compat === 'LOW' && <span className="text-[10px] text-rose-400 flex items-center gap-0.5"><X size={10}/> 不兼容</span>}
                                      </div>
                                      <span className="text-[9px] text-slate-500 font-mono">{item.code}</span>
                                    </div>
                                    <div className="pl-5 space-y-1">
                                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                                      <div className="flex items-center gap-2 text-[9px]">
                                        <span className="text-slate-500">例子: {item.example}</span>
                                        <span className="text-slate-600">|</span>
                                        <span className="text-indigo-400/70">触发: {item.evidence}</span>
                                      </div>
                                    </div>
                                  </label>
                                )})}
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
                        onChange={(e) => setEditValues(prev => ({ ...prev, bizName: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600">业务描述 (BizDesc)</label>
                      <textarea 
                        rows={3}
                        value={editValues.bizDesc}
                        onChange={(e) => setEditValues(prev => ({ ...prev, bizDesc: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600">场景标签 (ScenarioTags)</label>
                      <div className="flex flex-wrap gap-2">
                        {['Join', 'Metric', 'Filter', 'PII', 'Audit'].map(tag => (
                          <button 
                            key={tag}
                            onClick={() => setEditValues(prev => ({
                              ...prev,
                              tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
                            }))}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-all ${
                              editValues.tags.includes(tag)
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

              {/* Footer Actions */}
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
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-700">
                    忽略建议
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="py-2 bg-slate-800 hover:bg-rose-500/10 text-rose-400 rounded-lg text-[10px] font-bold border border-slate-700"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* BottomSheets / Drawers / Modals */}
      
      {/* EvidenceDrawer (Single Evidence Detail) */}
      {activeDrawer === 'EVIDENCE' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setActiveDrawer(null)}></div>
          <div className="relative w-[500px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">元数据对齐证据</h3>
                  <p className="text-xs text-slate-500">维度: Metadata Alignment</p>
                </div>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">推断结论</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold">置信度: 98%</span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <p className="text-sm font-bold text-slate-200">字段名 {currentField.name} 与标准库中的 {currentField.name === 'order_id' ? '订单ID' : '标准字段'} 语义高度匹配</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    基于模糊匹配算法与语义嵌入模型，该字段在词法与语义层面上均与标准模型中的主键定义一致。
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">关键信号 (信号)</span>
                <div className="space-y-2">
                  {[
                    { label: '名称相似度', value: '0.98', desc: '编辑距离与语义嵌入' },
                    { label: '类型兼容性', value: '匹配', desc: 'BIGINT 匹配标准 INTEGER/LONG' },
                    { label: '上下文匹配', value: '高', desc: '在 "orders" 表上下文中发现' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
                      <div>
                        <p className="text-xs font-bold text-slate-300">{s.label}</p>
                        <p className="text-[10px] text-slate-500">{s.desc}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-400">{s.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">原始数据片段</span>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[10px] text-slate-400 overflow-x-auto">
                  <pre>{`{
  "source_field": "order_id",
  "target_standard": "OrderID",
  "match_score": 0.9842,
  "rules_applied": ["exact_match", "fuzzy_semantic_v2"],
  "timestamp": "2024-03-21T10:00:00Z"
}`}</pre>
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex items-center gap-3">
              <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all">
                采纳此证据
              </button>
              <button className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all border border-slate-700">
                标记为误报
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AllEvidenceDrawer (8 Dimensions List) */}
      {activeDrawer === 'ALL_EVIDENCE' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setActiveDrawer(null)}></div>
          <div className="relative w-[600px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div>
                <h3 className="text-lg font-bold text-white">全维度语义证据列表</h3>
                <p className="text-xs text-slate-500">当前字段: {currentField.name} | 覆盖率: 6/8 维度</p>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { dim: '元数据对齐', status: 'COVERED', score: 98, icon: <Database size={16} /> },
                  { dim: '数据画像', status: 'COVERED', score: 85, icon: <BarChart3 size={16} /> },
                  { dim: '血缘拓扑', status: 'COVERED', score: 72, icon: <Share2 size={16} /> },
                  { dim: '样本分析', status: 'MISSING', score: 0, icon: <List size={16} /> },
                  { dim: '标准词典', status: 'COVERED', score: 95, icon: <Book size={16} /> },
                  { dim: '历史裁决', status: 'COVERED', score: 60, icon: <History size={16} /> },
                  { dim: '业务上下文', status: 'COVERED', score: 45, icon: <Brain size={16} /> },
                  { dim: '用户反馈', status: 'MISSING', score: 0, icon: <Info size={16} /> },
                ].map((d, i) => (
                  <div key={i} className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    d.status === 'COVERED' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-950 border-slate-800/50 opacity-60'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${d.status === 'COVERED' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                        {d.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">{d.dim}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                          {d.status === 'COVERED' ? `置信度: ${d.score}%` : '数据缺失'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {d.status === 'MISSING' ? (
                        <button className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-lg text-[10px] font-bold border border-indigo-500/30 transition-all flex items-center gap-1.5">
                          <RefreshCw size={12} />
                          立即补齐
                        </button>
                      ) : (
                        <button className="text-[10px] font-bold text-slate-500 hover:text-slate-300 flex items-center gap-1">
                          查看详情 <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
              <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all border border-slate-700 flex items-center justify-center gap-2">
                <RefreshCw size={16} />
                重新扫描全维度证据
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GateDrawer (MUST Conflicts List) */}
      {activeDrawer === 'GATE' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setActiveDrawer(null)}></div>
          <div className="relative w-[450px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-rose-400" />
                <h3 className="text-lg font-bold text-white">门禁冲突列表 (MUST)</h3>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                <p className="text-xs text-rose-300 leading-relaxed">
                  当前存在 <span className="font-bold">2</span> 个 MUST 级别的门禁冲突，必须在发布前解决。
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { field: 'order_status', type: '语义冲突', desc: 'AI 识别为 STATUS，但标准库定义为 DIM_CODE', severity: 'MUST' },
                  { field: 'payment_status', type: '类型不匹配', desc: '物理类型为 INT，标准库要求为 VARCHAR', severity: 'MUST' },
                ].map((c, i) => (
                  <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group cursor-pointer" onClick={() => handleFieldSelect(fields.find(f => f.name === c.field)?.id || '1')}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slate-200">{c.field}</span>
                      <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 rounded text-[9px] font-bold border border-rose-500/20">{c.severity}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2">{c.type}</p>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{c.desc}</p>
                    <div className="flex items-center justify-end">
                      <button className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        立即跳转处理 <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidates Drawer */}
      {activeDrawer === 'CANDIDATES' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setActiveDrawer(null)}></div>
          <div className="relative w-[480px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Brain className="text-indigo-400" size={20} />
                <h2 className="text-lg font-bold text-white">语义备选方案列表</h2>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-indigo-500/5 border-b border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">当前分析字段</span>
                <span className="text-[10px] font-mono text-indigo-400">{currentField.name}</span>
              </div>
              <p className="text-xs text-slate-400">
                AI 基于元数据、样本数据及血缘关系共生成了 5 个可能的语义定义方案。
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {[
                { type: 'ID', role: 'PK', conf: 0.98, desc: 'Top 1: 订单主键，具有极高的唯一性和业务关联度。' },
                { type: 'DIM', role: 'CODE', conf: 0.65, desc: 'Top 2: 业务代码，作为普通维度属性进行切分。' },
                { type: 'MEASURE', role: 'VALUE', conf: 0.32, desc: 'Top 3: 数值度量，可能代表某种计数值。' },
                { type: 'TIME', role: 'AUDIT', conf: 0.15, desc: 'Top 4: 审计时间，记录数据变更的物理时间。' },
                { type: 'UNKNOWN', role: 'NONE', conf: 0.05, desc: 'Top 5: 无法识别，建议人工介入深度分析。' },
              ].map((cand, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 bg-slate-950 border rounded-xl space-y-3 transition-all ${
                    currentField.type === cand.type && currentField.role === cand.role
                      ? 'border-indigo-500 bg-indigo-500/5'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-200">{typeMap[cand.type] || cand.type} / {roleMap[cand.role] || cand.role}</span>
                        {idx === 0 && <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[9px] font-bold">推荐方案</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${cand.conf * 100}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{(cand.conf * 100).toFixed(0)}% 置信度</span>
                      </div>
                    </div>
                    {currentField.type === cand.type && currentField.role === cand.role ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                        <CheckCircle2 size={12} /> 当前应用
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleSwitchPlan(cand.type, cand.role)}
                        disabled={isSaving}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-all disabled:opacity-50"
                      >
                        切换到此方案
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{cand.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-950/50">
              <button 
                onClick={() => {
                  setActiveDrawer(null);
                  setIsEditing(true);
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-2"
              >
                <Wand2 size={14} />
                手动自定义方案
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BatchPreviewModal */}
      {activeModal === 'BATCH_PREVIEW' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal(null)}></div>
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">批量裁决预览</h3>
                  <p className="text-xs text-slate-500">正在对 {selectedIds.length} 个字段进行批量确认</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <section className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">变更 Diff 预览</h4>
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3 font-bold text-slate-400">字段名</th>
                        <th className="px-4 py-3 font-bold text-slate-400">当前决策</th>
                        <th className="px-4 py-3 font-bold text-slate-400"></th>
                        <th className="px-4 py-3 font-bold text-slate-400">更新后决策</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {fields.filter(f => selectedIds.includes(f.id)).map(f => (
                        <tr key={f.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-300">{f.name}</td>
                          <td className="px-4 py-3 text-slate-500">未知</td>
                          <td className="px-4 py-3"><ArrowRight size={12} className="text-slate-600" /></td>
                          <td className="px-4 py-3 font-bold text-emerald-400">{typeMap[f.type] || f.type} / {roleMap[f.role] || f.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">业务影响评估</h4>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">新增关联对象</span>
                      <span className="text-xs font-bold text-white">1 个</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">支持新指标</span>
                      <span className="text-xs font-bold text-white">12 个</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">下游血缘受影响</span>
                      <span className="text-xs font-bold text-amber-400">3 个视图</span>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">门禁状态变化</h4>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">强制冲突</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 line-through">2</span>
                        <ArrowRight size={10} className="text-slate-600" />
                        <span className="text-xs font-bold text-emerald-400">0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">字段覆盖率</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">92%</span>
                        <ArrowRight size={10} className="text-slate-600" />
                        <span className="text-xs font-bold text-emerald-400">98.5%</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="p-8 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-4">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all border border-slate-700">
                取消
              </button>
              <button className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                <CheckCircle2 size={18} />
                确认提交变更
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ReAnalyzePlanModal */}
      {activeModal === 'REANALYZE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal(null)}></div>
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <RefreshCw size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">重新分析配置</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <section className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">分析深度</h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className="p-4 bg-slate-950 border border-indigo-500/50 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group">
                    <input type="radio" name="depth" defaultChecked className="hidden" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">快速 (FAST)</span>
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">仅基于元数据与血缘进行快速推断，预计耗时 30s。</p>
                  </label>
                  <label className="p-4 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-all group">
                    <input type="radio" name="depth" className="hidden" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">深度 (DEEP)</span>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-800 flex items-center justify-center"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">包含全量数据采样与 LLM 语义分析，预计耗时 5-10min。</p>
                  </label>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">高级选项</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-900 transition-all">
                    <span className="text-xs text-slate-300">跳过数据采样</span>
                    <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-900 transition-all">
                    <span className="text-xs text-slate-300">仅分析未确认字段</span>
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50" />
                  </label>
                </div>
              </section>
            </div>

            <div className="p-8 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-4">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all border border-slate-700">
                取消
              </button>
              <button className="px-8 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20">
                开始分析
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BottomSheets / Bulk Actions */}
      <footer className="h-12 border-t border-slate-800 bg-slate-900 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <History size={12} />
            <span>最近分析: 2 分钟前 由 L2 引擎</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all">
            保存草案
          </button>
          <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all">
            确认并下一步
          </button>
        </div>
      </footer>
    </div>
  );
};
