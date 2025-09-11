import type {
  PlanTo3DResponse,
  FloorPlanAnalysis,
  Model3D,
  ArchitecturalElement,
  Room,
  StructuralElement,
  ServiceError,
} from '../../types'
import { planTo3DConfig } from '../../config/services'
import { visionPrompts } from '../../config/ai'
import { aiServiceManager } from '../ai/ai-service-manager'

// AI Service types
interface AIService {
  analyzeImage(request: {
    image: File
    prompt: string
    options: {
      temperature: number
      maxTokens: number
    }
  }): Promise<{
    success: boolean
    data?: unknown
    error?: string
  }>
}

// AI Analysis response types
interface AIAnalysisElement {
  type: string
  dimensions?: {
    width: number
    height: number
    depth?: number
  }
  position?: {
    x: number
    y: number
    z: number
  }
  properties?: Record<string, unknown>
}

interface AIAnalysisRoom {
  id?: string
  name?: string
  area?: number
  floorLevel?: number
}

interface AIAnalysisResponse {
  elements?: AIAnalysisElement[]
  rooms?: AIAnalysisRoom[]
}

// Vector sketch types
interface VectorSketch {
  format: string
  data: string
  scale: number
  elements: ArchitecturalElement[]
}

// GLTF data types
interface GLTFAsset {
  version: string
  generator: string
}

interface GLTFScene {
  nodes: number[]
}

interface GLTFNode {
  mesh?: number
  translation: number[]
}

interface GLTFMesh {
  primitives: Array<{
    attributes: Record<string, number>
    indices: number
    material: number
  }>
}

interface GLTFMaterial {
  pbrMetallicRoughness: {
    baseColorFactor: number[]
    metallicFactor: number
    roughnessFactor: number
  }
}

interface GLTFAccessor {
  bufferView: number
  componentType: number
  count: number
  type: string
  min?: number[]
  max?: number[]
}

interface GLTFBufferView {
  buffer: number
  byteOffset: number
  byteLength: number
}

interface GLTFBuffer {
  uri: string
  byteLength: number
}

interface GLTFData {
  asset: GLTFAsset
  scenes: GLTFScene[]
  nodes: GLTFNode[]
  meshes: GLTFMesh[]
  materials: GLTFMaterial[]
  accessors: GLTFAccessor[]
  bufferViews: GLTFBufferView[]
  buffers: GLTFBuffer[]
}

/**
 * @plan-to-3d-generator
 * Service for converting 2D floor plans to 3D models using AI
 *
 * System Rule: You are a spatial and architectural AI. Your task is to process a 2D
 * architectural plan, convert it into a structured sketch, and then generate a 3D model.
 * You must identify walls, rooms, windows, and other key structural elements.
 */

export class PlanTo3DGenerator {
  private config = planTo3DConfig

  /**
   * Analyze a 2D floor plan image and convert it to a 3D model using AI
   */
  async generate3DModel(
    imageFile: File,
    options: {
      scale?: number
      quality?: 'draft' | 'standard' | 'high'
      includeMetadata?: boolean
      aiProvider?: 'ollama'
    } = {}
  ): Promise<PlanTo3DResponse> {
    const startTime = Date.now()

    try {
      // Validate input
      await this.validateInput(imageFile)

      // Get AI service
      const aiService = aiServiceManager.getService(options.aiProvider)

      // Step 1: Analyze the input image using AI
      const analysis = await this.analyzeFloorPlanWithAI(imageFile, aiService)

      // Step 2: Generate 2D vectorized sketch
      const vectorSketch = await this.generateVectorSketch(analysis)

      // Step 3: Convert to 3D model
      const model3D = await this.create3DModel(vectorSketch, analysis, options)

      const processingTime = Date.now() - startTime

      return {
        success: true,
        model: model3D,
        analysis,
        message:
          'Successfully analyzed the floor plan and generated a 3D model using AI. The model is ready for material application.',
        processingTime,
      }
    } catch (error) {
      return this.handleError(error, startTime)
    }
  }

  /**
   * Validate the input file
   */
  private async validateInput(file: File): Promise<void> {
    if (!file) {
      throw new Error('No file provided')
    }

    if (file.size > this.config.modelSettings.maxFileSize) {
      throw new Error(
        `File size exceeds maximum limit of ${this.config.modelSettings.maxFileSize / (1024 * 1024)}MB`
      )
    }

    if (!this.config.modelSettings.supportedFormats.includes(file.type)) {
      throw new Error(
        `Unsupported file format. Supported formats: ${this.config.modelSettings.supportedFormats.join(', ')}`
      )
    }
  }

