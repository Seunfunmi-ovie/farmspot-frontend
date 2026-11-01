// Decorative agriculture artwork, drawn in SVG so it carries no image files.

function Stalk({ x, height, lean }) {
  const top = 160 - height
  const grains = Array.from({ length: 7 }, (_, i) => top + 8 + i * 11)
  return (
    <g transform={`rotate(${lean} ${x} 160)`}>
      <line x1={x} y1={160} x2={x} y2={top} stroke="currentColor" strokeWidth="1.8" />
      {grains.map(y => (
        <g key={y}>
          <ellipse cx={x - 6} cy={y} rx="3.4" ry="8" transform={`rotate(-28 ${x - 6} ${y})`} fill="currentColor" />
          <ellipse cx={x + 6} cy={y} rx="3.4" ry="8" transform={`rotate(28 ${x + 6} ${y})`} fill="currentColor" />
        </g>
      ))}
      <ellipse cx={x} cy={top - 6} rx="3" ry="9" fill="currentColor" />
    </g>
  )
}

export function WheatField({ className }) {
  return (
    <svg className={className} viewBox="0 0 230 160" fill="none" aria-hidden="true">
      <Stalk x={40} height={110} lean={-6} />
      <Stalk x={85} height={140} lean={2} />
      <Stalk x={130} height={120} lean={-3} />
      <Stalk x={175} height={148} lean={5} />
      <Stalk x={215} height={100} lean={8} />
    </svg>
  )
}

const HILL_1 = 'M0 112 C 110 78, 240 104, 360 86 S 540 74, 600 90 L600 200 L0 200 Z'
const HILL_2 = 'M0 138 C 130 108, 250 134, 380 116 S 540 108, 600 120 L600 200 L0 200 Z'
const HILL_3 = 'M0 164 C 140 142, 260 160, 400 148 S 540 144, 600 152 L600 200 L0 200 Z'

function Furrows({ d, rows, gap, color }) {
  return (
    <g fill="none" stroke={color} strokeWidth="1" opacity="0.55">
      {Array.from({ length: rows }, (_, i) => (
        <path key={i} d={d.replace(/ L600 200 L0 200 Z/, '')} transform={`translate(0 ${(i + 1) * gap})`} />
      ))}
    </g>
  )
}

// Morning sun over green, ploughed fields.
export function FieldBanner({ className }) {
  return (
    <svg className={className} viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#096B32" />
          <stop offset="1" stopColor="#2BA55C" />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD27A" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FFD27A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="200" fill="url(#sky)" />
      <circle cx="392" cy="70" r="84" fill="url(#sun)" />
      <circle cx="392" cy="70" r="25" fill="#FFD27A" />
      <path d={HILL_1} fill="#3DB871" />
      <Furrows d={HILL_1} rows={5} gap={9} color="#7FDBA5" />
      <path d={HILL_2} fill="#2A9E5C" />
      <Furrows d={HILL_2} rows={4} gap={9} color="#5CC888" />
      <path d={HILL_3} fill="#17803F" />
      <Furrows d={HILL_3} rows={3} gap={8} color="#3FA865" />
    </svg>
  )
}

export function LogoMark({ className = 'w-9 h-9' }) {
  return (
    <span className={'inline-flex items-center justify-center rounded-xl bg-field text-white ' + className}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3 L12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 5 Q9 6 8 8 Q10 8 12 7Z" fill="currentColor" />
        <path d="M12 5 Q15 6 16 8 Q14 8 12 7Z" fill="currentColor" />
        <path d="M12 9 Q9 10 8 12 Q10 12 12 11Z" fill="currentColor" />
        <path d="M12 9 Q15 10 16 12 Q14 12 12 11Z" fill="currentColor" />
        <path d="M12 13 Q9 14 8 16 Q10 16 12 15Z" fill="currentColor" />
        <path d="M12 13 Q15 14 16 16 Q14 16 12 15Z" fill="currentColor" />
      </svg>
    </span>
  )
}

export function Avatar({ name = '?', size = 'w-11 h-11 text-base' }) {
  return (
    <span className={'inline-flex shrink-0 items-center justify-center rounded-full bg-field-soft text-field-deep font-bold ' + size}>
      {(name.trim()[0] || '?').toUpperCase()}
    </span>
  )
}