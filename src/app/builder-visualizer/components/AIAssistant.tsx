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
import { Wand2, Loader2, Sparkles, Home, DollarSign, Palette, X } from 'lucide-react'
import { useAIHouseGenerator } from '../services/ai-house-generator'
import type { Model3D } from '../types'

interface AIAssistantProps {
  className?: string
  onModelGenerated?: (model: unknown) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function AIAssistant({
  className,
  onModelGenerated,
  isCollapsed = false,
  onToggleCollapse,
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
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 20, 90))
      }, 200)

      const result = await generateHouse({
        prompt: aiPrompt,
        materials: {}, // Empty materials object for AI generation
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

  return (
    <Card className={`w-80 bg-white/95 backdrop-blur-sm border shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Beta
            </Badge>
            {onToggleCollapse && (
              <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="ai-prompt" className="text-sm font-medium">
            Describe your dream house
          </Label>
          <div className="relative">
            <Input
              id="ai-prompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., Modern two-story home with large windows and a metal roof..."
              className="pr-10"
              maxLength={500}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              {aiPrompt.length}/500
            </div>
          </div>
        </div>

        {/* Style and Budget Selection */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Palette className="h-3 w-3" />
              Style
            </Label>
            <Select
              value={aiStyle}
              onValueChange={(value: 'modern' | 'traditional' | 'contemporary' | 'minimalist') =>
                setAiStyle(value)
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
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
            <Label className="text-sm font-medium flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Budget
            </Label>
            <Select
              value={aiBudget}
              onValueChange={(value: 'low' | 'medium' | 'high' | 'premium') => setAiBudget(value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {budgetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
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
          disabled={isGenerating || !aiPrompt.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate House
            </>
          )}
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
          <div className="text-sm font-medium text-muted-foreground">Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnhance}
              disabled={isGenerating}
              className="text-xs"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Enhance
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVariations}
              disabled={isGenerating}
              className="text-xs"
            >
              <Home className="mr-1 h-3 w-3" />
              Variations
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
          <strong>💡 Tip:</strong> Be specific about architectural style, key features, and
          materials for best results.
        </div>
      </CardContent>
    </Card>
  )
}
