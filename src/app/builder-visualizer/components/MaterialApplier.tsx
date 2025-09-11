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
import { Loader2, CheckCircle, XCircle, Wand2 } from 'lucide-react'
import { materialApplier } from '../services/material-applier'
import type { Model3D, Material, MaterialSelection, MaterialApplicationResponse } from '../types'

interface MaterialApplierProps {
  model: Model3D | null
  onModelUpdated: (model: Model3D) => void
  className?: string
}

export function MaterialApplier({ model, onModelUpdated, className }: MaterialApplierProps) {
  const [availableMaterials, setAvailableMaterials] = useState<Material[]>([])
  const [selections, setSelections] = useState<MaterialSelection[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [response, setResponse] = useState<MaterialApplicationResponse | null>(null)

  // Load available materials on mount
  useEffect(() => {
    const materials = materialApplier.getAvailableMaterials()
    setAvailableMaterials(materials)
  }, [])

  // Initialize selections when model changes
  useEffect(() => {
    if (model?.sections) {
      const initialSelections = model.sections.map((section) => ({
        sectionId: section.id,
        materialName: section.material?.name || '',
        appliedAt: section.material?.appliedAt || new Date(),
      }))
      setSelections(initialSelections)
    } else {
      setSelections([])
    }
  }, [model])

  const handleMaterialChange = (sectionId: string, materialName: string) => {
    setSelections((prev) =>
      prev.map((selection) =>
        selection.sectionId === sectionId
          ? { ...selection, materialName, appliedAt: new Date() }
          : selection
      )
    )
    setResponse(null) // Clear previous response
  }

  const applyMaterials = async () => {
    if (!model || selections.length === 0) return

    // Filter out selections without material names
    const validSelections = selections.filter((s) => s.materialName)

    if (validSelections.length === 0) {
      alert('Please select at least one material')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResponse(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 20, 90))
      }, 200)

      const result = await materialApplier.applyMaterials(model, validSelections)

      clearInterval(progressInterval)
      setProgress(100)
      setResponse(result)

      if (result.success) {
        onModelUpdated(result.updatedModel)
      }
    } catch (error) {
      console.error('Error applying materials:', error)
      setResponse({
        success: false,
        updatedModel: model,
        appliedMaterials: [],
        message: 'Failed to apply materials',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getMaterialPreview = (materialName: string) => {
    const material = availableMaterials.find((m) => m.name === materialName)
    if (!material) return null

    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-4 h-4 rounded border" style={{ backgroundColor: material.color }} />
          {material.textureUrl && (
            <div className="absolute inset-0 w-4 h-4 rounded border border-blue-500 bg-blue-100 flex items-center justify-center">
              <span className="text-xs text-blue-600">T</span>
            </div>
          )}
        </div>
        <span className="text-sm">{material.name}</span>
        {material.properties && (
          <Badge variant="outline" className="text-xs">
            {String(material.properties.finish)}
          </Badge>
        )}
      </div>
    )
  }

  const getMaterialsForSection = (sectionId: string) => {
    // Get section type to suggest appropriate materials
    const section = model?.sections.find((s) => s.id === sectionId)
    if (!section) return availableMaterials

    // Suggest materials based on section type
    if (section.id.toLowerCase().includes('floor')) {
      return materialApplier.getMaterialsForSurfaceType('floor')
    } else if (section.id.toLowerCase().includes('roof')) {
      return materialApplier.getMaterialsForSurfaceType('roof')
    } else {
      return materialApplier.getMaterialsForSurfaceType('wall')
    }
  }

  const completionPercentage = useMemo(() => {
    if (!selections.length) return 0
    const completed = selections.filter((s) => s.materialName).length
    return Math.round((completed / selections.length) * 100)
  }, [selections])

  if (!model) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🎨 Material Application</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Please generate a 3D model first to apply materials.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🎨 Material Application</CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Apply materials to different sections of your 3D model
          </p>
          <Badge variant={completionPercentage === 100 ? 'default' : 'secondary'}>
            {completionPercentage}% Complete
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Material Selection Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="w-full" />
        </div>

        {/* Material Selections */}
        <div className="space-y-3">
          {selections.map((selection) => {
            const section = model.sections.find((s) => s.id === selection.sectionId)
            const sectionMaterials = getMaterialsForSection(selection.sectionId)

            return (
              <div
                key={selection.sectionId}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{section?.name || selection.sectionId}</p>
                  {selection.materialName && (
                    <p className="text-xs text-muted-foreground">
                      Current: {getMaterialPreview(selection.materialName)}
                    </p>
                  )}
                </div>

                <Select
                  value={selection.materialName}
                  onValueChange={(value) => handleMaterialChange(selection.sectionId, value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionMaterials.map((material) => (
                      <SelectItem key={material.name} value={material.name}>
                        <div className="flex items-center gap-2 w-full">
                          <div className="relative">
                            <div
                              className="w-3 h-3 rounded border"
                              style={{ backgroundColor: material.color }}
                            />
                            {material.textureUrl && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 border border-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{material.name}</span>
                            {material.properties && (
                              <div className="text-xs text-muted-foreground">
                                {String(material.properties.finish)} •{' '}
                                {String(material.properties.texture)}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            R:{material.roughness?.toFixed(1)} M:{material.metalness?.toFixed(1)}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}
        </div>

        {/* Apply Button */}
        <Button
          onClick={applyMaterials}
          disabled={isProcessing || completionPercentage === 0}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying Materials...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Apply Materials
            </>
          )}
        </Button>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Applying materials...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Response */}
        {response && (
          <Alert
            className={
              response.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }
          >
            <div className="flex items-start gap-2">
              {response.success ? (
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertDescription className="text-sm">
                  {response.message}
                  {response.success && response.appliedMaterials.length > 0 && (
                    <span className="block mt-1 text-xs text-muted-foreground">
                      Applied {response.appliedMaterials.length} material(s)
                    </span>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {/* Material Library Preview */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Available Materials</h4>
          <div className="grid grid-cols-1 gap-2">
            {availableMaterials.slice(0, 6).map((material) => (
              <div
                key={material.name}
                className="flex items-center gap-2 text-xs p-2 border rounded"
              >
                <div className="relative">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: material.color }}
                  />
                  {material.textureUrl && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 border border-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{material.name}</div>
                  {material.properties && (
                    <div className="text-muted-foreground">
                      {String(material.properties.finish)} • {String(material.properties.texture)}
                    </div>
                  )}
                </div>
                <div className="text-muted-foreground">
                  R:{material.roughness?.toFixed(1)} M:{material.metalness?.toFixed(1)}
                </div>
              </div>
            ))}
            {availableMaterials.length > 6 && (
              <div className="text-xs text-muted-foreground text-center py-2">
                ... and {availableMaterials.length - 6} more materials
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
