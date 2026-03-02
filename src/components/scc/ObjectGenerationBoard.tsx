import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Wand2, 
  Edit3, 
  RotateCcw, 
  Search, 
  Filter,
  ChevronRight,
  Database,
  Tag,
  FileText,
  LayoutGrid,
  Network,
  MoreHorizontal,
  Plus,
  Trash2,
  Split,
  Merge,
  ArrowUpRight
} from 'lucide-react';
import { BusinessObjectCandidate, ObjectAttribute, ObjectRelationship, ObjectGenerationMetrics } from '../../types/scc';

// Mock Data
const MOCK_METRICS: ObjectGenerationMetrics = {
  totalFields: 24,
  assignedFields: 21,
  unassignedFields: 3,
  conflicts: 1,
  coverage: 87.5
};

const MOCK_OBJECTS: BusinessObjectCandidate[] = [
  {
    id: 'obj_1',
    name: 'Customer',
    description: 'Represents a customer entity with core profile information.',
    sourceTableId: 't1',
    status: 'PENDING',
    confidence: 0.92,
    attributes: [
      { id: 'a1', name: 'Customer ID', fieldId: 'cust_id', type: 'IDENTIFIER', confidence: 0.98, source: 'AI_GENERATED', evidence: 'Primary Key Pattern' },
      { id: 'a2', name: 'Full Name', fieldId: 'cust_name', type: 'ATTRIBUTE', confidence: 0.95, source: 'AI_GENERATED', evidence: 'Semantic Match' },
      { id: 'a3', name: 'Email Address', fieldId: 'email', type: 'ATTRIBUTE', confidence: 0.99, source: 'RULE_BASED', evidence: 'Regex Pattern' },
      { id: 'a4', name: 'Phone Number', fieldId: 'phone', type: 'ATTRIBUTE', confidence: 0.90, source: 'AI_GENERATED', evidence: 'Data Sampling' },
      { id: 'a5', name: 'Registration Date', fieldId: 'reg_date', type: 'DIMENSION', confidence: 0.88, source: 'AI_GENERATED', evidence: 'Time Dimension' },
      { id: 'a6', name: 'Status', fieldId: 'status', type: 'DIMENSION', confidence: 0.85, source: 'AI_GENERATED', evidence: 'Low Cardinality' },
      { id: 'a7', name: 'Lifetime Value', fieldId: 'ltv', type: 'MEASURE', confidence: 0.75, source: 'AI_GENERATED', evidence: 'Numeric Aggregate' },
    ]
  },
  {
    id: 'obj_2',
    name: 'CustomerAddress',
    description: 'Address details separated from main customer profile due to 1:N relationship potential.',
    sourceTableId: 't1',
    status: 'PENDING',
    confidence: 0.85,
    attributes: [
      { id: 'a8', name: 'Address ID', fieldId: 'addr_id', type: 'IDENTIFIER', confidence: 0.92, source: 'AI_GENERATED', evidence: 'Synthetic Key' },
      { id: 'a9', name: 'Customer Ref', fieldId: 'cust_id', type: 'ATTRIBUTE', confidence: 0.95, source: 'AI_GENERATED', evidence: 'Foreign Key' },
      { id: 'a10', name: 'Street', fieldId: 'street_addr', type: 'ATTRIBUTE', confidence: 0.90, source: 'AI_GENERATED', evidence: 'Address Pattern' },
      { id: 'a11', name: 'City', fieldId: 'city', type: 'DIMENSION', confidence: 0.92, source: 'AI_GENERATED', evidence: 'Location Entity' },
      { id: 'a12', name: 'Zip Code', fieldId: 'zip', type: 'ATTRIBUTE', confidence: 0.98, source: 'RULE_BASED', evidence: 'Format Check' },
    ]
  }
];

const MOCK_UNASSIGNED_FIELDS = [
  { id: 'u1', name: 'temp_flag', type: 'VARCHAR', reason: 'Low semantic value' },
  { id: 'u2', name: 'etl_batch_id', type: 'BIGINT', reason: 'Technical metadata' },
  { id: 'u3', name: 'legacy_code', type: 'VARCHAR', reason: 'Ambiguous meaning' },
];

