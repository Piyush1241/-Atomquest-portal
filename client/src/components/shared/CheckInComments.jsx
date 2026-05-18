// src/components/shared/CheckInComments.jsx
import { safeComments } from '../../utils/comments';
import { QUARTERS } from '../../config/constants';

export function CheckInComments({ raw, label = 'Check-in Comments' }) {
  const comments = safeComments(raw);
  if (Object.keys(comments).length === 0) return null;

  return (
    <div className="px-6 pb-4 border-t border-slate-800/60 pt-3">
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {QUARTERS.map(q => comments[q] ? (
          <div key={q} className="bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 max-w-xs">
            <span className="text-[9px] font-bold text-indigo-400 uppercase">{q}: </span>
            <span className="text-[10px] text-slate-400">{comments[q]}</span>
          </div>
        ) : null)}
      </div>
    </div>
  );
}
