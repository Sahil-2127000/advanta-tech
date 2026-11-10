import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import SectionLabel from '../ui/SectionLabel'
import RevealText from '../ui/RevealText'
import LayerStack from '../three/LayerStack'
import { TextLink } from '../ui/Button'
import { process } from '../../data/content'
import { easeOut } from '../../lib/motion'
import { useRichMotion } from '../../hooks/useMediaQuery'

function Steps({ active }) {
  return (
    <ol className="mt-12 border-t border-line">
      {process.map((s, i) => (
        <li key={s.k} className="border-b border-line py-6">
          <div className="flex items-baseline gap-5">
            <span className={`label transition-colors ${active === i ? 'text-accent' : 'text-mute'}`}>{s.k}</span>
            <h3 className={`display text-4xl transition-colors duration-500 sm:text-5xl ${active === i || active === undefined ? 'text-bone' : 'text-bone/25'}`}>{s.title}</h3>
          </div>
          <motion.p
            className="overflow-hidden pl-11 text-bone/60"
            initial={false}
            animate={active === undefined || active === i ? { height: 'auto', opacity: 1, marginTop: 12 } : { height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            {s.text}
          </motion.p>
        </li>
      ))}
    </ol>
  )
}

/** Desktop: pinned section where scrolling steps through the process and separates the 3D layers. */
export default function ProcessPinned() {
  const ref = useRef(null)
  const rich = useRichMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(process.length - 1, Math.floor(v * process.length))))

  const header = (
    <>
      <SectionLabel index="04">How we work</SectionLabel>
      <RevealText text={'Four steps.\nZero *guesswork.*'} className="display mt-8 text-[length:var(--text-h2)]" />
    </>
  )

  if (!rich) {
    return (
      <section ref={ref} className="border-t border-line py-24">
        <div className="container-x">
          {header}
          <Steps />
          <TextLink to="/process" className="mt-10">Our full process</TextLink>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[320vh] border-t border-line">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            {header}
            <Steps active={active} />
            <TextLink to="/process" className="mt-8">Our full process</TextLink>
          </div>
          <LayerStack steps={process} progress={scrollYProgress} active={active} />
        </div>
      </div>
    </section>
  )
}
