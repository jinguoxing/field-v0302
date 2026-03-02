
import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { PublishCheck } from '../../types/domain';
import { mockApi } from '../../api/mockApi';

interface PublishWizardProps {
  isOpen: boolean;
  onClose: () => void;
  logicalViewId: string;
  type: 'PREVIEW' | 'FORMAL';
  onSuccess: () => void;
}

export const PublishWizard = ({ isOpen, onClose, logicalViewId, type, onSuccess }: PublishWizardProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Mock checks
  const checks: PublishCheck[] = [
    { group: 'Schema', item: 'Schema stable', status: 'PASS' },
    { group: 'Semantic', item: 'Field coverage > 80%', status: type === 'FORMAL' ? 'PASS' : 'WARN', message: 'Current 92%' },
    { group: 'Quality', item: 'No critical task open', status: 'PASS' }
  ];

  const handlePublish = async () => {
    setLoading(true);
    await mockApi.publish(logicalViewId, type);
    setLoading(false);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-[600px] shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {type === 'PREVIEW' ? '预览发布 (Preview)' : '正式发布 (Formal)'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-700 mb-2">发布前检查 (Pre-flight Checks)</h3>
              {checks.map((check, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    {check.status === 'PASS' ? <CheckCircle className="text-emerald-500 w-5 h-5" /> : 
                     check.status === 'WARN' ? <AlertTriangle className="text-amber-500 w-5 h-5" /> : 
                     <X className="text-red-500 w-5 h-5" />}
                    <div>
                      <div className="text-sm font-medium text-slate-900">{check.item}</div>
                      <div className="text-xs text-slate-500">{check.group}</div>
                    </div>
                  </div>
                  {check.message && <span className="text-xs bg-slate-200 px-2 py-1 rounded">{check.message}</span>}
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
                <Info className="w-5 h-5 shrink-0" />
                <p>发布后，该视图将被下游 {type === 'FORMAL' ? '生产环境' : '测试环境'} 可见。请确认元数据准确性。</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">发布说明</label>
                <textarea className="w-full border rounded-lg p-2 text-sm h-24" placeholder="本次更新内容..." />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-slate-50 rounded-b-xl flex justify-end gap-3">
          {step === 1 ? (
            <button onClick={() => setStep(2)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">下一步</button>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg">上一步</button>
              <button onClick={handlePublish} disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                确认发布
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
