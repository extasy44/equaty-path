import { useCallback } from 'react'
import { type Model3D, type MaterialSelection } from '../types'

interface UseViewerHandlersProps {
  onExit?: () => void
}

export function useViewerHandlers({ onExit }: UseViewerHandlersProps = {}) {
  // Exit to web handler with confirmation
  const handleExitToWeb = useCallback(() => {
    const confirmed = window.confirm(
      'Are you sure you want to exit the visualizer? Any unsaved changes will be lost.'
    )

    if (confirmed && onExit) {
      onExit()
    } else if (confirmed) {
      // Hide the visualizer by setting display to none
      const visualizer = document.getElementById('builder-visualizer')
      if (visualizer) {
        visualizer.style.display = 'none'
      }
    }
  }, [onExit])

  // Model generation handler
  const handleModelGenerated = useCallback((model: Model3D) => {
    // This could be extended to handle the generated model
    console.log('Model generated:', model)
  }, [])

  // House plan selection handler
  const handleHousePlanSelect = useCallback((housePlanId: string) => {
    console.log('House plan selected:', housePlanId)
    // This would typically update the current house plan
  }, [])

  // Preset selection handler
  const handlePresetSelect = useCallback((presetId: string) => {
    console.log('Preset selected:', presetId)
    // This would typically update the current preset
  }, [])

  // AI open handler
  const handleAIOpen = useCallback(() => {
    console.log('AI assistant opened')
    // This would typically open the AI assistant modal
  }, [])

  // Material apply handler
  const handleMaterialApply = useCallback((sectionId: string, materialId: string) => {
    console.log('Material applied:', { sectionId, materialId })
    // This would typically update the material for the specified section
  }, [])

  // Export handler
  const handleExport = useCallback(() => {
    console.log('Export triggered')
    // This would typically trigger the export process
  }, [])

  return {
    handleExitToWeb,
    handleModelGenerated,
    handleHousePlanSelect,
    handlePresetSelect,
    handleAIOpen,
    handleMaterialApply,
    handleExport,
  }
}
