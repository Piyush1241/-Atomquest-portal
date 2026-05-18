// src/components/charts/BarChart.jsx
const barColor = (s) => s >= 90 ? '#10b981' : s >= 70 ? '#f59e0b' : '#f43f5e';

export function BarChart({ data, width = 220, height = 110 }) {
  const padL = 24, padB = 22, padT = 6, padR = 6;
  const chartW = width  - padL - padR;
  const chartH = height - padT - padB;
  const barW   = Math.min(32, (chartW / data.length) - 6);

  return (
    <svg width={width} height={height}>
      {[0, 25, 50, 75, 100].map(v => {
        const y = padT + chartH - (v / 100) * chartH;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#1e293b" strokeWidth={1} />
            <text x={padL - 3} y={y + 3} textAnchor="end" fontSize={8} fill="#475569">{v}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x    = padL + (chartW / data.length) * i + (chartW / data.length - barW) / 2;
        const barH = (d.score / 100) * chartH;
        const y    = padT + chartH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill={barColor(d.score)} rx={3} />
            <text x={x + barW / 2} y={height - padB + 12} textAnchor="middle" fontSize={8} fill="#64748b">
              {d.name.length > 7 ? `${d.name.slice(0, 7)}…` : d.name}
            </text>
            <text x={x + barW / 2} y={y - 2} textAnchor="middle" fontSize={8} fill={barColor(d.score)} fontWeight="bold">
              {d.score}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
