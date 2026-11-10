import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import SectionLabel from '../ui/SectionLabel'
import { TextLink } from '../ui/Button'

const copy =
  'Most agencies make noise. We build *systems* — growth you can measure and software you can *trust,* delivered by one accountable team that treats your business like its own.'

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className={`mr-[0.22em] inline-block ${word.startsWith('*') ? 'text-accent' : ''}`}>
      {word.replace(/\*/g, '')}
    </motion.span>
  )
}

/** Oversized statement whose words light up as the reader scrolls through it. */
export default function Statement() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.45'] })
  const words = copy.split(' ')
  return (
    <section className="relative py-24 sm:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3"><SectionLabel index="01">Who we are</SectionLabel></div>
        <div className="lg:col-span-9">
          <p ref={ref} className="display text-[clamp(2.1rem,5vw,4.8rem)] leading-[0.98]" aria-label={copy.replace(/\*/g, '')}>
            <span aria-hidden>
              {words.map((w, i) => <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />)}
            </span>
          </p>
          <div className="mt-12 flex flex-col gap-8 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-bone/60">Strategy, creative, engineering and QA under one roof — so nothing gets lost between agencies.</p>
            <TextLink to="/about">About Advanta</TextLink>
          </div>
        </div>
      </div>
    </section>
  )
}
