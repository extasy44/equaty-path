'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Check,
  RotateCcw,
  Settings,
  Search,
  Palette,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import {
  getMaterialTypesByCategory,
  getProfilesByMaterialType,
  getColorCollections,
  type MaterialSelection,
} from '../data'

interface SectionConfigPopupProps {
  isOpen: boolean
  onClose: () => void
  sectionId: string
  sectionName: string
  currentMaterial?: MaterialSelection
  onMaterialChange: (sectionId: string, material: MaterialSelection) => void
  onColorChange: (sectionId: string, color: string) => void
}

export function SectionConfigPopup({
  isOpen,
  onClose,
  sectionId,
  sectionName,
  onMaterialChange,
}: SectionConfigPopupProps) {
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>('')
  const [selectedProfile, setSelectedProfile] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  // Determine category from section ID
  const getCategoryFromSectionId = (sectionId: string): string => {
    if (sectionId.toLowerCase().includes('roof')) return 'roof'
    if (sectionId.toLowerCase().includes('wall')) return 'wall'
    if (sectionId.toLowerCase().includes('floor')) return 'floor'
    if (sectionId.toLowerCase().includes('window')) return 'window'
    if (sectionId.toLowerCase().includes('door')) return 'door'
    if (sectionId.toLowerCase().includes('trim')) return 'trim'
    return 'wall' // default
  }

  const category = getCategoryFromSectionId(sectionId)
  const materialTypes = getMaterialTypesByCategory(category)
  const profiles = selectedMaterialType ? getProfilesByMaterialType(selectedMaterialType) : []
  const colorCollections = getColorCollections()

  // Filter color collections based on search
  const filteredColorCollections = colorCollections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.colors.some((color) => color.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Get cost based on material type and collection
  const getMaterialCost = (materialType: string, collectionType: string): number => {
    const baseCosts = {
      concrete_tiles: 45,
      terracotta_tiles: 55,
      metal_roofing: 65,
      slate: 120,
      brick: 35,
      render: 25,
      cladding: 40,
      weatherboard: 30,
      tiles: 50,
      timber: 60,
      concrete: 20,
      carpet: 35,
      aluminum: 45,
      composite: 55,
    }

    const collectionMultipliers = {
      classic: 1.0,
      designer: 1.3,
      premium: 1.8,
    }

    const baseCost = baseCosts[materialType as keyof typeof baseCosts] || 50
    const multiplier =
      collectionMultipliers[collectionType as keyof typeof collectionMultipliers] || 1.0

    return Math.round(baseCost * multiplier)
  }

  // Get description based on selections
  const getMaterialDescription = (
    materialType: string,
    profile: string,
    colorName: string
  ): string => {
    const materialTypeName = materialTypes.find((t) => t.id === materialType)?.name || materialType
    const profileName = profiles.find((p) => p.id === profile)?.name || profile

    return `${materialTypeName} with ${profileName} profile in ${colorName}. High-quality material suitable for residential construction with excellent durability and weather resistance.`
  }

  const handleApply = () => {
    if (selectedMaterialType && selectedProfile && selectedColor) {
      const selectedColorData = colorCollections
        .flatMap((c) => c.colors)
        .find((col) => col.color === selectedColor)

      const collectionType =
        colorCollections.find((c) => c.colors.some((col) => col.color === selectedColor))?.type ||
        'classic'

      const cost = getMaterialCost(selectedMaterialType, collectionType)
      const description = getMaterialDescription(
        selectedMaterialType,
        selectedProfile,
        selectedColorData?.name || 'selected color'
      )

      // Create a material selection object
      const material: MaterialSelection = {
        id: `${selectedMaterialType}_${selectedProfile}_${selectedColor}`,
        name: `${materialTypes.find((t) => t.id === selectedMaterialType)?.name} - ${profiles.find((p) => p.id === selectedProfile)?.name} - ${selectedColorData?.name}`,
        color: selectedColor,
        roughness: 0.8,
        metalness: 0.2,
        cost: cost,
        materialType: {
          id: selectedMaterialType,
          name: materialTypes.find((t) => t.id === selectedMaterialType)?.name || '',
          category: category as 'roof' | 'wall' | 'floor' | 'window' | 'door' | 'trim',
        },
        profile: {
          id: selectedProfile,
          name: profiles.find((p) => p.id === selectedProfile)?.name || '',
          description: profiles.find((p) => p.id === selectedProfile)?.description || '',
          texturePattern: selectedProfile,
        },
        colorCollection: {
          id:
            colorCollections.find((c) => c.colors.some((col) => col.color === selectedColor))?.id ||
            '',
          name:
            colorCollections.find((c) => c.colors.some((col) => col.color === selectedColor))
              ?.name || '',
          type: collectionType,
        },
        properties: {
          finish:
            collectionType === 'premium'
              ? 'Premium'
              : collectionType === 'designer'
                ? 'Designer'
                : 'Standard',
          texture: 'High Quality',
          durability: 'Excellent',
          maintenance: 'Low',
          fire_rating: 'A',
          insulation: 'Standard',
          description: description,
        },
      }

      onMaterialChange(sectionId, material)
    }
    onClose()
  }

  const handleReset = () => {
    setSelectedMaterialType('')
    setSelectedProfile('')
    setSelectedColor('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[700px] max-h-[85vh] overflow-hidden"
        aria-labelledby="section-config-title"
      >
        <DialogHeader className="pb-4">
          <DialogTitle
            id="section-config-title"
            className="flex items-center gap-3 text-lg font-semibold"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <span>Configure {sectionName}</span>
              <p className="text-sm font-normal text-gray-600 mt-1">
                Customize materials, colors, and finishes
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Search and Filters */}
          <div className="flex items-center gap-2 mb-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  placeholder="Search colors and materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 h-8 text-xs"
                />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset} className="h-8 px-3 text-xs">
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Material Type Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Material Type</h3>
                {selectedMaterialType && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Choose the base material for your {sectionName.toLowerCase()}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {materialTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedMaterialType === type.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedMaterialType(type.id)
                      setSelectedProfile('')
                      setSelectedColor('')
                    }}
                    className="h-8 justify-start text-xs px-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-6 h-4 rounded border bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-500">📦</span>
                      </div>
                      {selectedMaterialType === type.id && (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      )}
                      <span className="truncate">{type.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Profile Selection */}
            {selectedMaterialType && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-green-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Profile</h3>
                  {selectedProfile && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                </div>
                <p className="text-xs text-gray-600 mb-2">Select texture pattern and finish</p>
                <div className="grid grid-cols-2 gap-2">
                  {profiles.map((profile) => (
                    <Button
                      key={profile.id}
                      variant={selectedProfile === profile.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSelectedProfile(profile.id)
                        setSelectedColor('')
                      }}
                      className="h-8 justify-start text-xs px-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-6 h-4 rounded border bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-500">🔲</span>
                        </div>
                        {selectedProfile === profile.id && (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        )}
                        <span className="truncate">{profile.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Collections */}
            {selectedProfile && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Color Collections</h3>
                  {selectedColor && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                </div>
                <p className="text-xs text-gray-600 mb-2">Choose your color scheme</p>
                <div className="space-y-3">
                  {filteredColorCollections.map((collection) => (
                    <div key={collection.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          {collection.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {collection.type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-6 gap-1">
                        {collection.colors.map((color) => (
                          <div
                            key={color.id}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer transition-all ${
                              selectedColor === color.color
                                ? 'bg-blue-50 border-2 border-blue-300 shadow-sm'
                                : 'hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedColor(color.color)}
                          >
                            <div className="relative">
                              <div
                                className="w-8 h-6 rounded border shadow-sm"
                                style={{ backgroundColor: color.color }}
                              />
                              {color.textureUrl && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 border border-white" />
                              )}
                              {selectedColor === color.color && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <CheckCircle2 className="h-3 w-3 text-blue-600 bg-white rounded-full" />
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-gray-900 truncate">
                                {color.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ${getMaterialCost(selectedMaterialType, collection.type)}/m²
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview and Actions - Always visible */}
          <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-12 h-10 rounded-lg border shadow-sm"
                    style={{ backgroundColor: selectedColor || '#f0f0f0' }}
                  />
                  {selectedColor && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                      <Check className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Current Selection</h4>
                  <p className="text-xs text-gray-600 mb-1">
                    {selectedMaterialType && selectedProfile && selectedColor
                      ? `${materialTypes.find((t) => t.id === selectedMaterialType)?.name} - ${profiles.find((p) => p.id === selectedProfile)?.name}`
                      : 'Complete your selection'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      $
                      {selectedMaterialType && selectedColor
                        ? getMaterialCost(
                            selectedMaterialType,
                            colorCollections.find((c) =>
                              c.colors.some((col) => col.color === selectedColor)
                            )?.type || 'classic'
                          )
                        : '--'}
                      /m²
                    </Badge>
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      {selectedMaterialType && selectedProfile && selectedColor
                        ? 'Ready to apply'
                        : 'Complete selection'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 px-3 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleApply}
                  disabled={!selectedMaterialType || !selectedProfile || !selectedColor}
                  className="h-8 px-4 text-xs font-medium"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
