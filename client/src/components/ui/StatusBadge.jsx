// src/components/ui/StatusBadge.jsx
// Reusable goal-status pill used across Employee, Manager, and Admin views.

export function StatusBadge({ status }) {
  const style =
    status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : status === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-slate-500 bg-slate-800 border-slate-700';

  return (
    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${style}`}>
      {status || 'Not Started'}
    </span>
  );
}
