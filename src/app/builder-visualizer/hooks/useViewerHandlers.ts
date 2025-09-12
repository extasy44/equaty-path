import { useCallback } from 'react'
import { type Model3D } from '../types'

interface UseViewerHandlersProps {
  onExit?: () => void
}

export function useViewerHandlers({ onExit }: UseViewerHandlersProps) {
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

  return {
    handleExitToWeb,
    handleModelGenerated,
  }
}
