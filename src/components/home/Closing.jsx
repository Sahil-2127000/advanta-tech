import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import SectionLabel from '../ui/SectionLabel'
import RevealText from '../ui/RevealText'
import Reveal from '../ui/Reveal'
import Counter from '../ui/Counter'
import Marquee from '../ui/Marquee'
import { faqs, industries, principles, stats } from '../../data/content'
import { easeOut } from '../../lib/motion'

export function Stats() {
  return (
    <section className="border-y border-line" aria-label="Advanta in numbers">
      <div className="container-x grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className={`border-line py-10 sm:py-14 ${i % 2 ? 'border-l pl-5 sm:pl-8' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l lg:pl-8' : ''}`}>
            <p className="label mb-4 text-mute"><span className="text-volt">0{i + 1}</span> / {s.label}</p>
            <Counter value={s.value} suffix={s.suffix} className="display block text-[clamp(3.25rem,7vw,6.5rem)] leading-none" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Industries() {
  return (
    <section className="py-20 sm:py-24" aria-label="Industries">
      <div className="container-x mb-10 flex items-center justify-between gap-6">
        <SectionLabel index="05">Industries we serve</SectionLabel>
      </div>
      <Marquee items={industries} className="text-[clamp(2.5rem,6vw,5rem)] text-bone/90" />
    </section>
  )
}

export function Principles() {
  return (
    <section className="border-t border-line bg-coal py-24 sm:py-36">
      <div className="container-x">
        <SectionLabel index="06">Why Advanta</SectionLabel>
        <RevealText text={'Built on\n*principles.*'} className="display mt-8 text-[length:var(--text-h1)]" />
        <div className="mt-16 grid border-t border-line md:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.k} delay={(i % 2) * 0.1} className={`group border-b border-line py-10 md:py-14 ${i % 2 === 0 ? 'md:border-r md:pr-12' : 'md:pl-12'}`}>
              <span className="display text-outline block text-[clamp(4rem,8vw,7rem)] leading-none transition-colors duration-700 group-hover:text-volt group-hover:[-webkit-text-stroke-color:var(--color-volt)]">{p.k}</span>
              <h3 className="display mt-6 text-4xl">{p.title}</h3>
              <p className="mt-4 max-w-md text-bone/60">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="07">FAQ</SectionLabel>
          <RevealText text={'Good\n*questions.*'} className="display mt-8 text-[length:var(--text-h2)]" />
        </div>
        <ul className="border-t border-line lg:col-span-8">
          {faqs.map(([q, a], i) => (
            <li key={q} className="border-b border-line">
              <h3>
                <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} aria-controls={`faq-${i}`} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className="display text-2xl sm:text-3xl">{q}</span>
                  <Plus className={`h-6 w-6 shrink-0 text-volt transition-transform duration-500 ${open === i ? 'rotate-45' : ''}`} aria-hidden />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: easeOut }} className="overflow-hidden">
                    <p className="max-w-2xl pb-7 text-bone/65">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
