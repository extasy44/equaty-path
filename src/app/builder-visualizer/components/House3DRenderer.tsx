/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState, useEffect } from 'react'
import type { MaterialSelection } from '../types'
import { MeshStandardMaterial } from 'three'
import { useGLTF } from '@react-three/drei'

// Utility function to preload GLB models
export function preloadGLBModel(modelPath: string) {
  useGLTF.preload(modelPath)
}

interface House3DRendererProps {
  modelPath?: string
  selectedMaterials?: MaterialSelection[] | Record<string, MaterialSelection>
  viewMode?: '3d' | 'preview'
  showWireframe?: boolean
  showShadows?: boolean
  showGrid?: boolean
  onSectionClick?: (sectionId: string) => void
  onModelLoad?: (model: any) => void
  onModelError?: (error: Error) => void
}

export function House3DRenderer({
  modelPath = '/models/double-storey.glb',
  selectedMaterials = [],
  onSectionClick,
  onModelLoad,
  onModelError,
}: House3DRendererProps) {
  // Check WebGL support and handle context loss
  useEffect(() => {
    // WebGL support check is handled by the Canvas component
  }, [])

  // Always show GLB house model as the primary renderer
  return (
    <GLBHouse
      modelPath={modelPath}
      selectedMaterials={selectedMaterials}
      onSectionClick={onSectionClick}
      onModelLoad={onModelLoad}
      onModelError={onModelError}
    />
  )
}

// GLB Model Component
function GLBHouse({
  modelPath,
  selectedMaterials,
  onSectionClick,
  onModelLoad,
  onModelError,
}: {
  modelPath: string
  selectedMaterials?: MaterialSelection[] | Record<string, MaterialSelection>
  onSectionClick?: (sectionId: string) => void
  onModelLoad?: (model: any) => void
  onModelError?: (error: Error) => void
}) {
  const [modelError, setModelError] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(true)

  // Always call hooks at the top level
  const { scene } = useGLTF(modelPath)

  // Handle model loading errors with try-catch
  useEffect(() => {
    try {
      if (scene) {
        setIsModelLoading(false)
        setModelError(false)
        if (onModelLoad) {
          onModelLoad(scene)
        }
      }
    } catch (error) {
      console.error('Error loading GLB model:', error)
      setModelError(true)
      setIsModelLoading(false)
      if (onModelError) {
        onModelError(error as Error)
      }
    }
  }, [scene, onModelLoad, onModelError])

  // Clone the scene to avoid conflicts
  const clonedScene = useMemo(() => {
    if (!scene || modelError) return null
    try {
      return scene.clone()
    } catch (error) {
      console.error('Error cloning scene:', error)
      setModelError(true)
      if (onModelError) {
        onModelError(error as Error)
      }
      return null
    }
  }, [scene, modelError, onModelError])

  // Apply materials to the model
  useEffect(() => {
    if (!selectedMaterials || !clonedScene) return

    const materialsMap: Record<string, any> = {}

    // Process selected materials
    if (Array.isArray(selectedMaterials)) {
      selectedMaterials.forEach((material) => {
        if (material && material.sectionId) {
          materialsMap[material.sectionId] = material
        }
      })
    } else if (typeof selectedMaterials === 'object') {
      Object.entries(selectedMaterials).forEach(([key, material]) => {
        if (material && typeof material === 'object') {
          materialsMap[key] = material
        }
      })
    }

    // Apply materials to mesh objects and make them clickable
    let meshIndex = 0
    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        // Generate a unique section ID if the mesh doesn't have a name
        const sectionId = child.name || `mesh-${meshIndex++}`

        // Make the mesh clickable
        child.userData = {
          sectionId: sectionId,
          isClickable: true,
          meshName: child.name || `Mesh ${meshIndex}`,
        }

        // Apply material if available
        const material = materialsMap[sectionId] || materialsMap['default-section']
        if (material) {
          child.material = new MeshStandardMaterial({
            color: material.color || '#e5e7eb',
            roughness: material.roughness || 0.7,
            metalness: material.metalness || 0.1,
          })
        }

        // Enable shadows and make sure the mesh is interactive
        child.castShadow = true
        child.receiveShadow = true

        // Ensure the mesh can receive pointer events
        child.userData.originalMaterial = child.material

        console.log('Mesh prepared for interaction:', {
          name: child.name,
          sectionId: sectionId,
          position: child.position,
          userData: child.userData,
        })
      }
    })
  }, [clonedScene, selectedMaterials])

  // Handle clicks on the model
  const handleClick = (event: any) => {
    event.stopPropagation()
    console.log('Click event received:', {
      object: event.object,
      userData: event.object.userData,
      point: event.point,
      distance: event.distance,
    })

    const sectionId = event.object.userData?.sectionId
    const meshName = event.object.userData?.meshName || event.object.name || 'Unknown'

    if (sectionId && onSectionClick) {
      console.log('Triggering section click for:', sectionId, 'mesh:', meshName)
      onSectionClick(sectionId)
    } else {
      console.warn('No section ID found or onSectionClick not provided:', {
        sectionId,
        userData: event.object.userData,
        onSectionClick: !!onSectionClick,
      })
    }
  }

  // Show loading state while model is loading
  if (isModelLoading) {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[4, 4, 4]} />
          <meshBasicMaterial color="#e5e7eb" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="#90EE90" />
        </mesh>
      </group>
    )
  }

  // Handle pointer over for hover effects
  const handlePointerOver = (event: any) => {
    event.stopPropagation()
    document.body.style.cursor = 'pointer'

    // Add hover effect to the mesh
    if (event.object.userData?.isClickable) {
      const originalMaterial = event.object.userData.originalMaterial
      if (originalMaterial) {
        // Create a slightly brighter version for hover - only copy compatible properties
        event.object.material = new MeshStandardMaterial({
          color: originalMaterial.color.clone().multiplyScalar(1.2),
          map: originalMaterial.map,
          normalMap: originalMaterial.normalMap,
          roughness: originalMaterial.roughness,
          metalness: originalMaterial.metalness,
          transparent: originalMaterial.transparent,
          opacity: originalMaterial.opacity,
        })
      }
    }
  }

  // Handle pointer out to remove hover effects
  const handlePointerOut = (event: any) => {
    event.stopPropagation()
    document.body.style.cursor = 'auto'

    // Restore original material
    if (event.object.userData?.isClickable) {
      const originalMaterial = event.object.userData.originalMaterial
      if (originalMaterial) {
        event.object.material = originalMaterial
      }
    }
  }

  return (
    <primitive
      object={clonedScene!}
      position={[0, 0, 0]}
      scale={[1, 1, 1]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  )
}
