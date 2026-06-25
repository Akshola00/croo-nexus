export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nxLine" x1="24" y1="24" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#b4ff2e" />
        </linearGradient>
        <filter id="nxGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <line x1="24" y1="24" x2="24" y2="7" stroke="url(#nxLine)" strokeWidth="1.6" />
      <line x1="24" y1="24" x2="40" y2="35" stroke="url(#nxLine)" strokeWidth="1.6" />
      <line x1="24" y1="24" x2="8" y2="35" stroke="url(#nxLine)" strokeWidth="1.6" />

      <Hex cx={24} cy={7} r={3.6} fill="#06030d" stroke="#b4ff2e" sw={1.4} />
      <Hex cx={40} cy={35} r={3.6} fill="#06030d" stroke="#a855f7" sw={1.4} />
      <Hex cx={8} cy={35} r={3.6} fill="#06030d" stroke="#a855f7" sw={1.4} />

      <g filter="url(#nxGlow)">
        <Hex cx={24} cy={24} r={6.5} fill="#a855f7" />
        <Hex cx={24} cy={24} r={3} fill="#c77dff" />
      </g>
    </svg>
  )
}

function Hex({ cx, cy, r, fill, stroke, sw }: { cx: number; cy: number; r: number; fill: string; stroke?: string; sw?: number }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
  }).join(' ')
  return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />
}
