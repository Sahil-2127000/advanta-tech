import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Check, Loader2 } from 'lucide-react'
import Button from '../ui/Button'
import { practices, services } from '../../data/services'
import { isDemoMode, submitEnquiry, validateEnquiry } from '../../lib/enquiry'
import { whatsappLink } from '../../config/site'

const budgets = ['Not sure yet', 'Under $1k / month', '$1k — $5k / month', '$5k — $15k / month', '$15k+ / month', 'One-off project']
const empty = { name: '', email: '', phone: '', company: '', service: '', budget: '', message: '', consent: false }

function Field({ id, label, error, optional, children }) {
  return (
    <div className="group/f relative">
      <label htmlFor={id} className="label flex justify-between text-mute transition-colors group-focus-within/f:text-accent">
        <span>{label}</span>
        {optional && <span className="text-mute/60">Optional</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-xs text-danger" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AlertCircle className="h-3.5 w-3.5" aria-hidden /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputCls = (err) =>
  `mt-2 block w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-base text-bone placeholder:text-mute/50 transition-colors focus:outline-none focus-visible:outline-none ${err ? 'border-danger' : 'border-line focus:border-accent'}`

const chevron = { backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234d8dff' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")" }

/** Project enquiry form; data goes through lib/enquiry.js. */
export default function EnquiryForm({ defaultService = '' }) {
  const uid = useId()
  const [values, setValues] = useState({ ...empty, service: defaultService })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [result, setResult] = useState(null)
  const id = (k) => `${uid}-${k}`
  const describedBy = (k) => (errors[k] ? `${id(k)}-error` : undefined)

  const set = (key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((s) => ({ ...s, [key]: v }))
    if (errors[key]) setErrors((s) => ({ ...s, [key]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validateEnquiry(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(id(Object.keys(errs)[0]))?.focus()
      return
    }
    setStatus('sending')
    try {
      setResult(await submitEnquiry(values))
      setStatus('success')
    } catch (err) {
      setResult({ error: err.message })
      setStatus('error')
    }
  }

  const reset = () => {
    setValues({ ...empty, service: defaultService })
    setStatus('idle')
    setResult(null)
  }

  if (status === 'success') {
    const serviceName = services.find((s) => s.slug === values.service)?.name
    return (
      <motion.div role="status" className="glass p-8 sm:p-10" initial={{ opacity: 0, y: 20, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} style={{ transformPerspective: 900 }}>
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-white"><Check className="h-6 w-6" aria-hidden /></span>
        <h3 className="display mt-6 text-4xl sm:text-5xl">Enquiry {result?.demo ? 'captured' : 'received'}.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-bone/70">
          Thanks, {values.name.split(' ')[0]}.{' '}
          {result?.demo
            ? 'This site is running in demo mode, so nothing was transmitted. Message us on WhatsApp to reach the team directly.'
            : `We'll be in touch about ${serviceName ?? 'your project'} within one working day.`}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={whatsappLink(`Hi Advanta Tech, I'm ${values.name}.${serviceName ? ` I'm interested in ${serviceName}.` : ''} ${values.message}`.trim())}>Continue on WhatsApp</Button>
          <Button variant="outline" icon={false} onClick={reset} type="button">New enquiry</Button>
        </div>
      </motion.div>
    )
  }

  const input = (k, props) => (
    <input id={id(k)} value={values[k]} onChange={set(k)} className={inputCls(errors[k])} aria-invalid={!!errors[k]} aria-describedby={describedBy(k)} {...props} />
  )

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 sm:grid-cols-2">
      <Field id={id('name')} label="Full name" error={errors.name}>{input('name', { type: 'text', autoComplete: 'name', placeholder: 'Your name' })}</Field>
      <Field id={id('email')} label="Work email" error={errors.email}>{input('email', { type: 'email', autoComplete: 'email', placeholder: 'you@company.com' })}</Field>
      <Field id={id('phone')} label="Phone / WhatsApp" error={errors.phone}>{input('phone', { type: 'tel', autoComplete: 'tel', inputMode: 'tel', placeholder: '+91 98765 43210' })}</Field>
      <Field id={id('company')} label="Company" optional>{input('company', { type: 'text', autoComplete: 'organization', placeholder: 'Company or website' })}</Field>
      <Field id={id('service')} label="Service needed" error={errors.service}>
        <select id={id('service')} value={values.service} onChange={set('service')} className={`${inputCls(errors.service)} appearance-none bg-[length:12px] bg-[right_center] bg-no-repeat pr-6`} style={chevron} aria-invalid={!!errors.service} aria-describedby={describedBy('service')}>
          <option value="" className="bg-coal">Select a service</option>
          {Object.values(practices).map((p) => (
            <optgroup key={p.id} label={p.title} className="bg-coal">
              {services.filter((s) => s.practice === p.id).map((s) => <option key={s.slug} value={s.slug} className="bg-coal">{s.name}</option>)}
            </optgroup>
          ))}
          <option value="not-sure" className="bg-coal">Not sure — advise me</option>
        </select>
      </Field>
      <Field id={id('budget')} label="Budget" optional>
        <select id={id('budget')} value={values.budget} onChange={set('budget')} className={`${inputCls()} appearance-none bg-[length:12px] bg-[right_center] bg-no-repeat pr-6`} style={chevron}>
          <option value="" className="bg-coal">Select a range</option>
          {budgets.map((b) => <option key={b} value={b} className="bg-coal">{b}</option>)}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field id={id('message')} label="Project details" error={errors.message}>
          <textarea id={id('message')} rows={4} value={values.message} onChange={set('message')} className={`${inputCls(errors.message)} resize-none`} aria-invalid={!!errors.message} aria-describedby={describedBy('message')} placeholder="Goals, timelines, what's not working today…" />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-bone/70">
          <input id={id('consent')} type="checkbox" checked={values.consent} onChange={set('consent')} className="peer sr-only" aria-invalid={!!errors.consent} aria-describedby={describedBy('consent')} />
          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border transition-colors peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${errors.consent ? 'border-danger' : 'border-bone/40'}`}>
            {values.consent && <Check className="h-3.5 w-3.5 text-white" aria-hidden />}
          </span>
          I agree to be contacted about this enquiry. We never share your details.
        </label>
        {errors.consent && <p id={`${id('consent')}-error`} className="mt-2 flex items-center gap-1.5 text-xs text-danger"><AlertCircle className="h-3.5 w-3.5" aria-hidden /> {errors.consent}</p>}
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={status === 'sending'} icon={status !== 'sending'}>
          {status === 'sending' ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending</span> : 'Send enquiry'}
        </Button>
        {isDemoMode && <p className="label text-[0.6rem] text-mute/80">Demo mode — no data is sent. See lib/enquiry.js</p>}
      </div>
      <AnimatePresence>
        {status === 'error' && (
          <motion.p role="alert" className="flex items-center gap-2 border border-danger/40 bg-danger/10 p-4 text-sm text-danger sm:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden /> Something went wrong ({result?.error}). Please try again or message us on WhatsApp.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}
