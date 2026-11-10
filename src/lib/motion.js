export const easeOut = [0.16, 1, 0.3, 1]
export const easeInOut = [0.76, 0, 0.24, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easeOut } },
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' }
