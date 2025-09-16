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
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-300">
        <div className="flex items-center gap-4">
          <span>
            Plan: <span className="text-white font-medium">{planName}</span>
          </span>
          <span>
            Builder: <span className="text-white font-medium">{builderName}</span>
          </span>
          <span>
            Facade: <span className="text-white font-medium">{facadeName}</span>
          </span>
          <span>
            Materials:{' '}
            <span className="text-white font-medium">{selectedMaterialsCount} selected</span>
          </span>
          <span>
            Total Cost:{' '}
            <span className="text-green-400 font-medium">${totalCost.toLocaleString()}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>
            View: <span className="text-white font-medium">{viewMode.toUpperCase()}</span>
          </span>
          {isGenerating && <span className="text-blue-400 font-medium">Generating...</span>}
          {isEnhancing && <span className="text-purple-400 font-medium">Enhancing...</span>}
        </div>
      </div>
    </div>
  )
}
