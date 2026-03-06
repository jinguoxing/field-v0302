
import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Plus, MoreHorizontal, CheckCircle2, Clock, AlertCircle, BarChart3, Activity, FileText } from 'lucide-react';
import { RuleScanReportModal } from '../../components/rule-center/RuleScanReportModal';

export const HealthCheckPage: React.FC = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedScanId, setSelectedScanId] = useState<string | undefined>();

  const scans = [
    { id: 'S-001', name: '全库规则合规性扫描', type: '全量扫描', status: '已完成', lastUpdate: '2024-03-21', score: '98' },
    { id: 'S-002', name: '差旅规则冲突检测', type: '冲突扫描', status: '已完成', lastUpdate: '2024-03-20', score: '95' },
    { id: 'S-003', name: '采购规则冗余分析', type: '冗余扫描', status: '进行中', lastUpdate: '2024-03-19', score: '88' },
    { id: 'S-004', name: '年度规则健康体检', type: '全量扫描', status: '已完成', lastUpdate: '2024-03-18', score: '100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" size={28} />
            规则体检
          </h1>
          <p className="text-slate-400 mt-1">扫描历史记录与体检报告归档，确保规则库的健康与合规</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-900/20">
          <Activity size={18} />
          开始体检
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl backdrop-blur-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 flex items-center justify-center text-2xl font-bold text-emerald-400">
            96
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">健康评分</h3>
            <p className="text-slate-400 text-sm">当前规则库整体健康状况良好</p>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl backdrop-blur-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">待优化项</h3>
            <p className="text-slate-400 text-sm">检测到 12 个潜在的规则冲突或冗余</p>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl backdrop-blur-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
            <FileText size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">体检报告</h3>
            <p className="text-slate-400 text-sm">本月已生成 4 份详细体检报告</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-300">体检历史记录</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
              <Filter size={16} />
              筛选
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/30 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">扫描 ID</th>
              <th className="px-6 py-4 font-semibold">扫描名称</th>
              <th className="px-6 py-4 font-semibold">类型</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">健康得分</th>
              <th className="px-6 py-4 font-semibold">扫描时间</th>
              <th className="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {scans.map((scan) => (
              <tr key={scan.id} className="hover:bg-slate-700/20 transition-colors group">
                <td className="px-6 py-4 text-sm font-mono text-cyan-400/80">{scan.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-200">{scan.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{scan.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[11px] font-medium ${scan.status === '已完成' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {scan.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${parseInt(scan.score) >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {scan.score}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{scan.lastUpdate}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => {
                      setSelectedScanId(scan.id);
                      setIsReportModalOpen(true);
                    }}
                    className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
                  >
                    查看报告
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RuleScanReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        scanId={selectedScanId}
        status="WARN" // Mocking status for now
      />
    </div>
  );
};
