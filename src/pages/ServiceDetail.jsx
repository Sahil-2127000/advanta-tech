import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import RevealText from '../components/ui/RevealText'
import Reveal from '../components/ui/Reveal'
import SectionLabel from '../components/ui/SectionLabel'
import Button from '../components/ui/Button'
import ServiceCard from '../components/cards/ServiceCard'
import CTASection from '../components/ui/CTASection'
import IconCube from '../components/three/IconCube'
import NotFound from './NotFound'
import { byPractice, getService, practices, services } from '../data/services'
import { process } from '../data/content'
import { easeOut } from '../lib/motion'
import { whatsappLink } from '../config/site'

export default function ServiceDetail() {
  const { slug } = useParams()
  const s = getService(slug)
  if (!s) return <NotFound />

  const growth = s.practice === 'growth'
  const practice = practices[s.practice]
  const i = services.indexOf(s)
  const next = services[(i + 1) % services.length]
  const related = byPractice(s.practice).filter((x) => x.slug !== s.slug).slice(0, 3)

  return (
    <>
      <section className="bg-grid relative overflow-hidden border-b border-line pt-32 sm:pt-36">
        <div aria-hidden className="absolute right-0 top-0 h-[70%] w-[60%]" style={{ background: `radial-gradient(ellipse at 70% 40%, ${growth ? 'rgba(77,141,255,0.12)' : 'rgba(236,235,230,0.08)'}, transparent 60%)` }} />
        <div className="container-x relative grid items-center gap-10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Link to="/services" className="label group mb-10 inline-flex items-center gap-2 text-mute hover:text-accent">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden /> All services
            </Link>
            <p className={`label mb-6 ${growth ? 'text-accent' : 'text-bone/70'}`}>
              {practice.kicker} / {practice.title} / {String(i + 1).padStart(2, '0')}
            </p>
            <RevealText as="h1" onMount delay={0.2} text={s.name} className="display max-w-[14ch] text-[length:var(--text-h1)]" />
            <motion.p className="mt-8 max-w-xl text-xl leading-relaxed text-bone/75" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1, ease: easeOut }}>
              {s.summary}
            </motion.p>
            <motion.div className="mt-10 flex flex-col gap-3 sm:flex-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 1, ease: easeOut }}>
              <Button to={`/contact?service=${s.slug}`}>Get a proposal</Button>
              <Button href={whatsappLink(`Hi Advanta Tech, I'd like to know more about ${s.name}.`)} variant="outline">Ask on WhatsApp</Button>
            </motion.div>
          </div>
          <motion.div className="lg:col-span-5" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: easeOut, delay: 0.3 }}>
            <IconCube icon={s.icon} accent={growth} />
          </motion.div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel index="01">Overview</SectionLabel>
            <Reveal className="mt-8 text-2xl leading-snug text-bone/90 sm:text-3xl">{s.intro}</Reveal>
            <Reveal className="mt-12">
              <p className="label mb-4 text-mute">Tools we work with</p>
              <ul className="flex flex-wrap gap-2">
                {s.tools.map((t) => <li key={t} className="label border border-line px-3 py-2 text-bone/80">{t}</li>)}
              </ul>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <SectionLabel index="02">What you get</SectionLabel>
            <ul className="mt-8 border-t border-line">
              {s.outcomes.map((o, idx) => (
                <Reveal as="li" key={o} delay={idx * 0.08} className="flex gap-4 border-b border-line py-5">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <span className="text-lg">{o}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-coal py-24 sm:py-32">
        <div className="container-x">
          <SectionLabel index="03">Deliverables</SectionLabel>
          <RevealText text={'Scope of\n*work.*'} className="display mt-8 text-[length:var(--text-h2)]" />
          <div className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {s.deliverables.map((d, idx) => (
              <Reveal key={d} delay={idx * 0.07} className="group bg-coal p-7 transition-colors duration-500 hover:bg-graphite sm:odd:last:col-span-2 lg:odd:last:col-span-1">
                <span className="label text-accent">{String(idx + 1).padStart(2, '0')}</span>
                <p className="display mt-12 text-2xl leading-[1.02] transition-transform duration-500 group-hover:-translate-y-1">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionLabel index="04">How it runs</SectionLabel>
          <ol className="mt-12 grid gap-5 md:grid-cols-4">
            {process.map((p, idx) => (
              <Reveal as="li" key={p.k} delay={idx * 0.08} className="border-t-2 border-line pt-6 transition-colors hover:border-accent">
                <span className="label text-accent">{p.k}</span>
                <h3 className="display mt-4 text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/60">{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-coal py-24 sm:py-32">
          <div className="container-x">
            <SectionLabel index="05">Pairs well with</SectionLabel>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Reveal key={r.slug} className="h-full"><ServiceCard service={r} index={services.indexOf(r)} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <Link to={`/services/${next.slug}`} className="group container-x flex items-center justify-between gap-6 py-14 sm:py-20">
          <span>
            <span className="label text-mute">Next service</span>
            <span className="display mt-3 block text-[length:var(--text-h2)] transition-colors duration-500 group-hover:text-accent">{next.name}</span>
          </span>
          <ArrowRight className="h-10 w-10 shrink-0 transition-transform duration-500 group-hover:translate-x-2 sm:h-16 sm:w-16" aria-hidden />
        </Link>
      </section>
      <CTASection title={`Let's talk\n${s.short.split(' ').map((w) => `*${w}*`).join(' ')}.`} />
    </>
  )
}
