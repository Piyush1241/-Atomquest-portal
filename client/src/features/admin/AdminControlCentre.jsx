// src/features/admin/AdminControlCentre.jsx
import { computeScore } from '../../utils/scoring';
import { exportAllSheetsToCSV, exportSheetToCSV } from '../../utils/csv';
import { safeComments } from '../../utils/comments';
import { ScoreBadge } from '../../components/ui/ScoreBadge';
import { AuditTrail } from '../../components/shared/AuditTrail';
import { QUARTERS } from '../../config/constants';

const STATUS_FILTERS = ['All', 'Draft', 'Pending Approval', 'Approved', 'Returned'];

export function AdminControlCentre({
  filteredSheets, allSheets, loading, filter, feedback,
  onFilterChange, onUnlock, onForceApprove, onDelete, onRefresh,
}) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
          Admin Control Centre
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight">All Goal Sheets</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          System-wide view of every goal sheet. Force-approve, unlock, delete, and export.
        </p>

        {feedback && (
          <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold ${
            feedback === 'error'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {feedback === 'unlocked'  ? '🔓 Sheet unlocked'
            : feedback === 'approved' ? '✅ Force-approved'
            : feedback === 'deleted'  ? '🗑️ Sheet deleted'
            : '❌ Operation failed'}
          </div>
        )}

        {/* Filters + bulk export */}
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => onFilterChange(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                filter === f
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
              }`}>{f}</button>
          ))}
          <button onClick={() => exportAllSheetsToCSV(allSheets)}
            className="ml-auto bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-lg transition-all cursor-pointer">
            ⬇️ Export All CSV
          </button>
          <button onClick={onRefresh}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-slate-500 text-sm font-medium animate-pulse">Loading system data…</div>
          </div>
        ) : filteredSheets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
            <div className="text-3xl mb-3">📋</div>
            <p className="text-sm font-bold text-slate-400">No sheets match this filter</p>
          </div>
        ) : (
          filteredSheets.map(sheet => {
            const isApproved = sheet.status === 'Approved';
            return (
              <div key={sheet._id} className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-md overflow-hidden">

                {/* Sheet header */}
                <div className="bg-slate-950/80 px-6 py-4 flex justify-between items-center border-b border-slate-800 flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center font-bold text-rose-400 shadow-inner">
                      {sheet.employeeName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-wide text-white">{sheet.employeeName}</h3>
                      <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mt-0.5">
                        EMP: {sheet.employeeId} • MGR: {sheet.managerId} • State:{' '}
                        <span className={`font-bold ${
                          isApproved ? 'text-emerald-400'
                          : sheet.status === 'Returned' ? 'text-rose-400'
                          : 'text-amber-400'
                        }`}>{sheet.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center flex-wrap">
                    {!isApproved && (
                      <button onClick={() => onForceApprove(sheet._id)}
                        className="bg-emerald-600/15 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                        ✅ Force Approve
                      </button>
                    )}
                    {isApproved && (
                      <button onClick={() => onUnlock(sheet._id)}
                        className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                        🔓 Unlock Sheet
                      </button>
                    )}
                    <button onClick={() => onDelete(sheet._id)}
                      className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                      🗑️ Delete
                    </button>
                    <button onClick={() => exportSheetToCSV(sheet)}
                      className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                      ⬇️ CSV
                    </button>
                  </div>
                </div>

                {/* Goals table */}
                <div className="px-4 pb-4 pt-3 overflow-x-auto">
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
                      {sheet.goals.map((g, i) => {
                        const score = computeScore(g.uom, g.target, g.actualAchievement);
                        return (
                          <tr key={g._id || i} className="hover:bg-slate-800/20">
                            <td className="p-2.5 font-semibold text-slate-300">{g.thrustArea}</td>
                            <td className="p-2.5">
                              <div className="font-medium text-slate-300">{g.title}</div>
                              {g.description && <div className="text-slate-600 text-[10px] italic">{g.description}</div>}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-500 text-[10px]">{g.uom}</span>
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-300">{g.target}</td>
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
                            <td className="p-2.5 text-center font-bold text-indigo-400 font-mono">{g.weightage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Check-in comments */}
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
