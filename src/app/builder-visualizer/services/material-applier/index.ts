import type {
  MaterialApplicationResponse,
  Model3D,
  MaterialSelection,
  Material,
  MaterialLibrary,
  ServiceError,
} from '../../types'
import { textureManager } from '../../utils/texture-manager'

// GLTF-specific types
interface GLTFMaterial {
  name: string
  pbrMetallicRoughness: {
    baseColorFactor: number[]
    metallicFactor: number
    roughnessFactor: number
  }
  extensions?: {
    KHR_materials_ior?: {
      ior: number
    }
    KHR_materials_pbrSpecularGlossiness?: {
      diffuseFactor: number[]
      specularFactor: number[]
      glossinessFactor: number
    }
  }
  normalTexture?: {
    index: number
    scale?: number
  }
  occlusionTexture?: {
    index: number
    strength?: number
  }
  emissiveTexture?: {
    index: number
  }
}

interface GLTFTexture {
  source: number
  sampler?: number
}

interface GLTFImage {
  uri?: string
  bufferView?: number
  mimeType?: string
}

interface GLTFMesh {
  primitives: Array<{
    attributes: Record<string, number>
    indices: number
    material: number
  }>
}

interface GLTFData {
  materials?: GLTFMaterial[]
  meshes?: GLTFMesh[]
  textures?: GLTFTexture[]
  images?: GLTFImage[]
}

import { materialApplierConfig } from '../../config/services'
import materialsData from '../../config/materials.json'

/**
 * @material-applier
 * Service for applying materials to 3D model sections
 *
 * System Rule: You are a 3D renderer. Your task is to take a given 3D model and apply
 * materials with specific attributes to designated sections. You must use the materials.json
 * file for all material definitions.
 */

export class MaterialApplier {
  private config = materialApplierConfig
  private materialLibrary: MaterialLibrary = materialsData

  /**
   * Apply materials to specific sections of a 3D model
   */
  async applyMaterials(
    model: Model3D,
    selections: MaterialSelection[]
  ): Promise<MaterialApplicationResponse> {
    const startTime = Date.now()

    try {
      // Validate inputs
      this.validateInputs(model, selections)

      // Look up materials from the library
      const materials = await this.lookupMaterials(selections)

      // Apply materials to model sections
      const updatedModel = await this.applyMaterialsToModel(model, materials, selections)

      return {
        success: true,
        updatedModel,
        appliedMaterials: selections,
        message: 'Materials have been successfully applied. The model is ready for rendering.',
      }
    } catch (error) {
      return this.handleError(error, startTime)
    }
  }

  /**
   * Validate input parameters
   */
  private validateInputs(model: Model3D, selections: MaterialSelection[]): void {
    if (!model || !model.sections) {
      throw new Error('Invalid 3D model provided')
    }

    if (!selections || selections.length === 0) {
      throw new Error('No material selections provided')
    }

    // Check if all selected sections exist in the model
    const sectionIds = model.sections.map((section) => section.id)
    const invalidSelections = selections.filter(
      (selection) => !sectionIds.includes(selection.sectionId)
    )

    if (invalidSelections.length > 0) {
      throw new Error(
        `Invalid section IDs: ${invalidSelections.map((s) => s.sectionId).join(', ')}`
      )
    }
  }

  /**
   * Look up materials from the materials library
   */
  private async lookupMaterials(selections: MaterialSelection[]): Promise<Map<string, Material>> {
    const materialMap = new Map<string, Material>()
    const notFound: string[] = []

    for (const selection of selections) {
      const material = this.materialLibrary[selection.materialName]

      if (!material) {
        notFound.push(selection.materialName)
      } else {
        materialMap.set(selection.sectionId, material)
      }
    }

    if (notFound.length > 0) {
      throw new Error(`Materials not found in library: ${notFound.join(', ')}`)
    }

    return materialMap
  }

