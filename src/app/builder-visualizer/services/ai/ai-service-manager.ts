import type {
  AIServiceProvider,
  AIServiceManager as IAIServiceManager,
  AIServiceConfig,
  AIConfig,
} from '../../types/ai'
import { OllamaService } from './ollama-service'
import { aiConfig } from '../../config/ai'

/**
 * AI Service Manager
 * Manages multiple AI service providers and handles switching between them
 */
export class AIServiceManager implements IAIServiceManager {
  private services: Map<string, AIServiceProvider> = new Map()
  private currentProvider: string
  private config: AIConfig

  constructor(config?: AIConfig) {
    this.config = config || aiConfig
    this.currentProvider = this.config.defaultProvider
    this.initializeServices()
  }

  /**
   * Initialize AI services based on configuration
   */
  private initializeServices(): void {
    // Initialize Ollama service if configured
    if (this.config.providers.ollama) {
      try {
        this.services.set('ollama', new OllamaService(this.config.providers.ollama))
      } catch (error) {
        console.warn('Failed to initialize Ollama service:', error)
      }
    }
  }

  /**
   * Get the current active service
   */
  getService(provider?: string): AIServiceProvider {
    const targetProvider = provider || this.currentProvider

    if (!this.services.has(targetProvider)) {
      throw new Error(`AI service provider '${targetProvider}' is not available`)
    }

    return this.services.get(targetProvider)!
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): string[] {
    return Array.from(this.services.keys())
  }

  /**
   * Switch to a different provider
   */
  switchProvider(provider: string): void {
    if (!this.services.has(provider)) {
      throw new Error(`AI service provider '${provider}' is not available`)
    }

    this.currentProvider = provider
  }

  /**
   * Test connection to a specific provider
   */
  async testConnection(provider: string): Promise<boolean> {
    try {
      const service = this.getService(provider)
      return await service.isAvailable()
    } catch (error) {
      console.error(`Failed to test connection to ${provider}:`, error)
      return false
    }
  }

  /**
   * Test all available providers
   */
  async testAllConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    for (const provider of this.getAvailableProviders()) {
      results[provider] = await this.testConnection(provider)
    }

    return results
  }

  /**
   * Get the best available provider based on configuration
   */
  async getBestAvailableProvider(): Promise<string | null> {
    const connectionTests = await this.testAllConnections()

    // Check fallback order
    for (const provider of this.config.fallback.order) {
      if (connectionTests[provider]) {
        return provider
      }
    }

    // Return first available provider
    for (const [provider, available] of Object.entries(connectionTests)) {
      if (available) {
        return provider
      }
    }

    return null
  }

  /**
   * Auto-switch to the best available provider
   */
  async autoSwitchToBestProvider(): Promise<boolean> {
    const bestProvider = await this.getBestAvailableProvider()

    if (bestProvider && bestProvider !== this.currentProvider) {
      this.switchProvider(bestProvider)
      return true
    }

    return false
  }

  /**
   * Get service information
   */
  getServiceInfo(provider?: string): {
    provider: string
    model: string
    capabilities: string[]
    available: boolean
  } | null {
    try {
      const service = this.getService(provider)
      return {
        provider: service.provider,
        model: service.model,
        capabilities: service.getCapabilities(),
        available: true,
      }
    } catch {
      return null
    }
  }

  /**
   * Get information about all services
   */
  async getAllServiceInfo(): Promise<
    Array<{
      provider: string
      model: string
      capabilities: string[]
      available: boolean
    }>
  > {
    const info = []
    const connectionTests = await this.testAllConnections()

    for (const provider of this.getAvailableProviders()) {
      const serviceInfo = this.getServiceInfo(provider)
      if (serviceInfo) {
        info.push({
          ...serviceInfo,
          available: connectionTests[provider] || false,
        })
      }
    }

    return info
  }

  /**
   * Update service configuration
   */
  updateServiceConfig(provider: string, config: Partial<AIServiceConfig>): void {
    if (!this.config.providers[provider as keyof typeof this.config.providers]) {
      throw new Error(`Provider '${provider}' is not configured`)
    }

    // Update configuration
    const providerConfig = this.config.providers[provider as keyof typeof this.config.providers]
    if (providerConfig) {
      Object.assign(providerConfig, config)
    }

    // Reinitialize the service with new config
    if (provider === 'ollama' && this.config.providers.ollama) {
      try {
        this.services.set('ollama', new OllamaService(this.config.providers.ollama))
      } catch (error) {
        console.error('Failed to reinitialize Ollama service:', error)
      }
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): AIConfig {
    return { ...this.config }
  }

  /**
   * Set current provider
   */
  getCurrentProvider(): string {
    return this.currentProvider
  }
}

// Export singleton instance
export const aiServiceManager = new AIServiceManager()

// Export factory function for custom configurations
export function createAIServiceManager(config: AIConfig): AIServiceManager {
  return new AIServiceManager(config)
}
