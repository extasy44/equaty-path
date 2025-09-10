/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useCallback } from 'react'
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
} from 'lucide-react'
import { useAIHouseGenerator } from './services/ai-house-generator'
import { getDefaultHouse, calculateTotalCost, type MaterialSelection } from './data'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Model3D, RenderResult } from './types'

interface ViewPreset {
  name: string
  position: [number, number, number]
  target: [number, number, number]
  icon: React.ReactNode
}

export default function EnhancedBuilderViewer() {
  const [currentModel, setCurrentModel] = useState<any | Model3D | null>(null)
  const [renders, setRenders] = useState<RenderResult[]>([])
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState<
    'roof' | 'walls' | 'trim' | 'doors' | 'windows'
  >('roof')
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, MaterialSelection>>({})
  const [cameraPreset, setCameraPreset] = useState<string>('front')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiStyle, setAiStyle] = useState<'modern' | 'traditional' | 'contemporary' | 'minimalist'>(
    'modern'
  )
  const [aiBudget, setAiBudget] = useState<'low' | 'medium' | 'high' | 'premium'>('medium')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'exterior' | 'interior'>('exterior')

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
  const viewPresets: Record<string, ViewPreset> = {
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
  }

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
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Builder Visualizer</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
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

          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
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

      <div className="flex-1 flex">
        {/* Left Sidebar - View Controls */}
        <div className="w-16 bg-gray-800 flex flex-col items-center py-4 gap-2">
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

        {/* Main 3D View */}
        <div className="flex-1 relative">
          <Canvas camera={{ position: [0, 2, 8], fov: 45 }} shadows>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />

            {currentModel ? (
              <EnhancedModelViewer
                model={currentModel}
                materials={selectedMaterials}
                viewMode={viewMode}
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
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 text-center">
                <Wand2 className="h-8 w-8 mx-auto mb-4 text-blue-600 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">AI Generating Design...</h3>
                <p className="text-gray-600">Creating your custom house design</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Material Selection */}
        <div className="w-80 bg-white border-l flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-2">Material Selection</h3>
            <Tabs
              value={selectedMaterialCategory}
              onValueChange={(value) => setSelectedMaterialCategory(value as any)}
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="roof" className="text-xs">
                  Roof
                </TabsTrigger>
                <TabsTrigger value="walls" className="text-xs">
                  Walls
                </TabsTrigger>
                <TabsTrigger value="trim" className="text-xs">
                  Trim
                </TabsTrigger>
                <TabsTrigger value="doors" className="text-xs">
                  Doors
                </TabsTrigger>
                <TabsTrigger value="windows" className="text-xs">
                  Windows
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 capitalize">{selectedMaterialCategory}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {materials[selectedMaterialCategory]?.map((material) => (
                    <div
                      key={material.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedMaterials[selectedMaterialCategory]?.id === material.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleMaterialSelect(material)}
                    >
                      <div
                        className="w-full h-8 rounded mb-2"
                        style={{ backgroundColor: material.color }}
                      />
                      <p className="text-xs font-medium">{material.name}</p>
                      <p className="text-xs text-gray-500">${material.cost}/m²</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Generation Section */}
          <div className="p-4 border-t bg-gray-50">
            <h4 className="font-medium mb-3">AI Design Assistant</h4>
            <div className="space-y-3">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your dream house... (e.g., 'Modern two-story with large windows and a metal roof')"
                className="w-full p-3 text-sm border rounded-lg resize-none"
                rows={3}
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value as any)}
                  className="p-2 text-sm border rounded-lg"
                >
                  <option value="modern">Modern</option>
                  <option value="traditional">Traditional</option>
                  <option value="contemporary">Contemporary</option>
                  <option value="minimalist">Minimalist</option>
                </select>

                <select
                  value={aiBudget}
                  onChange={(e) => setAiBudget(e.target.value as any)}
                  className="p-2 text-sm border rounded-lg"
                >
                  <option value="low">Low Budget</option>
                  <option value="medium">Medium Budget</option>
                  <option value="high">High Budget</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <Button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || isGenerating}
                className="w-full"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>

              {error && (
                <div className="p-2 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
              )}

              {currentModel && (
                <div className="space-y-2">
                  <Button
                    onClick={() => handleEnhanceRender('Front View')}
                    disabled={isEnhancing}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Enhance Render
                  </Button>

                  <Button
                    onClick={handleGenerateVariations}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Generate Variations
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render Gallery */}
      {renders.length > 0 && (
        <div className="bg-white border-t p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">AI Generated Renders ({renders.length})</h4>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {renders.map((render) => (
              <div key={render.id} className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Camera className="h-8 w-8" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm">{render.viewpoint}</p>
                  <p className="text-xs text-gray-500">{render.lighting}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {render.metadata.resolution.width}×{render.metadata.resolution.height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Material Summary */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Current Selections</h4>
            <div className="flex items-center gap-4 mt-2">
              {Object.entries(selectedMaterials).map(([category, material]) => (
                <div key={category} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: material.color }} />
                  <span className="text-sm capitalize">{category}:</span>
                  <span className="text-sm font-medium">{material.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Estimated Cost</p>
            <p className="text-xl font-semibold">${getTotalCost().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced 3D Model Viewer
function EnhancedModelViewer({
  model,
  materials,
  viewMode,
}: {
  model: Model3D
  materials: Record<string, MaterialSelection>
  viewMode: 'exterior' | 'interior'
}) {
  if (viewMode === 'interior') {
    return <InteriorView materials={materials} />
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Main House Structure */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 3, 8]} />
        <meshStandardMaterial
          color={materials.walls?.color || '#f5f5f5'}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Second Floor */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 2.5, 8]} />
        <meshStandardMaterial
          color={materials.walls?.color || '#f5f5f5'}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <coneGeometry args={[6, 2, 4]} />
        <meshStandardMaterial
          color={materials.roof?.color || '#708090'}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Garage */}
      <mesh position={[-6, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 6]} />
        <meshStandardMaterial
          color={materials.walls?.color || '#f5f5f5'}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Ground Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[14, 0.1, 8]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.9} />
      </mesh>

      {/* Front Windows */}
      <mesh position={[5.1, 2.5, 0]} castShadow>
        <boxGeometry args={[0.1, 2, 3]} />
        <meshStandardMaterial
          color={materials.windows?.color || '#87CEEB'}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Side Windows */}
      <mesh position={[0, 2.5, 4.1]} castShadow>
        <boxGeometry args={[2, 2, 0.1]} />
        <meshStandardMaterial
          color={materials.windows?.color || '#87CEEB'}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Main Door */}
      <mesh position={[2, 0.5, 4.1]} castShadow>
        <boxGeometry args={[1.5, 2.5, 0.1]} />
        <meshStandardMaterial
          color={materials.doors?.color || '#8B4513'}
          roughness={0.6}
          metalness={0.0}
        />
      </mesh>

      {/* Garage Door */}
      <mesh position={[-6, 0.5, 3.1]} castShadow>
        <boxGeometry args={[3.5, 2.5, 0.1]} />
        <meshStandardMaterial
          color={materials.doors?.color || '#ffffff'}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Trim/Fascia */}
      <mesh position={[0, 5.5, 0]} castShadow>
        <boxGeometry args={[10.2, 0.2, 8.2]} />
        <meshStandardMaterial
          color={materials.trim?.color || '#ffffff'}
          roughness={0.6}
          metalness={0.0}
        />
      </mesh>
    </group>
  )
}

// Interior View Component
function InteriorView({ materials }: { materials: Record<string, MaterialSelection> }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Interior Walls */}
      <mesh position={[0, 1.5, 0]} receiveShadow>
        <boxGeometry args={[9.8, 3, 7.8]} />
        <meshStandardMaterial
          color={materials.walls?.color || '#ffffff'}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[9.8, 0.1, 7.8]} />
        <meshStandardMaterial
          color={materials.walls?.color || '#8b4513'}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 3, 0]} receiveShadow>
        <boxGeometry args={[9.8, 0.1, 7.8]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Interior Furniture Placeholders */}
      <mesh position={[-2, 0.4, -1]} receiveShadow>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} metalness={0.0} />
      </mesh>

      <mesh position={[2, 0.4, 1]} receiveShadow>
        <boxGeometry args={[1.5, 0.8, 0.8]} />
        <meshStandardMaterial color="#654321" roughness={0.8} metalness={0.0} />
      </mesh>
    </group>
  )
}

// Default House when no model is loaded
function DefaultHouse() {
  return (
    <group position={[0, 1, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[6, 2.5, 4]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[3.5, 1.5, 4]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
    </group>
  )
}
