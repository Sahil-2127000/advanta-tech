import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { csp, securityHeaders } from './security-headers.js'

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/

/** Plain-HTML summary for crawlers and visitors without JavaScript. */
function noscript({ indexableRoutes, routeMeta }, meta) {
  const links = indexableRoutes()
    .map((r) => `<li><a href="${r}">${routeMeta(r).title.split(' | ')[0]}</a></li>`)
    .join('')
  return `<noscript><h1>${meta.title}</h1><p>${meta.description}</p><nav><ul>${links}</ul></nav></noscript>`
}

/**
 * SEO + hosting output:
 * - injects the home page's meta into index.html (dev and build)
 * - after build, writes one static HTML file per route with that route's title, description,
 *   canonical, Open Graph / Twitter tags and JSON-LD, plus 404.html, sitemap.xml, robots.txt
 *   and a _headers file with the security headers.
 */
function seoBuild(seo) {
  const { headTags, indexableRoutes, routeMeta, absolute } = seo
  const withSeo = (html, meta) => html.replace(SEO_BLOCK, `<!--seo:start-->\n    ${headTags(meta)}\n    <!--seo:end-->`)
  let outDir = 'dist'
  return {
    name: 'advanta-seo',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    transformIndexHtml(html) {
      return withSeo(html, routeMeta('/'))
    },
    closeBundle() {
      const indexFile = path.join(outDir, 'index.html')
      if (!fs.existsSync(indexFile)) return
      const template = fs.readFileSync(indexFile, 'utf8')
      const write = (file, html) => {
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, html)
      }
      const render = (meta) => withSeo(template, meta).replace('<div id="root"></div>', `<div id="root"></div>${noscript(seo, meta)}`)

      const routes = indexableRoutes()
      for (const route of routes) {
        const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`
        write(path.join(outDir, file), render(routeMeta(route)))
      }
      write(path.join(outDir, '404.html'), render(routeMeta('/404')))

      const today = new Date().toISOString().slice(0, 10)
      const priority = (r) => (r === '/' ? '1.0' : r === '/services' || r === '/contact' ? '0.9' : r.startsWith('/services/') ? '0.8' : '0.7')
      write(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
          .map((r) => `  <url><loc>${absolute(r)}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${priority(r)}</priority></url>`)
          .join('\n')}\n</urlset>\n`,
      )
      write(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${absolute('/sitemap.xml')}\n`)
      write(
        path.join(outDir, '_headers'),
        `/*\n${Object.entries(securityHeaders).map(([k, v]) => `  ${k}: ${v}`).join('\n')}\n\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n`,
      )
    },
  }
}

// `vite preview` runs over plain http on localhost, so leave out the https-only directives there.
const previewHeaders = {
  ...securityHeaders,
  'Content-Security-Policy': csp.replace('; upgrade-insecure-requests', ''),
}
delete previewHeaders['Strict-Transport-Security']

export default defineConfig(async ({ command, mode }) => {
  // Contact details live in .env / the host's environment (see .env.example). Load them before the
  // SEO module reads src/config/site.js, so structured data and the static pages get real values.
  Object.assign(process.env, loadEnv(mode, process.cwd(), 'VITE_'))
  const { missingEnv } = await import('./src/config/site.js')
  const missing = missingEnv()
  if (missing.length) {
    const msg = `Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env (or set them on your host).`
    if (command === 'build') throw new Error(msg)
    console.warn(`\n⚠ ${msg}\n`)
  }
  const seo = await import('./src/seo/seo.js')

  return {
    plugins: [react(), tailwindcss(), seoBuild(seo)],
    // three.js (lazy-loaded with the 3D scene) is ~900 kB on its own; everything else stays well under 500 kB.
    build: { chunkSizeWarningLimit: 1000 },
    preview: { headers: previewHeaders },
  }
})
