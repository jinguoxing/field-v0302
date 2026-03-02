
import React from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import App from './App';
import LogicalViewList from './pages/LogicalViewList';
import LogicalViewDetail from './pages/LogicalViewDetail';
import { AIOpsWorkbenchPage } from './pages/aiops/AIOpsWorkbenchPage';
import { AIOpsRequestDetailPage } from './pages/aiops/AIOpsRequestDetailPage';
import { AIOpsStageDetailPage } from './pages/aiops/AIOpsStageDetailPage';
import { FieldWorkbenchPage } from './pages/semantic/FieldWorkbenchPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/semantic-modeling/logical-views" replace /> },
      { 
        path: 'semantic-modeling/logical-views', 
        element: <LogicalViewList /> 
      },
      { 
        path: 'semantic-modeling/logical-views/:logicalViewId', 
        element: <LogicalViewDetail /> 
      },
      {
        path: 'aiops/workbench',
        element: <AIOpsWorkbenchPage />
      },
      {
        path: 'aiops/workbench/requests/:requestId',
        element: <AIOpsRequestDetailPage />
      },
      {
        path: 'aiops/workbench/requests/:requestId/stages/:stageId',
        element: <AIOpsRequestDetailPage />
      },
      {
        path: 'semantic/workbench/:lvId',
        element: <FieldWorkbenchPage />
      },
      { path: '*', element: <div className="p-10">404 Not Found</div> }
    ]
  }
]);
