import { Check } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionLabel from '../components/ui/SectionLabel'
import RevealText from '../components/ui/RevealText'
import Reveal from '../components/ui/Reveal'
import CTASection from '../components/ui/CTASection'
import TiltCard from '../components/three/TiltCard'
import ProcessPinned from '../components/home/ProcessPinned'
import { Faq } from '../components/home/Closing'
import { process } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'

const models = [
  { name: 'Project', fit: 'Defined scope', text: 'A fixed-price engagement with clear deliverables — a website build, an SEO audit, a test automation framework.', points: ['Fixed quote upfront', 'Milestone-based delivery', 'Handover & documentation'] },
  { name: 'Retainer', fit: 'Ongoing growth', text: 'A monthly program across one or more services, with a dedicated account lead and monthly performance reviews.', points: ['Monthly roadmap', 'Shared live dashboards', 'Flexible scope month to month'], featured: true },
  { name: 'Dedicated team', fit: 'Embedded capacity', text: 'Specialists embedded with your team — marketers, developers or QA engineers working inside your tools and rituals.', points: ['Your tools, your sprints', 'Scale up or down', 'Direct communication'] },
]

export default function Process() {
  usePageMeta('Process', 'How Advanta Tech works: discover, strategise, execute and optimise — plus flexible engagement models.')
  return (
    <>
      <PageHero
        index="03"
        label="Process"
        title={'A process\nbuilt to *compound.*'}
        intro="Every engagement follows the same disciplined loop. It keeps work transparent, decisions data-driven and results improving month after month."
      />
      <ProcessPinned />

      <section className="border-t border-line py-24 sm:py-32">
        <div className="container-x">
          <SectionLabel index="05">In detail</SectionLabel>
          <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.k} delay={i * 0.08} className="bg-ink p-8">
                <span className="display text-outline-volt text-7xl leading-none">{p.k}</span>
                <h3 className="display mt-6 text-3xl">{p.title}</h3>
                <ul className="mt-6 space-y-3">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-sm text-bone/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden />{pt}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-coal py-24 sm:py-32">
        <div className="container-x">
          <SectionLabel index="06">Engagement models</SectionLabel>
          <RevealText text={'Work the way\n*you* work.'} className="display mt-8 text-[length:var(--text-h1)]" />
          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {models.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.1} className="h-full">
                <TiltCard max={7} className="group h-full">
                  <article className={`relative flex h-full flex-col border p-8 [transform-style:preserve-3d] sm:p-10 ${m.featured ? 'border-volt/50 bg-graphite' : 'border-line bg-ink'}`}>
                    {m.featured && <span className="absolute inset-x-0 top-0 h-1 bg-volt" />}
                    <div style={{ transform: 'translateZ(40px)' }}>
                      <p className="label text-mute">{m.fit}</p>
                      <h3 className="display mt-3 text-5xl">{m.name}</h3>
                      <p className="mt-5 text-bone/65">{m.text}</p>
                    </div>
                    <ul className="mt-8 space-y-3 border-t border-line pt-7" style={{ transform: 'translateZ(20px)' }}>
                      {m.points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-sm text-bone/85"><Check className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden />{pt}</li>
                      ))}
                    </ul>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Faq />
      <CTASection />
    </>
  )
}