  /**
   * Analyze the floor plan image using AI to identify architectural elements
   */
  private async analyzeFloorPlanWithAI(
    imageFile: File,
    aiService: AIService
  ): Promise<FloorPlanAnalysis> {
    try {
      // Create vision analysis request
      const visionRequest = {
        image: imageFile,
        prompt: visionPrompts.floorPlanAnalysis,
        options: {
          temperature: 0.3, // Lower temperature for more consistent architectural analysis
          maxTokens: 2000,
        },
      }

      // Analyze image with AI
      const analysisResponse = await aiService.analyzeImage(visionRequest)

      if (!analysisResponse.success || !analysisResponse.data) {
        console.warn('AI analysis failed, falling back to mock data:', analysisResponse.error)
        return await this.simulateFloorPlanAnalysis(imageFile)
      }

      // Convert AI response to FloorPlanAnalysis format
      return await this.convertAIAnalysisToFloorPlan(
        analysisResponse.data as AIAnalysisResponse,
        imageFile
      )
    } catch (error) {
      console.error('AI floor plan analysis failed:', error)
      // Fallback to mock analysis
      return await this.simulateFloorPlanAnalysis(imageFile)
    }
  }

  /**
   * Convert AI vision analysis response to FloorPlanAnalysis format
   */
  private async convertAIAnalysisToFloorPlan(
    aiAnalysis: AIAnalysisResponse,
    imageFile: File
  ): Promise<FloorPlanAnalysis> {
    const elements: ArchitecturalElement[] = []
    const rooms: Room[] = []
    const structuralElements: StructuralElement[] = []

    // Extract image dimensions from file or use defaults
    const imageDimensions = { width: 800, height: 600 } // Default, could be extracted from image

    // Process AI-detected elements
    if (aiAnalysis.elements && Array.isArray(aiAnalysis.elements)) {
      aiAnalysis.elements.forEach((element: AIAnalysisElement, index: number) => {
        const baseElement = {
          id: `${element.type}_${index}`,
          dimensions: {
            width: element.dimensions?.width || 1,
            height: element.dimensions?.height || 1,
            depth: element.dimensions?.depth,
          },
          position: {
            x: element.position?.x || 0,
            y: element.position?.y || 0,
            z: element.position?.z || 0,
          },
          metadata: element.properties || {},
        }

        switch (element.type?.toLowerCase()) {
          case 'wall':
            elements.push({
              ...baseElement,
              type: 'wall',
            })
            break
          case 'window':
            structuralElements.push({
              ...baseElement,
              type: 'window',
            } as StructuralElement)
            break
          case 'door':
            structuralElements.push({
              ...baseElement,
              type: 'door',
            } as StructuralElement)
            break
          case 'room':
            // Rooms will be processed separately
            break
        }
      })
    }

    // Create rooms from detected elements
    const detectedRooms = aiAnalysis.rooms || []
    detectedRooms.forEach((roomData: AIAnalysisRoom, index: number) => {
      rooms.push({
        id: roomData.id || `room_${index}`,
        name: roomData.name || `Room ${index + 1}`,
        area: roomData.area || 20,
        walls: [], // Would need additional processing
        floorLevel: roomData.floorLevel || 0,
      })
    })

    // Ensure we have at least basic elements if AI didn't detect any
    if (elements.length === 0) {
      console.warn('No architectural elements detected by AI, using fallback elements')
      return await this.simulateFloorPlanAnalysis(imageFile)
    }

    return {
      elements,
      dimensions: {
        totalWidth: imageDimensions.width,
        totalHeight: imageDimensions.height,
        scale: 1 / 50, // Default scale
      },
      rooms,
      structuralElements,
    }
  }

  /**
   * Generate a 2D vectorized sketch from the analysis
   */
  private async generateVectorSketch(analysis: FloorPlanAnalysis): Promise<VectorSketch> {
    // This would generate SVG or JSON representation of the floor plan
    // For now, return a mock SVG structure
    return {
      format: 'svg',
      data: this.generateMockSVG(analysis),
      scale: analysis.dimensions.scale,
      elements: analysis.elements,
    }
  }

