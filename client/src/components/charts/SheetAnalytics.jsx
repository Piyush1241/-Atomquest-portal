// src/components/charts/SheetAnalytics.jsx
// Per-sheet analytics panel shown in Employee (check-in) and Manager (approved) views.
import { computeScore } from '../../utils/scoring';
import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';

export function SheetAnalytics({ sheet }) {
  const barData = sheet.goals
    .map(g => ({
      name:   g.title.length > 14 ? `${g.title.slice(0, 14)}…` : g.title,
      score:  computeScore(g.uom, g.target, g.actualAchievement),
      weight: g.weightage,
    }))
    .filter(d => d.score !== null);

  const totalWeight   = barData.reduce((s, d) => s + d.weight, 0);
  const weightedScore = totalWeight > 0
    ? Math.round(barData.reduce((s, d) => s + d.score * d.weight, 0) / totalWeight)
    : null;

  const statusCounts = { 'Not Started': 0, 'On Track': 0, 'Completed': 0 };
  sheet.goals.forEach(g => { statusCounts[g.goalStatus || 'Not Started']++; });
  const pieData = [
    { name: 'Not Started', value: statusCounts['Not Started'], color: '#475569' },
    { name: 'On Track',    value: statusCounts['On Track'],    color: '#f59e0b' },
    { name: 'Completed',   value: statusCounts['Completed'],   color: '#10b981' },
  ].filter(d => d.value > 0);

  const scoreColor = weightedScore === null ? '#64748b'
    : weightedScore >= 90 ? '#10b981'
    : weightedScore >= 70 ? '#f59e0b'
    : '#f43f5e';

  if (barData.length === 0) {
    return (
      <div className="px-6 pb-6 border-t border-slate-800 pt-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">📊 Analytics</p>
        <p className="text-xs text-slate-600 italic">Log achievements to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 border-t border-slate-800 pt-5">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">📊 Performance Analytics</p>
      <div className="grid grid-cols-3 gap-4">

        {/* Weighted Score */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Score</p>
          <div className="text-4xl font-black font-mono" style={{ color: scoreColor }}>{weightedScore}%</div>
          <p className="text-[10px] text-slate-600 mt-1">weighted avg</p>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${weightedScore}%`, backgroundColor: scoreColor }} />
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Goal Scores</p>
          <BarChart data={barData} width={220} height={110} />
        </div>

        {/* Donut chart */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status Split</p>
          <div className="flex items-center gap-3">
            <DonutChart data={pieData} size={90} innerR={26} outerR={42} />
            <div className="flex flex-col gap-1.5">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-[9px] text-slate-500">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  {d.name}: <span className="font-bold text-slate-300">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
