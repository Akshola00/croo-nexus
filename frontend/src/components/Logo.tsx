export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nexusLine" x1="24" y1="24" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6d5aff" />
          <stop offset="1" stopColor="#9d7bff" />
        </linearGradient>
        <filter id="nexusGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* connection lines */}
      <line x1="24" y1="24" x2="24" y2="6" stroke="url(#nexusLine)" strokeWidth="2" />
      <line x1="24" y1="24" x2="40" y2="36" stroke="url(#nexusLine)" strokeWidth="2" />
      <line x1="24" y1="24" x2="8" y2="36" stroke="url(#nexusLine)" strokeWidth="2" />

      {/* outer nodes */}
      <Hexagon cx={24} cy={6} r={4} fill="none" stroke="#9d7bff" strokeWidth={1.5} />
      <Hexagon cx={40} cy={36} r={4} fill="none" stroke="#9d7bff" strokeWidth={1.5} />
      <Hexagon cx={8} cy={36} r={4} fill="none" stroke="#9d7bff" strokeWidth={1.5} />

      {/* center node */}
      <g filter="url(#nexusGlow)">
        <Hexagon cx={24} cy={24} r={7} fill="#6d5aff" />
      </g>
    </svg>
  )
}

function Hexagon({
  cx,
  cy,
  r,
  fill,
  stroke,
  strokeWidth,
}: {
  cx: number
  cy: number
  r: number
  fill: string
  stroke?: string
  strokeWidth?: number
}) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')

  return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
}
