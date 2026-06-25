'use client'

export function RiskGauge({ score, verdict }: { score: number; verdict: 'SAFE' | 'CAUTION' | 'AVOID' | null }) {
  const r = 52
  const circ = Math.PI * r // half circle
  const pct = Math.min(100, Math.max(0, score)) / 100
  const dash = circ * pct

  const color = !verdict
    ? '#6b5e90'
    : verdict === 'SAFE'
      ? '#b4ff2e'
      : verdict === 'CAUTION'
        ? '#ffae3a'
        : '#ff2d6b'

  return (
    <div className="relative flex flex-col items-center">
      <svg width="140" height="84" viewBox="0 0 140 84">
        <path d="M 14 76 A 56 56 0 0 1 126 76" fill="none" stroke="#221638" strokeWidth="8" strokeLinecap="round" />
        <path
          d="M 14 76 A 56 56 0 0 1 126 76"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter: `drop-shadow(0 0 6px ${color}aa)`, transition: 'stroke-dasharray 0.6s ease, stroke 0.4s' }}
        />
      </svg>
      <div className="-mt-10 text-center">
        <div className="font-mono text-3xl font-bold" style={{ color }}>
          {String(score).padStart(2, '0')}
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint">Risk Index</div>
      </div>
    </div>
  )
}
