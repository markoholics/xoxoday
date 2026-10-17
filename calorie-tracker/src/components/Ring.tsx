export default function Ring({ value, target }: { value: number; target: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const pct = target > 0 ? Math.min(value / target, 1) : 0;
  const over = value > target;
  return (
    <svg viewBox="0 0 180 180" className="ring" role="img" aria-label={`${value} of ${target} calories`}>
      <circle cx="90" cy="90" r={r} className="ring-track" />
      <circle
        cx="90"
        cy="90"
        r={r}
        className={`ring-bar${over ? " over" : ""}`}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform="rotate(-90 90 90)"
      />
      <text x="90" y="88" textAnchor="middle" className="ring-num">
        {value}
      </text>
      <text x="90" y="110" textAnchor="middle" className="ring-sub">
        of {target} kcal
      </text>
    </svg>
  );
}
