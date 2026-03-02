import React from 'react';
import { Box } from 'lucide-react';
import { BusinessObjectPanel } from '../components/standards/apply/BusinessObjectPanel';

export const BusinessObjectsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">
       <div className="flex items-center justify-between shrink-0">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Box className="text-indigo-400" /> 业务对象落标 <span className="text-slate-600">/</span> Business Objects
             </h1>
             <p className="text-slate-400 text-sm mt-1">
               定义业务实体及其属性标准，确保业务语言与数据实现的统一。
             </p>
          </div>
       </div>
       <BusinessObjectPanel />
    </div>
  );
};