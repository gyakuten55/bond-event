import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-[13px] font-medium text-text-primary tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-0 py-3 border-0 border-b text-[14px] bg-transparent text-text-primary placeholder:text-text-muted/40',
            'focus:outline-none focus:border-text-primary',
            'transition-colors duration-300',
            error ? 'border-red-500' : 'border-border',
            className
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-red-500">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
