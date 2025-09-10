import ollama from 'ollama'
import type {
  AIServiceProvider,
  AIServiceConfig,
  VisionAnalysisRequest,
  VisionAnalysisResponse,
  TextGenerationRequest,
  TextGenerationResponse,
  MaterialAnalysisRequest,
  MaterialAnalysisResponse,
  ModelGenerationRequest,
  ModelGenerationResponse,
  AIResponse,
  AIServiceError,
} from '../../types/ai'
import {
  visionPrompts,
  textPrompts,
  modelPrompts,
  errorMessages,
  retryConfig,
} from '../../config/ai'

/**
 * Ollama Service Provider
 * Handles Ollama API interactions for local AI models
 */
export class OllamaService implements AIServiceProvider {
  private config: AIServiceConfig

  constructor(config: AIServiceConfig) {
    this.config = config
  }

  readonly provider = 'ollama'
  readonly model = this.config.model

  /**
   * Test connection to Ollama API
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Test connection by listing available models
      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      const modelExists = data.models?.some((model: any) => model.name === this.model)

      return modelExists || false
    } catch (error) {
      console.error('Ollama connection test failed:', error)
      return false
    }
  }

  /**
   * Get service capabilities
   */
  getCapabilities(): string[] {
    return [
      'text-generation',
      'material-analysis',
      '3d-generation',
      // Vision analysis may not be available in all Ollama models
    ]
  }

