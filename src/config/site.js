/**
 * Central business configuration.
 *
 * Contact details (email, phone, WhatsApp, address) are NOT stored in the code: they come from
 * VITE_* environment variables — `.env` locally (git-ignored), or the hosting provider's
 * environment settings in production. See `.env.example` for the full list.
 * Note: anything shown on the website still ends up in the built pages; env vars keep it out of
 * the source code and the git repository.
 */

// Works in the browser bundle (import.meta.env) and when vite.config.js loads this file in Node (process.env).
const env = { ...(globalThis.process?.env ?? {}), ...(import.meta.env ?? {}) }
const read = (key) => String(env[key] ?? '').trim()

/** Required variables; the production build stops if any is missing. */
export const REQUIRED_ENV = [
  'VITE_CONTACT_EMAIL',
  'VITE_CONTACT_PHONE',
  'VITE_ADDRESS_STREET',
  'VITE_ADDRESS_AREA',
  'VITE_ADDRESS_CITY',
  'VITE_ADDRESS_REGION',
  'VITE_ADDRESS_POSTCODE',
]
export const missingEnv = () => REQUIRED_ENV.filter((k) => !read(k))

const phone = read('VITE_CONTACT_PHONE').replace(/[^\d+]/g, '') // e.g. +919876543210
const phoneDisplay = /^\+91\d{10}$/.test(phone) ? `+91 ${phone.slice(3, 8)} ${phone.slice(8)}` : phone
const email = read('VITE_CONTACT_EMAIL')
const address = {
  street: read('VITE_ADDRESS_STREET'),
  area: read('VITE_ADDRESS_AREA'),
  city: read('VITE_ADDRESS_CITY'),
  region: read('VITE_ADDRESS_REGION'),
  postcode: read('VITE_ADDRESS_POSTCODE'),
}

export const site = {
  name: 'Advanta Tech',
  // Production domain — used for canonical URLs, the sitemap and social previews. No trailing slash.
  url: 'https://advantatech.co',
  tagline: 'Engineered growth. Assured quality.',
  description:
    'Advanta Tech is a digital growth and software quality studio: SEO, paid media, social, web and e-commerce development, branding, plus manual, automation, API and performance testing.',

  contact: {
    phoneDisplay,
    phoneHref: `tel:${phone}`,
    email,
    address: [address.street, [address.area, address.city].filter(Boolean).join(', '), `${address.region} ${address.postcode}`.trim()].filter(Boolean),
    // Same address, structured for search engines (schema.org PostalAddress)
    postal: {
      streetAddress: [address.street, address.area].filter(Boolean).join(', '),
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postcode,
      addressCountry: 'IN',
    },
  },

  // Inbox that receives website enquiries (as formatted emails). Defaults to the contact email.
  enquiryInbox: read('VITE_ENQUIRY_INBOX') || email,

  // International format, digits only. Defaults to the contact phone.
  whatsappNumber: (read('VITE_WHATSAPP_NUMBER') || phone).replace(/\D/g, ''),
  whatsappMessage: "Hi Advanta Tech, I'd like to discuss a project.",

  hours: [
    { days: 'Mon — Fri', time: '10:00 — 18:00' },
    { days: 'Saturday', time: 'Closed' },
    { days: 'Sunday', time: 'Closed' },
  ],
  // Same hours in schema.org form for search engines
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '18:00' },

  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/advantatech/' },
    { label: 'Instagram', href: 'https://www.instagram.com/advantatech/' },
  ],
}

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/process', label: 'Process' },
  { to: '/contact', label: 'Contact' },
]

export const whatsappLink = (text = site.whatsappMessage) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`
