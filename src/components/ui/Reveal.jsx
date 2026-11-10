import { motion } from 'motion/react'
import { easeOut, viewportOnce } from '../../lib/motion'

/** Section entrance: subtle rise + fade, once, when entering the viewport. */
export default function Reveal({ as = 'div', delay = 0, y = 40, className = '', children, ...props }) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.9, ease: easeOut, delay }}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
