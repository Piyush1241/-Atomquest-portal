// src/components/ui/Toast.jsx
export function Toast({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium backdrop-blur-xl
            transition-all duration-300 pointer-events-auto
            ${t.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
            : t.type === 'error'   ? 'bg-rose-950/90 border-rose-500/30 text-rose-300'
            : t.type === 'warn'    ? 'bg-amber-950/90 border-amber-500/30 text-amber-300'
            : 'bg-slate-900/90 border-slate-700 text-slate-300'}`}>
          <span className="text-base flex-shrink-0">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warn' ? '⚠️' : 'ℹ️'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
