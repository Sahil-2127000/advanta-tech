import { Link } from 'react-router-dom'
import { ArrowUp, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { nav, site, whatsappLink } from '../../config/site'
import { byPractice, practices } from '../../data/services'
import { Wordmark } from './Navbar'

function ServiceColumn({ id }) {
  return (
    <div>
      <h2 className="label mb-5 text-mute">{practices[id].title}</h2>
      <ul className="space-y-2.5">
        {byPractice(id).map((s) => (
          <li key={s.slug}>
            <Link to={`/services/${s.slug}`} className="text-sm text-bone/75 transition-colors hover:text-volt">{s.short}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-coal pt-20 sm:pt-28">
      <div className="container-x">
        <div className="grid gap-14 border-b border-line pb-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark />
            <p className="mt-6 max-w-sm leading-relaxed text-bone/60">{site.tagline} A digital growth and software quality studio for brands that refuse to settle.</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="label border border-line px-3 py-2 text-bone/70 transition-colors hover:border-volt hover:text-volt">{s.label}</a>
              ))}
            </div>
          </div>
          <nav className="lg:col-span-2" aria-label="Footer">
            <h2 className="label mb-5 text-mute">Company</h2>
            <ul className="space-y-2.5">
              {nav.map((n) => (
                <li key={n.to}><Link to={n.to} className="text-sm text-bone/75 transition-colors hover:text-volt">{n.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-2"><ServiceColumn id="growth" /></div>
          <div className="space-y-12 lg:col-span-4">
            <ServiceColumn id="quality" />
            <address className="not-italic">
              <h2 className="label mb-5 text-mute">Contact</h2>
              <ul className="space-y-3 text-sm text-bone/80">
                <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden />{site.contact.address.join(', ')}</li>
                <li><a href={site.contact.phoneHref} className="flex gap-3 hover:text-volt"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden />{site.contact.phoneDisplay}</a></li>
                <li><a href={`mailto:${site.contact.email}`} className="flex gap-3 break-all hover:text-volt"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden />{site.contact.email}</a></li>
                <li><a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-volt"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden />WhatsApp us</a></li>
              </ul>
            </address>
          </div>
        </div>
        <div className="label flex flex-col gap-4 py-8 text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Contact details shown are placeholders.</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group inline-flex items-center gap-2 self-start hover:text-volt">
            Back to top <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" aria-hidden />
          </button>
        </div>
      </div>
      <p aria-hidden className="display pointer-events-none select-none whitespace-nowrap text-center text-[17vw] leading-[0.78] text-graphite">Advanta</p>
    </footer>
  )
}
