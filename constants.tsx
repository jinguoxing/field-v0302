
// ... [Keep imports and other constants unchanged] ...
import { DataSource, TableEntity, TableField, ERNode, ERLink, QualityOverview, QualityRule, StandardItem, AIDraft, AlignmentTask, ConflictItem, EvalMetric, RegressionCase, LogicalView, BusinessObject, Metric, ValidationRun, GatePolicy, DriftItem, WaiverRequest, ImpactAnalysis, DependencyNode, DependencyLink, OpsOverview, GovernancePriority, StandardReuseStats, CollabTask, ReviewDetail, ChangeLogEntry, TaxonomyNode, ApprovalWorkflow, StandardTemplate, DictionaryEntry, AISettings, MetricAsset, MetricVersion } from './types';
import { Database, FileText, Server, HardDrive } from 'lucide-react';

// ... [DATA_SOURCES, TABLES, FIELDS_MOCK, ER_NODES, ER_LINKS, QUALITY_OVERVIEW_MOCK, QUALITY_RULES_MOCK...]

export const DATA_SOURCES: DataSource[] = [
  { id: 'ds1', name: 'CRM_主数据库', type: 'MySQL', tableCount: 24 },
  { id: 'ds2', name: '订单管理数据库', type: 'MySQL', tableCount: 12 },
  { id: 'ds3', name: '分析数仓', type: 'PostgreSQL', tableCount: 45 },
  { id: 'ds4', name: '旧版_ERP_系统', type: 'Oracle', tableCount: 88 },
  { id: 'ds5', name: '用户行为日志', type: 'MongoDB', tableCount: 5 },
];

export const TABLES: TableEntity[] = [
  {
    id: 't1',
    name: 't_hr_employee',
    description: '员工主数据表',
    dataSource: 'HR_Master_DB',
    rowCount: 3500,
    status: 'completed',
    progress: 100,
    totalFields: 5,
    riskScore: 0,
    lastUpdated: '2024-06-20',
  },
  {
    id: 't2',
    name: 't_hr_department',
    description: '部门信息表',
    dataSource: 'HR_Master_DB',
    rowCount: 120,
    status: 'review_required',
    progress: 75,
    totalFields: 4,
    riskScore: 1,
    lastUpdated: '2024-06-20',
  },
  {
    id: 't3',
    name: 't_hr_payroll',
    description: '月度薪资记录',
    dataSource: 'Finance_DB',
    rowCount: 42000,
    status: 'pending',
    progress: 0,
    totalFields: 12,
    riskScore: 0,
    lastUpdated: '2024-06-20',
  },
  {
    id: 't4',
    name: 't_scm_supplier',
    description: '供应商详情表',
    dataSource: 'SCM_Supply_DB',
    rowCount: 1200,
    status: 'processing',
    progress: 40,
    totalFields: 25,
    riskScore: 0,
    lastUpdated: '2024-06-15',
  },
];

export const FIELDS_MOCK: TableField[] = [
  {
    id: 1,
    name: 'emp_id',
    description: '员工编号',
    dataType: 'varchar(20)',
    isPrimaryKey: true,
    isSensitive: false,
    sampleValues: ['E001', 'E002'],
  },
  {
    id: 2,
    name: 'full_name',
    description: '员工全名',
    dataType: 'varchar(50)',
    isPrimaryKey: false,
    isSensitive: true,
    sampleValues: ['张三', '李四'],
  },
  {
    id: 3,
    name: 'dept_id',
    description: '部门编号',
    dataType: 'int',
    isPrimaryKey: false,
    isSensitive: false,
    sampleValues: ['101', '102'],
  },
  {
    id: 4,
    name: 'job_level',
    description: '职级',
    dataType: 'varchar(10)',
    isPrimaryKey: false,
    isSensitive: false,
    sampleValues: ['L1', 'L2'],
  },
  {
    id: 5,
    name: 'email',
    description: '工作邮箱',
    dataType: 'varchar(100)',
    isPrimaryKey: false,
    isSensitive: true,
    sampleValues: ['zhangsan@co.com'],
  },
];

export const ER_NODES: ERNode[] = [
  {
    id: 'n1',
    title: '员工 (t_hr_employee)',
    type: '主数据',
    position: { x: 50, y: 150 },
    fields: [
      { name: 'emp_id', type: 'PK', isKey: true },
      { name: 'dept_id', type: 'FK' },
      { name: 'full_name', type: 'VARCHAR' },
    ],
  },
  {
    id: 'n2',
    title: '部门 (t_hr_dept)',
    type: '主数据',
    position: { x: 400, y: 50 },
    fields: [
      { name: 'dept_id', type: 'PK', isKey: true },
      { name: 'dept_name', type: 'VARCHAR' },
    ],
  },
  {
    id: 'n3',
    title: '薪资 (t_hr_payroll)',
    type: '事务',
    position: { x: 400, y: 300 },
    fields: [
      { name: 'trans_id', type: 'PK', isKey: true },
      { name: 'emp_id', type: 'FK' },
      { name: 'amount', type: 'DECIMAL' },
    ],
  },
  {
    id: 'n4',
    title: '绩效 (t_perf)',
    type: '日志',
    position: { x: 750, y: 150 },
    fields: [
      { name: 'review_id', type: 'PK', isKey: true },
      { name: 'emp_id', type: 'FK' },
      { name: 'rating', type: 'INT' },
    ],
  },
];

export const ER_LINKS: ERLink[] = [
  { id: 'l1', source: 'n2', target: 'n1' }, 
  { id: 'l2', source: 'n1', target: 'n3' }, 
  { id: 'l3', source: 'n1', target: 'n4' }, 
];

