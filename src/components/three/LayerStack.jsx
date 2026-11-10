import { motion, useTransform } from 'motion/react'

/**
 * Isometric stack of planes — one per process step — that separates with scroll.
 * `progress` is a 0→1 MotionValue; `active` highlights the current layer.
 */
export default function LayerStack({ steps, progress, active }) {
  const gap = useTransform(progress, [0, 1], [18, 70])
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] [perspective:1600px]" aria-hidden>
      <div className="absolute inset-[18%] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-42deg)]">
        {steps.map((s, i) => (
          <Layer key={s.k} index={i} total={steps.length} gap={gap} label={s.k} title={s.title} on={active === i} />
        ))}
      </div>
    </div>
  )
}

function Layer({ index, total, gap, label, title, on }) {
  const z = useTransform(gap, (g) => (total - 1 - index) * g)
  return (
    <motion.div
      className={`absolute inset-0 rounded-2xl border transition-colors duration-500 ${on ? 'border-accent bg-accent/[0.12]' : 'border-bone/15 bg-graphite/70'}`}
      style={{ translateZ: z, boxShadow: on ? '0 0 60px rgba(77,141,255,0.18)' : '0 30px 60px rgba(0,0,0,0.45)' }}
    >
      <div className="bg-grid absolute inset-0 opacity-60" />
      <span className={`label absolute left-4 top-4 ${on ? 'text-accent' : 'text-mute'}`}>{label}</span>
      <span className={`display absolute bottom-4 right-4 text-3xl ${on ? 'text-bone' : 'text-bone/25'}`}>{title}</span>
    </motion.div>
  )
}
