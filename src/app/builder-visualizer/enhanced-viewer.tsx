/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, CameraControls } from '@react-three/drei'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useAIHouseGenerator } from './services/ai-house-generator'
import {
  getHousePlans,
  getHousePlanById,
  calculateTotalCost,
  calculateUpgradeCost,
  generateAIPrompt,
} from './data'
import { AIAssistantDrawer } from './components/AIAssistantDrawer'
import { SectionConfigPopup } from './components/SectionConfigPopup'
import { House3DRenderer } from './components/House3DRenderer'
import { ViewerNavigation } from './components/ViewerNavigation'
import { ViewerStatusBar } from './components/ViewerStatusBar'
import { StylePresetsDrawer } from './components/StylePresetsDrawer'
import { HousePlansDrawer } from './components/HousePlansDrawer'
import { ViewSettings } from './components/ViewSettings'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useViewerState } from './hooks/useViewerState'
import { useViewerHandlers } from './hooks/useViewerHandlers'

interface EnhancedViewerProps {
  onExit?: () => void
}

export default function EnhancedViewer({ onExit }: EnhancedViewerProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const {
    state,
    handleMaterialSelect,
    handleFacadeSelect,
    handleViewModeChange,
    toggleWireframe,
    toggleShadows,
    toggleGrid,
    openMaterialsModal,
    closeMaterialsModal,
    openPresetModal,
    closePresetModal,
    openAIModal,
    closeAIModal,
    openGalleryModal,
    closeGalleryModal,
    setSelectedPreset,
    setCurrentHousePlan,
  } = useViewerState()

  const { handleExitToWeb } = useViewerHandlers({
    onExit,
  })

  // ============================================================================
  // LOCAL STATE & REFS
  // ============================================================================

  const [configPopup, setConfigPopup] = useState<{
    isOpen: boolean
    sectionId: string
    sectionName: string
    position: { x: number; y: number }
  }>({
    isOpen: false,
    sectionId: '',
    sectionName: '',
    position: { x: 0, y: 0 },
  })

  const [renderResults] = useState<any[]>([])
  const cameraControlsRef = useRef<any>(null)
  const { isGenerating, isEnhancing } = useAIHouseGenerator()

  // View settings state
  const [currentEnvironment, setCurrentEnvironment] = useState('sunset')
  const [currentLighting, setCurrentLighting] = useState('daylight')

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  // Load house plans
  const housePlans = getHousePlans()

  // Update current house plan when preset changes
  useEffect(() => {
    const plan = getHousePlanById(state.selectedPreset)
    setCurrentHousePlan(plan)
  }, [state.selectedPreset, setCurrentHousePlan])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSectionClick = useCallback(
    (sectionId: string, sectionName: string, event: React.MouseEvent) => {
      event.stopPropagation()

      // Calculate popup position relative to clicked element
      let x = window.innerWidth / 2 - 192 // Center horizontally
      let y = window.innerHeight / 2 - 200 // Center vertically

      try {
        if (
          event.currentTarget &&
          typeof event.currentTarget.getBoundingClientRect === 'function'
        ) {
          const rect = event.currentTarget.getBoundingClientRect()
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          const popupWidth = 384 // w-96 = 24rem = 384px
          const popupHeight = 400 // Estimated height

          x = Math.max(50, Math.min(viewportWidth - popupWidth - 50, rect.left + rect.width / 2))
          y = Math.max(100, Math.min(viewportHeight - popupHeight - 100, rect.top - 50))
        }
      } catch (error) {
        console.warn('Could not calculate popup position, using default:', error)
      }

      setConfigPopup({
        isOpen: true,
        sectionId,
        sectionName,
        position: { x, y },
      })
    },
    []
  )

  const handleViewPresetSelect = useCallback((preset: any) => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setPosition(
        preset.position[0],
        preset.position[1],
        preset.position[2],
        true
      )
      cameraControlsRef.current.setTarget(
        preset.target[0],
        preset.target[1],
        preset.target[2],
        true
      )
    }
  }, [])

  const handleEnvironmentChange = useCallback((environment: string) => {
    setCurrentEnvironment(environment)
  }, [])

  const handleLightingChange = useCallback((lighting: string) => {
    setCurrentLighting(lighting)
  }, [])

  // ============================================================================
  // CALCULATIONS
  // ============================================================================

  const totalCost = useMemo(() => {
    if (!state.currentHousePlan) {
      return calculateTotalCost(state.selectedMaterials || {})
    }
    return calculateUpgradeCost(state.currentHousePlan, 'hyatt', state.selectedMaterials || {})
  }, [state.selectedMaterials, state.currentHousePlan])

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div id="builder-visualizer" className="relative w-full h-full bg-gray-50">
      {/* View Settings - Top Left */}
      <ViewSettings
        viewMode={state.viewMode}
        onViewPresetSelect={handleViewPresetSelect}
        onEnvironmentChange={handleEnvironmentChange}
        onLightingChange={handleLightingChange}
        currentEnvironment={currentEnvironment}
        currentLighting={currentLighting}
      />

      {/* Main Navigation */}
      <ViewerNavigation
        viewMode={state.viewMode}
        onViewModeChange={handleViewModeChange}
        onMaterialsOpen={openMaterialsModal}
        onPresetsOpen={openPresetModal}
        onAIOpen={openAIModal}
        onGalleryOpen={openGalleryModal}
        onExit={handleExitToWeb}
        showExitButton={true}
        showWireframe={state.showWireframe}
        showShadows={state.showShadows}
        showGrid={state.showGrid}
        onWireframeToggle={toggleWireframe}
        onShadowsToggle={toggleShadows}
        onGridToggle={toggleGrid}
        currentFacade={state.selectedFacade}
        currentHousePlan={state.currentHousePlan?.name}
      />

      {/* Main 3D Viewer */}
      <div className="relative w-full h-full pt-12 pb-12">
        <Canvas camera={{ position: [10, 10, 10], fov: 50 }} className="w-full h-full" shadows>
          <Environment preset={currentEnvironment as any} />
          <CameraControls ref={cameraControlsRef} />

          <House3DRenderer
            materials={state.selectedMaterials as any}
            viewMode={state.viewMode === '3d' ? 'exterior' : 'interior'}
            selectedPreset={state.selectedPreset}
            onSectionClick={handleSectionClick}
          />
        </Canvas>

        {/* Loading Overlay */}
        {(isGenerating || isEnhancing) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg font-medium">
                {isGenerating ? 'Generating house...' : 'Enhancing render...'}
              </span>
            </div>
          </div>
        )}

        {/* Section Configuration Popup */}
        {configPopup.isOpen && (
          <SectionConfigPopup
            isOpen={configPopup.isOpen}
            onClose={() => setConfigPopup({ ...configPopup, isOpen: false })}
            sectionId={configPopup.sectionId}
            sectionName={configPopup.sectionName}
            currentMaterial={state.selectedMaterials[configPopup.sectionId] as any}
            onMaterialChange={(sectionId, material) => {
              handleMaterialSelect(material as any, sectionId)
              setConfigPopup({ ...configPopup, isOpen: false })
            }}
            onColorChange={() => {
              // Handle color change
              setConfigPopup({ ...configPopup, isOpen: false })
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <ViewerStatusBar
        planName={state.currentHousePlan?.name || state.selectedPreset}
        builderName={state.currentHousePlan?.builder || 'N/A'}
        facadeName={state.currentHousePlan?.facade || 'N/A'}
        selectedMaterialsCount={Object.keys(state.selectedMaterials).length}
        totalCost={totalCost}
        viewMode={state.viewMode.toUpperCase()}
        isGenerating={isGenerating}
        isEnhancing={isEnhancing}
      />

      {/* Style Presets Drawer */}
      <StylePresetsDrawer
        isOpen={state.isMaterialsModalOpen}
        onClose={closeMaterialsModal}
        selectedPreset={state.selectedPreset}
        selectedFacade={state.selectedFacade}
        onFacadeSelect={(facadeId) => handleFacadeSelect(state.selectedPreset, facadeId)}
      />

      {/* House Plans Drawer */}
      <HousePlansDrawer
        isOpen={state.isPresetModalOpen}
        onClose={closePresetModal}
        housePlans={housePlans}
        selectedPreset={state.selectedPreset}
        onPresetSelect={setSelectedPreset}
      />

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={state.isAIModalOpen}
        onClose={closeAIModal}
        housePlan={state.currentHousePlan}
        selectedMaterials={state.selectedMaterials}
        generateAIPrompt={generateAIPrompt}
      />

      {/* Render Gallery Modal */}
      <Dialog open={state.isRenderGalleryModalOpen} onOpenChange={closeGalleryModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Render Gallery</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderResults.map((result, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={result.url}
                    alt={`Render ${index + 1}`}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium">Viewpoint: {result.viewpoint}</p>
                  <p className="text-gray-500">Lighting: {result.lighting}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
