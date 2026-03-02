import React, { useState } from 'react';
import { Network, Search, Filter, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { DEPENDENCY_NODES_MOCK, DEPENDENCY_LINKS_MOCK } from '../../../constants';

const NodeColor = {
   'Standard': 'bg-indigo-600 border-indigo-400',
   'Object': 'bg-cyan-600 border-cyan-400',
   'View': 'bg-emerald-600 border-emerald-400',
   'Metric': 'bg-amber-600 border-amber-400',
   'Field': 'bg-slate-600 border-slate-400',
};

export const DependencyGraphPanel: React.FC = () => {
  const [scale, setScale] = useState(1);

  // Simple SVG drawing logic for demo
  const renderLinks = () => {
     return DEPENDENCY_LINKS_MOCK.map((link, i) => {
        const source = DEPENDENCY_NODES_MOCK.find(n => n.id === link.source);
        const target = DEPENDENCY_NODES_MOCK.find(n => n.id === link.target);
        if (!source || !target) return null;

        // Simple straight line for now
        return (
           <g key={i}>
              <line 
                 x1={source.x} y1={source.y} 
                 x2={target.x} y2={target.y} 
                 stroke="#475569" 
                 strokeWidth="1.5" 
                 markerEnd="url(#arrowhead)"
              />
              {/* Label in middle */}
              <text 
                 x={(source.x! + target.x!) / 2} 
                 y={(source.y! + target.y!) / 2 - 5} 
                 textAnchor="middle" 
                 fill="#94a3b8" 
                 fontSize="10"
                 className="bg-slate-900"
              >
                 {link.relation}
              </text>
           </g>
        );
     });
  };

  return (
    <div className="flex flex-col h-full gap-4">
       {/* Toolbar */}
       <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-slate-300 text-sm">
                <Search size={14} />
                <input type="text" placeholder="搜索节点..." className="bg-transparent outline-none w-48 placeholder:text-slate-500" />
             </div>
             <div className="flex gap-2">
                {Object.keys(NodeColor).map(type => (
                   <div key={type} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <div className={`w-2.5 h-2.5 rounded-full ${NodeColor[type as keyof typeof NodeColor].split(' ')[0]}`}></div>
                      {type}
                   </div>
                ))}
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => setScale(s => s + 0.1)} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ZoomIn size={16} /></button>
             <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ZoomOut size={16} /></button>
             <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><Maximize size={16} /></button>
          </div>
       </div>

       {/* Canvas */}
       <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden relative shadow-inner">
          <svg className="w-full h-full" viewBox="0 0 800 800" style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
             <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                   <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                </marker>
             </defs>
             
             {renderLinks()}

             {DEPENDENCY_NODES_MOCK.map(node => (
                <g key={node.id} transform={`translate(${node.x},${node.y})`} className="cursor-pointer hover:opacity-90">
                   <circle r="20" className={`${NodeColor[node.type as keyof typeof NodeColor]} text-white`} strokeWidth="2" />
                   <text y="35" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="bold">{node.label}</text>
                   <text y="50" textAnchor="middle" fill="#64748b" fontSize="10">{node.domain}</text>
                   <circle r="4" fill="white" className="animate-pulse opacity-50" />
                </g>
             ))}
          </svg>
          
          <div className="absolute bottom-4 right-4 bg-slate-800/80 px-4 py-2 rounded text-xs text-slate-400 border border-slate-700 backdrop-blur pointer-events-none">
             双击节点查看详情 / 拖拽移动画布
          </div>
       </div>
    </div>
  );
};