  /**
   * Apply materials to the 3D model sections
   */
  private async applyMaterialsToModel(
    model: Model3D,
    materials: Map<string, Material>,
    selections: MaterialSelection[]
  ): Promise<Model3D> {
    // Create a deep copy of the model to avoid mutating the original
    const updatedModel: Model3D = {
      ...model,
      sections: model.sections.map((section) => ({ ...section })),
      metadata: {
        ...model.metadata,
        lastModified: new Date(),
      },
    }

    // Preload all textures for better performance
    const allMaterials = Array.from(materials.values())
    await textureManager.preloadTextures(allMaterials)

    // Apply materials to each section
    for (const selection of selections) {
      const section = updatedModel.sections.find((s) => s.id === selection.sectionId)
      const material = materials.get(selection.sectionId)

      if (section && material) {
        section.material = {
          ...material,
          appliedAt: selection.appliedAt,
        }

        // Update the model's GLTF data with material properties and textures
        await this.updateModelDataWithMaterial(updatedModel, section.id, material)
      }
    }

    return updatedModel
  }

  /**
   * Update the model's GLTF data with material properties and textures
   */
  private async updateModelDataWithMaterial(
    model: Model3D,
    sectionId: string,
    material: Material
  ): Promise<void> {
    // In a real implementation, this would modify the GLTF JSON structure
    // to include the material properties for the specific mesh
    if (model.format === 'gltf' && model.data) {
      // Find the material index for this section
      const materialIndex = await this.findOrCreateMaterialIndex(model, material)

      // Update the mesh primitive to use this material
      this.updateMeshMaterial(model, sectionId, materialIndex)
    }
  }

  /**
   * Find or create a material index in the GLTF materials array
   */
  private async findOrCreateMaterialIndex(model: Model3D, material: Material): Promise<number> {
    if (!model.data.materials) {
      model.data.materials = []
    }

    // Check if material already exists
    const existingIndex = model.data.materials.findIndex(
      (m: GLTFMaterial) => m.name === material.name
    )

    if (existingIndex !== -1) {
      return existingIndex
    }

    // Create new GLTF material with textures
    const gltfMaterial = await this.convertToGLTFMaterial(model, material)
    model.data.materials.push(gltfMaterial)

    return model.data.materials.length - 1
  }

  /**
   * Convert our material format to GLTF material format with textures
   */
  private async convertToGLTFMaterial(model: Model3D, material: Material): Promise<GLTFMaterial> {
    const gltfMaterial: GLTFMaterial = {
      name: material.name,
      pbrMetallicRoughness: {
        baseColorFactor: this.hexToRgb(material.color).concat([1.0]),
        metallicFactor: material.metalness || 0.0,
        roughnessFactor: material.roughness,
      },
    }

    // Add extensions for advanced material properties
    if (material.reflection > 0.5) {
      gltfMaterial.extensions = {
        KHR_materials_ior: {
          ior: 1.5,
        },
      }
    }

    // Add texture references if available
    if (material.textureUrl) {
      const textureIndex = await this.addTextureToModel(model, material.textureUrl)
      if (textureIndex !== -1) {
        // In GLTF, base color texture is handled through pbrMetallicRoughness.baseColorTexture
        // This would be implemented in the actual GLTF structure
      }
    }

    if (material.normalMapUrl) {
      const textureIndex = await this.addTextureToModel(model, material.normalMapUrl)
      if (textureIndex !== -1) {
        gltfMaterial.normalTexture = {
          index: textureIndex,
          scale: 1.0,
        }
      }
    }

    if (material.aoMapUrl) {
      const textureIndex = await this.addTextureToModel(model, material.aoMapUrl)
      if (textureIndex !== -1) {
        gltfMaterial.occlusionTexture = {
          index: textureIndex,
          strength: 1.0,
        }
      }
    }

    return gltfMaterial
  }

