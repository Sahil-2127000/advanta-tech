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

- `src/config/site.js` — phone, email, address, WhatsApp number, hours (**sample — confirm**), social links
- `src/data/services.js` — all 19 services: copy, deliverables, outcomes, tools
- `src/data/content.js` — stats, process, principles, industries, FAQ

## Forms

`src/lib/enquiry.js` is the single integration point. Set `VITE_ENQUIRY_ENDPOINT` (see `.env.example`) to any
endpoint that accepts JSON `POST`. Without it the form runs in demo mode and says so — nothing is sent.
