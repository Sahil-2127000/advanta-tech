import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import TiltCard from '../three/TiltCard'

/** Service tile with a 3D-lifted icon and a depth-layered title. */
export default function ServiceCard({ service: s, index }) {
  const growth = s.practice === 'growth'
  return (
    <TiltCard max={8} className="group h-full">
      <Link
        to={`/services/${s.slug}`}
        className="relative flex h-full min-h-[300px] flex-col overflow-hidden border border-line bg-coal p-7 transition-colors duration-500 [transform-style:preserve-3d] hover:border-bone/25 sm:p-8"
      >
        <div aria-hidden className="bg-grid absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className="relative flex items-start justify-between" style={{ transform: 'translateZ(50px)' }}>
          <span className={`grid h-14 w-14 place-items-center border transition-all duration-500 ${growth ? 'border-volt/40 text-volt group-hover:bg-volt group-hover:text-ink' : 'border-bone/25 text-bone group-hover:bg-bone group-hover:text-ink'}`}>
            <s.icon className="h-6 w-6" strokeWidth={1.6} aria-hidden />
          </span>
          <span className="label text-mute">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="relative mt-auto pt-12" style={{ transform: 'translateZ(30px)' }}>
          <p className={`label mb-3 ${growth ? 'text-volt' : 'text-bone/60'}`}>{growth ? 'Growth' : 'Quality'}</p>
          <h3 className="display text-[length:var(--text-h3)] leading-[0.95]">{s.name}</h3>
          <p className="mt-4 text-sm leading-relaxed text-bone/60">{s.summary}</p>
          <span className="label mt-6 inline-flex items-center gap-2 text-bone/80 group-hover:text-volt">
            Explore <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </Link>
    </TiltCard>
  )
}
