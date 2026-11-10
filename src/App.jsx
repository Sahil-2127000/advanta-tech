import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Inner pages are code-split; the home page ships in the main bundle (three.js is lazy everywhere).
const page = (load) => async () => ({ Component: (await load()).default })

const router = createBrowserRouter([
  {
    element: <Layout />,
    hydrateFallbackElement: <div className="min-h-svh bg-ink" />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services', lazy: page(() => import('./pages/Services')) },
      { path: '/services/:slug', lazy: page(() => import('./pages/ServiceDetail')) },
      { path: '/about', lazy: page(() => import('./pages/About')) },
      { path: '/process', lazy: page(() => import('./pages/Process')) },
      { path: '/contact', lazy: page(() => import('./pages/Contact')) },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  )
}
