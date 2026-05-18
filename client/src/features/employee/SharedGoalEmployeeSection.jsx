// src/features/employee/SharedGoalEmployeeSection.jsx
import { useState } from 'react';
import axios from 'axios';
import { SG_API_BASE } from '../../config/api';
import { STATUS_OPTIONS } from '../../config/constants';
import { computeScore } from '../../utils/scoring';
import { ScoreBadge } from '../../components/ui/ScoreBadge';

export function SharedGoalEmployeeSection({ sharedGoals, employeeId, onRefresh, toast }) {
  const [inputs,   setInputs]   = useState({});
  const [openGoal, setOpenGoal] = useState(null);
  const [saving,   setSaving]   = useState({});

  const getInput = (goalId, field) => {
    const sg  = sharedGoals.find(g => g._id === goalId);
    const def = field === 'actual'
      ? (sg?.assignment?.actualAchievement ?? '')
      : (sg?.assignment?.goalStatus ?? 'Not Started');
    return inputs[goalId]?.[field] ?? def;
  };

  const setInput = (goalId, field, value) => {
    setInputs(prev => ({ ...prev, [goalId]: { ...prev[goalId], [field]: value } }));
  };

  const saveCheckin = async (goalId) => {
    setSaving(prev => ({ ...prev, [goalId]: true }));
    try {
      await axios.put(`${SG_API_BASE}/checkin/${goalId}/${employeeId}`, {
        actualAchievement: getInput(goalId, 'actual'),
        goalStatus:        getInput(goalId, 'status'),
      });
      toast('Shared goal check-in saved.', 'success');
      setOpenGoal(null);
      onRefresh();
    } catch {
      toast('Failed to save shared goal check-in.', 'error');
    } finally {
      setSaving(prev => ({ ...prev, [goalId]: false }));
    }
  };

  if (sharedGoals.length === 0) return null;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
      <div className="p-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-3">
          🌐 Organisation-Wide KPIs
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight">Shared Goals</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          KPIs assigned to you by the admin. Log your actual achievement for each.
        </p>
      </div>

      <div className="p-6 space-y-4">
        {sharedGoals.map(sg => {
          const isOpen = openGoal === sg._id;
          const actual = getInput(sg._id, 'actual');
          const status = getInput(sg._id, 'status');
          const score  = computeScore(sg.uom, sg.target, actual);

          return (
            <div key={sg._id} className="bg-slate-900/50 border border-fuchsia-900/30 rounded-xl overflow-hidden">
              <div className="bg-slate-950/60 px-6 py-4 flex justify-between items-center border-b border-slate-800">
                <div>
                  <p className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">{sg.thrustArea}</p>
                  <h3 className="font-bold text-white mt-0.5">{sg.title}</h3>
                  {sg.description && <p className="text-[10px] text-slate-500 mt-0.5 italic">{sg.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-1 rounded font-mono">{sg.cycleYear}</span>
                  <button onClick={() => setOpenGoal(isOpen ? null : sg._id)}
                    className="bg-fuchsia-600/15 hover:bg-fuchsia-600/25 border border-fuchsia-500/30 text-fuchsia-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                    {isOpen ? '✕ Close' : '📝 Log Achievement'}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                      <th className="p-3 text-center">UoM</th>
                      <th className="p-3 text-right">Target</th>
                      <th className="p-3 text-right">Actual</th>
                      <th className="p-3 text-center">Score</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-900/30">
                    <tr>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded font-medium text-slate-400 text-[10px]">{sg.uom}</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-300">{sg.target}</td>
                      <td className="p-3 text-right">
                        {isOpen ? (
                          <input type="text" placeholder="Enter actual"
                            value={actual} onChange={e => setInput(sg._id, 'actual', e.target.value)}
                            className="w-28 px-2 py-1.5 border border-slate-700 rounded-md text-xs bg-slate-900 text-slate-200 focus:border-fuchsia-500 outline-none font-mono text-right" />
                        ) : (
                          <span className="font-mono font-bold text-slate-300">
                            {actual !== '' ? actual : <span className="text-slate-600">—</span>}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center"><ScoreBadge score={score} /></td>
                      <td className="p-3 text-center">
                        {isOpen ? (
                          <select value={status} onChange={e => setInput(sg._id, 'status', e.target.value)}
                            className="px-2 py-1.5 border border-slate-700 rounded-md text-[10px] bg-slate-900 text-slate-300 focus:border-fuchsia-500 outline-none cursor-pointer">
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                            status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : status === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-slate-500 bg-slate-800 border-slate-700'
                          }`}>{status}</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {isOpen && (
                  <div className="flex justify-end mt-3">
                    <button onClick={() => saveCheckin(sg._id)} disabled={saving[sg._id]}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-xs tracking-wide uppercase shadow-lg shadow-fuchsia-500/20 transition-all active:scale-95 cursor-pointer">
                      💾 {saving[sg._id] ? 'Saving…' : 'Save Achievement'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
