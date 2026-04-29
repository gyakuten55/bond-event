import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Inbox className="mx-auto h-12 w-12 text-text-muted/30" />
      <h3 className="mt-4 text-sm font-medium text-text-primary">{title}</h3>
      {description && <p className="mt-2 text-sm text-text-muted">{description}</p>}
    </div>
  )
}
