import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { X } from 'lucide-react'
import { nav, site, whatsappLink } from '../../config/site'
import { easeInOut, easeOut } from '../../lib/motion'
import Button from '../ui/Button'

export function Wordmark({ className = '' }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label={`${site.name} — home`}>
      <span className="grid h-8 w-8 place-items-center bg-volt text-ink transition-transform duration-700 ease-[var(--ease-out-expo)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <svg viewBox="0 0 64 64" className="h-4 w-4" aria-hidden><path d="M32 6 58 58H45.5l-4.7-10h-17.6l-4.7 10H6zm0 20-6 12.5h12z" fill="currentColor" /></svg>
      </span>
      <span className="display text-xl leading-none tracking-wide sm:text-2xl">
        Advanta<span className="text-volt">.</span>Tech
      </span>
    </Link>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)

  // Close the mobile menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 40)
    setHidden((h) => (y > 400 && y > prev + 4 ? true : y < prev - 4 ? false : h))
  })

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
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid && !open ? 'border-b border-line/70 bg-ink/85 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
        }`}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <a href="#main" className="label sr-only z-50 bg-volt p-3 text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4">
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
                      <span className={`label transition-colors duration-300 ${isActive ? 'text-bone' : 'text-bone/60 group-hover:text-bone'}`}>
                        {item.label}
                      </span>
                      {isActive ? (
                        <motion.span layoutId="nav-active" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 bg-volt" transition={{ duration: 0.6, ease: easeOut }} />
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
              className="relative z-[70] grid h-11 w-11 place-items-center border border-bone/20 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <span className="flex w-5 flex-col gap-1.5" aria-hidden>
                  <span className="h-px w-full bg-bone" />
                  <span className="h-px w-3/5 bg-volt" />
                </span>
              )}
            </button>
          </div>
        </nav>
      </motion.header>

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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(198,255,0,0.12),transparent_50%)]" />
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
                    className={`display flex items-baseline gap-4 py-1 text-[clamp(3rem,14vw,5.5rem)] leading-[0.95] ${active ? 'text-volt' : 'text-bone'}`}
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
