import type { ServiceConfig } from '../types'

export const planTo3DConfig: ServiceConfig = {
  apiEndpoint:
    process.env.NEXT_PUBLIC_PLAN_TO_3D_API_ENDPOINT || '/api/builder-visualizer/plan-to-3d',
  apiKey: process.env.NEXT_PUBLIC_PLAN_TO_3D_API_KEY,
  timeout: 300000, // 5 minutes
  retryAttempts: 3,
  modelSettings: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    defaultQuality: 'high',
  },
}

export const materialApplierConfig: ServiceConfig = {
  apiEndpoint:
    process.env.NEXT_PUBLIC_MATERIAL_APPLIER_API_ENDPOINT ||
    '/api/builder-visualizer/material-applier',
  apiKey: process.env.NEXT_PUBLIC_MATERIAL_APPLIER_API_KEY,
  timeout: 120000, // 2 minutes
  retryAttempts: 2,
  modelSettings: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    supportedFormats: ['model/gltf+json', 'model/obj', 'model/fbx'],
    defaultQuality: 'standard',
  },
}

export const realisticRendererConfig: ServiceConfig = {
  apiEndpoint:
    process.env.NEXT_PUBLIC_REALISTIC_RENDERER_API_ENDPOINT ||
    '/api/builder-visualizer/realistic-renderer',
  apiKey: process.env.NEXT_PUBLIC_REALISTIC_RENDERER_API_KEY,
  timeout: 180000, // 3 minutes
  retryAttempts: 2,
  modelSettings: {
    maxFileSize: 200 * 1024 * 1024, // 200MB
    supportedFormats: ['model/gltf+json'],
    defaultQuality: 'ultra',
  },
}

// Default lighting presets
export const lightingPresets = {
  daylight: {
    name: 'Daylight',
    type: 'daylight' as const,
    intensity: 1.0,
    color: '#FFFFFF',
    direction: { x: 1, y: 1, z: 1 },
    shadows: true,
  },
  sunset: {
    name: 'Sunset',
    type: 'sunset' as const,
    intensity: 0.8,
    color: '#FF6B35',
    direction: { x: -1, y: 0.5, z: 1 },
    shadows: true,
  },
  overcast: {
    name: 'Overcast',
    type: 'overcast' as const,
    intensity: 0.6,
    color: '#E5E7EB',
    direction: { x: 0, y: 1, z: 0 },
    shadows: false,
  },
  interior: {
    name: 'Interior',
    type: 'interior' as const,
    intensity: 0.7,
    color: '#FFF8E1',
    shadows: true,
  },
  dramatic: {
    name: 'Dramatic',
    type: 'dramatic' as const,
    intensity: 0.9,
    color: '#1F2937',
    direction: { x: -2, y: 1, z: -1 },
    shadows: true,
  },
}

// Default viewpoints
export const viewpoints = {
  front: {
    name: 'Front View',
    position: { x: 0, y: 5, z: 10 },
    target: { x: 0, y: 2.5, z: 0 },
    fov: 45,
  },
  back: {
    name: 'Back View',
    position: { x: 0, y: 5, z: -10 },
    target: { x: 0, y: 2.5, z: 0 },
    fov: 45,
  },
  side: {
    name: 'Side View',
    position: { x: 10, y: 5, z: 0 },
    target: { x: 0, y: 2.5, z: 0 },
    fov: 45,
  },
  corner: {
    name: 'Corner Perspective',
    position: { x: 8, y: 6, z: 8 },
    target: { x: 0, y: 2.5, z: 0 },
    fov: 50,
  },
  interior: {
    name: 'Interior View',
    position: { x: 0, y: 2, z: 3 },
    target: { x: 0, y: 2, z: -5 },
    fov: 60,
  },
  aerial: {
    name: 'Aerial View',
    position: { x: 0, y: 15, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    fov: 35,
  },
}

// Rendering quality presets
export const renderQuality = {
  draft: {
    resolution: { width: 800, height: 600 },
    samples: 16,
    maxBounces: 2,
  },
  standard: {
    resolution: { width: 1200, height: 900 },
    samples: 64,
    maxBounces: 4,
  },
  high: {
    resolution: { width: 1920, height: 1440 },
    samples: 128,
    maxBounces: 6,
  },
  ultra: {
    resolution: { width: 2560, height: 1920 },
    samples: 256,
    maxBounces: 8,
  },
}

// File upload constraints
export const uploadConstraints = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'],
  maxFiles: 1,
}

// Processing status messages
export const statusMessages = {
  uploading: 'Uploading your floor plan...',
  analyzing: 'Analyzing architectural elements...',
  generating: 'Generating 3D model...',
  applying: 'Applying materials...',
  rendering: 'Creating photorealistic render...',
  complete: 'Processing complete!',
  error: 'An error occurred during processing.',
}
