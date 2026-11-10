import Hero from '../components/home/Hero'
import Statement from '../components/home/Statement'
import Practices from '../components/home/Practices'
import ServicesOrbit from '../components/home/ServicesOrbit'
import ProcessPinned from '../components/home/ProcessPinned'
import { Faq, Industries, Principles, Stats } from '../components/home/Closing'
import Marquee from '../components/ui/Marquee'
import CTASection from '../components/ui/CTASection'
import { services } from '../data/services'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Home() {
  usePageMeta(null)
  return (
    <>
      <Hero />
      <Marquee items={services.map((s) => s.short)} className="border-y border-line bg-volt py-4 text-2xl text-ink sm:text-3xl [&_.bg-volt]:bg-ink" />
      <Statement />
      <Practices />
      <ServicesOrbit />
      <ProcessPinned />
      <Stats />
      <Industries />
      <Principles />
      <Faq />
      <CTASection />
    </>
  )
}
