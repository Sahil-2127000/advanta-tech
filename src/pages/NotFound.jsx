import { motion } from 'motion/react'
import Button from '../components/ui/Button'
import RevealText from '../components/ui/RevealText'
import { easeOut } from '../lib/motion'

export default function NotFound() {
  return (
    <section className="bg-grid relative flex min-h-svh items-center overflow-hidden pt-24 [perspective:1200px]">
      <motion.p
        aria-hidden
        className="display text-outline pointer-events-none absolute inset-x-0 top-1/2 select-none text-center text-[36vw] leading-none"
        initial={{ opacity: 0, rotateX: 50, y: '-40%' }}
        animate={{ opacity: 0.55, rotateX: 18, y: '-50%' }}
        transition={{ duration: 1.6, ease: easeOut }}
      >
        404
      </motion.p>
      <div className="container-x relative">
        <p className="label mb-6 text-accent">Error 404 — test failed</p>
        <RevealText as="h1" onMount text={'This page\n*didn’t pass QA.*'} className="display text-[length:var(--text-hero)]" />
        <p className="mt-8 max-w-md text-lg text-bone/70">The link may be broken or the page has moved. Even our 404 is tested — head back and try again.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button to="/">Back to home</Button>
          <Button to="/services" variant="outline">View services</Button>
        </div>
      </div>
    </section>
  )
}
