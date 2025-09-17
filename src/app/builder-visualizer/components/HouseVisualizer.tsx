'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, CameraControls } from '@react-three/drei'
import { Settings, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Target } from 'lucide-react'
import * as THREE from 'three'
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
  const [cameraControls, setCameraControls] = useState<CameraControls | null>(null)
  const [currentView, setCurrentView] = useState<
    'front' | 'back' | 'left' | 'right' | 'top' | 'iso'
  >('iso')

  // Use existing hooks
  const { state, setSelectedPreset, setSelectedFacade, handleMaterialSelect } = useViewerState()

  // Get current house plan data
  const currentHousePlan = useMemo(() => {
    if (!state.selectedPreset) return null
    return getHousePlanById(state.selectedPreset)
  }, [state.selectedPreset])

  // Generate model path based on plan and facade selection
  const modelPath = useMemo(() => {
    // Default model - always use double-storey.glb as fallback
    const defaultModel = '/models/double-storey.glb'

    if (!state.selectedPreset || !state.selectedFacade) {
      return defaultModel
    }

    // Generate path based on plan and facade
    // Format: /models/{plan-id}-{facade-id}.glb
    // Example: /models/modern-single-storey-contemporary.glb
    const planId = state.selectedPreset.toLowerCase().replace(/\s+/g, '-')
    const facadeId = state.selectedFacade.toLowerCase().replace(/\s+/g, '-')
    const customPath = `/models/${planId}-${facadeId}.glb`

    // For now, return default model since custom models aren't ready yet
    // TODO: When custom models are available, implement model existence check:
    // 1. Try to load customPath
    // 2. If it fails, fall back to defaultModel
    // 3. Update this logic to: return customPath
    console.log('Model path would be:', customPath, '(using default for now)')
    return defaultModel
  }, [state.selectedPreset, state.selectedFacade])

  // Debug logging
  console.log('HouseVisualizer Debug:', {
    selectedPreset: state.selectedPreset,
    selectedFacade: state.selectedFacade,
    currentHousePlan: currentHousePlan?.name,
    modelPath: modelPath,
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

      // Create section info - use house plan data if available, otherwise create default
      const sectionInfo = section || {
        id: sectionId,
        name: sectionId.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        type: 'wall', // Default type
      }

      setMaterialModalSection({
        id: sectionInfo.id,
        name: sectionInfo.name,
        type: sectionInfo.type,
      })
      setShowMaterialModal(true)

      console.log('Section clicked:', sectionId, 'Section info:', sectionInfo)
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

  // Camera control functions
  const handleViewChange = useCallback(
    (view: 'front' | 'back' | 'left' | 'right' | 'top' | 'iso') => {
      if (!cameraControls) return

      setCurrentView(view)

      const distance = 20 // Increased distance for better view
      const houseCenter = { x: 0, y: 8, z: 0 } // House center point

      switch (view) {
        case 'front':
          cameraControls.setLookAt(
            houseCenter.x,
            houseCenter.y,
            houseCenter.z + distance,
            houseCenter.x,
            houseCenter.y,
            houseCenter.z,
            true
          )
          break
        case 'back':
          cameraControls.setLookAt(
            houseCenter.x,
            houseCenter.y,
            houseCenter.z - distance,
            houseCenter.x,
            houseCenter.y,
            houseCenter.z,
            true
          )
          break
        case 'left':
          cameraControls.setLookAt(
            houseCenter.x - distance,
            houseCenter.y,
            houseCenter.z,
            houseCenter.x,
            houseCenter.y,
            houseCenter.z,
            true
          )
          break
        case 'right':
          cameraControls.setLookAt(
            houseCenter.x + distance,
            houseCenter.y,
            houseCenter.z,
            houseCenter.x,
            houseCenter.y,
            houseCenter.z,
            true
          )
          break
        case 'top':
          cameraControls.setLookAt(
            houseCenter.x,
            houseCenter.y + distance,
            houseCenter.z,
            houseCenter.x,
            houseCenter.y,
            houseCenter.z,
            true
          )
          break
        case 'iso':
          cameraControls.setLookAt(
            houseCenter.x + distance,
            houseCenter.y + distance,
            houseCenter.z + distance,
            houseCenter.x,
            houseCenter.y,
            houseCenter.z,
            true
          )
          break
      }
    },
    [cameraControls]
  )

  const handleResetCamera = useCallback(() => {
    if (!cameraControls) return
    // Reset to isometric view with house centered
    const distance = 20
    const houseCenter = { x: 0, y: 8, z: 0 }
    cameraControls.setLookAt(
      houseCenter.x + distance,
      houseCenter.y + distance,
      houseCenter.z + distance,
      houseCenter.x,
      houseCenter.y,
      houseCenter.z,
      true
    )
    setCurrentView('iso')
  }, [cameraControls])

  const handleCenterView = useCallback(() => {
    if (!cameraControls) return
    // Get current camera position and distance
    const currentPosition = cameraControls.getPosition(new THREE.Vector3())
    const target = new THREE.Vector3(0, 8, 0) // House center point

    // Calculate distance from current position to target
    const distance = currentPosition.distanceTo(target)

    // Keep the same distance but center on the house
    const direction = currentPosition.clone().sub(target).normalize()
    const newPosition = target.clone().add(direction.multiplyScalar(distance))

    cameraControls.setLookAt(
      newPosition.x,
      newPosition.y,
      newPosition.z,
      target.x,
      target.y,
      target.z,
      true
    )
  }, [cameraControls])

  const handleZoomIn = useCallback(() => {
    if (!cameraControls) return
    cameraControls.dolly(-2, true)
  }, [cameraControls])

  const handleZoomOut = useCallback(() => {
    if (!cameraControls) return
    cameraControls.dolly(2, true)
  }, [cameraControls])

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
            {/* View Controls */}
            <div className="flex items-center gap-1 mr-4">
              <Button
                size="sm"
                onClick={handleResetCamera}
                className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-gray-300 hover:text-white transition-colors"
                title="Reset Camera to Default View"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleCenterView}
                className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-gray-300 hover:text-white transition-colors"
                title="Center View on House"
              >
                <Target className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleZoomIn}
                className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-gray-300 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleZoomOut}
                className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-gray-300 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

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
              camera={{
                position: [15, 15, 15],
                fov: 45,
                near: 0.1,
                far: 1000,
              }}
              className="w-full h-full"
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false,
              }}
            >
              <Environment preset="studio" />
              <CameraControls
                makeDefault
                ref={setCameraControls}
                minDistance={3}
                maxDistance={100}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
                dampingFactor={0.05}
                mouseButtons={{
                  left: 1, // Left mouse button for rotation
                  middle: 2, // Middle mouse button for panning
                  right: 4, // Right mouse button for panning
                  wheel: 32, // Mouse wheel for zooming (ZOOM)
                }}
                touches={{
                  one: 64, // One finger for rotation (TOUCH_ROTATE)
                  two: 128, // Two fingers for panning (TOUCH_TRUCK)
                  three: 1024, // Three fingers for zooming (TOUCH_DOLLY)
                }}
                smoothTime={0.25}
                truckSpeed={2}
                dollySpeed={1}
              />
              {/* Enhanced lighting setup */}
              <ambientLight intensity={0.3} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1.2}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
              />
              <directionalLight position={[-10, 5, -5]} intensity={0.3} />
              <pointLight position={[0, 10, 0]} intensity={0.5} />
              <House3DRenderer
                modelPath={modelPath}
                selectedMaterials={state.selectedMaterials}
                viewMode={state.viewMode}
                showWireframe={state.showWireframe}
                showShadows={state.showShadows}
                showGrid={state.showGrid}
                onSectionClick={handleSectionClick}
                onModelLoad={(model) => {
                  console.log('Model loaded successfully:', model)
                }}
                onModelError={(error) => {
                  console.error('Model loading error:', error)
                }}
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

      {/* View Preset Panel - Always Visible */}
      <div className="absolute top-30 left-2 bg-gray-800/95 backdrop-blur-sm rounded-lg p-2 border border-gray-700 shadow-xl z-50">
        <div className="flex items-center gap-1">
          {[
            { id: 'front', label: 'F', icon: '→', title: 'Front View' },
            { id: 'back', label: 'B', icon: '←', title: 'Back View' },
            { id: 'left', label: 'L', icon: '↑', title: 'Left View' },
            { id: 'right', label: 'R', icon: '↓', title: 'Right View' },
            { id: 'top', label: 'T', icon: '⌄', title: 'Top View' },
            { id: 'iso', label: '3D', icon: '◊', title: '3D View' },
          ].map((view) => (
            <Button
              key={view.id}
              size="sm"
              variant="ghost"
              onClick={() =>
                handleViewChange(view.id as 'front' | 'back' | 'left' | 'right' | 'top' | 'iso')
              }
              className={`h-8 w-8 p-0 text-xs ${
                currentView === view.id
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700/50 hover:bg-gray-600 text-gray-300'
              }`}
              title={view.title}
            >
              {view.label}
            </Button>
          ))}
        </div>
      </div>

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
