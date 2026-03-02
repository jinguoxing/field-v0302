
import { AIOpsRequest } from '../types/aiops';

export const mockAIOpsRequests: AIOpsRequest[] = [
  {
    id: 'req-001',
    title: '零售业务域语义建模',
    description: '针对零售业务域的订单、商品、客户等核心实体进行语义建模与指标定义。',
    status: 'active',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-25T14:30:00Z',
    stages: [
      { id: 'A', name: '数据源配置', status: 'completed', description: '配置元数据采集范围与权限' },
      { id: 'B', name: '扫描与画像', status: 'completed', description: '自动化元数据扫描与数据画像分析' },
      { id: 'C', name: '质量规则与检测', status: 'running', description: '定义数据质量规则并执行检测' },
      { id: 'D', name: '语义理解结果', status: 'pending', description: 'AI 自动识别语义关联与业务含义' },
      { id: 'E', name: '候选对象', status: 'pending', description: '生成逻辑视图与指标候选建议' },
    ],
    tasks: [
      { 
        id: 'task-1', 
        title: '确认订单表主键唯一性', 
        status: 'done', 
        type: 'hard-block',
        task_type: 'METADATA_MISSING',
        stage: 'B',
        asset_ref: 'public.orders.order_id',
        reason: '主键约束缺失'
      },
      { 
        id: 'task-2', 
        title: '补充商品分类枚举值映射', 
        status: 'todo', 
        type: 'soft-task',
        task_type: 'ENUM_MAPPING_REQUIRED',
        stage: 'D',
        asset_ref: 'public.products.category',
        reason: 'AI 识别出 5 个未映射枚举值'
      },
      { 
        id: 'task-3', 
        title: '修复客户表地址字段空值过高问题', 
        status: 'todo', 
        type: 'hard-block',
        task_type: 'DATA_QUALITY_ISSUE',
        stage: 'C',
        asset_ref: 'public.customers.address',
        reason: '空值率 85% > 20%'
      },
    ],
    deliverables: [
      { id: 'del-1', name: '零售域元数据扫描报告', type: 'PDF', createdAt: '2024-02-21T11:30:00Z' },
      { id: 'del-2', name: '数据质量检测明细', type: 'Excel', createdAt: '2024-02-25T14:30:00Z' },
    ],
    runs: [
      { id: 'run-1', stageId: 'A', startTime: '2024-02-20T10:05:00Z', endTime: '2024-02-20T10:15:00Z', status: 'completed', progress: 100 },
      { id: 'run-2', stageId: 'B', startTime: '2024-02-21T09:00:00Z', endTime: '2024-02-21T11:30:00Z', status: 'completed', progress: 100 },
      { id: 'run-3', stageId: 'C', startTime: '2024-02-25T14:00:00Z', status: 'running', progress: 65 },
    ]
  },
  {
    id: 'req-002',
    title: '供应链库存监控自动化',
    description: '实现供应链库存数据的实时监控与异常预警语义化。',
    status: 'draft',
    createdAt: '2024-02-24T16:00:00Z',
    updatedAt: '2024-02-24T16:00:00Z',
    stages: [
      { id: 'A', name: '数据源配置', status: 'running', description: '配置元数据采集范围与权限' },
      { id: 'B', name: '扫描与画像', status: 'pending', description: '自动化元数据扫描与数据画像分析' },
      { id: 'C', name: '质量规则与检测', status: 'pending', description: '定义数据质量规则并执行检测' },
      { id: 'D', name: '语义理解结果', status: 'pending', description: 'AI 自动识别语义关联与业务含义' },
      { id: 'E', name: '候选对象', status: 'pending', description: '生成逻辑视图与指标候选建议' },
    ],
    tasks: [],
    deliverables: [],
    runs: []
  }
];
