import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const ease = [0.16, 1, 0.3, 1]

/** What the pointer is over: plain page, an interactive element, a text field, or an element with a custom label. */
function modeFor(target) {
  if (!target?.closest) return { kind: 'default' }
  if (target.closest('input:not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]')) return { kind: 'text' }
  const labelled = target.closest('[data-cursor]')
  if (labelled) return { kind: 'label', label: labelled.getAttribute('data-cursor') }
  if (target.closest('a, button, select, label, [role="button"]')) return { kind: 'link' }
  return { kind: 'default' }
}

/**
 * Desktop-only cursor: a crisp glowing dot that tracks the pointer, plus a soft logo-blue
 * spotlight trailing behind it. Over links the dot opens into a frosted blue disc with an arrow;
 * elements with `data-cursor="View"` show that word instead. Text fields keep the native caret.
 */
export default function Cursor() {
  const enabled = useMediaQuery('(pointer: fine) and (prefers-reduced-motion: no-preference)')
  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const discX = useSpring(x, { stiffness: 900, damping: 50, mass: 0.3 })
  const discY = useSpring(y, { stiffness: 900, damping: 50, mass: 0.3 })
  const glowX = useSpring(x, { stiffness: 90, damping: 22, mass: 0.8 })
  const glowY = useSpring(y, { stiffness: 90, damping: 22, mass: 0.8 })
  const [mode, setMode] = useState({ kind: 'default' })
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('custom-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const next = modeFor(e.target)
      setMode((m) => (m.kind === next.kind && m.label === next.label ? m : next))
    }
    const leave = () => setVisible(false)
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    root.addEventListener('pointerleave', leave)
    return () => {
      root.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      root.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const active = mode.kind === 'link' || mode.kind === 'label'
  const size = mode.kind === 'label' ? 84 : active ? 54 : 8

  return (
    <>
      {/* Trailing spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[1] h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(77,141,255,0.12),rgba(4,85,192,0.05)_40%,transparent_70%)]"
        style={{ x: glowX, y: glowY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0, scale: active ? 0.7 : 1 }}
        transition={{ duration: 0.6, ease }}
      />
      {/* Dot that opens into a disc */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] grid place-items-center rounded-full border backdrop-blur-md"
        style={{ x: discX, y: discY, translateX: '-50%', translateY: '-50%' }}
        initial={false}
        animate={{
          width: size,
          height: size,
          opacity: visible && mode.kind !== 'text' ? 1 : 0,
          scale: pressed ? 0.82 : 1,
          backgroundColor: active ? 'rgba(4,85,192,0.6)' : 'rgba(233,239,249,1)',
          borderColor: active ? 'rgba(169,203,255,0.45)' : 'rgba(233,239,249,0)',
          boxShadow: active ? '0 12px 40px -10px rgba(77,141,255,0.85)' : '0 0 14px 1px rgba(169,203,255,0.75)',
        }}
        transition={{ duration: 0.45, ease }}
      >
        <AnimatePresence mode="wait">
          {mode.kind === 'link' && (
            <motion.span
              key="arrow"
              className="text-white"
              initial={{ opacity: 0, scale: 0.4, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.35, ease }}
            >
              <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
            </motion.span>
          )}
          {mode.kind === 'label' && (
            <motion.span
              key={mode.label}
              className="text-[0.8rem] font-medium tracking-tight text-white"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
            >
              {mode.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