export const QUALITY_OVERVIEW_MOCK: QualityOverview = {
  score: 87,
  scannedRows: 3500,
  failedRows: 124,
  lastScan: '2024-06-20 10:23:45',
  dimensions: {
    completeness: 98,
    validity: 82,
    consistency: 90,
    uniqueness: 100,
    timeliness: 95,
    accuracy: 88,
  }
};

export const QUALITY_RULES_MOCK: QualityRule[] = [
  { id: 1, name: '主键非空检查', column: 'emp_id', type: '完整性', passRate: 100, status: 'pass', failedRows: 0, priority: 'High' },
  { id: 2, name: '邮箱格式校验', column: 'email', type: '有效性', passRate: 96.5, status: 'warning', failedRows: 122, priority: 'Medium' },
  { id: 3, name: '员工编号唯一性', column: 'emp_id', type: '唯一性', passRate: 100, status: 'pass', failedRows: 0, priority: 'High' },
  { id: 4, name: '职级字典值检查', column: 'job_level', type: '一致性', passRate: 92.2, status: 'fail', failedRows: 2, priority: 'Medium' },
  { id: 5, name: '入职日期逻辑校验', column: 'hire_date', type: '准确性', passRate: 99.9, status: 'pass', failedRows: 0, priority: 'Low' },
];

export const STANDARD_ITEMS_MOCK: StandardItem[] = [
  { id: 'std_001', name: 'Customer_ID', cnName: '客户统一标识', type: 'DataElement', status: 'Published', domain: '客户域', owner: '张三', version: '2.1.0', updatedAt: '2024-06-22', refCount: 42, complianceScore: 98, description: '企业范围内唯一标识一个自然人客户的编码，采用12位数字编码。', tags: ['核心', 'PII', '主键'] },
  { id: 'std_002', name: 'Mobile_Phone', cnName: '手机号码', type: 'DataElement', status: 'Published', domain: '通用域', owner: '李四', version: '1.0.0', updatedAt: '2024-05-10', refCount: 156, complianceScore: 85, description: '中国大陆境内使用的11位移动电话号码。', tags: ['PII', '联系方式'] },
  { id: 'std_003', name: 'Order_Status', cnName: '订单状态', type: 'Term', status: 'Review', domain: '供应链', owner: '王五', version: '0.9.0', updatedAt: '2024-06-23', refCount: 8, complianceScore: 60, description: '定义订单生命周期中的各个业务状态节点。', tags: ['枚举', '业务流程'] },
  // Rule 3 Scenario: Standard is v1.1.0, but Metric mv_002_v1 is bound to v1.0.0
  { id: 'std_004', name: 'DAU', cnName: '日活跃用户数', type: 'Indicator', status: 'Published', domain: '运营域', owner: '赵六', version: '1.1.0', updatedAt: '2024-06-28', refCount: 2, complianceScore: 100, description: '统计周期内，登录过应用的用户去重总数。', tags: ['核心指标', '增长'] },
  { id: 'std_005', name: 'Email_Format_Rule', cnName: '邮箱格式校验规则', type: 'Rule', status: 'Published', domain: '通用域', owner: 'System', version: '1.2', updatedAt: '2024-01-15', refCount: 200, complianceScore: 100, description: '标准的邮箱正则表达式校验规则。', tags: ['质量规则', '有效性'] },
  { id: 'std_006', name: 'Gender_Code_Set', cnName: '性别代码表', type: 'CodeSet', status: 'Published', domain: '通用域', owner: 'Admin', version: '1.0.0', updatedAt: '2024-02-01', refCount: 300, complianceScore: 100, description: 'GB/T 2261.1-2003 人的性别代码。', tags: ['国标', '基础'] },
  { id: 'std_007', name: 'Table_Naming_Conv', cnName: '表命名规范', type: 'NamingConvention', status: 'Published', domain: '技术标准', owner: 'DBA Team', version: '2.0', updatedAt: '2023-12-10', refCount: 1500, complianceScore: 92, description: '所有业务表必须以 t_{domain}_{biz} 格式命名。', tags: ['DDL', '强制'] },
  { id: 'std_gmv_def', name: 'GMV_Definition', cnName: 'GMV 标准定义', type: 'Indicator', status: 'Published', domain: '交易域', owner: 'Alice', version: '2.0', updatedAt: '2024-06-25', refCount: 5, complianceScore: 100, description: '全平台交易总额标准计算口径', tags: ['GMV', 'Revenue'] }
];

export const AI_DRAFTS_MOCK: AIDraft[] = [
   { id: 'draft_001', name: 'Supplier_Code', cnName: '供应商编码', type: 'DataElement', confidence: 95, description: '系统中唯一标识供应商的编码，通常由S开头后接8位数字组成。', sourceOrigin: 't_scm_supplier.supp_code', evidence: '字段注释包含"供应商唯一标识"，且数据分布呈现高基数特征。', status: 'pending' },
   { id: 'draft_002', name: 'Transaction_Amount', cnName: '交易金额', type: 'DataElement', confidence: 88, description: '单笔交易的货币数值，保留两位小数。', sourceOrigin: 't_order.amt', evidence: '字段类型为DECIMAL(18,2)，列名为amt/amount，且数值非负。', status: 'pending' },
   { id: 'draft_003', name: 'Active_User_Definition', cnName: '活跃用户定义', type: 'Term', confidence: 72, description: '在过去7天内有过至少一次登录行为的注册用户。', sourceOrigin: 'PRD文档_V2.0.pdf', evidence: '从上传的PRD文档"第3章 统计口径"中提取，语义匹配度72%。', status: 'pending' },
   { id: 'draft_004', name: 'Payment_Method_Enum', cnName: '支付方式枚举', type: 'Term', confidence: 92, description: '支付渠道的分类代码：1-支付宝, 2-微信, 3-银联, 4-现金。', sourceOrigin: 't_pay_flow.pay_type', evidence: '对字段值进行聚类分析，发现固定的4个枚举值分布。', status: 'pending' },
   { id: 'draft_005', name: 'Stock_Turnover_Rate', cnName: '库存周转率', type: 'Indicator', confidence: 65, description: '销售成本除以平均库存余额。', sourceOrigin: 'KPI_Report_2023.xlsx', evidence: '从报表公式推导，建议人工复核计算逻辑。', status: 'pending' }
];

