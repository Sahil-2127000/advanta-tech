# Advanta Tech — Digital Growth & Software QA Studio

Dark, editorial, 3D website for Advanta Tech.
React 19 + Vite 8, Tailwind CSS v4, React Router v7, Motion, three.js via React Three Fiber, Lucide icons.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Pages

| Route | Page |
| --- | --- |
| `/` | 3D hero, scroll-lit statement, two practices (tilt cards), 3D service rings, pinned 3D process stack, stats, industries, principles, FAQ, CTA |
| `/services` | All 19 services with Growth / Quality filter (`?practice=quality`) |
| `/services/:slug` | Reusable service template with a rotating 3D icon cube |
| `/about` | Story, mission & vision, principles, industries |
| `/process` | 4-step process, details, engagement models, FAQ |
| `/contact` | Channels, hours and project enquiry form (`?service=seo` preselects) |
| `*` | Custom 404 |

## 3D

- `src/components/three/CoreScene.jsx` — WebGL "core": chrome crystal with 14 Growth nodes and 5 Quality nodes in orbit.
  Follows the pointer and scroll, pauses off-screen, lighter on phones, static with reduced motion. Lazy-loaded.
- `TiltCard`, `ServiceCylinder`, `LayerStack`, `IconCube` — CSS-3D effects (no WebGL).

## Editing content

- `src/config/site.js` — phone, email, address, WhatsApp number, hours, social links
- `src/data/services.js` — all 19 services: copy, deliverables, outcomes, tools
- `src/data/content.js` — stats, process, principles, industries, FAQ

## Forms

`src/lib/enquiry.js` is the single integration point. Set `VITE_ENQUIRY_ENDPOINT` (see `.env.example`) to any
endpoint that accepts JSON `POST`. Without it the form runs in demo mode and says so — nothing is sent.

## SEO

- **One source of truth:** `src/seo/seo.js` holds every route's title, description, canonical URL, Open Graph / Twitter card and schema.org JSON-LD (ProfessionalService with address and contact, WebSite, FAQPage, Service, BreadcrumbList, ItemList, ContactPage, AboutPage).
- **Static HTML per page:** `npm run build` writes `dist/<route>.html` for all 24 pages with their own meta in the HTML, so Google and link previews (WhatsApp, LinkedIn, X) see them without running JavaScript. It also writes `404.html` (noindex), `sitemap.xml` and `robots.txt`.
- **Domain:** set `url` in `src/config/site.js` (currently `https://advantatech.co`). Canonicals, the sitemap and social images all use it.
- **Social image:** `public/og-image.png` (1200×630).
- **After launch:** submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools, and create or verify a Google Business Profile with the same address and phone.

## Security

- `npm audit`: 0 known vulnerabilities. No secrets in the repo; `.env` is git-ignored.
- **Security headers** (CSP, HSTS, nosniff, frame blocking, referrer and permissions policy) live in `security-headers.js`. The build writes them to `dist/_headers` (Netlify, Cloudflare Pages); `vercel.json` carries the same set for Vercel; `npm run preview` serves with them so you can test locally.
- **Enquiry form:** only whitelisted fields are sent, each trimmed and length-capped; inputs have `maxLength`; a hidden honeypot field silently drops bot submissions; double submits are ignored. Always validate again on whatever server receives the form.
