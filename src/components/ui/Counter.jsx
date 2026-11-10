import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

/** Number that counts up once when scrolled into view. */
export default function Counter({ value, suffix = '', duration = 2.2, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, value, duration, reduce])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {(reduce && inView ? value : n).toLocaleString('en-US')}
      {suffix}
    </span>
  )
}
