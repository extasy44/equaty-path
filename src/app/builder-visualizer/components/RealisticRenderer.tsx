'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Camera,
  Sun,
  Loader2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Download,
} from 'lucide-react'
import { realisticRenderer } from '../services/realistic-renderer'
import { formatProcessingTime, formatFileSize } from '../utils'
import type {
  Model3D,
  RenderRequest,
  RenderResult,
  RenderResponse,
  Viewpoint,
  LightingPreset,
} from '../types'

interface RealisticRendererProps {
  model: Model3D | null
  onRenderComplete: (renders: RenderResult[]) => void
  className?: string
}

export function RealisticRenderer({ model, onRenderComplete, className }: RealisticRendererProps) {
  const [availableViewpoints, setAvailableViewpoints] = useState<Record<string, Viewpoint>>({})
  const [availableLighting, setAvailableLighting] = useState<Record<string, LightingPreset>>({})
  const [selectedViewpoints, setSelectedViewpoints] = useState<string[]>(['front'])
  const [selectedLighting, setSelectedLighting] = useState<string>('daylight')
  const [selectedQuality, setSelectedQuality] = useState<'draft' | 'standard' | 'high' | 'ultra'>(
    'standard'
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentRender, setCurrentRender] = useState<string>('')
  const [responses, setResponses] = useState<RenderResponse[]>([])
  const [completedRenders, setCompletedRenders] = useState<RenderResult[]>([])

  // Load available options on mount
  useEffect(() => {
    setAvailableViewpoints(realisticRenderer.getAvailableViewpoints())
    setAvailableLighting(realisticRenderer.getAvailableLightingPresets())
  }, [])

  const handleViewpointToggle = (viewpointKey: string) => {
    setSelectedViewpoints((prev) =>
      prev.includes(viewpointKey) ? prev.filter((v) => v !== viewpointKey) : [...prev, viewpointKey]
    )
  }

  const renderImages = async () => {
    if (!model || selectedViewpoints.length === 0) return

    setIsProcessing(true)
    setProgress(0)
    setResponses([])
    setCompletedRenders([])
    setCurrentRender('')

    const qualityPresets = realisticRenderer.getRenderQualityPresets()
    const lightingPreset = availableLighting[selectedLighting]

    const renderPromises: Promise<RenderResponse>[] = []

    selectedViewpoints.forEach((viewpointKey, index) => {
      const viewpoint = availableViewpoints[viewpointKey]
      if (!viewpoint) return

      const request: RenderRequest = {
        modelId: model.id,
        viewpoint,
        lighting: lightingPreset,
        resolution: qualityPresets[selectedQuality].resolution,
        quality: selectedQuality,
      }

      renderPromises.push(realisticRenderer.renderImage(request))
    })

    try {
      // Process renders sequentially to show progress
      for (let i = 0; i < renderPromises.length; i++) {
        const viewpointKey = selectedViewpoints[i]
        const viewpoint = availableViewpoints[viewpointKey]

        setCurrentRender(`Rendering ${viewpoint.name}...`)

        const response = await renderPromises[i]
        setResponses((prev) => [...prev, response])

        if (response.success) {
          setCompletedRenders((prev) => [...prev, response.render])
        }

        setProgress(Math.round(((i + 1) / renderPromises.length) * 100))
      }

      setCurrentRender('')
      onRenderComplete(completedRenders)
    } catch (error) {
      console.error('Error rendering images:', error)
      setResponses((prev) => [
        ...prev,
        {
          success: false,
          render: {} as RenderResult,
          message: 'Failed to render images',
          processingTime: 0,
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePremiumDownload = () => {
    alert(
      '💎 Premium download functionality is available in the Reports section. Upgrade to access full export capabilities.'
    )
  }

  const isModelReady = useMemo(() => {
    if (!model) return false
    const validation = realisticRenderer.validateModelForRendering(model)
    return validation.isValid
  }, [model])

  const estimatedTime = useMemo(() => {
    if (!model || selectedViewpoints.length === 0) return 0

    const qualityPresets = realisticRenderer.getRenderQualityPresets()
    const resolution = qualityPresets[selectedQuality].resolution

    return (
      selectedViewpoints.length * realisticRenderer.estimateRenderTime(selectedQuality, resolution)
    )
  }, [model, selectedViewpoints, selectedQuality])

  if (!model) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">📸 Realistic Rendering</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Please generate and texture a 3D model first to create renders.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">📸 Realistic Rendering</CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Generate photorealistic images of your 3D model
          </p>
          {!isModelReady && <Badge variant="destructive">Model not ready</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Model Validation */}
        {!isModelReady && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertDescription>
              <strong>Model Issues:</strong>
              <ul className="mt-1 ml-4 list-disc text-sm">
                {realisticRenderer.validateModelForRendering(model).issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Quality Selection */}
        <div className="space-y-2">
          <Label>Render Quality</Label>
          <Select value={selectedQuality} onValueChange={(value: any) => setSelectedQuality(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft (Fast, 800x600)</SelectItem>
              <SelectItem value="standard">Standard (Balanced, 1200x900)</SelectItem>
              <SelectItem value="high">High (Detailed, 1920x1440)</SelectItem>
              <SelectItem value="ultra">Ultra (Maximum, 2560x1920)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lighting Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Lighting Preset
          </Label>
          <Select value={selectedLighting} onValueChange={setSelectedLighting}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableLighting).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Viewpoint Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Viewpoints ({selectedViewpoints.length} selected)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(availableViewpoints).map(([key, viewpoint]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={selectedViewpoints.includes(key)}
                  onCheckedChange={() => handleViewpointToggle(key)}
                />
                <Label htmlFor={key} className="text-sm">
                  {viewpoint.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Time */}
        {estimatedTime > 0 && (
          <Alert>
            <AlertDescription>
              <strong>Estimated processing time:</strong> {formatProcessingTime(estimatedTime)}
              {selectedViewpoints.length > 1 && (
                <span className="block mt-1">
                  ({formatProcessingTime(estimatedTime / selectedViewpoints.length)} per render ×{' '}
                  {selectedViewpoints.length} renders)
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Render Button */}
        <Button
          onClick={renderImages}
          disabled={!isModelReady || isProcessing || selectedViewpoints.length === 0}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Rendering Images...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Renders ({selectedViewpoints.length})
            </>
          )}
        </Button>

        {/* Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentRender || 'Processing...'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Completed Renders */}
        {completedRenders.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Completed Renders</h4>
            <div className="grid gap-3">
              {completedRenders.map((render) => (
                <div key={render.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">
                        {render.viewpoint} - {render.lighting}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {render.metadata.resolution.width}×{render.metadata.resolution.height} •{' '}
                        {formatFileSize(render.metadata.fileSize)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={handlePremiumDownload}>
                      <Download className="h-3 w-3 mr-1" />
                      💎 Premium
                    </Button>
                  </div>
                  <div className="aspect-video bg-muted rounded overflow-hidden">
                    <img
                      src={render.url}
                      alt={`${render.viewpoint} render`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-render.jpg'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Responses */}
        {responses.filter((r) => !r.success).length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>Some renders failed:</strong>
              <ul className="mt-1 ml-4 list-disc text-sm">
                {responses
                  .filter((r) => !r.success)
                  .map((response, index) => (
                    <li key={index}>{response.message}</li>
                  ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Summary */}
        {responses.length > 0 && responses.some((r) => r.success) && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Successfully generated {responses.filter((r) => r.success).length} of{' '}
              {responses.length} renders
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
