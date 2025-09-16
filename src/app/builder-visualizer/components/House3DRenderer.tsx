/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState, useEffect } from 'react'
import { getHousePlanById } from '../data'
import type { MaterialSelection } from '../types'
import { TextureLoader } from 'three'

interface House3DRendererProps {
  housePlan?: any
  selectedMaterials?: MaterialSelection[] | Record<string, MaterialSelection>
  selectedFacade?: string
  viewMode?: '3d' | 'preview'
  showWireframe?: boolean
  showShadows?: boolean
  showGrid?: boolean
  onSectionClick?: (sectionId: string) => void
}

interface SectionConfig {
  id: string
  name: string
  type: string
  geometry: {
    type: 'box' | 'cone' | 'cylinder' | 'plane'
    args: number[]
    position: [number, number, number]
    rotation?: [number, number, number]
    scale?: [number, number, number]
  }
  material: {
    color: string
    roughness: number
    metalness: number
    castShadow?: boolean
    receiveShadow?: boolean
  }
}

// House geometry configurations for different presets
const HOUSE_GEOMETRIES = {
  'modern-minimalist': {
    name: 'Modern Minimalist',
    description: 'Clean lines with flat roof and geometric shapes',
    sections: [
      // Main structure - rectangular with flat roof
      {
        id: 'main-structure',
        name: 'Main Structure',
        type: 'wall',
        geometry: {
          type: 'box',
          args: [12, 4, 8],
          position: [0, 2, 0] as [number, number, number],
        },
      },
      // Flat roof
      {
        id: 'roof-flat',
        name: 'Flat Roof',
        type: 'roof',
        geometry: { type: 'box', args: [12.2, 0.1, 8.2], position: [0, 4.05, 0] },
      },
      // Modern windows - large rectangular
      {
        id: 'window-front-large',
        name: 'Front Window',
        type: 'window',
        geometry: { type: 'box', args: [4, 2.5, 0.1], position: [0, 2.5, 4.05] },
      },
      {
        id: 'window-side-left',
        name: 'Left Window',
        type: 'window',
        geometry: { type: 'box', args: [0.1, 2.5, 3], position: [-6.05, 2.5, 0] },
      },
      {
        id: 'window-side-right',
        name: 'Right Window',
        type: 'window',
        geometry: { type: 'box', args: [0.1, 2.5, 3], position: [6.05, 2.5, 0] },
      },
      // Modern door - sliding glass
      {
        id: 'door-main-glass',
        name: 'Glass Door',
        type: 'door',
        geometry: { type: 'box', args: [1.5, 2.8, 0.1], position: [4, 1.4, 4.05] },
      },
      // Minimalist trim
      {
        id: 'trim-minimal',
        name: 'Minimal Trim',
        type: 'trim',
        geometry: { type: 'box', args: [12.4, 0.1, 8.4], position: [0, 4.1, 0] },
      },
    ],
  },
  'traditional-family': {
    name: 'Traditional Family Home',
    description: 'Classic gabled roof with traditional proportions',
    sections: [
      // Main structure
      {
        id: 'main-structure',
        name: 'Main Structure',
        type: 'wall',
        geometry: { type: 'box', args: [10, 3.5, 6], position: [0, 1.75, 0] },
      },
      // Gabled roof - triangular
      {
        id: 'roof-gable-left',
        name: 'Left Gable',
        type: 'roof',
        geometry: {
          type: 'box',
          args: [5, 2, 6.2],
          position: [-2.5, 4.5, 0],
          rotation: [0, 0, 0.2617993877991494],
        },
      },
      {
        id: 'roof-gable-right',
        name: 'Right Gable',
        type: 'roof',
        geometry: {
          type: 'box',
          args: [5, 2, 6.2],
          position: [2.5, 4.5, 0],
          rotation: [0, 0, -0.2617993877991494],
        },
      },
      // Traditional windows - smaller, rectangular
      {
        id: 'window-front-left',
        name: 'Front Left Window',
        type: 'window',
        geometry: { type: 'box', args: [1.5, 1.8, 0.1], position: [-2.5, 2.5, 3.05] },
      },
      {
        id: 'window-front-right',
        name: 'Front Right Window',
        type: 'window',
        geometry: { type: 'box', args: [1.5, 1.8, 0.1], position: [2.5, 2.5, 3.05] },
      },
      {
        id: 'window-side-left',
        name: 'Left Side Window',
        type: 'window',
        geometry: { type: 'box', args: [0.1, 1.8, 1.5], position: [-5.05, 2.5, 1.5] },
      },
      {
        id: 'window-side-right',
        name: 'Right Side Window',
        type: 'window',
        geometry: { type: 'box', args: [0.1, 1.8, 1.5], position: [5.05, 2.5, 1.5] },
      },
      // Traditional door
      {
        id: 'door-main-traditional',
        name: 'Traditional Door',
        type: 'door',
        geometry: { type: 'box', args: [1, 2.2, 0.1], position: [0, 1.1, 3.05] },
      },
      // Traditional trim and gutters
      {
        id: 'trim-fascia-traditional',
        name: 'Fascia Board',
        type: 'trim',
        geometry: { type: 'box', args: [10.2, 0.2, 6.2], position: [0, 3.6, 0] },
      },
      {
        id: 'trim-gutters-traditional',
        name: 'Gutters',
        type: 'trim',
        geometry: {
          type: 'cylinder',
          args: [0.1, 0.1, 10.4],
          position: [0, 3.5, 0],
          rotation: [0, 0, 1.5707963267948966],
        },
      },
    ],
  },
  'contemporary-luxury': {
    name: 'Contemporary Luxury',
    description: 'Premium materials with complex roof lines and modern features',
    sections: [
      // Main structure - larger and more complex
      {
        id: 'main-structure',
        name: 'Main Structure',
        type: 'wall',
        geometry: { type: 'box', args: [14, 4.5, 10], position: [0, 2.25, 0] },
      },
      // Second floor
      {
        id: 'second-floor',
        name: 'Second Floor',
        type: 'floor',
        geometry: { type: 'box', args: [12, 0.2, 8], position: [0, 4.5, 0] },
      },
      // Complex roof - multiple levels
      {
        id: 'roof-main-level',
        name: 'Main Roof Level',
        type: 'roof',
        geometry: { type: 'box', args: [12.2, 0.1, 8.2], position: [0, 4.6, 0] },
      },
      {
        id: 'roof-upper-level',
        name: 'Upper Roof Level',
        type: 'roof',
        geometry: { type: 'box', args: [8, 0.1, 6], position: [0, 5.5, 0] },
      },
      // Luxury windows - floor to ceiling
      {
        id: 'window-front-luxury',
        name: 'Front Luxury Window',
        type: 'window',
        geometry: { type: 'box', args: [6, 4, 0.1], position: [0, 2.5, 5.05] },
      },
      {
        id: 'window-side-luxury-left',
        name: 'Left Luxury Window',
        type: 'window',
        geometry: { type: 'box', args: [0.1, 4, 4], position: [-7.05, 2.5, 0] },
      },
      {
        id: 'window-side-luxury-right',
        name: 'Right Luxury Window',
        type: 'window',
        geometry: { type: 'box', args: [0.1, 4, 4], position: [7.05, 2.5, 0] },
      },
      // Luxury door - double doors
      {
        id: 'door-main-luxury-left',
        name: 'Luxury Door Left',
        type: 'door',
        geometry: { type: 'box', args: [1, 3, 0.1], position: [-0.5, 1.5, 5.05] },
      },
      {
        id: 'door-main-luxury-right',
        name: 'Luxury Door Right',
        type: 'door',
        geometry: { type: 'box', args: [1, 3, 0.1], position: [0.5, 1.5, 5.05] },
      },
      // Premium trim
      {
        id: 'trim-luxury-fascia',
        name: 'Luxury Fascia',
        type: 'trim',
        geometry: { type: 'box', args: [14.4, 0.3, 10.4], position: [0, 4.7, 0] },
      },
      {
        id: 'trim-luxury-corners',
        name: 'Luxury Corner Trim',
        type: 'trim',
        geometry: { type: 'box', args: [0.3, 4.5, 0.3], position: [-7.15, 2.25, -5.15] },
      },
    ],
  },
  'rustic-countryside': {
    name: 'Rustic Countryside',
    description: 'Natural materials with weathered textures and traditional features',
    sections: [
      // Main structure - smaller, cozy
      {
        id: 'main-structure',
        name: 'Main Structure',
        type: 'wall',
        geometry: { type: 'box', args: [8, 3, 6], position: [0, 1.5, 0] },
      },
      // Steep gabled roof
      {
        id: 'roof-gable-steep-left',
        name: 'Steep Left Gable',
        type: 'roof',
        geometry: {
          type: 'box',
          args: [4, 2.5, 6.2],
          position: [-2, 4.25, 0],
          rotation: [0, 0, 0.39269908169872414],
        },
      },
      {
        id: 'roof-gable-steep-right',
        name: 'Steep Right Gable',
        type: 'roof',
        geometry: {
          type: 'box',
          args: [4, 2.5, 6.2],
          position: [2, 4.25, 0],
          rotation: [0, 0, -0.39269908169872414],
        },
      },
      // Small traditional windows
      {
        id: 'window-front-rustic',
        name: 'Rustic Front Window',
        type: 'window',
        geometry: { type: 'box', args: [1.2, 1.5, 0.1], position: [0, 2.2, 3.05] },
      },
      {
        id: 'window-side-rustic-left',
        name: 'Rustic Left Window',
        type: 'window',
        geometry: { type: 'box', args: [0.1, 1.5, 1.2], position: [-4.05, 2.2, 1] },
      },
      {
        id: 'window-side-rustic-right',
        name: 'Rustic Right Window',
        type: 'window',
        geometry: { type: 'box', args: [0.1, 1.5, 1.2], position: [4.05, 2.2, 1] },
      },
      // Rustic door
      {
        id: 'door-main-rustic',
        name: 'Rustic Door',
        type: 'door',
        geometry: { type: 'box', args: [0.8, 2, 0.1], position: [0, 1, 3.05] },
      },
      // Rustic trim - weathered
      {
        id: 'trim-rustic-fascia',
        name: 'Rustic Fascia',
        type: 'trim',
        geometry: { type: 'box', args: [8.2, 0.15, 6.2], position: [0, 3.1, 0] },
      },
      {
        id: 'trim-rustic-corners',
        name: 'Rustic Corner Trim',
        type: 'trim',
        geometry: { type: 'box', args: [0.2, 3, 0.2], position: [-4.1, 1.5, -3.1] },
      },
    ],
  },
  'industrial-modern': {
    name: 'Industrial Modern',
    description: 'Raw concrete, exposed steel, and minimalist design',
    sections: [
      // Main structure - industrial proportions
      {
        id: 'main-structure',
        name: 'Main Structure',
        type: 'wall',
        geometry: { type: 'box', args: [16, 5, 8], position: [0, 2.5, 0] },
      },
      // Flat industrial roof
      {
        id: 'roof-industrial-flat',
        name: 'Industrial Flat Roof',
        type: 'roof',
        geometry: { type: 'box', args: [16.2, 0.1, 8.2], position: [0, 5.05, 0] },
      },
      // Large industrial windows
      {
        id: 'window-front-industrial',
        name: 'Industrial Front Window',
        type: 'window',
        geometry: { type: 'box', args: [8, 4, 0.1], position: [0, 2.5, 4.05] },
      },
      {
        id: 'window-side-industrial-left',
        name: 'Industrial Left Window',
        type: 'window',
        geometry: { type: 'box', args: [0.1, 4, 6], position: [-8.05, 2.5, 0] },
      },
      {
        id: 'window-side-industrial-right',
        name: 'Industrial Right Window',
        type: 'window',
        geometry: { type: 'box', args: [0.1, 4, 6], position: [8.05, 2.5, 0] },
      },
      // Industrial door - large sliding
      {
        id: 'door-main-industrial',
        name: 'Industrial Door',
        type: 'door',
        geometry: { type: 'box', args: [3, 4, 0.1], position: [4, 2, 4.05] },
      },
      // Industrial trim - steel beams
      {
        id: 'trim-industrial-beam-1',
        name: 'Steel Beam 1',
        type: 'trim',
        geometry: { type: 'box', args: [16.4, 0.2, 0.2], position: [0, 5.1, 0] },
      },
      {
        id: 'trim-industrial-beam-2',
        name: 'Steel Beam 2',
        type: 'trim',
        geometry: { type: 'box', args: [0.2, 0.2, 8.4], position: [0, 5.1, 0] },
      },
      {
        id: 'trim-industrial-corners',
        name: 'Steel Corner Trim',
        type: 'trim',
        geometry: { type: 'box', args: [0.2, 5, 0.2], position: [-8.1, 2.5, -4.1] },
      },
    ],
  },
}

