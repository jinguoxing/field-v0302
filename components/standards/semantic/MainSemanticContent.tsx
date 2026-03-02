import React, { useState } from 'react';
import { SemanticField, SemanticEvidence } from '../../../types';
import { 
  Sparkles, Layers, Box, ArrowRight, ChevronDown, ChevronRight, 
  BarChart2, Network, TableProperties, Fingerprint, Database, 
  GitCommit, CheckCircle2, AlertOctagon 
} from 'lucide-react';

interface MainSemanticContentProps {
  viewType: 'field' | 'table' | 'mapping';
  selectedField?: SemanticField;
  onViewChange: (view: 'field' | 'table' | 'mapping') => void;
}

// Mock Data for Evidence
const EVIDENCE_MOCK: SemanticEvidence[] = [
  { id: 'ev1', type: 'Naming', title: '命名匹配 (95%)', weight: 40, score: 95, description: '字段名 "mobile_no" 强匹配标准 "Mobile_Phone" 的同义词。' },
  { id: 'ev2', type: 'Distribution', title: '数据特征 (98%)', weight: 30, score: 98, description: '正则 ^1[3-9]\\d{9}$ 匹配了 10k 样本中的 99.8%。', details: { chart: 'Distribution Graph Placeholder' } },
  { id: 'ev3', type: 'Lineage', title: '上游血缘', weight: 15, score: 80, description: '源列 t_crm_user.phone 已映射到标准。' },
  { id: 'ev4', type: 'Embedding', title: '语义相似度', weight: 15, score: 85, description: '与 "Telephone Number" 概念的向量距离为 0.12。' }
];

const CandidateCard = ({ isPrimary, name, type, confidence }: { isPrimary?: boolean, name: string, type: string, confidence: number }) => (
  <div className={`p-4 rounded-xl border relative transition-all ${isPrimary ? 'bg-indigo-900/20 border-indigo-500/50 shadow-lg' : 'bg-slate-800 border-slate-700 opacity-80 hover:opacity-100'}`}>
     {isPrimary && (
        <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
           <Sparkles size={10} /> AI 首选 (Top Pick)
        </div>
     )}
     <div className="flex justify-between items-start mb-2">
        <div>
           <h4 className={`text-sm font-bold ${isPrimary ? 'text-white' : 'text-slate-300'}`}>{name}</h4>
           <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">{type}</span>
              <span className="text-[10px] text-slate-500">角色: 标识符</span>
           </div>
        </div>
        <div className={`text-lg font-mono font-bold ${confidence >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
           {confidence}%
        </div>
     </div>
     <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full ${confidence >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${confidence}%` }}></div>
     </div>
  </div>
);

