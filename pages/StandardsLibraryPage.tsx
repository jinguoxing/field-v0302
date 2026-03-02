import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { LibraryQueryBar } from '../components/standards/library/LibraryQueryBar';
import { LibraryTable } from '../components/standards/library/LibraryTable';
import { LibraryAISidebar } from '../components/standards/library/LibraryAISidebar';
import { StandardDetailDrawer } from '../components/standards/library/StandardDetailDrawer';
import { BatchActionsBar } from '../components/standards/library/BatchActionsBar';
import { BulkEditModal } from '../components/standards/library/BulkEditModal';
import { StandardItem, StandardType } from '../types';
import { STANDARD_ITEMS_MOCK } from '../constants';

export const StandardsLibraryPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [selectedItem, setSelectedItem] = useState<StandardItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  // Map route param to StandardType enum/string
  const getTypeFromParam = (param: string | undefined): StandardType | 'All' => {
     switch (param) {
        case 'terms': return 'Term';
        case 'data-elements': return 'DataElement';
        case 'code-sets': return 'CodeSet';
        case 'metrics': return 'Indicator';
        case 'rules': return 'Rule';
        case 'naming': return 'NamingConvention';
        default: return 'All';
     }
  };

  const currentType = getTypeFromParam(type);
  
  // Filter items based on type
  const filteredItems = currentType === 'All' 
     ? STANDARD_ITEMS_MOCK 
     : STANDARD_ITEMS_MOCK.filter(item => item.type === currentType);

  // Selection Logic
  const handleToggleSelect = (id: string) => {
     setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleToggleSelectAll = () => {
     if (selectedIds.length === filteredItems.length) {
        setSelectedIds([]);
     } else {
        setSelectedIds(filteredItems.map(i => i.id));
     }
  };

  // Reset selection on type change
  useEffect(() => {
     setSelectedIds([]);
  }, [type]);

  const getPageTitle = () => {
     switch (currentType) {
        case 'Term': return '业务术语 (Terms)';
        case 'DataElement': return '数据元 (Data Elements)';
        case 'CodeSet': return '码表 (Code Sets)';
        case 'Indicator': return '指标标准 (Metrics)';
        case 'Rule': return '规则模板 (Rules)';
        case 'NamingConvention': return '命名规范 (Naming)';
        default: return '标准库 (Library)';
     }
  };

  const handleCreateNew = () => {
     // Default to data-elements if in 'All' or root
     const createType = type || 'data-elements';
     navigate(`/standards/create/${createType}`);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500 relative">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
         {/* Page Header */}
         <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
               <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  <BookOpen className="text-cyan-400" /> {getPageTitle()}
               </h1>
               <p className="text-slate-400 text-sm mt-1">
                 Unified management for enterprise standards lifecycle.
               </p>
            </div>
            <div className="flex items-center gap-3">
               <button 
                  onClick={handleCreateNew}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(8,145,178,0.4)] border border-cyan-400/20 transition-all flex items-center gap-2"
               >
                  <Plus size={16} /> 新建标准
               </button>
               <div className="w-px h-6 bg-slate-700 mx-2"></div>
               <button 
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className={`p-2 rounded-lg transition-colors ${showAIPanel ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  title="Toggle AI Side Panel"
               >
                  {showAIPanel ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
               </button>
            </div>
         </div>

         {/* Query Section */}
         <LibraryQueryBar viewMode={viewMode} setViewMode={setViewMode} />

         {/* Main List Section */}
         <LibraryTable 
            items={filteredItems} 
            selectedIds={selectedIds}
            onSelectItem={setSelectedItem}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
         />
      </div>

      {/* Right Sidebar (Collapsible) */}
      {showAIPanel && (
         <LibraryAISidebar onClose={() => setShowAIPanel(false)} />
      )}

      {/* Overlays */}
      
      {/* 1. Detail Drawer */}
      {selectedItem && (
         <>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedItem(null)}></div>
            <StandardDetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
         </>
      )}

      {/* 2. Batch Actions Bar */}
      <BatchActionsBar 
         selectedCount={selectedIds.length} 
         onClearSelection={() => setSelectedIds([])}
         onBulkEdit={() => setShowBulkEdit(true)}
      />

      {/* 3. Bulk Edit Modal */}
      {showBulkEdit && (
         <BulkEditModal count={selectedIds.length} onClose={() => setShowBulkEdit(false)} />
      )}

    </div>
  );
};