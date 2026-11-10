import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import PageHero from '../components/ui/PageHero'
import ServiceCard from '../components/cards/ServiceCard'
import CTASection from '../components/ui/CTASection'
import { practices, services } from '../data/services'
import { easeOut } from '../lib/motion'
import { usePageMeta } from '../hooks/usePageMeta'

const tabs = [{ id: 'all', label: 'All services' }, ...Object.values(practices).map((p) => ({ id: p.id, label: p.title }))]

export default function Services() {
  usePageMeta('Services', 'SEO, social, PPC, web & e-commerce development, branding, video, automation, plus manual, automation, API, performance and mobile testing.')
  const [params, setParams] = useSearchParams()
  const initial = tabs.some((t) => t.id === params.get('practice')) ? params.get('practice') : 'all'
  const [filter, setFilter] = useState(initial)
  const shown = filter === 'all' ? services : services.filter((s) => s.practice === filter)

  const choose = (id) => {
    setFilter(id)
    setParams(id === 'all' ? {} : { practice: id }, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHero
        index="01"
        label="Services"
        title={'Everything you\nneed to *scale.*'}
        intro="Nineteen specialist services across two practices. Engage one, combine several, or let us assemble the right team for your goals."
        scene={{ shape: 'octa' }}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div role="group" aria-label="Filter services by practice" className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button key={t.id} type="button" onClick={() => choose(t.id)} aria-pressed={filter === t.id}
                  className={`label relative min-h-11 rounded-full px-4 py-2.5 transition-colors ${filter === t.id ? 'text-white' : 'border border-line text-bone/70 hover:border-bone/40 hover:text-bone'}`}>
                  {filter === t.id && <motion.span layoutId="service-filter" className="absolute inset-0 rounded-full bg-brand" transition={{ duration: 0.5, ease: easeOut }} />}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
            <p className="label text-mute" aria-live="polite">{String(shown.length).padStart(2, '0')} / {services.length} services</p>
          </div>
          <motion.div layout className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((s) => (
                <motion.div key={s.slug} layout initial={{ opacity: 0, y: 30, rotateX: -12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6, ease: easeOut }} style={{ transformPerspective: 1000 }}>
                  <ServiceCard service={s} index={services.indexOf(s)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <CTASection title={'Not sure\nwhere to *start?*'} text="Tell us your goal and we'll recommend the services that will move the needle first — free, in a 30-minute discovery call." />
    </>
  )
}
