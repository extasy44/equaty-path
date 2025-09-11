'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Building,
  Castle,
  Factory,
  TreePine,
  Mountain,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react'

export interface HousePreset {
  id: string
  name: string
  description: string
  style: 'modern' | 'traditional' | 'contemporary' | 'minimalist' | 'rustic' | 'industrial'
  budget: 'low' | 'medium' | 'high' | 'premium'
  icon: React.ReactNode
  preview: string
  features: string[]
  estimatedCost: number
  size: {
    bedrooms: number
    bathrooms: number
    squareMeters: number
  }
}

const housePresets: HousePreset[] = [
  {
    id: 'luxury-contemporary',
    name: 'Luxury Contemporary Villa',
    description:
      'An impressive luxury villa with premium materials, stunning textures, and modern architectural features',
    style: 'contemporary',
    budget: 'premium',
    icon: <Building className="h-6 w-6" />,
    preview: '/presets/luxury-contemporary.jpg',
    features: [
      'Premium marble finishes',
      'Copper roof',
      'Smart home features',
      'Landscaped gardens',
    ],
    estimatedCost: 1200000,
    size: { bedrooms: 4, bathrooms: 3, squareMeters: 350 },
  },
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist Home',
    description:
      'Clean lines, open spaces, and minimalist design with focus on functionality and simplicity',
    style: 'minimalist',
    budget: 'high',
    icon: <Home className="h-6 w-6" />,
    preview: '/presets/modern-minimalist.jpg',
    features: ['Open floor plan', 'Large windows', 'Neutral colors', 'Energy efficient'],
    estimatedCost: 800000,
    size: { bedrooms: 3, bathrooms: 2, squareMeters: 250 },
  },
  {
    id: 'traditional-family',
    name: 'Traditional Family Home',
    description:
      'Classic family home with traditional architecture, warm materials, and timeless appeal',
    style: 'traditional',
    budget: 'medium',
    icon: <Home className="h-6 w-6" />,
    preview: '/presets/traditional-family.jpg',
    features: [
      'Brick exterior',
      'Traditional roof',
      'Family-friendly layout',
      'Established neighborhood',
    ],
    estimatedCost: 600000,
    size: { bedrooms: 3, bathrooms: 2, squareMeters: 200 },
  },
  {
    id: 'rustic-countryside',
    name: 'Rustic Countryside Retreat',
    description:
      'Charming countryside home with natural materials, cozy atmosphere, and rural charm',
    style: 'rustic',
    budget: 'medium',
    icon: <TreePine className="h-6 w-6" />,
    preview: '/presets/rustic-countryside.jpg',
    features: ['Natural wood finishes', 'Stone accents', 'Large porch', 'Rural setting'],
    estimatedCost: 500000,
    size: { bedrooms: 2, bathrooms: 2, squareMeters: 180 },
  },
  {
    id: 'industrial-modern',
    name: 'Industrial Modern Loft',
    description:
      'Urban industrial design with exposed materials, high ceilings, and contemporary finishes',
    style: 'industrial',
    budget: 'high',
    icon: <Factory className="h-6 w-6" />,
    preview: '/presets/industrial-modern.jpg',
    features: ['Exposed brick', 'Steel beams', 'Concrete floors', 'Urban location'],
    estimatedCost: 900000,
    size: { bedrooms: 2, bathrooms: 2, squareMeters: 220 },
  },
  {
    id: 'mountain-retreat',
    name: 'Mountain Retreat Cabin',
    description:
      'Cozy mountain cabin with natural materials, fireplace, and stunning mountain views',
    style: 'rustic',
    budget: 'low',
    icon: <Mountain className="h-6 w-6" />,
    preview: '/presets/mountain-retreat.jpg',
    features: ['Wood construction', 'Stone fireplace', 'Mountain views', 'Secluded location'],
    estimatedCost: 400000,
    size: { bedrooms: 2, bathrooms: 1, squareMeters: 150 },
  },
]

interface PresetSelectorProps {
  selectedPreset: string
  onPresetSelect: (presetId: string) => void
  className?: string
}

export function PresetSelector({ selectedPreset, onPresetSelect, className }: PresetSelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  const selectedPresetData = housePresets.find((p) => p.id === selectedPreset)
  const visiblePresets = isExpanded
    ? housePresets
    : housePresets.slice(currentIndex, currentIndex + 3)

  const nextPreset = () => {
    if (currentIndex < housePresets.length - 3) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevPreset = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'premium':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'modern':
        return 'bg-blue-100 text-blue-800'
      case 'traditional':
        return 'bg-amber-100 text-amber-800'
      case 'contemporary':
        return 'bg-purple-100 text-purple-800'
      case 'minimalist':
        return 'bg-gray-100 text-gray-800'
      case 'rustic':
        return 'bg-green-100 text-green-800'
      case 'industrial':
        return 'bg-slate-100 text-slate-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected Preset Display */}
      {selectedPresetData && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">{selectedPresetData.icon}</div>
              <div>
                <h3 className="font-semibold text-lg">{selectedPresetData.name}</h3>
                <p className="text-sm text-gray-600">{selectedPresetData.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                ${selectedPresetData.estimatedCost.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Estimated Cost</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className={getStyleColor(selectedPresetData.style)}>
              {selectedPresetData.style}
            </Badge>
            <Badge className={getBudgetColor(selectedPresetData.budget)}>
              {selectedPresetData.budget} budget
            </Badge>
            <Badge variant="outline">
              {selectedPresetData.size.bedrooms} bed • {selectedPresetData.size.bathrooms} bath
            </Badge>
            <Badge variant="outline">{selectedPresetData.size.squareMeters}m²</Badge>
          </div>
        </Card>
      )}

      {/* Preset Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Choose House Design</h4>
          <div className="flex items-center gap-2">
            {!isExpanded && housePresets.length > 3 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPreset}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPreset}
                  disabled={currentIndex >= housePresets.length - 3}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Show Less' : 'Show All'}
            </Button>
          </div>
        </div>

        <div className={`grid gap-3 ${isExpanded ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {visiblePresets.map((preset) => (
            <Card
              key={preset.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedPreset === preset.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onPresetSelect(preset.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-gray-100 rounded">{preset.icon}</div>
                    <h5 className="font-medium text-sm">{preset.name}</h5>
                  </div>
                  {selectedPreset === preset.id && <Check className="h-4 w-4 text-blue-600" />}
                </div>

                <p className="text-xs text-gray-600 line-clamp-2">{preset.description}</p>

                <div className="flex flex-wrap gap-1">
                  <Badge className={`text-xs ${getStyleColor(preset.style)}`}>{preset.style}</Badge>
                  <Badge className={`text-xs ${getBudgetColor(preset.budget)}`}>
                    {preset.budget}
                  </Badge>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {preset.size.bedrooms} bed • {preset.size.bathrooms} bath
                  </span>
                  <span className="font-medium">${preset.estimatedCost.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features List for Selected Preset */}
      {selectedPresetData && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Key Features</h4>
          <div className="grid grid-cols-2 gap-2">
            {selectedPresetData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export { housePresets }
export type { HousePreset }
