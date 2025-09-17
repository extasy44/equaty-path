'use client'

import { useState, useMemo } from 'react'
import { X, Check, Palette, Star } from 'lucide-react'
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
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            Select Material for {sectionName}
          </DialogTitle>
          <DialogDescription>
            Choose a material for the {sectionType} section. Changes will be applied immediately to
            the 3D model.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          {/* Category Filter */}
          <div className="w-48 flex-shrink-0">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Categories</h4>
              <div className="space-y-1">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setSelectedCategory('all')}
                >
                  All Materials ({availableMaterials.length})
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start text-xs capitalize"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category} ({materialsByCategory[category].length})
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator orientation="vertical" />

          {/* Materials Grid */}
          <div className="flex-1">
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(selectedCategory === 'all'
                  ? availableMaterials
                  : materialsByCategory[selectedCategory] || []
                ).map((material) => (
                  <Card
                    key={material.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      currentMaterial?.id === material.id
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:shadow-sm'
                    }`}
                    onClick={() => handleMaterialClick(material)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        {/* Material Preview */}
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: material.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm text-gray-900 truncate">
                              {material.name}
                            </h5>
                            <p className="text-xs text-gray-500 truncate">
                              {material.materialType?.name || 'Material'}
                            </p>
                          </div>
                          {currentMaterial?.id === material.id && (
                            <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          )}
                        </div>

                        {/* Material Properties */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Cost:</span>
                            <span className="font-medium text-green-600">
                              ${(material.cost || 0).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Finish:</span>
                            <span className="text-gray-800 capitalize">
                              {material.properties?.finish || 'Standard'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Durability:</span>
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {material.properties?.durability || 'Good'}
                            </Badge>
                          </div>
                        </div>

                        {/* Material Description */}
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {material.properties?.description ||
                            'High-quality material for construction.'}
                        </p>

                        {/* Action Button */}
                        <Button
                          size="sm"
                          variant={currentMaterial?.id === material.id ? 'default' : 'outline'}
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMaterialClick(material)
                          }}
                        >
                          {currentMaterial?.id === material.id ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Selected
                            </>
                          ) : (
                            <>
                              <Star className="h-3 w-3 mr-1" />
                              Select
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {currentMaterial ? (
              <span>
                Current: <span className="font-medium">{currentMaterial.name}</span>
              </span>
            ) : (
              <span className="text-gray-500">No material selected</span>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
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
