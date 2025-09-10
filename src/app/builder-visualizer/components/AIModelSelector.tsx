'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Brain, Zap, Server, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { aiServiceManager } from '../services/ai/ai-service-manager'

interface AIModelSelectorProps {
  onModelChange?: (provider: string, model: string) => void
  className?: string
}

interface ServiceStatus {
  provider: string
  model: string
  capabilities: string[]
  available: boolean
  status: 'checking' | 'available' | 'unavailable' | 'error'
  error?: string
}

export function AIModelSelector({ onModelChange, className }: AIModelSelectorProps) {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load available services on mount
  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get service information
      const serviceInfo = await aiServiceManager.getAllServiceInfo()

      // Convert to our format
      const serviceStatuses: ServiceStatus[] = serviceInfo.map((info) => ({
        provider: info.provider,
        model: info.model,
        capabilities: info.capabilities,
        available: info.available,
        status: info.available ? 'available' : 'unavailable',
      }))

      setServices(serviceStatuses)

      // Set default selected provider
      if (serviceStatuses.length > 0) {
        const defaultProvider = aiServiceManager.getCurrentProvider()
        const availableService = serviceStatuses.find((s) => s.available)
        setSelectedProvider(availableService?.provider || defaultProvider)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load AI services')
      console.error('Failed to load AI services:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderChange = async (provider: string) => {
    try {
      setSelectedProvider(provider)
      await aiServiceManager.switchProvider(provider)

      // Find the service info
      const service = services.find((s) => s.provider === provider)
      if (service) {
        onModelChange?.(provider, service.model)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch provider')
    }
  }

  const testConnection = async (provider: string) => {
    // Update status to checking
    setServices((prev) =>
      prev.map((s) => (s.provider === provider ? { ...s, status: 'checking' as const } : s))
    )

    try {
      const available = await aiServiceManager.testConnection(provider)

      // Update status
      setServices((prev) =>
        prev.map((s) =>
          s.provider === provider
            ? {
                ...s,
                status: available ? ('available' as const) : ('unavailable' as const),
                available,
              }
            : s
        )
      )
    } catch (err) {
      setServices((prev) =>
        prev.map((s) =>
          s.provider === provider
            ? {
                ...s,
                status: 'error' as const,
                error: err instanceof Error ? err.message : 'Connection test failed',
              }
            : s
        )
      )
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'ollama':
        return <Server className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'checking':
        return (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        )
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'unavailable':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'checking':
        return 'text-blue-600'
      case 'available':
        return 'text-green-600'
      case 'unavailable':
        return 'text-red-600'
      case 'error':
        return 'text-orange-600'
      default:
        return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Model Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="ml-2 text-sm text-muted-foreground">Loading AI services...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Model Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Provider Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">AI Provider</label>
          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem
                  key={service.provider}
                  value={service.provider}
                  disabled={!service.available && service.status !== 'checking'}
                >
                  <div className="flex items-center gap-2">
                    {getProviderIcon(service.provider)}
                    <span className="capitalize">{service.provider}</span>
                    <span className="text-xs text-muted-foreground">({service.model})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Service Status</h4>
          {services.map((service) => (
            <div
              key={service.provider}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getProviderIcon(service.provider)}
                <div>
                  <div className="font-medium capitalize">{service.provider}</div>
                  <div className="text-sm text-muted-foreground">{service.model}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 text-sm ${getStatusColor(service.status)}`}
                >
                  {getStatusIcon(service.status)}
                  <span className="capitalize">{service.status}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testConnection(service.provider)}
                  disabled={service.status === 'checking'}
                >
                  Test
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        {selectedProvider && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Capabilities</h4>
            <div className="flex flex-wrap gap-1">
              {services
                .find((s) => s.provider === selectedProvider)
                ?.capabilities.map((capability) => (
                  <Badge key={capability} variant="secondary" className="text-xs">
                    {capability.replace('-', ' ')}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <Alert>
          <Server className="h-4 w-4" />
          <AlertDescription>
            <strong>Ollama</strong> runs locally and offers privacy with AI capabilities.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

export type { AIModelSelectorProps }
