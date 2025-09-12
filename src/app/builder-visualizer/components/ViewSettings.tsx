'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Eye, Home, Sun, Moon, Zap, ChevronDown, ChevronUp } from 'lucide-react'
import { getViewPresets, type ViewPreset } from '../data'

interface ViewSettingsProps {
  viewMode: '3d' | 'preview'
  onViewPresetSelect: (preset: ViewPreset) => void
  onEnvironmentChange: (environment: string) => void
  onLightingChange: (lighting: string) => void
  currentEnvironment?: string
  currentLighting?: string
}

export function ViewSettings({
  viewMode,
  onViewPresetSelect,
  onEnvironmentChange,
  onLightingChange,
  currentEnvironment = 'sunset',
  currentLighting = 'daylight',
}: ViewSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const exteriorPresets = getViewPresets('exterior')
  const interiorPresets = getViewPresets('interior')

  const environments = [
    { id: 'sunset', name: 'Sunset', icon: Sun },
    { id: 'city', name: 'City', icon: Home },
    { id: 'forest', name: 'Forest', icon: Zap },
    { id: 'night', name: 'Night', icon: Moon },
  ]

  const lightingOptions = [
    { id: 'daylight', name: 'Daylight', icon: Sun },
    { id: 'golden-hour', name: 'Golden Hour', icon: Sun },
    { id: 'overcast', name: 'Overcast', icon: Moon },
    { id: 'dramatic', name: 'Dramatic', icon: Zap },
  ]

  const currentPresets = viewMode === '3d' ? exteriorPresets : interiorPresets

  return (
    <div className="absolute top-18 left-2 z-40">
      <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-gray-100">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm text-gray-900">View Settings</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-3 space-y-4">
            {/* View Presets */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  {viewMode === '3d' ? 'Exterior' : 'Interior'} Views
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(currentPresets).map(([key, preset]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewPresetSelect(preset)}
                    className="h-7 text-xs justify-start hover:bg-blue-50 hover:text-blue-700"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Environment */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Environment
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {environments.map((env) => {
                  const Icon = env.icon
                  return (
                    <Button
                      key={env.id}
                      variant={currentEnvironment === env.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onEnvironmentChange(env.id)}
                      className="h-7 text-xs justify-start"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {env.name}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Lighting */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Lighting
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {lightingOptions.map((light) => {
                  const Icon = light.icon
                  return (
                    <Button
                      key={light.id}
                      variant={currentLighting === light.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onLightingChange(light.id)}
                      className="h-7 text-xs justify-start"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {light.name}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
