'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface WebGLDiagnostics {
  webglSupported: boolean
  webgl2Supported: boolean
  maxTextureSize: number
  maxVertexAttribs: number
  maxVaryingVectors: number
  maxFragmentUniforms: number
  maxVertexUniforms: number
  vendor: string
  renderer: string
  version: string
  shadingLanguageVersion: string
  extensions: string[]
}

export function WebGLDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<WebGLDiagnostics | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

      if (!gl) {
        setError('WebGL not supported')
        return
      }

      // Type assertion to ensure we have a WebGL context
      const webglContext = gl as WebGLRenderingContext
      const webgl2 = canvas.getContext('webgl2') as WebGL2RenderingContext | null

      const diagnostics: WebGLDiagnostics = {
        webglSupported: !!webglContext,
        webgl2Supported: !!webgl2,
        maxTextureSize: webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE),
        maxVertexAttribs: webglContext.getParameter(webglContext.MAX_VERTEX_ATTRIBS),
        maxVaryingVectors: webglContext.getParameter(webglContext.MAX_VARYING_VECTORS),
        maxFragmentUniforms: webglContext.getParameter(webglContext.MAX_FRAGMENT_UNIFORM_VECTORS),
        maxVertexUniforms: webglContext.getParameter(webglContext.MAX_VERTEX_UNIFORM_VECTORS),
        vendor: webglContext.getParameter(webglContext.VENDOR) || 'Unknown',
        renderer: webglContext.getParameter(webglContext.RENDERER) || 'Unknown',
        version: webglContext.getParameter(webglContext.VERSION) || 'Unknown',
        shadingLanguageVersion:
          webglContext.getParameter(webglContext.SHADING_LANGUAGE_VERSION) || 'Unknown',
        extensions: webglContext.getSupportedExtensions() || [],
      }

      setDiagnostics(diagnostics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [])

  if (error) {
    return (
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur border border-slate-200/70 shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            WebGL Error
          </CardTitle>
          <CardDescription className="text-slate-600">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!diagnostics) {
    return (
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur border border-slate-200/70 shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Info className="h-5 w-5" />
            Loading WebGL Diagnostics...
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl bg-white/95 backdrop-blur border border-slate-200/70 shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <CheckCircle className="h-5 w-5 text-green-600" />
          WebGL Diagnostics
        </CardTitle>
        <CardDescription className="text-slate-600">
          WebGL support and capabilities information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Support</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">WebGL 1.0:</span>
                <Badge variant={diagnostics.webglSupported ? 'default' : 'destructive'}>
                  {diagnostics.webglSupported ? 'Supported' : 'Not Supported'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">WebGL 2.0:</span>
                <Badge variant={diagnostics.webgl2Supported ? 'default' : 'secondary'}>
                  {diagnostics.webgl2Supported ? 'Supported' : 'Not Supported'}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Limits</h4>
            <div className="space-y-1 text-sm">
              <div>Max Texture Size: {diagnostics.maxTextureSize}</div>
              <div>Max Vertex Attribs: {diagnostics.maxVertexAttribs}</div>
              <div>Max Varying Vectors: {diagnostics.maxVaryingVectors}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Graphics Info</h4>
          <div className="space-y-1 text-sm">
            <div>
              <strong>Vendor:</strong> {diagnostics.vendor}
            </div>
            <div>
              <strong>Renderer:</strong> {diagnostics.renderer}
            </div>
            <div>
              <strong>Version:</strong> {diagnostics.version}
            </div>
            <div>
              <strong>GLSL Version:</strong> {diagnostics.shadingLanguageVersion}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">
            Extensions ({diagnostics.extensions.length})
          </h4>
          <div className="max-h-32 overflow-y-auto">
            <div className="flex flex-wrap gap-1">
              {diagnostics.extensions.slice(0, 20).map((ext) => (
                <Badge key={ext} variant="outline" className="text-[11px]">
                  {ext}
                </Badge>
              ))}
              {diagnostics.extensions.length > 20 && (
                <Badge variant="outline" className="text-[11px]">
                  +{diagnostics.extensions.length - 20} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
