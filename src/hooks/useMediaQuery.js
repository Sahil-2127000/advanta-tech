import { useSyncExternalStore } from 'react'

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** True on devices where heavy scroll effects are worth running. */
export const useRichMotion = () =>
  useMediaQuery('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
