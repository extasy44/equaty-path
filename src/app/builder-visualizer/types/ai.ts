// AI Service Types
export interface AIServiceConfig {
  provider: 'openai' | 'ollama'
  apiKey?: string
  baseUrl?: string
  model: string
  timeout: number
  maxRetries: number
  temperature?: number
  maxTokens?: number
}

export interface AIRequestOptions {
  temperature?: number
  maxTokens?: number
  timeout?: number
}

export interface AIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  metadata: {
    model: string
    provider: string
    processingTime: number
    tokensUsed?: number
  }
}

// Computer Vision Types
export interface VisionAnalysisRequest {
  image: File | string // File object or base64 string
  prompt: string
  options?: AIRequestOptions
}

export interface VisionAnalysisResponse {
  description: string
  elements: Array<{
    type: string
    confidence: number
    boundingBox?: {
      x: number
      y: number
      width: number
      height: number
    }
    properties?: Record<string, any>
  }>
  metadata: {
    resolution: { width: number; height: number }
    format: string
  }
}

// Text Generation Types
export interface TextGenerationRequest {
  prompt: string
  systemMessage?: string
  context?: string[]
  options?: AIRequestOptions
}

export interface TextGenerationResponse {
  text: string
  finishReason: 'stop' | 'length' | 'content_filter'
  suggestions?: string[]
}

// Material Analysis Types
export interface MaterialAnalysisRequest {
  description: string
  style?: string
  budget?: 'low' | 'medium' | 'high' | 'premium'
  options?: AIRequestOptions
}

export interface MaterialAnalysisResponse {
  materials: Array<{
    name: string
    type: 'wall' | 'floor' | 'roof' | 'trim'
    color: string
    texture: string
    properties: {
      roughness: number
      metalness: number
      reflectivity: number
    }
    estimatedCost?: number
    confidence: number
  }>
  recommendations: string[]
}

// 3D Generation Types
export interface ModelGenerationRequest {
  description: string
  style?: string
  complexity?: 'simple' | 'medium' | 'detailed'
  options?: AIRequestOptions
}

export interface ModelGenerationResponse {
  gltfData: any
  metadata: {
    vertices: number
    faces: number
    materials: number
  }
  suggestions?: string[]
}

// AI Service Provider Interface
export interface AIServiceProvider {
  readonly provider: string
  readonly model: string

  analyzeImage(request: VisionAnalysisRequest): Promise<AIResponse<VisionAnalysisResponse>>
  generateText(request: TextGenerationRequest): Promise<AIResponse<TextGenerationResponse>>
  analyzeMaterials(request: MaterialAnalysisRequest): Promise<AIResponse<MaterialAnalysisResponse>>
  generate3DModel(request: ModelGenerationRequest): Promise<AIResponse<ModelGenerationResponse>>

  isAvailable(): Promise<boolean>
  getCapabilities(): string[]
}

// Error Types
export interface AIServiceError extends Error {
  code: 'NETWORK_ERROR' | 'API_ERROR' | 'RATE_LIMIT' | 'INVALID_REQUEST' | 'MODEL_ERROR'
  provider: string
  retryable: boolean
  details?: any
}

// Configuration Types
export interface AIConfig {
  defaultProvider: 'openai' | 'ollama'
  providers: {
    openai?: AIServiceConfig
    ollama?: AIServiceConfig
  }
  fallback: {
    enabled: boolean
    order: ('openai' | 'ollama')[]
  }
  caching: {
    enabled: boolean
    ttl: number // Time to live in seconds
  }
}

// Service Manager Types
export interface AIServiceManager {
  getService(provider?: string): AIServiceProvider
  getAvailableProviders(): string[]
  switchProvider(provider: string): void
  testConnection(provider: string): Promise<boolean>
}
