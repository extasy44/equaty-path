import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Palette, Wand2, Building, Camera, Eye, EyeOff, Grid3X3, Square } from 'lucide-react'

interface ViewerNavigationProps {
  viewMode: '3d' | 'preview'
  onViewModeChange: (mode: '3d' | 'preview') => void
  onMaterialsOpen: () => void
  onPresetsOpen: () => void
  onAIOpen: () => void
  onGalleryOpen: () => void
  onExit: () => void
  showExitButton: boolean
  showWireframe: boolean
  showShadows: boolean
  showGrid: boolean
  onWireframeToggle: () => void
  onShadowsToggle: () => void
  onGridToggle: () => void
  currentFacade?: string
  currentHousePlan?: string
}

export function ViewerNavigation({
  viewMode,
  onViewModeChange,
  onMaterialsOpen,
  onPresetsOpen,
  onAIOpen,
  onGalleryOpen,
  onExit,
  showExitButton,
  showWireframe,
  showShadows,
  showGrid,
  onWireframeToggle,
  onShadowsToggle,
  onGridToggle,
  currentFacade,
  currentHousePlan,
}: ViewerNavigationProps) {
  return (
    <nav
      className="absolute top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm"
      role="navigation"
      aria-label="Builder Visualizer Navigation"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Brand & Status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Builder Visualizer</h1>
            </div>
            {currentFacade && currentHousePlan && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {currentFacade.charAt(0).toUpperCase() + currentFacade.slice(1)} Facade
                </Badge>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="outline" className="text-gray-600">
                  {currentHousePlan}
                </Badge>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === '3d' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('3d')}
              className="h-8 px-3 text-sm font-medium"
              aria-label="Switch to 3D view"
            >
              <Eye className="h-4 w-4 mr-1" />
              3D View
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'preview' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('preview')}
              className="h-8 px-3 text-sm font-medium"
              aria-label="Switch to preview mode"
            >
              <EyeOff className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>

        {/* Right Section - Controls & Actions */}
        <div className="flex items-center gap-3">
          {/* View Controls */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            <Button
              size="sm"
              variant={showWireframe ? 'default' : 'ghost'}
              onClick={onWireframeToggle}
              className="h-8 px-2 text-xs"
              aria-label={`${showWireframe ? 'Hide' : 'Show'} wireframe`}
            >
              <Square className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={showShadows ? 'default' : 'ghost'}
              onClick={onShadowsToggle}
              className="h-8 px-2 text-xs"
              aria-label={`${showShadows ? 'Hide' : 'Show'} shadows`}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={showGrid ? 'default' : 'ghost'}
              onClick={onGridToggle}
              className="h-8 px-2 text-xs"
              aria-label={`${showGrid ? 'Hide' : 'Show'} grid`}
            >
              <Grid3X3 className="h-3 w-3" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Main Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onMaterialsOpen}
              className="h-9 px-4 font-medium"
              aria-label="Open facade selection"
            >
              <Palette className="h-4 w-4 mr-2" />
              Facade
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onPresetsOpen}
              className="h-9 px-4 font-medium"
              aria-label="Open house designs"
            >
              <Building className="h-4 w-4 mr-2" />
              Designs
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onAIOpen}
              className="h-9 px-4 font-medium"
              aria-label="Open AI assistant"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onGalleryOpen}
              className="h-9 px-4 font-medium"
              aria-label="Open render gallery"
            >
              <Camera className="h-4 w-4 mr-2" />
              Gallery
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Exit Button */}
          {showExitButton && (
            <Button
              size="sm"
              variant="outline"
              onClick={onExit}
              className="h-9 px-4 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200"
              aria-label="Exit visualizer"
            >
              Exit
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