export const ALIGNMENT_TASKS_MOCK: AlignmentTask[] = [
  { id: 'task_001', fieldId: 101, fieldName: 'emp_cd', fieldComment: '员工工号', tableName: 't_hr_employee_v2', status: 'unmapped', samples: ['E2024001', 'E2024002'], candidates: [{ id: 'std_010', name: 'Employee_ID', cnName: '员工工号', type: 'DataElement', confidence: 98, reason: '注释完全匹配，且样本符合规则。' }, { id: 'std_011', name: 'User_ID', cnName: '用户ID', type: 'DataElement', confidence: 45, reason: '语义相关但域不同。', isConflict: true }] },
  { id: 'task_002', fieldId: 102, fieldName: 'mobile', fieldComment: '联系方式', tableName: 't_hr_employee_v2', status: 'unmapped', samples: ['13800000000', '15912345678'], candidates: [{ id: 'std_002', name: 'Mobile_Phone', cnName: '手机号码', type: 'DataElement', confidence: 92, reason: '正则 ^1[3-9]\\d{9}$ 匹配成功。' }] },
  { id: 'task_003', fieldId: 103, fieldName: 'status', fieldComment: '状态', tableName: 't_hr_employee_v2', status: 'mapped', samples: ['1', '2', '99'], selectedCandidateId: 'std_003', candidates: [{ id: 'std_003', name: 'Emp_Status_Enum', cnName: '员工状态枚举', type: 'Term', confidence: 85, reason: '枚举值分布高度重合。' }] }
];

export const CONFLICT_ITEMS_MOCK: ConflictItem[] = [
  { id: 'conf_001', title: '用户标识命名冲突', type: 'synonym', riskLevel: 'High', similarity: 98, itemA: { name: 'User_ID', desc: '系统用户的唯一标识符，自增整数。', domain: '用户域' }, itemB: { name: 'Account_ID', desc: '账号的唯一主键，整型。', domain: '账号域' }, aiSuggestion: '检测到高度同义。建议合并为 "User_Account_ID" 并建立别名映射，或废弃 "Account_ID"。' },
  { id: 'conf_002', title: '状态码定义歧义', type: 'homonym', riskLevel: 'Medium', similarity: 100, itemA: { name: 'Status', desc: '订单流转状态 (1=新建, 2=支付)', domain: '交易域' }, itemB: { name: 'Status', desc: '记录逻辑删除状态 (0=正常, 1=删除)', domain: '通用域' }, aiSuggestion: '同名但业务含义完全不同。建议分别重命名为 "Order_Status" 和 "Record_Is_Deleted"。' },
  { id: 'conf_003', title: '客户等级枚举重叠', type: 'overlap', riskLevel: 'Low', similarity: 85, itemA: { name: 'Cust_Level', desc: '普通/白银/黄金/钻石', domain: '会员域' }, itemB: { name: 'Vip_Type', desc: '非会员/VIP/SVIP', domain: '营销域' }, aiSuggestion: '枚举范围存在部分重叠但无法直接映射。建议保留两者，或在应用层建立转换映射表。' }
];

export const EVALUATION_METRICS_MOCK: EvalMetric[] = [
  { label: 'AI 推荐命中率', value: '87.5%', trend: '+2.1%', trendDir: 'up' },
  { label: '人工采纳率', value: '92.3%', trend: '+0.5%', trendDir: 'up' },
  { label: '自动落标比例', value: '64.0%', trend: '+5.4%', trendDir: 'up' },
  { label: '冲突误报率', value: '3.2%', trend: '-1.2%', trendDir: 'up' }, 
];

export const REGRESSION_CASES_MOCK: RegressionCase[] = [
  { id: 'case_1', input: 'cust_nm (客户姓名)', aiOutput: 'Customer_Name', humanOutput: 'Customer_Name', result: 'match', date: '2024-06-25' },
  { id: 'case_2', input: 'txn_amt (交易额)', aiOutput: 'Transaction_Amount', humanOutput: 'Trade_Amount', result: 'mismatch', date: '2024-06-24' },
  { id: 'case_3', input: 'is_del (删除标记)', aiOutput: 'Logic_Delete_Flag', humanOutput: 'Is_Deleted', result: 'mismatch', date: '2024-06-24' },
  { id: 'case_4', input: 'phone (电话)', aiOutput: 'Mobile_Phone', humanOutput: 'Mobile_Phone', result: 'match', date: '2024-06-23' },
];

export const LOGICAL_VIEWS_MOCK: LogicalView[] = [
  { id: 'lv_001', name: 'v_customer_360', cnName: '客户360统一视图', domain: '客户域', fieldCount: 45, mappedCount: 42, complianceScore: 93, fields: [{ id: 'f1', name: 'cust_id', cnName: '客户ID', type: 'BIGINT', boundStandard: { id: 'std_001', name: 'Customer_ID', cnName: '客户统一标识' }, complianceStatus: 'passed' }, { id: 'f2', name: 'phone_no', cnName: '手机号', type: 'VARCHAR(20)', boundStandard: { id: 'std_002', name: 'Mobile_Phone', cnName: '手机号码' }, boundRules: ['Regex_Phone'], complianceStatus: 'passed' }, { id: 'f3', name: 'lvl_code', cnName: '等级代码', type: 'INT', boundCodeTable: 'CT_CUST_LEVEL', complianceStatus: 'failed' }] },
  { id: 'lv_002', name: 'v_order_summary', cnName: '订单汇总视图', domain: '交易域', fieldCount: 20, mappedCount: 15, complianceScore: 75, fields: [] },
  { id: 'lv_003', name: 'v_emp_active', cnName: '在职员工视图', domain: '人力资源', fieldCount: 12, mappedCount: 12, complianceScore: 100, fields: [] }
];

