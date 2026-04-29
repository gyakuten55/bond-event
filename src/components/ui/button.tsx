import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed',
          {
            'bg-text-primary text-white hover:bg-black': variant === 'primary',
            'bg-gold text-white hover:bg-gold-dark': variant === 'secondary',
            'border border-text-primary text-text-primary hover:bg-text-primary hover:text-white': variant === 'outline',
            'text-text-muted hover:text-text-primary': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          },
          {
            'text-[12px] px-4 py-2': size === 'sm',
            'text-[13px] px-7 py-3.5': size === 'md',
            'text-sm px-9 py-4': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
