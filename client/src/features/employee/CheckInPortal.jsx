// src/features/employee/CheckInPortal.jsx
// Phase 2 — Employee logs actual achievements against approved goals.
import { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../config/api';
import { STATUS_OPTIONS, QUARTERS } from '../../config/constants';
import { computeScore } from '../../utils/scoring';
import { safeComments } from '../../utils/comments';
import { exportSheetToCSV } from '../../utils/csv';
import { ScoreBadge } from '../../components/ui/ScoreBadge';
import { SheetAnalytics } from '../../components/charts/SheetAnalytics';

export function CheckInPortal({ approvedSheets, achievementInputs, onInputChange, onRefresh }) {
  const [activeSheet,   setActiveSheet]   = useState(null);
  const [checkinStatus, setCheckinStatus] = useState({});

  const submitAchievements = async (sheetId, sheetGoals) => {
    setCheckinStatus(prev => ({ ...prev, [sheetId]: '' }));
    try {
      const goalsPayload = sheetGoals.map(g => ({
        _id:               g._id,
        actualAchievement: achievementInputs[sheetId]?.[g._id]?.actual ?? '',
        goalStatus:        achievementInputs[sheetId]?.[g._id]?.status ?? 'Not Started',
      }));
      await axios.put(`${API_BASE}/checkin/${sheetId}`, { goals: goalsPayload });
      setCheckinStatus(prev => ({ ...prev, [sheetId]: 'success' }));
      setActiveSheet(null);
      onRefresh();
    } catch {
      setCheckinStatus(prev => ({ ...prev, [sheetId]: 'error' }));
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
      <div className="p-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          Phase 2 — Achievement Tracking
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight">Quarterly Check-in Portal</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Log your actual achievements against approved targets.
        </p>
      </div>

      {approvedSheets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-8">
          <div className="h-16 w-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-5 text-3xl">⏳</div>
          <h3 className="font-bold text-slate-300 text-base mb-2">Awaiting Manager Approval</h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Your goal sheet has been submitted and is pending review.
          </p>
        </div>
      ) : (
        <div className="p-8 space-y-6">
          {approvedSheets.map(sheet => {
            const isOpen = activeSheet === sheet._id;
            return (
              <div key={sheet._id} className="bg-slate-900/50 border border-emerald-900/30 rounded-xl overflow-hidden">

                {/* Sheet header */}
                <div className="bg-slate-950/60 px-6 py-4 flex justify-between items-center border-b border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">✅ Approved Goal Sheet</p>
                    <p className="text-[10px] font-mono text-slate-600 mt-0.5">ID: {sheet._id}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {checkinStatus[sheet._id] === 'success' && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">✅ Saved</span>
                    )}
                    {checkinStatus[sheet._id] === 'error' && (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-lg">❌ Error saving</span>
                    )}
                    <button onClick={() => exportSheetToCSV(sheet)}
                      className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-3 py-2 rounded-lg transition-all cursor-pointer">
                      ⬇️ Export CSV
                    </button>
                    <button onClick={() => setActiveSheet(isOpen ? null : sheet._id)}
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wider uppercase px-3 py-2 rounded-lg transition-all cursor-pointer">
                      {isOpen ? '✕ Close' : '📝 Log Achievement'}
                    </button>
                  </div>
                </div>

                {/* Goals table */}
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                        <th className="p-3">Thrust Area</th>
                        <th className="p-3">Goal</th>
                        <th className="p-3 text-center">UoM</th>
                        <th className="p-3 text-right">Target</th>
                        <th className="p-3 text-right">Actual</th>
                        <th className="p-3 text-center">Score</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                      {sheet.goals.map(g => {
                        const inp   = achievementInputs[sheet._id]?.[g._id] || { actual: '', status: 'Not Started' };
                        const score = computeScore(g.uom, g.target, inp.actual);
                        return (
                          <tr key={g._id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3 font-semibold text-slate-200 bg-slate-950/20">{g.thrustArea}</td>
                            <td className="p-3">
                              <div className="font-medium text-slate-300">{g.title}</div>
                              {g.description && <div className="text-slate-500 text-[10px] mt-0.5 italic">{g.description}</div>}
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded font-medium text-slate-400 text-[10px]">{g.uom}</span>
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-300">{g.target}</td>
                            <td className="p-3 text-right">
                              {isOpen ? (
                                <input type="text" placeholder="Enter actual"
                                  value={inp.actual}
                                  onChange={e => onInputChange(sheet._id, g._id, 'actual', e.target.value)}
                                  className="w-24 px-2 py-1.5 border border-slate-700 rounded-md text-xs bg-slate-900 text-slate-200 focus:border-emerald-500 outline-none font-mono text-right" />
                              ) : (
                                <span className="font-mono font-bold text-slate-300">
                                  {inp.actual !== '' ? inp.actual : <span className="text-slate-600">—</span>}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center"><ScoreBadge score={score} /></td>
                            <td className="p-3 text-center">
                              {isOpen ? (
                                <select value={inp.status}
                                  onChange={e => onInputChange(sheet._id, g._id, 'status', e.target.value)}
                                  className="px-2 py-1.5 border border-slate-700 rounded-md text-[10px] bg-slate-900 text-slate-300 focus:border-emerald-500 outline-none cursor-pointer">
                                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              ) : (
                                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                                  inp.status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                  : inp.status === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                  : 'text-slate-500 bg-slate-800 border-slate-700'
                                }`}>{inp.status}</span>
                              )}
                            </td>
                            <td className="p-3 text-center font-bold text-indigo-400 font-mono">{g.weightage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {isOpen && (
                  <div className="px-6 pb-5 flex justify-end">
                    <button onClick={() => submitAchievements(sheet._id, sheet.goals)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs tracking-wide uppercase shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer">
                      💾 Save Achievement Data
                    </button>
                  </div>
                )}

                <SheetAnalytics sheet={sheet} />

                {/* Manager check-in comments (read-only for employee) */}
                {Object.keys(safeComments(sheet.checkInComments)).length > 0 && (
                  <div className="px-6 pb-5 border-t border-slate-800 pt-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Manager Check-in Feedback</p>
                    <div className="grid grid-cols-2 gap-3">
                      {QUARTERS.map(q => safeComments(sheet.checkInComments)[q] ? (
                        <div key={q} className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase">{q}</span>
                          <p className="text-xs text-slate-400 mt-1">{safeComments(sheet.checkInComments)[q]}</p>
                        </div>
                      ) : null)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
