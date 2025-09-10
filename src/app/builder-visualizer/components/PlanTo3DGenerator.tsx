'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileImage, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { planTo3DGenerator } from '../services/plan-to-3d-generator'
import { uploadConstraints, statusMessages } from '../config/services'
import { formatFileSize, formatProcessingTime } from '../utils'
import type { PlanTo3DResponse, Model3D } from '../types'

interface PlanTo3DGeneratorProps {
  onModelGenerated: (model: Model3D) => void
  aiProvider?: 'ollama'
  className?: string
}

export function PlanTo3DGenerator({
  onModelGenerated,
  aiProvider,
  className,
}: PlanTo3DGeneratorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStatus, setCurrentStatus] = useState('')
  const [response, setResponse] = useState<PlanTo3DResponse | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    // Validate file
    if (!file.type || !uploadConstraints.allowedTypes.includes(file.type)) {
      alert(`Unsupported file type. Please upload: ${uploadConstraints.allowedTypes.join(', ')}`)
      return
    }

    if (file.size > uploadConstraints.maxFileSize) {
      alert(`File size too large. Maximum size: ${formatFileSize(uploadConstraints.maxFileSize)}`)
      return
    }

    setSelectedFile(file)
    setResponse(null) // Clear previous results
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect]
  )

  const generate3DModel = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)
    setCurrentStatus(statusMessages.analyzing)
    setResponse(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 500)

      const result = await planTo3DGenerator.generate3DModel(selectedFile, {
        scale: 1,
        quality: 'high',
        includeMetadata: true,
        aiProvider: aiProvider || 'ollama',
      })

      clearInterval(progressInterval)
      setProgress(100)
      setCurrentStatus(statusMessages.complete)
      setResponse(result)

      if (result.success) {
        onModelGenerated(result.model)
      }
    } catch (error) {
      console.error('Error generating 3D model:', error)
      setCurrentStatus('Error occurred during processing')
      setResponse({
        success: false,
        model: {} as Model3D,
        analysis: {} as any,
        message: 'Failed to generate 3D model',
        processingTime: 0,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    setSelectedFile(null)
    setResponse(null)
    setProgress(0)
    setCurrentStatus('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">📐 2D to 3D Generator</CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a floor plan image to generate a 3D model
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={uploadConstraints.allowedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-2">
              <FileImage className="mx-auto h-8 w-8 text-primary" />
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Choose Different File
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="font-medium">Drop your floor plan here</p>
              <p className="text-sm text-muted-foreground">
                or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  browse files
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: {uploadConstraints.allowedTypes.join(', ')}
                (max {formatFileSize(uploadConstraints.maxFileSize)})
              </p>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button
          onClick={generate3DModel}
          disabled={!selectedFile || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating 3D Model...
            </>
          ) : (
            'Generate 3D Model'
          )}
        </Button>

        {/* Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentStatus}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Response */}
        {response && (
          <Alert
            className={
              response.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }
          >
            <div className="flex items-start gap-2">
              {response.success ? (
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertDescription className="text-sm">
                  {response.message}
                  {response.processingTime > 0 && (
                    <span className="block mt-1 text-xs text-muted-foreground">
                      Processing time: {formatProcessingTime(response.processingTime)}
                    </span>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {/* Reset Button */}
        {(selectedFile || response) && !isProcessing && (
          <Button variant="outline" onClick={reset} className="w-full">
            Start Over
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
