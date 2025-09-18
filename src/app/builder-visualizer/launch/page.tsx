'use client'

import { useEffect, useState, Suspense } from 'react'
import HouseVisualizer from '../components/HouseVisualizer'
import { BuilderVisualizerErrorBoundary } from '../components/BuilderVisualizerErrorBoundary'

function LoadingFallback() {
  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <div className="text-white text-lg">Loading Builder Visualizer...</div>
        <div className="text-gray-400 text-sm mt-2">Initializing 3D engine...</div>
      </div>
    </div>
  )
}

export default function BuilderVisualizerLaunch() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Prevent scrolling on the body when in fullscreen mode
    document.body.style.overflow = 'hidden'

    // Set mounted state to prevent hydration issues
    setIsMounted(true)

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Prevent hydration mismatch by only rendering after mount
  if (!isMounted) {
    return <LoadingFallback />
  }

  return (
    <BuilderVisualizerErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <div className="h-screen w-screen bg-gray-900">
          <HouseVisualizer />
        </div>
      </Suspense>
    </BuilderVisualizerErrorBoundary>
  )
}
