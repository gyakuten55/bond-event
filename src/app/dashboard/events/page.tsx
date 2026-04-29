import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/empty-state'
import { formatDate } from '@/lib/utils'
import { APPLICATION_STATUS, VENUES } from '@/lib/constants'
import Link from 'next/link'

export default async function DashboardEventsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: applications } = await supabase
    .from('event_applications')
    .select('*, events(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">参加イベント</h1>

      {applications && applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app: any) => (
            <Card key={app.id} hover>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {app.events?.venue_type && (
                      <Badge variant={app.events.venue_type === 'north' ? 'north' : 'south'}>
                        {VENUES[app.events.venue_type as keyof typeof VENUES]?.label}
                      </Badge>
                    )}
                    <Badge variant={APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.variant || 'default'}>
                      {APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.label || app.status}
                    </Badge>
                  </div>
                  <Link href={`/events/${app.event_id}`} className="font-bold hover:text-primary">
                    {app.events?.title || '不明なイベント'}
                  </Link>
                  <p className="text-sm text-text-muted mt-1">
                    {app.events?.event_date ? formatDate(app.events.event_date) : ''}
                    {app.events?.start_time ? ` ${app.events.start_time.slice(0, 5)}〜` : ''}
                  </p>
                </div>
                <p className="text-xs text-text-muted">
                  申込日: {formatDate(app.created_at)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="参加イベントはまだありません"
          description="イベントに参加して交流を楽しみましょう"
        />
      )}
    </div>
  )
}
