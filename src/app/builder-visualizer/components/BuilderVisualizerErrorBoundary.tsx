'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class BuilderVisualizerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Builder Visualizer Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <h2 className="text-2xl font-bold mb-4 text-red-400">Builder Visualizer Error</h2>
              <p className="text-gray-300 mb-6">
                Something went wrong with the 3D visualizer. This might be due to WebGL
                compatibility issues or context loss.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Reload Page
                </Button>
                <Button
                  onClick={() => this.setState({ hasError: false })}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Try Again
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-400">
                    Error Details (Dev Mode)
                  </summary>
                  <pre className="mt-2 text-xs text-red-300 bg-gray-800 p-2 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
