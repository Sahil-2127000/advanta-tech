import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { byPractice, services } from '../../data/services'
import { useRichMotion } from '../../hooks/useMediaQuery'

/** One ring of service labels wrapped around a vertical axis. */
function Ring({ items, rotate, y, accent }) {
  const step = 360 / items.length
  return (
    <motion.ul className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]" style={{ y, rotateX: -10, rotateY: rotate }}>
      {items.map((s, i) => (
        <li
          key={s.slug}
          className="absolute -translate-x-1/2 -translate-y-1/2 [backface-visibility:hidden]"
          style={{ transform: `rotateY(${i * step}deg) translateZ(min(36vw, 540px))` }}
        >
          <Link
            to={`/services/${s.slug}`}
            className="group flex items-center gap-2.5 whitespace-nowrap border border-line bg-coal/90 px-4 py-2.5 transition-colors duration-300 hover:border-volt"
          >
            <s.icon className={`h-4 w-4 ${accent ? 'text-volt' : 'text-bone'}`} aria-hidden />
            <span className="display text-lg transition-colors group-hover:text-volt">{s.short}</span>
          </Link>
        </li>
      ))}
    </motion.ul>
  )
}

/** Growth and Quality services on two counter-rotating 3D rings driven by scroll. */
export default function ServiceCylinder() {
  const ref = useRef(null)
  const rich = useRichMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const spin = useTransform(scrollYProgress, [0, 1], [30, -300])
  const growthRotate = useSpring(spin, { stiffness: 60, damping: 20 })
  const qualityRotate = useSpring(useTransform(spin, (v) => -v * 0.6 + 36), { stiffness: 60, damping: 20 })

  if (!rich) {
    return (
      <ul ref={ref} className="grid gap-px border-y border-line bg-line">
        {services.map((s) => (
          <li key={s.slug} className="bg-ink">
            <Link to={`/services/${s.slug}`} className="flex items-center justify-between gap-4 px-1 py-4">
              <span className="display text-2xl">{s.short}</span>
              <span className={`label ${s.practice === 'growth' ? 'text-volt' : 'text-bone/60'}`}>{s.practice}</span>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div ref={ref} className="relative h-[420px] [perspective:1400px]" aria-label="Service list">
      <Ring items={byPractice('growth')} rotate={growthRotate} y={-60} accent />
      <Ring items={byPractice('quality')} rotate={qualityRotate} y={70} />
      <p className="label absolute left-0 top-[34%] text-volt">Growth ↻</p>
      <p className="label absolute right-0 top-[64%] text-bone/60">Quality ↺</p>
    </div>
  )
}
