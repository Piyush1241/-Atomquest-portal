// src/components/charts/DonutChart.jsx
export function DonutChart({ data, size = 110, innerR = 28, outerR = 44 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const cx = size / 2;
  const cy = size / 2;

  const slices = data.reduce((acc, d, i) => {
    let angle = -Math.PI / 2 + data
      .slice(0, i)
      .reduce((sum, prev) => sum + (prev.value / total) * 2 * Math.PI * 0.97 + 0.03, 0);

    const sweep = (d.value / total) * 2 * Math.PI * 0.97;
    const x1  = cx + outerR * Math.cos(angle);
    const y1  = cy + outerR * Math.sin(angle);
    angle += sweep;
    const x2  = cx + outerR * Math.cos(angle);
    const y2  = cy + outerR * Math.sin(angle);
    const ix1 = cx + innerR * Math.cos(angle);
    const iy1 = cy + innerR * Math.sin(angle);
    angle -= sweep;
    const ix2 = cx + innerR * Math.cos(angle);
    const iy2 = cy + innerR * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;

    return [
      ...acc,
      {
        path: `M${x1},${y1} A${outerR},${outerR},0,${large},1,${x2},${y2} L${ix1},${iy1} A${innerR},${innerR},0,${large},0,${ix2},${iy2} Z`,
        color: d.color,
      },
    ];
  }, []);

  return (
    <svg width={size} height={size}>
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
    </svg>
  );
}
