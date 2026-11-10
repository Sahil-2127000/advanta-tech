import { motion } from 'motion/react'
import { easeOut, viewportOnce } from '../../lib/motion'

/** Technical metadata label: index, animated rule, title. */
export default function SectionLabel({ index, children, className = '' }) {
  return (
    <div className={`label flex items-center gap-4 text-mute ${className}`}>
      {index && <span className="text-volt">{index}</span>}
      <motion.span
        aria-hidden
        className="h-px w-10 origin-left bg-current sm:w-16"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.1, ease: easeOut }}
      />
      <span>{children}</span>
    </div>
  )
}
