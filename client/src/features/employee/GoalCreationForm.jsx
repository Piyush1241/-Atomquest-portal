// src/features/employee/GoalCreationForm.jsx
// Phase 1 — Employee creates and submits their goal sheet.
import { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../config/api';
import { UOM_OPTIONS, BLANK_GOAL } from '../../config/constants';

export function GoalCreationForm({ employeeId, employeeName, managerId, toast }) {
  const [goals,    setGoals]    = useState([{ ...BLANK_GOAL }]);
  const [feedback, setFeedback] = useState('');

  const addGoalRow = () => {
    if (goals.length >= 8) { toast('Maximum 8 goals allowed.', 'warn'); return; }
    setGoals(prev => [...prev, { ...BLANK_GOAL }]);
  };

  const handleChange = (index, field, value) => {
    setGoals(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === 'weightage' ? (parseInt(value, 10) || 0) : value,
      };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    try {
      const sanitized = goals.map(g => ({
        thrustArea:  g.thrustArea,
        title:       g.title,
        description: g.description || '',
        uom:         g.uom || '%',
        target:      g.target,
        weightage:   Number(g.weightage) || 0,
      }));
      const res = await axios.post(`${API_BASE}/submit`, {
        employeeId, employeeName, managerId, goals: sanitized,
      });
      setFeedback(`Success: ${res.data.message}`);
      setGoals([{ ...BLANK_GOAL }]);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      setFeedback(`Error: ${msg || 'Failed to establish validation pipeline contact.'}`);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
      <div className="p-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
          Phase 1 — KRA Allocation
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight">Create &amp; Configure Goal Sheet</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Define your performance targets. Weightages must sum to exactly{' '}
          <span className="font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/10">100%</span>.
        </p>
      </div>

      {feedback && (
        <div className="mx-8 mt-6">
          <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 border ${
            feedback.startsWith('Error')
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <span className="text-lg">{feedback.startsWith('Error') ? '❌' : '✨'}</span>
            <span>{feedback}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8">
        <div className="overflow-hidden border border-slate-800 rounded-xl shadow-inner bg-slate-950/40 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <th className="p-4 w-1/4">Thrust Area</th>
                <th className="p-4 w-1/3">Goal Metric &amp; Deliverable</th>
                <th className="p-4 w-1/6">UoM</th>
                <th className="p-4 w-1/6">Target Value</th>
                <th className="p-4 w-1/12 text-center">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {goals.map((goal, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20 transition-colors duration-150">
                  <td className="p-3 align-top">
                    <input required type="text" placeholder="e.g., Cloud Security"
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-sm bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
                      value={goal.thrustArea} onChange={e => handleChange(idx, 'thrustArea', e.target.value)} />
                  </td>
                  <td className="p-3 align-top">
                    <input required type="text" placeholder="Goal Title"
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-sm font-medium bg-slate-950/50 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none mb-2"
                      value={goal.title} onChange={e => handleChange(idx, 'title', e.target.value)} />
                    <textarea rows="1" placeholder="Add operational details..."
                      className="w-full px-3 py-1.5 border border-slate-800 rounded-lg text-xs bg-slate-950/30 text-slate-400 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none resize-none"
                      value={goal.description} onChange={e => handleChange(idx, 'description', e.target.value)} />
                  </td>
                  <td className="p-3 align-top">
                    <select className="w-full px-3 py-2 border border-slate-800 rounded-lg text-sm bg-slate-950/50 text-slate-300 focus:border-indigo-500 transition-all outline-none cursor-pointer"
                      value={goal.uom} onChange={e => handleChange(idx, 'uom', e.target.value)}>
                      {UOM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                  <td className="p-3 align-top">
                    <input required type="text" placeholder="e.g., 99.95"
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-sm bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none font-mono"
                      value={goal.target} onChange={e => handleChange(idx, 'target', e.target.value)} />
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex items-center justify-center gap-1.5 bg-slate-950/80 px-2 py-2 rounded-lg border border-slate-800">
                      <input required type="number" min="10" max="100"
                        className="w-12 bg-transparent text-center text-sm font-bold text-indigo-400 font-mono outline-none"
                        value={goal.weightage} onChange={e => handleChange(idx, 'weightage', e.target.value)} />
                      <span className="text-xs font-bold text-slate-600">%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-800/60">
          <button type="button" onClick={addGoalRow}
            className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs tracking-wide uppercase transition-all active:scale-95 cursor-pointer border border-slate-700/50">
            ➕ Append Target Node
          </button>
          <button type="submit"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs tracking-wide uppercase shadow-lg shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer">
            🚀 Deploy Allocation Sheet
          </button>
        </div>
      </form>
    </div>
  );
}
