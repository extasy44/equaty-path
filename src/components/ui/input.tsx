import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, value, onChange, onFocus, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(value?.toString() || '')

    // Update display value when value prop changes
    React.useEffect(() => {
      setDisplayValue(value?.toString() || '')
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setDisplayValue(inputValue)
      if (onChange) {
        onChange(e)
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Clear "0" when focusing on the input if the current value is 0
      if (value === 0 || value === '0') {
        setDisplayValue('')
      }
      if (onFocus) {
        onFocus(e)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // If empty, set back to 0
      if (displayValue === '') {
        setDisplayValue('0')
        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: '0' },
          } as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
      }
    }

    return (
      <input
        type={type}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          'flex h-10 w-full rounded-md border bg-[color:var(--surface)] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-secondary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-[color:var(--border)] focus:border-[color:var(--color-secondary)] shadow-sm cursor-pointer text-[color:var(--color-foreground)]',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
