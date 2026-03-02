import React from 'react';
import { TrendingUp } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  color: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose';
  footer?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, subtext, icon, trend, color, footer }) => {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 bg-cyan-950/30 border-cyan-900/50',
    indigo: 'text-indigo-400 bg-indigo-950/30 border-indigo-900/50',
    emerald: 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50',
    amber: 'text-amber-400 bg-amber-950/30 border-amber-900/50',
    rose: 'text-rose-400 bg-rose-950/30 border-rose-900/50'
  };

  const bgClass = colorMap[color] || colorMap.cyan;

  return (
    <div className={`rounded-xl border p-4 shadow-lg backdrop-blur-sm ${bgClass.split(' ')[2]} bg-slate-800/40 hover:bg-slate-800/60 transition-colors`}>
      <div className="flex justify-between items-start mb-2">
         <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
         <div className={`p-1.5 rounded-lg ${bgClass.split(' ')[1]} ${bgClass.split(' ')[0]}`}>
            {icon}
         </div>
      </div>
      <div className="flex items-baseline gap-2">
         <h2 className="text-2xl font-bold text-white font-mono">{value}</h2>
      </div>
      <div className={`text-[10px] mt-1 font-medium flex items-center gap-1 ${trend === 'up' ? 'text-emerald-400' : 'text-amber-400'}`}>
         {trend === 'up' ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
         {subtext}
      </div>
      {footer}
    </div>
  );
};