export const BUSINESS_OBJECTS_MOCK: BusinessObject[] = [
  { id: 'bo_001', name: 'Customer', cnName: '个人客户', domain: '客户域', status: 'Published', maturity: 'High', refCount: 15, description: '购买企业产品或服务的自然人实体。', attributes: [{ id: 'attr_1', name: 'customerIdentifier', cnName: '客户标识', dataType: 'String', isRequired: true, boundElement: 'Customer_ID' }, { id: 'attr_2', name: 'mobile', cnName: '手机号码', dataType: 'String', isRequired: true, boundElement: 'Mobile_Phone', sensitiveLevel: 'L3' }, { id: 'attr_3', name: 'registrationDate', cnName: '注册日期', dataType: 'Date', isRequired: true }] },
  { id: 'bo_002', name: 'SalesOrder', cnName: '销售订单', domain: '交易域', status: 'Published', maturity: 'Medium', refCount: 8, description: '客户购买商品或服务的契约记录。', attributes: [] },
  { id: 'bo_003', name: 'Product', cnName: '产品', domain: '产品域', status: 'Candidate', maturity: 'Low', refCount: 0, description: '可供销售的物品或服务单元。', attributes: [] }
];

export const METRICS_MOCK: Metric[] = [
  { id: 'm_001', name: 'GMV_Daily', cnName: '日成交总额', domain: '交易域', status: 'Online', isNorthStar: true, isPublic: true, definition: '统计周期内所有已支付订单的金额总和，包含运费。', dimensions: ['Region (地区)', 'Channel (渠道)', 'Product_Category (类目)'], period: 'Daily', expression: 'SUM(order_amt) WHERE pay_status = 1', owner: 'Alice Data' },
  { id: 'm_002', name: 'DAU', cnName: '日活跃用户数', domain: '运营域', status: 'Online', isNorthStar: false, isPublic: true, definition: '当日登录过应用的用户去重数。', dimensions: ['Platform (平台)', 'Version (版本)'], period: 'Daily', expression: 'COUNT(DISTINCT user_id) WHERE event = "login"', owner: 'Bob Ops' },
  { id: 'm_003', name: 'Refund_Rate', cnName: '退款率', domain: '服务域', status: 'Draft', isNorthStar: false, isPublic: false, definition: '退款订单数占总成交订单数的比例。', dimensions: ['Reason (原因)'], period: 'Monthly', expression: 'COUNT(refund_orders) / COUNT(paid_orders)', owner: 'Charlie Service' }
];

export const VALIDATION_RUNS_MOCK: ValidationRun[] = [
  { id: 'run_1001', scope: '全域_核心数据', ruleSet: 'Nightly_Critical_Check', startTime: '2024-06-26 02:00:00', duration: '12m 30s', status: 'warning', resultSummary: { total: 450, passed: 442, failed: 8 }, issues: [{ id: 'iss_1', targetName: 't_hr_employee.email', targetType: 'Field', issueType: '规则命中', severity: 'High', message: '存在 5 行数据不符合邮箱正则规则', suggestion: '数据已清洗，建议人工复核后重新运行' }, { id: 'iss_2', targetName: 'DAU', targetType: 'Metric', issueType: '口径漂移', severity: 'Medium', message: 'SQL 逻辑与标准定义不一致', suggestion: '检测到 SQL 变更，请更新标准定义或回滚代码' }] },
  { id: 'run_1000', scope: '交易域', ruleSet: 'Transaction_Stability', startTime: '2024-06-25 02:00:00', duration: '8m 15s', status: 'success', resultSummary: { total: 120, passed: 120, failed: 0 }, issues: [] }
];

export const GATE_POLICIES_MOCK: GatePolicy[] = [
  { id: 'pol_1', name: '核心表发布门禁', scope: 'Database: HR_Master_DB', requirements: ['必填字段覆盖率 100%', '敏感字段必须定义分级', '无高风险合规问题'], status: 'Active', lastCheckRate: 100 },
  { id: 'pol_2', name: '指标上线检查', scope: 'Domain: 交易域', requirements: ['必须引用原子指标', '必须指定所有维度'], status: 'Active', lastCheckRate: 92 },
  { id: 'pol_3', name: '通用数据质量门禁', scope: 'Global', requirements: ['空值率 < 5%'], status: 'Inactive', lastCheckRate: 0 },
];

export const DRIFT_ITEMS_MOCK: DriftItem[] = [
  { id: 'drift_1', target: 'CT_ORDER_STATUS', type: 'code_new_value', detectedAt: '2024-06-26 10:00', severity: 'High', description: '码表出现未定义的新值 "99 - Cancelled"', action: 'Update Code Table' },
  { id: 'drift_2', target: 't_user.age', type: 'distribution_shift', detectedAt: '2024-06-25 14:30', severity: 'Medium', description: '数据分布发生显著偏移 (Avg: 28 -> 45)', action: 'Investigate' },
  { id: 'drift_3', target: 't_log_action.op_code', type: 'mapping_invalid', detectedAt: '2024-06-24 09:15', severity: 'Low', description: '物理字段类型从 INT 变更为 VARCHAR', action: 'Update Mapping' },
];

