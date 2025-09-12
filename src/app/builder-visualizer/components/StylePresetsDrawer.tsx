import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { X, CheckCircle, Building, Star, DollarSign, ArrowRight, Sparkles } from 'lucide-react'
import { type HousePlan, getHousePlans } from '../data'
import Image from 'next/image'

interface StylePresetsDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedPreset: string
  selectedFacade: string
  onFacadeSelect: (facadeId: string) => void
}

export function StylePresetsDrawer({
  isOpen,
  onClose,
  selectedPreset,
  selectedFacade,
  onFacadeSelect,
}: StylePresetsDrawerProps) {
  if (!isOpen) return null

  // Load house plans data
  const housePlans = getHousePlans()

  // Get the current house plan to show its facades
  const currentPlan = housePlans.find((plan) => plan.id === selectedPreset)
  if (!currentPlan) return null

  const availableFacades = Object.entries(currentPlan.facadeOptions)

  return (
    <div
      className="fixed inset-y-0 right-0 w-full max-w-md h-full bg-white border-l border-gray-200/80 shadow-xl z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="facade-drawer-title"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 id="facade-drawer-title" className="text-lg font-semibold text-gray-900">
                Facade Selection
              </h2>
              <p className="text-sm text-gray-600">Choose your exterior design</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-white/80 rounded-full"
            aria-label="Close facade selection"
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
              <p className="text-sm font-medium text-blue-900 mb-1">
                Customize Your Home's Exterior
              </p>
              <p className="text-sm text-blue-700">
                Select from available facade designs for the <strong>{currentPlan.name}</strong>{' '}
                house plan.
              </p>
            </div>
          </div>
        </div>

        {/* Facade Options */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-gray-900">Available Facades</h3>
              <Badge variant="secondary" className="text-xs">
                {availableFacades.length} options
              </Badge>
            </div>

            <div className="space-y-4">
              {availableFacades.map(([facadeId, facade]) => (
                <Card
                  key={facadeId}
                  className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedFacade === facadeId
                      ? 'ring-2 ring-blue-500 bg-blue-50/50 border-blue-200'
                      : 'hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => onFacadeSelect(facadeId)}
                >
                  <CardContent className="p-0">
                    {/* Facade Image */}
                    <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <Image
                        src={(facade as any).imageUrl || '/facades/placeholder.jpg'}
                        alt={`${facade.name} facade preview`}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/facades/placeholder.jpg'
                        }}
                      />
                      {selectedFacade === facadeId && (
                        <div className="absolute top-3 right-3">
                          <div className="p-1.5 bg-blue-600 rounded-full shadow-lg">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-gray-700 border-0 shadow-sm">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">
                              {facade.name}
                            </span>
                            <div className="flex items-center text-sm font-bold text-green-600">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {facade.cost.base.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Facade Details */}
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {facade.description}
                      </p>

                      {/* Key Features */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Key Features
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {facade.features.slice(0, 3).map((feature, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs px-2 py-1 bg-gray-50"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {facade.features.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50">
                              +{facade.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Indicator */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Click to select</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
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
