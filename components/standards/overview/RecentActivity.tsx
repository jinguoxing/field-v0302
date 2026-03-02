import React, { useState } from 'react';
import { Clock, Filter, FileText, Trash2, Edit } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'published' | 'deprecated' | 'changed'>('published');

  const tabs = [
    { id: 'published', label: '已发布 (Published)' },
    { id: 'deprecated', label: '已废弃 (Deprecated)' },
    { id: 'changed', label: '变更记录 (Changed)' },
  ];

  // Mock Data
  const data = {
    published: [
       { id: 1, name: 'Std_Mobile_Format', domain: '通用域', time: '10 mins ago', user: 'Admin' },
       { id: 2, name: 'Biz_Order_Status', domain: '交易域', time: '2 hours ago', user: 'Zhang.S' },
       { id: 5, name: 'Data_Cust_Level', domain: '客户域', time: '5 hours ago', user: 'Li.W' },
    ],
    deprecated: [
       { id: 3, name: 'Old_Region_Code', domain: '主数据', time: 'Yesterday', user: 'Li.W' },
    ],
    changed: [
       { id: 4, name: 'Metric_DAU_Calc', domain: '运营域', time: '3 days ago', user: 'System', change: 'Formula Updated' },
    ]
  };

  const currentList = data[activeTab as keyof typeof data] || [];

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
       <div className="p-4 border-b border-slate-700 bg-slate-900/30 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
             <Clock size={16} className="text-slate-400" /> 最近动态
          </h3>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
             {tabs.map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === tab.id ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   {tab.label}
                </button>
             ))}
          </div>
       </div>
       
       <div className="p-0">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-900/50 text-slate-500 text-xs font-medium uppercase border-b border-slate-700/50">
                <tr>
                   <th className="px-6 py-3">标准名称</th>
                   <th className="px-6 py-3">所属域</th>
                   <th className="px-6 py-3">操作人</th>
                   <th className="px-6 py-3">时间</th>
                   <th className="px-6 py-3 text-right">详情</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-700/50">
                {currentList.map((item: any) => (
                   <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-300 text-xs">
                         <div className="flex items-center gap-2">
                            {activeTab === 'published' && <FileText size={14} className="text-emerald-400" />}
                            {activeTab === 'deprecated' && <Trash2 size={14} className="text-red-400" />}
                            {activeTab === 'changed' && <Edit size={14} className="text-amber-400" />}
                            {item.name}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{item.domain}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{item.user}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{item.time}</td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-xs text-cyan-400 hover:underline">View</button>
                      </td>
                   </tr>
                ))}
                {currentList.length === 0 && (
                   <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-xs">暂无记录</td>
                   </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
};