'use client'

import { useMemo } from 'react'
import { getDefaultHouse, getHousePreset } from '../data'
import type { MaterialSelection, Material } from '../types'
import type { HousePreset } from './PresetSelector'

interface House3DRendererProps {
  materials: Record<string, MaterialSelection>
  viewMode: 'exterior' | 'interior'
  selectedPreset?: string
  onSectionClick?: (sectionId: string, sectionName: string, event: React.MouseEvent) => void
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
  }
  material: {
    color: string
    roughness: number
    metalness: number
    castShadow?: boolean
    receiveShadow?: boolean
  }
}

export function House3DRenderer({
  materials,
  viewMode,
  selectedPreset = 'luxury-contemporary',
  onSectionClick,
}: House3DRendererProps) {
  // Get house preset data based on selection
  const housePreset = useMemo(() => {
    try {
      return getHousePreset(selectedPreset) || getDefaultHouse()
    } catch {
      return getDefaultHouse()
    }
  }, [selectedPreset])

  // Material mapping system
  const getMaterialForSection = useMemo(() => {
    return (sectionId: string, sectionType: string): Material | MaterialSelection | null => {
      // First check if user has selected a material for this category
      if (materials[sectionType]) {
        return materials[sectionType]
      }

      // Fall back to preset material
      const section = housePreset.sections?.find((s) => s.id === sectionId)
      return section?.material || null
    }
  }, [materials, housePreset])

  // Helper function to safely get material properties
  const getMaterialProperty = (material: any, property: string, defaultValue: any) => {
    if (!material) return defaultValue
    return material[property] ?? defaultValue
  }

  // Generate section configurations based on house preset
  const sectionConfigs = useMemo((): SectionConfig[] => {
    const configs: SectionConfig[] = []

    // Wall sections
    configs.push(
      {
        id: 'wall-front',
        name: 'Front Wall',
        type: 'wall',
        geometry: {
          type: 'box',
          args: [10, 3, 0.2],
          position: [0, 1.5, 4],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('wall-front', 'walls'),
            'color',
            '#F8F8F8'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('wall-front', 'walls'),
            'roughness',
            0.3
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('wall-front', 'walls'),
            'metalness',
            0.0
          ),
          castShadow: true,
          receiveShadow: true,
        },
      },
      {
        id: 'wall-back',
        name: 'Back Wall',
        type: 'wall',
        geometry: {
          type: 'box',
          args: [10, 3, 0.2],
          position: [0, 1.5, -4],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('wall-back', 'walls'),
            'color',
            '#F5F1E8'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('wall-back', 'walls'),
            'roughness',
            0.8
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('wall-back', 'walls'),
            'metalness',
            0.0
          ),
          castShadow: true,
          receiveShadow: true,
        },
      },
      {
        id: 'wall-left',
        name: 'Left Wall',
        type: 'wall',
        geometry: {
          type: 'box',
          args: [0.2, 3, 8],
          position: [-5, 1.5, 0],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('wall-left', 'walls'),
            'color',
            '#9B2C2C'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('wall-left', 'walls'),
            'roughness',
            0.85
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('wall-left', 'walls'),
            'metalness',
            0.0
          ),
          castShadow: true,
          receiveShadow: true,
        },
      },
      {
        id: 'wall-right',
        name: 'Right Wall',
        type: 'wall',
        geometry: {
          type: 'box',
          args: [0.2, 3, 8],
          position: [5, 1.5, 0],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('wall-right', 'walls'),
            'color',
            '#F5F1E8'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('wall-right', 'walls'),
            'roughness',
            0.8
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('wall-right', 'walls'),
            'metalness',
            0.0
          ),
          castShadow: true,
          receiveShadow: true,
        },
      },
      {
        id: 'wall-interior',
        name: 'Interior Wall',
        type: 'wall',
        geometry: {
          type: 'box',
          args: [10, 2.5, 8],
          position: [0, 4, 0],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('wall-interior', 'walls'),
            'color',
            '#F5F1E8'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('wall-interior', 'walls'),
            'roughness',
            0.8
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('wall-interior', 'walls'),
            'metalness',
            0.0
          ),
          castShadow: true,
          receiveShadow: true,
        },
      }
    )

    // Roof sections
    configs.push({
      id: 'roof-main',
      name: 'Main Roof',
      type: 'roof',
      geometry: {
        type: 'cone',
        args: [6, 2, 4],
        position: [0, 6.5, 0],
      },
      material: {
        color: getMaterialProperty(getMaterialForSection('roof-main', 'roof'), 'color', '#B87333'),
        roughness: getMaterialProperty(
          getMaterialForSection('roof-main', 'roof'),
          'roughness',
          0.3
        ),
        metalness: getMaterialProperty(
          getMaterialForSection('roof-main', 'roof'),
          'metalness',
          0.9
        ),
        castShadow: true,
      },
    })

    // Floor sections
    configs.push(
      {
        id: 'floor-ground',
        name: 'Ground Floor',
        type: 'floor',
        geometry: {
          type: 'box',
          args: [14, 0.1, 8],
          position: [0, 0, 0],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('floor-ground', 'floor'),
            'color',
            '#36454F'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('floor-ground', 'floor'),
            'roughness',
            0.9
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('floor-ground', 'floor'),
            'metalness',
            0.0
          ),
          receiveShadow: true,
        },
      },
      {
        id: 'floor-first',
        name: 'First Floor',
        type: 'floor',
        geometry: {
          type: 'box',
          args: [10, 0.1, 8],
          position: [0, 3, 0],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('floor-first', 'floor'),
            'color',
            '#8B4513'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('floor-first', 'floor'),
            'roughness',
            0.8
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('floor-first', 'floor'),
            'metalness',
            0.0
          ),
          receiveShadow: true,
        },
      }
    )

    // Window sections
    configs.push(
      {
        id: 'windows-front',
        name: 'Front Windows',
        type: 'window',
        geometry: {
          type: 'box',
          args: [2, 1.5, 0.1],
          position: [2, 2.5, 4.1],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('windows-front', 'windows'),
            'color',
            '#87CEEB'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('windows-front', 'windows'),
            'roughness',
            0.1
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('windows-front', 'windows'),
            'metalness',
            0.8
          ),
          castShadow: true,
        },
      },
      {
        id: 'windows-side',
        name: 'Side Windows',
        type: 'window',
        geometry: {
          type: 'box',
          args: [2, 2, 0.1],
          position: [0, 2.5, 4.1],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('windows-front', 'windows'),
            'color',
            '#87CEEB'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('windows-front', 'windows'),
            'roughness',
            0.1
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('windows-front', 'windows'),
            'metalness',
            0.8
          ),
          castShadow: true,
        },
      }
    )

    // Door sections
    configs.push(
      {
        id: 'door-main',
        name: 'Main Door',
        type: 'door',
        geometry: {
          type: 'box',
          args: [1.5, 2.5, 0.1],
          position: [2, 0.5, 4.1],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('door-main', 'doors'),
            'color',
            '#8B4513'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('door-main', 'doors'),
            'roughness',
            0.6
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('door-main', 'doors'),
            'metalness',
            0.0
          ),
          castShadow: true,
        },
      },
      {
        id: 'door-garage',
        name: 'Garage Door',
        type: 'door',
        geometry: {
          type: 'box',
          args: [3.5, 2.5, 0.1],
          position: [-6, 0.5, 3.1],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('door-garage', 'doors'),
            'color',
            '#FFFFFF'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('door-garage', 'doors'),
            'roughness',
            0.7
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('door-garage', 'doors'),
            'metalness',
            0.0
          ),
          castShadow: true,
        },
      }
    )

    // Trim sections
    configs.push(
      {
        id: 'trim-fascia',
        name: 'Fascia Trim',
        type: 'trim',
        geometry: {
          type: 'box',
          args: [10.2, 0.2, 8.2],
          position: [0, 5.5, 0],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('trim-fascia', 'trim'),
            'color',
            '#FFFFFF'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('trim-fascia', 'trim'),
            'roughness',
            0.9
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('trim-fascia', 'trim'),
            'metalness',
            0.0
          ),
          castShadow: true,
        },
      },
      {
        id: 'trim-gutters',
        name: 'Gutters',
        type: 'trim',
        geometry: {
          type: 'box',
          args: [10.4, 0.1, 8.4],
          position: [0, 5.2, 0],
        },
        material: {
          color: getMaterialProperty(
            getMaterialForSection('trim-gutters', 'trim'),
            'color',
            '#C0C0C0'
          ),
          roughness: getMaterialProperty(
            getMaterialForSection('trim-gutters', 'trim'),
            'roughness',
            0.2
          ),
          metalness: getMaterialProperty(
            getMaterialForSection('trim-gutters', 'trim'),
            'metalness',
            0.9
          ),
          castShadow: true,
        },
      }
    )

    // Garage section
    configs.push({
      id: 'garage',
      name: 'Garage',
      type: 'wall',
      geometry: {
        type: 'box',
        args: [4, 3, 6],
        position: [-6, 1.5, 0],
      },
      material: {
        color: getMaterialProperty(
          getMaterialForSection('wall-front', 'walls'),
          'color',
          '#F8F8F8'
        ),
        roughness: getMaterialProperty(
          getMaterialForSection('wall-front', 'walls'),
          'roughness',
          0.3
        ),
        metalness: getMaterialProperty(
          getMaterialForSection('wall-front', 'walls'),
          'metalness',
          0.0
        ),
        castShadow: true,
        receiveShadow: true,
      },
    })

    return configs
  }, [getMaterialForSection])

  // Render individual section component
  const renderSection = (config: SectionConfig) => {
    const handleClick = (event: React.MouseEvent) => {
      if (onSectionClick) {
        onSectionClick(config.id, config.name, event)
      }
    }

    const materialProps = {
      color: config.material.color,
      roughness: config.material.roughness,
      metalness: config.material.metalness,
    }

    return (
      <mesh
        key={config.id}
        position={config.geometry.position}
        rotation={config.geometry.rotation}
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
  }

  // Filter sections based on view mode
  const visibleSections = useMemo(() => {
    if (viewMode === 'interior') {
      return sectionConfigs.filter(
        (section) =>
          section.type === 'floor' || (section.type === 'wall' && section.id === 'wall-interior')
      )
    }
    return sectionConfigs
  }, [sectionConfigs, viewMode])

  return <group position={[0, 0, 0]}>{visibleSections.map(renderSection)}</group>
}

// Interior View Component
export function InteriorView({ materials }: { materials: Record<string, MaterialSelection> }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Interior Walls */}
      <mesh position={[0, 1.5, 0]} receiveShadow>
        <boxGeometry args={[9.8, 3, 7.8]} />
        <meshStandardMaterial
          color={materials.walls?.color || '#ffffff'}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[9.8, 0.1, 7.8]} />
        <meshStandardMaterial
          color={materials.walls?.color || '#8b4513'}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 3, 0]} receiveShadow>
        <boxGeometry args={[9.8, 0.1, 7.8]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Interior Furniture Placeholders */}
      <mesh position={[-2, 0.4, -1]} receiveShadow>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} metalness={0.0} />
      </mesh>

      <mesh position={[2, 0.4, 1]} receiveShadow>
        <boxGeometry args={[1.5, 0.8, 0.8]} />
        <meshStandardMaterial color="#654321" roughness={0.8} metalness={0.0} />
      </mesh>
    </group>
  )
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
