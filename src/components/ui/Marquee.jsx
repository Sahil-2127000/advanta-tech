/** Infinite ticker. Content is duplicated once; CSS animation translates -50%. */
export default function Marquee({ items, className = '' }) {
  const row = (hidden) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="display px-6 sm:px-10">{item}</span>
          <span className="h-2.5 w-2.5 rotate-45 bg-volt" />
        </span>
      ))}
    </div>
  )
  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className}`}>
      <div className="animate-marquee flex">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
