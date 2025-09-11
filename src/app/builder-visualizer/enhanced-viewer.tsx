/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Canvas } from '@react-three/fiber'
import { Environment, CameraControls } from '@react-three/drei'
import {
  Share2,
  Palette,
  Eye,
  Camera,
  Download,
  Wand2,
  Home,
  Building,
  Layers,
  Maximize,
  Minimize,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Loader2,
} from 'lucide-react'
import { useAIHouseGenerator } from './services/ai-house-generator'
import { getDefaultHouse, calculateTotalCost, type MaterialSelection } from './data'
import type { Model3D, RenderResult, Material } from './types'
import { AIAssistant } from './components/AIAssistant'
import { SectionConfigPopup } from './components/SectionConfigPopup'
import { House3DRenderer, DefaultHouse } from './components/House3DRenderer'
import { PresetSelector } from './components/PresetSelector'

interface ViewPreset {
  name: string
  position: [number, number, number]
  target: [number, number, number]
  icon: React.ReactNode
}

interface EnhancedBuilderViewerProps {
  onExitFullscreen?: () => void
  defaultFullscreen?: boolean
  previewMode?: boolean
}

export default function EnhancedBuilderViewer({
  onExitFullscreen,
  defaultFullscreen,
  previewMode = false,
}: EnhancedBuilderViewerProps) {
  const [currentModel, setCurrentModel] = useState<any | Model3D | null>(null)
  const [renders, setRenders] = useState<RenderResult[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, MaterialSelection>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    roof: false,
    walls: false,
    trim: false,
    doors: false,
    windows: false,
  })
  const [isMaterialsCollapsed, setIsMaterialsCollapsed] = useState(false)
  const [isAICollapsed, setIsAICollapsed] = useState(false)
  const [isRenderGalleryCollapsed, setIsRenderGalleryCollapsed] = useState(false)
  const [cameraPreset, setCameraPreset] = useState<string>('front')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiStyle, setAiStyle] = useState<'modern' | 'traditional' | 'contemporary' | 'minimalist'>(
    'modern'
  )
  const [aiBudget, setAiBudget] = useState<'low' | 'medium' | 'high' | 'premium'>('medium')
  const [isFullscreen, setIsFullscreen] = useState(defaultFullscreen || false)
  const [viewMode, setViewMode] = useState<'exterior' | 'interior'>('exterior')
  const [selectedPreset, setSelectedPreset] = useState<string>('luxury-contemporary')

  // AI Assistant state
  const [isAIAssistantVisible, setIsAIAssistantVisible] = useState(false)
  const [isAIAssistantCollapsed, setIsAIAssistantCollapsed] = useState(false)

  // Section configuration state
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

  const cameraControlsRef = useRef<any>(null)
  const { generateHouse, enhanceRender, generateVariations, isGenerating, isEnhancing, error } =
    useAIHouseGenerator()

  // Initialize with default house model from data
  useState(() => {
    if (!currentModel) {
      const defaultHouse = getDefaultHouse()
      setCurrentModel(defaultHouse)
    }
  })

  // View presets for different camera angles
  const viewPresets: Record<string, ViewPreset> = useMemo(
    () => ({
      front: {
        name: 'Front View',
        position: viewMode === 'exterior' ? [0, 2, 8] : [0, 1.5, 3],
        target: viewMode === 'exterior' ? [0, 2, 0] : [0, 1.5, 0],
        icon: <Eye className="h-4 w-4" />,
      },
      back: {
        name: 'Back View',
        position: viewMode === 'exterior' ? [0, 2, -8] : [0, 1.5, -3],
        target: viewMode === 'exterior' ? [0, 2, 0] : [0, 1.5, 0],
        icon: <Eye className="h-4 w-4" />,
      },
      left: {
        name: 'Left View',
        position: viewMode === 'exterior' ? [-8, 2, 0] : [-3, 1.5, 0],
        target: viewMode === 'exterior' ? [0, 2, 0] : [0, 1.5, 0],
        icon: <Eye className="h-4 w-4" />,
      },
      right: {
        name: 'Right View',
        position: viewMode === 'exterior' ? [8, 2, 0] : [3, 1.5, 0],
        target: viewMode === 'exterior' ? [0, 2, 0] : [0, 1.5, 0],
        icon: <Eye className="h-4 w-4" />,
      },
      aerial: {
        name: 'Aerial View',
        position: [0, 12, 0],
        target: [0, 0, 0],
        icon: <Camera className="h-4 w-4" />,
      },
      interior: {
        name: 'Interior View',
        position: [0, 1.5, 3],
        target: [0, 1.5, 0],
        icon: <Home className="h-4 w-4" />,
      },
    }),
    [viewMode]
  )

  // Sample materials data
  const materials: Record<string, MaterialSelection[]> = {
    roof: [
      {
        id: 'concrete-silver',
        name: 'Silver Gum (Designer)',
        category: 'roof',
        color: '#C0C0C0',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-linen',
        name: 'Linen (Designer)',
        category: 'roof',
        color: '#F5E6D3',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-alabaster',
        name: 'Alabaster (Designer)',
        category: 'roof',
        color: '#F8F8FF',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-aspen',
        name: 'Aspen (Designer)',
        category: 'roof',
        color: '#F0E68C',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-vanilla',
        name: 'Vanilla (Designer)',
        category: 'roof',
        color: '#F3E5AB',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-late-mist',
        name: 'Late Mist (Designer)',
        category: 'roof',
        color: '#E6E6FA',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-chestnut',
        name: 'Chestnut (Designer)',
        category: 'roof',
        color: '#954535',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-storm-grey',
        name: 'Storm Grey (Designer)',
        category: 'roof',
        color: '#708090',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-cool-smoke',
        name: 'Cool Smoke (Designer)',
        category: 'roof',
        color: '#848884',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-deep-shadow',
        name: 'Deep Shadow (Designer)',
        category: 'roof',
        color: '#2F4F4F',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-earth-red',
        name: 'Earth Red (Designer)',
        category: 'roof',
        color: '#8B4513',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-bronze-duo',
        name: 'Bronze Duo (Designer)',
        category: 'roof',
        color: '#CD7F32',
        texture: 'concrete',
        cost: 45,
      },
      {
        id: 'concrete-sunset-duo',
        name: 'Sunset Duo (Designer)',
        category: 'roof',
        color: '#FF7F50',
        texture: 'concrete',
        cost: 45,
      },
    ],
    walls: [
      {
        id: 'brick-char',
        name: 'Char Brick',
        category: 'walls',
        color: '#36454F',
        texture: 'brick',
        cost: 35,
      },
      {
        id: 'render-lexicon',
        name: 'Lexicon Half',
        category: 'walls',
        color: '#F5F5F5',
        texture: 'render',
        cost: 25,
      },
      {
        id: 'render-whisper',
        name: 'Whisper White',
        category: 'walls',
        color: '#FFFFFF',
        texture: 'render',
        cost: 25,
      },
      {
        id: 'brick-terracotta',
        name: 'Terracotta Brick',
        category: 'walls',
        color: '#E2725B',
        texture: 'brick',
        cost: 35,
      },
      {
        id: 'cladding-cedar',
        name: 'Cedar Cladding',
        category: 'walls',
        color: '#8B4513',
        texture: 'wood',
        cost: 55,
      },
    ],
    trim: [
      {
        id: 'trim-dover-white',
        name: 'Dover White',
        category: 'trim',
        color: '#F8F8FF',
        texture: 'paint',
        cost: 15,
      },
      {
        id: 'trim-wallaby',
        name: 'Wallaby',
        category: 'trim',
        color: '#8B7355',
        texture: 'paint',
        cost: 15,
      },
      {
        id: 'trim-surfmist',
        name: 'Surfmist',
        category: 'trim',
        color: '#C0C0C0',
        texture: 'paint',
        cost: 15,
      },
    ],
    doors: [
      {
        id: 'door-white',
        name: 'White Door',
        category: 'doors',
        color: '#FFFFFF',
        texture: 'paint',
        cost: 200,
      },
      {
        id: 'door-charcoal',
        name: 'Charcoal Door',
        category: 'doors',
        color: '#36454F',
        texture: 'paint',
        cost: 200,
      },
      {
        id: 'door-wood',
        name: 'Wood Door',
        category: 'doors',
        color: '#8B4513',
        texture: 'wood',
        cost: 300,
      },
    ],
    windows: [
      {
        id: 'window-white',
        name: 'White Frame',
        category: 'windows',
        color: '#FFFFFF',
        texture: 'metal',
        cost: 150,
      },
      {
        id: 'window-black',
        name: 'Black Frame',
        category: 'windows',
        color: '#000000',
        texture: 'metal',
        cost: 150,
      },
      {
        id: 'window-wood',
        name: 'Wood Frame',
        category: 'windows',
        color: '#8B4513',
        texture: 'wood',
        cost: 200,
      },
    ],
  }

  const handleMaterialSelect = useCallback((material: MaterialSelection) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [material.category]: material,
    }))
  }, [])

  const toggleSectionExpanded = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const toggleMaterialsCollapsed = useCallback(() => {
    setIsMaterialsCollapsed((prev) => !prev)
  }, [])

  const toggleAICollapsed = useCallback(() => {
    setIsAICollapsed((prev) => !prev)
  }, [])

  const toggleRenderGalleryCollapsed = useCallback(() => {
    setIsRenderGalleryCollapsed((prev) => !prev)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (onExitFullscreen && isFullscreen) {
      onExitFullscreen()
    } else {
      setIsFullscreen((prev) => !prev)
    }
  }, [isFullscreen, onExitFullscreen])

  // AI Assistant handlers
  const toggleAIAssistant = useCallback(() => {
    setIsAIAssistantVisible((prev) => !prev)
  }, [])

  const toggleAIAssistantCollapse = useCallback(() => {
    setIsAIAssistantCollapsed((prev) => !prev)
  }, [])

  const handleModelGenerated = useCallback((model: unknown) => {
    setCurrentModel(model)
  }, [])

  // Section configuration handlers
  const handleSectionClick = useCallback(
    (sectionId: string, sectionName: string, event: React.MouseEvent) => {
      event.stopPropagation()
      setConfigPopup({
        isOpen: true,
        sectionId,
        sectionName,
        position: { x: event.clientX, y: event.clientY },
      })
    },
    []
  )

  const handleMaterialChange = useCallback(
    (sectionId: string, material: Material) => {
      if (currentModel?.sections) {
        const updatedModel = {
          ...currentModel,
          sections: currentModel.sections.map((section: any) =>
            section.id === sectionId
              ? { ...section, material: { ...material, appliedAt: new Date() } }
              : section
          ),
        }
        setCurrentModel(updatedModel)
      }
    },
    [currentModel]
  )

  const handleColorChange = useCallback(
    (sectionId: string, color: string) => {
      if (currentModel?.sections) {
        const updatedModel = {
          ...currentModel,
          sections: currentModel.sections.map((section: any) =>
            section.id === sectionId && section.material
              ? { ...section, material: { ...section.material, color } }
              : section
          ),
        }
        setCurrentModel(updatedModel)
      }
    },
    [currentModel]
  )

  const handleViewPresetChange = useCallback(
    (preset: string) => {
      setCameraPreset(preset)
      if (cameraControlsRef.current) {
        const view = viewPresets[preset]
        cameraControlsRef.current.setLookAt(...view.position, ...view.target, true)
      }
    },
    [viewPresets]
  )

  const handleAIGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) return

    const result = await generateHouse({
      prompt: aiPrompt,
      materials: selectedMaterials,
      style: aiStyle,
      budget: aiBudget,
    })

    if (result?.model) {
      setCurrentModel(result.model)
    }

    if (result?.renders) {
      setRenders(result.renders as RenderResult[])
    }
  }, [aiPrompt, selectedMaterials, aiStyle, aiBudget, generateHouse])

  const handleEnhanceRender = useCallback(
    async (viewpoint: string) => {
      if (!currentModel) return

      const result = await enhanceRender(currentModel.id, viewpoint)
      if (result?.renders) {
        setRenders((prev) => [...prev, ...(result.renders! as RenderResult[])])
      }
    },
    [currentModel, enhanceRender]
  )

  const handleGenerateVariations = useCallback(async () => {
    if (!currentModel) return

    const result = await generateVariations(currentModel, 3)
    if (result?.renders) {
      setRenders((prev) => [...prev, ...(result.renders! as unknown as RenderResult[])])
    }
  }, [currentModel, generateVariations])

  const getTotalCost = () => {
    return calculateTotalCost(selectedMaterials)
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} flex flex-col bg-gray-50`}>
      {/* Top Toolbar - Hidden in preview mode */}
      {!previewMode && (
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Builder Visualizer</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 border-blue-200 text-blue-700"
                onClick={toggleAIAssistant}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button variant="outline" size="sm" className="bg-red-50 border-red-200 text-red-700">
                <Palette className="h-4 w-4 mr-2" />
                Materials
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'exterior' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('exterior')}
              >
                <Building className="h-4 w-4 mr-2" />
                Exterior
              </Button>
              <Button
                variant={viewMode === 'interior' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('interior')}
              >
                <Home className="h-4 w-4 mr-2" />
                Interior
              </Button>
            </div>

            <Badge variant="secondary">Total: ${getTotalCost().toLocaleString()}</Badge>

            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? (
                <Minimize className="h-4 w-4 mr-2" />
              ) : (
                <Maximize className="h-4 w-4 mr-2" />
              )}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - View Controls - Hidden in preview mode */}
        {!previewMode && (
          <div className="w-16 bg-gray-800 flex flex-col items-center py-4 gap-2 overflow-y-auto">
            {Object.entries(viewPresets).map(([key, preset]) => (
              <Button
                key={key}
                variant={cameraPreset === key ? 'default' : 'ghost'}
                size="sm"
                className="w-12 h-12 p-0 text-white hover:bg-gray-700"
                onClick={() => handleViewPresetChange(key)}
                title={preset.name}
              >
                {preset.icon}
              </Button>
            ))}
          </div>
        )}

        {/* Main 3D View */}
        <div className="flex-1 relative overflow-hidden">
          <Canvas camera={{ position: [0, 2, 8], fov: 45 }} shadows>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />

            {currentModel ? (
              <House3DRenderer
                materials={selectedMaterials}
                viewMode={viewMode}
                selectedPreset={selectedPreset}
                onSectionClick={handleSectionClick}
              />
            ) : (
              <DefaultHouse />
            )}

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
              <planeGeometry args={[50, 50]} />
              <meshStandardMaterial color="#f0f0f0" />
            </mesh>

            <CameraControls
              ref={cameraControlsRef}
              makeDefault
              dampingFactor={0.05}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
              minDistance={2}
              maxDistance={50}
            />
          </Canvas>

          {/* AI Generation Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 text-center shadow-xl">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                    <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Generating Design...</h3>
                    <p className="text-gray-600 mt-1">Creating your custom house design</p>
                    <div className="mt-3 w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full animate-pulse"
                        style={{ width: '60%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Initializing Overlay */}
          {!currentModel && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Building className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Wand2 className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Builder Visualizer</h3>
                  <p className="text-gray-600 max-w-sm">
                    Ready to transform your ideas into 3D reality. Select materials and generate
                    your dream house.
                  </p>
                </div>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Hidden in preview mode, show only final rendering options */}
        {!previewMode ? (
          <div
            className={`bg-white border-l flex flex-col overflow-hidden transition-all duration-300 ${
              isMaterialsCollapsed ? 'w-12' : 'w-80'
            }`}
          >
            {/* Collapsible Header */}
            <div className="p-4 border-b flex items-center justify-between">
              {!isMaterialsCollapsed && <h3 className="font-semibold">Materials</h3>}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMaterialsCollapsed}
                className="ml-auto"
              >
                {isMaterialsCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Collapsible Content */}
            {!isMaterialsCollapsed && (
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {/* Preset Selector */}
                  <PresetSelector
                    selectedPreset={selectedPreset}
                    onPresetSelect={setSelectedPreset}
                  />

                  {/* Materials Section */}
                  <div className="space-y-2">
                    {Object.entries(materials).map(([sectionKey, sectionMaterials]) => {
                      const isExpanded = expandedSections[sectionKey]
                      const selectedMaterial = selectedMaterials[sectionKey]

                      return (
                        <div key={sectionKey} className="border rounded-lg">
                          {/* Section Header */}
                          <button
                            onClick={() => toggleSectionExpanded(sectionKey)}
                            className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium capitalize">{sectionKey}</span>
                                {selectedMaterial && (
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: selectedMaterial.color }}
                                    title={selectedMaterial.name}
                                  />
                                )}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {sectionMaterials.length}
                              </Badge>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                          </button>

                          {/* Section Materials */}
                          {isExpanded && (
                            <div className="border-t">
                              {/* Scroll indicators */}
                              <div className="relative">
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

                                <div className="p-3 space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                  {sectionMaterials.map((material) => (
                                    <div
                                      key={material.id}
                                      className={`p-2 border rounded cursor-pointer transition-all hover:shadow-sm ${
                                        selectedMaterials[sectionKey]?.id === material.id
                                          ? 'border-blue-500 bg-blue-50'
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                      onClick={() => handleMaterialSelect(material)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-6 h-6 rounded border"
                                          style={{ backgroundColor: material.color }}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium truncate">
                                            {material.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            ${material.cost}/m²
                                          </p>
                                        </div>
                                        {selectedMaterials[sectionKey]?.id === material.id && (
                                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* AI Generation Section - Only show when materials panel is expanded */}
            {!isMaterialsCollapsed && (
              <div className="border-t bg-gray-50">
                {/* AI Header */}
                <div className="p-3 border-b flex items-center justify-between">
                  <h4 className="font-medium text-sm">AI Assistant</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAICollapsed}
                    className="h-6 w-6 p-0"
                  >
                    {isAICollapsed ? (
                      <ChevronRight className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </div>

                {/* AI Content */}
                {!isAICollapsed && (
                  <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                    {/* AI Prompt Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Describe your dream house
                      </label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., Modern two-story with large windows, metal roof, and contemporary finishes..."
                        className="w-full p-3 text-sm border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        rows={3}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{aiPrompt.length}/500 characters</span>
                        <span className={aiPrompt.length > 500 ? 'text-red-500' : ''}>
                          {aiPrompt.length > 500 ? 'Character limit exceeded' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Style and Budget Selection */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">
                          Architectural Style
                        </label>
                        <select
                          value={aiStyle}
                          onChange={(e) =>
                            setAiStyle(
                              e.target.value as
                                | 'modern'
                                | 'traditional'
                                | 'contemporary'
                                | 'minimalist'
                            )
                          }
                          className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="modern">Modern</option>
                          <option value="traditional">Traditional</option>
                          <option value="contemporary">Contemporary</option>
                          <option value="minimalist">Minimalist</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">Budget Range</label>
                        <select
                          value={aiBudget}
                          onChange={(e) =>
                            setAiBudget(e.target.value as 'low' | 'medium' | 'high' | 'premium')
                          }
                          className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="low">Low ($200-400/m²)</option>
                          <option value="medium">Medium ($400-600/m²)</option>
                          <option value="high">High ($600-800/m²)</option>
                          <option value="premium">Premium ($800+/m²)</option>
                        </select>
                      </div>
                    </div>

                    {/* Generate Button with Loading State */}
                    <Button
                      onClick={handleAIGenerate}
                      disabled={!aiPrompt.trim() || isGenerating || aiPrompt.length > 500}
                      className="w-full h-10 text-sm font-medium transition-all"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Design...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>

                    {/* Error Display */}
                    {error && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        {error}
                      </div>
                    )}

                    {/* Additional Actions */}
                    {currentModel && (
                      <div className="space-y-2 pt-2 border-t">
                        <p className="text-xs font-medium text-gray-700">Enhancements</p>
                        <div className="space-y-1">
                          <Button
                            onClick={() => handleEnhanceRender('Front View')}
                            disabled={isEnhancing}
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-xs"
                          >
                            {isEnhancing ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Enhancing...
                              </>
                            ) : (
                              <>
                                <Camera className="h-3 w-3 mr-1" />
                                Enhance Render
                              </>
                            )}
                          </Button>

                          <Button
                            onClick={handleGenerateVariations}
                            disabled={isGenerating}
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-xs"
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Layers className="h-3 w-3 mr-1" />
                                Generate Variations
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Preview Mode - Only Final Rendering Options */
          <div className="w-64 bg-white border-l flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm">Final Rendering</h3>
              <p className="text-xs text-gray-600 mt-1">Export your completed design</p>
            </div>

            <div className="flex-1 p-4 space-y-4">
              {/* Export Options */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Export Options</h4>
                <Button className="w-full" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download 3D Model
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Generate Renders
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Design
                </Button>
              </div>

              {/* Material Summary */}
              {Object.keys(selectedMaterials).length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-medium">Selected Materials</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedMaterials).map(([category, material]) => (
                      <div key={category} className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: material.color }}
                        />
                        <span className="capitalize">{category}:</span>
                        <span className="font-medium">{material.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Launch Full Editor */}
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" size="sm">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Launch Full Editor
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render Gallery */}
      {renders.length > 0 && (
        <div className="bg-white border-t">
          {/* Gallery Header */}
          <div className="p-3 border-b flex items-center justify-between">
            <h4 className="font-medium text-sm">Renders ({renders.length})</h4>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-6 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRenderGalleryCollapsed}
                className="h-6 w-6 p-0"
              >
                {isRenderGalleryCollapsed ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Gallery Content */}
          {!isRenderGalleryCollapsed && (
            <div className="p-4 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {renders.map((render) => (
                  <div key={render.id} className="border rounded overflow-hidden">
                    <div className="aspect-video bg-gray-100">
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Camera className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="font-medium text-xs">{render.viewpoint}</p>
                      <p className="text-xs text-gray-500">{render.lighting}</p>
                      <p className="text-xs text-gray-500">
                        {render.metadata.resolution.width}×{render.metadata.resolution.height}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Material Summary - Hidden in preview mode */}
      {!previewMode && (
        <div className="bg-white border-t p-4 max-h-32 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium">Current Selections</h4>
              <div className="flex items-center gap-4 mt-2 overflow-x-auto">
                {Object.entries(selectedMaterials).map(([category, material]) => (
                  <div key={category} className="flex items-center gap-2 whitespace-nowrap">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: material.color }}
                    />
                    <span className="text-sm capitalize">{category}:</span>
                    <span className="text-sm font-medium">{material.name}</span>
                  </div>
                ))}
                {Object.keys(selectedMaterials).length === 0 && (
                  <p className="text-sm text-gray-500">No materials selected</p>
                )}
              </div>
            </div>
            <div className="text-right ml-4">
              <p className="text-sm text-gray-600">Estimated Cost</p>
              <p className="text-xl font-semibold">${getTotalCost().toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      {isAIAssistantVisible && (
        <AIAssistant
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
          onModelGenerated={handleModelGenerated}
          isCollapsed={isAIAssistantCollapsed}
          onToggleCollapse={toggleAIAssistantCollapse}
        />
      )}

      {/* Section Configuration Popup */}
      <SectionConfigPopup
        isOpen={configPopup.isOpen}
        onClose={() => setConfigPopup((prev) => ({ ...prev, isOpen: false }))}
        sectionId={configPopup.sectionId}
        sectionName={configPopup.sectionName}
        currentMaterial={
          currentModel?.sections?.find((s: any) => s.id === configPopup.sectionId)?.material
        }
        onMaterialChange={handleMaterialChange}
        onColorChange={handleColorChange}
        position={configPopup.position}
      />
    </div>
  )
}