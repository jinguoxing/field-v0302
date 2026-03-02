import React, { useState } from 'react';
import { Box, Search, Filter, Cuboid, Star, Activity, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { BUSINESS_OBJECTS_MOCK } from '../../../constants';
import { BusinessObject } from '../../../types';

export const BusinessObjectPanel: React.FC = () => {
  const [selectedObject, setSelectedObject] = useState<BusinessObject | null>(null);

  return (
    <div className="flex flex-col h-full gap-6">
       
       {selectedObject ? (
          // DETAIL VIEW
          <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-lg backdrop-blur-sm animate-in slide-in-from-right duration-300">
             <div className="p-6 border-b border-slate-700 bg-slate-900/30 flex items-start justify-between">
                <div>
                   <button onClick={() => setSelectedObject(null)} className="text-xs text-slate-500 hover:text-cyan-400 mb-2 flex items-center gap-1 transition-colors">
                      ← 返回列表
                   </button>
                   <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-white">{selectedObject.cnName}</h2>
                      <span className="text-sm font-mono text-slate-500">({selectedObject.name})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${selectedObject.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                         {selectedObject.status}
                      </span>
                   </div>
                   <p className="text-sm text-slate-400 mt-2 max-w-3xl">{selectedObject.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-900/20 px-3 py-1.5 rounded border border-indigo-500/20">
                      <Sparkles size={12} />
                      AI 建议：检测到 2 个缺失的关键属性
                   </div>
                </div>
             </div>

             <div className="flex-1 overflow-auto p-6">
                <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                   <Cuboid size={16} className="text-cyan-400" /> 属性定义
                </h3>
                <div className="border border-slate-700 rounded-lg overflow-hidden">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-slate-900/50 text-slate-500 text-xs font-bold uppercase">
                         <tr>
                            <th className="px-4 py-3 border-b border-slate-700">属性名称</th>
                            <th className="px-4 py-3 border-b border-slate-700">类型</th>
                            <th className="px-4 py-3 border-b border-slate-700">必填</th>
                            <th className="px-4 py-3 border-b border-slate-700">绑定数据元</th>
                            <th className="px-4 py-3 border-b border-slate-700">敏感分级</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50 bg-slate-800/20">
                         {selectedObject.attributes.map(attr => (
                            <tr key={attr.id} className="hover:bg-slate-700/30">
                               <td className="px-4 py-3">
                                  <div className="font-medium text-slate-200">{attr.cnName}</div>
                                  <div className="text-xs text-slate-500 font-mono">{attr.name}</div>
                               </td>
                               <td className="px-4 py-3 text-slate-400 font-mono text-xs">{attr.dataType}</td>
                               <td className="px-4 py-3">
                                  {attr.isRequired ? <span className="text-red-400 text-xs font-bold">是</span> : <span className="text-slate-600 text-xs">否</span>}
                               </td>
                               <td className="px-4 py-3">
                                  {attr.boundElement ? (
                                     <span className="bg-cyan-900/20 text-cyan-400 px-2 py-1 rounded text-xs border border-cyan-500/20 font-mono">
                                        {attr.boundElement}
                                     </span>
                                  ) : (
                                     <span className="text-slate-500 text-xs italic">未绑定</span>
                                  )}
                               </td>
                               <td className="px-4 py-3">
                                  {attr.sensitiveLevel ? (
                                     <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${attr.sensitiveLevel === 'L3' || attr.sensitiveLevel === 'L4' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                                        {attr.sensitiveLevel}
                                     </span>
                                  ) : '-'}
                               </td>
                            </tr>
                         ))}
                         {selectedObject.attributes.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">暂无属性定义</td></tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
       ) : (
          // LIST VIEW
          <>
            <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700 shadow-sm backdrop-blur-sm">
               <div className="flex items-center gap-4">
                  <div className="relative">
                     <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
                     <input type="text" placeholder="搜索业务对象..." className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="h-6 w-px bg-slate-700"></div>
                  <div className="flex gap-2">
                     <select className="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-lg p-2 outline-none">
                        <option>所有域</option>
                        <option>客户域</option>
                        <option>交易域</option>
                     </select>
                  </div>
               </div>
               <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
                  + 新建业务对象
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
               {BUSINESS_OBJECTS_MOCK.map(obj => (
                  <div 
                     key={obj.id} 
                     onClick={() => setSelectedObject(obj)}
                     className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all cursor-pointer group flex flex-col h-56"
                  >
                     <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
                           <Cuboid size={20} />
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${obj.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                           {obj.status}
                        </span>
                     </div>
                     
                     <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-1">{obj.cnName}</h3>
                     <p className="text-xs text-slate-500 font-mono mb-3">{obj.name}</p>
                     
                     <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">{obj.description}</p>
                     
                     <div className="border-t border-slate-700/50 pt-3 flex justify-between items-center text-xs text-slate-500">
                        <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">{obj.domain}</span>
                        <div className="flex items-center gap-3">
                           <span className="flex items-center gap-1" title="成熟度">
                              <Activity size={12} className={obj.maturity === 'High' ? 'text-emerald-400' : 'text-amber-400'} /> 
                              {obj.maturity}
                           </span>
                           <span title="引用数">Ref: {obj.refCount}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </>
       )}
    </div>
  );
};