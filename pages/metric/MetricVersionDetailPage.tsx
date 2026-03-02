
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Play, CheckCircle2, AlertTriangle, 
  Settings2, Plus, Trash2, Code, ShieldCheck, 
  Layers, Lock, Database, Clock, Calculator, Sigma,
  Filter, Tag, BarChart2, Layout, Zap, RefreshCw,
  FileOutput, MousePointer2, GitMerge, Search,
  ArrowRight, Box, Terminal, Copy, Scale,
  GitCompare, FileDiff, History, TrendingUp,
  Download, Link as LinkIcon, Share2, XCircle,
  Check, FileText, Monitor, Server, AlertOctagon,
  GitBranch, Shield, ArrowDown, Shuffle, Calendar,
  X
} from 'lucide-react';
import { METRIC_ASSETS_MOCK, METRIC_VERSIONS_MOCK, STANDARD_ITEMS_MOCK, LOGICAL_VIEWS_MOCK, TABLES } from '../../constants';
import { MetricDefinition, MetricMeasure, ImplementationMode, MetricVersion } from '../../types';

// --- Canvas Types ---
interface CanvasNode {
  id: string;
  type: 'Source' | 'Filter' | 'Transform' | 'Aggregate' | 'Window' | 'Output';
  position: { x: number; y: number };
  data: any;
}

