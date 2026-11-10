import { motion, useReducedMotion } from 'motion/react'

const faces = [
  'rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)',
]

/** Slowly turning CSS-3D cube carrying a service icon on every face. */
export default function IconCube({ icon: Icon, size = 220, accent = true }) {
  const reduce = useReducedMotion()
  const half = size / 2
  return (
    <div className="grid place-items-center [perspective:1000px]" style={{ height: size * 1.8 }} aria-hidden>
      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{ width: size, height: size }}
        initial={{ rotateX: -22, rotateY: 30 }}
        animate={reduce ? undefined : { rotateY: [30, 390], rotateX: [-22, -22] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
      >
        {faces.map((f, i) => (
          <div
            key={f}
            className={`absolute inset-0 grid place-items-center border ${accent ? 'border-accent/40' : 'border-bone/30'} ${i === 0 ? 'bg-graphite/95' : 'bg-coal/90'}`}
            style={{ transform: `${f} translateZ(${half}px)` }}
          >
            <div className="bg-grid absolute inset-0" />
            <Icon className={`relative h-1/3 w-1/3 ${accent ? 'text-accent' : 'text-bone'}`} strokeWidth={1.2} />
          </div>
        ))}
      </motion.div>
      <div className={`-mt-6 h-6 rounded-[50%] blur-xl ${accent ? 'bg-accent/25' : 'bg-bone/15'}`} style={{ width: size * 1.1 }} />
    </div>
  )
}
