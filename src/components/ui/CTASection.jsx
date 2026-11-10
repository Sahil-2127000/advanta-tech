import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Button from './Button'
import RevealText from './RevealText'
import { whatsappLink } from '../../config/site'
import { useRichMotion } from '../../hooks/useMediaQuery'

/** Closing CTA with a receding 3D perspective grid floor. */
export default function CTASection({
  title = "Let's build\nwhat's *next.*",
  text = 'Tell us where you want to grow — or what keeps breaking. You get a free discovery call and a written proposal, no obligation.',
}) {
  const ref = useRef(null)
  const rich = useRichMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const floorY = useTransform(scrollYProgress, [0, 1], ['0px', '-280px'])

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-line">
      <div aria-hidden className="absolute inset-x-[-25%] bottom-[-35%] -z-10 h-[90%] [perspective:600px]">
        <motion.div
          className="bg-grid h-full w-full origin-bottom [transform:rotateX(62deg)] [background-size:56px_56px] [mask-image:linear-gradient(to_top,black,transparent_85%)]"
          style={rich ? { backgroundPositionY: floorY } : undefined}
        />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_110%,rgba(77,141,255,0.18),transparent_55%)]" />
      <div className="container-x py-28 text-center sm:py-40">
        <p className="label mb-8 text-accent">Free discovery call — no obligation</p>
        <RevealText text={title} className="display mx-auto text-[length:var(--text-hero)]" />
        <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-bone/70">{text}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/contact">Start a project</Button>
          <Button href={whatsappLink()} variant="outline">WhatsApp us</Button>
        </div>
      </div>
    </section>
  )
}
