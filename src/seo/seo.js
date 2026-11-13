/**
 * Single source of truth for SEO: titles, descriptions, canonical URLs, social cards and
 * schema.org structured data for every route. Used at runtime (components/layout/Seo.jsx)
 * and at build time (vite.config.js writes a static HTML file per route from it).
 */
import { site } from '../config/site.js'
import { practices, services, getService } from '../data/services.js'
import { faqs } from '../data/content.js'

const ORG_ID = `${site.url}/#organization`
const SITE_ID = `${site.url}/#website`

export const absolute = (path = '/') => `${site.url}${path === '/' ? '/' : path}`

const clip = (text, max = 158) => {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length <= max ? t : `${t.slice(0, max - 1).replace(/[\s,.;:—-]+\S*$/, '')}…`
}

const breadcrumb = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absolute(path) })),
})

/** The business itself — included on every page. */
export function organizationSchema() {
  return [
    {
      '@type': 'ProfessionalService',
      '@id': ORG_ID,
      name: site.name,
      alternateName: 'AdvantaTech',
      url: absolute('/'),
      logo: absolute('/advanta-logo.png'),
      image: absolute('/og-image.png'),
      description: site.description,
      slogan: site.tagline,
      email: site.contact.email,
      telephone: site.contact.phoneHref.replace('tel:', ''),
      address: { '@type': 'PostalAddress', ...site.contact.postal },
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: site.openingHours.days, opens: site.openingHours.opens, closes: site.openingHours.closes }],
      areaServed: [{ '@type': 'Country', name: 'India' }, 'Worldwide'],
      sameAs: site.socials.map((s) => s.href),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: site.contact.phoneHref.replace('tel:', ''),
        email: site.contact.email,
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Punjabi'],
      },
      knowsAbout: services.map((s) => s.name),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Digital marketing and software testing services',
        itemListElement: Object.values(practices).map((p) => ({
          '@type': 'OfferCatalog',
          name: p.title,
          itemListElement: services
            .filter((s) => s.practice === p.id)
            .map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: absolute(`/services/${s.slug}`) } })),
        })),
      },
    },
    { '@type': 'WebSite', '@id': SITE_ID, url: absolute('/'), name: site.name, publisher: { '@id': ORG_ID }, inLanguage: 'en-IN' },
  ]
}

const page = ({ path, title, description, type = 'website', schema = [], noindex = false }) => ({
  path,
  title,
  description: clip(description),
  url: absolute(path),
  image: absolute('/og-image.png'),
  type,
  noindex,
  schema: [...organizationSchema(), ...schema],
})

const notFound = (path) =>
  page({ path, title: `Page not found | ${site.name}`, description: 'This page does not exist.', noindex: true })

