import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer disabled:cursor-not-allowed hover:shadow-sm active:shadow-md',
  {
    variants: {
      variant: {
        default:
          'bg-[color:var(--color-foreground)] text-white hover:bg-[color:var(--color-muted-foreground)]',
        destructive:
          'bg-[color:var(--color-error)] text-white hover:bg-[color:var(--color-error)]/90',
        outline:
          'border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] hover:border-[color:var(--border-hover)]',
        secondary:
          'bg-[color:var(--color-muted)] text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted-foreground)]',
        ghost:
          'text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]',
        link: 'text-[color:var(--color-primary)] underline-offset-4 hover:underline hover:text-[color:var(--color-primary-hover)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
