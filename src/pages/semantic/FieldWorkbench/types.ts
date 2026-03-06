export type QueueType = 'AUTO_PASS' | 'NEEDS_CONFIRM' | 'CONFLICT' | 'ANOMALY' | 'IGNORE_CANDIDATE' | 'ALL';

export interface FieldItem {
    id: string;
    name: string;
    dataType: string;
    table: string;
    type: string;
    role: string;
    confidence: number;
    gap?: number;
    route: QueueType;
    isKeyField: boolean;
    impact: number;
    risks: ('PII' | 'KeyField' | 'HighImpact')[];
    completeness: number;
}

export interface HistoryEntry {
    id: string;
    timestamp: string;
    operator: string;
    action: string;
    changes: Record<string, { from: string; to: string }>;
    snapshot: FieldItem;
}