/** SEO for a pathname. Unknown paths get a noindex 404 entry. */
export function routeMeta(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/'

  if (path === '/') {
    return page({
      path,
      title: `${site.name} | Digital Marketing & Software Testing Company`,
      description:
        'Advanta Tech is a digital marketing and software testing company in Mohali, Punjab: SEO, social media, PPC, web & e-commerce development, branding, and manual, automation, API & performance QA.',
      schema: [
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        },
      ],
    })
  }

  if (path === '/services') {
    return page({
      path,
      title: `Digital Marketing & QA Testing Services | ${site.name}`,
      description:
        '19 specialist services: SEO, social media marketing, PPC, web design & development, e-commerce, content, branding, video, email & WhatsApp marketing, plus manual, automation, API, performance and mobile testing.',
      schema: [
        breadcrumb([['Home', '/'], ['Services', '/services']]),
        {
          '@type': 'ItemList',
          name: `${site.name} services`,
          itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: absolute(`/services/${s.slug}`) })),
        },
      ],
    })
  }

  const match = path.match(/^\/services\/([^/]+)$/)
  if (match) {
    const s = getService(match[1])
    if (!s) return notFound(path)
    const practice = practices[s.practice]
    return page({
      path,
      title: `${s.name} Services | ${site.name}`,
      description: `${s.summary} ${s.intro}`,
      schema: [
        breadcrumb([['Home', '/'], ['Services', '/services'], [s.name, path]]),
        {
          '@type': 'Service',
          name: s.name,
          serviceType: s.name,
          category: practice.title,
          description: `${s.summary} ${s.intro}`,
          url: absolute(path),
          provider: { '@id': ORG_ID },
          areaServed: [{ '@type': 'Country', name: 'India' }, 'Worldwide'],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${s.name} deliverables`,
            itemListElement: s.deliverables.map((d) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: d } })),
          },
        },
      ],
    })
  }

  if (path === '/about') {
    return page({
      path,
      title: `About Us | ${site.name} — Marketing Meets Engineering`,
      description:
        'Advanta Tech brings digital marketing and software quality assurance together in one accountable team, based in Mohali, Punjab and working with brands across India and worldwide.',
      schema: [breadcrumb([['Home', '/'], ['About', '/about']]), { '@type': 'AboutPage', about: { '@id': ORG_ID }, url: absolute(path) }],
    })
  }

  if (path === '/process') {
    return page({
      path,
      title: `Our Process | ${site.name}`,
      description:
        'How Advanta Tech works: discover, strategise, execute and optimise — with flexible project, retainer and dedicated-team engagement models.',
      schema: [breadcrumb([['Home', '/'], ['Process', '/process']])],
    })
  }

  if (path === '/contact') {
    return page({
      path,
      title: `Contact ${site.name} | Mohali, Punjab`,
      description: `Start a project with Advanta Tech. Call ${site.contact.phoneDisplay}, email ${site.contact.email} or send an enquiry — free discovery call and a written proposal within one working day.`,
      schema: [breadcrumb([['Home', '/'], ['Contact', '/contact']]), { '@type': 'ContactPage', about: { '@id': ORG_ID }, url: absolute(path) }],
    })
  }

  return notFound(path)
}

/** Every indexable route, for the sitemap and the static HTML build. */
export const indexableRoutes = () => ['/', '/services', ...services.map((s) => `/services/${s.slug}`), '/about', '/process', '/contact']

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** JSON-LD safe to embed in a <script> element. */
const jsonLd = (graph) => JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')

/** The <head> tags for a route, each marked data-seo so the runtime can swap them on navigation. */
export function headTags(m) {
  return [
    `<title data-seo>${esc(m.title)}</title>`,
    `<meta data-seo name="description" content="${esc(m.description)}" />`,
    `<meta data-seo name="robots" content="${m.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}" />`,
    m.noindex ? '' : `<link data-seo rel="canonical" href="${esc(m.url)}" />`,
    `<meta data-seo property="og:type" content="${m.type}" />`,
    `<meta data-seo property="og:site_name" content="${esc(site.name)}" />`,
    `<meta data-seo property="og:locale" content="en_IN" />`,
    `<meta data-seo property="og:title" content="${esc(m.title)}" />`,
    `<meta data-seo property="og:description" content="${esc(m.description)}" />`,
    `<meta data-seo property="og:url" content="${esc(m.url)}" />`,
    `<meta data-seo property="og:image" content="${esc(m.image)}" />`,
    `<meta data-seo property="og:image:width" content="1200" />`,
    `<meta data-seo property="og:image:height" content="630" />`,
    `<meta data-seo property="og:image:alt" content="${esc(`${site.name} — ${site.tagline}`)}" />`,
    `<meta data-seo name="twitter:card" content="summary_large_image" />`,
    `<meta data-seo name="twitter:title" content="${esc(m.title)}" />`,
    `<meta data-seo name="twitter:description" content="${esc(m.description)}" />`,
    `<meta data-seo name="twitter:image" content="${esc(m.image)}" />`,
    `<script data-seo type="application/ld+json">${jsonLd(m.schema)}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')
}