const MOCK_RELATIONSHIPS: ObjectRelationship[] = [
  {
    id: 'r1',
    sourceObjectId: 'obj_1',
    targetObjectId: 'obj_2',
    type: 'HAS_MANY',
    keys: [{ sourceField: 'cust_id', targetField: 'cust_id' }],
    confidence: 0.95
  }
];

export const ObjectGenerationBoard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'STRUCTURE' | 'RELATIONSHIP'>('STRUCTURE');
  const [objects, setObjects] = useState<BusinessObjectCandidate[]>(MOCK_OBJECTS);
  const [selectedObjectId, setSelectedObjectId] = useState<string>(MOCK_OBJECTS[0].id);
  const [unassignedFields, setUnassignedFields] = useState(MOCK_UNASSIGNED_FIELDS);

  // Split & Merge State
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [splitSelection, setSplitSelection] = useState<string[]>([]);
  const [newObjectName, setNewObjectName] = useState('');
  const [mergeTargetId, setMergeTargetId] = useState<string>('');

  const selectedObject = objects.find(o => o.id === selectedObjectId);

  const handleSplitObject = () => {
    if (!selectedObject || !newObjectName || splitSelection.length === 0) return;
    
    const splitAttributes = selectedObject.attributes.filter(a => splitSelection.includes(a.id));
    const remainingAttributes = selectedObject.attributes.filter(a => !splitSelection.includes(a.id));
    
    const newObj: BusinessObjectCandidate = {
      id: `obj-${Date.now()}`,
      name: newObjectName,
      description: `Split from ${selectedObject.name}`,
      sourceTableId: selectedObject.sourceTableId,
      status: 'PENDING',
      confidence: 0.85,
      attributes: splitAttributes
    };
    
    setObjects(prev => [
      ...prev.map(o => o.id === selectedObject.id ? { ...o, attributes: remainingAttributes } : o),
      newObj
    ]);
    
    setIsSplitModalOpen(false);
    setSplitSelection([]);
    setNewObjectName('');
  };

  const handleMergeObject = () => {
    if (!selectedObject || !mergeTargetId) return;
    
    const targetObj = objects.find(o => o.id === mergeTargetId);
    if (!targetObj) return;
    
    setObjects(prev => {
      const filtered = prev.filter(o => o.id !== mergeTargetId);
      return filtered.map(o => o.id === selectedObject.id 
        ? { ...o, attributes: [...o.attributes, ...targetObj.attributes] } 
        : o
      );
    });
    
    setIsMergeModalOpen(false);
    setMergeTargetId('');
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('attributeId', id);
  };

  // Group attributes by type
  const groupedAttributes = selectedObject?.attributes.reduce((acc, attr) => {
    if (!acc[attr.type]) acc[attr.type] = [];
    acc[attr.type].push(attr);
    return acc;
  }, {} as Record<string, ObjectAttribute[]>);

  // ... existing imports
  
  // Helper to generate business name from field name
  const generateAttributeName = (fieldName: string) => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleRemoveAttribute = (attrId: string) => {
    if (!selectedObject) return;
    
    const attributeToRemove = selectedObject.attributes.find(a => a.id === attrId);
    if (!attributeToRemove) return;

    // 1. Remove from object
    const updatedObject = {
      ...selectedObject,
      attributes: selectedObject.attributes.filter(a => a.id !== attrId)
    };
    
    setObjects(prev => prev.map(o => o.id === selectedObject.id ? updatedObject : o));

    // 2. Add back to unassigned fields
    const newUnassignedField = {
      id: attributeToRemove.fieldId, // Use fieldId as ID for unassigned
      name: attributeToRemove.fieldId,
      type: 'UNKNOWN', // In real app, we'd preserve type
      reason: 'Removed from object'
    };
    setUnassignedFields(prev => [...prev, newUnassignedField]);
  };

  const handleAddFieldToObject = (field: typeof unassignedFields[0], targetType: string = 'ATTRIBUTE') => {
    if (!selectedObject) return;

    // 1. Remove from unassigned
    setUnassignedFields(prev => prev.filter(f => f.id !== field.id));

    // 2. Add to object
    const newAttribute: ObjectAttribute = {
      id: `attr_${Date.now()}`,
      name: generateAttributeName(field.name),
      fieldId: field.name,
      type: targetType as any,
      confidence: 1.0,
      source: 'USER_DEFINED',
      evidence: 'Manual Assignment'
    };

    const updatedObject = {
      ...selectedObject,
      attributes: [...selectedObject.attributes, newAttribute]
    };

    setObjects(prev => prev.map(o => o.id === selectedObject.id ? updatedObject : o));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetType: string) => {
    e.preventDefault();
    const fieldId = e.dataTransfer.getData('fieldId');
    const field = unassignedFields.find(f => f.id === fieldId);
    if (field) {
      handleAddFieldToObject(field, targetType);
    }
  };

  // ... existing render

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 overflow-hidden relative">
      
      {/* ... Modals (Split/Merge) ... */}
      {isSplitModalOpen && selectedObject && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-[500px] overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Split size={16} className="text-indigo-400" /> 拆分对象: {selectedObject.name}
              </h3>
              <button onClick={() => setIsSplitModalOpen(false)} className="text-slate-400 hover:text-white"><Trash2 size={16} className="rotate-45" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">新对象名称</label>
                <input 
                  type="text" 
                  value={newObjectName}
                  onChange={(e) => setNewObjectName(e.target.value)}
                  placeholder="E.g., CustomerContact"
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">选择要移动的属性</label>
                <div className="max-h-60 overflow-y-auto border border-slate-700 rounded bg-slate-900/30 p-2 space-y-1 custom-scrollbar">
                  {selectedObject.attributes.map(attr => (
                    <label key={attr.id} className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={splitSelection.includes(attr.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSplitSelection(prev => [...prev, attr.id]);
                          else setSplitSelection(prev => prev.filter(id => id !== attr.id));
                        }}
                        className="rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-0"
                      />
                      <div>
                        <div className="text-sm text-slate-200 font-medium">{attr.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{attr.fieldId}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-end gap-3">
              <button onClick={() => setIsSplitModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">取消</button>
              <button 
                onClick={handleSplitObject}
                disabled={!newObjectName || splitSelection.length === 0}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认拆分
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Merge Modal */}
      {isMergeModalOpen && selectedObject && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-[400px] overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Merge size={16} className="text-indigo-400" /> 合并对象
              </h3>
              <button onClick={() => setIsMergeModalOpen(false)} className="text-slate-400 hover:text-white"><Trash2 size={16} className="rotate-45" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-400">
                将其他对象合并到当前对象 <span className="text-white font-bold">{selectedObject.name}</span>。
                被合并的对象将被删除，其属性将移动到当前对象。
              </p>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">选择要合并的对象</label>
                <div className="space-y-2">
                  {objects.filter(o => o.id !== selectedObject.id).map(obj => (
                    <label key={obj.id} className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-all ${
                      mergeTargetId === obj.id 
                        ? 'bg-indigo-600/20 border-indigo-500' 
                        : 'bg-slate-900/30 border-slate-700 hover:border-slate-600'
                    }`}>
                      <input 
                        type="radio" 
                        name="mergeTarget"
                        checked={mergeTargetId === obj.id}
                        onChange={() => setMergeTargetId(obj.id)}
                        className="text-indigo-500 focus:ring-0 bg-slate-700 border-slate-600"
                      />
                      <span className="text-sm text-slate-200 font-medium">{obj.name}</span>
                    </label>
                  ))}
                  {objects.length <= 1 && (
                    <div className="text-sm text-slate-500 italic text-center py-4">没有其他可合并的对象</div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-end gap-3">
              <button onClick={() => setIsMergeModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">取消</button>
              <button 
                onClick={handleMergeObject}
                disabled={!mergeTargetId}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认合并
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Top Metrics Bar */}
      <div className="h-14 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between px-6">
        {/* ... existing metrics ... */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Box size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">对象覆盖率</div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {MOCK_METRICS.coverage}%
                <span className="text-[10px] font-normal text-slate-400">({MOCK_METRICS.assignedFields}/{MOCK_METRICS.totalFields})</span>
              </div>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">未归属字段</div>
            <div className="text-sm font-bold text-amber-400">{MOCK_METRICS.unassignedFields}</div>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">冲突归属</div>
            <div className="text-sm font-bold text-red-400">{MOCK_METRICS.conflicts}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded border border-slate-700">
            <Database size={14} className="text-slate-400" />
            <span className="text-xs text-slate-400">来源表:</span>
            <span className="text-xs font-bold text-white">dim_customer</span>
          </div>
          
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => setViewMode('STRUCTURE')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${
                viewMode === 'STRUCTURE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid size={14} /> 结构视图
            </button>
            <button 
              onClick={() => setViewMode('RELATIONSHIP')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${
                viewMode === 'RELATIONSHIP' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network size={14} /> 关系视图
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {viewMode === 'STRUCTURE' ? (
          <>
            {/* Left: Object List */}
            <div className="w-64 border-r border-slate-700 bg-slate-800/30 flex flex-col">
              {/* ... existing object list ... */}
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">业务对象 ({objects.length})</h3>
                <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {objects.map(obj => (
                  <div 
                    key={obj.id}
                    onClick={() => setSelectedObjectId(obj.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all group border ${
                      selectedObjectId === obj.id 
                        ? 'bg-indigo-600/10 border-indigo-500/50' 
                        : 'bg-transparent border-transparent hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${selectedObjectId === obj.id ? 'text-indigo-400' : 'text-slate-200'}`}>
                        {obj.name}
                      </span>
                      {obj.status === 'PENDING' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>包含属性: {obj.attributes.length}</span>
                      <span>{(obj.confidence * 100).toFixed(0)}% 置信度</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Attribute Tree */}
            <div className="flex-1 flex flex-col bg-slate-900 border-r border-slate-700">
              {selectedObject ? (
                <>
                  <div className="h-14 border-b border-slate-700 px-6 flex items-center justify-between bg-slate-800/20">
                    <div className="flex items-center gap-3">
                      <Box className="text-indigo-400" size={20} />
                      <div>
                        <h2 className="text-lg font-bold text-white leading-none">{selectedObject.name}</h2>
                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                           业务对象 <ChevronRight size={10} /> {selectedObject.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsSplitModalOpen(true)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium border border-slate-700 flex items-center gap-2"
                      >
                        <Split size={14} /> 拆分对象
                      </button>
                      <button 
                        onClick={() => setIsMergeModalOpen(true)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium border border-slate-700 flex items-center gap-2"
                      >
                        <Merge size={14} /> 合并对象
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {/* Attribute Groups */}
                    {['IDENTIFIER', 'ATTRIBUTE', 'DIMENSION', 'MEASURE'].map(type => {
                      const attrs = groupedAttributes?.[type] || [];
                      
                      return (
                        <div key={type} className="mb-6" onDrop={(e) => handleDrop(e, type)} onDragOver={handleDragOver}>
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                            {type === 'IDENTIFIER' && <Tag size={14} className="text-amber-400" />}
                            {type === 'ATTRIBUTE' && <FileText size={14} className="text-blue-400" />}
                            {type === 'DIMENSION' && <Layers size={14} className="text-emerald-400" />}
                            {type === 'MEASURE' && <Database size={14} className="text-purple-400" />}
                            {type} ({attrs.length})
                          </h4>
                          <div className={`space-y-2 min-h-[40px] rounded-lg border-2 border-dashed border-slate-800/50 p-2 transition-colors ${attrs.length === 0 ? 'bg-slate-800/20' : ''}`}>
                            {attrs.length === 0 && (
                               <div className="text-center text-xs text-slate-600 py-2">拖拽字段到此处添加属性</div>
                            )}
                            {attrs.map(attr => (
                              <div key={attr.id} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors group">
                                <div className="flex items-center gap-3">
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    attr.source === 'AI_GENERATED' ? 'bg-indigo-500' : 'bg-slate-500'
                                  }`} title={attr.source}></div>
                                  <div>
                                    <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                      {attr.name}
                                      <span className="text-[10px] font-normal text-slate-500 px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                                        {attr.fieldId}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                    {attr.evidence}
                                  </div>
                                  <button 
                                    onClick={() => handleRemoveAttribute(attr.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-all"
                                    title="移除属性 (回到待处理字段)"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                  Select an object to view details
                </div>
              )}
            </div>

            {/* Right: Unassigned / Details */}
            <div className="w-80 bg-slate-800/30 flex flex-col border-l border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-400" /> 
                  待处理字段 ({unassignedFields.length})
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {unassignedFields.map(field => (
                  <div 
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, field.id)}
                    className="p-3 bg-slate-800 border border-slate-700 border-dashed rounded-lg hover:border-indigo-500 cursor-grab active:cursor-grabbing transition-colors group relative"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-mono font-bold text-slate-300">{field.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded text-slate-400">{field.type}</span>
                    </div>
                    <div className="text-xs text-slate-500">{field.reason}</div>
                    
                    {/* Quick Add Button */}
                    <button 
                       onClick={() => handleAddFieldToObject(field)}
                       className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 p-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-all"
                       title="添加到当前对象"
                    >
                       <Plus size={12} />
                    </button>
                  </div>
                ))}
                
                {unassignedFields.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-500/50" />
                    所有字段已归属
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Dynamic Relationship View */
          <div className="flex-1 bg-slate-900 relative overflow-auto custom-scrollbar p-10">
            <div className="min-w-[800px] min-h-[600px] relative">
               <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded border border-slate-700 z-30">
                  <Database size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-300">来源表: dim_customer</span>
               </div>

               {/* Render Objects Dynamically */}
               {objects.map((obj, idx) => {
                 // Simple layout logic for demo: stagger them
                 const left = 30 + (idx * 40);
                 const top = 20 + (idx * 10);
                 
                 return (
                   <div 
                     key={obj.id}
                     className="absolute w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 flex flex-col"
                     style={{ left: `${left}%`, top: `${top}%` }}
                   >
                      {/* Object Header */}
                      <div className="p-3 border-b border-slate-700 bg-slate-800 rounded-t-xl flex items-center gap-2">
                         <Box className="text-indigo-400" size={18} />
                         <div>
                            <div className="font-bold text-white text-sm">{obj.name}</div>
                            <div className="text-[10px] text-slate-500">包含 {obj.attributes.length} 个属性</div>
                         </div>
                      </div>
                      
                      {/* Attribute List (Preview) */}
                      <div className="p-3 space-y-1 max-h-64 overflow-y-auto custom-scrollbar bg-slate-900/50">
                         {obj.attributes.map(attr => (
                            <div key={attr.id} className="flex items-center justify-between text-xs group">
                               <div className="flex items-center gap-2 overflow-hidden">
                                  {attr.type === 'IDENTIFIER' && <Tag size={10} className="text-amber-500 shrink-0" />}
                                  {attr.type === 'ATTRIBUTE' && <FileText size={10} className="text-blue-400 shrink-0" />}
                                  {attr.type === 'DIMENSION' && <Layers size={10} className="text-emerald-400 shrink-0" />}
                                  {attr.type === 'MEASURE' && <Database size={10} className="text-purple-400 shrink-0" />}
                                  <span className="text-slate-300 truncate" title={attr.name}>{attr.name}</span>
                               </div>
                               <span className="text-slate-600 font-mono text-[10px] hidden group-hover:inline-block">{attr.fieldId}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                 );
               })}

               {/* Mock Relationship Lines (Visual Only for Demo) */}
               {objects.length > 1 && (
                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <defs>
                      <marker id="arrowhead-rel" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                      </marker>
                    </defs>
                    {/* Draw a line between first and second object if they exist */}
                    <path d="M 450 150 C 550 150, 650 250, 750 250" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-rel)" strokeDasharray="5,5" />
                    <foreignObject x="580" y="180" width="80" height="30">
                       <div className="bg-slate-900 text-[10px] text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 text-center">
                          1 : N
                       </div>
                    </foreignObject>
                 </svg>
               )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
