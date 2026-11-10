import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Button from '../ui/Button'
import RevealText from '../ui/RevealText'
import Scene3D from '../three/Scene3D'
import { easeOut } from '../../lib/motion'
import { useRichMotion } from '../../hooks/useMediaQuery'

const fade = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: easeOut, delay },
})

export default function Hero() {
  const ref = useRef(null)
  const rich = useRichMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} className="relative isolate flex min-h-svh items-end overflow-hidden pt-28 sm:pt-32">
      {/* Ambient: fading grid + slow logo-blue aurora */}
      <div aria-hidden className="bg-grid bg-grid-fade absolute inset-0 -z-20" />
      <div aria-hidden className="aurora-a absolute -right-[10%] top-[5%] -z-20 h-[70vh] w-[60vw] rounded-full bg-brand/35 blur-[120px]" />
      <div aria-hidden className="aurora-b absolute -left-[15%] bottom-[-10%] -z-20 h-[50vh] w-[50vw] rounded-full bg-accent/15 blur-[120px]" />
      {/* 3D core */}
      <motion.div
        className="absolute inset-x-0 top-[6%] -z-10 h-[62%] md:inset-y-0 md:left-[40%] md:right-[-4%] md:top-0 md:h-auto"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: easeOut, delay: 0.2 }}
      >
        <Scene3D className="h-full w-full" progress={scrollYProgress} shape="logo" />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/30 to-transparent md:bg-gradient-to-r md:from-ink md:via-ink/40 md:to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-ink to-transparent" />

      <motion.div className="container-x w-full pb-10 sm:pb-14" style={rich ? { y: textY, opacity: fadeOut } : undefined}>
        <motion.div className="label mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-bone/60 sm:mb-8" {...fade(0.2)}>
          <span className="inline-flex items-center gap-2 text-accent"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Digital growth</span>
          <span className="h-px w-8 bg-line" />
          <span>Software quality</span>
        </motion.div>

        <RevealText
          as="h1"
          onMount
          delay={0.35}
          stagger={0.08}
          text={'Engineered *growth.*\nAssured ~quality.~'}
          className="display max-w-[11ch] text-[clamp(2.75rem,min(6vw,12svh),6.75rem)] sm:max-w-none"
        />

        <div className="mt-8 flex max-w-xl flex-col gap-8 sm:mt-10">
          <motion.p className="max-w-md text-base leading-relaxed text-bone/75 sm:text-lg" {...fade(1)}>
            Advanta Tech is a digital growth and software QA studio. We make brands impossible to ignore — and products impossible to break.
          </motion.p>
          <motion.div className="flex flex-col gap-3 sm:flex-row" {...fade(1.15)}>
            <Button to="/contact">Start a project</Button>
            <Button to="/services" variant="outline">Explore services</Button>
          </motion.div>
        </div>

        <motion.div className="label mt-12 hidden items-center justify-between border-t border-line pt-6 text-mute sm:flex" {...fade(1.4)}>
          <span className="flex items-center gap-4">
            <span className="relative h-10 w-px overflow-hidden rounded-full bg-line"><span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-accent" /></span>
            Scroll to explore
          </span>
          <span className="hidden md:flex md:items-center md:gap-6">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> 14 growth services</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-bone" /> 5 quality services</span>
          </span>
          <span>N° 01 — Strategy · Build · Test</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
