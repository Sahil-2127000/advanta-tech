import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { headTags, routeMeta } from '../../seo/seo'

/**
 * Keeps <head> in sync with the current route: title, description, canonical, Open Graph,
 * Twitter card and JSON-LD. The static HTML for each route is generated at build time from
 * the same data, so crawlers and link previews see the right tags without running JS.
 */
export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const head = document.head
    head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
    // Content comes only from our own route data (src/seo/seo.js), escaped in headTags().
    head.insertAdjacentHTML('beforeend', headTags(routeMeta(pathname)))
  }, [pathname])
  return null
}
