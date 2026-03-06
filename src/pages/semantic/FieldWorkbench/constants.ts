import { QueueType, FieldItem } from './types';

export const initialFields: FieldItem[] = [
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

export const compatibilityMap: Record<string, { whitelist: string[], defaultRole: string }> = {
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

export const roleTaxonomy = [
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

export const semanticTaxonomy = [
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

export const typeMap: Record<string, string> = {
    'ID': '标识',
    'DIM': '维度',
    'MEASURE': '度量',
    'TIME': '时间',
    'UNKNOWN': '未知'
};

export const roleMap: Record<string, string> = {
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

export const queueMap: Record<string, string> = {
    'CONFLICT': '冲突',
    'ANOMALY': '异常',
    'NEEDS_CONFIRM': '待确认',
    'AUTO_PASS': '自动通过',
    'IGNORE_CANDIDATE': '已忽略',
    'ALL': '全部'
};

export const riskMap: Record<string, string> = {
    'PII': '敏感数据',
    'KeyField': '关键字段',
    'HighImpact': '高影响'
};
