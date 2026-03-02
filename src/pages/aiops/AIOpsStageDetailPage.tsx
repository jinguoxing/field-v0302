
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StageId } from '../../types/aiops';
import { StageDetailContent } from '../../components/aiops/stages/StageDetailContent';

export const AIOpsStageDetailPage: React.FC = () => {
  const { requestId, stageId } = useParams<{ requestId: string; stageId: StageId }>();
  const navigate = useNavigate();

  if (!requestId || !stageId) return <div>参数错误</div>;

  return (
    <div className="bg-slate-900 min-h-screen animate-in fade-in duration-500">
      <StageDetailContent 
        stageId={stageId} 
        requestId={requestId} 
        onBack={() => navigate(`/aiops/workbench/requests/${requestId}`)} 
      />
    </div>
  );
};
