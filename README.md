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

## Enquiries by email (default)

Every contact-form submission is emailed to `enquiryInbox` in `src/config/site.js` (`hello@advantatech.co`) through [FormSubmit](https://formsubmit.co) — free, no backend, no account.

- **The email:** subject `New enquiry: <name> — <service>`, the answers laid out as a table (name, email, phone, company, service, budget, message, page, time in IST), and **Reply** goes straight to the customer.
- **The customer** gets an automatic confirmation email from FormSubmit.
- **One-time activation:** the first enquiry sent from the live site makes FormSubmit email `hello@advantatech.co` an **"Activate Form"** link. Click it once; until then, submissions show a "needs Activation" error. That first enquiry is not delivered, so send a test enquiry yourself right after going live.
- **Optional, after activation:** FormSubmit also emails a random alias (like `https://formsubmit.co/ajax/a1b2c3…`). Setting `VITE_ENQUIRY_ENDPOINT` to that URL hides the inbox address from the site's code.
- **Changing the inbox:** edit `enquiryInbox`, rebuild, and activate again for the new address.

## Enquiries to Google Sheets (optional)

Every contact-form submission can be saved as a row in a Google Sheet — no server needed. The script is in [`google-apps-script/Code.gs`](google-apps-script/Code.gs).

1. **Create the sheet.** Go to [sheets.new](https://sheets.new) and name it, e.g. "Advanta Tech Enquiries". You don't need to add headers; the script creates them.
2. **Add the script.** In the sheet: **Extensions → Apps Script**. Delete what's in `Code.gs`, paste the whole of `google-apps-script/Code.gs`, and click **Save**.
   - Optional: change `NOTIFY_EMAIL` at the top (default `hello@advantatech.co`) or set it to `''` to turn off email alerts.
3. **Deploy.** Click **Deploy → New deployment** → gear icon → **Web app**.
   - Description: `Enquiry form`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, then **Authorize access** and allow it (Google shows an "unverified app" warning for your own scripts: **Advanced → Go to … (unsafe)** — it's your script).
4. **Copy the Web app URL** (it ends in `/exec`). Opening it in a browser should show `{"ok":true,"service":"Advanta Tech enquiries"}`.
5. **Connect the website.** Set `VITE_ENQUIRY_ENDPOINT` to that URL:
   - locally: create `.env` with `VITE_ENQUIRY_ENDPOINT=https://script.google.com/macros/s/…/exec`
   - on your host (Vercel / Netlify / Cloudflare Pages): add it as an environment variable, then redeploy — the value is built into the site.
6. **Test** by sending an enquiry from the contact page; a row appears in the **Enquiries** tab within a couple of seconds.

**If you edit the script later**, publish the change with **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same.

What the script does: validates the fields again, ignores honeypot (bot) submissions, stores text starting with `= + - @` as plain text so nobody can inject spreadsheet formulas, caps intake at 30 enquiries per 10 minutes, and emails each new enquiry with Reply-To set to the customer.