export const WAIVER_REQUESTS_MOCK: WaiverRequest[] = [
  { id: 'wav_001', applicant: 'Li.W', target: 't_legacy_order.field_x', reason: '历史遗留系统，无法整改', riskLevel: 'Low', expiryDate: '2024-12-31', status: 'Approved' },
  { id: 'wav_002', applicant: 'Zhang.S', target: 'Metric: ROI_Quick', reason: '临时活动指标，无需入标', riskLevel: 'Medium', expiryDate: '2024-07-30', status: 'Pending' },
];

export const IMPACT_ANALYSIS_MOCK: ImpactAnalysis = {
  changeId: 'chg_001',
  standardName: 'Customer_Status_Enum',
  versionChange: 'v1.0 -> v1.1',
  description: 'Deleted status "3-Suspended", Added "4-Frozen".',
  summary: { total: 24, highRisk: 3, apis: 5, reports: 2 },
  affectedAssets: [
    { id: 't_crm_customer', name: 't_crm_customer', type: 'Table', riskLevel: 'High', owner: 'CRM Team', impactDescription: 'Column `status` uses this enum. 1200 rows have value "3".' },
    { id: 'rpt_daily_active', name: 'Daily Active Users Report', type: 'Report', riskLevel: 'Medium', owner: 'BI Team', impactDescription: 'Filter condition `status != 3` may be invalid.' },
    { id: 'api_get_user_info', name: 'GET /api/v1/user/info', type: 'API', riskLevel: 'High', owner: 'API Gateway', impactDescription: 'Response schema exposes status code.' },
    { id: 'm_churn_rate', name: 'Metric: Churn Rate', type: 'Metric', riskLevel: 'Low', owner: 'Data Science', impactDescription: 'Calculation logic includes suspended users.' },
  ],
  recommendation: '建议采用 "并行版本 (Parallel Version)" 策略发布，保留旧值映射 30 天，并通知下游系统迁移。'
};

export const DEPENDENCY_NODES_MOCK: DependencyNode[] = [
  { id: 'std_cust_id', label: 'Std: Customer_ID', type: 'Standard', domain: 'Customer', x: 400, y: 50 },
  { id: 'bo_customer', label: 'BO: Customer', type: 'Object', domain: 'Customer', x: 400, y: 200 },
  { id: 'lv_cust_360', label: 'View: v_cust_360', type: 'View', domain: 'Customer', x: 400, y: 350 },
  { id: 't_cust_profile', label: 'Table: t_profile', type: 'Field', domain: 'Physical', x: 200, y: 500 },
  { id: 't_order_master', label: 'Table: t_order', type: 'Field', domain: 'Physical', x: 600, y: 500 },
  { id: 'm_arpu', label: 'Metric: ARPU', type: 'Metric', domain: 'Finance', x: 400, y: 650 },
];

export const DEPENDENCY_LINKS_MOCK: DependencyLink[] = [
  { source: 'std_cust_id', target: 'bo_customer', relation: 'defines' },
  { source: 'bo_customer', target: 'lv_cust_360', relation: 'maps_to' },
  { source: 'lv_cust_360', target: 't_cust_profile', relation: 'implements' },
  { source: 'lv_cust_360', target: 't_order_master', relation: 'implements' },
  { source: 'lv_cust_360', target: 'm_arpu', relation: 'calculates_from' },
];

export const OPS_OVERVIEW_MOCK: OpsOverview = {
  coverage: { field: 68, object: 82, metric: 75, trend: 3.5 },
  compliance: { rulePassRate: 94.2, gatePassRate: 88.5, waiverRate: 4.2, trend: 1.2 },
  adoption: { rate: 78, trend: 5.4, funnel: [{ stage: 'AI 推荐', count: 1250, rate: 100 }, { stage: '人工确认', count: 980, rate: 78.4 }, { stage: '落标复用', count: 850, rate: 68.0 }] },
  reuse: { avgRefCount: 4.5, unusedCount: 142 },
};

export const GOVERNANCE_PRIORITIES_MOCK: GovernancePriority[] = [
  { id: 'prio_1', title: '核心交易表缺少主键标准', domain: '交易域', roiScore: 95, reason: 'High Usage (150 refs) × High Risk (No PK)', action: 'Bind Standard PK' },
  { id: 'prio_2', title: '用户手机号字段未脱敏', domain: '客户域', roiScore: 92, reason: 'Sensitive Data (L3) × Public Access', action: 'Apply Masking Rule' },
  { id: 'prio_3', title: '废弃标准 "Legacy_City_Code" 仍有引用', domain: '通用域', roiScore: 88, reason: 'Deprecated Item × 12 Active Refs', action: 'Migrate to New Std' },
  { id: 'prio_4', title: '指标 "活跃率" 口径多义', domain: '运营域', roiScore: 85, reason: 'Homonym Conflict × Key Metric', action: 'Rename & Split' },
  { id: 'prio_5', title: '供应链冗余数据元 "Vendor_ID"', domain: '供应链', roiScore: 75, reason: 'Duplicate (98% similarity) × Low Usage', action: 'Merge & Clean' },
];

export const REUSE_STATS_MOCK: StandardReuseStats = {
  topUsed: [{ name: 'User_ID', type: 'DataElement', count: 342 }, { name: 'Create_Time', type: 'DataElement', count: 289 }, { name: 'Active_Status_Enum', type: 'Term', count: 156 }, { name: 'Mobile_Phone', type: 'DataElement', count: 145 }, { name: 'Email', type: 'DataElement', count: 120 }],
  lowUsed: [{ name: 'Legacy_Temp_Flag', type: 'DataElement', count: 0, daysUnused: 450 }, { name: 'Old_Category_Code', type: 'Term', count: 0, daysUnused: 320 }, { name: 'Project_Alpha_Metric', type: 'Indicator', count: 1, daysUnused: 180 }],
};

