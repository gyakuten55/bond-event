import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AnnouncementsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: announcements } = await supabase
    .from('business_announcements')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'danger' | 'default' }> = {
    draft: { label: '下書き', variant: 'default' },
    pending: { label: '審査中', variant: 'warning' },
    approved: { label: '承認済み', variant: 'success' },
    rejected: { label: '却下', variant: 'danger' },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ビジネス告知</h1>
        <Link href="/dashboard/announcements/new">
          <Button size="sm">
            <Plus size={16} className="mr-1" />
            新規作成
          </Button>
        </Link>
      </div>

      {announcements && announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <Card key={ann.id} hover>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={statusConfig[ann.status]?.variant || 'default'}>
                      {statusConfig[ann.status]?.label || ann.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold">{ann.title}</h3>
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">{ann.content}</p>
                  {ann.admin_note && ann.status === 'rejected' && (
                    <p className="text-sm text-red-500 mt-2">理由: {ann.admin_note}</p>
                  )}
                </div>
                <p className="text-xs text-text-muted flex-shrink-0">
                  {formatDate(ann.created_at)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="ビジネス告知はまだありません"
          description="新規作成からビジネスの告知を投稿しましょう"
        />
      )}
    </div>
  )
}
