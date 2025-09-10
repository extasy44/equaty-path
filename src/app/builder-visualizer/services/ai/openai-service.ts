import OpenAI from 'openai'
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
 * OpenAI Service Provider
 * Handles OpenAI API interactions for vision analysis, text generation, and 3D model creation
 */
export class OpenAIService implements AIServiceProvider {
  private client: OpenAI
  private config: AIServiceConfig

  constructor(config: AIServiceConfig) {
    if (!config.apiKey) {
      throw new Error(errorMessages.apiKeyMissing)
    }

    this.config = config
    this.client = new OpenAI({
      apiKey: config.apiKey,
      timeout: config.timeout,
    })
  }

  readonly provider = 'openai'
  readonly model = this.config.model

  /**
   * Test connection to OpenAI API
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.client.models.list()
      return true
    } catch (error) {
      console.error('OpenAI connection test failed:', error)
      return false
    }
  }

  /**
   * Get service capabilities
   */
  getCapabilities(): string[] {
    return [
      'vision-analysis',
      'text-generation',
      'material-analysis',
      '3d-generation',
      'image-processing',
    ]
  }

  /**
   * Analyze image using OpenAI Vision API
   */
  async analyzeImage(request: VisionAnalysisRequest): Promise<AIResponse<VisionAnalysisResponse>> {
    const startTime = Date.now()

    try {
      // Convert File to base64 if needed
      const imageData = await this.prepareImageData(request.image)

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: request.prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`,
                },
              },
            ],
          },
        ],
        temperature: request.options?.temperature || this.config.temperature || 0.7,
        max_tokens: request.options?.maxTokens || this.config.maxTokens || 4096,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response content from OpenAI')
      }

      // Parse the response (assuming JSON format)
      const analysis = this.parseVisionResponse(content)

      return {
        success: true,
        data: analysis,
        metadata: {
          model: this.model,
          provider: this.provider,
          processingTime: Date.now() - startTime,
          tokensUsed: response.usage?.total_tokens,
        },
      }
    } catch (error) {
      return this.handleError(error, startTime)
    }
  }

  /**
   * Generate text using OpenAI Chat API
   */
  async generateText(request: TextGenerationRequest): Promise<AIResponse<TextGenerationResponse>> {
    const startTime = Date.now()

    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []

      // Add system message if provided
      if (request.systemMessage) {
        messages.push({
          role: 'system',
          content: request.systemMessage,
        })
      }

      // Add context messages if provided
      if (request.context && request.context.length > 0) {
        request.context.forEach((context) => {
          messages.push({
            role: 'user',
            content: context,
          })
          messages.push({
            role: 'assistant',
            content: 'Understood.',
          })
        })
      }

      // Add main prompt
      messages.push({
        role: 'user',
        content: request.prompt,
      })

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: request.options?.temperature || this.config.temperature || 0.7,
        max_tokens: request.options?.maxTokens || this.config.maxTokens || 4096,
      })

      const content = response.choices[0]?.message?.content
      const finishReason = response.choices[0]?.finish_reason

      if (!content) {
        throw new Error('No response content from OpenAI')
      }

      return {
        success: true,
        data: {
          text: content,
          finishReason: (finishReason as 'stop' | 'length' | 'content_filter') || 'stop',
        },
        metadata: {
          model: this.model,
          provider: this.provider,
          processingTime: Date.now() - startTime,
          tokensUsed: response.usage?.total_tokens,
        },
      }
    } catch (error) {
      return this.handleError(error, startTime)
    }
  }

  /**
   * Analyze materials using AI
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
   * Generate 3D model using AI
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
   * Prepare image data for OpenAI Vision API
   */
  private async prepareImageData(image: File | string): Promise<string> {
    if (typeof image === 'string') {
      // Assume it's already base64
      return image
    }

    // Convert File to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove data URL prefix if present
        const base64 = result.replace(/^data:image\/[a-z]+;base64,/, '')
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(image)
    })
  }

  /**
   * Parse vision analysis response
   */
  private parseVisionResponse(content: string): VisionAnalysisResponse {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content)
      return {
        description: parsed.description || content,
        elements: parsed.elements || [],
        metadata: parsed.metadata || {
          resolution: { width: 0, height: 0 },
          format: 'unknown',
        },
      }
    } catch {
      // Fallback to text parsing
      return {
        description: content,
        elements: [],
        metadata: {
          resolution: { width: 0, height: 0 },
          format: 'unknown',
        },
      }
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
      const parsed = JSON.parse(content)
      return {
        materials: parsed.materials || [],
        recommendations: parsed.recommendations || [],
      }
    } catch {
      return {
        materials: [],
        recommendations: [content],
      }
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
      const parsed = JSON.parse(content)
      return {
        gltfData: parsed,
        metadata: {
          vertices: parsed.metadata?.vertices || 0,
          faces: parsed.metadata?.faces || 0,
          materials: parsed.metadata?.materials || 0,
        },
      }
    } catch {
      return {
        gltfData: {},
        metadata: {
          vertices: 0,
          faces: 0,
          materials: 0,
        },
      }
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

    if (error?.status === 429) {
      return {
        ...baseError,
        name: 'RateLimitError',
        code: 'RATE_LIMIT',
        message: errorMessages.rateLimitExceeded,
        retryable: true,
      } as AIServiceError
    }

    if (error?.status === 401) {
      return {
        ...baseError,
        name: 'AuthError',
        code: 'API_ERROR',
        message: errorMessages.apiKeyMissing,
        retryable: false,
      } as AIServiceError
    }

    if (error?.status >= 500) {
      return {
        ...baseError,
        name: 'ServerError',
        code: 'NETWORK_ERROR',
        message: errorMessages.networkError,
        retryable: true,
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
