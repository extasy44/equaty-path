import * as React from 'react'
import { ModuleLoader, TechLoader } from './loading'
import { Badge } from './badge'

interface FeatureLoaderProps {
  featureName: string
  isPremium?: boolean
  children: React.ReactNode
  loading?: boolean
}

export function FeatureLoader({
  featureName,
  isPremium = false,
  children,
  loading = false,
}: FeatureLoaderProps) {
  const [isLoading, setIsLoading] = React.useState(loading)
  const [showContent, setShowContent] = React.useState(!loading)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (loading !== undefined) {
      setIsLoading(loading)
      setShowContent(!loading)
      return
    }

    // If no loading prop is provided, show content immediately
    setIsLoading(false)
    setShowContent(true)
  }, [loading])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        {isPremium ? (
          <div className="text-center space-y-4">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-sm px-3 py-1"
            >
              💎 Premium Feature
            </Badge>
            <TechLoader message={`Initializing ${featureName}`} />
          </div>
        ) : (
          <ModuleLoader moduleName={featureName} />
        )}
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  )
}

// Specialized loaders for different feature types
export function CalculatorLoader({ children }: { children: React.ReactNode }) {
  return (
    <FeatureLoader featureName="Calculator" isPremium={false}>
      {children}
    </FeatureLoader>
  )
}

export function VisualizerLoader({ children }: { children: React.ReactNode }) {
  return (
    <FeatureLoader featureName="AI Visualizer" isPremium={true}>
      {children}
    </FeatureLoader>
  )
}

export function AnalyzerLoader({ children }: { children: React.ReactNode }) {
  return (
    <FeatureLoader featureName="AI Analyzer" isPremium={true}>
      {children}
    </FeatureLoader>
  )
}

export function ReportLoader({ children }: { children: React.ReactNode }) {
  return (
    <FeatureLoader featureName="Premium Reports" isPremium={true}>
      {children}
    </FeatureLoader>
  )
}
