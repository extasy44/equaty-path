'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { PlanTo3DGenerator } from './components/PlanTo3DGenerator'
import { MaterialApplier } from './components/MaterialApplier'
import { RealisticRenderer } from './components/RealisticRenderer'
import { AIModelSelector } from './components/AIModelSelector'
import type { Model3D, RenderResult } from './types'

export default function BuilderClient() {
  const [currentModel, setCurrentModel] = useState<Model3D | null>(null)
  const [renders, setRenders] = useState<RenderResult[]>([])
  const [activeTab, setActiveTab] = useState('generate')
  const [selectedProvider, setSelectedProvider] = useState<string>('openai')

  const handleModelGenerated = (model: Model3D) => {
    setCurrentModel(model)
    setActiveTab('materials') // Auto-switch to materials tab
  }

  const handleModelUpdated = (model: Model3D) => {
    setCurrentModel(model)
    setActiveTab('render') // Auto-switch to render tab
  }

  const handleRendersComplete = (newRenders: RenderResult[]) => {
    setRenders(newRenders)
  }

  const handleModelChange = (provider: string, model: string) => {
    setSelectedProvider(provider)
    console.log(`Switched to AI provider: ${provider} (${model})`)
  }

  const handlePremiumReport = () => {
    alert(
      '📊 Premium reports with export functionality are available in the Reports section. Upgrade to access full export capabilities.'
    )
  }

  const getWorkflowProgress = () => {
    let progress = 0
    if (currentModel) progress += 33
    if (currentModel && currentModel.sections.some((s) => s.material)) progress += 34
    if (renders.length > 0) progress += 33
    return progress
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">AI-Powered Builder Visualizer</h2>
          <p className="text-muted-foreground">
            Transform 2D plans into photorealistic 3D renders using advanced AI services
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={getWorkflowProgress() === 100 ? 'default' : 'secondary'}>
            {getWorkflowProgress()}% Complete
          </Badge>
          <Button
            onClick={handlePremiumReport}
            disabled={getWorkflowProgress() < 100}
            variant="outline"
          >
            📊 Premium Report
          </Button>
        </div>
      </div>

      {/* AI Model Selection */}
      <AIModelSelector onModelChange={handleModelChange} />

      {/* 3D Preview */}
      <Card>
        <CardHeader>
          <CardTitle>3D Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Interactive preview of your generated model
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative h-[400px] w-full overflow-hidden rounded-md border">
            <Canvas camera={{ position: [8, 6, 8], fov: 45 }} shadows>
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
              <Environment preset="city" />

              {currentModel ? <ModelViewer model={currentModel} /> : <PlaceholderModel />}

              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#f0f0f0" />
              </mesh>

              <OrbitControls enableDamping enablePan enableZoom />
            </Canvas>
          </div>
        </CardContent>
      </Card>

      {/* AI Services Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            📐 Generate 3D
            {currentModel && (
              <Badge variant="secondary" className="ml-1">
                ✓
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            🎨 Apply Materials
            {currentModel?.sections.some((s) => s.material) && (
              <Badge variant="secondary" className="ml-1">
                ✓
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="render" className="flex items-center gap-2">
            📸 Create Renders
            {renders.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {renders.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <PlanTo3DGenerator
            onModelGenerated={handleModelGenerated}
            aiProvider={selectedProvider as 'openai' | 'ollama'}
          />
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <MaterialApplier model={currentModel} onModelUpdated={handleModelUpdated} />
        </TabsContent>

        <TabsContent value="render" className="mt-6">
          <RealisticRenderer model={currentModel} onRenderComplete={handleRendersComplete} />
        </TabsContent>
      </Tabs>

      {/* Render Gallery */}
      {renders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Renders ({renders.length})</CardTitle>
            <p className="text-sm text-muted-foreground">Your photorealistic render gallery</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renders.map((render) => (
                <div key={render.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img
                      src={render.url}
                      alt={`${render.viewpoint} render`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-render.jpg'
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm">{render.viewpoint}</p>
                    <p className="text-xs text-muted-foreground">{render.lighting}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {render.metadata.resolution.width}×{render.metadata.resolution.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// 3D Model Viewer Component
function ModelViewer({ model }: { model: Model3D }) {
  // This would render the actual 3D model based on the GLTF data
  // For now, we'll show a placeholder representation
  return (
    <group position={[0, 0, 0]}>
      {/* Walls */}
      {model.sections
        .filter((section) => section.id.includes('wall'))
        .map((section, index) => (
          <mesh key={section.id} position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[6, 3, 0.2]} />
            <meshStandardMaterial
              color={section.material?.color || '#e5e7eb'}
              roughness={section.material?.roughness || 0.8}
              metalness={section.material?.metalness || 0.0}
            />
          </mesh>
        ))}

      {/* Floor */}
      {model.sections
        .filter((section) => section.id.includes('floor'))
        .map((section) => (
          <mesh key={section.id} position={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[6, 0.1, 4]} />
            <meshStandardMaterial
              color={section.material?.color || '#d1d5db'}
              roughness={section.material?.roughness || 0.9}
            />
          </mesh>
        ))}

      {/* Roof */}
      {model.sections
        .filter((section) => section.id.includes('roof'))
        .map((section) => (
          <mesh key={section.id} position={[0, 3.5, 0]} castShadow>
            <coneGeometry args={[4, 2, 4]} />
            <meshStandardMaterial
              color={section.material?.color || '#4b5563'}
              roughness={section.material?.roughness || 0.7}
            />
          </mesh>
        ))}
    </group>
  )
}

// Placeholder 3D Model when no model is generated
function PlaceholderModel() {
  return (
    <group position={[0, 1, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 2, 3]} />
        <meshStandardMaterial color="#e5e7eb" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[2.5, 1.5, 4]} />
        <meshStandardMaterial color="#d1d5db" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}
