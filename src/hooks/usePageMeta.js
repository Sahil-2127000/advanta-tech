import { useEffect } from 'react'
import { site } from '../config/site'

export function usePageMeta(title, description = site.description) {
  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — Engineered Growth. Assured Quality.`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
