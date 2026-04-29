import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  label?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ title, subtitle, label, className, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={cn('mb-14', align === 'center' && 'text-center', className)}>
      {label && (
        <p className={cn(
          'text-[11px] tracking-extra-wide text-text-muted uppercase mb-4',
          align === 'center' && 'mx-auto'
        )}>
          {label}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight">{title}</h2>
      {subtitle && (
        <p className={cn(
          'mt-4 text-[15px] text-text-muted leading-relaxed',
          align === 'center' ? 'max-w-xl mx-auto' : 'max-w-xl'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
