/**
 * Central business configuration.
 * Contact details below are SAMPLE / PLACEHOLDER values — replace before launch.
 */
export const site = {
  name: 'Advanta Tech',
  tagline: 'Engineered growth. Assured quality.',
  description:
    'Advanta Tech is a digital growth and software quality studio: SEO, paid media, social, web and e-commerce development, branding, plus manual, automation, API and performance testing.',

  contact: {
    phoneDisplay: '+00 000 000 0000', // placeholder
    phoneHref: 'tel:+000000000000',
    email: 'hello@advantatech.example',
    address: ['00 Business Park Road', 'Sector 00', 'Your City 000000'],
  },

  // International format, digits only (no +, spaces or dashes). Placeholder.
  whatsappNumber: '000000000000',
  whatsappMessage: "Hi Advanta Tech, I'd like to discuss a project.",

  hours: [
    { days: 'Mon — Fri', time: '09:30 — 18:30' },
    { days: 'Saturday', time: '10:00 — 14:00' },
    { days: 'Sunday', time: 'Closed' },
  ],

  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/' },
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'X / Twitter', href: 'https://x.com/' },
    { label: 'YouTube', href: 'https://youtube.com/' },
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
