'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WebGL Error Boundary caught an error:', error, errorInfo)

    // Check if it's a WebGL context loss error
    if (error.message.includes('Context Lost') || error.message.includes('WebGL')) {
      console.warn('WebGL context lost, attempting recovery...')
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
    // Force a page reload to restore WebGL context
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-900">
          <Card className="w-96 bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <CardTitle className="text-xl text-white">3D Renderer Error</CardTitle>
              <CardDescription className="text-gray-300">
                The 3D visualization encountered an error. This is usually due to WebGL context
                issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-400 bg-gray-700/50 p-3 rounded-lg">
                <strong>Common causes:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• Graphics driver issues</li>
                  <li>• Browser WebGL limitations</li>
                  <li>• Memory constraints</li>
                  <li>• Hardware acceleration disabled</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/builder-visualizer')}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Back to Visualizer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
