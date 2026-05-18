// src/components/charts/TeamAnalytics.jsx
// Aggregated analytics panel shown at the top of the Manager view.
import { computeScore } from '../../utils/scoring';
import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';

export function TeamAnalytics({ sheets }) {
  const approved = sheets.filter(s => s.status === 'Approved');
  if (approved.length === 0) return null;

  const empData = approved.map(sheet => {
    const scored = sheet.goals
      .map(g => ({ score: computeScore(g.uom, g.target, g.actualAchievement), weight: g.weightage }))
      .filter(d => d.score !== null);
    const totalW = scored.reduce((s, d) => s + d.weight, 0);
    const ws     = totalW > 0
      ? Math.round(scored.reduce((s, d) => s + d.score * d.weight, 0) / totalW)
      : null;
    return { name: sheet.employeeName.split(' ')[0], score: ws };
  }).filter(d => d.score !== null);

  const statusCounts = { 'Not Started': 0, 'On Track': 0, 'Completed': 0 };
  approved.forEach(sheet => {
    sheet.goals.forEach(g => { statusCounts[g.goalStatus || 'Not Started']++; });
  });
  const pieData = [
    { name: 'Not Started', value: statusCounts['Not Started'], color: '#475569' },
    { name: 'On Track',    value: statusCounts['On Track'],    color: '#f59e0b' },
    { name: 'Completed',   value: statusCounts['Completed'],   color: '#10b981' },
  ].filter(d => d.value > 0);

  if (empData.length === 0 && pieData.length === 0) return null;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2">
          📊 Team Analytics
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">Performance Overview</h2>
        <p className="text-xs text-slate-400 mt-0.5">Aggregated across all approved goal sheets.</p>
      </div>
      <div className="p-6 grid grid-cols-2 gap-6">
        {empData.length > 0 && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Employee Scores (Weighted)</p>
            <BarChart data={empData} width={340} height={160} />
          </div>
        )}
        {pieData.length > 0 && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Team Goal Status</p>
            <div className="flex items-center gap-4">
              <DonutChart data={pieData} size={130} innerR={38} outerR={60} />
              <div className="flex flex-col gap-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="font-medium">{d.name}</span>
                    <span className="font-bold font-mono text-slate-300 ml-2">{d.value}</span>
                  </div>
                ))}
                <div className="mt-1 pt-2 border-t border-slate-800 text-[10px] text-slate-600">
                  Total goals: {pieData.reduce((s, d) => s + d.value, 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
