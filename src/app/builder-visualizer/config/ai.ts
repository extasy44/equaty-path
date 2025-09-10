import type { AIConfig } from '../types/ai'

// AI Service Configuration
export const aiConfig: AIConfig = {
  defaultProvider: 'ollama',
  providers: {
    ollama: {
      provider: 'ollama',
      baseUrl: process.env.NEXT_PUBLIC_OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'llama2',
      timeout: 60000,
      maxRetries: 2,
      temperature: 0.7,
      maxTokens: 2048,
    },
  },
  fallback: {
    enabled: true,
    order: ['ollama'],
  },
  caching: {
    enabled: true,
    ttl: 3600, // 1 hour
  },
}

// Vision Analysis Prompts
export const visionPrompts = {
  floorPlanAnalysis: `
    Analyze this architectural floor plan image and provide a detailed description of:
    1. Overall layout and dimensions
    2. Room identification and purposes
    3. Wall structures and openings
    4. Key architectural elements (windows, doors, stairs)
    5. Structural features and spatial relationships

    Provide the analysis in a structured JSON format with confidence scores for each element.
  `,
  materialAnalysis: `
    Analyze this image and suggest appropriate architectural materials based on:
    1. Style and aesthetic preferences
    2. Material properties (durability, maintenance, cost)
    3. Color schemes and textures
    4. Practical considerations for the space

    Return suggestions with specific material names, colors, and technical properties.
  `,
}

// Text Generation Prompts
export const textPrompts = {
  materialRecommendations: `
    Based on the architectural style and requirements, recommend materials for:
    - Exterior walls and cladding
    - Interior walls and finishes
    - Flooring options
    - Roofing materials
    - Trim and detailing

    Consider budget constraints and provide cost estimates where possible.
  `,
  modelOptimization: `
    Analyze the 3D model geometry and suggest optimizations for:
    - Polygon reduction while maintaining visual quality
    - Texture optimization
    - Material property adjustments
    - Performance improvements for real-time rendering
  `,
}

// Model Generation Prompts
export const modelPrompts = {
  houseGeneration: `
    Generate a detailed 3D house model based on the floor plan analysis.
    Create realistic geometry with proper wall heights, roof structures, and architectural details.
    Include appropriate material assignments and ensure the model is optimized for rendering.
  `,
  materialApplication: `
    Apply appropriate materials to the 3D model sections based on architectural standards and best practices.
    Consider the building type, location, and intended use when selecting materials.
  `,
}

// Error Messages
export const errorMessages = {
  networkError: 'Unable to connect to AI service. Please check your internet connection.',
  apiKeyMissing: 'API key is missing. Please configure your AI service credentials.',
  modelNotAvailable: 'The requested AI model is not available. Please try a different model.',
  rateLimitExceeded: 'API rate limit exceeded. Please wait and try again.',
  invalidRequest: 'Invalid request format. Please check your input and try again.',
  processingError: 'An error occurred while processing your request. Please try again.',
}

// Retry Configuration
export const retryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
}

// Cache Configuration
export const cacheConfig = {
  maxSize: 100, // Maximum number of cached responses
  ttl: 3600, // 1 hour default TTL
  compression: true,
}

// Feature Flags
export const featureFlags = {
  enableVisionAnalysis: true,
  enableMaterialSuggestions: true,
  enable3DGeneration: true,
  enableRealisticRendering: true,
  enableCaching: true,
  enableFallback: true,
  enableBatchProcessing: false,
}
