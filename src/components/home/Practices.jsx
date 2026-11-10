import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from '../ui/SectionLabel'
import RevealText from '../ui/RevealText'
import Reveal from '../ui/Reveal'
import TiltCard from '../three/TiltCard'
import { byPractice, practices } from '../../data/services'

function PracticeCard({ id }) {
  const p = practices[id]
  const list = byPractice(id)
  const growth = id === 'growth'
  return (
    <TiltCard max={6} className="group h-full">
      <div className={`relative flex h-full flex-col overflow-hidden border p-8 [transform-style:preserve-3d] sm:p-10 ${growth ? 'border-accent/30 bg-graphite' : 'border-line bg-coal'}`}>
        <div aria-hidden className={`absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${growth ? 'bg-accent/15' : 'bg-bone/10'}`} />
        <div className="relative flex items-start justify-between" style={{ transform: 'translateZ(40px)' }}>
          <p className="label text-mute">{p.kicker}</p>
          <span className={`display text-outline${growth ? '-accent' : ''} text-8xl leading-none`}>{String(list.length).padStart(2, '0')}</span>
        </div>
        <div className="relative mt-6" style={{ transform: 'translateZ(60px)' }}>
          <h3 className="display text-[length:var(--text-h2)]">
            {p.name}<span className={growth ? 'text-accent' : 'text-bone/40'}>.</span>
          </h3>
          <p className="label mt-3 text-bone/70">{p.title}</p>
          <p className="mt-6 max-w-md leading-relaxed text-bone/65">{p.pitch}</p>
        </div>
        <ul className="relative mt-10 grid flex-1 content-start gap-x-6 sm:grid-cols-2" style={{ transform: 'translateZ(25px)' }}>
          {list.map((s) => (
            <li key={s.slug}>
              <Link to={`/services/${s.slug}`} className="group/l flex items-center justify-between gap-3 border-b border-line py-3 text-sm text-bone/80 transition-colors hover:text-accent">
                <span className="flex items-center gap-3"><s.icon className="h-4 w-4 shrink-0 text-mute group-hover/l:text-accent" aria-hidden />{s.short}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover/l:opacity-100" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </TiltCard>
  )
}

export default function Practices() {
  return (
    <section className="border-t border-line py-24 sm:py-36">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel index="02">Two practices</SectionLabel>
            <RevealText text={'Grow with intent.\nShip *flawless.*'} className="display mt-8 text-[length:var(--text-h1)]" />
          </div>
          <p className="max-w-sm text-bone/60 md:col-span-4 md:col-start-9 md:pb-3">
            Marketing that brings customers in, and quality engineering that keeps them happy once they arrive. Use one practice, or both as a single team.
          </p>
        </div>
        <div className="mt-16 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <Reveal className="h-full"><PracticeCard id="growth" /></Reveal>
          <Reveal className="h-full" delay={0.12}><PracticeCard id="quality" /></Reveal>
        </div>
      </div>
    </section>
  )
}
