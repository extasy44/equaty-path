import * as React from 'react'
import { cn } from '@/lib/utils'

export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
}: {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}) {
  const isVertical = orientation === 'vertical'
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      className={cn('bg-border shrink-0', isVertical ? 'w-px h-full' : 'h-px w-full', className)}
    />
  )
}

export type SeparatorProps = React.ComponentProps<'div'>
