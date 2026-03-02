import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shield, Key, FileText, CheckCircle, RefreshCcw, Settings2, GitBranch, Cpu } from 'lucide-react';
import { TABLES, FIELDS_MOCK } from '../constants';
import { DataQualityPanel } from '../components/DataQualityPanel';

type TabType = 'structure' | 'quality' | 'lineage';

export const FieldListPage: React.FC = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('structure');
  
  const table = TABLES.find(t => t.id === tableId) || TABLES[0];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white font-mono tracking-tight">{table.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                {table.dataSource}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                主数据
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1 font-mono">
              ID: <span className="text-slate-300">{table.id}</span> • 上次扫描: <span className="text-cyan-400">今天 10:23</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 text-sm font-medium transition-all">
             <RefreshCcw size={16} /> 同步
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.4)] border border-cyan-400/20 text-sm font-medium transition-all">
             <Sparkles size={16} /> AI 分析
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm">
         <div className="px-6 pt-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/30">
            <div className="flex gap-8 text-sm font-medium text-slate-500">
               <button 
                 onClick={() => setActiveTab('structure')}
                 className={`pb-4 px-1 transition-all relative ${activeTab === 'structure' ? 'text-cyan-400 font-bold' : 'hover:text-slate-300'}`}
               >
                 结构定义 (5)
                 {activeTab === 'structure' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 rounded-t-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>}
               </button>
               <button 
                 onClick={() => setActiveTab('quality')}
                 className={`pb-4 px-1 transition-all relative ${activeTab === 'quality' ? 'text-cyan-400 font-bold' : 'hover:text-slate-300'}`}
               >
                 数据质量
                 {activeTab === 'quality' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 rounded-t-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>}
               </button>
               <button 
                 onClick={() => setActiveTab('lineage')}
                 className={`pb-4 px-1 transition-all relative ${activeTab === 'lineage' ? 'text-cyan-400 font-bold' : 'hover:text-slate-300'}`}
               >
                 血缘分析
                 {activeTab === 'lineage' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 rounded-t-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>}
               </button>
            </div>
            {activeTab === 'structure' && (
              <div className="relative mb-2">
                 <input 
                   type="text" 
                   placeholder="筛选字段..." 
                   className="pl-3 pr-8 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-300 focus:outline-none focus:border-cyan-500/50" 
                 />
              </div>
            )}
         </div>

         {/* Content Area */}
         <div className="p-6 bg-slate-900/20 min-h-[500px]">
           {activeTab === 'structure' && (
             <>
                {/* AI Assistant Banner */}
                <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-indigo-100">语义增强已激活</h3>
                      <p className="text-xs text-indigo-300 mt-0.5">AI 已根据数据分布特征建议了 3 个字段描述。</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-indigo-300 relative z-10">
                    <span className="flex items-center gap-1.5 bg-indigo-900/50 px-3 py-1.5 rounded border border-indigo-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                      采样率: 100%
                    </span>
                    <button className="p-2 hover:bg-indigo-900/50 rounded-lg text-indigo-300 hover:text-white transition-colors">
                      <Settings2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Structure Table */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
                  <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-900">
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase w-12 text-center">#</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">字段名</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">描述</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">数据类型</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">样本示例</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {FIELDS_MOCK.map((field, idx) => (
                      <tr key={field.id} className="hover:bg-slate-700/50 transition-colors group">
                        <td className="px-6 py-4 text-xs text-slate-500 text-center font-mono">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-200 font-mono tracking-tight">{field.name}</span>
                            {field.isPrimaryKey && <Key size={12} className="text-amber-500" />}
                            {field.isSensitive && <Shield size={12} className="text-red-500" />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-400">{field.description}</span>
                              <span className="opacity-0 group-hover:opacity-100 cursor-pointer text-cyan-400 text-xs bg-cyan-950/50 border border-cyan-900 px-1.5 py-0.5 rounded hover:bg-cyan-900/50">编辑</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-slate-900 text-indigo-300 border border-slate-700">
                              {field.dataType}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {field.sampleValues.map((val, i) => (
                                <span key={i} className="inline-block px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded border border-slate-600">
                                  {val}
                                </span>
                              ))}
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
             </>
           )}

           {activeTab === 'quality' && (
             <DataQualityPanel />
           )}

           {activeTab === 'lineage' && (
             <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed">
               <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                 <GitBranch size={32} className="text-slate-400" />
               </div>
               <p className="text-sm font-medium">血缘可视化模块加载中...</p>
             </div>
           )}
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) => (
  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex items-center justify-between hover:border-slate-600 transition-colors">
     <div>
       <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">{label}</p>
       <p className="text-2xl font-bold text-white mt-1 font-mono">{value}</p>
     </div>
     <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 text-slate-300">
       {icon}
     </div>
  </div>
);