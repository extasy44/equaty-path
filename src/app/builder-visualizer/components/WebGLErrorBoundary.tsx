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
          <Card className="w-[420px] bg-white/95 backdrop-blur border border-slate-200/70 shadow-2xl rounded-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 inline-grid h-16 w-16 place-items-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-base sm:text-lg text-slate-900">
                3D Renderer Error
              </CardTitle>
              <CardDescription className="text-slate-600">
                The 3D viewer hit a WebGL issue. A quick reload usually fixes it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="font-semibold text-slate-800">Common causes</div>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Graphics driver issues</li>
                  <li>Browser WebGL limitations</li>
                  <li>Memory constraints</li>
                  <li>Hardware acceleration disabled</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1 h-9">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/builder-visualizer')}
                  className="flex-1 h-9"
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
