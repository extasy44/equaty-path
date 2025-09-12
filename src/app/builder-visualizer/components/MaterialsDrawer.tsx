import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { X, Home, CheckCircle, Palette, Building } from 'lucide-react'
import { type HousePlan } from '../data'

interface StylePresetsDrawerProps {
  isOpen: boolean
  onClose: () => void
  housePlans: HousePlan[]
  selectedPreset: string
  onPresetSelect: (presetId: string) => void
  onFacadeSelect: (planId: string, facadeId: string) => void
}

export function StylePresetsDrawer({
  isOpen,
  onClose,
  housePlans,
  selectedPreset,
  onPresetSelect,
  onFacadeSelect,
}: StylePresetsDrawerProps) {
  if (!isOpen) return null

  // Group plans by style
  const plansByStyle = housePlans.reduce(
    (acc, plan) => {
      if (!acc[plan.style]) {
        acc[plan.style] = []
      }
      acc[plan.style].push(plan)
      return acc
    },
    {} as Record<string, HousePlan[]>
  )

  const styleCategories = [
    { id: 'modern', name: 'Modern', icon: Building, color: 'blue' },
    { id: 'traditional', name: 'Traditional', icon: Home, color: 'green' },
    { id: 'contemporary', name: 'Contemporary', icon: Palette, color: 'purple' },
    { id: 'minimalist', name: 'Minimalist', icon: Building, color: 'gray' },
  ]

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg h-full bg-white border-l border-gray-200 z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Style & Facade</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Description */}
        <div className="p-4 bg-blue-50 border-b">
          <p className="text-sm text-blue-800">
            Choose your preferred architectural style and facade design to customize your home's
            appearance.
          </p>
        </div>

        {/* Style Categories */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {styleCategories.map((style) => {
              const plans = plansByStyle[style.id] || []
              if (plans.length === 0) return null

              const Icon = style.icon
              return (
                <div key={style.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 text-${style.color}-600`} />
                    <h3 className="font-semibold text-gray-900 capitalize">{style.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {plans.length} designs
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {plans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedPreset === plan.id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onPresetSelect(plan.id)}
                      >
                        <div className="p-3">
                          {/* Plan Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm text-gray-900">{plan.name}</h4>
                                {selectedPreset === plan.id && (
                                  <CheckCircle className="h-3 w-3 text-blue-600" />
                                )}
                              </div>
                              <div className="text-xs text-gray-600">{plan.builder}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900">
                                ${plan.facadeOptions.hyatt?.cost.base.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">Starting from</div>
                            </div>
                          </div>

                          {/* Facade Options */}
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-700">
                              Available Facades:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(plan.facadeOptions).map(([facadeId, facade]) => (
                                <Button
                                  key={facadeId}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-xs px-2"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onFacadeSelect(plan.id, facadeId)
                                  }}
                                >
                                  {facade.name}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Specifications */}
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div>{plan.specifications.bedrooms} Bedrooms</div>
                              <div>{plan.specifications.bathrooms} Bathrooms</div>
                              <div>{plan.specifications.garage} Car Garage</div>
                              <div>{plan.specifications.totalArea}m² Total</div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
