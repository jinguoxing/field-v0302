
import React, { useState } from 'react';
import { 
  Play, RotateCcw, X, History, CheckCircle2, 
  AlertCircle, Clock, ChevronRight, Activity, 
  Database, Search, ShieldCheck, Brain, Lightbulb,
  Package, AlertTriangle, RefreshCw, FileJson,
  Table2, ArrowRightLeft, GitCompare, ExternalLink,
  ArrowUpRight, Download
} from 'lucide-react';
import { AIOpsRequest, AIOpsRun, StageId, AIOpsTask } from '../../../types/aiops';

interface RunConsoleProps {
  request: AIOpsRequest;
  onStageClick: (stageId: StageId) => void;
}

export const RunConsole: React.FC<RunConsoleProps> = ({ request, onStageClick }) => {
  const [activeTab, setActiveTab] = useState<'runs' | 'tasks' | 'deliverables' | 'replay'>('runs');
  const activeRun = request.runs[request.runs.length - 1]; // Get latest run

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-slate-700/50 bg-slate-900/80 px-2">
        {(['runs', 'tasks', 'deliverables', 'replay'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab === 'runs' && '运行记录'}
            {tab === 'tasks' && '待办任务'}
            {tab === 'deliverables' && '交付物'}
            {tab === 'replay' && '回放对比'}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'runs' && activeRun && (
          <div className="p-6 space-y-8">
            <RunHeader run={activeRun} />
            <StageStepper activeRun={activeRun} />
            <div className="space-y-4">
              {(['A', 'B', 'C', 'D', 'E'] as StageId[]).map((sId) => (
                <StageCard 
                  key={sId} 
                  stageId={sId} 
                  status={getStageStatus(sId, activeRun)} 
                  onClick={() => onStageClick(sId)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="p-6 space-y-6">
            {/* Hard-block Group */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={14} /> 硬性阻塞 (必须解决)
              </h3>
              <div className="space-y-3">
                {request.tasks.filter(t => t.type === 'hard-block').map(task => (
                  <TaskCard key={task.id} task={task} onStageClick={onStageClick} />
                ))}
                {request.tasks.filter(t => t.type === 'hard-block').length === 0 && (
                  <div className="p-8 text-center bg-slate-800/20 border border-dashed border-slate-700 rounded-2xl">
                    <p className="text-xs text-slate-500 italic">暂无硬性阻塞任务</p>
                  </div>
                )}
              </div>
            </div>

            {/* Soft-task Group */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} /> 建议任务 (建议复核)
              </h3>
              <div className="space-y-3">
                {request.tasks.filter(t => t.type === 'soft-task').map(task => (
                  <TaskCard key={task.id} task={task} onStageClick={onStageClick} />
                ))}
                {request.tasks.filter(t => t.type === 'soft-task').length === 0 && (
                  <div className="p-8 text-center bg-slate-800/20 border border-dashed border-slate-700 rounded-2xl">
                    <p className="text-xs text-slate-500 italic">暂无优化建议任务</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deliverables' && (
          <div className="p-6 space-y-6">
            <SemanticResultsCard />
            <QualityDraftCard />
            <ObjectCandidatesCard />
            
            <div className="pt-4 border-t border-slate-700/50">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">所有文件</h4>
              <div className="grid grid-cols-2 gap-4">
                {request.deliverables.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-indigo-500/50 transition-all group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-400 mb-3 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                      <Package size={20} />
                    </div>
                    <p className="text-sm font-bold text-white truncate">{item.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-500 uppercase">{item.type}</span>
                      <span className="text-[10px] text-slate-500">{item.createdAt?.split('T')[0] || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'replay' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">运行 ID</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option>Run #3124</option>
                  <option>Run #2988</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">版本 A (基线)</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option>v1.2.3 (当前)</option>
                  <option>v1.2.2</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">版本 B (对比)</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option>v1.2.4 (草案)</option>
                  <option>v1.2.3</option>
                </select>
              </div>
            </div>

            <DiffSummaryCard />
            <DiffTable />
          </div>
        )}
      </div>
    </div>
  );
};

const RunHeader = ({ run }: { run: AIOpsRun }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${run.status === 'running' ? 'bg-cyan-500 animate-pulse' : 'bg-emerald-500'}`}></div>
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            Run #{run.id.slice(-4)}
            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${
              run.status === 'running' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {run.status === 'running' ? '运行中' : 
               run.status === 'completed' ? '已完成' : 
               run.status === 'failed' ? '失败' : run.status}
            </span>
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">启动于 {new Date(run.startTime).toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all" title="重试阶段">
          <RotateCcw size={16} />
        </button>
        <button className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all" title="取消">
          <X size={16} />
        </button>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/20">
          继续执行
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 bg-slate-900/50 border border-slate-700 rounded-xl">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">执行耗时</p>
        <p className="text-lg font-mono text-white">12m 45s</p>
      </div>
      <div className="p-3 bg-slate-900/50 border border-slate-700 rounded-xl">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">消耗成本 (Tokens/工具)</p>
        <p className="text-lg font-mono text-white">1.2k / 15</p>
      </div>
    </div>
  </div>
);

const StageStepper = ({ activeRun }: { activeRun: AIOpsRun }) => {
  const stages: { id: StageId; label: string; metric: string }[] = [
    { id: 'A', label: '数据源', metric: '已连接' },
    { id: 'B', label: '画像', metric: '98% 完整度' },
    { id: 'C', label: '质量', metric: '12 条规则' },
    { id: 'D', label: '语义', metric: '85% 匹配' },
    { id: 'E', label: '候选', metric: '5 个对象' },
  ];

  return (
    <div className="relative pt-2 pb-6">
      <div className="absolute top-7 left-8 right-8 h-0.5 bg-slate-800"></div>
      <div className="relative flex justify-between">
        {stages.map((stage) => {
          const status = getStageStatus(stage.id, activeRun);
          return (
            <div key={stage.id} className="flex flex-col items-center group cursor-pointer">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all relative z-10 ${
                status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' :
                status === 'running' ? 'bg-slate-900 border-cyan-500 text-cyan-400 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.3)]' :
                status === 'hard-blocked' ? 'bg-rose-500 border-rose-500 text-white' :
                status === 'soft-blocked' ? 'bg-amber-500 border-amber-500 text-white' :
                'bg-slate-900 border-slate-700 text-slate-600'
              }`}>
                {status === 'done' ? <CheckCircle2 size={18} /> : 
                 status === 'hard-blocked' ? <AlertCircle size={18} /> :
                 status === 'soft-blocked' ? <AlertTriangle size={18} /> :
                 <span className="text-xs font-bold">{stage.id}</span>}
              </div>
              <div className="mt-3 text-center">
                <p className={`text-[10px] font-bold uppercase ${status === 'running' ? 'text-cyan-400' : 'text-slate-400'}`}>{stage.label}</p>
                <p className="text-[9px] text-slate-600 mt-0.5 font-mono">{stage.metric}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TaskCard: React.FC<{ task: AIOpsTask; onStageClick: (sId: StageId) => void }> = ({ task, onStageClick }) => {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      task.type === 'hard-block' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-amber-500/5 border-amber-500/20'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
            task.type === 'hard-block' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
          }`}>
            {task.task_type === 'CREDENTIAL_REQUIRED' ? '需要凭据' :
             task.task_type === 'SEMANTIC_CONFLICT' ? '语义冲突' :
             task.task_type === 'DATA_QUALITY_ISSUE' ? '数据质量问题' :
             task.task_type === 'METADATA_MISSING' ? '元数据缺失' :
             task.task_type === 'ENUM_MAPPING_REQUIRED' ? '需要枚举映射' : task.task_type}
          </span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">阶段 {task.stage}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all" title="Retry">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <h5 className="text-sm font-bold text-white">{task.title}</h5>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-slate-500 font-mono">{task.asset_ref}</span>
          <span className="text-slate-700">•</span>
          <span className="text-[10px] text-slate-400 italic">{task.reason}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onStageClick(task.stage)}
          className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all ${
            task.type === 'hard-block' ? 'bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-900/20' : 'bg-amber-500 text-white hover:bg-amber-400 shadow-lg shadow-amber-900/20'
          }`}
        >
          立即修复
        </button>
        {task.type === 'soft-task' && (
          <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-[11px] font-bold border border-slate-700 transition-all">
            标记解决
          </button>
        )}
      </div>
    </div>
  );
};

const SemanticResultsCard = () => (
  <div className="p-5 bg-slate-800/40 border border-slate-700 rounded-2xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
        <Brain size={20} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">语义理解结果</h4>
        <p className="text-[10px] text-slate-500 uppercase font-bold">阶段 D 交付物</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-5">
      <div className="space-y-1">
        <p className="text-[10px] text-slate-500 uppercase font-bold">自动确认</p>
        <p className="text-lg font-bold text-emerald-400">124 <span className="text-xs font-normal text-slate-500">字段</span></p>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] text-slate-500 uppercase font-bold">草案 / 未知</p>
        <p className="text-lg font-bold text-amber-400">32 / 15%</p>
      </div>
    </div>

    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold">路由分布</span>
        <span className="text-[10px] text-slate-400">L2 语义</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-slate-700">
        <div className="h-full bg-indigo-500" style={{ width: '65%' }}></div>
        <div className="h-full bg-cyan-500" style={{ width: '20%' }}></div>
        <div className="h-full bg-slate-600" style={{ width: '15%' }}></div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
        打开语义工作台 <ArrowUpRight size={14} />
      </button>
      <button className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-all" title="导出 JSON">
        <FileJson size={16} />
      </button>
    </div>
  </div>
);

const QualityDraftCard = () => (
  <div className="p-5 bg-slate-800/40 border border-slate-700 rounded-2xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
        <ShieldCheck size={20} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">质量规则草案</h4>
        <p className="text-[10px] text-slate-500 uppercase font-bold">阶段 C 交付物</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-5">
      <div className="space-y-1">
        <p className="text-[10px] text-slate-500 uppercase font-bold">规则数量</p>
        <p className="text-lg font-bold text-white">45 <span className="text-xs font-normal text-slate-500">(P1: 12, P2: 33)</span></p>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] text-slate-500 uppercase font-bold">主要违规</p>
        <p className="text-lg font-bold text-rose-400">3 <span className="text-xs font-normal text-slate-500">严重</span></p>
      </div>
    </div>

    <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2 border border-slate-600">
      打开质量草案 <ExternalLink size={14} />
    </button>
  </div>
);

const ObjectCandidatesCard = () => (
  <div className="p-5 bg-slate-800/40 border border-slate-700 rounded-2xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
        <Lightbulb size={20} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">候选对象建议</h4>
        <p className="text-[10px] text-slate-500 uppercase font-bold">阶段 E 交付物</p>
      </div>
    </div>

    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold">前 5 个候选对象</span>
        <span className="text-[10px] text-emerald-400">ScoreObject 已启用</span>
      </div>
      <div className="space-y-2">
        {['零售订单宽表', '客户画像视图', '商品销售月报'].map((name, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <span className="text-xs text-slate-300">{name}</span>
            <span className="text-[10px] font-mono text-cyan-400">0.9{8-i}</span>
          </div>
        ))}
      </div>
    </div>

    <button className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20">
      打开候选对象 <Table2 size={14} />
    </button>
  </div>
);

const DiffSummaryCard = () => (
  <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
    <div className="flex items-center gap-2 mb-4">
      <GitCompare className="text-indigo-400" size={16} />
      <h4 className="text-xs font-bold text-white uppercase tracking-widest">差异摘要</h4>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">路由差异</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">12</span>
          <span className="text-[10px] text-rose-400 flex items-center"><ArrowUpRight size={10} /> 5%</span>
        </div>
      </div>
      <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">字段变更</p>
        <p className="text-sm font-bold text-white">45</p>
      </div>
      <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">证据链变更</p>
        <p className="text-sm font-bold text-emerald-400">156</p>
      </div>
    </div>
  </div>
);

const DiffTable = () => (
  <div className="bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-800/50 border-b border-slate-700">
          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">字段名称</th>
          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">版本 A.Top1</th>
          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">版本 B.Top1</th>
          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">路由 A/B</th>
          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">原因</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {[
          { name: 'order_id', a: '订单ID', b: '订单主键', ra: 'L1', rb: 'L2', reason: '证据更新' },
          { name: 'cust_name', a: '客户名称', b: '客户姓名', ra: 'L2', rb: 'L2', reason: '人工覆盖' },
          { name: 'total_amt', a: '总金额', b: '订单总额', ra: 'L1', rb: 'L2', reason: '上下文丰富' },
        ].map((row, i) => (
          <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
            <td className="px-4 py-3">
              <p className="text-xs font-mono text-slate-300">{row.name}</p>
            </td>
            <td className="px-4 py-3 text-xs text-slate-500">{row.a}</td>
            <td className="px-4 py-3 text-xs text-white font-medium">{row.b}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-1 bg-slate-800 rounded text-slate-500">{row.ra}</span>
                <ArrowRightLeft size={10} className="text-slate-600" />
                <span className="text-[10px] px-1 bg-indigo-500/20 rounded text-indigo-400">{row.rb}</span>
              </div>
            </td>
            <td className="px-4 py-3">
              <span className="text-[10px] text-slate-500 italic">{row.reason}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="p-4 bg-slate-800/30 border-t border-slate-700 text-center">
      <button className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-2 mx-auto">
        查看完整差异报告 (56 项) <ChevronRight size={14} />
      </button>
    </div>
  </div>
);

interface StageCardProps {
  stageId: StageId;
  status: string;
  onClick: () => void;
}

const StageCard: React.FC<StageCardProps> = ({ stageId, status, onClick }) => {
  const stageInfo = {
    A: { title: '数据源配置', icon: <Database size={18} />, summary: '已成功连接 PostgreSQL 生产库，完成 4 张核心表的元数据拉取。' },
    B: { title: '数据画像', icon: <Search size={18} />, summary: '完成全量字段画像，识别出 12 个枚举字段与 3 个潜在主键。' },
    C: { title: '质量规则', icon: <ShieldCheck size={18} />, summary: '自动生成 15 条质量规则，发现 2 处硬性阻碍需人工介入。' },
    D: { title: '语义理解', icon: <Brain size={18} />, summary: 'AI 正在分析表间关联与业务术语匹配度，当前进度 85%。' },
    E: { title: '候选对象', icon: <Lightbulb size={18} />, summary: '待启动。将根据语义理解结果生成逻辑视图与指标建议。' },
  }[stageId];

  return (
    <div className={`p-5 rounded-2xl border transition-all group ${
      status === 'running' ? 'bg-cyan-500/5 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 
      status === 'hard-blocked' ? 'bg-rose-500/5 border-rose-500/30' :
      'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            status === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
            status === 'running' ? 'bg-cyan-500/10 text-cyan-400' :
            status === 'hard-blocked' ? 'bg-rose-500/10 text-rose-400' :
            'bg-slate-700 text-slate-500'
          }`}>
            {stageInfo.icon}
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">{stageInfo.title}</h5>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold uppercase ${
                  status === 'done' ? 'text-emerald-400' :
                  status === 'running' ? 'text-cyan-400' :
                  status === 'hard-blocked' ? 'text-rose-400' :
                  'text-slate-500'
                }`}>
                  {status === 'done' ? '已完成' :
                   status === 'running' ? '运行中' :
                   status === 'hard-blocked' ? '硬性阻塞' :
                   status === 'soft-blocked' ? '建议任务' :
                   status === 'pending' ? '等待中' :
                   status === 'skipped' ? '已跳过' : status}
                </span>
                {status === 'running' && <RefreshCw size={10} className="text-cyan-400 animate-spin" />}
              </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === 'done' && (
            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100" title="重新运行">
              <RotateCcw size={14} />
            </button>
          )}
          <button 
            onClick={onClick}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border border-slate-700"
          >
            详情 <ChevronRight size={12} />
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed mb-4">{stageInfo.summary}</p>
      
      {status === 'running' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase">
            <span className="text-cyan-400">正在执行 L2 语义推断...</span>
            <span className="text-slate-500">85%</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 animate-pulse" style={{ width: '85%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

const getStageStatus = (stageId: StageId, run: AIOpsRun): 'done' | 'running' | 'hard-blocked' | 'soft-blocked' | 'pending' | 'skipped' => {
  if (run.stageId === stageId) {
    if (run.status === 'running') return 'running';
    if (run.status === 'failed') return 'hard-blocked';
    return 'done';
  }
  
  const stageOrder: StageId[] = ['A', 'B', 'C', 'D', 'E'];
  const currentIndex = stageOrder.indexOf(run.stageId);
  const targetIndex = stageOrder.indexOf(stageId);
  
  if (targetIndex < currentIndex) return 'done';
  if (stageId === 'C' && run.stageId === 'C') return 'hard-blocked'; // Mocking a blocker
  
  return 'pending';
};