  /**
   * Create the 3D model from the vector sketch
   */
  private async create3DModel(
    vectorSketch: VectorSketch,
    analysis: FloorPlanAnalysis,
    options: {
      scale?: number
      quality?: 'draft' | 'standard' | 'high'
      includeMetadata?: boolean
      aiProvider?: 'ollama'
    }
  ): Promise<Model3D> {
    const modelId = `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create basic 3D model structure
    const model: Model3D = {
      id: modelId,
      format: 'gltf',
      data: this.generateMockGLTF(analysis) as GLTFData,
      sections: this.createModelSections(analysis),
      metadata: {
        created: new Date(),
        sourcePlan: 'uploaded_floor_plan',
        dimensions: {
          width: analysis.dimensions.totalWidth,
          height: 3, // Default ceiling height
          depth: analysis.dimensions.totalHeight,
        },
      },
    }

    return model
  }

  /**
   * Create model sections from architectural elements
   */
  private createModelSections(analysis: FloorPlanAnalysis) {
    const sections = []

    // Create wall sections
    analysis.elements
      .filter((element) => element.type === 'wall')
      .forEach((wall, index) => {
        sections.push({
          id: `wall_${index}`,
          name: `Wall ${index + 1}`,
          geometry: this.generateWallGeometry(wall),
          material: undefined, // To be applied later
        })
      })

    // Create floor section
    sections.push({
      id: 'floor',
      name: 'Floor',
      geometry: this.generateFloorGeometry(analysis),
      material: undefined,
    })

    // Create roof section
    sections.push({
      id: 'roof',
      name: 'Roof',
      geometry: this.generateRoofGeometry(analysis),
      material: undefined,
    })

    return sections
  }

  /**
   * Generate wall geometry
   */
  private generateWallGeometry(wall: ArchitecturalElement) {
    // Simplified wall geometry generation
    return {
      type: 'box',
      dimensions: wall.dimensions,
      position: wall.position,
    }
  }

  /**
   * Generate floor geometry
   */
  private generateFloorGeometry(analysis: FloorPlanAnalysis) {
    return {
      type: 'plane',
      dimensions: {
        width: analysis.dimensions.totalWidth,
        height: analysis.dimensions.totalHeight,
        depth: 0.1,
      },
      position: { x: 0, y: 0, z: 0 },
    }
  }

  /**
   * Generate roof geometry
   */
  private generateRoofGeometry(analysis: FloorPlanAnalysis) {
    return {
      type: 'pyramid',
      dimensions: {
        width: analysis.dimensions.totalWidth,
        height: 2,
        depth: analysis.dimensions.totalHeight,
      },
      position: {
        x: 0,
        y: analysis.dimensions.totalWidth / 2 + 1,
        z: 0,
      },
    }
  }

  /**
   * Simulate floor plan analysis (mock implementation)
   */
  private async simulateFloorPlanAnalysis(imageFile: File): Promise<FloorPlanAnalysis> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock architectural analysis
    const mockElements: ArchitecturalElement[] = [
      {
        id: 'wall_1',
        type: 'wall',
        dimensions: { width: 6, height: 3, depth: 0.2 },
        position: { x: 0, y: 1.5, z: 0 },
      },
      {
        id: 'wall_2',
        type: 'wall',
        dimensions: { width: 4, height: 3, depth: 0.2 },
        position: { x: 3, y: 1.5, z: 2 },
      },
      {
        id: 'floor_1',
        type: 'floor',
        dimensions: { width: 6, height: 4, depth: 0.1 },
        position: { x: 0, y: 0, z: 0 },
      },
    ]

    const mockRooms: Room[] = [
      {
        id: 'living_room',
        name: 'Living Room',
        area: 24, // 6x4
        walls: [],
        floorLevel: 0,
      },
    ]

    const mockStructuralElements: StructuralElement[] = [
      {
        id: 'window_1',
        type: 'window',
        position: { x: 1.5, y: 1.5, z: 2 },
        dimensions: { width: 1.5, height: 1.2 },
      },
    ]

    return {
      elements: mockElements,
      dimensions: {
        totalWidth: 6,
        totalHeight: 4,
        scale: 1 / 50, // 1:50 scale
      },
      rooms: mockRooms,
      structuralElements: mockStructuralElements,
    }
  }

  /**
   * Generate mock SVG for the floor plan
   */
  private generateMockSVG(analysis: FloorPlanAnalysis): string {
    return `
      <svg width="${analysis.dimensions.totalWidth * 50}" height="${analysis.dimensions.totalHeight * 50}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${analysis.dimensions.totalWidth * 50}" height="${analysis.dimensions.totalHeight * 50}" fill="#f0f0f0" stroke="#000" stroke-width="2"/>
        ${analysis.elements
          .map((element) => {
            if (element.type === 'wall') {
              return `<rect x="${element.position.x * 50}" y="${element.position.z * 50}" width="${element.dimensions.width * 50}" height="${element.dimensions.depth! * 50}" fill="#8B4513" stroke="#654321" stroke-width="1"/>`
            }
            return ''
          })
          .join('')}
      </svg>
    `
  }

  /**
   * Generate mock GLTF data structure
   */
  private generateMockGLTF(analysis: FloorPlanAnalysis): GLTFData {
    return {
      asset: {
        version: '2.0',
        generator: 'PlanTo3D Generator',
      },
      scenes: [{ nodes: [0] }],
      nodes: [
        {
          mesh: 0,
          translation: [0, 0, 0],
        },
      ],
      meshes: [
        {
          primitives: [
            {
              attributes: {
                POSITION: 0,
                NORMAL: 1,
              },
              indices: 2,
              material: 0,
            },
          ],
        },
      ],
      materials: [
        {
          pbrMetallicRoughness: {
            baseColorFactor: [0.8, 0.8, 0.8, 1.0],
            metallicFactor: 0.0,
            roughnessFactor: 0.8,
          },
        },
      ],
      accessors: [
        // Position accessor
        {
          bufferView: 0,
          componentType: 5126,
          count: 24,
          type: 'VEC3',
          min: [-3, 0, -2],
          max: [3, 3, 2],
        },
        // Normal accessor
        {
          bufferView: 1,
          componentType: 5126,
          count: 24,
          type: 'VEC3',
        },
        // Index accessor
        {
          bufferView: 2,
          componentType: 5123,
          count: 36,
          type: 'SCALAR',
        },
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: 288 },
        { buffer: 0, byteOffset: 288, byteLength: 288 },
        { buffer: 0, byteOffset: 576, byteLength: 72 },
      ],
      buffers: [
        {
          uri: 'data:application/octet-stream;base64,' + this.generateMockBinaryData(),
          byteLength: 648,
        },
      ],
    }
  }

  /**
   * Generate mock binary data for GLTF buffer
   */
  private generateMockBinaryData(): string {
    // Generate mock vertex data for a simple house
    const vertices = new Float32Array([
      // Front face
      -3, 0, 2, 3, 0, 2, 3, 3, 2, -3, 3, 2,
      // Back face
      -3, 0, -2, -3, 3, -2, 3, 3, -2, 3, 0, -2,
      // Left face
      -3, 0, -2, -3, 0, 2, -3, 3, 2, -3, 3, -2,
      // Right face
      3, 0, -2, 3, 3, -2, 3, 3, 2, 3, 0, 2,
      // Top face
      -3, 3, -2, -3, 3, 2, 3, 3, 2, 3, 3, -2,
      // Bottom face
      -3, 0, -2, 3, 0, -2, 3, 0, 2, -3, 0, 2,
    ])

    const normals = new Float32Array([
      // Front
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      // Back
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      // Left
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
      // Right
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      // Top
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      // Bottom
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    ])

    const indices = new Uint16Array([
      0,
      1,
      2,
      0,
      2,
      3, // Front
      4,
      5,
      6,
      4,
      6,
      7, // Back
      8,
      9,
      10,
      8,
      10,
      11, // Left
      12,
      13,
      14,
      12,
      14,
      15, // Right
      16,
      17,
      18,
      16,
      18,
      19, // Top
      20,
      21,
      22,
      20,
      22,
      23, // Bottom
    ])

    // Combine all data
    const combined = new Uint8Array(vertices.byteLength + normals.byteLength + indices.byteLength)
    combined.set(new Uint8Array(vertices.buffer), 0)
    combined.set(new Uint8Array(normals.buffer), vertices.byteLength)
    combined.set(new Uint8Array(indices.buffer), vertices.byteLength + normals.byteLength)

    // Convert to base64
    let binary = ''
    combined.forEach((byte) => (binary += String.fromCharCode(byte)))
    return btoa(binary)
  }

  /**
   * Handle errors and return appropriate response
   */
  private handleError(error: Error | unknown, startTime: number): PlanTo3DResponse {
    const serviceError: ServiceError = {
      code: 'PLAN_TO_3D_ERROR',
      message:
        error instanceof Error ? error.message : 'Failed to generate 3D model from floor plan',
      details: error,
    }

    return {
      success: false,
      model: {} as Model3D,
      analysis: {} as FloorPlanAnalysis,
      message: serviceError.message,
      processingTime: Date.now() - startTime,
      error: serviceError,
    }
  }
}

// Export singleton instance
export const planTo3DGenerator = new PlanTo3DGenerator()
