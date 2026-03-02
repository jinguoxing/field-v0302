import React, { useState } from 'react';
import { 
  Table, 
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
  FileText
} from 'lucide-react';
import { TableUnderstandingItem } from '../../types/scc';

// Mock Data
const MOCK_TABLES: TableUnderstandingItem[] = [
  {
    id: 't1',
    tableName: 'dim_customer',
    displayName: '客户维度表',
    aiDescription: '存储客户基本信息，包括姓名、联系方式、地址等。通常用于分析客户行为和画像。',
    classification: 'DIMENSION',
    confidence: 0.95,
    status: 'PENDING',
    tags: ['Customer', 'Core', 'PII'],
    columnsCount: 24,
    rowCount: 150000
  },
  {
    id: 't2',
    tableName: 'fct_sales_order',
    displayName: '销售订单事实表',
    aiDescription: '记录每一笔销售订单的详细信息，包括订单号、客户ID、产品ID、金额、时间等。用于销售业绩分析。',
    classification: 'FACT',
    confidence: 0.92,
    status: 'PENDING',
    tags: ['Sales', 'Transaction', 'Revenue'],
    columnsCount: 45,
    rowCount: 2500000
  },
  {
    id: 't3',
    tableName: 'agg_monthly_sales',
    displayName: '月度销售汇总表',
    aiDescription: '按月汇总的销售数据，包含总金额、订单数等指标。用于高层报表展示。',
    classification: 'AGGREGATE',
    confidence: 0.88,
    status: 'CONFIRMED',
    tags: ['Sales', 'Report', 'Monthly'],
    columnsCount: 12,
    rowCount: 36
  },
  {
    id: 't4',
    tableName: 'stg_web_logs',
    displayName: 'Web日志临时表',
    aiDescription: '原始Web访问日志的临时存储表，包含IP、URL、UserAgent等。数据量较大，通常用于ETL过程。',
    classification: 'OTHER',
    confidence: 0.65,
    status: 'MODIFIED',
    tags: ['Log', 'Staging', 'Raw'],
    columnsCount: 8,
    rowCount: 10000000
  }
];

