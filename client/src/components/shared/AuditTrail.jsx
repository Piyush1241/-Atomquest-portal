// src/components/shared/AuditTrail.jsx
// Rendered inside both the Manager and Admin sheet cards.

export function AuditTrail({ entries = [] }) {
  if (!entries.length) return null;

  return (
    <div className="px-6 pb-4 border-t border-slate-800/60 pt-3">
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">🔍 Audit Trail</p>
      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {[...entries].reverse().map((entry, i) => {
          const roleColor =
            entry.actorRole === 'Admin'    ? 'text-rose-400'
            : entry.actorRole === 'Manager' ? 'text-amber-400'
            : 'text-indigo-400';

          return (
            <div key={i} className="flex items-start gap-3 text-[10px] bg-slate-950/40 border border-slate-800/60 rounded-lg px-3 py-2">
              <span className={`font-bold flex-shrink-0 ${roleColor}`}>{entry.actorRole}</span>
              <span className="text-slate-300 font-medium flex-shrink-0">{entry.actorName}</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400 font-medium">{entry.action}</span>
              {entry.details && <span className="text-slate-600 italic truncate">{entry.details}</span>}
              <span className="ml-auto text-slate-700 flex-shrink-0 font-mono">
                {new Date(entry.timestamp).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
