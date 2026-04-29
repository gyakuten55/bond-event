import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-[13px] font-medium text-text-primary tracking-wide">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full px-0 py-3 border-0 border-b text-[14px] bg-transparent text-text-primary placeholder:text-text-muted/40',
            'focus:outline-none focus:border-text-primary',
            'transition-colors duration-300 min-h-[100px] resize-none',
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

Textarea.displayName = 'Textarea'
