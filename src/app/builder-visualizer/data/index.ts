import materialsData from './materials.json'
import housePresetsData from './house-presets.json'
import viewSettingsData from './view-settings.json'
import housePlansData from './house-plans.json'
import defaultHouseData from './default-house.json'

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
  cost: number
  materialType?: {
    id: string
    name: string
    category: 'roof' | 'wall' | 'floor' | 'window' | 'door' | 'trim'
  }
  profile?: {
    id: string
    name: string
    description: string
    texturePattern: string
  }
  colorCollection?: {
    id: string
    name: string
    type: 'designer' | 'classic' | 'premium'
  }
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
    maintenance: string
    fire_rating: string
    insulation: string
    description: string
    [key: string]: string | number | boolean
  }
}

export interface HousePreset {
  id: string
  name: string
  description: string
  style: 'modern' | 'traditional' | 'contemporary' | 'minimalist'
  budget: 'low' | 'medium' | 'high' | 'premium'
  materials: Record<string, MaterialSelection>
  sections?: Array<{
    id: string
    name: string
    type: string
    material: MaterialSelection
  }>
  metadata?: {
    size: string
    bedrooms: number
    bathrooms: number
    estimatedCost: number
  }
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

export interface HousePlan {
  id: string
  name: string
  builder: string
  facade: string
  description: string
  style: 'modern' | 'traditional' | 'contemporary' | 'minimalist'
  budget: 'low' | 'medium' | 'high' | 'premium'
  specifications: {
    bedrooms: number
    bathrooms: number
    garage: number
    livingAreas: number
    totalArea: number
    landSize: string
  }
  floorPlan: {
    groundFloor: {
      rooms: Array<{
        id: string
        name: string
        type: string
        area: number
        position: [number, number, number]
      }>
    }
    firstFloor: {
      rooms: Array<{
        id: string
        name: string
        type: string
        area: number
        position: [number, number, number]
      }>
    }
  }
  facadeOptions: Record<
    string,
    {
      name: string
      description: string
      imageUrl?: string // Facade preview image URL
      features: string[]
      materials: Record<string, string>
      cost: {
        base: number
        upgrades: Record<string, number>
      }
    }
  >
  geometry: {
    dimensions: {
      width: number
      height: number
      depth: number
    }
    sections: Array<{
      id: string
      name: string
      type: string
      geometry: {
        type: string
        args: number[]
        position: [number, number, number]
        rotation?: [number, number, number]
        scale?: [number, number, number]
      }
    }>
  }
}

// Data loading functions
export function getMaterials(): Record<string, Record<string, MaterialSelection>> {
  return materialsData as unknown as Record<string, Record<string, MaterialSelection>>
}

export function getMaterialsByCategory(category: string): MaterialSelection[] {
  const categoryData = (
    materialsData as unknown as Record<string, Record<string, MaterialSelection>>
  )[category]
  return categoryData ? Object.values(categoryData) : []
}

export function getMaterialById(id: string): MaterialSelection | null {
  for (const category of Object.values(
    materialsData as unknown as Record<string, Record<string, MaterialSelection>>
  )) {
    for (const material of Object.values(category)) {
      if (material.id === id) return material
    }
  }
  return null
}

export function getDefaultHouse() {
  return housePresetsData.defaultHouse
}

export function getHousePresets(): HousePreset[] {
  return housePresetsData.presets as unknown as HousePreset[]
}

export function getHousePresetById(id: string): HousePreset | null {
  return (
    (housePresetsData.presets.find((preset) => preset.id === id) as unknown as HousePreset) || null
  )
}

export function getHousePreset(id: string) {
  // First try to get from presets
  const preset = getHousePresetById(id)
  if (preset) {
    return preset
  }

  // Fall back to default house for backward compatibility
  return getDefaultHouse()
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
  if (!materials || typeof materials !== 'object') {
    return 0
  }

  return Object.values(materials).reduce((total, material) => {
    if (!material || typeof material !== 'object') {
      return total
    }

    // Calculate cost based on surface area and material cost per unit
    const surfaceArea = material.surfaceSize?.area || 1 // Default to 1 if no size info
    const costPerUnit = material.cost || 0
    return total + surfaceArea * costPerUnit
  }, 0)
}

export function getMaterialsByBudget(
  budget: 'low' | 'medium' | 'high' | 'premium'
): Record<string, MaterialSelection[]> {
  const budgetRanges = {
    low: { min: 0, max: 50 },
    medium: { min: 50, max: 100 },
    high: { min: 100, max: 150 },
    premium: { min: 150, max: Infinity },
  }

  const range = budgetRanges[budget]
  const filteredMaterials: Record<string, MaterialSelection[]> = {}

  for (const [category, categoryMaterials] of Object.entries(
    materialsData as unknown as Record<string, Record<string, MaterialSelection>>
  )) {
    filteredMaterials[category] = Object.values(categoryMaterials).filter((material) => {
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
      'premium_white_marble',
      'charcoal_concrete_panel',
      'colorbond_steel',
      'polished_concrete',
      'aluminum_sliding_door',
      'double_glazed_clear',
      'aluminum_trim',
    ],
    traditional: [
      'red_brick_veneer',
      'terracotta_tiles',
      'spotted_gum_hardwood',
      'solid_timber_door',
      'hardwood_trim',
    ],
    contemporary: [
      'cedar_cladding',
      'patina_copper',
      'italian_porcelain_tiles',
      'glass_panel_door',
      'tinted_glass',
    ],
    minimalist: [
      'cream_render_finish',
      'charcoal_concrete_panel',
      'polished_concrete',
      'glass_panel_door',
      'double_glazed_clear',
      'aluminum_trim',
    ],
  }

  const preferredIds = stylePreferences[style]
  const filteredMaterials: Record<string, MaterialSelection[]> = {}

  for (const [category, categoryMaterials] of Object.entries(
    materialsData as unknown as Record<string, Record<string, MaterialSelection>>
  )) {
    filteredMaterials[category] = Object.values(categoryMaterials).filter((material) =>
      preferredIds.includes(material.id)
    )
  }

  return filteredMaterials as Record<string, MaterialSelection[]>
}

// New functions for palette-style material selection
export function getMaterialTypesByCategory(category: string): Array<{ id: string; name: string }> {
  const materialTypes = {
    roof: [
      { id: 'concrete_tiles', name: 'Concrete Tiles' },
      { id: 'terracotta_tiles', name: 'Terracotta / Ceramic Tiles' },
      { id: 'metal_roofing', name: 'Metal Roofing' },
      { id: 'slate', name: 'Slate' },
    ],
    wall: [
      { id: 'brick', name: 'Brick' },
      { id: 'render', name: 'Render' },
      { id: 'cladding', name: 'Cladding' },
      { id: 'weatherboard', name: 'Weatherboard' },
    ],
    floor: [
      { id: 'tiles', name: 'Tiles' },
      { id: 'timber', name: 'Timber' },
      { id: 'concrete', name: 'Concrete' },
      { id: 'carpet', name: 'Carpet' },
    ],
    window: [
      { id: 'aluminum', name: 'Aluminum' },
      { id: 'timber', name: 'Timber' },
      { id: 'composite', name: 'Composite' },
    ],
    door: [
      { id: 'timber', name: 'Timber' },
      { id: 'aluminum', name: 'Aluminum' },
      { id: 'composite', name: 'Composite' },
    ],
    trim: [
      { id: 'aluminum', name: 'Aluminum' },
      { id: 'timber', name: 'Timber' },
      { id: 'composite', name: 'Composite' },
    ],
  }

  return materialTypes[category as keyof typeof materialTypes] || []
}

export function getProfilesByMaterialType(
  materialTypeId: string
): Array<{ id: string; name: string; description: string }> {
  const profiles = {
    concrete_tiles: [
      { id: 'flat', name: 'Flat Profile', description: 'Smooth, flat surface' },
      { id: 'roman', name: 'Roman Profile', description: 'Classic curved profile' },
      { id: 'scandia', name: 'Scandia Profile', description: 'Modern angular profile' },
    ],
    terracotta_tiles: [
      { id: 'spanish', name: 'Spanish Profile', description: 'Traditional curved profile' },
      { id: 'french', name: 'French Profile', description: 'Elegant curved profile' },
      { id: 'monier', name: 'Monier Profile', description: 'Classic Australian profile' },
    ],
    metal_roofing: [
      { id: 'corrugated', name: 'Corrugated', description: 'Classic corrugated pattern' },
      { id: 'trimdeck', name: 'Trimdek', description: 'Modern ribbed profile' },
      { id: 'klip_lok', name: 'Klip-Lok', description: 'Concealed fixing system' },
    ],
    brick: [
      { id: 'standard', name: 'Standard Brick', description: 'Traditional brick pattern' },
      { id: 'stacked', name: 'Stacked Bond', description: 'Modern stacked pattern' },
      { id: 'herringbone', name: 'Herringbone', description: 'Decorative herringbone pattern' },
    ],
    render: [
      { id: 'smooth', name: 'Smooth Render', description: 'Smooth finish' },
      { id: 'textured', name: 'Textured Render', description: 'Textured finish' },
      { id: 'bagged', name: 'Bagged Finish', description: 'Natural bagged appearance' },
    ],
  }

  return profiles[materialTypeId as keyof typeof profiles] || []
}

export function getColorCollections(): Array<{
  id: string
  name: string
  type: 'designer' | 'classic' | 'premium'
  colors: Array<{ id: string; name: string; color: string; textureUrl?: string }>
}> {
  return [
    {
      id: 'light_collection',
      name: 'Light Collection',
      type: 'designer',
      colors: [
        {
          id: 'silver_gum_designer',
          name: 'Silver Gum (Designer)',
          color: '#C0C0C0',
          textureUrl: '/textures/silver_gum_designer.jpg',
        },
        {
          id: 'linen_designer',
          name: 'Linen (Designer)',
          color: '#F5E6D3',
          textureUrl: '/textures/linen_designer.jpg',
        },
        {
          id: 'alabaster_designer',
          name: 'Alabaster (Designer)',
          color: '#F8F8F8',
          textureUrl: '/textures/alabaster_designer.jpg',
        },
      ],
    },
    {
      id: 'light_collection_classic',
      name: 'Light Collection',
      type: 'classic',
      colors: [
        {
          id: 'linen_classic',
          name: 'Linen (Classic)',
          color: '#F5E6D3',
          textureUrl: '/textures/linen_classic.jpg',
        },
        {
          id: 'alabaster_classic',
          name: 'Alabaster (Classic)',
          color: '#F8F8F8',
          textureUrl: '/textures/alabaster_classic.jpg',
        },
        {
          id: 'silver_gum_classic',
          name: 'Silver Gum (Classic)',
          color: '#C0C0C0',
          textureUrl: '/textures/silver_gum_classic.jpg',
        },
      ],
    },
    {
      id: 'mid_tone_collection',
      name: 'Mid Tone Collection',
      type: 'designer',
      colors: [
        {
          id: 'charcoal_designer',
          name: 'Charcoal (Designer)',
          color: '#36454F',
          textureUrl: '/textures/charcoal_designer.jpg',
        },
        {
          id: 'sandstone_designer',
          name: 'Sandstone (Designer)',
          color: '#D2B48C',
          textureUrl: '/textures/sandstone_designer.jpg',
        },
        {
          id: 'terracotta_designer',
          name: 'Terracotta (Designer)',
          color: '#E2725B',
          textureUrl: '/textures/terracotta_designer.jpg',
        },
      ],
    },
    {
      id: 'dark_collection',
      name: 'Dark Collection',
      type: 'premium',
      colors: [
        {
          id: 'ironstone_premium',
          name: 'Ironstone (Premium)',
          color: '#2F2F2F',
          textureUrl: '/textures/ironstone_premium.jpg',
        },
        {
          id: 'basalt_premium',
          name: 'Basalt (Premium)',
          color: '#1C1C1C',
          textureUrl: '/textures/basalt_premium.jpg',
        },
        {
          id: 'anthracite_premium',
          name: 'Anthracite (Premium)',
          color: '#36454F',
          textureUrl: '/textures/anthracite_premium.jpg',
        },
      ],
    },
  ]
}

// Future API integration placeholder
export async function loadMaterialsFromAPI(): Promise<
  Record<string, Record<string, MaterialSelection>>
> {
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

// House Plan functions
export function getHousePlans(): HousePlan[] {
  const allPlans = [...housePlansData.plans, defaultHouseData] as unknown as HousePlan[]
  return allPlans
}

export function getHousePlanById(id: string): HousePlan | null {
  if (id === 'default-house') {
    return defaultHouseData as unknown as HousePlan
  }
  return (housePlansData.plans.find((plan) => plan.id === id) as unknown as HousePlan) || null
}

export function getHousePlansByBuilder(builder: string): HousePlan[] {
  return housePlansData.plans.filter((plan) =>
    plan.builder.toLowerCase().includes(builder.toLowerCase())
  ) as unknown as HousePlan[]
}

export function getHousePlansByFacade(facade: string): HousePlan[] {
  return housePlansData.plans.filter((plan) =>
    plan.facade.toLowerCase().includes(facade.toLowerCase())
  ) as unknown as HousePlan[]
}

export function calculateUpgradeCost(
  plan: HousePlan,
  facade: string,
  selectedMaterials: Record<string, MaterialSelection>
): number {
  const facadeOption = plan.facadeOptions?.[facade]
  if (!facadeOption) return 0

  let totalCost = facadeOption.cost.base

  // Calculate material upgrade costs based on actual surface area
  if (selectedMaterials && typeof selectedMaterials === 'object') {
    Object.entries(selectedMaterials).forEach(([, material]) => {
      if (material && typeof material === 'object' && material.cost) {
        const surfaceArea = material.surfaceSize?.area || 10 // Default to 10m² if no size info
        totalCost += material.cost * surfaceArea
      }
    })
  }

  // Add facade upgrade costs
  if (facadeOption.cost.upgrades) {
    Object.values(facadeOption.cost.upgrades).forEach((upgradeCost) => {
      totalCost += upgradeCost
    })
  }

  return totalCost
}

export function generateAIPrompt(
  plan: HousePlan,
  facade: string,
  selectedMaterials: Record<string, MaterialSelection>
): string {
  const facadeOption = plan.facadeOptions?.[facade]
  const materialDescriptions =
    selectedMaterials && typeof selectedMaterials === 'object'
      ? Object.entries(selectedMaterials)
          .map(([category, material]) =>
            material && typeof material === 'object'
              ? `${category}: ${material.name || 'Unknown'} (${material.color || 'Default'})`
              : `${category}: Not selected`
          )
          .join(', ')
      : 'No materials selected'

  return `Create a photorealistic architectural rendering of a ${plan.name} house by ${plan.builder} with ${facadeOption?.name || facade} facade.

House Specifications:
- ${plan.specifications?.bedrooms || 0} bedrooms, ${plan.specifications?.bathrooms || 0} bathrooms
- ${plan.specifications?.garage || 0} car garage
- ${plan.specifications?.totalArea || 0}m² total area
- ${plan.specifications?.landSize || 'Standard'} land size

Selected Materials: ${materialDescriptions}

Style: ${plan.style} contemporary design
Budget: ${plan.budget} tier

Please create a high-quality, photorealistic exterior view showing:
- Modern architectural lines and proportions
- Premium material finishes
- Professional landscaping
- Natural lighting and shadows
- Clean, magazine-quality composition

The image should look like a professional architectural photography shot suitable for a luxury home builder's marketing materials.`
}