  /**
   * Add texture to GLTF model and return texture index
   */
  private async addTextureToModel(model: Model3D, textureUrl: string): Promise<number> {
    // Initialize textures and images arrays if they don't exist
    if (!model.data.textures) {
      model.data.textures = []
    }
    if (!model.data.images) {
      model.data.images = []
    }

    // Check if texture already exists
    const existingImageIndex = model.data.images.findIndex(
      (img: GLTFImage) => img.uri === textureUrl
    )

    if (existingImageIndex !== -1) {
      // Find corresponding texture index
      const textureIndex = model.data.textures.findIndex(
        (tex: GLTFTexture) => tex.source === existingImageIndex
      )
      return textureIndex !== -1
        ? textureIndex
        : this.createTextureReference(model, existingImageIndex)
    }

    // Add new image
    const imageIndex = model.data.images.length
    model.data.images.push({
      uri: textureUrl,
      mimeType: this.getMimeTypeFromUrl(textureUrl),
    })

    // Add texture reference
    return this.createTextureReference(model, imageIndex)
  }

  /**
   * Create texture reference in GLTF
   */
  private createTextureReference(model: Model3D, imageIndex: number): number {
    const textureIndex = model.data.textures!.length
    model.data.textures!.push({
      source: imageIndex,
    })
    return textureIndex
  }

  /**
   * Get MIME type from URL
   */
  private getMimeTypeFromUrl(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'webp':
        return 'image/webp'
      default:
        return 'image/jpeg'
    }
  }

  /**
   * Update mesh primitive to use the specified material
   */
  private updateMeshMaterial(model: Model3D, sectionId: string, materialIndex: number): void {
    // This would find the mesh for the section and update its material index
    // For now, we'll update the first mesh primitive
    if (model.data.meshes && model.data.meshes[0]?.primitives) {
      model.data.meshes[0].primitives[0].material = materialIndex
    }
  }

  /**
   * Convert hex color to RGB array
   */
  private hexToRgb(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return [1, 1, 1] // Default to white

    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ]
  }

  /**
   * Get all available materials from the library
   */
  getAvailableMaterials(): Material[] {
    return Object.values(this.materialLibrary)
  }

  /**
   * Get a specific material by name
   */
  getMaterial(materialName: string): Material | undefined {
    return this.materialLibrary[materialName]
  }

  /**
   * Get materials suitable for a specific surface type
   */
  getMaterialsForSurfaceType(surfaceType: 'wall' | 'floor' | 'roof' | 'ceiling'): Material[] {
    const materials = Object.values(this.materialLibrary)

    switch (surfaceType) {
      case 'floor':
        return materials.filter(
          (m) =>
            m.properties.texture === 'laminate' ||
            m.properties.texture === 'natural_stone' ||
            m.name.toLowerCase().includes('wood') ||
            m.name.toLowerCase().includes('tile')
        )
      case 'wall':
        return materials.filter(
          (m) =>
            m.properties.texture === 'brick' ||
            m.properties.texture === 'render' ||
            m.properties.finish === 'smooth'
        )
      case 'roof':
        return materials.filter(
          (m) =>
            m.name.toLowerCase().includes('tile') ||
            m.properties.texture === 'ceramic' ||
            m.properties.durability === 'high'
        )
      case 'ceiling':
        return materials.filter(
          (m) => m.properties.finish === 'smooth' || m.properties.finish === 'matte'
        )
      default:
        return materials
    }
  }

  /**
   * Handle errors and return appropriate response
   */
  private handleError(error: Error | unknown, startTime: number): MaterialApplicationResponse {
    const serviceError: ServiceError = {
      code: 'MATERIAL_APPLICATION_ERROR',
      message: error instanceof Error ? error.message : 'Failed to apply materials to 3D model',
      details: error,
    }

    return {
      success: false,
      updatedModel: {} as Model3D,
      appliedMaterials: [],
      message: serviceError.message,
      error: serviceError,
    }
  }
}

// Export singleton instance
export const materialApplier = new MaterialApplier()
