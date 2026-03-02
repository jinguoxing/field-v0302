import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ZoomIn, ZoomOut, Maximize, MousePointer2, Move, Search, Layers, Key, MoreHorizontal, X, Info, Table as TableIcon, Database, ArrowRightLeft, Sparkles, Eye, Compass } from 'lucide-react';
import { ER_NODES, ER_LINKS, FIELDS_MOCK } from '../constants';
import { ERNode } from '../types';

// Node Type Color Mapping - Neon Dark Theme
const TYPE_COLORS: Record<string, string> = {
  '主数据': 'border-cyan-500/50 bg-slate-800 text-cyan-400',
  '事务': 'border-emerald-500/50 bg-slate-800 text-emerald-400',
  '日志': 'border-slate-500/50 bg-slate-800 text-slate-400',
  '默认': 'border-indigo-500/50 bg-slate-800 text-indigo-400'
};

const TYPE_HEADER_COLORS: Record<string, string> = {
  '主数据': 'bg-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.5)]',
  '事务': 'bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.5)]',
  '日志': 'bg-slate-600',
  '默认': 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]'
};

export const RelationshipPage: React.FC = () => {
  const [nodes, setNodes] = useState(ER_NODES);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMinimap, setShowMinimap] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // ---------------- Logic Helpers ----------------

  // Determine if a node should be dimmed (based on search or selection)
  const isNodeDimmed = (nodeId: string) => {
    // 1. Search Filter
    if (searchTerm && !nodes.find(n => n.id === nodeId)?.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
    // 2. Selection Focus (If a node is selected, dim unconnected ones)
    if (selectedNodeId) {
      if (nodeId === selectedNodeId) return false;
      const isConnected = ER_LINKS.some(link => 
        (link.source === selectedNodeId && link.target === nodeId) || 
        (link.target === selectedNodeId && link.source === nodeId)
      );
      return !isConnected;
    }
    return false;
  };

  const isLinkDimmed = (link: { source: string; target: string }) => {
    if (selectedNodeId) {
      return link.source !== selectedNodeId && link.target !== selectedNodeId;
    }
    return false;
  };

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    setSelectedNodeId(nodeId); // Select on click
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    // If clicking empty space, deselect and start panning
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') {
       setSelectedNodeId(null);
       setIsPanning(true);
       lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      setNodes(prev => prev.map(n => {
        if (n.id === draggingNodeId) {
          return {
            ...n,
            position: { x: n.position.x + e.movementX / scale, y: n.position.y + e.movementY / scale }
          };
        }
        return n;
      }));
    } else if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  // Bezier Curve Path
  const getPath = (sourceId: string, targetId: string) => {
    const source = nodes.find(n => n.id === sourceId);
    const target = nodes.find(n => n.id === targetId);
    if (!source || !target) return '';

    const NODE_WIDTH = 256; 
    const NODE_HEADER_HEIGHT = 40;
    // Estimate height based on fields
    const getSourceHeight = () => NODE_HEADER_HEIGHT + (source.fields.length * 28) / 2;
    const getTargetHeight = () => NODE_HEADER_HEIGHT + (target.fields.length * 28) / 2;

    const sx = source.position.x + NODE_WIDTH;
    const sy = source.position.y + getSourceHeight();
    
    const tx = target.position.x;
    const ty = target.position.y + getTargetHeight();

    const dist = Math.abs(tx - sx) / 2;
    // Smoother curvature
    return `M ${sx} ${sy} C ${sx + dist} ${sy}, ${tx - dist} ${ty}, ${tx} ${ty}`;
  };

  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setSelectedNodeId(null);
  };

  const selectedNodeData = useMemo(() => nodes.find(n => n.id === selectedNodeId), [selectedNodeId, nodes]);

  return (
    <div className="h-full flex relative overflow-hidden bg-slate-900 select-none">
       {/* 1. Main Canvas Area */}
       <div className="flex-1 relative flex flex-col rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl m-2 bg-[#0f172a]">
          
          {/* Top Left: Title/Breadcrumb overlay */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
             <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2 drop-shadow-md">
                <ArrowRightLeft className="text-cyan-400" /> 实体关系图谱
             </h2>
             <p className="text-xs text-slate-500 font-mono mt-1">Interactive Entity Relationship Diagram</p>
          </div>

          {/* Top Right: Toolbar */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
             {/* Search */}
             <div className="bg-slate-800/80 backdrop-blur-md p-2 rounded-lg shadow-xl border border-slate-700 flex items-center w-64 transition-all focus-within:ring-1 focus-within:ring-cyan-500/50">
                <Search size={16} className="text-slate-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="查找表或字段..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm bg-transparent outline-none text-slate-200 placeholder:text-slate-500"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="text-slate-500 hover:text-slate-300">
                    <X size={14} />
                  </button>
                )}
             </div>

             {/* Tools */}
             <div className="bg-slate-800/80 backdrop-blur-md p-1.5 rounded-lg shadow-xl border border-slate-700 flex flex-col gap-1">
               <ToolButton onClick={() => setScale(s => Math.min(s + 0.1, 2))} icon={<ZoomIn size={18} />} label="放大" />
               <ToolButton onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} icon={<ZoomOut size={18} />} label="缩小" />
               <ToolButton onClick={handleReset} icon={<Maximize size={18} />} label="适配屏幕" />
               <div className="h-px bg-slate-700 my-1 mx-2"></div>
               <ToolButton onClick={() => setShowMinimap(!showMinimap)} icon={<Compass size={18} />} label={showMinimap ? "隐藏地图" : "显示地图"} active={showMinimap} />
             </div>
          </div>

          {/* Bottom Left: Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-800/90 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-slate-700">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest flex items-center gap-2">
               <Layers size={12} /> 实体类型
             </h4>
             <div className="flex flex-col gap-2">
               {Object.keys(TYPE_COLORS).filter(k => k !== '默认').map(type => (
                 <div key={type} className="flex items-center gap-2 group cursor-default">
                   <div className={`w-3 h-3 rounded-sm ${TYPE_HEADER_COLORS[type].split(' ')[0]} group-hover:scale-110 transition-transform`}></div>
                   <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{type}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Bottom Right: Minimap */}
          {showMinimap && (
            <div className="absolute bottom-4 right-4 z-20 w-48 h-36 bg-slate-800/90 backdrop-blur-md rounded-lg shadow-xl border border-slate-700 overflow-hidden">
               <div className="w-full h-full relative bg-slate-900/50">
                  {nodes.map(node => (
                    <div 
                      key={node.id}
                      className={`absolute w-3 h-2 rounded-sm ${node.id === selectedNodeId ? 'bg-cyan-400' : 'bg-slate-600'}`}
                      style={{ 
                        left: `${(node.position.x / 1500) * 100}%`, // Rough mapping
                        top: `${(node.position.y / 1000) * 100}%` 
                      }}
                    />
                  ))}
                  {/* Viewport Indicator (Mock) */}
                  <div className="absolute w-1/3 h-1/2 border-2 border-cyan-500/50 rounded top-1/4 left-1/4 pointer-events-none"></div>
               </div>
            </div>
          )}

          {/* Interactive Canvas */}
          <div 
            ref={containerRef}
            className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleContainerMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
              backgroundSize: `${20 * scale}px ${20 * scale}px`,
              backgroundPosition: `${offset.x}px ${offset.y}px`
            }}
          >
            <div 
                style={{ 
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, 
                  transformOrigin: '0 0',
                  width: '100%',
                  height: '100%',
                  position: 'relative'
                }}
            >
                {/* SVG Layer for Links */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0">
                  <defs>
                     <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                       <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                     </marker>
                     <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                       <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee" />
                     </marker>
                     <linearGradient id="flow-gradient" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                        <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                     </linearGradient>
                  </defs>
                  
                  {ER_LINKS.map(link => {
                    const isDimmed = isLinkDimmed(link);
                    const isSelected = selectedNodeId && (link.source === selectedNodeId || link.target === selectedNodeId);
                    
                    return (
                      <g key={link.id} className="transition-opacity duration-300" style={{ opacity: isDimmed ? 0.05 : 1 }}>
                        {/* Base Line */}
                        <path 
                          d={getPath(link.source, link.target)}
                          stroke={isSelected ? "#22d3ee" : "#475569"}
                          strokeWidth={isSelected ? 2 : 1.5}
                          fill="none"
                          markerEnd={isSelected ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                        />
                        {/* Animated Flow Particle (Only when active) */}
                        {!isDimmed && (
                           <path 
                             d={getPath(link.source, link.target)}
                             stroke={isSelected ? "url(#flow-gradient)" : "transparent"}
                             strokeWidth={3}
                             fill="none"
                             className="animate-flow"
                             strokeDasharray="10 10"
                           />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes Layer */}
                {nodes.map(node => {
                  const dimmed = isNodeDimmed(node.id);
                  const isSelected = selectedNodeId === node.id;
                  const headerColor = TYPE_HEADER_COLORS[node.type] || TYPE_HEADER_COLORS['默认'];

                  return (
                    <div
                      key={node.id}
                      onMouseDown={(e) => handleMouseDown(e, node.id)}
                      className={`absolute w-64 rounded-lg shadow-2xl transition-all duration-300 flex flex-col border 
                        ${isSelected ? 'z-50 border-cyan-500 ring-2 ring-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.3)]' : 'z-10 border-slate-700 bg-slate-800 hover:border-slate-500 hover:z-40 hover:shadow-xl'}
                        ${dimmed ? 'opacity-20 grayscale scale-95' : 'opacity-100'}
                      `}
                      style={{
                        left: node.position.x,
                        top: node.position.y,
                        backgroundColor: '#1e293b' // Ensure background for opacity
                      }}
                    >
                      {/* Node Header */}
                      <div className={`h-1.5 w-full rounded-t-lg ${headerColor} ${isSelected ? 'animate-pulse' : ''}`}></div>
                      <div className="px-3 py-2.5 border-b border-slate-700 bg-slate-800 rounded-t-lg flex items-start justify-between relative overflow-hidden">
                         <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-600 px-1 rounded bg-slate-700/50">{node.type}</span>
                            </div>
                            <h3 className={`text-sm font-bold leading-tight font-mono ${isSelected ? 'text-cyan-400' : 'text-slate-100'}`} title={node.title}>
                              {node.title.split(' ')[0]}
                            </h3>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{node.title.split(' ')[1] || ''}</p>
                         </div>
                         <button className="text-slate-500 hover:text-cyan-400 transition-colors">
                           <Info size={16} />
                         </button>
                      </div>

                      {/* Node Body (Fields) */}
                      <div className="bg-slate-800/95 rounded-b-lg py-1">
                        {node.fields.slice(0, 5).map((field, i) => (
                          <div 
                            key={i} 
                            className={`
                              flex items-center justify-between py-1.5 px-3 text-xs border-l-2 group/field cursor-default
                              ${field.isKey ? 'border-amber-500 bg-amber-500/5' : 'border-transparent hover:bg-slate-700/50'}
                            `}
                          >
                             <div className="flex items-center gap-2 overflow-hidden">
                               {field.isKey ? <Key size={10} className="text-amber-500 flex-shrink-0" /> : <div className="w-2.5"></div>}
                               <span className={`font-medium truncate font-mono transition-colors ${field.isKey ? 'text-amber-200' : 'text-slate-400 group-hover/field:text-slate-200'}`}>
                                 {field.name}
                               </span>
                             </div>
                             <span className="text-slate-600 font-mono text-[9px] uppercase ml-2">{field.type}</span>
                          </div>
                        ))}
                        {node.fields.length > 5 && (
                           <div className="px-3 py-1 text-[10px] text-slate-500 text-center hover:text-cyan-400 cursor-pointer">
                              + {node.fields.length - 5} 更多字段...
                           </div>
                        )}
                        <div className="h-1"></div>
                      </div>
                      
                      {/* Connection Points (Visual only) */}
                      <div className={`absolute top-1/2 -left-1 w-2 h-2 rounded-full bg-slate-600 border border-slate-800 ${isSelected ? 'bg-cyan-400 scale-125 shadow-[0_0_5px_rgba(34,211,238,1)]' : ''}`}></div>
                      <div className={`absolute top-1/2 -right-1 w-2 h-2 rounded-full bg-slate-600 border border-slate-800 ${isSelected ? 'bg-cyan-400 scale-125 shadow-[0_0_5px_rgba(34,211,238,1)]' : ''}`}></div>
                    </div>
                  );
                })}
            </div>
          </div>
       </div>

       {/* 2. Detail Sidebar (Slides in when node selected) */}
       <div className={`w-80 bg-slate-800/95 border-l border-slate-700 shadow-2xl transition-all duration-300 transform ${selectedNodeId ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'} z-30 flex flex-col`}>
          {selectedNodeData ? (
             <>
                {/* Header */}
                <div className="p-5 border-b border-slate-700 bg-slate-800 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Database size={64} />
                   </div>
                   <div className="flex items-center justify-between mb-2 relative z-10">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${TYPE_HEADER_COLORS[selectedNodeData.type].replace('shadow-', 'border-').replace('bg-', 'text-').split(' ')[0]} bg-slate-900`}>
                        {selectedNodeData.type}
                      </span>
                      <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-white">
                         <X size={16} />
                      </button>
                   </div>
                   <h2 className="text-lg font-bold text-white font-mono break-all relative z-10">{selectedNodeData.title.split(' ')[0]}</h2>
                   <p className="text-xs text-slate-400 font-mono mt-1 relative z-10">{selectedNodeData.title.split(' ')[1]}</p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                   {/* Meta Stats */}
                   <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                         <p className="text-[10px] text-slate-500 uppercase">数据量</p>
                         <p className="text-sm font-bold text-slate-200 font-mono">3.5K 行</p>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                         <p className="text-[10px] text-slate-500 uppercase">最后更新</p>
                         <p className="text-sm font-bold text-slate-200 font-mono">10 分钟前</p>
                      </div>
                   </div>

                   {/* AI Insight */}
                   <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2 text-indigo-400">
                         <Sparkles size={14} />
                         <span className="text-xs font-bold">AI 洞察</span>
                      </div>
                      <p className="text-xs text-indigo-200 leading-relaxed">
                         该表作为核心主数据，与 <span className="text-white font-mono">t_hr_payroll</span> 存在高频关联。建议对 <code className="bg-indigo-950 px-1 rounded">emp_id</code> 字段建立聚簇索引以优化查询性能。
                      </p>
                   </div>

                   {/* Field List Preview */}
                   <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                         <TableIcon size={14} /> 结构预览
                      </h4>
                      <div className="space-y-1">
                         {selectedNodeData.fields.map((f, i) => (
                            <div key={i} className="flex items-center justify-between text-xs p-2 rounded hover:bg-slate-700/50 group">
                               <div className="flex items-center gap-2">
                                  {f.isKey && <Key size={10} className="text-amber-500" />}
                                  <span className={`font-mono ${f.isKey ? 'text-amber-100' : 'text-slate-300'}`}>{f.name}</span>
                               </div>
                               <span className="text-slate-600 font-mono">{f.type}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                   
                   {/* Mock Data Preview */}
                   <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                         <Eye size={14} /> 数据采样
                      </h4>
                      <div className="bg-slate-900 rounded border border-slate-700 overflow-hidden">
                         <table className="w-full text-[10px] text-left">
                            <thead className="bg-slate-800 text-slate-500">
                               <tr>
                                  <th className="p-2 font-normal">ID</th>
                                  <th className="p-2 font-normal">Value</th>
                               </tr>
                            </thead>
                            <tbody className="text-slate-400 divide-y divide-slate-800">
                               <tr><td className="p-2 font-mono text-slate-500">1</td><td className="p-2">Sample A</td></tr>
                               <tr><td className="p-2 font-mono text-slate-500">2</td><td className="p-2">Sample B</td></tr>
                               <tr><td className="p-2 font-mono text-slate-500">3</td><td className="p-2">Sample C</td></tr>
                            </tbody>
                         </table>
                      </div>
                   </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-700 bg-slate-800">
                   <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded shadow-lg shadow-cyan-900/20 transition-all">
                      查看完整详情
                   </button>
                </div>
             </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <MousePointer2 size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">选择一个实体</p>
                <p className="text-xs mt-1 opacity-50">点击画布中的节点查看详细属性和关系</p>
             </div>
          )}
       </div>

       {/* Inline Styles for Animation */}
       <style>{`
         @keyframes flow {
           from { stroke-dashoffset: 20; }
           to { stroke-dashoffset: 0; }
         }
         .animate-flow {
           animation: flow 1s linear infinite;
         }
       `}</style>
    </div>
  );
};

const ToolButton = ({ onClick, icon, label, active = false }: { onClick: () => void, icon: React.ReactNode, label: string, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-md transition-all group relative flex items-center justify-center
      ${active ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}
    `}
  >
    {icon}
    {/* Tooltip */}
    <span className="absolute right-full mr-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
      {label}
    </span>
  </button>
);