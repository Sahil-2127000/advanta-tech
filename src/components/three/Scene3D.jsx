import { Component, lazy, Suspense, useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const CoreScene = lazy(() => import('./CoreScene'))

/** Soft static glow shown while three.js loads, or if WebGL is unavailable. */
function Fallback() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div className="h-[46%] aspect-square rotate-45 border border-accent/20 bg-[radial-gradient(circle,rgba(77,141,255,0.18),transparent_65%)]" />
    </div>
  )
}

class WebGLBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children
  }
}

/** Lazy, self-pausing wrapper around the WebGL scene. */
export default function Scene3D({ className = '', progress, ...props }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '120px' })
  const reduce = useReducedMotion()
  const lite = useMediaQuery('(max-width: 767px)')

  return (
    <div ref={ref} className={`relative ${className}`}>
      <WebGLBoundary>
        <Suspense fallback={<Fallback />}>
          <CoreScene active={inView && !reduce} progress={reduce ? undefined : progress} lite={lite} {...props} />
        </Suspense>
      </WebGLBoundary>
    </div>
  )
}
