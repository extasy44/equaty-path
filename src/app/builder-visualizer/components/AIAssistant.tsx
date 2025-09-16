/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Wand2, Sparkles, Home, DollarSign, Palette, X } from 'lucide-react'
import { useAIHouseGenerator } from '../services/ai-house-generator'
import type { Model3D } from '../types'

interface AIAssistantProps {
  className?: string
  onModelGenerated?: (model: unknown) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  housePlan?: any
  selectedMaterials?: any
  generateAIPrompt?: any
}

export function AIAssistant({
  className,
  onModelGenerated,
  isCollapsed = false,
  onToggleCollapse,
  housePlan,
  selectedMaterials,
  generateAIPrompt,
}: AIAssistantProps) {
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiStyle, setAiStyle] = useState<'modern' | 'traditional' | 'contemporary' | 'minimalist'>(
    'modern'
  )
  const [aiBudget, setAiBudget] = useState<'low' | 'medium' | 'high' | 'premium'>('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const { generateHouse, enhanceRender, generateVariations } = useAIHouseGenerator()

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a description for your house')
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setError(null)

    try {
      // Use the provided generateAIPrompt function if available
      const prompt =
        generateAIPrompt && housePlan && selectedMaterials
          ? generateAIPrompt(housePlan, 'hyatt', selectedMaterials)
          : aiPrompt

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 20, 90))
      }, 200)

      const result = await generateHouse({
        prompt: prompt,
        materials: selectedMaterials || {},
        style: aiStyle,
        budget: aiBudget,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (result?.success && result?.model) {
        onModelGenerated?.(result.model)
        setAiPrompt('') // Clear prompt after successful generation
      } else {
        setError(result?.error || 'Failed to generate house')
      }
    } catch (err) {
      setError('An error occurred while generating the house')
      console.error('AI Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEnhance = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await enhanceRender('default-model', 'Front View')
      if (result?.success) {
        // Handle enhancement success
      } else {
        setError(result?.error || 'Failed to enhance render')
      }
    } catch {
      setError('An error occurred while enhancing the render')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVariations = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateVariations({} as Model3D, 3)
      if (result?.success) {
        // Handle variations success
      } else {
        setError(result?.error || 'Failed to generate variations')
      }
    } catch {
      setError('An error occurred while generating variations')
    } finally {
      setIsGenerating(false)
    }
  }

  const styleOptions = [
    { value: 'modern', label: 'Modern', icon: '🏢' },
    { value: 'traditional', label: 'Traditional', icon: '🏠' },
    { value: 'contemporary', label: 'Contemporary', icon: '🏘️' },
    { value: 'minimalist', label: 'Minimalist', icon: '📐' },
  ]

  const budgetOptions = [
    { value: 'low', label: 'Budget', icon: '💰' },
    { value: 'medium', label: 'Standard', icon: '💎' },
    { value: 'high', label: 'Premium', icon: '👑' },
    { value: 'premium', label: 'Luxury', icon: '💍' },
  ]

  if (isCollapsed) {
    return (
      <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 ${className}`}>
        <Button
          onClick={onToggleCollapse}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  // Show current house plan info if available
  const currentPlanInfo = housePlan ? (
    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-2">
        <Home className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">Current House Plan</span>
      </div>
      <p className="text-sm text-blue-800">{housePlan.name}</p>
      <p className="text-xs text-blue-600">
        {housePlan.builder} • {housePlan.facade} Facade
      </p>
    </div>
  ) : null

  // Show selected materials info if available
  const materialsInfo =
    selectedMaterials && Object.keys(selectedMaterials).length > 0 ? (
      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">Selected Materials</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {Object.entries(selectedMaterials).map(([category, material]) => {
            const materialData = material as { name?: string }
            return (
              <Badge
                key={category}
                variant="outline"
                className="text-xs bg-white border-green-300 text-green-700"
              >
                {category}: {materialData?.name || 'Unknown'}
              </Badge>
            )
          })}
        </div>
      </div>
    ) : null

  return (
    <div
      className={`w-full bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-xl ring-1 ring-gray-200/60 backdrop-blur-sm ${className}`}
    >
      {/* Current Plan & Materials Info */}
      {currentPlanInfo}
      {materialsInfo}

      <Card className="w-full bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg ring-1 ring-gray-200/60 backdrop-blur-sm">
        <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              <Sparkles className="h-5 w-5 text-blue-500" />
              AI Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 shadow-sm"
              >
                Under Development
              </Badge>
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 bg-white text-gray-800">
          {/* Development Notice */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-orange-800">
                Feature Under Development
              </span>
            </div>
            <p className="text-sm text-orange-700">
              Our AI Assistant is being built to help you generate custom house designs. This
              feature will be available soon with advanced AI capabilities.
            </p>
          </div>

          {/* AI Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="ai-prompt" className="text-sm font-medium text-gray-700">
              Describe your dream house
            </Label>
            <div className="relative">
              <Input
                id="ai-prompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Modern two-story home with large windows and a metal roof..."
                className="pr-10 h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                maxLength={500}
                disabled
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {aiPrompt.length}/500
              </div>
            </div>
          </div>

          {/* Style and Budget Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1 text-gray-700">
                <Palette className="h-3 w-3" />
                Style
              </Label>
              <Select
                value={aiStyle}
                onValueChange={(value: 'modern' | 'traditional' | 'contemporary' | 'minimalist') =>
                  setAiStyle(value)
                }
                disabled
              >
                <SelectTrigger className="h-9 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm hover:shadow-md transition-all duration-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 shadow-xl">
                  {styleOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-sm hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1 text-gray-700">
                <DollarSign className="h-3 w-3" />
                Budget
              </Label>
              <Select
                value={aiBudget}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'premium') => setAiBudget(value)}
                disabled
              >
                <SelectTrigger className="h-9 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm hover:shadow-md transition-all duration-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 shadow-xl">
                  {budgetOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-sm hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={true}
            className="w-full bg-gray-400 text-white cursor-not-allowed"
            title="AI Assistant coming soon"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Generate House (Coming Soon)
          </Button>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating your house...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-sm text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEnhance}
                disabled={true}
                className="text-xs border-gray-300 text-gray-400 cursor-not-allowed"
                title="Enhance feature coming soon"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Enhance
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleVariations}
                disabled={true}
                className="text-xs border-gray-300 text-gray-400 cursor-not-allowed"
                title="Variations feature coming soon"
              >
                <Home className="mr-1 h-3 w-3" />
                Variations
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="text-xs text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
            <strong>💡 Tip:</strong> Be specific about architectural style, key features, and
            materials for best results. This feature will be available soon!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
