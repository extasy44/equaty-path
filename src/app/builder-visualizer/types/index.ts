// Core architectural element types
export interface ArchitecturalElement {
  id: string
  type: 'wall' | 'room' | 'window' | 'door' | 'floor' | 'roof'
  dimensions: {
    width: number
    height: number
    depth?: number
  }
  position: {
    x: number
    y: number
    z: number
  }
  metadata?: Record<string, any>
}

// 2D Plan analysis types
export interface FloorPlanAnalysis {
  elements: ArchitecturalElement[]
  dimensions: {
    totalWidth: number
    totalHeight: number
    scale: number
  }
  rooms: Room[]
  structuralElements: StructuralElement[]
}

export interface Room {
  id: string
  name: string
  area: number
  walls: Wall[]
  floorLevel: number
}

export interface Wall {
  id: string
  startPoint: { x: number; y: number }
  endPoint: { x: number; y: number }
  thickness: number
  height: number
  material?: string
}

export interface StructuralElement {
  id: string
  type: 'window' | 'door' | 'staircase' | 'column'
  position: { x: number; y: number; z: number }
  dimensions: { width: number; height: number; depth?: number }
}

// 3D Model types
export interface Model3D {
  id: string
  format: 'gltf' | 'obj' | 'fbx'
  data: any // Could be GLTF JSON, binary data, etc.
  sections: ModelSection[]
  metadata: {
    created: Date
    sourcePlan?: string
    lastModified?: Date
    dimensions: { width: number; height: number; depth: number }
  }
}

export interface ModelSection {
  id: string
  name: string
  geometry: any // 3D geometry data
  material?: Material
  parentId?: string
}

// Material system types
export interface Material {
  name: string
  textureUrl?: string
  color: string
  reflection: number
  roughness: number
  metalness?: number
  normalMapUrl?: string
  aoMapUrl?: string
  displacementMapUrl?: string
  properties: Record<string, any>
  appliedAt?: Date
}

export interface MaterialSelection {
  sectionId: string
  materialName: string
  appliedAt: Date
}

export interface MaterialLibrary {
  [key: string]: Material
}

// Rendering types
export interface RenderRequest {
  modelId: string
  viewpoint: Viewpoint
  lighting: LightingPreset
  resolution: { width: number; height: number }
  quality: 'draft' | 'standard' | 'high' | 'ultra'
}

export interface Viewpoint {
  name: string
  position: { x: number; y: number; z: number }
  target: { x: number; y: number; z: number }
  fov: number
}

export interface LightingPreset {
  name: string
  type: 'daylight' | 'sunset' | 'overcast' | 'interior' | 'dramatic'
  intensity: number
  color: string
  direction?: { x: number; y: number; z: number }
  shadows: boolean
}

export interface RenderResult {
  id: string
  url: string
  format: 'jpg' | 'png' | 'webp'
  viewpoint: string
  lighting: string
  createdAt: Date
  metadata: {
    resolution: { width: number; height: number }
    fileSize: number
    processingTime: number
  }
}

// Service response types
export interface PlanTo3DResponse {
  success: boolean
  model: Model3D
  analysis: FloorPlanAnalysis
  message: string
  processingTime: number
}

export interface MaterialApplicationResponse {
  success: boolean
  updatedModel: Model3D
  appliedMaterials: MaterialSelection[]
  message: string
}

export interface RenderResponse {
  success: boolean
  render: RenderResult
  message: string
  processingTime: number
}

// Error types
export interface ServiceError {
  code: string
  message: string
  details?: any
}

// Configuration types
export interface ServiceConfig {
  apiEndpoint: string
  apiKey?: string
  timeout: number
  retryAttempts: number
  modelSettings: {
    maxFileSize: number
    supportedFormats: string[]
    defaultQuality: string
  }
}

// Workflow types
export interface BuilderWorkflow {
  id: string
  steps: WorkflowStep[]
  currentStep: number
  status: 'idle' | 'processing' | 'completed' | 'error'
  results: WorkflowResult[]
}

export interface WorkflowStep {
  id: string
  name: string
  service: 'plan-to-3d' | 'material-applier' | 'realistic-renderer'
  config: any
  dependencies: string[]
}

export interface WorkflowResult {
  stepId: string
  success: boolean
  data: any
  timestamp: Date
  error?: ServiceError
}
