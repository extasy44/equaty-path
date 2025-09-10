import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-secondary)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)]',
        secondary:
          'border-transparent bg-[color:var(--color-muted)] text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted-hover)]',
        destructive:
          'border-transparent bg-[color:var(--color-error)] text-white hover:bg-[color:var(--color-error)]/80',
        outline: 'text-[color:var(--color-foreground)] border-[color:var(--border)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
