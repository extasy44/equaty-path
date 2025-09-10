import materialsData from './materials.json'
import housePresetsData from './house-presets.json'
import viewSettingsData from './view-settings.json'

export interface MaterialSelection {
  id: string
  name: string
  category: 'roof' | 'walls' | 'trim' | 'doors' | 'windows'
  color: string
  texture: string
  cost?: number
  description?: string
}

export interface HousePreset {
  id: string
  name: string
  description: string
  style: 'modern' | 'traditional' | 'contemporary' | 'minimalist'
  budget: 'low' | 'medium' | 'high' | 'premium'
  materials: Record<string, string>
}

export interface ViewPreset {
  name: string
  position: [number, number, number]
  target: [number, number, number]
  description: string
}

export interface ViewSettings {
  viewPresets: {
    exterior: Record<string, ViewPreset>
    interior: Record<string, ViewPreset>
  }
  cameraSettings: {
    defaultFov: number
    minPolarAngle: number
    maxPolarAngle: number
    enableDamping: boolean
    dampingFactor: number
    enablePan: boolean
    enableZoom: boolean
  }
  lighting: {
    ambient: {
      intensity: number
      color: string
    }
    directional: {
      position: [number, number, number]
      intensity: number
      color: string
      castShadow: boolean
    }
    environment: string
  }
}

// Data loading functions
export function getMaterials(): Record<string, MaterialSelection[]> {
  return materialsData as Record<string, MaterialSelection[]>
}

export function getMaterialsByCategory(category: string): MaterialSelection[] {
  return (materialsData as Record<string, MaterialSelection[]>)[category] || []
}

export function getMaterialById(id: string): MaterialSelection | null {
  for (const category of Object.values(materialsData as Record<string, MaterialSelection[]>)) {
    const material = category.find((m) => m.id === id)
    if (material) return material
  }
  return null
}

export function getDefaultHouse() {
  return housePresetsData.defaultHouse
}

export function getHousePresets(): HousePreset[] {
  return housePresetsData.presets as HousePreset[]
}

export function getHousePresetById(id: string): HousePreset | null {
  return (housePresetsData.presets.find((preset) => preset.id === id) as HousePreset) || null
}

export function getViewSettings(): ViewSettings {
  return viewSettingsData as unknown as ViewSettings
}

export function getViewPresets(mode: 'exterior' | 'interior'): Record<string, ViewPreset> {
  return viewSettingsData.viewPresets[mode] as unknown as Record<string, ViewPreset>
}

export function getViewPreset(
  mode: 'exterior' | 'interior',
  presetId: string | number
): ViewPreset | null {
  return (
    (viewSettingsData.viewPresets[mode][
      presetId as keyof (typeof viewSettingsData.viewPresets)[typeof mode]
    ] as ViewPreset) || null
  )
}

// Utility functions
export function calculateTotalCost(materials: Record<string, MaterialSelection>): number {
  return Object.values(materials).reduce((total, material) => {
    return total + (material.cost || 0)
  }, 0)
}

export function getMaterialsByBudget(
  budget: 'low' | 'medium' | 'high' | 'premium'
): Record<string, MaterialSelection[]> {
  const budgetRanges = {
    low: { min: 0, max: 30 },
    medium: { min: 30, max: 60 },
    high: { min: 60, max: 100 },
    premium: { min: 100, max: Infinity },
  }

  const range = budgetRanges[budget]
  const filteredMaterials: Record<string, MaterialSelection[]> = {}

  for (const [category, materials] of Object.entries(
    materialsData as Record<string, MaterialSelection[]>
  )) {
    filteredMaterials[category] = materials.filter((material) => {
      const cost = material.cost || 0
      return cost >= range.min && cost <= range.max
    })
  }

  return filteredMaterials
}

export function getMaterialsByStyle(
  style: 'modern' | 'traditional' | 'contemporary' | 'minimalist'
): Record<string, MaterialSelection[]> {
  const stylePreferences = {
    modern: [
      'render-whisper',
      'concrete-alabaster',
      'trim-dover-white',
      'door-white',
      'window-white',
    ],
    traditional: [
      'brick-terracotta',
      'concrete-chestnut',
      'trim-wallaby',
      'door-wood',
      'window-wood',
    ],
    contemporary: [
      'cladding-cedar',
      'concrete-bronze-duo',
      'trim-surfmist',
      'door-charcoal',
      'window-black',
    ],
    minimalist: [
      'render-whisper',
      'concrete-alabaster',
      'trim-dover-white',
      'door-white',
      'window-white',
    ],
  }

  const preferredIds = stylePreferences[style]
  const filteredMaterials: Record<string, MaterialSelection[]> = {}

  for (const [category, materials] of Object.entries(
    materialsData as Record<string, MaterialSelection[]>
  )) {
    filteredMaterials[category] = materials.filter((material) => preferredIds.includes(material.id))
  }

  return filteredMaterials
}

// Future API integration placeholder
export async function loadMaterialsFromAPI(): Promise<Record<string, MaterialSelection[]>> {
  // This would be replaced with actual API calls in the future
  // For now, return the static data
  return getMaterials()
}

export async function loadHousePresetsFromAPI(): Promise<HousePreset[]> {
  // This would be replaced with actual API calls in the future
  // For now, return the static data
  return getHousePresets()
}

export async function saveCustomPreset(preset: HousePreset): Promise<boolean> {
  // This would save to an API in the future
  // For now, just return success
  console.log('Saving custom preset:', preset)
  return true
}
