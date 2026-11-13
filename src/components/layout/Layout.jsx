import { useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Navbar from './Navbar'
import Footer from './Footer'
import Cursor from './Cursor'
import Seo from './Seo'
import ScrollProgress from './ScrollProgress'
import { easeInOut } from '../../lib/motion'

/** Freezes the outlet for the exiting page so AnimatePresence can animate it out. */
function AnimatedOutlet() {
  const current = useOutlet()
  const [outlet] = useState(current)
  return outlet
}

function scrollAfterNavigation() {
  const { hash } = window.location
  const el = hash && document.getElementById(hash.slice(1))
  if (el) el.scrollIntoView()
  else window.scrollTo(0, 0)
}

export default function Layout() {
  const location = useLocation()

  return (
    <>
      <Seo />
      <ScrollProgress />
      <Navbar />
      <AnimatePresence mode="wait" initial={false} onExitComplete={scrollAfterNavigation}>
        <motion.main
          id="main"
          key={location.pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, y: -16, transition: { duration: 0.4, ease: easeInOut } }}
        >
          <AnimatedOutlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <div className="grain" aria-hidden />
      <Cursor />
    </>
  )
}
