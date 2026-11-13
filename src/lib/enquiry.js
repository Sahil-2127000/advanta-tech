/**
 * Enquiry submission — the single integration point for every form on the site.
 *
 * Set VITE_ENQUIRY_ENDPOINT (see .env.example) to any endpoint that accepts JSON
 * via POST (Formspree, Basin, your own API…). Without it, forms run in demo mode:
 * nothing is sent and the UI says so honestly.
 */
const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT

export const isDemoMode = !ENDPOINT

export async function submitEnquiry(payload) {
  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 700))
    return { ok: true, demo: true }
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return { ok: true, demo: false }
}

export function validateEnquiry(values) {
  const errors = {}
  if (!values.name?.trim() || values.name.trim().length < 2) errors.name = 'Tell us your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email?.trim() ?? '')) errors.email = 'Enter a valid work email.'
  const phone = values.phone?.trim() ?? ''
  if (!phone) errors.phone = 'Add a phone number so we can call you back.'
  else if (!/^[+\d][\d\s()-]*$/.test(phone) || phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid phone number (at least 10 digits).'
  if (!values.service) errors.service = 'Pick the service you need.'
  if (!values.message?.trim() || values.message.trim().length < 10) errors.message = 'A sentence or two about your project helps.'
  else if (values.message.length > 1500) errors.message = 'Keep it under 1500 characters.'
  if (!values.consent) errors.consent = 'Please agree so we can reply to you.'
  return errors
}
