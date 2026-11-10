import SectionLabel from '../ui/SectionLabel'
import RevealText from '../ui/RevealText'
import Button from '../ui/Button'
import ServiceCylinder from '../three/ServiceCylinder'

export default function ServicesOrbit() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-coal py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(198,255,0,0.07),transparent_60%)]" />
      <div className="container-x relative">
        <div className="text-center">
          <SectionLabel index="03" className="justify-center">Capabilities</SectionLabel>
          <RevealText text={'19 services.\n*One* system.'} className="display mx-auto mt-8 text-[length:var(--text-h1)]" />
        </div>
        <div className="mt-12 md:mt-6"><ServiceCylinder /></div>
        <div className="mt-8 flex justify-center">
          <Button to="/services" variant="outline">View all services</Button>
        </div>
      </div>
    </section>
  )
}
