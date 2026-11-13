/**
 * Central business configuration.
 * Business details shown across the site and given to search engines.
 */
export const site = {
  name: 'Advanta Tech',
  // Production domain — used for canonical URLs, the sitemap and social previews. No trailing slash.
  url: 'https://advantatech.co',
  tagline: 'Engineered growth. Assured quality.',
  description:
    'Advanta Tech is a digital growth and software quality studio: SEO, paid media, social, web and e-commerce development, branding, plus manual, automation, API and performance testing.',

  contact: {
    phoneDisplay: '+91 98884 44290',
    phoneHref: 'tel:+919888444290',
    email: 'hello@advantatech.co',
    address: ['Plot No. C-205, Phase 8B, Industrial Area', 'Sector 74, Sahibzada Ajit Singh Nagar', 'Punjab 140307'],
    // Same address, structured for search engines (schema.org PostalAddress)
    postal: {
      streetAddress: 'Plot No. C-205, Phase 8B, Industrial Area, Sector 74',
      addressLocality: 'Sahibzada Ajit Singh Nagar (Mohali)',
      addressRegion: 'Punjab',
      postalCode: '140307',
      addressCountry: 'IN',
    },
  },

  // International format, digits only (no +, spaces or dashes). Same as the mobile number.
  whatsappNumber: '919888444290',
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
