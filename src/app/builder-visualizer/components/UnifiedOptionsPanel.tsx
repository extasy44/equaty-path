import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  X,
  Home,
  Users,
  Car,
  Square,
  CheckCircle,
  Building2,
  Sparkles,
  Palette,
  Wand2,
  Camera,
  ArrowLeft,
  Star,
  Info,
} from 'lucide-react'
import { getHousePlans, type HousePlan, type MaterialSelection } from '../data'
import Image from 'next/image'
import { AIAssistant } from './AIAssistant'

interface UnifiedOptionsPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedPreset: string
  selectedFacade: string
  onPresetSelect: (presetId: string) => void
  onFacadeSelect: (facadeId: string) => void
  onGalleryOpen: () => void
  housePlan?: HousePlan | null
  selectedMaterials?: Record<string, MaterialSelection>
  generateAIPrompt?: (
    plan: HousePlan,
    facade: string,
    materials: Record<string, MaterialSelection>
  ) => string
}

export function UnifiedOptionsPanel({
  isOpen,
  onClose,
  selectedPreset,
  selectedFacade,
  onPresetSelect,
  onFacadeSelect,
  onGalleryOpen,
  housePlan,
  selectedMaterials,
  generateAIPrompt,
}: UnifiedOptionsPanelProps) {
  const [activeTab, setActiveTab] = useState('plans')
  const [showAI, setShowAI] = useState(false)

  if (!isOpen) return null

  // Load house plans data
  const housePlans = getHousePlans()
  const currentPlan = housePlans.find((plan) => plan.id === selectedPreset)
  const availableFacades = currentPlan ? Object.entries(currentPlan.facadeOptions) : []

  return (
    <div
      className="fixed inset-y-0 right-0 w-full max-w-lg h-full bg-white/95 backdrop-blur rounded-l-2xl border-l border-slate-200/70 shadow-2xl z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unified-panel-title"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="inline-grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <div id="unified-panel-title" className="text-base font-semibold text-slate-900">
                Design Settings
              </div>
              <p className="text-slate-600 text-xs">Customize your home design</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 px-2 text-slate-700 hover:bg-slate-100"
            aria-label="Close options panel"
          >
            <X className="h-4 w-4 mr-1" />
            Close
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-white border-b">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAI(true)}
              className="flex-1 h-8 font-medium hover:shadow-sm"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onGalleryOpen}
              className="flex-1 h-8 font-medium hover:shadow-sm"
            >
              <Camera className="h-4 w-4 mr-2" />
              Gallery
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-slate-50/60">
          {showAI ? (
            <div className="h-full flex flex-col">
              {/* AI Assistant Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white/90 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="inline-grid h-8 w-8 place-items-center rounded-md bg-purple-600 text-white">
                    <Wand2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">AI Assistant</h3>
                    <p className="text-xs text-slate-600">Generate custom designs with AI</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAI(false)}
                  className="h-8 px-3 hover:shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Options
                </Button>
              </div>

              {/* AI Assistant Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <AIAssistant
                  housePlan={housePlan}
                  selectedMaterials={selectedMaterials}
                  generateAIPrompt={generateAIPrompt}
                />
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="bg-white/90 backdrop-blur border-b">
                <TabsList className="grid w-full grid-cols-3 mx-4 mt-4 mb-2 bg-slate-100/80 border border-slate-200 rounded-md p-1">
                  <TabsTrigger
                    value="plans"
                    className="text-xs sm:text-sm font-medium rounded data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Plans
                  </TabsTrigger>
                  <TabsTrigger
                    value="facades"
                    className="text-xs sm:text-sm font-medium rounded data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Palette className="h-4 w-4 mr-1" />
                    Facades
                  </TabsTrigger>
                  <TabsTrigger
                    value="materials"
                    className="text-xs sm:text-sm font-medium rounded data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Materials
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* House Plans Tab */}
              <TabsContent value="plans" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">House Plans</h3>
                    <Badge variant="secondary" className="text-xs">
                      {housePlans.length} designs
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {housePlans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={`group cursor-pointer transition-all duration-200 border border-slate-200/70 hover:border-slate-300 hover:shadow-md rounded-xl ${selectedPreset === plan.id ? 'ring-2 ring-blue-600 bg-blue-50/60' : ''}`}
                        onClick={() => onPresetSelect(plan.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4 text-blue-600" />
                              <h4 className="font-semibold text-slate-900">{plan.name}</h4>
                              {selectedPreset === plan.id && (
                                <div className="p-1 bg-blue-600 rounded-full">
                                  <CheckCircle className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <Badge className="bg-white/90 text-slate-700 border-0 shadow-sm">
                              <Square className="h-3 w-3 mr-1 text-green-500" />
                              {plan.specifications.totalArea}m²
                            </Badge>
                          </div>

                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {plan.description}
                          </p>

                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center gap-1 text-xs">
                              <Users className="h-3 w-3 text-slate-500" />
                              <span className="text-slate-600">
                                {plan.specifications.bedrooms} beds
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Home className="h-3 w-3 text-slate-500" />
                              <span className="text-slate-600">
                                {plan.specifications.bathrooms} baths
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Car className="h-3 w-3 text-slate-500" />
                              <span className="text-slate-600">
                                {plan.specifications.garage} garage
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Square className="h-3 w-3 text-slate-500" />
                              <span className="text-slate-600">
                                {plan.specifications.totalArea}m²
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm font-bold text-green-600">
                              ${plan.facadeOptions.hyatt?.cost.base.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500">
                              {Object.keys(plan.facadeOptions).length} facades
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Facades Tab */}
              <TabsContent value="facades" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Facade Options</h3>
                    <Badge variant="secondary" className="text-xs">
                      {availableFacades.length} options
                    </Badge>
                  </div>

                  {currentPlan ? (
                    <div className="space-y-3">
                      {availableFacades.map(([facadeId, facade]) => (
                        <TooltipProvider key={facadeId}>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <Card
                                className={`group cursor-pointer transition-all duration-200 border border-slate-200/70 hover:border-slate-300 hover:shadow-md rounded-xl ${
                                  selectedFacade === facadeId
                                    ? 'ring-2 ring-blue-600 bg-blue-50/60'
                                    : ''
                                }`}
                                onClick={() => onFacadeSelect(facadeId)}
                              >
                                <CardContent className="p-3">
                                  <div className="flex gap-3">
                                    {/* Facade Preview Image */}
                                    <div className="relative w-48 h-36 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0 rounded-md">
                                      <Image
                                        src={
                                          (facade as { imageUrl?: string }).imageUrl ||
                                          '/facades/placeholder.jpg'
                                        }
                                        alt={`${facade.name} facade preview`}
                                        fill
                                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement
                                          target.src = '/facades/placeholder.jpg'
                                        }}
                                      />
                                      {selectedFacade === facadeId && (
                                        <div className="absolute top-2 right-2">
                                          <div className="p-1 bg-blue-600 rounded-full shadow-lg">
                                            <CheckCircle className="h-3 w-3 text-white" />
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Facade Information */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between mb-1">
                                        <div className="min-w-0 flex-1">
                                          <div className="text-lg font-semibold text-slate-900">
                                            {facade.name}
                                          </div>
                                          <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                                            {facade.description}
                                          </p>
                                        </div>
                                        <div className="text-right ml-2 flex-shrink-0">
                                          <div className="text-sm font-bold text-green-600">
                                            ${facade.cost.base.toLocaleString()}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap gap-1 mb-2">
                                        {facade.features.slice(0, 2).map((feature, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs px-1.5 py-0.5 bg-gray-50 text-slate-600"
                                          >
                                            {feature}
                                          </Badge>
                                        ))}
                                        {facade.features.length > 2 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs px-1.5 py-0.5 bg-gray-50 text-slate-600"
                                          >
                                            +{facade.features.length - 2}
                                          </Badge>
                                        )}
                                      </div>

                                      <div className="flex items-center justify-between">
                                        {selectedFacade === facadeId ? (
                                          <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">
                                            Selected
                                          </Badge>
                                        ) : (
                                          <div className="text-xs text-slate-500">
                                            Click to select
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                          <Badge className="bg-white/90 text-slate-700 border-0 shadow-sm text-xs px-1.5 py-0.5">
                                            <Star className="h-2.5 w-2.5 mr-0.5 text-yellow-500" />
                                            Featured
                                          </Badge>
                                          <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                <button
                                                  type="button"
                                                  className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                  onClick={(e) => e.preventDefault()}
                                                >
                                                  <Info className="h-2.5 w-2.5" />
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent
                                                className="bg-gray-900 text-white border-gray-700 shadow-xl max-w-xs z-50"
                                                side="top"
                                                align="center"
                                              >
                                                <div className="space-y-2">
                                                  <div className="font-semibold text-white">
                                                    {facade.name}
                                                  </div>
                                                  <div className="text-sm text-gray-200">
                                                    {facade.description}
                                                  </div>
                                                  <div className="text-sm">
                                                    <div className="font-medium text-blue-300 mb-1">
                                                      Features:
                                                    </div>
                                                    <ul className="text-xs text-gray-300 space-y-0.5">
                                                      {facade.features.map((feature, index) => (
                                                        <li key={index}>• {feature}</li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                  <div className="text-sm">
                                                    <div className="font-medium text-green-300">
                                                      Starting Price:
                                                    </div>
                                                    <div className="text-lg font-bold text-green-400">
                                                      ${facade.cost.base.toLocaleString()}
                                                    </div>
                                                  </div>
                                                </div>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-gray-900 text-white border-gray-700 shadow-xl max-w-sm z-50"
                              side="top"
                              align="center"
                            >
                              <div className="space-y-3">
                                <div className="font-semibold text-white text-base">
                                  {facade.name}
                                </div>
                                <div className="text-sm text-gray-200">{facade.description}</div>
                                <div>
                                  <div className="font-medium text-blue-300 mb-2">
                                    Key Features:
                                  </div>
                                  <ul className="text-xs text-gray-300 space-y-1">
                                    {facade.features.map((feature, index) => (
                                      <li key={index}>• {feature}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="border-t border-gray-600 pt-2">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium text-green-300 text-sm">
                                        Starting Price
                                      </div>
                                      <div className="text-lg font-bold text-green-400">
                                        ${facade.cost.base.toLocaleString()}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      Click to select this facade
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Select a house plan first</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value="materials" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Materials</h3>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </div>

                  <div className="text-center py-8 text-gray-500">
                    <Palette className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Material selection will be available here</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click on house sections in the 3D view to customize materials
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
