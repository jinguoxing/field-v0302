
import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, CheckCircle2, Wand2 } from 'lucide-react';
import { ExceptionItem, ExceptionDetail } from '../../types/scc';

interface ExceptionCenterProps {
  activeException: ExceptionItem | null;
  onClose: () => void;
  onResolve: (exceptionId: string, count: number) => void;
}

// Mock Data Generators
const MOCK_FIELD_CONFLICTS: ExceptionDetail[] = [
  { 
    id: 'fc1', field: 'user_id', issue: '类型冲突', desc: '推断为 ID (BigInt)，但物理类型为 VARCHAR(50)', confidence: 45,
    suggestion: { type: 'CHANGE_SEMANTIC', value: 'Identifier (String)', reason: '根据物理类型调整语义定义' }
  },
  { 
    id: 'fc2', field: 'is_active', issue: '类型冲突', desc: '推断为 Boolean，但物理类型为 TINYINT(1)', confidence: 92,
    suggestion: { type: 'CONFIRM_MAPPING', value: 'Boolean -> TinyInt', reason: '标准布尔值映射模式' }
  },
  { 
    id: 'fc3', field: 'amount', issue: '精度丢失风险', desc: '推断为 Currency，物理类型 Float 可能丢失精度', confidence: 60,
    suggestion: { type: 'IGNORE', value: 'Keep as Float', reason: '非核心财务字段，允许浮点' }
  },
  { 
    id: 'fc4', field: 'created_at', issue: '格式异常', desc: '时间戳格式不统一', confidence: 88,
    suggestion: { type: 'APPLY_RULE', value: 'ISO8601', reason: '应用标准时间格式清洗规则' }
  },
];

const MOCK_MAPPING_CONFLICTS: ExceptionDetail[] = [
  { 
    id: 'mc1', field: 'status_code', issue: '映射缺失', desc: '未找到对应的标准代码值', confidence: 12,
    suggestion: { type: 'CREATE_MAPPING', value: 'New Code Set', reason: '建议创建新的码表映射' }
  },
  { 
    id: 'mc2', field: 'dept_name', issue: '多重映射', desc: '同时映射到了 Department.Name 和 Org.Name', confidence: 30,
    suggestion: { type: 'SELECT_TARGET', value: 'Department.Name', reason: '上下文更匹配 Department 对象' }
  }
];

export const ExceptionCenter: React.FC<ExceptionCenterProps> = ({ activeException, onClose, onResolve }) => {
  const [items, setItems] = useState<ExceptionDetail[]>([]);
  const [resolvingIds, setResolvingIds] = useState<string[]>([]);

  useEffect(() => {
    if (activeException) {
      // Load mock data based on type
      if (activeException.type === 'FIELD_CONFLICT') {
        setItems(MOCK_FIELD_CONFLICTS);
      } else if (activeException.type === 'MAPPING_CONFLICT') {
        setItems(MOCK_MAPPING_CONFLICTS);
      } else {
        setItems([]);
      }
      setResolvingIds([]);
    }
  }, [activeException]);

  const handleFix = (id: string) => {
    setResolvingIds(prev => [...prev, id]);
    
    // Simulate API call
    setTimeout(() => {
      setItems(prev => {
        const newItems = prev.filter(item => item.id !== id);
        // Notify parent about the resolution count change
        onResolve(activeException!.id, 1);
        return newItems;
      });
      setResolvingIds(prev => prev.filter(i => i !== id));
    }, 600);
  };

  const handleBatchFix = () => {
    const allIds = items.map(i => i.id);
    setResolvingIds(allIds);

    setTimeout(() => {
      const count = items.length;
      setItems([]);
      onResolve(activeException!.id, count);
      setResolvingIds([]);
    }, 1000);
  };

  if (!activeException) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{activeException.title}</h2>
              <p className="text-xs text-slate-400">需要人工裁决 {items.length} 项</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <p className="text-lg font-medium text-slate-300">所有冲突已解决</p>
              <p className="text-sm">您可以关闭此窗口继续下一步</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`bg-slate-800 border border-slate-700 rounded-xl p-4 transition-all duration-300 ${resolvingIds.includes(item.id) ? 'opacity-50 scale-[0.98]' : 'hover:border-slate-600'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white font-mono">{item.field}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[10px] rounded border border-red-500/20 uppercase font-bold">{item.issue}</span>
                          <span className="text-xs text-slate-500">{item.desc}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleFix(item.id)} // Treat ignore as fix for now (remove from list)
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-medium transition-colors"
                        disabled={resolvingIds.includes(item.id)}
                      >
                        忽略
                      </button>
                      <button 
                        onClick={() => handleFix(item.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                        disabled={resolvingIds.includes(item.id)}
                      >
                        {resolvingIds.includes(item.id) ? (
                          <span className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"></span>
                        ) : (
                          <Check size={12} />
                        )}
                        修复
                      </button>
                    </div>
                  </div>

                  {/* AI Suggestion Area */}
                  {item.suggestion && (
                    <div className="mt-4 pl-12">
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 flex items-center justify-between group cursor-pointer hover:bg-slate-900 transition-colors" onClick={() => handleFix(item.id)}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold uppercase">
                            <Wand2 size={12} /> AI 建议
                          </div>
                          <div className="text-sm text-slate-300">
                            {item.suggestion.reason} <span className="mx-1 text-slate-600">→</span> 
                            <span className="font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded">{item.suggestion.value}</span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">
                          应用建议 ({item.confidence}%)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-16 border-t border-slate-700 bg-slate-800 px-6 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            剩余 {items.length} 项待处理
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              关闭
            </button>
            {items.length > 0 && (
              <button 
                onClick={handleBatchFix}
                disabled={resolvingIds.length > 0}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resolvingIds.length > 1 ? (
                   <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                ) : (
                   <Wand2 size={16} />
                )}
                批量应用建议 ({items.length})
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
