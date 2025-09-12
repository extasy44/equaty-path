import { Record } from '../types'

interface ViewerStatusBarProps {
  planName: string
  builderName: string
  facadeName: string
  selectedMaterialsCount: number
  totalCost: number
  viewMode: string
  isGenerating: boolean
  isEnhancing: boolean
}

export function ViewerStatusBar({
  planName,
  builderName,
  facadeName,
  selectedMaterialsCount,
  totalCost,
  viewMode,
  isGenerating,
  isEnhancing,
}: ViewerStatusBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-200">
      <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>Plan: {planName}</span>
          <span>Builder: {builderName}</span>
          <span>Facade: {facadeName}</span>
          <span>Materials: {selectedMaterialsCount} selected</span>
          <span>Total Cost: ${totalCost.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>View: {viewMode.toUpperCase()}</span>
          {isGenerating && <span className="text-blue-600">Generating...</span>}
          {isEnhancing && <span className="text-purple-600">Enhancing...</span>}
        </div>
      </div>
    </div>
  )
}
