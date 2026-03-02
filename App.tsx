
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { TableListPage } from './pages/TableListPage';
import { FieldListPage } from './pages/FieldListPage';
import { RelationshipPage } from './pages/RelationshipPage';
import { StandardsPage } from './pages/StandardsPage';
import { StandardsLibraryPage } from './pages/StandardsLibraryPage';
import { StandardCreatePage } from './pages/StandardCreatePage';
import { AIDraftStudioPage } from './pages/AIDraftStudioPage';
import { AIAlignStudioPage } from './pages/AIAlignStudioPage';
import { AIConflictHubPage } from './pages/AIConflictHubPage';
import { AIEvaluationPage } from './pages/AIEvaluationPage';
import { SemanticWorkbenchPage } from './pages/SemanticWorkbenchPage';
import { LogicalViewsPage } from './pages/LogicalViewsPage';
import { BusinessObjectsPage } from './pages/BusinessObjectsPage';
import { MetricsPage } from './pages/MetricsPage';
import { EnforceValidationPage } from './pages/EnforceValidationPage';
import { EnforceGatePage } from './pages/EnforceGatePage';
import { EnforceDriftPage } from './pages/EnforceDriftPage';
import { EnforceWaiverPage } from './pages/EnforceWaiverPage';
import { ImpactChangePage } from './pages/ImpactChangePage';
import { ImpactGraphPage } from './pages/ImpactGraphPage';
import { OpsPage } from './pages/OpsPage';
import { CollabInboxPage } from './pages/CollabInboxPage';
import { CollabHistoryPage } from './pages/CollabHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
// AI Ops Workbench
import { AIOpsWorkbenchPage } from './src/pages/aiops/AIOpsWorkbenchPage';
import { AIOpsRequestDetailPage } from './src/pages/aiops/AIOpsRequestDetailPage';
// Metric Hub
import { MetricListPage } from './pages/metric/MetricListPage';
import { MetricDetailPage } from './pages/metric/MetricDetailPage';
import { MetricVersionDetailPage } from './pages/metric/MetricVersionDetailPage';
import { MetricCreateWizardPage } from './pages/metric/MetricCreateWizardPage';
import { MetricAskPage } from './pages/metric/MetricAskPage';
// Semantic Modeling
import { SemanticModelListPage } from './pages/semantic/SemanticModelListPage';
import { SemanticModelDetailPage } from './pages/semantic/SemanticModelDetailPage';

import { FieldWorkbenchPage } from './src/pages/semantic/FieldWorkbenchPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TableListPage />} />
          <Route path="fields/:tableId" element={<FieldListPage />} />
          <Route path="relationships" element={<RelationshipPage />} />
          
          {/* Semantic Modeling Routes */}
          <Route path="semantic-models" element={<SemanticModelListPage />} />
          <Route path="semantic-models/:id" element={<SemanticModelDetailPage />} />
          <Route path="semantic/workbench/:lvId" element={<FieldWorkbenchPage />} />

          {/* Metric Hub Routes (New Top Level) */}
          <Route path="metrics" element={<MetricListPage />} />
          <Route path="metrics/new" element={<MetricCreateWizardPage />} />
          <Route path="metrics/ask" element={<MetricAskPage />} />
          <Route path="metrics/:metricId" element={<MetricDetailPage />} />
          <Route path="metrics/:metricId/versions/:versionId" element={<MetricVersionDetailPage />} />

          {/* Standards Routes */}
          <Route path="standards" element={<Navigate to="/standards/overview" replace />} />
          <Route path="standards/overview" element={<StandardsPage />} />
          
          {/* Library Routes with Type Parameter */}
          <Route path="standards/library" element={<Navigate to="/standards/library/data-elements" replace />} />
          <Route path="standards/library/:type" element={<StandardsLibraryPage />} />
          
          {/* Create Standard Route */}
          <Route path="standards/create/:type" element={<StandardCreatePage />} />
          
          {/* AI Factory Routes */}
          <Route path="standards/ai" element={<Navigate to="/standards/ai/workbench" replace />} />
          <Route path="standards/ai/workbench" element={<SemanticWorkbenchPage />} />
          <Route path="standards/ai/draft-studio" element={<AIDraftStudioPage />} />
          <Route path="standards/ai/align-studio" element={<AIAlignStudioPage />} />
          <Route path="standards/ai/conflict-hub" element={<AIConflictHubPage />} />
          <Route path="standards/ai/evaluation" element={<AIEvaluationPage />} />
          
          {/* Standard Apply Routes */}
          <Route path="standards/apply" element={<Navigate to="/standards/apply/logical-views" replace />} />
          <Route path="standards/apply/logical-views" element={<LogicalViewsPage />} />
          <Route path="standards/apply/business-objects" element={<BusinessObjectsPage />} />
          <Route path="standards/apply/metrics" element={<MetricsPage />} />

          {/* Governance Gates / Enforce Routes */}
          <Route path="standards/enforce" element={<Navigate to="/standards/enforce/validation-runs" replace />} />
          <Route path="standards/enforce/validation-runs" element={<EnforceValidationPage />} />
          <Route path="standards/enforce/publish-gates" element={<EnforceGatePage />} />
          <Route path="standards/enforce/drift" element={<EnforceDriftPage />} />
          <Route path="standards/enforce/waivers" element={<EnforceWaiverPage />} />

          {/* Impact Analysis Routes */}
          <Route path="standards/impact" element={<Navigate to="/standards/impact/change-impact" replace />} />
          <Route path="standards/impact/change-impact" element={<ImpactChangePage />} />
          <Route path="standards/impact/dependency-graph" element={<ImpactGraphPage />} />

          {/* Collaboration Routes */}
          <Route path="standards/collab" element={<Navigate to="/standards/collab/inbox" replace />} />
          <Route path="standards/collab/inbox" element={<CollabInboxPage />} />
          <Route path="standards/collab/history" element={<CollabHistoryPage />} />

          {/* Ops Measurement Routes */}
          <Route path="standards/ops" element={<Navigate to="/standards/ops/dashboard" replace />} />
          <Route path="standards/ops/dashboard" element={<OpsPage />} />

          {/* AI Ops Workbench Routes */}
          <Route path="aiops/workbench" element={<AIOpsWorkbenchPage />} />
          <Route path="aiops/workbench/requests/:requestId" element={<AIOpsRequestDetailPage />} />
          <Route path="aiops/workbench/requests/:requestId/stages/:stageId" element={<AIOpsRequestDetailPage />} />

          {/* Settings Route */}
          <Route path="settings" element={<SettingsPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
