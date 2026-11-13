import PageHero from '../components/ui/PageHero'
import SectionLabel from '../components/ui/SectionLabel'
import RevealText from '../components/ui/RevealText'
import Reveal from '../components/ui/Reveal'
import CTASection from '../components/ui/CTASection'
import TiltCard from '../components/three/TiltCard'
import { Industries, Principles, Stats } from '../components/home/Closing'
import { Rocket, Target } from 'lucide-react'

const pillars = [
  { icon: Target, label: 'Mission', title: 'Make growth measurable and quality non-negotiable.', text: 'Every engagement is tied to a business outcome, and every release we touch is tested like our name is on it.' },
  { icon: Rocket, label: 'Vision', title: 'One partner from first click to flawless checkout.', text: 'Brands should not need five agencies to market, build and test. We bring it into one accountable team.' },
]

function Story() {
  return (
    <section className="py-24 sm:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="01">Our story</SectionLabel>
          <RevealText text={'Where marketing\nmeets *engineering.*'} className="display mt-8 text-[length:var(--text-h2)]" />
        </div>
        <Reveal className="space-y-6 text-lg leading-relaxed text-bone/70 lg:col-span-6 lg:col-start-7 lg:pt-16">
          <p>
            Advanta Tech started with a simple observation: the campaigns that brought customers in were often sending them to
            websites and apps that broke under pressure. Marketing and quality were handled by different teams who never spoke.
          </p>
          <p>
            So we built a studio that does both. Our growth specialists and QA engineers plan together, share dashboards and hold
            themselves to the same standard — traffic that converts, and software that works every time someone arrives.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function Pillars() {
  return (
    <section className="border-t border-line bg-coal py-24 sm:py-32">
      <div className="container-x grid gap-5 md:grid-cols-2">
        {pillars.map((p, i) => (
          <Reveal key={p.label} delay={i * 0.12} className="h-full">
            <TiltCard max={7} className="group h-full">
              <div className="glass relative h-full p-8 [transform-style:preserve-3d] sm:p-12">
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-brand text-white" style={{ transform: 'translateZ(60px)' }}>
                  <p.icon className="h-6 w-6" aria-hidden />
                </span>
                <div style={{ transform: 'translateZ(35px)' }}>
                  <p className="label mt-10 text-accent">{p.label}</p>
                  <h3 className="display mt-4 text-[length:var(--text-h3)] leading-[1]">{p.title}</h3>
                  <p className="mt-5 max-w-md text-bone/65">{p.text}</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <PageHero
        index="02"
        label="About us"
        title={'Growth and\nquality, *one team.*'}
        intro="We are strategists, marketers, designers, developers and QA engineers working as one studio — because growth only counts when the product holds up."
        scene={{ shape: 'dodeca' }}
      />
      <Story />
      <Pillars />
      <Stats />
      <Principles />
      <Industries />
      <CTASection title={'Work with\na *real team.*'} />
    </>
  )
}
