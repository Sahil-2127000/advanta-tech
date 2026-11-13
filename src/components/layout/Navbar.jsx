import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { X } from 'lucide-react'
import { nav, site, whatsappLink } from '../../config/site'
import { easeInOut, easeOut } from '../../lib/motion'
import Button from '../ui/Button'
import LogoMark from '../brand/Logo'

export function Wordmark({ className = '' }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label={`${site.name} — home`}>
      <LogoMark
        tile
        className="h-9 w-9 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:scale-105"
        dotClassName="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-[14%] group-hover:translate-x-[10%]"
      />
      <span className="text-[1.05rem] font-semibold leading-none tracking-[-0.02em] sm:text-lg">
        Advanta <span className="font-normal text-bone/60">Tech</span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)

  // Close the mobile menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  // The navbar stays pinned at all times; it only gains a solid backdrop once you scroll.
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 40))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid && !open ? 'border-b border-line/70 bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <a href="#main" className="label sr-only z-50 bg-brand p-3 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4">
          Skip to content
        </a>
        <nav className="container-x flex h-[72px] items-center justify-between gap-6 sm:h-20" aria-label="Main">
          <Wordmark className="relative z-[70]" />

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className="group relative block px-3.5 py-2">
                  {({ isActive }) => (
                    <>
                      <span className={`text-sm font-medium transition-colors duration-300 ${isActive ? 'text-bone' : 'text-bone/60 group-hover:text-bone'}`}>
                        {item.label}
                      </span>
                      {isActive ? (
                        <motion.span layoutId="nav-active" className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-accent to-transparent" transition={{ duration: 0.6, ease: easeOut }} />
                      ) : (
                        <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-right scale-x-0 bg-bone/50 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block">
              <Button to="/contact" className="min-h-11">Start a project</Button>
            </span>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="relative z-[70] grid h-11 w-11 place-items-center rounded-full border border-bone/20 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <span className="flex w-5 flex-col gap-1.5" aria-hidden>
                  <span className="h-px w-full bg-bone" />
                  <span className="h-px w-3/5 bg-accent" />
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>{open && <MobileMenu pathname={pathname} />}</AnimatePresence>
    </>
  )
}

function MobileMenu({ pathname }) {
  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[45] flex flex-col bg-ink lg:hidden"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.8, ease: easeInOut }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(77,141,255,0.12),transparent_50%)]" />
      <nav className="container-x relative flex flex-1 flex-col justify-center pt-20" aria-label="Mobile">
        <ul className="space-y-1">
          {nav.map((item, i) => {
            const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
            return (
              <li key={item.to} className="overflow-hidden">
                <motion.div
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '110%', transition: { duration: 0.3 } }}
                  transition={{ duration: 0.8, ease: easeOut, delay: 0.25 + i * 0.06 }}
                >
                  <Link
                    to={item.to}
                    className={`display flex items-baseline gap-4 py-1 text-[clamp(2.4rem,11vw,4.5rem)] leading-[1.05] ${active ? 'text-accent' : 'text-bone'}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="label text-mute">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.div>
              </li>
            )
          })}
        </ul>
      </nav>
      <motion.div
        className="container-x relative flex flex-col gap-3 border-t border-line py-6 sm:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.7 } }}
        exit={{ opacity: 0 }}
      >
        <Button to="/contact" className="w-full sm:w-auto">Start a project</Button>
        <Button href={whatsappLink()} variant="outline" className="w-full sm:w-auto">WhatsApp</Button>
      </motion.div>
    </motion.div>
  )
}
