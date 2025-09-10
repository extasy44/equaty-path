'use client'

import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Settings, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

interface ServiceLayoutProps {
  title: string
  description: string
  icon?: ReactNode
  badge?: string
  backHref?: string
  backLabel?: string
  children: ReactNode
  metrics?: MetricCardProps[]
  actions?: ReactNode
  sidebar?: ReactNode
  showHeader?: boolean
  className?: string
}

function MetricCard({ title, value, description, icon, trend, trendValue }: MetricCardProps) {
  return (
    <Card className="metric-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-primary-light)] text-[color:var(--color-primary)]">
                {icon}
              </div>
            )}
            <div>
              <p className="metric-label">{title}</p>
              <p className="metric-value mt-1">{value}</p>
            </div>
          </div>
          {trend && trendValue && (
            <Badge
              variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
              {trendValue}
            </Badge>
          )}
        </div>
        {description && (
          <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function ServiceLayout({
  title,
  description,
  icon,
  badge,
  backHref,
  backLabel = 'Back to Dashboard',
  children,
  metrics,
  actions,
  sidebar,
  showHeader = true,
  className = '',
}: ServiceLayoutProps) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-[color:var(--bg1)] via-[color:var(--bg2)] to-[color:var(--bg3)] ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {showHeader && (
          <div className="mb-8">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {backHref && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
                  >
                    <Link href={backHref} className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      {backLabel}
                    </Link>
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  {icon && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-primary)] text-white shadow-lg">
                      {icon}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-[color:var(--color-primary)]">
                        {title}
                      </h1>
                      {badge && (
                        <Badge variant="secondary" className="text-xs font-medium">
                          {badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-[color:var(--color-muted-foreground)] mt-1">
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-3">
                {actions}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[color:var(--color-muted-foreground)]"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[color:var(--color-muted-foreground)]"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Metrics Row */}
            {metrics && metrics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className={`${sidebar ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <Card className="card-professional">
              <CardContent className="p-8">{children}</CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          {sidebar && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">{sidebar}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
