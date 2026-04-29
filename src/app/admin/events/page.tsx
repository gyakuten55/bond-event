import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { VENUES } from '@/lib/constants'
import { Plus } from 'lucide-react'

export default async function AdminEventsPage() {
  const supabase = createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })

  const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
    draft: { label: '下書き', variant: 'default' },
    published: { label: '公開中', variant: 'success' },
    cancelled: { label: '中止', variant: 'danger' },
    completed: { label: '終了', variant: 'warning' },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">イベント管理</h1>
        <Link href="/admin/events/new">
          <Button size="sm"><Plus size={16} className="mr-1" />新規作成</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 font-medium text-text-muted">タイトル</th>
              <th className="text-left py-3 px-3 font-medium text-text-muted">日時</th>
              <th className="text-left py-3 px-3 font-medium text-text-muted">会場</th>
              <th className="text-left py-3 px-3 font-medium text-text-muted">ステータス</th>
              <th className="text-right py-3 px-3 font-medium text-text-muted">操作</th>
            </tr>
          </thead>
          <tbody>
            {events?.map((event) => (
              <tr key={event.id} className="border-b border-border/50 hover:bg-gray-50">
                <td className="py-3 px-3 font-medium">{event.title}</td>
                <td className="py-3 px-3 text-text-muted">{formatDate(event.event_date)}</td>
                <td className="py-3 px-3">
                  <Badge variant={event.venue_type === 'north' ? 'north' : 'south'}>
                    {VENUES[event.venue_type as keyof typeof VENUES].label}
                  </Badge>
                </td>
                <td className="py-3 px-3">
                  <Badge variant={statusConfig[event.status]?.variant || 'default'}>
                    {statusConfig[event.status]?.label || event.status}
                  </Badge>
                </td>
                <td className="py-3 px-3 text-right">
                  <Link href={`/admin/events/${event.id}`} className="text-primary hover:underline text-sm mr-3">
                    詳細
                  </Link>
                  <Link href={`/admin/events/${event.id}/edit`} className="text-text-muted hover:text-primary text-sm">
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