export function House3DRenderer({
  housePlan,
  selectedMaterials = [],
  onSectionClick,
}: House3DRendererProps) {
  // Add error boundary for WebGL issues
  const [hasError, setHasError] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)

  // Check WebGL support on mount
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      console.warn('WebGL not supported, falling back to basic rendering')
      setWebglSupported(false)
    }
  }, [])

  // Get house plan data
  const currentHousePlan = useMemo(() => {
    if (housePlan) return housePlan
    return getHousePlanById('default-house')
  }, [housePlan])

  // Get materials for each section
  const materialsMap = useMemo(() => {
    const map: Record<string, any> = {}

    if (selectedMaterials) {
      if (Array.isArray(selectedMaterials)) {
        // Handle array format
        selectedMaterials.forEach((material) => {
          if (material && material.sectionId) {
            map[material.sectionId] = material
          }
        })
      } else if (typeof selectedMaterials === 'object') {
        // Handle object format (Record<string, MaterialSelection>)
        Object.entries(selectedMaterials).forEach(([key, material]) => {
          if (material && typeof material === 'object') {
            map[key] = material
          }
        })
      }
    }

    return map
  }, [selectedMaterials])

  // Get the geometry configuration from the house plan
  const houseGeometry = useMemo(() => {
    if (!currentHousePlan) return HOUSE_GEOMETRIES['modern-minimalist']

    return {
      name: currentHousePlan.name,
      description: currentHousePlan.description,
      sections: currentHousePlan.geometry?.sections || [],
    }
  }, [currentHousePlan])

  // Material mapping system
  const getMaterialForSection = useMemo(() => {
    return (sectionId: string, sectionType: string): MaterialSelection | null => {
      // First check if user has selected a material for this section
      if (materialsMap[sectionId]) {
        return materialsMap[sectionId]
      }

      // Fall back to house plan facade materials
      if (currentHousePlan?.facadeOptions?.hyatt?.materials) {
        const facadeMaterial = currentHousePlan.facadeOptions.hyatt.materials[sectionType]
        if (facadeMaterial) {
          // Return a basic material selection based on facade
          return {
            id: facadeMaterial,
            name: facadeMaterial
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (l: string) => l.toUpperCase()),
            color: getDefaultColorForType(sectionType),
            roughness: getDefaultRoughnessForType(sectionType),
            metalness: getDefaultMetalnessForType(sectionType),
            reflection: 0.1,
            cost: 0,
            properties: {
              finish: 'standard',
              texture: 'smooth',
              durability: 'high',
              maintenance: 'low',
              fire_rating: 'standard',
              insulation: 'standard',
              description: 'Standard facade material',
            },
          }
        }
      }

      return null
    }
  }, [materialsMap, currentHousePlan])

  // Helper function to safely get material properties
  const getMaterialProperty = (
    material: MaterialSelection | null,
    property: string,
    defaultValue: string | number
  ) => {
    if (!material) return defaultValue
    return (material as unknown as Record<string, string | number>)[property] ?? defaultValue
  }

  // Generate section configurations based on house geometry and materials
  const sectionConfigs = useMemo((): SectionConfig[] => {
    const configs: SectionConfig[] = []

    // Convert house geometry sections to SectionConfig
    houseGeometry.sections.forEach(
      (section: {
        id: string
        type: string
        name: any
        geometry: { type: string; args: any; position: [number, number, number] }
      }) => {
        const material = getMaterialForSection(section.id, section.type)

        configs.push({
          id: section.id,
          name: section.name,
          type: section.type,
          geometry: {
            type: section.geometry.type as 'box' | 'cone' | 'cylinder' | 'plane',
            args: section.geometry.args,
            position: section.geometry.position as [number, number, number],
            rotation: (section.geometry as any).rotation as [number, number, number] | undefined,
            scale: (section.geometry as any).scale as [number, number, number] | undefined,
          },
          material: {
            color: getMaterialProperty(
              material,
              'color',
              getDefaultColorForType(section.type)
            ) as string,
            roughness: getMaterialProperty(
              material,
              'roughness',
              getDefaultRoughnessForType(section.type)
            ) as number,
            metalness: getMaterialProperty(
              material,
              'metalness',
              getDefaultMetalnessForType(section.type)
            ) as number,
            castShadow: true,
            receiveShadow: section.type === 'wall' || section.type === 'floor',
          },
        })
      }
    )

    // Add ground plane
    configs.push({
      id: 'ground-plane',
      name: 'Ground',
      type: 'floor',
      geometry: {
        type: 'plane',
        args: [50, 50],
        position: [0, 0, 0],
        rotation: [-1.5707963267948966, 0, 0],
      },
      material: {
        color: '#90EE90',
        roughness: 0.9,
        metalness: 0.0,
        receiveShadow: true,
      },
    })

    return configs
  }, [houseGeometry, getMaterialForSection])

  // Helper functions for default material properties
  function getDefaultColorForType(type: string): string {
    const defaults = {
      wall: '#F8F8F8',
      roof: '#B87333',
      window: '#87CEEB',
      door: '#8B4513',
      trim: '#FFFFFF',
      floor: '#8B4513',
    }
    return defaults[type as keyof typeof defaults] || '#CCCCCC'
  }

  function getDefaultRoughnessForType(type: string): number {
    const defaults = {
      wall: 0.8,
      roof: 0.3,
      window: 0.1,
      door: 0.6,
      trim: 0.9,
      floor: 0.8,
    }
    return defaults[type as keyof typeof defaults] || 0.5
  }

  function getDefaultMetalnessForType(type: string): number {
    const defaults = {
      wall: 0.0,
      roof: 0.9,
      window: 0.8,
      door: 0.0,
      trim: 0.0,
      floor: 0.0,
    }
    return defaults[type as keyof typeof defaults] || 0.0
  }

  // Render individual section component
  const renderSection = (config: SectionConfig) => {
    try {
      const handleClick = () => {
        if (onSectionClick) {
          onSectionClick(config.id)
        }
      }

      const materialProps: any = {
        color: config.material.color,
        roughness: config.material.roughness,
        metalness: config.material.metalness,
      }

      // Add texture if available
      const sectionMaterial = getMaterialForSection(config.id, config.type)
      if (sectionMaterial?.textureUrl) {
        try {
          const textureLoader = new TextureLoader()
          const texture = textureLoader.load(sectionMaterial.textureUrl)
          materialProps.map = texture
        } catch (error) {
          console.warn('Failed to load texture:', sectionMaterial.textureUrl, error)
          // Continue without texture
        }
      }

      return (
        <mesh
          key={config.id}
          position={config.geometry.position}
          rotation={config.geometry.rotation}
          scale={config.geometry.scale}
          castShadow={config.material.castShadow}
          receiveShadow={config.material.receiveShadow}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default'
          }}
        >
          {config.geometry.type === 'box' && (
            <boxGeometry args={config.geometry.args as [number, number, number]} />
          )}
          {config.geometry.type === 'cone' && (
            <coneGeometry args={config.geometry.args as [number, number, number]} />
          )}
          {config.geometry.type === 'cylinder' && (
            <cylinderGeometry args={config.geometry.args as [number, number, number]} />
          )}
          {config.geometry.type === 'plane' && (
            <planeGeometry args={config.geometry.args as [number, number, number, number]} />
          )}
          <meshStandardMaterial {...materialProps} />
        </mesh>
      )
    } catch (error) {
      console.error('Error rendering section:', config.id, error)
      setHasError(true)
      return null
    }
  }

  // If WebGL is not supported, show fallback
  if (!webglSupported) {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[6, 4, 4]} />
          <meshBasicMaterial color="#e5e7eb" />
        </mesh>
        <mesh position={[0, 4, 0]}>
          <coneGeometry args={[3, 2, 8]} />
          <meshBasicMaterial color="#4b5563" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="#90EE90" />
        </mesh>
      </group>
    )
  }

  // If there's a WebGL error, show fallback
  if (hasError) {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[4, 4, 4]} />
          <meshBasicMaterial color="#ff6b6b" />
        </mesh>
        <mesh position={[0, 4, 0]}>
          <coneGeometry args={[2, 2, 8]} />
          <meshBasicMaterial color="#4ecdc4" />
        </mesh>
      </group>
    )
  }

  // If no sections are available, show default house
  if (sectionConfigs.length === 0) {
    return <DefaultHouse />
  }

  return <group position={[0, 0, 0]}>{sectionConfigs.map(renderSection)}</group>
}

// Default House when no model is loaded
export function DefaultHouse() {
  return (
    <group position={[0, 1, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[6, 2.5, 4]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[3.5, 1.5, 4]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
    </group>
  )
}
