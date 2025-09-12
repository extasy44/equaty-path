import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { AIAssistant } from './AIAssistant'
import { type HousePlan, type MaterialSelection } from '../data'

interface AIAssistantDrawerProps {
  isOpen: boolean
  onClose: () => void
  housePlan: HousePlan | null
  selectedMaterials: Record<string, MaterialSelection>
  generateAIPrompt: (
    plan: HousePlan,
    facade: string,
    materials: Record<string, MaterialSelection>
  ) => string
}

export function AIAssistantDrawer({
  isOpen,
  onClose,
  housePlan,
  selectedMaterials,
  generateAIPrompt,
}: AIAssistantDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl h-full bg-white border-l border-gray-200 z-50">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <AIAssistant
            onModelGenerated={() => {}}
            isCollapsed={false}
            onToggleCollapse={() => {}}
            housePlan={housePlan}
            selectedMaterials={selectedMaterials}
            generateAIPrompt={generateAIPrompt}
          />
        </div>
      </div>
    </div>
  )
}
