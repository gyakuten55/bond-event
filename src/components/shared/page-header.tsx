interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="pt-16 pb-12 border-b border-border">
      <div className="container-bond">
        <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-3">{title}</p>
        {description && (
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">{description}</h1>
        )}
        {!description && (
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">{title}</h1>
        )}
      </div>
    </div>
  )
}
