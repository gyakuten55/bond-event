import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Megaphone, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { APPLICATION_STATUS } from '@/lib/constants'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: applications } = await supabase
    .from('event_applications')
    .select('*, events(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: announcements } = await supabase
    .from('business_announcements')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const statusLabel: Record<string, string> = {
    pending: '承認待ち',
    approved: '承認済み',
    rejected: '却下',
  }

  const statusVariant: Record<string, 'warning' | 'success' | 'danger'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">マイページ</h1>

      {/* Account Status Alert */}
      {profile?.status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">アカウント承認待ち</p>
            <p className="text-sm mt-1">
              管理者によるアカウント承認をお待ちください。承認後、すべての機能をご利用いただけます。
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              最近の申込
            </h2>
            <Link href="/dashboard/events" className="text-sm text-primary hover:underline">
              すべて見る
            </Link>
          </div>
          {applications && applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{app.events?.title || '不明なイベント'}</p>
                    <p className="text-xs text-text-muted">
                      {app.events?.event_date ? formatDate(app.events.event_date) : ''}
                    </p>
                  </div>
                  <Badge variant={APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.variant || 'default'}>
                    {APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.label || app.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">申込はまだありません</p>
          )}
        </Card>

        {/* Recent Announcements */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Megaphone size={18} className="text-primary" />
              ビジネス告知
            </h2>
            <Link href="/dashboard/announcements" className="text-sm text-primary hover:underline">
              すべて見る
            </Link>
          </div>
          {announcements && announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <p className="text-sm font-medium truncate mr-3">{ann.title}</p>
                  <Badge variant={statusVariant[ann.status] || 'default'}>
                    {statusLabel[ann.status] || ann.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              告知はまだありません。
              <Link href="/dashboard/announcements/new" className="text-primary hover:underline ml-1">
                作成する
              </Link>
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
