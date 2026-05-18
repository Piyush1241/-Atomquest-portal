// src/components/ui/ScoreBadge.jsx
export function ScoreBadge({ score }) {
  if (score === null) return <span className="text-slate-600 text-[10px]">—</span>;

  const color = score >= 90
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : score >= 70
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${color}`}>
      {score}%
    </span>
  );
}
