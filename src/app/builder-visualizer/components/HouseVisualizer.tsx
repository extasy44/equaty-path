'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, CameraControls } from '@react-three/drei'
import { Settings, Maximize2, Minimize2 } from 'lucide-react'
import { House3DRenderer } from './House3DRenderer'
import { UnifiedOptionsPanel } from './UnifiedOptionsPanel'
import { ViewerStatusBar } from './ViewerStatusBar'
import { WebGLErrorBoundary } from './WebGLErrorBoundary'
import { MaterialSelectionModal } from './MaterialSelectionModal'
import { WebGLDiagnostic } from './WebGLDiagnostic'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useViewerState } from '../hooks/useViewerState'
import { getHousePlanById, calculateTotalCost, generateAIPrompt } from '../data'
import type { MaterialSelection } from '../data'

export default function HouseVisualizer() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [showMaterialModal, setShowMaterialModal] = useState(false)
  const [showWebGLDiagnostic, setShowWebGLDiagnostic] = useState(false)
  const [materialModalSection, setMaterialModalSection] = useState<{
    id: string
    name: string
    type: string
  } | null>(null)

  // Use existing hooks
  const { state, setSelectedPreset, setSelectedFacade, handleMaterialSelect } = useViewerState()

  // Get current house plan data
  const currentHousePlan = useMemo(() => {
    if (!state.selectedPreset) return null
    return getHousePlanById(state.selectedPreset)
  }, [state.selectedPreset])

  // Debug logging
  console.log('MeshyVisualizer Debug:', {
    selectedPreset: state.selectedPreset,
    selectedFacade: state.selectedFacade,
    currentHousePlan: currentHousePlan?.name,
    hasGeometry: !!currentHousePlan?.geometry?.sections,
    sectionsCount: currentHousePlan?.geometry?.sections?.length || 0,
  })

  // Calculate costs
  const totalCost = useMemo(() => {
    if (!currentHousePlan) return 0
    return calculateTotalCost(state.selectedMaterials)
  }, [currentHousePlan, state.selectedMaterials])

  // Generate AI prompt
  const aiPrompt = useMemo(() => {
    if (!currentHousePlan || !state.selectedFacade) return ''
    return generateAIPrompt(currentHousePlan, state.selectedFacade, state.selectedMaterials)
  }, [currentHousePlan, state.selectedFacade, state.selectedMaterials])

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Handle section selection
  const handleSectionClick = useCallback(
    (sectionId: string) => {
      setSelectedSection(sectionId)

      // Get section info from house plan
      const section = currentHousePlan?.geometry?.sections?.find((s) => s.id === sectionId)
      if (section) {
        setMaterialModalSection({
          id: sectionId,
          name: section.name,
          type: section.type,
        })
        setShowMaterialModal(true)
      }

      console.log('Section clicked:', sectionId)
    },
    [currentHousePlan]
  )

  // Handle material selection
  const handleMaterialSelectInternal = useCallback(
    (sectionId: string, material: MaterialSelection) => {
      handleMaterialSelect(material, sectionId)
      setShowMaterialModal(false)
      setMaterialModalSection(null)
      console.log('Material selected:', material.name, 'for section:', sectionId)
    },
    [handleMaterialSelect]
  )

  // Get facade name for display
  const facadeName = useMemo(() => {
    if (!currentHousePlan || !state.selectedFacade) return 'None'
    const facade = currentHousePlan.facadeOptions[state.selectedFacade]
    return facade ? facade.name : 'Unknown'
  }, [currentHousePlan, state.selectedFacade])

  // Count selected materials
  const selectedMaterialsCount = useMemo(() => {
    return Object.keys(state.selectedMaterials).length
  }, [state.selectedMaterials])

  return (
    <main className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-white">Builder Visualizer</div>
        </div>
      </header>

      {/* Full Screen 3D Canvas */}
      <section className="flex-1 flex flex-col bg-gray-900 relative">
        {/* Canvas Header */}
        <header className="h-12 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="text-xl font-medium text-white">3D Viewport</div>
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-400 border-green-500/30"
            >
              Live Preview
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-gray-300 hover:text-white transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>

            <Button
              size="sm"
              onClick={() => setShowWebGLDiagnostic(!showWebGLDiagnostic)}
              className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-gray-300 hover:text-white transition-colors"
            >
              Debug
            </Button>

            <Button
              size="sm"
              onClick={toggleFullscreen}
              className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-gray-300 hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* 3D Canvas */}
        <div ref={canvasRef} className="flex-1 relative">
          <WebGLErrorBoundary>
            <Canvas
              camera={{ position: [10, 10, 10], fov: 50 }}
              className="w-full h-full"
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false,
              }}
              onCreated={({ gl }) => {
                // Enhanced WebGL context management
                const canvas = gl.domElement

                // Handle WebGL context loss
                canvas.addEventListener('webglcontextlost', (event) => {
                  console.warn('WebGL context lost, attempting to restore...')
                  event.preventDefault()

                  // Show user-friendly message
                  const errorDiv = document.createElement('div')
                  errorDiv.innerHTML = `
                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                background: rgba(0,0,0,0.9); color: white; padding: 20px; border-radius: 8px; 
                                z-index: 10000; text-align: center;">
                      <h3>3D Renderer Temporarily Unavailable</h3>
                      <p>WebGL context lost. Attempting to restore...</p>
                      <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; 
                                     background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Reload Page
                      </button>
                    </div>
                  `
                  document.body.appendChild(errorDiv)
                })

                canvas.addEventListener('webglcontextrestored', () => {
                  console.log('WebGL context restored')
                  // Remove error message if it exists
                  const errorDiv = document.querySelector('[style*="position: fixed"]')
                  if (errorDiv) errorDiv.remove()

                  // Force re-render
                  setTimeout(() => {
                    window.location.reload()
                  }, 1000)
                })

                // Additional error handling
                gl.domElement.addEventListener('error', (event) => {
                  console.error('Canvas error:', event)
                })
              }}
            >
              <Environment preset="studio" />
              <CameraControls makeDefault />
              {/* Add some basic lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
              <House3DRenderer
                housePlan={currentHousePlan}
                selectedMaterials={state.selectedMaterials}
                selectedFacade={state.selectedFacade}
                viewMode={state.viewMode}
                showWireframe={state.showWireframe}
                showShadows={state.showShadows}
                showGrid={state.showGrid}
                onSectionClick={handleSectionClick}
              />
            </Canvas>
          </WebGLErrorBoundary>
        </div>

        {/* Status Bar */}
        <ViewerStatusBar
          planName={currentHousePlan?.name || 'No Plan Selected'}
          builderName="Builder Visualizer"
          facadeName={facadeName}
          selectedMaterialsCount={selectedMaterialsCount}
          totalCost={totalCost}
          viewMode={state.viewMode}
          isGenerating={false}
          isEnhancing={false}
        />
      </section>

      {/* Unified Settings Panel */}
      <UnifiedOptionsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        selectedPreset={state.selectedPreset}
        selectedFacade={state.selectedFacade}
        onPresetSelect={(presetId: string) => setSelectedPreset(presetId)}
        onFacadeSelect={(facadeId: string) => setSelectedFacade(facadeId)}
        onGalleryOpen={() => console.log('Gallery opened')}
        housePlan={currentHousePlan}
        selectedMaterials={state.selectedMaterials}
        generateAIPrompt={() => aiPrompt}
      />

      {/* Section Selection Info */}
      {selectedSection && (
        <aside className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3">
          <div className="text-sm text-gray-300">
            <div className="font-medium">Selected Section: {selectedSection}</div>
            <div className="text-xs text-gray-400">Click to configure materials</div>
          </div>
        </aside>
      )}

      {/* Material Selection Modal */}
      {materialModalSection && (
        <MaterialSelectionModal
          isOpen={showMaterialModal}
          onClose={() => {
            setShowMaterialModal(false)
            setMaterialModalSection(null)
          }}
          sectionId={materialModalSection.id}
          sectionName={materialModalSection.name}
          sectionType={materialModalSection.type}
          currentMaterial={state.selectedMaterials[materialModalSection.id]}
          onMaterialSelect={handleMaterialSelectInternal}
        />
      )}

      {/* WebGL Diagnostic Modal */}
      {showWebGLDiagnostic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] overflow-y-auto">
            <WebGLDiagnostic />
            <div className="mt-4 text-center">
              <Button onClick={() => setShowWebGLDiagnostic(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