export const COLLAB_TASKS_MOCK: CollabTask[] = [
  { id: 'task_1', type: 'approval', title: '发布审批: 客户等级枚举', targetName: 'Cust_Level_Enum', requester: 'Zhang.S', createTime: '2 hours ago', priority: 'High', status: 'pending' },
  { id: 'task_2', type: 'mapping', title: '确认映射: 订单金额字段', targetName: 't_order.total_amt -> Trade_Amount', requester: 'AI Bot', createTime: '4 hours ago', priority: 'Medium', status: 'pending' },
  { id: 'task_3', type: 'conflict', title: '解决同名冲突: Status', targetName: 'Status (Order vs Common)', requester: 'System', createTime: '1 day ago', priority: 'High', status: 'pending' },
  { id: 'task_4', type: 'approval', title: '废弃审批: 旧版地区码', targetName: 'Legacy_Region_Code', requester: 'Li.W', createTime: '2 days ago', priority: 'Low', status: 'approved' },
];

export const REVIEW_DETAIL_MOCK: ReviewDetail = {
  taskId: 'task_1',
  description: '新增 "钻石会员 (Diamond)" 等级，并调整 "白银会员" 的积分阈值。',
  diffs: [{ field: 'Enum Value', oldValue: '1: Silver (Score > 100)', newValue: '1: Silver (Score > 200)' }, { field: 'Enum Value', oldValue: 'null', newValue: '4: Diamond (Score > 5000) [NEW]' }, { field: 'Description', oldValue: 'Basic customer levels', newValue: 'Updated customer levels for 2024 loyalty program' }],
  comments: [{ id: 'c1', user: 'Wang.K', content: '积分阈值调整是否会影响现有用户等级？', time: '1 hour ago', type: 'neutral' }, { id: 'c2', user: 'Zhang.S', content: '已确认，系统将自动重算等级，影响面已评估。', time: '30 mins ago', type: 'pro' }],
  votes: { approve: 2, reject: 0 }
};

export const CHANGE_LOG_MOCK: ChangeLogEntry[] = [
  { id: 'v1.2.0', version: 'v1.2.0', date: '2024-06-25', publisher: 'Admin', description: 'Q3 核心主数据标准发布，包含客户、订单域的重大更新。', impactSummary: '15 Standards Updated, 42 Assets Affected', status: 'Active', canRollback: true },
  { id: 'v1.1.5', version: 'v1.1.5', date: '2024-06-18', publisher: 'Li.W', description: '紧急修复：修正了交易金额的精度定义。', impactSummary: '1 Standard Updated', status: 'Active', canRollback: true },
  { id: 'v1.1.0', version: 'v1.1.0', date: '2024-06-01', publisher: 'Admin', description: '初始化发布：全域基础标准上线。', impactSummary: '850 Standards Created', status: 'Active', canRollback: false },
  { id: 'v1.0.0-beta', version: 'v1.0.0-beta', date: '2024-05-15', publisher: 'System', description: 'Beta 测试版本', impactSummary: 'N/A', status: 'Rolled_Back', canRollback: false },
];

export const TAXONOMY_TREE: TaxonomyNode[] = [
  { id: 'root_1', name: '客户域 (Customer)', code: 'CUST', type: 'Domain', owner: 'Zhang.S', children: [{ id: 'sub_1', name: '个人客户', code: 'INDIV', type: 'Subject', owner: 'Li.W' }, { id: 'sub_2', name: '企业客户', code: 'CORP', type: 'Subject', owner: 'Wang.K' }] },
  { id: 'root_2', name: '交易域 (Transaction)', code: 'TRD', type: 'Domain', owner: 'Chen.Y', children: [{ id: 'sub_3', name: '线上订单', code: 'ONLINE', type: 'Subject', owner: 'Zhao.L' }] },
  { id: 'root_3', name: '产品域 (Product)', code: 'PROD', type: 'Domain', owner: 'Wu.M', children: [] }
];

export const APPROVAL_WORKFLOWS: ApprovalWorkflow[] = [
  { id: 'wf_1', targetType: 'DataElement', isActive: true, steps: [{ id: 's1', name: 'AI 自动预审', approverRole: 'System', type: 'auto' }, { id: 's2', name: '数据专员审核', approverRole: 'Data Steward', type: 'manual' }, { id: 's3', name: '领域Owner终审', approverRole: 'Domain Owner', type: 'manual' }] },
  { id: 'wf_2', targetType: 'Metric', isActive: true, steps: [{ id: 's4', name: '技术可行性评估', approverRole: 'Data Engineer', type: 'manual' }, { id: 's5', name: '业务口径确认', approverRole: 'Business Analyst', type: 'manual' }] }
];

export const STANDARD_TEMPLATES: StandardTemplate[] = [
  { id: 'tpl_1', name: '基础数据元模板', type: 'DataElement', description: '适用于通用业务字段的标准定义，包含业务含义与技术属性。', fields: ['name_cn', 'name_en', 'data_type', 'business_rule', 'security_level'], lastUpdated: '2024-05-20' },
  { id: 'tpl_2', name: '指标定义模板 (V2)', type: 'Indicator', description: '包含原子指标、派生指标及维度的完整定义结构。', fields: ['indicator_name', 'dimension_list', 'calc_logic', 'refresh_cycle'], lastUpdated: '2024-06-10' }
];

export const DICTIONARY_ENTRIES: DictionaryEntry[] = [
  { id: 'dict_1', term: 'Customer', abbreviation: 'Cust', type: 'Abbreviation', status: 'Active' },
  { id: 'dict_2', term: 'Management', abbreviation: 'Mgt', type: 'Abbreviation', status: 'Active' },
  { id: 'dict_3', term: 'User_Name', type: 'Forbidden', replacement: 'User_Account_Name', description: '避免歧义', status: 'Active' },
  { id: 'dict_4', term: 'Amount', abbreviation: 'Amt', type: 'Synonym', status: 'Active' },
  { id: 'dict_5', term: 'Quantity', abbreviation: 'Qty', type: 'Abbreviation', status: 'Active' },
];

