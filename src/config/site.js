/**
 * Central business configuration.
 * Office hours are still sample values — confirm before launch.
 */
export const site = {
  name: 'Advanta Tech',
  tagline: 'Engineered growth. Assured quality.',
  description:
    'Advanta Tech is a digital growth and software quality studio: SEO, paid media, social, web and e-commerce development, branding, plus manual, automation, API and performance testing.',

  contact: {
    phoneDisplay: '+91 98884 44290',
    phoneHref: 'tel:+919888444290',
    email: 'hello@advantatech.co',
    address: ['Plot No. C-205, Phase 8B, Industrial Area', 'Sector 74, Sahibzada Ajit Singh Nagar', 'Punjab 140307'],
  },

  // International format, digits only (no +, spaces or dashes). Same as the mobile number.
  whatsappNumber: '919888444290',
  whatsappMessage: "Hi Advanta Tech, I'd like to discuss a project.",

  hours: [
    { days: 'Mon — Fri', time: '09:30 — 18:30' },
    { days: 'Saturday', time: '10:00 — 14:00' },
    { days: 'Sunday', time: 'Closed' },
  ],

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
