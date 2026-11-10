import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

/**
 * Pointer-driven 3D tilt with a moving glare highlight.
 * Children can opt into depth with `style={{ transform: 'translateZ(40px)' }}`.
 */
export default function TiltCard({ max = 10, className = '', children, ...props }) {
  const ref = useRef(null)
  const enabled = useMediaQuery('(pointer: fine) and (prefers-reduced-motion: no-preference)')
  const rx = useSpring(0, { stiffness: 160, damping: 18 })
  const ry = useSpring(0, { stiffness: 160, damping: 18 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgba(255,255,255,0.10), transparent 45%)`

  const onMove = (e) => {
    if (!enabled) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set(-(py - 0.5) * max * 2)
    gx.set(px * 100)
    gy.set(py * 100)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100, transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
      {...props}
    >
      {children}
      {enabled && <motion.span aria-hidden className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: glare }} />}
    </motion.div>
  )
}