interface CanvasEdge {
  id: string;
  source: string;
  target: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles = status === 'Active' || status === 'Published' 
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
    : 'bg-slate-700 text-slate-400 border-slate-600';
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles}`}>
      {status}
    </span>
  );
};

export const MetricVersionDetailPage: React.FC = () => {
  const { metricId, versionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'definition' | 'implementation' | 'evidence' | 'compliance' | 'changes' | 'usage'>('definition');
  
  // Load data
  const metricAsset = METRIC_ASSETS_MOCK.find(m => m.id === metricId);
  const versionData = METRIC_VERSIONS_MOCK.find(v => v.id === versionId);

  // Standard Comparison Logic
  const boundStandardId = versionData?.standardBinding?.standardId;
  const boundStandard = boundStandardId ? STANDARD_ITEMS_MOCK.find(s => s.id === boundStandardId) : null;
  const isStandardOutdated = boundStandard && versionData?.standardBinding?.standardVersion !== boundStandard.version;

  // Form State (Initialized from version data)
  const [definition, setDefinition] = useState<MetricDefinition | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | 'checking'>('valid');

  // Implementation State
  const [implMode, setImplMode] = useState<ImplementationMode>('AUTO_SQL');
  const [sqlCode, setSqlCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<{type: 'info'|'error'|'success', msg: string}[]>([]);

  useEffect(() => {
    if (versionData) {
      setDefinition(JSON.parse(JSON.stringify(versionData.definition)));
      setImplMode(versionData.implementation.mode);
      setSqlCode(versionData.implementation.sql || '');
    }
  }, [versionData]);

  if (!metricAsset || !versionData || !definition) {
    return <div className="text-slate-500 p-8">Version not found</div>;
  }

  const isReadOnly = versionData.status !== 'Draft';

  // --- Handlers ---

  const handleUpdateDefinition = (field: keyof MetricDefinition, value: any) => {
    if (isReadOnly) return;
    setDefinition(prev => prev ? ({ ...prev, [field]: value }) : null);
    setIsDirty(true);
    setValidationStatus('checking');
    setTimeout(() => setValidationStatus('valid'), 500); 
  };

  const handleUpdateMeasure = (index: number, field: keyof MetricMeasure, value: any) => {
    if (isReadOnly) return;
    setDefinition(prev => {
        if (!prev) return null;
        const newMeasures = [...prev.measures];
        newMeasures[index] = { ...newMeasures[index], [field]: value };
        return { ...prev, measures: newMeasures };
    });
    setIsDirty(true);
  };

  const handleAddMeasure = () => {
    if (isReadOnly) return;
    setDefinition(prev => prev ? ({ 
        ...prev, 
        measures: [...prev.measures, { name: '', agg: 'SUM', expr: '', unit: '', isAdditive: true }] 
    }) : null);
    setIsDirty(true);
  };

  const handleRemoveMeasure = (index: number) => {
    if (isReadOnly) return;
    setDefinition(prev => prev ? ({
        ...prev,
        measures: prev.measures.filter((_, i) => i !== index)
    }) : null);
    setIsDirty(true);
  };

  const handleAddConstraint = () => {
      if (isReadOnly) return;
      const constraints = definition.constraints || [];
      handleUpdateDefinition('constraints', [...constraints, { type: 'NoSplit', dimensions: [], description: '' }]);
  };

  const handleRemoveConstraint = (index: number) => {
      if (isReadOnly) return;
      const constraints = definition.constraints || [];
      handleUpdateDefinition('constraints', constraints.filter((_, i) => i !== index));
  };

  // --- Implementation Handlers ---

  const runSqlValidation = () => {
     setConsoleOutput([{ type: 'info', msg: 'Starting SQL semantic validation...' }]);
     setTimeout(() => {
        setConsoleOutput(prev => [
           ...prev,
           { type: 'success', msg: 'Syntax Check: Passed' },
           { type: 'success', msg: 'Table Existence: t_dwd_order (Verified)' },
           { type: 'success', msg: 'Column Traceability: 100%' },
           { type: 'info', msg: 'Execution Plan estimated cost: Low' }
        ]);
     }, 1000);
  };

  const extractDefinitionFromSql = () => {
     if (isReadOnly) return;
     // Mock reverse engineering
     setConsoleOutput([{ type: 'info', msg: 'Extracting logic from SQL...' }]);
     setTimeout(() => {
        setDefinition(prev => prev ? ({
           ...prev,
           grain: 'Order',
           measures: [{ name: 'extracted_amt', agg: 'SUM', expr: 'pay_amt', isAdditive: true }]
        }) : null);
        setConsoleOutput(prev => [...prev, { type: 'success', msg: 'Definition updated from SQL structure.' }]);
        setIsDirty(true);
     }, 800);
  };

  // --- Canvas Component (Moved inside to access state) ---
  const CanvasView = () => {
     // Initial Nodes State
     const [nodes, setNodes] = useState<CanvasNode[]>([
        { id: '1', type: 'Source', position: { x: 60, y: 80 }, data: { source: 't_dwd_order' } },
        { id: '2', type: 'Filter', position: { x: 320, y: 80 }, data: { conditions: [{ field: 'status', op: '=', value: "'paid'" }] } },
        { id: '3', type: 'Aggregate', position: { x: 580, y: 80 }, data: { measures: [{ agg: 'SUM', field: 'pay_amount', alias: 'gmv' }] } },
        { id: '4', type: 'Window', position: { x: 580, y: 250 }, data: { type: 'Daily', field: 'pay_time' } },
        { id: '5', type: 'Output', position: { x: 840, y: 160 }, data: {} }
     ]);
     const [edges, setEdges] = useState<CanvasEdge[]>([
        { id: 'e1', source: '1', target: '2' },
        { id: 'e2', source: '2', target: '3' },
        { id: 'e3', source: '3', target: '5' },
        { id: 'e4', source: '4', target: '5' },
     ]);
     
     const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
     const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
     const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
     
     const canvasRef = useRef<HTMLDivElement>(null);
     const selectedNode = nodes.find(n => n.id === selectedNodeId);

     // --- Node Drag Handlers ---
     const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        if (isReadOnly) return;
        
        const node = nodes.find(n => n.id === nodeId);
        if (node) {
           setSelectedNodeId(nodeId);
           setDraggingNodeId(nodeId);
           setDragOffset({
              x: e.clientX - node.position.x,
              y: e.clientY - node.position.y
           });
        }
     };

     const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (draggingNodeId && !isReadOnly) {
           e.preventDefault();
           // Calculate new position relative to canvas
           const canvasRect = canvasRef.current?.getBoundingClientRect();
           if (canvasRect) {
              const newX = e.clientX - canvasRect.left - dragOffset.x;
              const newY = e.clientY - canvasRect.top - dragOffset.y;
              
              setNodes(prev => prev.map(n => {
                 if (n.id === draggingNodeId) {
                    return {
                       ...n,
                       position: {
                          x: newX,
                          y: newY
                       }
                    };
                 }
                 return n;
              }));
           }
        }
     };

     const handleCanvasMouseUp = () => {
        setDraggingNodeId(null);
     };

     // --- Drag & Drop from Library ---
     const handleDragStart = (e: React.DragEvent, type: string) => {
        e.dataTransfer.setData('nodeType', type);
        e.dataTransfer.effectAllowed = 'copy';
     };

     const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (isReadOnly) return;

        const type = e.dataTransfer.getData('nodeType') as CanvasNode['type'];
        if (type && canvasRef.current) {
           const canvasRect = canvasRef.current.getBoundingClientRect();
           const x = e.clientX - canvasRect.left - 80; // Center approx
           const y = e.clientY - canvasRect.top - 20;

           const newNode: CanvasNode = {
              id: `n_${Date.now()}`,
              type,
              position: { x, y },
              data: getDefaultData(type)
           };
           
           setNodes(prev => [...prev, newNode]);
           setSelectedNodeId(newNode.id);
        }
     };

     const getDefaultData = (type: string) => {
        switch(type) {
           case 'Source': return { source: 'Select Table' };
           case 'Filter': return { conditions: [] };
           case 'Aggregate': return { measures: [] };
           case 'Window': return { type: 'Daily', field: '' };
           default: return {};
        }
     };

     const handleDeleteNode = (id: string) => {
        if (isReadOnly) return;
        setNodes(prev => prev.filter(n => n.id !== id));
        setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
        if (selectedNodeId === id) setSelectedNodeId(null);
     };

     // --- State Sync ---
     const updateNodeData = (id: string, data: any) => {
        if (isReadOnly) return;
        setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n));
     };

     const handleSync = () => {
        if (isReadOnly) return;
        
        // 1. Extract from Canvas
        const aggNode = nodes.find(n => n.type === 'Aggregate');
        const filterNode = nodes.find(n => n.type === 'Filter');
        const windowNode = nodes.find(n => n.type === 'Window');

        // 2. Map to Definition
        const newDef: Partial<MetricDefinition> = {};
        
        if (aggNode) {
           newDef.measures = (aggNode.data.measures || []).map((m: any) => ({
              name: m.alias || 'measure',
              agg: m.agg || 'SUM',
              expr: m.field || '',
              unit: 'Unknown',
              isAdditive: true
           }));
        }
        if (filterNode) {
           newDef.filters = (filterNode.data.conditions || []).map((c: any) => `${c.field} ${c.op} ${c.value}`);
        }
        if (windowNode) {
           newDef.timeWindow = windowNode.data.type;
        }

        // 3. Update State
        setDefinition(prev => prev ? ({ ...prev, ...newDef }) : null);
        setConsoleOutput([{ type: 'success', msg: 'Definition synced from Canvas configuration.' }]);
        setIsDirty(true);
     };

     const handleGenerateSQL = () => {
        // Mock SQL Gen
        const source = nodes.find(n => n.type === 'Source')?.data.source || 'table';
        const filters = nodes.find(n => n.type === 'Filter')?.data.conditions?.map((c: any) => `${c.field} ${c.op} ${c.value}`).join(' AND ') || '1=1';
        const measures = nodes.find(n => n.type === 'Aggregate')?.data.measures?.map((m: any) => `${m.agg}(${m.field}) as ${m.alias}`).join(', ');
        
        const sql = `SELECT \n  date_trunc('day', time_col),\n  ${measures || '*'}\nFROM ${source}\nWHERE ${filters}\nGROUP BY 1`;
        setSqlCode(sql);
        setConsoleOutput([{ type: 'success', msg: 'SQL generated from Canvas nodes.' }]);
        setImplMode('SQL');
     };

     // Node Icon Helper
     const getNodeIcon = (type: string) => {
        switch(type) {
           case 'Source': return <Database size={14} className="text-blue-400" />;
           case 'Filter': return <Filter size={14} className="text-amber-400" />;
           case 'Transform': return <Shuffle size={14} className="text-violet-400" />;
           case 'Aggregate': return <Sigma size={14} className="text-emerald-400" />;
           case 'Window': return <Calendar size={14} className="text-cyan-400" />;
           case 'Output': return <FileOutput size={14} className="text-indigo-400" />;
           default: return <Box size={14} />;
        }
     };

     // Render Lines (Bezier)
     const getPath = (sourceId: string, targetId: string) => {
        const s = nodes.find(n => n.id === sourceId);
        const t = nodes.find(n => n.id === targetId);
        if (!s || !t) return '';
        
        const sx = s.position.x + 160; // Right side of source
        const sy = s.position.y + 36;  // Vertical Center
        const tx = t.position.x;       // Left side of target
        const ty = t.position.y + 36;

        return `M ${sx} ${sy} C ${sx + 60} ${sy}, ${tx - 60} ${ty}, ${tx} ${ty}`;
     };

     return (
        <div className="flex h-full border border-slate-700 rounded-xl overflow-hidden bg-slate-900 relative">
           {/* Node Library (Left) */}
           <div className="w-48 border-r border-slate-700 bg-slate-800/50 p-4 flex flex-col gap-4 z-20">
              <div className="text-xs font-bold text-slate-500 uppercase">节点类型</div>
              <p className="text-[10px] text-slate-500 mb-2">拖拽添加节点</p>
              {['Source', 'Filter', 'Transform', 'Aggregate', 'Window', 'Output'].map(type => (
                 <div 
                    key={type} 
                    draggable={!isReadOnly}
                    onDragStart={(e) => handleDragStart(e, type)}
                    className={`p-3 bg-slate-800 border border-slate-600 rounded flex items-center gap-2 opacity-80 hover:opacity-100 ${isReadOnly ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing hover:border-cyan-500'}`}
                 >
                    {getNodeIcon(type)}
                    <span className="text-xs text-slate-300">{type}</span>
                 </div>
              ))}
              
              <div className="mt-auto pt-4 border-t border-slate-700">
                 <button onClick={handleSync} disabled={isReadOnly} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded text-xs font-bold flex items-center justify-center gap-2 mb-2">
                    <RefreshCw size={12} /> Sync to Definition
                 </button>
                 <button onClick={handleGenerateSQL} className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold flex items-center justify-center gap-2">
                    <Code size={12} /> Generate SQL
                 </button>
              </div>
           </div>

           {/* Canvas Area (Center) */}
           <div 
              ref={canvasRef}
              className="flex-1 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] relative overflow-hidden"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
           >
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                 <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                       <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                    </marker>
                 </defs>
                 {edges.map((e) => (
                    <path key={e.id} d={getPath(e.source, e.target)} stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                 ))}
              </svg>

              {nodes.map(node => (
                 <div 
                    key={node.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    className={`absolute w-40 bg-slate-800 border rounded-lg shadow-lg p-3 cursor-grab active:cursor-grabbing transition-shadow z-10 select-none
                       ${selectedNodeId === node.id ? 'border-cyan-500 ring-1 ring-cyan-500 shadow-cyan-900/20' : 'border-slate-600 hover:border-slate-500'}
                    `}
                    style={{ left: node.position.x, top: node.position.y }}
                 >
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2 text-xs font-bold">
                          {getNodeIcon(node.type)}
                          <span className="text-slate-200">{node.type}</span>
                       </div>
                       {!isReadOnly && selectedNodeId === node.id && (
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }} className="text-slate-500 hover:text-red-400">
                             <X size={12} />
                          </button>
                       )}
                    </div>
                    
                    {/* Node Summary Content */}
                    <div className="text-[10px] text-slate-400 space-y-1 min-h-[20px] pointer-events-none">
                       {node.type === 'Source' && <div className="truncate text-white">{node.data.source || 'Select Source'}</div>}
                       {node.type === 'Filter' && <div className="text-amber-300">{node.data.conditions?.length || 0} conditions</div>}
                       {node.type === 'Aggregate' && <div className="text-emerald-300">{(node.data.measures || []).map((m: any) => m.agg).join(', ') || 'No measures'}</div>}
                       {node.type === 'Window' && <div className="text-cyan-300">{node.data.type}</div>}
                       {node.type === 'Output' && <div className="text-indigo-300 font-bold">Target Schema</div>}
                    </div>
                    
                    {/* Ports */}
                    {node.type !== 'Source' && <div className="absolute -left-1.5 top-1/2 -mt-1.5 w-3 h-3 bg-slate-400 rounded-full border-2 border-slate-800 hover:bg-cyan-400 transition-colors"></div>}
                    {node.type !== 'Output' && <div className="absolute -right-1.5 top-1/2 -mt-1.5 w-3 h-3 bg-slate-400 rounded-full border-2 border-slate-800 hover:bg-cyan-400 transition-colors"></div>}
                 </div>
              ))}
              
              {isReadOnly && (
                 <div className="absolute top-4 left-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 z-50">
                    <Lock size={12} /> Read-Only Mode (Published)
                 </div>
              )}
           </div>

           {/* Properties Panel (Right) */}
           <div className="w-72 border-l border-slate-700 bg-slate-800/50 p-4 overflow-y-auto z-20">
              {selectedNode ? (
                 <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                       <h3 className="text-sm font-bold text-white">{selectedNode.type} Settings</h3>
                       <span className="text-[9px] font-mono text-slate-500">{selectedNode.id}</span>
                    </div>
                    
                    {/* Dynamic Forms based on Type */}
                    {selectedNode.type === 'Source' && (
                       <div className="space-y-3 animate-in fade-in">
                          <div>
                             <label className="text-xs text-slate-400 block mb-1">Data Asset</label>
                             <select 
                                disabled={isReadOnly}
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-white outline-none focus:border-blue-500"
                                value={selectedNode.data.source}
                                onChange={(e) => updateNodeData(selectedNode.id, { source: e.target.value })}
                             >
                                <option value="">Select Table...</option>
                                <option value="t_dwd_order">t_dwd_order</option>
                                <option value="v_order_summary">v_order_summary</option>
                             </select>
                          </div>
                          <div>
                             <label className="text-xs text-slate-400 block mb-1">Type</label>
                             <div className="flex gap-2">
                                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] border border-slate-600">Table</span>
                                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] border border-slate-600">Logical View</span>
                             </div>
                          </div>
                       </div>
                    )}

                    {selectedNode.type === 'Filter' && (
                       <div className="space-y-3 animate-in fade-in">
                          {(selectedNode.data.conditions || []).map((cond: any, i: number) => (
                             <div key={i} className="bg-slate-900 p-2 rounded border border-slate-600 space-y-2">
                                <div className="flex justify-between text-[10px] text-slate-500 uppercase">
                                   Condition {i+1}
                                   <button onClick={() => {
                                      if(isReadOnly) return;
                                      const newConds = selectedNode.data.conditions.filter((_: any, idx: number) => idx !== i);
                                      updateNodeData(selectedNode.id, { conditions: newConds });
                                   }} className="hover:text-red-400"><X size={10}/></button>
                                </div>
                                <input 
                                   disabled={isReadOnly}
                                   className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white outline-none" 
                                   placeholder="Field"
                                   value={cond.field} 
                                   onChange={(e) => {
                                      const newConds = [...selectedNode.data.conditions];
                                      newConds[i].field = e.target.value;
                                      updateNodeData(selectedNode.id, { conditions: newConds });
                                   }}
                                />
                                <div className="flex gap-2">
                                   <select 
                                      disabled={isReadOnly}
                                      className="bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white w-16 outline-none"
                                      value={cond.op}
                                      onChange={(e) => {
                                         const newConds = [...selectedNode.data.conditions];
                                         newConds[i].op = e.target.value;
                                         updateNodeData(selectedNode.id, { conditions: newConds });
                                      }}
                                   >
                                      <option>=</option>
                                      <option>&gt;</option>
                                      <option>&lt;</option>
                                      <option>!=</option>
                                   </select>
                                   <input 
                                      disabled={isReadOnly}
                                      className="flex-1 bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white outline-none" 
                                      placeholder="Value"
                                      value={cond.value} 
                                      onChange={(e) => {
                                         const newConds = [...selectedNode.data.conditions];
                                         newConds[i].value = e.target.value;
                                         updateNodeData(selectedNode.id, { conditions: newConds });
                                      }}
                                   />
                                </div>
                             </div>
                          ))}
                          <button 
                             disabled={isReadOnly} 
                             onClick={() => {
                                const newConds = [...(selectedNode.data.conditions || []), { field: '', op: '=', value: '' }];
                                updateNodeData(selectedNode.id, { conditions: newConds });
                             }}
                             className="text-xs text-cyan-400 hover:text-white flex items-center gap-1 w-full justify-center py-2 border border-dashed border-slate-600 rounded hover:border-cyan-500 hover:bg-slate-700/50"
                          >
                             <Plus size={10} /> Add Condition
                          </button>
                       </div>
                    )}

                    {selectedNode.type === 'Aggregate' && (
                       <div className="space-y-3 animate-in fade-in">
                          {(selectedNode.data.measures || []).map((m: any, i: number) => (
                             <div key={i} className="bg-slate-900 p-2 rounded border border-slate-600 space-y-2 relative group">
                                <button onClick={() => {
                                      if(isReadOnly) return;
                                      const newMs = selectedNode.data.measures.filter((_: any, idx: number) => idx !== i);
                                      updateNodeData(selectedNode.id, { measures: newMs });
                                   }} className="absolute top-1 right-1 text-slate-600 hover:text-red-400"><X size={10}/></button>
                                <div className="flex gap-2">
                                   <select 
                                      disabled={isReadOnly}
                                      className="bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white w-20 font-bold outline-none"
                                      value={m.agg}
                                      onChange={(e) => {
                                         const newMs = [...selectedNode.data.measures];
                                         newMs[i].agg = e.target.value;
                                         updateNodeData(selectedNode.id, { measures: newMs });
                                      }}
                                   >
                                      <option>SUM</option>
                                      <option>COUNT</option>
                                      <option>AVG</option>
                                      <option>MAX</option>
                                   </select>
                                   <input 
                                      disabled={isReadOnly}
                                      className="flex-1 bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white outline-none" 
                                      placeholder="Field"
                                      value={m.field}
                                      onChange={(e) => {
                                         const newMs = [...selectedNode.data.measures];
                                         newMs[i].field = e.target.value;
                                         updateNodeData(selectedNode.id, { measures: newMs });
                                      }}
                                   />
                                </div>
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] text-slate-500">AS</span>
                                   <input 
                                      disabled={isReadOnly}
                                      className="flex-1 bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white outline-none" 
                                      placeholder="Alias"
                                      value={m.alias}
                                      onChange={(e) => {
                                         const newMs = [...selectedNode.data.measures];
                                         newMs[i].alias = e.target.value;
                                         updateNodeData(selectedNode.id, { measures: newMs });
                                      }}
                                   />
                                </div>
                             </div>
                          ))}
                          <button 
                             disabled={isReadOnly} 
                             onClick={() => {
                                const newMs = [...(selectedNode.data.measures || []), { agg: 'SUM', field: '', alias: '' }];
                                updateNodeData(selectedNode.id, { measures: newMs });
                             }}
                             className="text-xs text-emerald-400 hover:text-white flex items-center gap-1 w-full justify-center py-2 border border-dashed border-slate-600 rounded hover:border-emerald-500 hover:bg-slate-700/50"
                          >
                             <Plus size={10} /> Add Measure
                          </button>
                       </div>
                    )}

                    {selectedNode.type === 'Window' && (
                       <div className="space-y-3 animate-in fade-in">
                          <div>
                             <label className="text-xs text-slate-400 block mb-1">Window Type</label>
                             <select 
                                disabled={isReadOnly}
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-white outline-none focus:border-cyan-500"
                                value={selectedNode.data.type}
                                onChange={(e) => updateNodeData(selectedNode.id, { type: e.target.value })}
                             >
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                                <option>Rolling 7d</option>
                             </select>
                          </div>
                          <div>
                             <label className="text-xs text-slate-400 block mb-1">Time Field</label>
                             <input 
                                disabled={isReadOnly}
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-white outline-none focus:border-cyan-500"
                                value={selectedNode.data.field} 
                                onChange={(e) => updateNodeData(selectedNode.id, { field: e.target.value })}
                             />
                          </div>
                       </div>
                    )}

                    {selectedNode.type === 'Output' && (
                       <div className="bg-slate-900 p-3 rounded border border-slate-600 text-xs font-mono text-slate-400 animate-in fade-in">
                          <p>Output Schema (Read-only)</p>
                          <div className="mt-2 pl-2 border-l border-slate-700 space-y-1">
                             <div className="flex justify-between"><span className="text-indigo-400">dim_date</span> <span>DATE</span></div>
                             <div className="flex justify-between"><span className="text-emerald-400">gmv</span> <span>DECIMAL</span></div>
                          </div>
                       </div>
                    )}

                 </div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <MousePointer2 size={32} className="mb-2 opacity-20" />
                    <p className="text-xs">Select a node to edit properties</p>
                 </div>
              )}
           </div>
        </div>
     );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-900 animate-in fade-in duration-300">
       
       {/* 1. Header */}
       <div className="h-16 px-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate(`/metrics/${metricId}`)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
             </button>
             <div>
                <div className="flex items-center gap-3">
                   <h1 className="text-lg font-bold text-white tracking-tight">{metricAsset.cnName}</h1>
                   <StatusBadge status={versionData.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono">
                   {metricAsset.code} <span className="text-slate-600">/</span> {versionData.versionNo}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
             {isDirty && (
                 <span className="text-xs text-amber-400 flex items-center gap-1 animate-pulse mr-2">
                     <AlertTriangle size={12} /> 未保存
                 </span>
             )}
             
             {/* Dynamic Actions based on Status */}
             {versionData.status === 'Draft' && (
                <>
                   <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
                       <Save size={14} /> 保存草稿
                   </button>
                   <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                       <CheckCircle2 size={14} /> 提交审核
                   </button>
                </>
             )}

             {versionData.status === 'InReview' && (
                <>
                   <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                       <XCircle size={14} /> 驳回
                   </button>
                   <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                       <Check size={14} /> 批准发布
                   </button>
                </>
             )}

             {versionData.status === 'Published' && (
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20">
                    <Copy size={14} /> 克隆新版本
                </button>
             )}

             {/* Common Actions */}
             <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Export Definition">
                <Download size={18} />
             </button>
             <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Copy Link">
                <LinkIcon size={18} />
             </button>
          </div>
       </div>

       {/* 2. Tabs */}
       <div className="flex border-b border-slate-700 bg-slate-800/50 px-6 shrink-0 overflow-x-auto">
          {['definition', 'implementation', 'evidence', 'compliance', 'changes', 'usage'].map(tab => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
             >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
             </button>
          ))}
       </div>

       {/* 3. Main Content (Scrollable) */}
       <div className="flex-1 overflow-hidden bg-slate-900/50 relative">
          
          {/* TAB A: DEFINITION */}
          {activeTab === 'definition' && (
             <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                   {/* ... [Definition Content same as before] ... */}
                   {/* Reusing existing code for Definition Tab content */}
                   <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                         <Settings2 size={16} className="text-indigo-400" /> 基础属性 (Identity)
                      </h3>
                      <div className="grid grid-cols-4 gap-6">
                         <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">指标类型</label>
                            <div className="text-sm font-mono text-white bg-slate-900 px-3 py-2 rounded border border-slate-700">
                               {definition.metricType}
                            </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">所属域</label>
                            <div className="text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded border border-slate-700">
                               {metricAsset.domain}
                            </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">负责人</label>
                            <div className="text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded border border-slate-700">
                               {metricAsset.owner}
                            </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">标准绑定</label>
                            <div className="text-sm text-indigo-400 bg-slate-900 px-3 py-2 rounded border border-slate-700 flex items-center gap-2">
                               <ShieldCheck size={12} />
                               {versionData.standardBinding ? versionData.standardBinding.standardId : '未绑定'}
                            </div>
                         </div>
                      </div>
                   </section>

                   <section className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
                         <Calculator size={16} className="text-cyan-400" /> 计算语义 (Computation Semantics)
                      </h3>

                      <div className="grid grid-cols-2 gap-8 mb-6">
                         <div className="space-y-4">
                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                  <Database size={12} /> 统计粒度 (Grain) <span className="text-red-400">*</span>
                               </label>
                               <select 
                                  disabled={isReadOnly}
                                  value={definition.grain}
                                  onChange={(e) => handleUpdateDefinition('grain', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 disabled:opacity-60"
                               >
                                  <option value="User">User (用户)</option>
                                  <option value="Order">Order (订单)</option>
                                  <option value="SKU">SKU (商品)</option>
                               </select>
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                  <Clock size={12} /> 时间窗口 (Time Window) <span className="text-red-400">*</span>
                               </label>
                               <select 
                                  disabled={isReadOnly}
                                  value={definition.timeWindow}
                                  onChange={(e) => handleUpdateDefinition('timeWindow', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 disabled:opacity-60"
                               >
                                  <option value="Daily">Daily (天)</option>
                                  <option value="Weekly">Weekly (周)</option>
                                  <option value="Monthly">Monthly (月)</option>
                               </select>
                            </div>
                         </div>

                         <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                               <Layers size={12} /> 维度 (Dimensions)
                            </label>
                            <div className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-3 flex flex-wrap content-start gap-2">
                               {definition.dimensions.map(dim => (
                                  <span key={dim} className="px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded border border-slate-700 flex items-center gap-1">
                                     {dim}
                                     {!isReadOnly && <button className="hover:text-red-400"><Trash2 size={10} /></button>}
                                  </span>
                               ))}
                               {!isReadOnly && (
                                  <button className="px-2 py-1 bg-slate-800/50 text-slate-500 text-xs rounded border border-slate-700 border-dashed hover:text-cyan-400 hover:border-cyan-500/50 transition-colors">
                                     + 添加维度
                                  </button>
                               )}
                            </div>
                         </div>
                      </div>

                      <div className="mb-6">
                         <label className="text-xs font-bold text-slate-400 flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2"><Sigma size={12} /> 度量 (Measures)</div>
                            {!isReadOnly && (
                               <button onClick={handleAddMeasure} className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                                  <Plus size={10} /> 新增度量
                               </button>
                            )}
                         </label>
                         
                         <div className="border border-slate-700 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-xs">
                               <thead className="bg-slate-900 text-slate-500 uppercase">
                                  <tr>
                                     <th className="px-4 py-2 w-10">#</th>
                                     <th className="px-4 py-2 w-1/4">Name</th>
                                     <th className="px-4 py-2 w-24">Agg</th>
                                     <th className="px-4 py-2">Expression</th>
                                     <th className="px-4 py-2 w-24">Unit</th>
                                     <th className="px-4 py-2 w-20 text-center">Additive</th>
                                     {!isReadOnly && <th className="px-4 py-2 w-10"></th>}
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-700 bg-slate-800/30">
                                  {definition.measures.map((m, idx) => (
                                     <tr key={idx} className="group">
                                        <td className="px-4 py-2 text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-2">
                                           <input 
                                              type="text" 
                                              disabled={isReadOnly}
                                              value={m.name} 
                                              onChange={(e) => handleUpdateMeasure(idx, 'name', e.target.value)}
                                              className="w-full bg-transparent border-b border-transparent focus:border-cyan-500 outline-none text-white disabled:opacity-70"
                                           />
                                        </td>
                                        <td className="px-4 py-2">
                                           <select 
                                              disabled={isReadOnly}
                                              value={m.agg}
                                              onChange={(e) => handleUpdateMeasure(idx, 'agg', e.target.value)}
                                              className="bg-transparent text-indigo-400 outline-none font-bold cursor-pointer disabled:opacity-70"
                                           >
                                              <option value="SUM">SUM</option>
                                              <option value="COUNT">COUNT</option>
                                              <option value="AVG">AVG</option>
                                           </select>
                                        </td>
                                        <td className="px-4 py-2">
                                           <input 
                                              type="text" 
                                              disabled={isReadOnly}
                                              value={m.expr} 
                                              onChange={(e) => handleUpdateMeasure(idx, 'expr', e.target.value)}
                                              className="w-full bg-transparent border-b border-transparent focus:border-cyan-500 outline-none text-slate-300 font-mono disabled:opacity-70" 
                                           />
                                        </td>
                                        <td className="px-4 py-2">
                                           <input 
                                              type="text" 
                                              disabled={isReadOnly}
                                              value={m.unit || ''} 
                                              onChange={(e) => handleUpdateMeasure(idx, 'unit', e.target.value)}
                                              className="w-full bg-transparent border-b border-transparent focus:border-cyan-500 outline-none text-slate-400 disabled:opacity-70" 
                                           />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                           <input 
                                              type="checkbox" 
                                              disabled={isReadOnly}
                                              checked={m.isAdditive !== false}
                                              onChange={(e) => handleUpdateMeasure(idx, 'isAdditive', e.target.checked)}
                                              className="rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-0 cursor-pointer disabled:opacity-50"
                                           />
                                        </td>
                                        {!isReadOnly && (
                                           <td className="px-4 py-2 text-right">
                                              <button onClick={() => handleRemoveMeasure(idx)} className="text-slate-600 hover:text-red-400 transition-colors">
                                                 <Trash2 size={12} />
                                              </button>
                                           </td>
                                        )}
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>

                      {/* Filters */}
                      <div>
                         <label className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-2">
                            <Filter size={12} /> 过滤条件 (Filters)
                         </label>
                         <div className="bg-slate-900 rounded-lg p-3 border border-slate-700 space-y-2">
                            {definition.filters.map((f, i) => (
                               <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                  <span className="text-indigo-400 font-mono text-xs">AND</span>
                                  <div className="bg-slate-800 px-2 py-1 rounded border border-slate-700 font-mono text-xs flex-1">
                                     {f}
                                  </div>
                                  {!isReadOnly && <button className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>}
                               </div>
                            ))}
                            {!isReadOnly && (
                               <button className="text-[10px] text-slate-500 hover:text-cyan-400 flex items-center gap-1 mt-1">
                                  + 添加过滤规则
                               </button>
                            )}
                         </div>
                      </div>
                   </section>

                   {/* CONSTRAINTS */}
                   <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Lock size={16} className="text-amber-400" /> 使用约束 (Constraints)
                         </h3>
                         {!isReadOnly && (
                            <button onClick={handleAddConstraint} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                               <Plus size={12} /> 添加约束
                            </button>
                         )}
                      </div>
                      
                      <div className="space-y-3">
                         {(definition.constraints || []).map((c, i) => (
                            <div key={i} className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                               <select 
                                  disabled={isReadOnly}
                                  value={c.type} 
                                  onChange={(e) => {
                                     if (isReadOnly) return;
                                     const newConstraints = [...(definition.constraints || [])];
                                     newConstraints[i].type = e.target.value as any;
                                     handleUpdateDefinition('constraints', newConstraints);
                                  }}
                                  className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-amber-400 outline-none w-32 disabled:opacity-70"
                               >
                                  <option value="NoSplit">禁止拆分</option>
                                  <option value="NoCombine">禁止联用</option>
                                  <option value="NoDrillDown">禁止下钻</option>
                               </select>
                               <div className="flex-1">
                                  <input 
                                     type="text" 
                                     disabled={isReadOnly}
                                     value={c.description} 
                                     onChange={(e) => {
                                        if (isReadOnly) return;
                                        const newConstraints = [...(definition.constraints || [])];
                                        newConstraints[i].description = e.target.value;
                                        handleUpdateDefinition('constraints', newConstraints);
                                     }}
                                     className="w-full bg-transparent border-b border-slate-700 focus:border-amber-500 outline-none text-xs text-slate-300 pb-1 disabled:opacity-70"
                                     placeholder="描述约束条件..."
                                  />
                               </div>
                               {!isReadOnly && (
                                  <button onClick={() => handleRemoveConstraint(i)} className="text-slate-600 hover:text-red-400">
                                     <Trash2 size={12} />
                                  </button>
                               )}
                            </div>
                         ))}
                         {(!definition.constraints || definition.constraints.length === 0) && (
                            <div className="text-xs text-slate-500 italic text-center py-2">暂无特殊约束</div>
                         )}
                      </div>
                   </section>
                </div>
             </div>
          )}

          {/* TAB B: IMPLEMENTATION */}
          {activeTab === 'implementation' && (
             <div className="flex flex-col h-full bg-slate-900">
                {/* 1. Mode Switcher Toolbar */}
                <div className="p-3 border-b border-slate-700 bg-slate-800 flex justify-between items-center shrink-0">
                   <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                      <button 
                         onClick={() => setImplMode('AUTO_SQL')} 
                         className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${implMode === 'AUTO_SQL' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                         <Zap size={14} /> Auto SQL
                      </button>
                      <button 
                         onClick={() => setImplMode('SQL')} 
                         className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${implMode === 'SQL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                         <Code size={14} /> SQL Editor
                      </button>
                      <button 
                         onClick={() => setImplMode('CANVAS')} 
                         className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${implMode === 'CANVAS' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                         <Layout size={14} /> Canvas
                      </button>
                   </div>
                   
                   <div className="text-xs text-slate-500 flex items-center gap-4">
                      {implMode === 'AUTO_SQL' && <span className="flex items-center gap-1 text-cyan-400"><Lock size={12} /> Generated from Definition</span>}
                      {implMode === 'SQL' && <span className="flex items-center gap-1 text-indigo-400"><Code size={12} /> Manual Override</span>}
                      {implMode === 'CANVAS' && <span className="flex items-center gap-1 text-violet-400"><MousePointer2 size={12} /> Visual Builder</span>}
                   </div>
                </div>

                {/* 2. Content Area */}
                <div className="flex-1 flex overflow-hidden">
                   
                   {/* MODE: AUTO SQL */}
                   {implMode === 'AUTO_SQL' && (
                      <div className="flex-1 flex gap-6 p-6">
                         {/* Code Viewer */}
                         <div className="flex-1 bg-slate-950 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-lg">
                            <div className="p-3 bg-slate-900 border-b border-slate-700 flex justify-between items-center text-xs text-slate-400">
                               <span className="font-mono">generated_script.sql</span>
                               <button className="hover:text-white flex items-center gap-1"><Copy size={12} /> Copy</button>
                            </div>
                            <div className="flex-1 p-4 font-mono text-xs text-cyan-100 overflow-auto whitespace-pre leading-relaxed opacity-80 select-text">
                               {sqlCode || "-- No SQL Generated"}
                            </div>
                         </div>
                         
                         {/* Parameters Schema */}
                         <div className="w-80 bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg overflow-y-auto">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                               <Settings2 size={16} className="text-cyan-400" /> 生成参数 (Schema)
                            </h3>
                            <div className="space-y-4">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">时间参数</label>
                                  <div className="bg-slate-900 p-2 rounded border border-slate-600 text-xs text-slate-300 font-mono">
                                     ${'{biz_date}'}
                                  </div>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">维度字段</label>
                                  <div className="flex flex-wrap gap-2">
                                     {definition.dimensions.map(d => (
                                        <span key={d} className="bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-600 text-xs">{d}</span>
                                     ))}
                                  </div>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400">依赖表</label>
                                  <div className="space-y-1">
                                     <div className="flex items-center gap-2 text-xs text-slate-300">
                                        <Database size={12} className="text-indigo-400" /> t_dwd_order
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* MODE: SQL EDITOR */}
                   {implMode === 'SQL' && (
                      <div className="flex-1 flex flex-col">
                         {/* Toolbar */}
                         <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-4">
                            <button 
                               onClick={runSqlValidation}
                               className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold transition-colors"
                            >
                               <Play size={14} /> Validate
                            </button>
                            <button 
                               onClick={extractDefinitionFromSql}
                               disabled={isReadOnly}
                               className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold transition-colors disabled:opacity-50"
                            >
                               <GitMerge size={14} /> Extract Definition
                            </button>
                         </div>
                         
                         {/* Editor */}
                         <div className="flex-1 bg-slate-950 p-4 relative">
                            <textarea 
                               value={sqlCode}
                               onChange={(e) => !isReadOnly && setSqlCode(e.target.value)}
                               readOnly={isReadOnly}
                               className="w-full h-full bg-transparent text-slate-200 font-mono text-sm outline-none resize-none"
                               spellCheck={false}
                            />
                         </div>

                         {/* Console Panel */}
                         <div className="h-40 bg-slate-900 border-t border-slate-700 flex flex-col">
                            <div className="px-4 py-1 bg-slate-800 text-[10px] text-slate-400 border-b border-slate-700 flex items-center gap-2">
                               <Terminal size={10} /> Console Output
                            </div>
                            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1">
                               {consoleOutput.length === 0 && <span className="text-slate-600 italic">Ready...</span>}
                               {consoleOutput.map((log, i) => (
                                  <div key={i} className={`flex items-start gap-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}>
                                     <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                                     <span>{log.msg}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   )}

                   {/* MODE: CANVAS */}
                   {implMode === 'CANVAS' && <CanvasView />}

                </div>
             </div>
          )}

          {/* TAB C: EVIDENCE */}
          {activeTab === 'evidence' && (
             <div className="p-6 h-full overflow-y-auto custom-scrollbar space-y-6">
                
                <div className="grid grid-cols-2 gap-6">
                   {/* 1. Field Trace */}
                   <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                         <GitBranch size={16} className="text-indigo-400" /> 字段溯源 (Field Traceability)
                      </h3>
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 text-xs">
                            <span className="bg-slate-800 border border-slate-600 px-2 py-1 rounded text-slate-300 font-mono">pay_amount</span>
                            <ArrowRight size={12} className="text-slate-500" />
                            <span className="bg-indigo-900/30 border border-indigo-500/30 px-2 py-1 rounded text-indigo-300 font-bold">DataElement: Amount</span>
                            <ArrowRight size={12} className="text-slate-500" />
                            <span className="bg-emerald-900/30 border border-emerald-500/30 px-2 py-1 rounded text-emerald-300 font-bold">Standard: Trade_Amt</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs">
                            <span className="bg-slate-800 border border-slate-600 px-2 py-1 rounded text-slate-300 font-mono">order_id</span>
                            <ArrowRight size={12} className="text-slate-500" />
                            <span className="bg-indigo-900/30 border border-indigo-500/30 px-2 py-1 rounded text-indigo-300 font-bold">DataElement: ID</span>
                            <ArrowRight size={12} className="text-slate-500" />
                            <span className="bg-emerald-900/30 border border-emerald-500/30 px-2 py-1 rounded text-emerald-300 font-bold">Standard: Order_ID</span>
                         </div>
                      </div>
                   </div>

                   {/* 2. Validation Report */}
                   <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                         <ShieldCheck size={16} className="text-emerald-400" /> 校验报告 (Validation)
                      </h3>
                      <div className="space-y-2 text-sm">
                         <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700/50">
                            <span className="text-slate-300">语法校验 (Syntax)</span>
                            <span className="text-emerald-400 flex items-center gap-1 text-xs font-bold"><Check size={12} /> Passed</span>
                         </div>
                         <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700/50">
                            <span className="text-slate-300">字段存在性 (Field Existence)</span>
                            <span className="text-emerald-400 flex items-center gap-1 text-xs font-bold"><Check size={12} /> Passed</span>
                         </div>
                         <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700/50">
                            <span className="text-slate-300">口径一致性 (Consistency)</span>
                            <span className="text-amber-400 flex items-center gap-1 text-xs font-bold"><AlertTriangle size={12} /> Warning</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 3. Access Logs */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                      <Shield size={16} className="text-red-400" /> 敏感访问记录 (Access Logs)
                   </h3>
                   <table className="w-full text-left text-xs">
                      <thead className="text-slate-500 uppercase">
                         <tr>
                            <th className="pb-2">时间</th>
                            <th className="pb-2">用户</th>
                            <th className="pb-2">操作</th>
                            <th className="pb-2">状态</th>
                         </tr>
                      </thead>
                      <tbody className="text-slate-300">
                         <tr>
                            <td className="py-1">2024-06-27 10:00</td>
                            <td>Admin</td>
                            <td>View Definition</td>
                            <td className="text-emerald-400">Allowed</td>
                         </tr>
                         <tr>
                            <td className="py-1">2024-06-26 14:30</td>
                            <td>Guest</td>
                            <td>Edit SQL</td>
                            <td className="text-red-400">Denied</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {/* TAB D: COMPLIANCE */}
          {activeTab === 'compliance' && (
             <div className="p-6 h-full overflow-y-auto custom-scrollbar space-y-6">
                
                {/* Standard Binding Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex justify-between items-center shadow-lg">
                   <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">已绑定标准</div>
                      <div className="flex items-center gap-3">
                         <Scale size={24} className="text-indigo-400" />
                         <div>
                            <h2 className="text-lg font-bold text-white">
                               {boundStandardId || '未绑定'}
                            </h2>
                            <p className="text-xs text-slate-400 flex items-center gap-2">
                               Ver: v{versionData.standardBinding?.standardVersion || '-'} 
                               {isStandardOutdated && (
                                  <span className="text-amber-400 font-bold bg-amber-500/10 px-1 rounded">Update Available (v{boundStandard?.version})</span>
                               )}
                            </p>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400 font-mono">95%</div>
                      <div className="text-xs text-slate-500 uppercase">合规度</div>
                   </div>
                </div>

                {/* Waiver Section (Rule 5) */}
                {versionData.waiverInfo?.isWaived && (
                   <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 flex gap-3">
                      <ShieldCheck size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                         <h4 className="text-sm font-bold text-indigo-200">已获得豁免 (Waived)</h4>
                         <p className="text-xs text-indigo-300/70 mt-1">
                            原因: {versionData.waiverInfo.reason} (Approved: {versionData.waiverInfo.approvalDate})
                         </p>
                         <p className="text-[10px] text-indigo-400 mt-2">注意：豁免状态会降低该指标在 AI 问数中的推荐权重。</p>
                      </div>
                   </div>
                )}

                {/* Drift / Gap Analysis */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                      <GitCompare size={16} className="text-amber-400" /> 差异检测 (Drift Analysis)
                   </h3>
                   <div className="space-y-3">
                      {isStandardOutdated && (
                         <div className="flex items-start gap-4 p-3 bg-amber-900/10 border border-amber-500/20 rounded-lg">
                            <RefreshCw size={16} className="text-amber-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                               <h4 className="text-xs font-bold text-amber-300">标准版本滞后 (Version Mismatch)</h4>
                               <p className="text-xs text-amber-200/70 mt-1">当前实现基于旧版标准 ({versionData.standardBinding?.standardVersion})，标准库已更新至 {boundStandard?.version}。</p>
                            </div>
                            <button className="text-xs bg-amber-900/30 text-amber-300 px-3 py-1.5 rounded hover:bg-amber-900/50 transition-colors">升级对比</button>
                         </div>
                      )}

                      <div className="flex items-start gap-4 p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                         <AlertOctagon size={16} className="text-red-400 shrink-0 mt-0.5" />
                         <div className="flex-1">
                            <h4 className="text-xs font-bold text-red-300">维度缺失 (Missing Dimension)</h4>
                            <p className="text-xs text-red-200/70 mt-1">标准要求必须包含 `Channel` 维度，当前实现未包含。</p>
                         </div>
                         <button className="text-xs bg-red-900/30 text-red-300 px-3 py-1.5 rounded hover:bg-red-900/50 transition-colors">修复</button>
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                   <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2">
                      <Zap size={16} /> 一键对齐标准 (Auto Align)
                   </button>
                   <button className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                      <FileText size={16} /> 申请豁免 (Apply Waiver)
                   </button>
                </div>
             </div>
          )}

          {/* TAB E: CHANGES */}
          {activeTab === 'changes' && (
             <div className="flex flex-col h-full bg-slate-900">
                <div className="p-3 border-b border-slate-700 bg-slate-800 flex justify-between items-center shrink-0">
                   <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">对比版本:</span>
                      <select className="bg-slate-900 border border-slate-600 rounded text-xs text-slate-200 px-2 py-1 outline-none">
                         <option>v1.0.0 (Published)</option>
                         <option>v0.9.0 (Draft)</option>
                      </select>
                   </div>
                   <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-900/20 px-1.5 py-0.5 rounded border border-red-500/20">- Deleted</span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-500/20">+ Added</span>
                   </div>
                </div>
                
                <div className="flex-1 overflow-auto p-6 space-y-6">
                   {/* Definition Diff */}
                   <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                      <div className="p-3 border-b border-slate-700 bg-slate-900/30 font-bold text-xs text-slate-300">
                         Definition Changes
                      </div>
                      <div className="p-4 font-mono text-xs space-y-2">
                         <div className="flex gap-4">
                            <span className="w-24 text-slate-500">Grain:</span>
                            <span className="text-red-400 line-through mr-2">Session</span>
                            <span className="text-emerald-400">Order</span>
                         </div>
                         <div className="flex gap-4">
                            <span className="w-24 text-slate-500">Dimensions:</span>
                            <div className="flex-1">
                               <span className="text-slate-300">Region, </span>
                               <span className="text-emerald-400 font-bold">Channel, </span>
                               <span className="text-slate-300">Product</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* SQL Diff */}
                   <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden flex-1">
                      <div className="p-3 border-b border-slate-700 bg-slate-900/30 font-bold text-xs text-slate-300">
                         SQL Implementation Changes
                      </div>
                      <div className="p-4 font-mono text-xs overflow-auto">
                         <div className="text-slate-400">SELECT</div>
                         <div className="text-slate-400 pl-4">date_trunc('day', pay_time) as stat_date,</div>
                         <div className="text-emerald-400 pl-4 bg-emerald-900/10">+ channel_id,</div>
                         <div className="text-slate-400 pl-4">SUM(pay_amount)</div>
                         <div className="text-slate-400">FROM t_dwd_order</div>
                         <div className="text-red-400 bg-red-900/10">- WHERE status = 'paid'</div>
                         <div className="text-emerald-400 bg-emerald-900/10">+ WHERE status = 'paid' AND valid_flag = 1</div>
                         <div className="text-slate-400">GROUP BY 1, 2</div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* TAB F: USAGE */}
          {activeTab === 'usage' && (
             <div className="p-6 h-full overflow-y-auto custom-scrollbar space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6">
                   <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
                      <div className="text-xs text-slate-500 uppercase mb-2">报表引用 (Reports)</div>
                      <div className="text-3xl font-bold text-white font-mono">24</div>
                      <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp size={10} /> +2 this week</div>
                   </div>
                   <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
                      <div className="text-xs text-slate-500 uppercase mb-2">API 调用 (Daily)</div>
                      <div className="text-3xl font-bold text-white font-mono">1.2M</div>
                      <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp size={10} /> +5% growth</div>
                   </div>
                   <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
                      <div className="text-xs text-slate-500 uppercase mb-2">Ask Data 命中率</div>
                      <div className="text-3xl font-bold text-white font-mono">88%</div>
                      <div className="text-[10px] text-slate-500 mt-1">High Relevance</div>
                   </div>
                </div>

                {/* Consumer List */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                   <div className="p-4 border-b border-slate-700 bg-slate-900/30">
                      <h3 className="text-sm font-bold text-slate-200">下游应用 (Downstream Consumers)</h3>
                   </div>
                   <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-500 uppercase">
                         <tr>
                            <th className="px-4 py-3">应用名称</th>
                            <th className="px-4 py-3">类型</th>
                            <th className="px-4 py-3">负责人</th>
                            <th className="px-4 py-3">最近访问</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700 bg-slate-800/20 text-slate-300">
                         <tr>
                            <td className="px-4 py-3 font-bold">CEO Dashboard</td>
                            <td className="px-4 py-3"><span className="bg-indigo-900/30 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20">Report</span></td>
                            <td className="px-4 py-3">Alice</td>
                            <td className="px-4 py-3 text-slate-500">2 mins ago</td>
                         </tr>
                         <tr>
                            <td className="px-4 py-3 font-bold">Marketing API v2</td>
                            <td className="px-4 py-3"><span className="bg-violet-900/30 text-violet-300 px-1.5 py-0.5 rounded border border-violet-500/20">API</span></td>
                            <td className="px-4 py-3">DevOps</td>
                            <td className="px-4 py-3 text-slate-500">10 secs ago</td>
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
