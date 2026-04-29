import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { APPLICATION_STATUS, VENUES } from '@/lib/constants'
import { Download } from 'lucide-react'

export default async function AdminEventDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: event } = await supabase.from('events').select('*').eq('id', params.id).single()
  if (!event) notFound()

  const { data: applications } = await supabase
    .from('event_applications')
    .select('*, users(name, email, company)')
    .eq('event_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/events" className="text-sm text-text-muted hover:text-primary">← イベント一覧</Link>
          <h1 className="text-2xl font-bold mt-2">{event.title}</h1>
        </div>
        <div className="flex gap-2">
          <a href={`/api/events/${params.id}/export`} className="btn-outline text-sm !py-2 !px-4 inline-flex items-center gap-1">
            <Download size={14} />CSV
          </a>
          <Link href={`/admin/events/${params.id}/edit`} className="btn-primary text-sm !py-2 !px-4">
            編集
          </Link>
        </div>
      </div>

      {/* Event Info */}
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-text-muted mb-1">日時</p>
            <p className="font-medium">{formatDate(event.event_date)}</p>
            <p>{event.start_time?.slice(0, 5)}〜{event.end_time?.slice(0, 5) || ''}</p>
          </div>
          <div>
            <p className="text-text-muted mb-1">会場</p>
            <Badge variant={event.venue_type === 'north' ? 'north' : 'south'}>
              {VENUES[event.venue_type as keyof typeof VENUES].label}
            </Badge>
            <p className="mt-1">{event.venue_name}</p>
          </div>
          <div>
            <p className="text-text-muted mb-1">定員</p>
            <p className="font-medium">{applications?.filter(a => a.status !== 'cancelled').length || 0} / {event.capacity}名</p>
          </div>
          <div>
            <p className="text-text-muted mb-1">参加費</p>
            <p className="font-medium">{formatCurrency(event.participation_fee)}</p>
          </div>
        </div>
      </Card>

      {/* Applicants Table */}
      <Card>
        <h2 className="font-bold mb-4">申込者一覧（{applications?.length || 0}件）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-text-muted">名前</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">メール</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">会社</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">区分</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">ステータス</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">申込日</th>
              </tr>
            </thead>
            <tbody>
              {applications?.map((app: any) => (
                <tr key={app.id} className="border-b border-border/50">
                  <td className="py-3 px-2 font-medium">{app.users?.name || app.guest_name || '—'}</td>
                  <td className="py-3 px-2 text-text-muted">{app.users?.email || app.guest_email || '—'}</td>
                  <td className="py-3 px-2 text-text-muted">{app.users?.company || app.guest_company || '—'}</td>
                  <td className="py-3 px-2">
                    <Badge variant={app.user_id ? 'info' : 'default'}>
                      {app.user_id ? '会員' : 'ゲスト'}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.variant || 'default'}>
                      {APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.label || app.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-text-muted">{formatDate(app.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