export const TableUnderstandingBoard: React.FC = () => {
  const [tables, setTables] = useState<TableUnderstandingItem[]>(MOCK_TABLES);
  const [selectedTableId, setSelectedTableId] = useState<string>(MOCK_TABLES[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<TableUnderstandingItem>>({});

  const selectedTable = tables.find(t => t.id === selectedTableId);

  // Handlers
  const handleSelectTable = (id: string) => {
    setSelectedTableId(id);
    setIsEditing(false);
    setEditForm({});
  };

  const handleConfirm = (id: string) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status: 'CONFIRMED' } : t));
  };

  const handleStartEdit = () => {
    if (selectedTable) {
      setEditForm({
        displayName: selectedTable.displayName,
        userDescription: selectedTable.userDescription || selectedTable.aiDescription,
        classification: selectedTable.classification,
        tags: [...selectedTable.tags]
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedTable) {
      setTables(prev => prev.map(t => t.id === selectedTable.id ? {
        ...t,
        ...editForm,
        status: 'MODIFIED'
      } : t));
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleRegenerate = () => {
    // Simulate AI regeneration
    alert('AI 正在重新分析表结构和数据内容...');
  };

  const filteredTables = tables.filter(t => 
    t.tableName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full bg-slate-900 text-slate-200 overflow-hidden">
      
      {/* Left Sidebar: Table List */}
      <div className="w-80 border-r border-slate-700 flex flex-col bg-slate-800/30">
        <div className="p-4 border-b border-slate-700 space-y-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Database size={16} /> 表资产列表 ({tables.length})
          </h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="搜索表名..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {filteredTables.map(table => (
            <div 
              key={table.id}
              onClick={() => handleSelectTable(table.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all group border ${
                selectedTableId === table.id 
                  ? 'bg-indigo-600/10 border-indigo-500/50' 
                  : 'bg-transparent border-transparent hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold font-mono ${selectedTableId === table.id ? 'text-indigo-400' : 'text-slate-300'}`}>
                  {table.tableName}
                </span>
                {table.status === 'CONFIRMED' && <CheckCircle2 size={12} className="text-emerald-500" />}
                {table.status === 'MODIFIED' && <Edit3 size={12} className="text-amber-500" />}
                {table.status === 'PENDING' && <div className="w-2 h-2 rounded-full bg-slate-600" />}
              </div>
              <div className="text-[10px] text-slate-500 truncate">{table.displayName}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  table.classification === 'FACT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  table.classification === 'DIMENSION' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  'bg-slate-700 text-slate-400 border-slate-600'
                }`}>
                  {table.classification}
                </span>
                <span className="text-[10px] text-slate-600">
                  {(table.confidence * 100).toFixed(0)}% 置信度
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content: Detail View */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {selectedTable ? (
          <>
            {/* Header */}
            <div className="h-16 border-b border-slate-700 px-6 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Table size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                    {selectedTable.tableName}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      selectedTable.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      selectedTable.status === 'MODIFIED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-slate-700 text-slate-400 border-slate-600'
                    }`}>
                      {selectedTable.status}
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                    <span>{selectedTable.rowCount.toLocaleString()} 行</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span>{selectedTable.columnsCount} 列</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <>
                    <button 
                      onClick={handleRegenerate}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-700 flex items-center gap-2"
                    >
                      <RotateCcw size={14} /> 重新分析
                    </button>
                    <button 
                      onClick={handleStartEdit}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-700 flex items-center gap-2"
                    >
                      <Edit3 size={14} /> 编辑
                    </button>
                    {selectedTable.status !== 'CONFIRMED' && (
                      <button 
                        onClick={() => handleConfirm(selectedTable.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                      >
                        <CheckCircle2 size={14} /> 确认理解
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-700"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-indigo-900/20"
                    >
                      保存修改
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* AI Analysis Section */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Wand2 size={120} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Wand2 size={16} /> AI 语义分析
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">中文名称</label>
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editForm.displayName || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                            />
                          ) : (
                            <div className="text-lg font-bold text-white">{selectedTable.displayName}</div>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">表类型 (Classification)</label>
                          {isEditing ? (
                            <select 
                              value={editForm.classification}
                              onChange={(e) => setEditForm(prev => ({ ...prev, classification: e.target.value as any }))}
                              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                            >
                              <option value="FACT">事实表 (FACT)</option>
                              <option value="DIMENSION">维度表 (DIMENSION)</option>
                              <option value="AGGREGATE">汇总表 (AGGREGATE)</option>
                              <option value="OTHER">其他 (OTHER)</option>
                            </select>
                          ) : (
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${
                              selectedTable.classification === 'FACT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              selectedTable.classification === 'DIMENSION' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              'bg-slate-700 text-slate-400 border-slate-600'
                            }`}>
                              {selectedTable.classification}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">业务描述</label>
                          {isEditing ? (
                            <textarea 
                              value={editForm.userDescription || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, userDescription: e.target.value }))}
                              className="w-full h-32 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none resize-none"
                            />
                          ) : (
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {selectedTable.userDescription || selectedTable.aiDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-3">语义标签</label>
                      <div className="flex flex-wrap gap-2">
                        {(isEditing ? editForm.tags : selectedTable.tags)?.map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md text-xs text-slate-300 flex items-center gap-1.5">
                            <Tag size={12} className="text-slate-500" />
                            {tag}
                            {isEditing && (
                              <button 
                                onClick={() => setEditForm(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) }))}
                                className="hover:text-red-400 ml-1"
                              >
                                &times;
                              </button>
                            )}
                          </span>
                        ))}
                        {isEditing && (
                          <button 
                            onClick={() => {
                              const newTag = prompt('输入新标签:');
                              if (newTag) setEditForm(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
                            }}
                            className="px-2.5 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-md text-xs text-indigo-400 hover:bg-indigo-600/30 transition-colors"
                          >
                            + 添加标签
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Metadata */}
                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                        <Database size={14} /> 物理属性
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">存储格式</span>
                          <span className="text-slate-200 font-mono">Parquet</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">压缩算法</span>
                          <span className="text-slate-200 font-mono">Snappy</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">最后更新</span>
                          <span className="text-slate-200 font-mono">2024-03-15 14:30:00</span>
                        </div>
                      </div>
                   </div>

                   <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                        <FileText size={14} /> 样本数据预览
                      </h4>
                      <div className="text-center py-8 text-slate-500 text-sm">
                        <p>点击查看前 100 行样本数据</p>
                        <button className="mt-2 text-indigo-400 hover:text-indigo-300 text-xs underline">
                          加载预览
                        </button>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Database size={48} className="mb-4 opacity-20" />
            <p>请从左侧选择一张表查看详情</p>
          </div>
        )}
      </div>

    </div>
  );
};
