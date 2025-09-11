import type { Material } from '../types'

/**
 * Texture Manager Utility
 * Handles loading and managing textures for 3D materials
 */
export class TextureManager {
  private textureCache = new Map<string, HTMLImageElement>()
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>()

  /**
   * Load a texture image from URL
   */
  async loadTexture(url: string): Promise<HTMLImageElement> {
    // Check if already cached
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url)!
    }

    // Check if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!
    }

    // Create loading promise
    const loadingPromise = this.loadImage(url)
    this.loadingPromises.set(url, loadingPromise)

    try {
      const image = await loadingPromise
      this.textureCache.set(url, image)
      this.loadingPromises.delete(url)
      return image
    } catch (error) {
      this.loadingPromises.delete(url)
      throw error
    }
  }

  /**
   * Load multiple textures in parallel
   */
  async loadTextures(urls: string[]): Promise<Map<string, HTMLImageElement>> {
    const textureMap = new Map<string, HTMLImageElement>()

    try {
      const promises = urls.map(async (url) => {
        const image = await this.loadTexture(url)
        textureMap.set(url, image)
        return { url, image }
      })

      await Promise.all(promises)
      return textureMap
    } catch (error) {
      console.error('Error loading textures:', error)
      throw error
    }
  }

  /**
   * Load all textures for a material
   */
  async loadMaterialTextures(material: Material): Promise<Map<string, HTMLImageElement>> {
    const textureUrls: string[] = []

    // Collect all texture URLs from material
    if (material.textureUrl) textureUrls.push(material.textureUrl)
    if (material.normalMapUrl) textureUrls.push(material.normalMapUrl)
    if (material.aoMapUrl) textureUrls.push(material.aoMapUrl)
    if (material.displacementMapUrl) textureUrls.push(material.displacementMapUrl)

    return this.loadTextures(textureUrls)
  }

  /**
   * Create a fallback texture for missing images
   */
  createFallbackTexture(color: string = '#808080', size: number = 256): HTMLImageElement {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // Fill with solid color
    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)

    // Add a subtle pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < size; i += 32) {
      for (let j = 0; j < size; j += 32) {
        if ((i + j) % 64 === 0) {
          ctx.fillRect(i, j, 16, 16)
        }
      }
    }

    // Convert to image
    const image = new Image()
    image.src = canvas.toDataURL()
    return image
  }

  /**
   * Get texture with fallback
   */
  async getTextureWithFallback(url: string, fallbackColor?: string): Promise<HTMLImageElement> {
    try {
      return await this.loadTexture(url)
    } catch {
      console.warn(`Failed to load texture: ${url}, using fallback`)
      return this.createFallbackTexture(fallbackColor)
    }
  }

  /**
   * Preload textures for better performance
   */
  async preloadTextures(materials: Material[]): Promise<void> {
    const allUrls = new Set<string>()

    // Collect all texture URLs
    materials.forEach((material) => {
      if (material.textureUrl) allUrls.add(material.textureUrl)
      if (material.normalMapUrl) allUrls.add(material.normalMapUrl)
      if (material.aoMapUrl) allUrls.add(material.aoMapUrl)
      if (material.displacementMapUrl) allUrls.add(material.displacementMapUrl)
    })

    // Load all textures
    try {
      await this.loadTextures(Array.from(allUrls))
      console.log(`Preloaded ${allUrls.size} textures`)
    } catch {
      console.warn('Some textures failed to preload')
    }
  }

  /**
   * Clear texture cache
   */
  clearCache(): void {
    this.textureCache.clear()
    this.loadingPromises.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { cached: number; loading: number } {
    return {
      cached: this.textureCache.size,
      loading: this.loadingPromises.size,
    }
  }

  /**
   * Private method to load image
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'

      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error(`Failed to load image: ${url}`))

      image.src = url
    })
  }
}

// Export singleton instance
export const textureManager = new TextureManager()
