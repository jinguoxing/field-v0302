import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Database, MoreHorizontal, ChevronRight, CheckCircle2, AlertCircle, Clock, LayoutGrid, List as ListIcon, Play, AlertTriangle, Radio } from 'lucide-react';
import { DATA_SOURCES, TABLES, getIconForDB } from '../constants';
import { TableEntity } from '../types';

const StatusBadge = ({ status, progress }: { status: string, progress: number }) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
        <CheckCircle2 size={12} className="mr-1" /> 正常
      </span>
    );
  }
  if (status === 'review_required') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertCircle size={12} className="mr-1" /> 待复核
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
      处理中 ({progress}%)
    </span>
  );
};

export const TableListPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDataSource, setActiveDataSource] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('card');

  const filteredTables = TABLES.filter(t => 
    (activeDataSource === 'all' || t.dataSource.includes(activeDataSource)) &&
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel: Data Source Tree - Lighter bg */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl p-4 flex-1">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-semibold text-slate-200 flex items-center gap-2">
               <Database size={16} className="text-cyan-400"/>
               数据源
             </h3>
             <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-cyan-400 font-mono border border-slate-600">{DATA_SOURCES.length}</span>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="搜索数据源..." 
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-slate-300 placeholder:text-slate-500 transition-all"
            />
          </div>

          <div className="space-y-1">
             <button 
               onClick={() => setActiveDataSource('all')}
               className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${activeDataSource === 'all' ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}
             >
               <span>全部来源</span>
               <span className="text-xs opacity-70 font-mono">{TABLES.length}</span>
             </button>
             
             {DATA_SOURCES.map(ds => (
               <div key={ds.id} className="group">
                  <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-400 hover:bg-slate-700/50 rounded-lg transition-colors group-hover:text-slate-200">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {getIconForDB(ds.type)}
                      <span className="truncate">{ds.type}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  {/* Nested mock items */}
                  <div className="ml-4 pl-3 border-l border-slate-700 mt-1 space-y-1">
                    <button 
                      onClick={() => setActiveDataSource(ds.name)}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-md truncate transition-colors ${activeDataSource === ds.name ? 'bg-slate-700 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {ds.name}
                    </button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Content */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
        {/* Unified Toolbar - Lighter bg */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl p-4 flex flex-wrap items-center justify-between gap-4">
           <div className="flex items-center gap-2">
             <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="搜索数据表..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-slate-300 placeholder:text-slate-500"
                />
             </div>
             <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-slate-200 transition-colors">
               <Filter size={16} />
               筛选
             </button>
           </div>
           
           <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 hidden xl:inline">
               显示 <strong className="text-cyan-400 font-mono">{filteredTables.length}</strong> 张表
             </span>
             
             {/* View Toggle */}
             <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  title="列表视图"
                >
                  <ListIcon size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('card')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'card' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  title="卡片视图"
                >
                  <LayoutGrid size={16} />
                </button>
             </div>

             <button className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.4)] border border-cyan-400/20 transition-all flex items-center gap-2">
               <Radio size={16} className="animate-pulse" /> 自动扫描
             </button>
           </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-auto min-h-0">
          {viewMode === 'list' ? (
             <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-xl flex flex-col h-full overflow-hidden">
               <div className="flex-1 overflow-auto">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm">
                     <tr>
                       <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-700">表名</th>
                       <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-700">来源</th>
                       <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-700">行数</th>
                       <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-700">状态</th>
                       <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-700">完整度</th>
                       <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-700 text-right">操作</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700">
                     {filteredTables.map((table) => (
                       <tr 
                         key={table.id} 
                         className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                         onClick={() => navigate(`/fields/${table.id}`)}
                       >
                         <td className="px-6 py-4">
                           <div className="flex items-start gap-3">
                             <div className="p-2 bg-slate-700/50 text-cyan-400 rounded-lg border border-slate-600">
                                <TableEntityIcon />
                             </div>
                             <div>
                               <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors font-mono">{table.name}</p>
                               <p className="text-xs text-slate-500">{table.description || '暂无描述'}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-700/50 text-slate-400 border border-slate-600">
                              {table.dataSource}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                           {table.rowCount.toLocaleString()}
                         </td>
                         <td className="px-6 py-4">
                           <StatusBadge status={table.status} progress={table.progress} />
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 w-24 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                <div 
                                   className={`h-1.5 rounded-full ${table.progress === 100 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]'}`} 
                                   style={{ width: `${table.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-slate-500 font-mono">{table.totalFields}/{table.totalFields}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs text-slate-500 flex items-center mr-2">
                                <Clock size={12} className="mr-1"/> {table.lastUpdated}
                              </span>
                              <button className="p-1.5 text-cyan-400 hover:bg-cyan-950/30 rounded-md text-xs font-medium border border-transparent hover:border-cyan-500/30">
                                分析
                              </button>
                              <button className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-md">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               
               {/* Pagination Footer (List Mode) */}
               <div className="p-4 border-t border-slate-700 flex items-center justify-between bg-slate-800/50">
                  <span className="text-xs text-slate-500">第 1 / 5 页</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-medium text-slate-400 border border-slate-600 rounded hover:bg-slate-700 disabled:opacity-50">上一页</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-400 border border-slate-600 rounded hover:bg-slate-700">下一页</button>
                  </div>
               </div>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
               {filteredTables.map(table => (
                 <TableCard key={table.id} table={table} onClick={() => navigate(`/fields/${table.id}`)} />
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TableCard: React.FC<{ table: TableEntity, onClick: () => void }> = ({ table, onClick }) => {
   // Format row count (e.g., 3.5K)
   const formattedRows = table.rowCount >= 1000 
     ? (table.rowCount / 1000).toFixed(1) + 'K' 
     : table.rowCount;

   const isPending = table.status === 'pending';
   const isReview = table.status === 'review_required';

   return (
     <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700 p-5 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:border-cyan-500/30 transition-all relative flex flex-col gap-4 cursor-pointer group h-full" onClick={onClick}>
        {/* Header */}
        <div className="flex items-start justify-between">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-colors shadow-inner">
                 <TableEntityIcon />
              </div>
              <div>
                 <h3 className="font-bold text-lg text-slate-200 group-hover:text-cyan-400 transition-colors font-mono tracking-tight">{table.name}</h3>
                 <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded border border-slate-600 flex items-center gap-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                       MySQL
                    </span>
                    <span className="text-xs text-slate-500">{table.dataSource}</span>
                 </div>
              </div>
           </div>
           <div className="flex flex-col items-end gap-1">
             <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-900" onClick={(e) => e.stopPropagation()} />
           </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-slate-700/50 my-1">
           <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">行数</p>
              <div className="flex items-center gap-2 font-semibold text-slate-300 text-sm font-mono">
                 <Database size={14} className="text-slate-600"/> 
                 {formattedRows}
              </div>
           </div>
           <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">更新于</p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                 <Clock size={14} className="text-slate-600"/> 
                 {table.lastUpdated}
              </div>
           </div>
        </div>

        {/* Status specific UI */}
        <div className="flex-1 min-h-[40px]">
           {isReview && (
             <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded border border-amber-500/20">待复核</span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                   <CheckCircle2 size={12} className="text-emerald-500" /> 3/4
                </span>
                <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded border border-red-500/20 flex items-center gap-1">
                   <AlertCircle size={10} /> 失败
                </span>
             </div>
           )}
           
           {isPending && (
              <div className="bg-slate-900/50 rounded-lg px-3 py-2 text-xs text-slate-500 border border-slate-700 text-center italic">
                 尚未启动语义理解
              </div>
           )}

           {!isReview && !isPending && (
             <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{table.description}</p>
           )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
           {isPending ? (
             <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-400/20 transition-all flex items-center justify-center gap-2 group/btn">
               <Play size={16} fill="currentColor" className="group-hover/btn:scale-110 transition-transform"/> 开始 AI 分析
             </button>
           ) : isReview ? (
             <button className="w-full py-2.5 bg-slate-700 text-slate-300 border border-slate-600 rounded-lg font-medium text-sm hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center gap-2">
               继续复核
             </button>
           ) : (
             <button className="w-full py-2.5 bg-transparent text-cyan-400 border border-cyan-900/50 rounded-lg font-medium text-sm hover:bg-cyan-950/30 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2">
               查看详情
             </button>
           )}
        </div>
     </div>
   )
}

const TableEntityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
)