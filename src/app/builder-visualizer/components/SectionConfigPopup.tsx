'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Palette, X, Check, RotateCcw, Eye, Layers, Settings } from 'lucide-react'
import type { Material as MaterialType } from '../types'
import { materialApplier } from '../services/material-applier'

interface SectionConfigPopupProps {
  isOpen: boolean
  onClose: () => void
  sectionId: string
  sectionName: string
  currentMaterial?: MaterialType
  onMaterialChange: (sectionId: string, material: MaterialType) => void
  onColorChange: (sectionId: string, color: string) => void
  position?: { x: number; y: number }
}

export function SectionConfigPopup({
  isOpen,
  onClose,
  sectionId,
  sectionName,
  currentMaterial,
  onMaterialChange,
  onColorChange,
  position = { x: 0, y: 0 },
}: SectionConfigPopupProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | null>(
    currentMaterial || null
  )
  const [customColor, setCustomColor] = useState(currentMaterial?.color || '#ffffff')
  const [materialProperties, setMaterialProperties] = useState({
    roughness: currentMaterial?.roughness || 0.5,
    metalness: currentMaterial?.metalness || 0.0,
    reflection: currentMaterial?.reflection || 0.1,
  })
  const [availableMaterials, setAvailableMaterials] = useState<MaterialType[]>([])

  useEffect(() => {
    // Load available materials based on section type
    const materials = materialApplier.getMaterialsForSurfaceType(
      sectionId.toLowerCase().includes('floor')
        ? 'floor'
        : sectionId.toLowerCase().includes('roof')
          ? 'roof'
          : sectionId.toLowerCase().includes('wall')
            ? 'wall'
            : 'wall'
    )
    setAvailableMaterials(materials)
  }, [sectionId])

  useEffect(() => {
    if (currentMaterial) {
      setSelectedMaterial(currentMaterial)
      setCustomColor(currentMaterial.color)
      setMaterialProperties({
        roughness: currentMaterial.roughness || 0.5,
        metalness: currentMaterial.metalness || 0.0,
        reflection: currentMaterial.reflection || 0.1,
      })
    }
  }, [currentMaterial])

  const handleApply = () => {
    if (selectedMaterial) {
      const updatedMaterial = {
        ...selectedMaterial,
        color: customColor,
        roughness: materialProperties.roughness,
        metalness: materialProperties.metalness,
        reflection: materialProperties.reflection,
      }
      onMaterialChange(sectionId, updatedMaterial)
    }
    onClose()
  }

  const handleReset = () => {
    if (currentMaterial) {
      setSelectedMaterial(currentMaterial)
      setCustomColor(currentMaterial.color)
      setMaterialProperties({
        roughness: currentMaterial.roughness || 0.5,
        metalness: currentMaterial.metalness || 0.0,
        reflection: currentMaterial.reflection || 0.1,
      })
    }
  }

  const getMaterialPreview = (material: MaterialType) => (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-4 h-4 rounded border" style={{ backgroundColor: material.color }} />
        {material.textureUrl && (
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 border border-white" />
        )}
      </div>
      <span className="text-sm">{material.name}</span>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-96 max-h-[80vh] overflow-y-auto"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configure {sectionName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Material Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Material
            </Label>
            <Select
              value={selectedMaterial?.name || ''}
              onValueChange={(value) => {
                const material = availableMaterials.find((m) => m.name === value)
                if (material) {
                  setSelectedMaterial(material)
                  setCustomColor(material.color)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {availableMaterials.map((material) => (
                  <SelectItem key={material.name} value={material.name}>
                    {getMaterialPreview(material)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Customization */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Color
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
            <div className="text-xs text-muted-foreground">Current: {customColor}</div>
          </div>

          {/* Material Properties */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Material Properties</Label>

            {/* Roughness */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Roughness</span>
                <span>{materialProperties.roughness.toFixed(2)}</span>
              </div>
              <Slider
                value={[materialProperties.roughness]}
                onValueChange={([value]) =>
                  setMaterialProperties((prev) => ({ ...prev, roughness: value }))
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {materialProperties.roughness < 0.3
                  ? 'Smooth'
                  : materialProperties.roughness < 0.7
                    ? 'Medium'
                    : 'Rough'}
              </div>
            </div>

            {/* Metalness */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Metalness</span>
                <span>{materialProperties.metalness.toFixed(2)}</span>
              </div>
              <Slider
                value={[materialProperties.metalness]}
                onValueChange={([value]) =>
                  setMaterialProperties((prev) => ({ ...prev, metalness: value }))
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {materialProperties.metalness < 0.3
                  ? 'Non-metal'
                  : materialProperties.metalness < 0.7
                    ? 'Mixed'
                    : 'Metal'}
              </div>
            </div>

            {/* Reflection */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reflection</span>
                <span>{materialProperties.reflection.toFixed(2)}</span>
              </div>
              <Slider
                value={[materialProperties.reflection]}
                onValueChange={([value]) =>
                  setMaterialProperties((prev) => ({ ...prev, reflection: value }))
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {materialProperties.reflection < 0.3
                  ? 'Matte'
                  : materialProperties.reflection < 0.7
                    ? 'Semi-gloss'
                    : 'Glossy'}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Label>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded border shadow-sm"
                  style={{
                    backgroundColor: customColor,
                    filter: `brightness(${1 + materialProperties.reflection * 0.5})`,
                  }}
                />
                <div className="flex-1">
                  <div className="font-medium">{selectedMaterial?.name || 'Custom Material'}</div>
                  <div className="text-xs text-muted-foreground">
                    R: {materialProperties.roughness.toFixed(1)} • M:{' '}
                    {materialProperties.metalness.toFixed(1)} • Ref:{' '}
                    {materialProperties.reflection.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button onClick={handleApply} className="flex-1">
              <Check className="mr-2 h-4 w-4" />
              Apply Changes
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
