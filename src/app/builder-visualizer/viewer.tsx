'use client'

import EnhancedBuilderViewer from './enhanced-viewer'

interface BuilderClientProps {
  onExitFullscreen?: () => void
  defaultFullscreen?: boolean
  previewMode?: boolean
}

export default function BuilderClient({
  onExitFullscreen,
  defaultFullscreen,
  previewMode,
}: BuilderClientProps) {
  return (
    <EnhancedBuilderViewer
      onExitFullscreen={onExitFullscreen}
      defaultFullscreen={defaultFullscreen}
      previewMode={previewMode}
    />
  )
}
