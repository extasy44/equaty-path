// 3D Geometry Types
export interface Geometry3D {
  type: 'box' | 'plane' | 'pyramid' | 'cylinder' | 'sphere' | 'custom'
  dimensions: {
    width: number
    height: number
    depth?: number
  }
  position: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  vertices?: number[]
  faces?: number[]
  normals?: number[]
}

// GLTF Data Types
export interface GLTFData {
  asset: {
    version: string
    generator: string
  }
  scenes: Array<{
    nodes: number[]
  }>
  nodes: Array<{
    mesh?: number
    translation?: number[]
  }>
  meshes: Array<{
    primitives: Array<{
      attributes: Record<string, number>
      indices: number
      material: number
    }>
  }>
  materials: Array<{
    pbrMetallicRoughness: {
      baseColorFactor: number[]
      metallicFactor: number
      roughnessFactor: number
    }
  }>
  accessors: Array<{
    bufferView: number
    componentType: number
    count: number
    type: string
    min?: number[]
    max?: number[]
  }>
  bufferViews: Array<{
    buffer: number
    byteOffset: number
    byteLength: number
  }>
  buffers: Array<{
    uri: string
    byteLength: number
  }>
}

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
  metadata?: Record<string, unknown>
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
  data: GLTFData | string | ArrayBuffer // GLTF JSON, binary data, or file path
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
  geometry: Geometry3D // 3D geometry data
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
  properties: Record<string, unknown>
  appliedAt?: Date
}

export interface MaterialSelection {
  id: string
  name: string
  color: string
  textureUrl?: string
  normalMapUrl?: string
  aoMapUrl?: string
  displacementMapUrl?: string
  roughness: number
  metalness: number
  reflection?: number
  cost?: number
  materialName?: string
  sectionId?: string
  texture?: {
    url: string
    scale: number
    repeat: [number, number]
    offset: [number, number]
    rotation: number
  }
  surfaceSize?: {
    width: number
    height: number
    area: number
    unit: 'm²' | 'ft²'
  }
  properties: {
    finish: string
    texture: string
    durability: string
    grain?: string
    maintenance?: string
    fire_rating?: string
    insulation?: string
    description?: string
  }
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

// Workflow Configuration Types
export interface WorkflowStepConfig {
  scale?: number
  quality?: 'draft' | 'standard' | 'high'
  includeMetadata?: boolean
  aiProvider?: 'ollama'
  materials?: string[]
  lighting?: string
  viewpoint?: string
}

// Workflow Data Types
export interface WorkflowStepData {
  model?: Model3D
  analysis?: FloorPlanAnalysis
  materials?: MaterialSelection[]
  render?: RenderResult
  error?: ServiceError
}

// Error types
export interface ServiceError {
  code: string
  message: string
  details?: Record<string, unknown>
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
  config: WorkflowStepConfig
  dependencies: string[]
}

export interface WorkflowResult {
  stepId: string
  success: boolean
  data: WorkflowStepData
  timestamp: Date
  error?: ServiceError
}
