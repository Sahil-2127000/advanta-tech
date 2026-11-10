import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const base =
  'group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors duration-500 ease-[var(--ease-out-expo)] min-h-12 px-6 sm:px-7 rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: { root: 'bg-volt text-ink', fill: 'bg-bone', hoverText: 'group-hover/btn:text-ink' },
  outline: { root: 'border border-bone/30 text-bone', fill: 'bg-bone', hoverText: 'group-hover/btn:text-ink' },
  dark: { root: 'bg-ink text-bone', fill: 'bg-volt', hoverText: 'group-hover/btn:text-ink' },
}

/**
 * Industrial button with a sliding fill and an arrow that exits/enters on hover.
 * Renders a router Link (`to`), an anchor (`href`) or a native button.
 */
export default function Button({ to, href, variant = 'primary', icon = true, className = '', children, ...props }) {
  const v = variants[variant]
  const content = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom translate-y-[101%] ${v.fill} transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-y-0`}
      />
      <span className={`relative z-10 transition-colors duration-300 ${v.hoverText}`}>{children}</span>
      {icon && (
        <span className={`relative z-10 inline-flex h-4 w-4 overflow-hidden transition-colors duration-300 ${v.hoverText}`} aria-hidden>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-full group-hover/btn:-translate-y-full" />
          <ArrowUpRight className="absolute h-4 w-4 -translate-x-full translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
        </span>
      )}
    </>
  )
  const cls = `${base} ${v.root} ${className}`

  if (to) return <Link to={to} className={cls} {...props}>{content}</Link>
  if (href) {
    const external = href.startsWith('http')
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...props}>
        {content}
      </a>
    )
  }
  return <button className={cls} {...props}>{content}</button>
}

/** Minimal text link with an animated underline and arrow. */
export function TextLink({ to, href, children, className = '' }) {
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-volt transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/tl:origin-left group-hover/tl:scale-x-100" />
      </span>
      <ArrowUpRight className="h-4 w-4 text-volt transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/tl:translate-x-1 group-hover/tl:-translate-y-1" aria-hidden />
    </>
  )
  const cls = `group/tl inline-flex items-center gap-2 label text-bone ${className}`
  return to ? <Link to={to} className={cls}>{inner}</Link> : <a href={href} className={cls}>{inner}</a>
}