export const AI_CONFIG_MOCK: AISettings = {
  model: 'Nexus-LLM-v3 (Fine-tuned)',
  promptVersion: 'v4.2.0-beta',
  confidenceThreshold: 85,
  autoAcceptThreshold: 98,
  evidenceRequired: true,
  strategy: 'Balanced'
};

// --- METRIC HUB MOCKS ---

export const METRIC_ASSETS_MOCK: MetricAsset[] = [
  {
    id: 'ma_001',
    name: 'GMV_Daily',
    code: 'M_TRD_GMV_DAY',
    cnName: '日成交总额 (GMV)',
    domain: '交易域',
    description: '统计周期内所有已支付订单的金额总和，包含运费。核心北极星指标。',
    owner: 'Alice Data',
    status: 'Active',
    latestVersionId: 'mv_001_v2',
    tags: ['Core', 'NorthStar', 'Revenue']
  },
  {
    id: 'ma_002',
    name: 'DAU',
    code: 'M_OPS_DAU',
    cnName: '日活跃用户数',
    domain: '运营域',
    description: '当日登录过应用的用户去重数。',
    owner: 'Bob Ops',
    status: 'Active',
    latestVersionId: 'mv_002_v1',
    tags: ['Growth', 'User']
  },
  {
    id: 'ma_003',
    name: 'Refund_Rate',
    code: 'M_SRV_REFUND_RATE',
    cnName: '退款率',
    domain: '服务域',
    description: '退款订单数占总成交订单数的比例。',
    owner: 'Charlie Service',
    status: 'Active',
    latestVersionId: 'mv_003_v1',
    tags: ['Quality']
  },
  {
    id: 'ma_004',
    name: 'Avg_Order_Value',
    code: 'M_TRD_AOV',
    cnName: '客单价 (AOV)',
    domain: '交易域',
    description: '平均每单交易金额。',
    owner: 'Alice Data',
    status: 'Active',
    latestVersionId: 'mv_004_v1',
    tags: ['Revenue']
  },
  {
    id: 'ma_005',
    name: 'Login_Success_Rate',
    code: 'M_SEC_LOGIN_RATE',
    cnName: '登录成功率',
    domain: '安全域',
    description: '用户尝试登录成功的比例。',
    owner: 'Security Team',
    status: 'Deprecated',
    latestVersionId: 'mv_005_v1',
    tags: ['Security']
  },
  {
    id: 'ma_006',
    name: 'Active_User_Retention_Day7',
    code: 'M_OPS_RET_7D',
    cnName: '7日用户留存率',
    domain: '运营域',
    description: 'T日活跃用户在T+7日再次活跃的比例。',
    owner: 'Bob Ops',
    status: 'Active',
    latestVersionId: 'mv_006_v1',
    tags: ['Growth', 'Retention']
  },
  {
    id: 'ma_007',
    name: 'API_Error_Rate',
    code: 'M_TECH_API_ERR',
    cnName: 'API 接口错误率',
    domain: '技术域',
    description: '非 200 响应的接口请求占比。',
    owner: 'DevOps',
    status: 'Active',
    latestVersionId: 'mv_007_v1',
    tags: ['Stability']
  },
  {
    id: 'ma_008',
    name: 'Campaign_Conversion',
    code: 'M_MKT_CVR',
    cnName: '活动转化率',
    domain: '营销域',
    description: '营销活动落地页的点击转化比。',
    owner: 'Marketing Lead',
    status: 'Active',
    latestVersionId: 'mv_008_v1',
    tags: ['Marketing']
  }
];

