import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader2, Zap, Cpu, Database } from 'lucide-react'

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'tech' | 'app' | 'module'
  size?: 'sm' | 'md' | 'lg'
  message?: string
  subMessage?: string
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant = 'default', size = 'md', message, subMessage, ...props }, ref) => {
    const getIcon = () => {
      switch (variant) {
        case 'tech':
          return <Cpu className="animate-pulse" />
        case 'app':
          return <Zap className="animate-bounce" />
        case 'module':
          return <Database className="animate-spin" />
        default:
          return <Loader2 className="animate-spin" />
      }
    }

    const getSize = () => {
      switch (size) {
        case 'sm':
          return 'h-4 w-4'
        case 'lg':
          return 'h-8 w-8'
        default:
          return 'h-6 w-6'
      }
    }

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3 p-6', className)}
        {...props}
      >
        <div className={cn('text-muted-foreground', getSize())}>{getIcon()}</div>

        {message && (
          <div className="text-center">
            <p className="text-sm font-medium">{message}</p>
            {subMessage && <p className="text-xs text-muted-foreground mt-1">{subMessage}</p>}
          </div>
        )}

        {variant === 'tech' && (
          <div className="flex items-center gap-1 mt-2">
            <div
              className="h-1 w-1 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="h-1 w-1 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: '200ms' }}
            />
            <div
              className="h-1 w-1 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: '400ms' }}
            />
          </div>
        )}
      </div>
    )
  }
)
Loading.displayName = 'Loading'

const AppLoader = ({ message = 'Initializing application...' }: { message?: string }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
    <div className="flex items-center justify-center h-full">
      <div className="bg-card border rounded-lg shadow-lg p-8">
        <Loading
          variant="app"
          size="lg"
          message={message}
          subMessage="Setting up your workspace"
          className="text-center"
        />
      </div>
    </div>
  </div>
)

const ModuleLoader = ({ moduleName }: { moduleName: string }) => (
  <div className="flex items-center justify-center p-8">
    <Loading
      variant="module"
      size="md"
      message={`Loading ${moduleName}`}
      subMessage="Please wait..."
    />
  </div>
)

const TechLoader = ({ message = 'Processing...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg">
    <Loading
      variant="tech"
      size="lg"
      message={message}
      subMessage="AI-powered analysis in progress"
    />
  </div>
)

export { Loading, AppLoader, ModuleLoader, TechLoader }
