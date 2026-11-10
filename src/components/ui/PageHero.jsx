import { motion } from 'motion/react'
import RevealText from './RevealText'
import Scene3D from '../three/Scene3D'
import { easeOut } from '../../lib/motion'

/** Editorial hero for inner pages, optionally paired with the 3D core. */
export default function PageHero({ label, index = '00', title, intro, scene, children }) {
  return (
    <section className="bg-grid relative overflow-hidden border-b border-line pt-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      {scene && (
        <motion.div className="absolute bottom-0 right-[-8%] top-20 hidden w-[52%] lg:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 0.3 }}>
          <Scene3D className="h-full w-full" {...scene} />
        </motion.div>
      )}
      <div className="container-x relative pb-14 sm:pb-20">
        <motion.div className="label mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-mute sm:mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          <span className="text-accent">[{index}]</span>
          <span>{label}</span>
          <span className="hidden h-px w-24 bg-line sm:block" />
          <span className="hidden sm:block">Advanta Tech</span>
        </motion.div>
        <RevealText as="h1" text={title} onMount delay={0.15} className="display max-w-[15ch] text-[length:var(--text-h1)]" />
        {(intro || children) && (
          <motion.div className="mt-10 max-w-xl space-y-8 sm:mt-12" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: easeOut, delay: 0.7 }}>
            {intro && <p className="text-lg leading-relaxed text-bone/70">{intro}</p>}
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}
