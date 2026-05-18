// src/features/admin/SharedGoalAdminSection.jsx
import { useState } from 'react';
import axios from 'axios';
import { SG_API_BASE } from '../../config/api';
import { KNOWN_EMPLOYEES, UOM_OPTIONS, STATUS_OPTIONS } from '../../config/constants';
import { computeScore } from '../../utils/scoring';
import { ScoreBadge } from '../../components/ui/ScoreBadge';

export function SharedGoalAdminSection({ sharedGoals, adminId, adminName, onRefresh, toast }) {
  const [form, setForm] = useState({
    title: '', description: '', thrustArea: '', uom: '%', target: '',
    cycleYear: new Date().getFullYear().toString()
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [pushing, setPushing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const toggleEmployee = (emp) => {
    setSelectedEmployees(prev =>
      prev.find(e => e.id === emp.id)
        ? prev.filter(e => e.id !== emp.id)
        : [...prev, emp]
    );
  };

  const handlePush = async () => {
    if (!form.title.trim() || !form.thrustArea.trim() || !form.target.toString().trim()) {
      toast('Fill in all required fields.', 'warn'); return;
    }
    if (selectedEmployees.length === 0) {
      toast('Select at least one employee to assign.', 'warn'); return;
    }
    setPushing(true);
    try {
      await axios.post(`${SG_API_BASE}/push`, {
        ...form,
        createdBy: adminId,
        createdByName: adminName,
        assignees: selectedEmployees.map(e => ({ employeeId: e.id, employeeName: e.name }))
      });
      toast(`Shared goal pushed to ${selectedEmployees.length} employee(s).`, 'success');
      setForm({ title: '', description: '', thrustArea: '', uom: '%', target: '', cycleYear: new Date().getFullYear().toString() });
      setSelectedEmployees([]);
      setShowForm(false);
      onRefresh();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to push shared goal.', 'error');
    } finally {
      setPushing(false);
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm('Delete this shared goal? All employee assignments will be removed.')) return;
    try {
      await axios.delete(`${SG_API_BASE}/${goalId}`);
      toast('Shared goal deleted.', 'success');
      onRefresh();
    } catch {
      toast('Failed to delete shared goal.', 'error');
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent flex justify-between items-start">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-2">
            🌐 Organisation-Wide KPIs
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">Shared Goals Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">Push KPIs to employees across the organisation.</p>
        </div>
        <button onClick={() => setShowForm(f => !f)}
          className={`text-[10px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all cursor-pointer border ${
            showForm
              ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              : 'bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 border-transparent text-white shadow-md shadow-fuchsia-500/20'
          }`}>
          {showForm ? '✕ Cancel' : '➕ Push New KPI'}
        </button>
      </div>

      {/* Push Form */}
      {showForm && (
        <div className="p-6 border-b border-slate-800/60 bg-slate-950/30">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Thrust Area *</label>
              <input type="text" placeholder="e.g. Revenue Growth"
                value={form.thrustArea}
                onChange={e => setForm(f => ({ ...f, thrustArea: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-700 focus:border-fuchsia-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Goal Title *</label>
              <input type="text" placeholder="e.g. Q2 Customer Satisfaction Score"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-700 focus:border-fuchsia-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
              <input type="text" placeholder="Optional details"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-700 focus:border-fuchsia-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cycle Year *</label>
              <input type="text" placeholder="e.g. 2025"
                value={form.cycleYear}
                onChange={e => setForm(f => ({ ...f, cycleYear: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-700 focus:border-fuchsia-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unit of Measure *</label>
              <select value={form.uom} onChange={e => setForm(f => ({ ...f, uom: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-300 focus:border-fuchsia-500 outline-none cursor-pointer transition-all">
                {UOM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Value *</label>
              <input type="text" placeholder="e.g. 4.5"
                value={form.target}
                onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-700 font-mono focus:border-fuchsia-500 outline-none transition-all" />
            </div>
          </div>

          {/* Employee Selector */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assign To *</label>
            <div className="flex flex-wrap gap-2">
              {KNOWN_EMPLOYEES.map(emp => {
                const selected = !!selectedEmployees.find(e => e.id === emp.id);
                return (
                  <button key={emp.id} onClick={() => toggleEmployee(emp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selected
                        ? 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-fuchsia-500/30 hover:text-fuchsia-400'
                    }`}>
                    {selected ? '✓ ' : ''}{emp.name} <span className="font-mono opacity-60">({emp.id})</span>
                  </button>
                );
              })}
            </div>
            {selectedEmployees.length > 0 && (
              <p className="text-[10px] text-fuchsia-400 mt-1.5">
                {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button onClick={handlePush} disabled={pushing}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-xs tracking-wide uppercase shadow-lg shadow-fuchsia-500/20 transition-all active:scale-95 cursor-pointer">
              🚀 {pushing ? 'Pushing…' : 'Push KPI to Employees'}
            </button>
          </div>
        </div>
      )}

      {/* Existing Shared Goals List */}
      <div className="p-6">
        {sharedGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
            <div className="text-3xl mb-3">🌐</div>
            <p className="text-sm font-bold text-slate-400 mb-1">No shared goals yet</p>
            <p className="text-xs text-slate-600">Use the "Push New KPI" button to assign organisation-wide goals.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sharedGoals.map(sg => (
              <div key={sg._id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider">{sg.thrustArea}</span>
                    <h3 className="font-bold text-white text-sm mt-0.5">{sg.title}</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Cycle: {sg.cycleYear} • UoM: {sg.uom} • Target: {sg.target} • Pushed by: {sg.createdByName}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(sg._id)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                    🗑️ Delete
                  </button>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                        <th className="p-2.5">Employee</th>
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
                            <td className="p-2.5">
                              <div className="font-semibold text-slate-300">{a.employeeName}</div>
                              <div className="text-[10px] font-mono text-slate-600">{a.employeeId}</div>
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-300">
                              {a.actualAchievement !== null && a.actualAchievement !== undefined && a.actualAchievement !== ''
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
                              {a.lastUpdated ? new Date(a.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
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
        )}
      </div>
    </div>
  );
}
