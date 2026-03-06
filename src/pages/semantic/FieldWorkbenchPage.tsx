import React from 'react';
import { useFieldWorkbench } from './FieldWorkbench/hooks/useFieldWorkbench';
import { FieldWorkbenchHeader } from './FieldWorkbench/components/FieldWorkbenchHeader';
import { FieldQueuePanel } from './FieldWorkbench/components/FieldQueuePanel';
import { DecisionCanvas } from './FieldWorkbench/components/DecisionCanvas';
import { ExecutionPanel } from './FieldWorkbench/components/ExecutionPanel';
import { DrawerModals } from './FieldWorkbench/components/DrawerModals';

export const FieldWorkbenchPage: React.FC = () => {
  const {
    stage,
    queue,
    fields,
    selectedField,
    selectedIds,
    setSelectedIds,
    confidenceFilter,
    setConfidenceFilter,
    searchQuery,
    setSearchQuery,
    isEditing,
    setIsEditing,
    activeDrawer,
    setActiveDrawer,
    activeModal,
    setActiveModal,
    isSaving,
    saveStatus,
    showHistory,
    setShowHistory,
    showAllTypes,
    setShowAllTypes,
    semanticSearchQuery,
    setSemanticSearchQuery,
    expandedGroups,
    showMoreRoles,
    setShowMoreRoles,
    expandedRoleGroups,
    isRoleLocked,
    setIsRoleLocked,
    linkageMessage,
    editValues,
    setEditValues,
    historyMap,
    currentField,
    filteredFields,
    handleFieldSelect,
    toggleSelect,
    handleSelectAll,
    checkCompatibility,
    handleTypeChange,
    handleRoleChange,
    handleSelectTaxonomy,
    handleConfirmTop1,
    handleAcceptTop2,
    handleConfirmAndNext,
    handleSaveDraft,
    handleBatchPassHighConfidence,
    handleBatchIgnore,
    handleBatchApplySimilar,
    handleRollback,
    handleSwitchPlan,
    toggleGroup,
    toggleRoleGroup,
    setSearchParams
  } = useFieldWorkbench();

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col font-sans text-slate-200 overflow-hidden select-none">
      {/* 1. Header Area */}
      <FieldWorkbenchHeader
        stage={stage}
        setSearchParams={setSearchParams}
        isSaving={isSaving}
        handleBatchPassHighConfidence={handleBatchPassHighConfidence}
        setActiveModal={setActiveModal}
        setActiveDrawer={setActiveDrawer}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Left Pipeline (Queue) */}
        <FieldQueuePanel
          queue={queue}
          setSearchParams={setSearchParams}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          confidenceFilter={confidenceFilter}
          setConfidenceFilter={setConfidenceFilter}
          filteredFields={filteredFields}
          selectedField={selectedField}
          handleFieldSelect={handleFieldSelect}
          selectedIds={selectedIds}
          handleSelectAll={handleSelectAll}
          toggleSelect={toggleSelect}
          setSelectedIds={setSelectedIds}
          setActiveModal={setActiveModal}
          handleBatchApplySimilar={handleBatchApplySimilar}
          handleBatchIgnore={handleBatchIgnore}
        />

        {/* 3. Middle Canvas (Decision Center) */}
        <DecisionCanvas
          currentField={currentField}
          setShowHistory={setShowHistory}
          setActiveDrawer={setActiveDrawer}
          handleConfirmTop1={handleConfirmTop1}
          handleAcceptTop2={handleAcceptTop2}
          setIsEditing={setIsEditing}
          isSaving={isSaving}
        />

        {/* 4. Right Execution Panel (Form/Read) */}
        <ExecutionPanel
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          currentField={currentField}
          saveStatus={saveStatus}
          isSaving={isSaving}
          handleConfirmTop1={handleConfirmTop1}
          handleAcceptTop2={handleAcceptTop2}
          handleConfirmAndNext={handleConfirmAndNext}
          handleSaveDraft={handleSaveDraft}
          setShowHistory={setShowHistory}
          editValues={editValues}
          setEditValues={setEditValues}
          linkageMessage={linkageMessage}
          showAllTypes={showAllTypes}
          setShowAllTypes={setShowAllTypes}
          semanticSearchQuery={semanticSearchQuery}
          setSemanticSearchQuery={setSemanticSearchQuery}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
          handleSelectTaxonomy={handleSelectTaxonomy}
          isRoleLocked={isRoleLocked}
          setIsRoleLocked={setIsRoleLocked}
          showMoreRoles={showMoreRoles}
          setShowMoreRoles={setShowMoreRoles}
          expandedRoleGroups={expandedRoleGroups}
          toggleRoleGroup={toggleRoleGroup}
          handleRoleChange={handleRoleChange}
          checkCompatibility={checkCompatibility}
          handleTypeChange={handleTypeChange}
          setActiveDrawer={setActiveDrawer}
        />
      </div>

      {/* 5. Drawers and Modals Overlays */}
      <DrawerModals
        activeDrawer={activeDrawer}
        setActiveDrawer={setActiveDrawer}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        currentField={currentField}
        fields={fields}
        handleFieldSelect={handleFieldSelect}
        handleSwitchPlan={handleSwitchPlan}
        isSaving={isSaving}
        selectedIds={selectedIds}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        historyMap={historyMap}
        handleRollback={handleRollback}
      />
    </div>
  );
};


