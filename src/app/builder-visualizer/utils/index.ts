// Utility functions for the builder visualizer

import type { Material, Model3D, Viewpoint, LightingPreset } from '../types'

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    return { r: 255, g: 255, b: 255 } // Default to white
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

/**
 * Convert RGB values to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

/**
 * Calculate the area of a rectangular room
 */
export function calculateRoomArea(width: number, length: number): number {
  return width * length
}

/**
 * Calculate the volume of a room
 */
export function calculateRoomVolume(width: number, length: number, height: number): number {
  return width * length * height
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Calculate distance between two 3D points
 */
export function calculateDistance3D(
  point1: { x: number; y: number; z: number },
  point2: { x: number; y: number; z: number }
): number {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  const dz = point2.z - point1.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Calculate the center point between two 3D points
 */
export function calculateCenter3D(
  point1: { x: number; y: number; z: number },
  point2: { x: number; y: number; z: number }
): { x: number; y: number; z: number } {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
    z: (point1.z + point2.z) / 2,
  }
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 9)
  return `${prefix}${timestamp}_${random}`
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate file type against allowed types
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Check if a model has all required materials applied
 */
export function isModelReadyForRendering(model: Model3D): boolean {
  if (!model.sections || model.sections.length === 0) {
    return false
  }

  return model.sections.every((section) => section.material !== undefined)
}

/**
 * Get materials applied to a model
 */
export function getAppliedMaterials(model: Model3D): Material[] {
  if (!model.sections) return []

  return model.sections
    .map((section) => section.material)
    .filter((material) => material !== undefined) as Material[]
}

/**
 * Calculate the bounding box of a model
 */
export function calculateModelBounds(model: Model3D): {
  min: { x: number; y: number; z: number }
  max: { x: number; y: number; z: number }
} {
  let min = { x: Infinity, y: Infinity, z: Infinity }
  let max = { x: -Infinity, y: -Infinity, z: -Infinity }

  if (model.sections) {
    model.sections.forEach((section) => {
      if (section.geometry) {
        // This would need to be implemented based on the actual geometry format
        // For now, return default bounds
      }
    })
  }

  // Default bounds if no geometry data
  if (min.x === Infinity) {
    min = { x: -5, y: 0, z: -5 }
    max = { x: 5, y: 5, z: 5 }
  }

  return { min, max }
}

/**
 * Create a default viewpoint for a model
 */
export function createDefaultViewpoint(model: Model3D): Viewpoint {
  const bounds = calculateModelBounds(model)
  const center = calculateCenter3D(bounds.min, bounds.max)
  const distance = calculateDistance3D(bounds.min, bounds.max) * 1.5

  return {
    name: 'Default View',
    position: {
      x: center.x,
      y: center.y + distance * 0.5,
      z: center.z + distance,
    },
    target: center,
    fov: 45,
  }
}

/**
 * Create a default lighting preset
 */
export function createDefaultLighting(): LightingPreset {
  return {
    name: 'Default Lighting',
    type: 'daylight',
    intensity: 1.0,
    color: '#FFFFFF',
    direction: { x: 1, y: 1, z: 1 },
    shadows: true,
  }
}

/**
 * Convert viewpoint to camera position for Three.js
 */
export function viewpointToCamera(viewpoint: Viewpoint) {
  return {
    position: [viewpoint.position.x, viewpoint.position.y, viewpoint.position.z],
    target: [viewpoint.target.x, viewpoint.target.y, viewpoint.target.z],
    fov: viewpoint.fov,
  }
}

/**
 * Format processing time in human readable format
 */
export function formatProcessingTime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`
  }

  const seconds = Math.round(milliseconds / 1000)
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry utility for async operations
 */
export async function retry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      if (i < maxRetries) {
        await sleep(delay * Math.pow(2, i)) // Exponential backoff
      }
    }
  }

  throw lastError!
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString)
  } catch {
    return fallback
  }
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T
  }

  const clonedObj = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }

  return clonedObj
}
