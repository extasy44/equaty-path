import { useState, useCallback } from 'react'
import { type MaterialSelection, type HousePlan } from '../data'

export interface ViewerState {
  // Core state
  selectedPreset: string
  selectedFacade: string
  selectedMaterials: Record<string, MaterialSelection>
  viewMode: '3d' | 'preview'
  isFullscreenMode: boolean
  currentHousePlan: HousePlan | null

  // View controls
  showWireframe: boolean
  showShadows: boolean
  showGrid: boolean

  // Modal states
  isOptionsModalOpen: boolean
  isAIModalOpen: boolean
  isRenderGalleryModalOpen: boolean

  // Preview mode
  previewMode: boolean
}

export function useViewerState(initialPreset = 'astoria-grand-55') {
  // Core state
  const [selectedPreset, setSelectedPreset] = useState(initialPreset)
  const [selectedFacade, setSelectedFacade] = useState('hyatt')
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, MaterialSelection>>({})
  const [viewMode, setViewMode] = useState<'3d' | 'preview'>('3d')
  const [isFullscreenMode, setIsFullscreenMode] = useState(false)
  const [currentHousePlan, setCurrentHousePlan] = useState<HousePlan | null>(null)

  // View controls
  const [showWireframe, setShowWireframe] = useState(false)
  const [showShadows, setShowShadows] = useState(true)
  const [showGrid, setShowGrid] = useState(false)

  // Modal states
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [isRenderGalleryModalOpen, setIsRenderGalleryModalOpen] = useState(false)

  // Preview mode
  const [previewMode, setPreviewMode] = useState(false)

  // Material selection handler
  const handleMaterialSelect = useCallback((material: MaterialSelection, category: string) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [category]: material,
    }))
  }, [])

  // Facade selection handler
  const handleFacadeSelect = useCallback((planId: string, facadeId: string) => {
    setSelectedPreset(planId)
    setSelectedFacade(facadeId)
  }, [])

  // View mode handler
  const handleViewModeChange = useCallback((mode: '3d' | 'preview') => {
    setViewMode(mode)
  }, [])

  // View control handlers
  const toggleWireframe = useCallback(() => setShowWireframe((prev) => !prev), [])
  const toggleShadows = useCallback(() => setShowShadows((prev) => !prev), [])
  const toggleGrid = useCallback(() => setShowGrid((prev) => !prev), [])

  // Modal handlers
  const openOptionsModal = useCallback(() => setIsOptionsModalOpen(true), [])
  const closeOptionsModal = useCallback(() => setIsOptionsModalOpen(false), [])
  const openAIModal = useCallback(() => setIsAIModalOpen(true), [])
  const closeAIModal = useCallback(() => setIsAIModalOpen(false), [])
  const openGalleryModal = useCallback(() => setIsRenderGalleryModalOpen(true), [])
  const closeGalleryModal = useCallback(() => setIsRenderGalleryModalOpen(false), [])

  return {
    // State
    state: {
      selectedPreset,
      selectedFacade,
      selectedMaterials,
      viewMode,
      isFullscreenMode,
      currentHousePlan,
      showWireframe,
      showShadows,
      showGrid,
      isOptionsModalOpen,
      isAIModalOpen,
      isRenderGalleryModalOpen,
      previewMode,
    },

    // State setters
    setSelectedPreset,
    setSelectedFacade,
    setCurrentHousePlan,

    // Handlers
    handleMaterialSelect,
    handleFacadeSelect,
    handleViewModeChange,
    toggleWireframe,
    toggleShadows,
    toggleGrid,
    openOptionsModal,
    closeOptionsModal,
    openAIModal,
    closeAIModal,
    openGalleryModal,
    closeGalleryModal,
    setPreviewMode,
    setIsFullscreenMode,
  }
}
