// src/features/manager/ManagerPipeline.jsx
// Full manager review UI: approve, return, inline-edit, check-in comments, audit trail.
import { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../config/api';
import { UOM_OPTIONS, STATUS_OPTIONS, QUARTERS } from '../../config/constants';
import { computeScore } from '../../utils/scoring';
import { safeComments } from '../../utils/comments';
import { exportAllSheetsToCSV, exportSheetToCSV } from '../../utils/csv';
import { ScoreBadge } from '../../components/ui/ScoreBadge';
import { AuditTrail } from '../../components/shared/AuditTrail';
import { SheetAnalytics } from '../../components/charts/SheetAnalytics';

export function ManagerPipeline({
  sheets, editingSheets, editModeActive,
  onEnterEdit, onCancelEdit, onGoalEdit, getEditTotal,
  onRefresh, loggedInUser, toast,
}) {
  const [managerComments, setManagerComments] = useState({});
  const [activeComment,   setActiveComment]   = useState(null);

  const handleDecision = async (sheetId, decisionStatus) => {
    const isEditing = editModeActive[sheetId];
    if (isEditing) {
      const eg    = editingSheets[sheetId];
      const total = eg.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0);
      if (total !== 100)                              { toast(`Weightage must total 100%. Current: ${total}%`, 'warn'); return; }
      if (eg.some(g => Number(g.weightage) < 10))    { toast('Each goal needs at least 10% weightage.', 'warn'); return; }
    }
    const sheet      = sheets.find(s => s._id === sheetId);
    const finalGoals = isEditing ? editingSheets[sheetId] : sheet.goals;
    try {
      await axios.put(`${API_BASE}/review/${sheetId}`, {
        status: decisionStatus, goals: finalGoals,
        actorId: loggedInUser?.id, actorName: loggedInUser?.name,
      });
      toast(`Sheet ${decisionStatus.toLowerCase()} successfully.`, 'success');
      onCancelEdit(sheetId);
      onRefresh();
    } catch {
      toast('Failed to process decision. Try again.', 'error');
    }
  };

  const saveComment = async (sheetId) => {
    const { quarter, comment } = managerComments[sheetId] || {};
    if (!quarter || !comment?.trim()) { toast('Select a quarter and enter a comment.', 'warn'); return; }
    try {
      await axios.put(`${API_BASE}/manager-checkin/${sheetId}`, { quarter, comment });
      toast(`${quarter} check-in saved.`, 'success');
      setActiveComment(null);
      onRefresh();
    } catch {
      toast('Failed to save check-in comment.', 'error');
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
      <div className="p-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
          Operational Review Suite
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight">Team Goal Pipeline</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Review, edit, approve goals and conduct quarterly check-ins for your direct reports.
        </p>
        <div className="mt-4">
          <button onClick={() => exportAllSheetsToCSV(sheets)}
            className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-all cursor-pointer">
            ⬇️ Export All CSV
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {sheets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
            <div className="h-16 w-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-5 text-3xl">🎯</div>
            <h3 className="font-bold text-slate-300 text-base mb-2">Pipeline Clear</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">No goal sheets are pending review right now.</p>
          </div>
        ) : (
          sheets.map(sheet => {
            const isEditing     = editModeActive[sheet._id];
            const editGoals     = editingSheets[sheet._id] || sheet.goals;
            const editTotal     = isEditing ? getEditTotal(sheet._id) : null;
            const isApproved    = sheet.status === 'Approved';
            const commentState  = managerComments[sheet._id] || { quarter: 'Q1', comment: '' };
            const isCommentOpen = activeComment === sheet._id;

            return (
              <div key={sheet._id} className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-md overflow-hidden hover:border-slate-700/60 transition-all">

                {/* Sheet header */}
                <div className="bg-slate-950/80 px-6 py-4 flex justify-between items-center border-b border-slate-800 flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center font-bold text-indigo-400 shadow-inner">
                      {sheet.employeeName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-wide text-white">{sheet.employeeName}</h3>
                      <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mt-0.5">
                        UID: {sheet.employeeId} • State:{' '}
                        <span className={`font-bold ${
                          isApproved ? 'text-emerald-400'
                          : sheet.status === 'Returned' ? 'text-rose-400'
                          : 'text-amber-400'
                        }`}>{sheet.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {!isApproved && !isEditing && (
                      <button onClick={() => onEnterEdit(sheet)}
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                        ✏️ Edit Goals
                      </button>
                    )}
                    {isEditing && (
                      <>
                        <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${
                          editTotal === 100 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}>Σ {editTotal}%</span>
                        <button onClick={() => onCancelEdit(sheet._id)}
                          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                          ✕ Cancel
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDecision(sheet._id, 'Returned')}
                      className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                      ↩️ Return
                    </button>
                    <button onClick={() => handleDecision(sheet._id, 'Approved')}
                      className="bg-emerald-600/15 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                      ✅ Approve
                    </button>
                    <button onClick={() => exportSheetToCSV(sheet)}
                      className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                      ⬇️ CSV
                    </button>
                    <button onClick={() => setActiveComment(isCommentOpen ? null : sheet._id)}
                      className="bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                      💬 {isCommentOpen ? 'Close' : 'Add Comment'}
                    </button>
                  </div>
                </div>

                {/* Goals table */}
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                        <th className="p-2.5">Thrust Area</th>
                        <th className="p-2.5">Goal</th>
                        <th className="p-2.5 text-center">UoM</th>
                        <th className="p-2.5 text-right">Target</th>
                        <th className="p-2.5 text-right">Actual</th>
                        <th className="p-2.5 text-center">Score</th>
                        <th className="p-2.5 text-center">Status</th>
                        <th className="p-2.5 text-center">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                      {editGoals.map((g, i) => {
                        const score = computeScore(g.uom, g.target, g.actualAchievement);
                        return (
                          <tr key={g._id || i} className="hover:bg-slate-800/20">
                            <td className="p-2.5">
                              {isEditing ? (
                                <input type="text" value={g.thrustArea}
                                  onChange={e => onGoalEdit(sheet._id, i, 'thrustArea', e.target.value)}
                                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 outline-none focus:border-indigo-500" />
                              ) : (
                                <span className="font-semibold text-slate-300">{g.thrustArea}</span>
                              )}
                            </td>
                            <td className="p-2.5">
                              {isEditing ? (
                                <input type="text" value={g.title}
                                  onChange={e => onGoalEdit(sheet._id, i, 'title', e.target.value)}
                                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 outline-none focus:border-indigo-500" />
                              ) : (
                                <>
                                  <div className="font-medium text-slate-300">{g.title}</div>
                                  {g.description && <div className="text-slate-600 text-[10px] italic">{g.description}</div>}
                                </>
                              )}
                            </td>
                            <td className="p-2.5 text-center">
                              {isEditing ? (
                                <select value={g.uom} onChange={e => onGoalEdit(sheet._id, i, 'uom', e.target.value)}
                                  className="bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-300 outline-none cursor-pointer px-1 py-1">
                                  {UOM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.value}</option>)}
                                </select>
                              ) : (
                                <span className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-500 text-[10px]">{g.uom}</span>
                              )}
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-300">
                              {isEditing ? (
                                <input type="text" value={g.target}
                                  onChange={e => onGoalEdit(sheet._id, i, 'target', e.target.value)}
                                  className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 outline-none focus:border-indigo-500 text-right font-mono" />
                              ) : g.target}
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-300">
                              {g.actualAchievement != null && g.actualAchievement !== ''
                                ? g.actualAchievement : <span className="text-slate-700">—</span>}
                            </td>
                            <td className="p-2.5 text-center"><ScoreBadge score={score} /></td>
                            <td className="p-2.5 text-center">
                              <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                                g.goalStatus === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                : g.goalStatus === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-slate-500 bg-slate-800 border-slate-700'
                              }`}>{g.goalStatus || 'Not Started'}</span>
                            </td>
                            <td className="p-2.5 text-center">
                              {isEditing ? (
                                <input type="number" min="10" max="100" value={g.weightage}
                                  onChange={e => onGoalEdit(sheet._id, i, 'weightage', e.target.value)}
                                  className="w-14 px-1 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-indigo-400 outline-none focus:border-indigo-500 text-center font-mono" />
                              ) : (
                                <span className="font-bold text-indigo-400 font-mono">{g.weightage}%</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Quarter comment panel */}
                {isCommentOpen && (
                  <div className="px-6 pb-5 border-t border-slate-800/60 pt-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Add Quarterly Comment</p>
                    <div className="flex gap-3 items-end flex-wrap">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Quarter</label>
                        <select value={commentState.quarter}
                          onChange={e => setManagerComments(prev => ({ ...prev, [sheet._id]: { ...prev[sheet._id], quarter: e.target.value } }))}
                          className="px-3 py-2 border border-slate-700 rounded-lg text-xs bg-slate-900 text-slate-300 outline-none cursor-pointer">
                          {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
                        </select>
                      </div>
                      <div className="flex-1 min-w-48">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Comment</label>
                        <input type="text" placeholder="Enter quarterly feedback…"
                          value={commentState.comment || ''}
                          onChange={e => setManagerComments(prev => ({ ...prev, [sheet._id]: { ...prev[sheet._id], comment: e.target.value } }))}
                          className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-slate-900 text-slate-200 outline-none focus:border-violet-500" />
                      </div>
                      <button onClick={() => saveComment(sheet._id)}
                        className="bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-400 text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-all cursor-pointer">
                        💾 Save
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing check-in comments */}
                {Object.keys(safeComments(sheet.checkInComments)).length > 0 && (
                  <div className="px-6 pb-4 border-t border-slate-800/60 pt-3">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Check-in Comments</p>
                    <div className="flex flex-wrap gap-2">
                      {QUARTERS.map(q => safeComments(sheet.checkInComments)[q] ? (
                        <div key={q} className="bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 max-w-xs">
                          <span className="text-[9px] font-bold text-indigo-400 uppercase">{q}: </span>
                          <span className="text-[10px] text-slate-400">{safeComments(sheet.checkInComments)[q]}</span>
                        </div>
                      ) : null)}
                    </div>
                  </div>
                )}

                <AuditTrail entries={sheet.auditTrail} />

                {isApproved && <SheetAnalytics sheet={sheet} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
