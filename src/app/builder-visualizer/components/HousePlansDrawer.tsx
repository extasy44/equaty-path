import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  X,
  Home,
  Users,
  Car,
  Square,
  CheckCircle,
  Building2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { type HousePlan } from '../data'

interface HousePlansDrawerProps {
  isOpen: boolean
  onClose: () => void
  housePlans: HousePlan[]
  selectedPreset: string
  onPresetSelect: (presetId: string) => void
}

export function HousePlansDrawer({
  isOpen,
  onClose,
  housePlans,
  selectedPreset,
  onPresetSelect,
}: HousePlansDrawerProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-y-0 right-0 w-full max-w-md h-full bg-white border-l border-gray-200/80 shadow-xl z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="house-plans-drawer-title"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 id="house-plans-drawer-title" className="text-lg font-semibold text-gray-900">
                House Designs
              </h2>
              <p className="text-sm text-gray-600">Choose your perfect home plan</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-white/80 rounded-full"
            aria-label="Close house plans"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Description */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Professional House Plans</p>
              <p className="text-sm text-blue-700">
                Choose your preferred house design to begin customizing materials and finishes. Each
                plan includes detailed specifications and pricing.
              </p>
            </div>
          </div>
        </div>

        {/* Plans List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-gray-900">Available Plans</h3>
              <Badge variant="secondary" className="text-xs">
                {housePlans.length} designs
              </Badge>
            </div>

            <div className="space-y-4">
              {housePlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedPreset === plan.id
                      ? 'ring-2 ring-blue-500 bg-blue-50/50 border-blue-200'
                      : 'hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => onPresetSelect(plan.id)}
                >
                  <CardContent className="p-0">
                    {/* Plan Header */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-blue-600" />
                          <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                          {selectedPreset === plan.id && (
                            <div className="p-1 bg-blue-600 rounded-full">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <Badge className="bg-white/90 text-gray-700 border-0 shadow-sm">
                          <Square className="h-3 w-3 mr-1 text-green-500" />
                          {plan.specifications.totalArea}m²
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline" className="text-xs">
                          {plan.builder}
                        </Badge>
                        <Separator orientation="vertical" className="h-3" />
                        <span>{plan.facade} Facade</span>
                      </div>
                    </div>

                    {/* Plan Details */}
                    <div className="p-4">
                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{plan.description}</p>

                      {/* Specifications */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{plan.specifications.bedrooms} beds</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Home className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {plan.specifications.bathrooms} baths
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{plan.specifications.garage} garage</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Square className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {plan.specifications.totalArea}m² total
                          </span>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            ${plan.facadeOptions.hyatt?.cost.base.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Starting price</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {Object.keys(plan.facadeOptions).length} facades
                          </div>
                          <div className="text-xs text-gray-500">Available</div>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedPreset === plan.id && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 text-blue-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-sm font-medium">Currently Selected</span>
                          </div>
                        </div>
                      )}

                      {/* Action Indicator */}
                      {selectedPreset !== plan.id && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center text-xs text-gray-500">
                            <span>Click to select</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
