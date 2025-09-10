'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Calculator,
} from 'lucide-react'

interface QuickAction {
  label: string
  href?: string
  icon?: ReactNode
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive'
  onClick?: () => void
}

interface StatusItem {
  label: string
  status: 'success' | 'warning' | 'error' | 'pending'
  value?: string
}

interface ServiceSidebarProps {
  quickActions?: QuickAction[]
  status?: StatusItem[]
  progress?: {
    label: string
    value: number
    max?: number
  }[]
  stats?: {
    label: string
    value: string | number
    icon?: ReactNode
  }[]
  className?: string
}

function getStatusIcon(status: StatusItem['status']) {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-[color:var(--color-success)]" />
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-[color:var(--color-warning)]" />
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-[color:var(--color-error)]" />
    case 'pending':
      return <Clock className="h-4 w-4 text-[color:var(--color-muted-foreground)]" />
  }
}

function getStatusColor(status: StatusItem['status']) {
  switch (status) {
    case 'success':
      return 'text-[color:var(--color-success)]'
    case 'warning':
      return 'text-[color:var(--color-warning)]'
    case 'error':
      return 'text-[color:var(--color-error)]'
    case 'pending':
      return 'text-[color:var(--color-muted-foreground)]'
  }
}

export function ServiceSidebar({
  quickActions,
  status,
  progress,
  stats,
  className = '',
}: ServiceSidebarProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Actions */}
      {quickActions && quickActions.length > 0 && (
        <Card className="card-professional">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                asChild={!!action.href}
                variant={action.variant || 'outline'}
                size="sm"
                className="w-full justify-start"
                onClick={action.onClick}
              >
                {action.href ? (
                  <a href={action.href} className="flex items-center gap-2">
                    {action.icon}
                    {action.label}
                  </a>
                ) : (
                  <span className="flex items-center gap-2">
                    {action.icon}
                    {action.label}
                  </span>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Status Overview */}
      {status && status.length > 0 && (
        <Card className="card-professional">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                    {item.label}
                  </span>
                </div>
                {item.value && (
                  <span className="text-sm text-[color:var(--color-muted-foreground)]">
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Progress Tracking */}
      {progress && progress.length > 0 && (
        <Card className="card-professional">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[color:var(--color-muted-foreground)]">
                    {item.value}/{item.max || 100}
                  </span>
                </div>
                <Progress value={item.value} max={item.max || 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Key Stats */}
      {stats && stats.length > 0 && (
        <Card className="card-professional">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <span className="text-sm font-bold text-[color:var(--color-primary)]">
                  {stat.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity Placeholder */}
      <Card className="card-professional">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-[color:var(--color-muted-foreground)]">
            No recent activity to display.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