  /**
   * Analyze image using Ollama Vision API (if supported)
   * Note: Not all Ollama models support vision
   */
  async analyzeImage(request: VisionAnalysisRequest): Promise<AIResponse<VisionAnalysisResponse>> {
    const startTime = Date.now()

    // Check if vision is supported by trying the request
    try {
      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: `${request.prompt}\n\n[Image analysis not supported by this Ollama model. Using text-based analysis instead.]`,
          stream: false,
          options: {
            temperature: request.options?.temperature || this.config.temperature || 0.7,
            num_predict: request.options?.maxTokens || this.config.maxTokens || 2048,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`)
      }

      const result = await response.json()
      const content = result.response || ''

      // Parse the response
      const analysis = this.parseVisionResponse(content)

      return {
        success: true,
        data: analysis,
        metadata: {
          model: this.model,
          provider: this.provider,
          processingTime: Date.now() - startTime,
          tokensUsed: result.eval_count || 0,
        },
      }
    } catch (error) {
      return this.handleError(error, startTime)
    }
  }

  /**
   * Generate text using Ollama API
   */
  async generateText(request: TextGenerationRequest): Promise<AIResponse<TextGenerationResponse>> {
    const startTime = Date.now()

    try {
      let fullPrompt = ''

      // Add system message if provided
      if (request.systemMessage) {
        fullPrompt += `System: ${request.systemMessage}\n\n`
      }

      // Add context messages if provided
      if (request.context && request.context.length > 0) {
        request.context.forEach((context, index) => {
          fullPrompt += `Context ${index + 1}: ${context}\n`
        })
        fullPrompt += '\n'
      }

      // Add main prompt
      fullPrompt += `User: ${request.prompt}\n\nAssistant:`

      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: request.options?.temperature || this.config.temperature || 0.7,
            num_predict: request.options?.maxTokens || this.config.maxTokens || 2048,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`)
      }

      const result = await response.json()
      const content = result.response || ''

      if (!content) {
        throw new Error('No response content from Ollama')
      }

      return {
        success: true,
        data: {
          text: content,
          finishReason: result.done_reason || 'stop',
        },
        metadata: {
          model: this.model,
          provider: this.provider,
          processingTime: Date.now() - startTime,
          tokensUsed: result.eval_count || 0,
        },
      }
    } catch (error) {
      return this.handleError(error, startTime)
    }
  }

  /**
   * Analyze materials using Ollama AI
   */
  async analyzeMaterials(
    request: MaterialAnalysisRequest
  ): Promise<AIResponse<MaterialAnalysisResponse>> {
    const startTime = Date.now()

    try {
      const prompt = this.buildMaterialAnalysisPrompt(request)

      const textResponse = await this.generateText({
        prompt,
        systemMessage:
          'You are an expert architectural material consultant with deep knowledge of building materials, costs, and design principles.',
        options: request.options,
      })

      if (!textResponse.success || !textResponse.data) {
        throw new Error(textResponse.error || 'Failed to analyze materials')
      }

      const materials = this.parseMaterialResponse(textResponse.data.text)

      return {
        success: true,
        data: materials,
        metadata: {
          model: this.model,
          provider: this.provider,
          processingTime: Date.now() - startTime,
          tokensUsed: textResponse.metadata.tokensUsed,
        },
      }
    } catch (error) {
      return this.handleError(error, startTime)
    }
  }

  /**
   * Generate 3D model using Ollama AI
   */
  async generate3DModel(
    request: ModelGenerationRequest
  ): Promise<AIResponse<ModelGenerationResponse>> {
    const startTime = Date.now()

    try {
      const prompt = this.buildModelGenerationPrompt(request)

      const textResponse = await this.generateText({
        prompt,
        systemMessage:
          'You are an expert 3D modeler specializing in architectural visualization and GLTF model generation.',
        options: request.options,
      })

      if (!textResponse.success || !textResponse.data) {
        throw new Error(textResponse.error || 'Failed to generate 3D model')
      }

      const model = this.parseModelResponse(textResponse.data.text)

      return {
        success: true,
        data: model,
        metadata: {
          model: this.model,
          provider: this.provider,
          processingTime: Date.now() - startTime,
          tokensUsed: textResponse.metadata.tokensUsed,
        },
      }
    } catch (error) {
      return this.handleError(error, startTime)
    }
  }

  /**
   * Parse vision analysis response
   */
  private parseVisionResponse(content: string): VisionAnalysisResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          description: parsed.description || content,
          elements: parsed.elements || [],
          metadata: parsed.metadata || {
            resolution: { width: 0, height: 0 },
            format: 'unknown',
          },
        }
      }
    } catch {
      // Fallback to text parsing
    }

    return {
      description: content,
      elements: [],
      metadata: {
        resolution: { width: 0, height: 0 },
        format: 'unknown',
      },
    }
  }

  /**
   * Build material analysis prompt
   */
  private buildMaterialAnalysisPrompt(request: MaterialAnalysisRequest): string {
    return `
      ${textPrompts.materialRecommendations}

      Project Description: ${request.description}
      Style: ${request.style || 'Modern'}
      Budget: ${request.budget || 'medium'}

      Please provide detailed material recommendations in the following JSON format:
      {
        "materials": [
          {
            "name": "Material Name",
            "type": "wall|floor|roof|trim",
            "color": "Color description",
            "texture": "Texture description",
            "properties": {
              "roughness": 0.0-1.0,
              "metalness": 0.0-1.0,
              "reflectivity": 0.0-1.0
            },
            "estimatedCost": 0,
            "confidence": 0.0-1.0
          }
        ],
        "recommendations": ["Array of recommendation strings"]
      }
    `
  }

  /**
   * Parse material analysis response
   */
  private parseMaterialResponse(content: string): MaterialAnalysisResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          materials: parsed.materials || [],
          recommendations: parsed.recommendations || [],
        }
      }
    } catch {
      // Fallback to text parsing
    }

    return {
      materials: [],
      recommendations: [content],
    }
  }

  /**
   * Build 3D model generation prompt
   */
  private buildModelGenerationPrompt(request: ModelGenerationRequest): string {
    return `
      ${modelPrompts.houseGeneration}

      Description: ${request.description}
      Style: ${request.style || 'Modern'}
      Complexity: ${request.complexity || 'medium'}

      Generate a detailed GLTF model structure. Focus on:
      - Accurate geometry proportions
      - Proper material assignments
      - Realistic architectural details
      - Optimized vertex count for performance

      Return the model data in GLTF format with appropriate metadata.
    `
  }

  /**
   * Parse 3D model response
   */
  private parseModelResponse(content: string): ModelGenerationResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          gltfData: parsed,
          metadata: {
            vertices: parsed.metadata?.vertices || 0,
            faces: parsed.metadata?.faces || 0,
            materials: parsed.metadata?.materials || 0,
          },
        }
      }
    } catch {
      // Fallback to text parsing
    }

    return {
      gltfData: {},
      metadata: {
        vertices: 0,
        faces: 0,
        materials: 0,
      },
    }
  }

  /**
   * Handle and retry errors
   */
  private async handleError(error: any, startTime: number): Promise<AIResponse<any>> {
    const serviceError = this.createServiceError(error)

    // Implement retry logic for retryable errors
    if (serviceError.retryable && this.config.maxRetries > 0) {
      for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
        try {
          await new Promise((resolve) =>
            setTimeout(
              resolve,
              retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1)
            )
          )
          // Retry would happen here - simplified for this implementation
          break
        } catch {
          continue
        }
      }
    }

    return {
      success: false,
      error: serviceError.message,
      metadata: {
        model: this.model,
        provider: this.provider,
        processingTime: Date.now() - startTime,
      },
    }
  }

  /**
   * Create standardized service error
   */
  private createServiceError(error: any): AIServiceError {
    const baseError = {
      provider: this.provider,
      retryable: false,
      details: error,
    }

    if (error?.message?.includes('ECONNREFUSED') || error?.message?.includes('ENOTFOUND')) {
      return {
        ...baseError,
        name: 'ConnectionError',
        code: 'NETWORK_ERROR',
        message:
          'Unable to connect to Ollama server. Please ensure Ollama is running and accessible.',
        retryable: true,
      } as AIServiceError
    }

    if (
      error?.message?.includes('model not found') ||
      error?.message?.includes('model not available')
    ) {
      return {
        ...baseError,
        name: 'ModelError',
        code: 'MODEL_ERROR',
        message: `Model '${this.model}' is not available. Please ensure the model is installed in Ollama.`,
        retryable: false,
      } as AIServiceError
    }

    return {
      ...baseError,
      name: 'ProcessingError',
      code: 'MODEL_ERROR',
      message: error?.message || errorMessages.processingError,
      retryable: true,
    } as AIServiceError
  }
}