export const METRIC_VERSIONS_MOCK: MetricVersion[] = [
  {
    id: 'mv_001_v2',
    metricId: 'ma_001',
    versionNo: 'v2.0.0',
    status: 'Published',
    compliance: 'Compliant',
    standardBinding: { standardId: 'std_gmv_def', standardVersion: 'v2.0' },
    isRecommended: true, // Rule 2
    createdAt: '2024-06-25',
    createdBy: 'Alice Data',
    publishedAt: '2024-06-26',
    definition: {
      metricType: 'Atomic',
      grain: 'Order',
      timeWindow: 'Daily',
      measures: [{ name: 'amount', agg: 'SUM', expr: 'pay_amount', unit: 'CNY', isAdditive: true }],
      dimensions: ['region', 'channel', 'category'],
      filters: ["status = 'paid'", "is_test_account = false"],
      constraints: [{ type: 'NoDrillDown', dimensions: ['user_id'], description: 'Privacy protection' }]
    },
    implementation: {
      mode: 'AUTO_SQL',
      sql: "SELECT date_trunc('day', pay_time) as stat_date, region, channel, category, SUM(pay_amount) as gmv FROM t_dwd_order WHERE status = 'paid' AND is_test_account = false GROUP BY 1, 2, 3, 4"
    },
    evidence: {
      sources: ['t_dwd_order', 'dim_channel'],
      fieldTraceCoverage: 100,
      lastValidationResult: 'Pass'
    }
  },
  {
    id: 'mv_001_v1',
    metricId: 'ma_001',
    versionNo: 'v1.0.0',
    status: 'Archived',
    compliance: 'Warning',
    standardBinding: { standardId: 'std_gmv_def', standardVersion: 'v1.0' },
    createdAt: '2024-01-10',
    createdBy: 'Alice Data',
    publishedAt: '2024-01-15',
    definition: {
      metricType: 'Atomic',
      grain: 'Order',
      timeWindow: 'Daily',
      measures: [{ name: 'amount', agg: 'SUM', expr: 'total_amount', unit: 'CNY', isAdditive: true }],
      dimensions: ['region'],
      filters: ["status = 'paid'"],
      constraints: []
    },
    implementation: {
      mode: 'SQL',
      sql: "SELECT date, region, SUM(total_amount) FROM t_order_old WHERE status = 'paid' GROUP BY 1, 2"
    },
    evidence: {
      sources: ['t_order_old'],
      fieldTraceCoverage: 80,
      lastValidationResult: 'Warn'
    }
  },
  {
    id: 'mv_002_v1',
    metricId: 'ma_002',
    versionNo: 'v1.2.0',
    status: 'Published',
    compliance: 'Compliant',
    // Rule 3 Scenario: Metric is bound to v1.0.0, but standard is v1.1.0 (Updated in STANDARD_ITEMS_MOCK)
    standardBinding: { standardId: 'std_004', standardVersion: 'v1.0.0' },
    createdAt: '2024-06-20',
    createdBy: 'Bob Ops',
    publishedAt: '2024-06-22',
    definition: {
      metricType: 'Atomic',
      grain: 'User',
      timeWindow: 'Daily',
      measures: [{ name: 'user_count', agg: 'COUNT_DISTINCT', expr: 'user_id', unit: 'Person', isAdditive: false }],
      dimensions: ['platform', 'version'],
      filters: ["event = 'login'"],
      constraints: []
    },
    implementation: { mode: 'AUTO_SQL' },
    evidence: { sources: ['dwd_user_events'], fieldTraceCoverage: 100, lastValidationResult: 'Pass' }
  },
  {
    id: 'mv_003_v1',
    metricId: 'ma_003',
    versionNo: 'v0.1.0',
    status: 'Draft',
    compliance: 'NonCompliant',
    createdAt: '2024-06-27',
    createdBy: 'Charlie Service',
    definition: {
      metricType: 'Derivative',
      grain: 'Order',
      timeWindow: 'Monthly',
      measures: [{ name: 'rate', agg: 'RATIO', expr: 'refunds/orders', unit: '%', isAdditive: false }],
      dimensions: ['reason'],
      filters: [],
      constraints: []
    },
    implementation: { mode: 'SQL' },
    evidence: { sources: ['dwd_service_orders'], fieldTraceCoverage: 45, lastValidationResult: 'Fail' }
  },
  {
    id: 'mv_004_v1',
    metricId: 'ma_004',
    versionNo: 'v1.0.0',
    status: 'Published',
    compliance: 'Compliant',
    createdAt: '2024-06-25',
    createdBy: 'Alice Data',
    publishedAt: '2024-06-25',
    definition: {
      metricType: 'Composite',
      grain: 'Order',
      timeWindow: 'Daily',
      measures: [],
      dimensions: [],
      filters: [],
      constraints: []
    },
    implementation: { mode: 'CANVAS' },
    evidence: { sources: ['dwd_orders'], fieldTraceCoverage: 95, lastValidationResult: 'Pass' }
  },
  {
    id: 'mv_005_v1',
    metricId: 'ma_005',
    versionNo: 'v1.0.0',
    status: 'Published',
    compliance: 'Warning',
    // Rule 5: Waiver info
    waiverInfo: { isWaived: true, reason: 'Legacy system limitation', approvalDate: '2024-01-01' },
    createdAt: '2023-12-01',
    createdBy: 'Security Team',
    publishedAt: '2023-12-05',
    definition: { metricType: 'Atomic', grain: 'Log', timeWindow: 'Realtime', measures: [], dimensions: [], filters: [] },
    implementation: { mode: 'SQL' },
    evidence: { sources: ['log_stream'], fieldTraceCoverage: 60, lastValidationResult: 'Warn' }
  },
  {
    id: 'mv_006_v1',
    metricId: 'ma_006',
    versionNo: 'v1.0.0',
    status: 'Published',
    compliance: 'Compliant',
    createdAt: '2024-06-01',
    createdBy: 'Bob Ops',
    publishedAt: '2024-06-05',
    definition: { metricType: 'Derivative', grain: 'User', timeWindow: 'Weekly', measures: [], dimensions: [], filters: [] },
    implementation: { mode: 'AUTO_SQL' },
    evidence: { sources: ['dws_user_retention'], fieldTraceCoverage: 100, lastValidationResult: 'Pass' }
  },
  {
    id: 'mv_007_v1',
    metricId: 'ma_007',
    versionNo: 'v2.1.0',
    status: 'Published',
    compliance: 'NonCompliant',
    createdAt: '2024-06-10',
    createdBy: 'DevOps',
    publishedAt: '2024-06-12',
    definition: { metricType: 'Atomic', grain: 'Request', timeWindow: '1min', measures: [], dimensions: [], filters: [] },
    implementation: { mode: 'SQL' },
    evidence: { sources: ['api_gateway_logs'], fieldTraceCoverage: 30, lastValidationResult: 'Fail' }
  },
  {
    id: 'mv_008_v1',
    metricId: 'ma_008',
    versionNo: 'v1.0.0',
    status: 'Published',
    compliance: 'Compliant',
    createdAt: '2024-06-15',
    createdBy: 'Marketing Lead',
    publishedAt: '2024-06-18',
    definition: { metricType: 'Composite', grain: 'Campaign', timeWindow: 'Campaign Lifecycle', measures: [], dimensions: [], filters: [] },
    implementation: { mode: 'CANVAS' },
    evidence: { sources: ['dwd_campaign', 'dwd_traffic'], fieldTraceCoverage: 98, lastValidationResult: 'Pass' }
  }
];

export const getIconForDB = (type: string) => {
  switch (type) {
    case 'MySQL': return <Database size={16} className="text-cyan-400" />;
    case 'PostgreSQL': return <Server size={16} className="text-indigo-400" />;
    case 'Oracle': return <HardDrive size={16} className="text-red-400" />;
    default: return <Database size={16} className="text-slate-500" />;
  }
};
