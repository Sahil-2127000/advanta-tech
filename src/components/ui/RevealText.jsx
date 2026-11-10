import { motion } from 'motion/react'
import { easeOut, viewportOnce } from '../../lib/motion'

/**
 * Line-masked, word-staggered headline reveal.
 * `text` uses "\n" for deliberate line breaks and *asterisks* to mark volt-highlighted words.
 * `outline` words are wrapped in ~tildes~.
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
            const volt = raw.startsWith('*')
            const outline = raw.startsWith('~')
            const word = raw.replace(/[*~]/g, '')
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.06em] align-top -mb-[0.06em]">
                <motion.span
                  className={`inline-block ${volt ? 'text-volt' : ''} ${outline ? 'text-outline' : ''}`}
                  variants={{
                    hidden: { y: '110%', rotate: 4 },
                    show: { y: '0%', rotate: 0, transition: { duration: 1.05, ease: easeOut, delay: delay + i * stagger } },
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
