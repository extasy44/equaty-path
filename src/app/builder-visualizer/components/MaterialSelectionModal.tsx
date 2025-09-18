'use client'

import { useState, useMemo } from 'react'
import { X, Check, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getMaterials } from '../data'
import type { MaterialSelection } from '../data'

interface MaterialSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  sectionId: string
  sectionName: string
  sectionType: string
  currentMaterial?: MaterialSelection
  onMaterialSelect: (sectionId: string, material: MaterialSelection) => void
}

export function MaterialSelectionModal({
  isOpen,
  onClose,
  sectionId,
  sectionName,
  sectionType,
  currentMaterial,
  onMaterialSelect,
}: MaterialSelectionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const materials = getMaterials()

  // Get available materials for this section type
  const availableMaterials = useMemo(() => {
    const allMaterials: MaterialSelection[] = []

    Object.entries(materials).forEach(([, categoryMaterials]) => {
      Object.entries(categoryMaterials).forEach(([, material]) => {
        // Filter materials that are suitable for this section type
        if (isMaterialSuitableForSection(material, sectionType)) {
          allMaterials.push(material)
        }
      })
    })

    return allMaterials
  }, [materials, sectionType])

  // Group materials by category
  const materialsByCategory = useMemo(() => {
    const grouped: Record<string, MaterialSelection[]> = {}

    availableMaterials.forEach((material) => {
      const category = material.materialType?.category || 'other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(material)
    })

    return grouped
  }, [availableMaterials])

  const categories = Object.keys(materialsByCategory)

  const handleMaterialClick = (material: MaterialSelection) => {
    onMaterialSelect(sectionId, material)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] bg-white/95 backdrop-blur rounded-xl border border-slate-200/60 shadow-2xl p-0">
        <DialogHeader className="px-4 pt-3 pb-2 border-b border-slate-100">
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <span className="inline-grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <Palette className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm sm:text-base font-semibold">
              Select material for {sectionName}
            </span>
          </DialogTitle>
          <DialogDescription className="text-[11px] sm:text-xs text-slate-500">
            Choose a material for the{' '}
            <span className="font-medium text-slate-700">{sectionType}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 px-4 py-3">
          {/* Category Filter */}
          <div className="w-full lg:w-44 flex-shrink-0">
            <div className="space-y-2">
              <h4 className="font-semibold text-[10px] tracking-wide text-slate-600 uppercase">
                Categories
              </h4>
              <ScrollArea className="h-[38vh] lg:h-[60vh] pr-1">
                <div className="space-y-1">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-7 w-full justify-between text-[11px] ${
                      selectedCategory === 'all'
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    <span className="truncate">All materials</span>
                    <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0">
                      {availableMaterials.length}
                    </Badge>
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'ghost'}
                      size="sm"
                      className={`h-7 w-full justify-between text-[11px] capitalize ${
                        selectedCategory === category
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span className="truncate">{category}</span>
                      <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0">
                        {materialsByCategory[category].length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <Separator orientation="vertical" />

          {/* Materials Grid */}
          <div className="flex-1">
            <ScrollArea className="h-[56vh] lg:h-[60vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {(selectedCategory === 'all'
                  ? availableMaterials
                  : materialsByCategory[selectedCategory] || []
                ).map((material) => (
                  <Card
                    key={material.id}
                    className={`group relative cursor-pointer transition-all duration-200 border border-slate-200/60 hover:border-slate-300 shadow-sm hover:shadow-md rounded-lg ${
                      currentMaterial?.id === material.id
                        ? 'ring-2 ring-blue-600 bg-blue-50/60'
                        : ''
                    }`}
                    onClick={() => handleMaterialClick(material)}
                  >
                    <CardContent className="p-2">
                      {currentMaterial?.id === material.id && (
                        <span className="absolute right-1.5 top-1.5 inline-grid h-4 w-4 place-items-center rounded-full bg-blue-600 text-white shadow">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                      <div className="space-y-1.5">
                        {/* Material Preview */}
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-md border border-slate-200 flex-shrink-0 shadow-inner"
                            style={{ backgroundColor: material.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-[12px] text-slate-900 truncate leading-tight">
                              {material.name}
                            </h5>
                            <p className="text-[10px] text-slate-500 truncate">
                              {material.materialType?.name || 'Material'}
                            </p>
                          </div>
                        </div>

                        {/* Material Properties (compact) */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600">Cost</span>
                          <span className="font-semibold text-green-600">
                            ${(material.cost || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-2 border-t bg-white/70 backdrop-blur rounded-b-xl">
          <div className="text-xs text-slate-600">
            {currentMaterial ? (
              <span>
                Current:{' '}
                <span className="font-semibold text-slate-900">{currentMaterial.name}</span>
              </span>
            ) : (
              <span className="text-slate-500">No material selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-7 text-xs" onClick={onClose}>
              <X className="h-3.5 w-3.5 mr-1.5" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to determine if a material is suitable for a section type
function isMaterialSuitableForSection(material: MaterialSelection, sectionType: string): boolean {
  const materialCategory = material.materialType?.category

  // Map section types to suitable material categories
  const sectionToCategoryMap: Record<string, string[]> = {
    wall: ['wall'],
    roof: ['roof'],
    window: ['window'],
    door: ['door'],
    trim: ['trim'],
    floor: ['floor'],
    foundation: ['wall', 'floor'], // Foundation can use wall or floor materials
    garage: ['wall', 'door'], // Garage can use wall or door materials
  }

  const suitableCategories = sectionToCategoryMap[sectionType] || ['wall']
  return suitableCategories.includes(materialCategory || 'wall')
}
