
export type StageId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface AIOpsStage {
  id: StageId;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  description: string;
}

export interface AIOpsTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  type: 'hard-block' | 'soft-task';
  task_type: 'CREDENTIAL_REQUIRED' | 'SEMANTIC_CONFLICT' | 'DATA_QUALITY_ISSUE' | 'METADATA_MISSING' | 'ENUM_MAPPING_REQUIRED';
  stage: StageId;
  asset_ref?: string;
  reason?: string;
}

export interface AIOpsDeliverable {
  id: string;
  name: string;
  type: string;
  url?: string;
  createdAt: string;
}

export interface AIOpsRun {
  id: string;
  stageId: StageId;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
}

export interface AIOpsRequest {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
  stages: AIOpsStage[];
  tasks: AIOpsTask[];
  deliverables: AIOpsDeliverable[];
  runs: AIOpsRun[];
}

export type ChatMessageType = 
  | 'user' 
  | 'plan' 
  | 'progress' 
  | 'blocker' 
  | 'result' 
  | 'deliverable';

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  content?: string;
  timestamp: string;
  sender?: 'user' | 'ai';
  data?: any;
}
