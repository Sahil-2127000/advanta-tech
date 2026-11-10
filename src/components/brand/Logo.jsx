import { MARK_DOT, MARK_H, MARK_SHAPES, MARK_W } from './logoMark'

const poly = (pts) => 'M' + pts.map((p) => p.join(' ')).join('L') + 'Z'

/**
 * The Advanta Tech mark as crisp SVG. The "i" dot is a separate element so it can be animated.
 * `tile` renders it inside the logo-blue rounded square.
 */
export default function LogoMark({ className = '', tile = false, dotClassName = '' }) {
  const [cx, cy, r] = MARK_DOT
  const mark = (
    <svg viewBox={`0 0 ${MARK_W} ${MARK_H}`} className={tile ? 'h-[58%] w-[58%]' : className} aria-hidden fill="currentColor">
      {MARK_SHAPES.map((s, i) => <path key={i} d={poly(s)} />)}
      <circle cx={cx} cy={cy} r={r} className={dotClassName} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    </svg>
  )
  if (!tile) return mark
  return (
    <span className={`relative grid place-items-center overflow-hidden rounded-[28%] bg-brand text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_-8px_rgba(4,85,192,0.9)] ${className}`}>
      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.22),transparent_45%)]" />
      {mark}
    </span>
  )
}
