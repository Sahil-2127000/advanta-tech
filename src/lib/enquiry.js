/**
 * Enquiry submission — the single integration point for every form on the site.
 *
 * By default each enquiry is emailed to the business inbox as a formatted table through
 * FormSubmit (https://formsubmit.co) — no backend or account needed. The very first
 * submission triggers a one-time activation email to that inbox; click "Activate Form" in it.
 *
 * VITE_ENQUIRY_ENDPOINT can point somewhere else instead: the Google Apps Script web app in
 * google-apps-script/Code.gs (saves rows to a Google Sheet) or any endpoint accepting JSON.
 */
import { getService } from '../data/services'
import { site } from '../config/site'

const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT || `https://formsubmit.co/ajax/${site.enquiryInbox}`

const isFormSubmit = ENDPOINT.startsWith('https://formsubmit.co/')
// Apps Script web apps can't answer a CORS preflight, so they get a "simple" text/plain request
// (the body is still JSON).
const isAppsScript = ENDPOINT.startsWith('https://script.google.com/')

/** Only these fields ever leave the browser, trimmed and length-capped. */
export const LIMITS = { name: 100, email: 254, phone: 20, company: 120, service: 60, budget: 40, message: 1500 }

export function cleanEnquiry(values) {
  return Object.fromEntries(Object.entries(LIMITS).map(([k, max]) => [k, String(values[k] ?? '').trim().slice(0, max)]))
}

const serviceLabel = (slug) => getService(slug)?.name ?? (slug === 'not-sure' ? 'Not sure — advise me' : slug)

/** The email: subject line, a table of the answers, Reply-To set to the customer, and an auto-reply to them. */
function formSubmitBody(d) {
  const service = serviceLabel(d.service)
  return {
    _subject: `New enquiry: ${d.name} — ${service}`,
    _template: 'table',
    _captcha: 'false',
    _replyto: d.email,
    _autoresponse: `Thanks for contacting ${site.name}! We have received your enquiry about ${service} and will get back to you within one working day. For anything urgent, call or WhatsApp us on ${site.contact.phoneDisplay}.`,
    Name: d.name,
    email: d.email,
    Phone: d.phone,
    Company: d.company || '—',
    Service: service,
    Budget: d.budget || '—',
    Message: d.message,
    'Sent from': window.location.href,
    'Submitted at': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST',
  }
}

/**
 * `website` is a honeypot: the field is invisible to people, so anything typed into it came from a bot.
 * Bots get a normal-looking success response and nothing is sent.
 */
export async function submitEnquiry(values) {
  if (values.website) return { ok: true }
  const payload = cleanEnquiry(values)
  const body = isFormSubmit
    ? formSubmitBody(payload)
    : { ...payload, serviceName: serviceLabel(payload.service), page: window.location.pathname, submittedAt: new Date().toISOString() }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: isAppsScript ? { 'Content-Type': 'text/plain;charset=utf-8' } : { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  // FormSubmit answers { success: "true" | "false", message }, the Apps Script { ok, error }.
  const reply = await res.json().catch(() => ({}))
  if (reply.ok === false || reply.success === false || reply.success === 'false') {
    throw new Error(reply.error || reply.message || 'The enquiry could not be sent.')
  }
  return { ok: true }
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
