import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loading } from './loading'
import { Badge } from './badge'
import { Calculator, Zap, BarChart3, Wrench, Home, TrendingUp } from 'lucide-react'

interface PageLoadingProps {
  pageType?: 'calculator' | 'visualizer' | 'analyzer' | 'reports' | 'pathways' | 'dashboard'
  message?: string
  progress?: number
  className?: string
}

export function PageLoading({
  pageType = 'calculator',
  message,
  progress,
  className,
}: PageLoadingProps) {
  const getPageConfig = () => {
    switch (pageType) {
      case 'calculator':
        return {
          icon: <Calculator className="h-8 w-8 text-blue-600" />,
          title: 'Loading Calculator',
          description: 'Preparing financial calculations',
          gradient: 'from-blue-500 to-cyan-500',
          bgPattern: 'bg-blue-50',
        }
      case 'visualizer':
        return {
          icon: <Zap className="h-8 w-8 text-purple-600" />,
          title: 'Loading AI Visualizer',
          description: 'Initializing 3D rendering engine',
          gradient: 'from-purple-500 to-pink-500',
          bgPattern: 'bg-purple-50',
        }
      case 'analyzer':
        return {
          icon: <BarChart3 className="h-8 w-8 text-green-600" />,
          title: 'Loading AI Analyzer',
          description: 'Setting up market analysis tools',
          gradient: 'from-green-500 to-emerald-500',
          bgPattern: 'bg-green-50',
        }
      case 'reports':
        return {
          icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
          title: 'Loading Reports',
          description: 'Preparing detailed analysis',
          gradient: 'from-orange-500 to-red-500',
          bgPattern: 'bg-orange-50',
        }
      case 'pathways':
        return {
          icon: <Home className="h-8 w-8 text-indigo-600" />,
          title: 'Loading Pathways',
          description: 'Charting your financial journey',
          gradient: 'from-indigo-500 to-purple-500',
          bgPattern: 'bg-indigo-50',
        }
      case 'dashboard':
        return {
          icon: <Wrench className="h-8 w-8 text-gray-600" />,
          title: 'Loading Dashboard',
          description: 'Setting up your workspace',
          gradient: 'from-gray-500 to-slate-500',
          bgPattern: 'bg-gray-50',
        }
      default:
        return {
          icon: <Calculator className="h-8 w-8 text-blue-600" />,
          title: 'Loading',
          description: 'Please wait...',
          gradient: 'from-blue-500 to-cyan-500',
          bgPattern: 'bg-blue-50',
        }
    }
  }

  const config = getPageConfig()

  return (
    <div
      className={cn('min-h-[60vh] flex items-center justify-center', config.bgPattern, className)}
    >
      <div className="max-w-md mx-auto text-center space-y-6 p-8">
        {/* Icon with badge */}
        <div className="relative">
          <div
            className={cn(
              'inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r',
              config.gradient,
              'shadow-lg'
            )}
          >
            {config.icon}
          </div>
          {pageType === 'visualizer' || pageType === 'analyzer' || pageType === 'reports' ? (
            <div className="absolute -top-2 -right-2">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs px-2 py-0.5"
              >
                💎 Premium
              </Badge>
            </div>
          ) : null}
        </div>

        {/* Title and description */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{message || config.title}</h2>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>

        {/* Progress bar if provided */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full bg-gradient-to-r transition-all duration-300 ease-out',
                  config.gradient
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
          </div>
        )}

        {/* Loading animation */}
        <div className="flex justify-center">
          <Loading variant="tech" size="md" />
        </div>

        {/* Feature hints */}
        <div className="text-xs text-muted-foreground space-y-1">
          {pageType === 'visualizer' && (
            <>
              <p>• AI-powered 3D model generation</p>
              <p>• Real-time material analysis</p>
              <p>• Professional rendering</p>
            </>
          )}
          {pageType === 'analyzer' && (
            <>
              <p>• Market trend analysis</p>
              <p>• Property valuation</p>
              <p>• Risk assessment</p>
            </>
          )}
          {pageType === 'calculator' && (
            <>
              <p>• ROI calculations</p>
              <p>• Financial projections</p>
              <p>• Investment analysis</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Specialized page loaders
export function CalculatorPageLoading({
  message,
  progress,
}: {
  message?: string
  progress?: number
}) {
  return <PageLoading pageType="calculator" message={message} progress={progress} />
}

export function VisualizerPageLoading({
  message,
  progress,
}: {
  message?: string
  progress?: number
}) {
  return <PageLoading pageType="visualizer" message={message} progress={progress} />
}

export function AnalyzerPageLoading({
  message,
  progress,
}: {
  message?: string
  progress?: number
}) {
  return <PageLoading pageType="analyzer" message={message} progress={progress} />
}

export function ReportsPageLoading({ message, progress }: { message?: string; progress?: number }) {
  return <PageLoading pageType="reports" message={message} progress={progress} />
}

export function PathwaysPageLoading({
  message,
  progress,
}: {
  message?: string
  progress?: number
}) {
  return <PageLoading pageType="pathways" message={message} progress={progress} />
}

export function DashboardPageLoading({
  message,
  progress,
}: {
  message?: string
  progress?: number
}) {
  return <PageLoading pageType="dashboard" message={message} progress={progress} />
}
