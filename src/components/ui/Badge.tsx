
import React from 'react';
import { clsx } from 'clsx';
import { SemanticStatus } from '../../types/domain';

const statusConfig: Record<SemanticStatus, { label: string; color: string }> = {
  'SCANNED': { label: '已扫描', color: 'bg-gray-100 text-gray-700' },
  'PENDING_UNDERSTANDING': { label: '待理解', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  'UNDERSTANDING_RUNNING': { label: '理解中...', color: 'bg-blue-100 text-blue-800 animate-pulse' },
  'NEED_DECISION': { label: '待裁决', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  'SEMANTIC_CONFIRMED': { label: '已确认', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  'OBJECT_CANDIDATES_READY': { label: '候选就绪', color: 'bg-purple-100 text-purple-800' },
  'PUBLISHED_PREVIEW': { label: '预览发布', color: 'bg-indigo-50 text-indigo-700' },
  'PUBLISHED_FORMAL': { label: '正式发布', color: 'bg-green-100 text-green-800 font-bold' },
};

export const Badge = ({ status }: { status: SemanticStatus }) => {
  const cfg = statusConfig[status] || { label: status, color: 'bg-gray-100' };
  return (
    <span className={clsx("px-2 py-0.5 rounded text-xs border border-transparent", cfg.color)}>
      {cfg.label}
    </span>
  );
};
