/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState, useEffect } from 'react'
import type { MaterialSelection } from '../types'
// import { MeshStandardMaterial } from 'three'
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

  // Build a lookup map for meshes by sectionId (one-time per cloned scene)
  const sectionMeshMap = useMemo(() => {
    if (!clonedScene || modelError) return {} as Record<string, any>
    const map: Record<string, any> = {}
    let meshIndex = 0

    clonedScene.traverse((child: any) => {
      if (!child.isMesh) return

      const sectionId = child.name || `mesh-${meshIndex++}`
      child.userData = {
        ...(child.userData || {}),
        sectionId,
        isClickable: true,
        meshName: child.name || `Mesh ${meshIndex}`,
      }

      // Cache original color for cheap hover/highlight without reallocating materials
      if (!child.userData.originalColor && child.material?.color?.clone) {
        child.userData.originalColor = child.material.color.clone()
      }

      child.castShadow = true
      child.receiveShadow = true

      map[sectionId] = child

      if (process.env.NODE_ENV !== 'production') {
        console.log('Mesh prepared for interaction:', {
          name: child.name,
          sectionId,
          position: child.position,
          userData: child.userData,
        })
      }
    })

    return map
  }, [clonedScene, modelError])

  // Apply materials to the model
  useEffect(() => {
    if (!clonedScene || !selectedMaterials) return

    const materialsMap: Record<string, any> = {}

    // Normalize selected materials into a map
    if (Array.isArray(selectedMaterials)) {
      selectedMaterials.forEach((material) => {
        if (material && material.sectionId) materialsMap[material.sectionId] = material
      })
    } else if (typeof selectedMaterials === 'object') {
      Object.entries(selectedMaterials).forEach(([key, material]) => {
        if (material && typeof material === 'object') materialsMap[key] = material
      })
    }

    // Apply only to meshes that changed
    Object.entries(materialsMap).forEach(([sectionId, mat]) => {
      const mesh = (sectionMeshMap as Record<string, any>)[sectionId]
      if (!mesh) return

      const m: any = mesh.material
      if (!m) return

      if (m.color && mat.color) m.color.set(mat.color)
      if (typeof mat.roughness === 'number' && 'roughness' in m) m.roughness = mat.roughness
      if (typeof mat.metalness === 'number' && 'metalness' in m) m.metalness = mat.metalness
      m.needsUpdate = true
    })
  }, [clonedScene, selectedMaterials, sectionMeshMap])

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
      const originalColor = event.object.userData.originalColor
      const mat: any = event.object.material
      if (originalColor && mat?.color) {
        // Cheap highlight without reallocating material
        mat.color.copy(originalColor).multiplyScalar(1.15)
        mat.needsUpdate = true
      }
    }
  }

  // Handle pointer out to remove hover effects
  const handlePointerOut = (event: any) => {
    event.stopPropagation()
    document.body.style.cursor = 'auto'

    // Restore original material
    if (event.object.userData?.isClickable) {
      const originalColor = event.object.userData.originalColor
      const mat: any = event.object.material
      if (originalColor && mat?.color) {
        mat.color.copy(originalColor)
        mat.needsUpdate = true
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