const EvidenceItem: React.FC<{ evidence: SemanticEvidence }> = ({ evidence }) => {
   const [expanded, setExpanded] = useState(false);

   return (
      <div className="border-b border-slate-700/50 last:border-0">
         <div 
            className="flex items-center justify-between p-3 hover:bg-slate-800/50 cursor-pointer transition-colors"
            onClick={() => setExpanded(!expanded)}
         >
            <div className="flex items-center gap-3">
               <div className={`p-1.5 rounded-lg border ${evidence.type === 'Naming' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : evidence.type === 'Distribution' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                  {evidence.type === 'Naming' && <Fingerprint size={14} />}
                  {evidence.type === 'Distribution' && <BarChart2 size={14} />}
                  {evidence.type === 'Lineage' && <GitCommit size={14} />}
                  {evidence.type === 'Embedding' && <Network size={14} />}
               </div>
               <div>
                  <h5 className="text-xs font-bold text-slate-200">{evidence.title}</h5>
                  <p className="text-[10px] text-slate-500">权重: {evidence.weight}%</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs font-mono font-bold text-slate-300">+{evidence.score}</span>
               {expanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
            </div>
         </div>
         {expanded && (
            <div className="px-3 pb-3 pl-12">
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-xs text-slate-400 leading-relaxed">
                  {evidence.description}
                  {evidence.details && (
                     <div className="mt-2 h-24 bg-slate-800 rounded border border-slate-700 border-dashed flex items-center justify-center text-slate-600">
                        图表占位符 (Visualization)
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export const MainSemanticContent: React.FC<MainSemanticContentProps> = ({ viewType, selectedField, onViewChange }) => {
  if (!selectedField && viewType === 'field') {
     return (
        <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
           <Sparkles size={48} className="opacity-20" />
           <p>请选择一个字段以查看语义分析</p>
        </div>
     );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-900/30 p-6 overflow-hidden">
       {/* Breadcrumb Tabs */}
       <div className="flex gap-4 mb-6 border-b border-slate-700/50 pb-2">
          <button 
            onClick={() => onViewChange('field')}
            className={`pb-2 text-sm font-bold transition-all ${viewType === 'field' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
             字段裁决 (Field Adjudication)
          </button>
          <button 
            onClick={() => onViewChange('table')}
            className={`pb-2 text-sm font-bold transition-all ${viewType === 'table' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
             表级理解 (Table Analysis)
          </button>
          <button 
            onClick={() => onViewChange('mapping')}
            className={`pb-2 text-sm font-bold transition-all ${viewType === 'mapping' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
             对象映射 (Object Mapping)
          </button>
       </div>

       <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
          
          {/* VIEW A: FIELD ADJUDICATION */}
          {viewType === 'field' && selectedField && (
             <>
                {/* AI Recommendation Section */}
                <section>
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sparkles size={12} className="text-indigo-400" /> AI 语义推荐
                   </h3>
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <CandidateCard isPrimary name="Mobile_Phone (CN)" type="DataElement" confidence={95} />
                      <div className="space-y-2 opacity-70 hover:opacity-100 transition-opacity">
                         <CandidateCard name="Telephone_Number" type="Term" confidence={65} />
                         <CandidateCard name="Contact_Way" type="DataElement" confidence={42} />
                      </div>
                   </div>
                </section>

                {/* Evidence Chain Section */}
                <section className="flex-1 bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
                   <div className="p-4 border-b border-slate-700 bg-slate-800/60 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                         <Layers size={16} className="text-emerald-400" /> AI 推理证据链 (Evidence Chain)
                      </h3>
                      <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-700">综合得分: 95/100</span>
                   </div>
                   <div>
                      {EVIDENCE_MOCK.map(ev => (
                         <EvidenceItem key={ev.id} evidence={ev} />
                      ))}
                   </div>
                </section>
             </>
          )}

          {/* VIEW B: TABLE ANALYSIS */}
          {viewType === 'table' && (
             <div className="space-y-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20"><Database size={20} /></div>
                      <div>
                         <h3 className="text-lg font-bold text-white">t_hr_employee_v2</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">主数据 (MASTER)</span>
                            <span className="text-xs text-slate-500">置信度: 98%</span>
                         </div>
                      </div>
                   </div>
                   <p className="text-sm text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 leading-relaxed">
                      <span className="text-indigo-400 font-bold">推理逻辑：</span> 该表包含高稳定性的主键 <code className="text-amber-400">emp_id</code>，且被 12 张下游业务表引用作为外键。数据更新频率低，属性字段占比 &gt; 80%，符合主数据特征。
                   </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
                      <div className="text-xs text-slate-500 uppercase mb-1">主键稳定性</div>
                      <div className="text-2xl font-mono text-emerald-400 font-bold">100%</div>
                   </div>
                   <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
                      <div className="text-xs text-slate-500 uppercase mb-1">被引用次数</div>
                      <div className="text-2xl font-mono text-cyan-400 font-bold">128</div>
                   </div>
                   <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
                      <div className="text-xs text-slate-500 uppercase mb-1">敏感字段数</div>
                      <div className="text-2xl font-mono text-red-400 font-bold">3</div>
                   </div>
                </div>
             </div>
          )}

          {/* VIEW C: OBJECT MAPPING */}
          {viewType === 'mapping' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                   <div className="flex items-center gap-4">
                      <div className="text-center">
                         <div className="text-[10px] text-slate-500 uppercase">物理表 (Physical)</div>
                         <div className="text-sm font-bold text-white font-mono">t_hr_employee</div>
                      </div>
                      <ArrowRight size={20} className="text-slate-600" />
                      <div className="text-center">
                         <div className="text-[10px] text-slate-500 uppercase">业务对象 (BO)</div>
                         <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                            <Box size={14} /> Employee (Individual)
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-2xl font-bold text-white font-mono">85%</div>
                      <div className="text-[10px] text-slate-500 uppercase">映射覆盖率</div>
                   </div>
                </div>

                <div className="border border-slate-700 rounded-xl overflow-hidden">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-slate-900/50 text-slate-500 text-xs font-bold uppercase">
                         <tr>
                            <th className="px-4 py-3">源字段 (Source)</th>
                            <th className="px-4 py-3">目标属性 (Target)</th>
                            <th className="px-4 py-3">置信度 (Conf)</th>
                            <th className="px-4 py-3">状态</th>
                            <th className="px-4 py-3 text-right">操作</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50 bg-slate-800/20">
                         <tr className="hover:bg-slate-700/30">
                            <td className="px-4 py-3 font-mono text-slate-300">emp_id</td>
                            <td className="px-4 py-3 font-mono text-emerald-400">employeeIdentifier</td>
                            <td className="px-4 py-3">
                               <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500" style={{ width: '99%' }}></div>
                               </div>
                            </td>
                            <td className="px-4 py-3"><CheckCircle2 size={14} className="text-emerald-500" /></td>
                            <td className="px-4 py-3 text-right"><button className="text-xs text-slate-500 hover:text-white">编辑</button></td>
                         </tr>
                         <tr className="hover:bg-slate-700/30">
                            <td className="px-4 py-3 font-mono text-slate-300">full_name</td>
                            <td className="px-4 py-3 font-mono text-emerald-400">name</td>
                            <td className="px-4 py-3">
                               <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500" style={{ width: '95%' }}></div>
                               </div>
                            </td>
                            <td className="px-4 py-3"><CheckCircle2 size={14} className="text-emerald-500" /></td>
                            <td className="px-4 py-3 text-right"><button className="text-xs text-slate-500 hover:text-white">编辑</button></td>
                         </tr>
                         <tr className="bg-red-900/10 hover:bg-red-900/20 border-l-2 border-red-500">
                            <td className="px-4 py-3 font-mono text-slate-300">dept_code</td>
                            <td className="px-4 py-3 font-mono text-slate-500 italic">-- 未映射 --</td>
                            <td className="px-4 py-3">
                               <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-500" style={{ width: '20%' }}></div>
                               </div>
                            </td>
                            <td className="px-4 py-3"><AlertOctagon size={14} className="text-red-500" /></td>
                            <td className="px-4 py-3 text-right"><button className="text-xs text-indigo-400 hover:text-white">映射</button></td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          )}

       </div>
    </div>
  );
};