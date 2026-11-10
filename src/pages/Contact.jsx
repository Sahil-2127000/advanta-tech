import { useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionLabel from '../components/ui/SectionLabel'
import RevealText from '../components/ui/RevealText'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import TiltCard from '../components/three/TiltCard'
import EnquiryForm from '../components/forms/EnquiryForm'
import { site, whatsappLink } from '../config/site'
import { getService } from '../data/services'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Contact() {
  usePageMeta('Contact', 'Start a project with Advanta Tech — free discovery call, written proposal, no obligation.')
  const [params] = useSearchParams()
  const service = getService(params.get('service') ?? '')

  const channels = [
    { icon: Mail, label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: Phone, label: 'Call', value: site.contact.phoneDisplay, href: site.contact.phoneHref },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with our team', href: whatsappLink(), external: true },
    { icon: MapPin, label: 'Office', value: site.contact.address.join(', ') },
  ]

  return (
    <>
      <PageHero
        index="04"
        label="Contact"
        title={"Let's build\nsomething *great.*"}
        intro="Tell us about your goals. You'll get a free discovery call and a written proposal — usually within one working day."
        scene={{ shape: 'ico' }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="#enquiry">Send an enquiry</Button>
          <Button href={whatsappLink()} variant="outline">WhatsApp us</Button>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <ul className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, i) => {
            const inner = (
              <div className="relative flex h-full flex-col rounded-2xl border border-line bg-coal p-7 transition-colors duration-500 [transform-style:preserve-3d] group-hover:border-accent/50">
                <span className="flex items-center justify-between" style={{ transform: 'translateZ(40px)' }}>
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-accent/40 text-accent"><c.icon className="h-5 w-5" aria-hidden /></span>
                  {c.href && <ArrowUpRight className="h-5 w-5 text-mute transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" aria-hidden />}
                </span>
                <span className="label mt-10 block text-mute" style={{ transform: 'translateZ(20px)' }}>{c.label}</span>
                <span className="mt-2 block break-words text-bone" style={{ transform: 'translateZ(20px)' }}>{c.value}</span>
              </div>
            )
            return (
              <Reveal as="li" key={c.label} delay={i * 0.07}>
                <TiltCard max={9} className="group h-full">
                  {c.href ? (
                    <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})} className="block h-full">{inner}</a>
                  ) : inner}
                </TiltCard>
              </Reveal>
            )
          })}
        </ul>
      </section>

      <section id="enquiry" className="scroll-mt-20 border-t border-line py-24 sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="01">Project enquiry</SectionLabel>
            <RevealText text={'Tell us\nwhat you *need.*'} className="display mt-8 text-[length:var(--text-h1)]" />
            <ol className="mt-12 space-y-5 border-t border-line pt-8">
              {['We reply within one working day', 'Free 30-minute discovery call', 'Written proposal with scope and price'].map((t, i) => (
                <li key={t} className="flex items-baseline gap-4">
                  <span className="label text-accent">0{i + 1}</span>
                  <span className="text-bone/80">{t}</span>
                </li>
              ))}
            </ol>
            <div className="mt-12 border-t border-line pt-8">
              <p className="label mb-6 flex items-center gap-2 text-mute"><Clock className="h-4 w-4 text-accent" aria-hidden /> Office hours</p>
              <dl className="space-y-3">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex items-baseline justify-between gap-4 border-b border-line/60 pb-3">
                    <dt className="text-bone/70">{h.days}</dt>
                    <dd className="display text-xl">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="label mt-4 text-[0.6rem] text-mute/70">Sample hours — edit in src/config/site.js</p>
            </div>
          </div>
          <Reveal className="lg:col-span-7">
            <div className="glass p-6 sm:p-10">
              <EnquiryForm defaultService={service?.slug ?? ''} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
