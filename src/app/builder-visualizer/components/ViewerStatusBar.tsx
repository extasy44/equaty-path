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
    <div className="absolute bottom-0 left-0 right-0 z-30">
      <div className="mx-2 mb-2 rounded-xl bg-gray-900/85 backdrop-blur-md border border-gray-700/70 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-2 text-[12px] sm:text-sm text-gray-300 gap-1.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              Plan: <span className="text-white font-medium">{planName}</span>
            </span>
            <span className="hidden sm:inline">
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
              Total:{' '}
              <span className="text-green-400 font-semibold">${totalCost.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              View: <span className="text-white font-medium">{viewMode.toUpperCase()}</span>
            </span>
            {isGenerating && <span className="text-blue-400 font-medium">Generating…</span>}
            {isEnhancing && <span className="text-purple-400 font-medium">Enhancing…</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
