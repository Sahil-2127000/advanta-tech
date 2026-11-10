import { motion } from 'motion/react'
import { easeOut, viewportOnce } from '../../lib/motion'

/**
 * Word-staggered headline reveal: each word rises out of a soft blur.
 * `text` uses "\n" for deliberate line breaks, *asterisks* for logo-blue gradient words
 * and ~tildes~ for quiet silver words.
 */
export default function RevealText({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  stagger = 0.06,
  onMount = false,
}) {
  const MotionTag = motion[Tag]
  const lines = text.split('\n')
  let wordIndex = 0

  const trigger = onMount
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: viewportOnce }

  return (
    <MotionTag className={className} aria-label={text.replace(/[*~]/g, '').replace(/\n/g, ' ')} {...trigger}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(' ').map((raw, wi) => {
            const i = wordIndex++
            const accent = raw.startsWith('*')
            const outline = raw.startsWith('~')
            const word = raw.replace(/[*~]/g, '')
            return (
              <span key={wi} className="inline-block align-top">
                <motion.span
                  className={`inline-block pb-[0.08em] ${accent ? 'text-gradient' : ''} ${outline ? 'text-soft' : ''}`}
                  variants={{
                    hidden: { opacity: 0, y: '0.45em', filter: 'blur(14px)' },
                    show: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration: 1.2, ease: easeOut, delay: delay + i * stagger } },
                  }}
                >
                  {word}
                </motion.span>
                {wi < line.split(' ').length - 1 && ' '}
              </span>
            )
          })}
        </span>
      ))}
    </MotionTag>
  )
}
