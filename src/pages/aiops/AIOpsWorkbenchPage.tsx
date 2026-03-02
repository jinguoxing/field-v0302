
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockAIOpsRequests } from '../../data/aiopsMock';
import { Plus, Search, Filter, Calendar, Clock, ChevronRight, LayoutDashboard } from 'lucide-react';
import { RequestCreateModal } from '../../components/aiops/RequestCreateModal';

export const AIOpsWorkbenchPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateRequest = (data: any, startNow: boolean) => {
    console.log('Creating request:', data, 'Start now:', startNow);
    setIsModalOpen(false);
    // In a real app, we would add this to the mock data or call an API
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-cyan-400" size={32} /> AI 运营工作台
          </h1>
          <p className="text-slate-400 mt-2">管理与执行 AI 驱动的语义建模与数据治理需求。</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
        >
          <Plus size={20} /> 发起新需求
        </button>
      </div>

      <RequestCreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateRequest} 
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '活跃需求', value: 12, color: 'text-cyan-400' },
          { label: '待处理任务', value: 45, color: 'text-amber-400' },
          { label: '已完成交付', value: 89, color: 'text-emerald-400' },
          { label: '异常告警', value: 3, color: 'text-rose-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="搜索需求名称、ID 或描述..." 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-sm text-slate-400 hover:text-white transition-colors">
              <Filter size={18} /> 筛选
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-700/50">
          {mockAIOpsRequests.map(request => (
            <Link 
              key={request.id} 
              to={`/aiops/workbench/requests/${request.id}`}
              className="flex items-center p-6 hover:bg-slate-700/20 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors truncate">{request.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    request.status === 'active' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                    request.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-slate-700 text-slate-400 border border-slate-600'
                  }`}>
                    {request.status === 'active' ? '进行中' : request.status === 'completed' ? '已完成' : '草稿'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-1 mb-3">{request.description}</p>
                <div className="flex items-center gap-6 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(request.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> 最后更新: {new Date(request.updatedAt).toLocaleTimeString()}</span>
                  <div className="flex items-center gap-1">
                    {request.stages.map(stage => (
                      <div 
                        key={stage.id} 
                        className={`w-2 h-2 rounded-full ${
                          stage.status === 'completed' ? 'bg-emerald-500' :
                          stage.status === 'running' ? 'bg-cyan-500 animate-pulse' :
                          stage.status === 'failed' ? 'bg-rose-500' :
                          'bg-slate-700'
                        }`}
                        title={`${stage.name}: ${stage.status}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" size={24} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
