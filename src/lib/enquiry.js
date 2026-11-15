/**
 * Enquiry submission — the single integration point for every form on the site.
 *
 * Set VITE_ENQUIRY_ENDPOINT (see .env.example) to the Google Apps Script web app URL
 * (google-apps-script/Code.gs saves each enquiry as a row in a Google Sheet), or to any
 * endpoint that accepts JSON via POST. Without it, forms run in demo mode: nothing is sent
 * and the UI says so honestly.
 */
import { getService } from '../data/services'

const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT

export const isDemoMode = !ENDPOINT

// Apps Script web apps can't answer a CORS preflight, so they get a "simple" text/plain request
// (the body is still JSON). Everything else gets a normal JSON request.
const isAppsScript = ENDPOINT?.startsWith('https://script.google.com/')

/** Only these fields ever leave the browser, trimmed and length-capped. */
export const LIMITS = { name: 100, email: 254, phone: 20, company: 120, service: 60, budget: 40, message: 1500 }

export function cleanEnquiry(values) {
  return Object.fromEntries(Object.entries(LIMITS).map(([k, max]) => [k, String(values[k] ?? '').trim().slice(0, max)]))
}

/**
 * `website` is a honeypot: the field is invisible to people, so anything typed into it came from a bot.
 * Bots get a normal-looking success response and nothing is sent.
 */
export async function submitEnquiry(values) {
  if (values.website) return { ok: true, demo: false }
  const payload = cleanEnquiry(values)
  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 700))
    return { ok: true, demo: true }
  }
  const body = JSON.stringify({
    ...payload,
    serviceName: getService(payload.service)?.name ?? (payload.service === 'not-sure' ? 'Not sure — advise me' : payload.service),
    page: window.location.pathname,
    submittedAt: new Date().toISOString(),
  })
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: isAppsScript ? { 'Content-Type': 'text/plain;charset=utf-8' } : { 'Content-Type': 'application/json', Accept: 'application/json' },
    body,
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  // The Apps Script always answers 200 and puts the outcome in the JSON body.
  const reply = await res.json().catch(() => ({ ok: true }))
  if (reply.ok === false) throw new Error(reply.error || 'The enquiry could not be saved.')
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
  else if (values.message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`
  if (values.name && values.name.length > LIMITS.name) errors.name = 'That name is too long.'
  if (values.company && values.company.length > LIMITS.company) errors.company = 'That is too long.'
  if (!values.consent) errors.consent = 'Please agree so we can reply to you.'
  return errors
}
