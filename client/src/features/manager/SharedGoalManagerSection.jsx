// src/features/manager/SharedGoalManagerSection.jsx
import { computeScore } from '../../utils/scoring';
import { ScoreBadge } from '../../components/ui/ScoreBadge';

export function SharedGoalManagerSection({ sharedGoals }) {
  if (sharedGoals.length === 0) return null;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-2">
          🌐 Organisation-Wide KPIs
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">Shared Goals — Team Progress</h2>
        <p className="text-xs text-slate-400 mt-0.5">Read-only view of KPIs pushed by admin to your team.</p>
      </div>

      <div className="p-6 space-y-4">
        {sharedGoals.map(sg => (
          <div key={sg._id} className="bg-slate-900/50 border border-fuchsia-900/20 rounded-xl overflow-hidden">
            <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 rounded">{sg.thrustArea}</span>
                <h3 className="font-bold text-white text-sm">{sg.title}</h3>
                <span className="ml-auto text-[10px] font-mono text-slate-600 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">{sg.cycleYear}</span>
              </div>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                    <th className="p-2.5">Employee</th>
                    <th className="p-2.5 text-center">UoM</th>
                    <th className="p-2.5 text-right">Target</th>
                    <th className="p-2.5 text-right">Actual</th>
                    <th className="p-2.5 text-center">Score</th>
                    <th className="p-2.5 text-center">Status</th>
                    <th className="p-2.5 text-center">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                  {sg.assignments.map(a => {
                    const score = computeScore(sg.uom, sg.target, a.actualAchievement);
                    return (
                      <tr key={a.employeeId} className="hover:bg-slate-800/20">
                        <td className="p-2.5 font-semibold text-slate-300">
                          <div>{a.employeeName}</div>
                          <div className="text-[10px] font-mono text-slate-600">{a.employeeId}</div>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-500 text-[10px]">{sg.uom}</span>
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-300">{sg.target}</td>
                        <td className="p-2.5 text-right font-mono text-slate-300">
                          {a.actualAchievement != null && a.actualAchievement !== ''
                            ? a.actualAchievement : <span className="text-slate-700">—</span>}
                        </td>
                        <td className="p-2.5 text-center"><ScoreBadge score={score} /></td>
                        <td className="p-2.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                            a.goalStatus === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : a.goalStatus === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-slate-500 bg-slate-800 border-slate-700'
                          }`}>{a.goalStatus || 'Not Started'}</span>
                        </td>
                        <td className="p-2.5 text-center font-mono text-slate-600 text-[10px]">
                          {a.lastUpdated
                            ? new Date(a.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
