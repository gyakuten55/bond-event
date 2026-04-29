import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { APPLICATION_STATUS } from '@/lib/constants'
import { Users, Calendar, TrendingUp, Clock, Mail } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = createClient()

  // Fetch stats in parallel
  const [
    { count: totalMembers },
    { count: pendingMembers },
    { data: nextEvent },
    { count: nextEventApplicants },
    { data: recentApplications },
    { count: unreadContacts },
    { count: pendingAnnouncements },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'approved').eq('role', 'member'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('events').select('*').eq('status', 'published').gte('event_date', new Date().toISOString().split('T')[0]).order('event_date', { ascending: true }).limit(1).single(),
    supabase.from('event_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('event_applications').select('*, events(title, event_date), users(name, email)').order('created_at', { ascending: false }).limit(5),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    supabase.from('business_announcements').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">管理ダッシュボード</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalMembers || 0}</p>
              <p className="text-xs text-text-muted">承認済みメンバー</p>
            </div>
          </div>
          {(pendingMembers || 0) > 0 && (
            <Link href="/admin/members" className="mt-3 block">
              <Badge variant="warning">{pendingMembers}件の承認待ち</Badge>
            </Link>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{nextEventApplicants || 0}</p>
              <p className="text-xs text-text-muted">未確認の申込</p>
            </div>
          </div>
          {nextEvent && (
            <p className="mt-3 text-xs text-text-muted">
              次回: {formatDate(nextEvent.event_date)}
            </p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Mail className="text-orange-500" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{unreadContacts || 0}</p>
              <p className="text-xs text-text-muted">未読の問い合わせ</p>
            </div>
          </div>
          {(pendingAnnouncements || 0) > 0 && (
            <Link href="/admin/announcements" className="mt-3 block">
              <Badge variant="warning">{pendingAnnouncements}件の告知審査待ち</Badge>
            </Link>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              最近の申込
            </h2>
            <Link href="/admin/events" className="text-sm text-primary hover:underline">一覧</Link>
          </div>
          {recentApplications && recentApplications.length > 0 ? (
            <div className="space-y-3">
              {recentApplications.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">
                      {app.users?.name || app.guest_name || '不明'}
                    </p>
                    <p className="text-xs text-text-muted">{app.events?.title}</p>
                  </div>
                  <Badge variant={APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.variant || 'default'}>
                    {APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.label || app.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">最近の申込はありません</p>
          )}
        </Card>

        {/* Quick Links */}
        <Card>
          <h2 className="font-bold mb-4">クイックアクション</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/events/new" className="card hover:shadow-md text-center py-4">
              <Calendar className="mx-auto text-primary mb-2" size={24} />
              <p className="text-sm font-medium">イベント作成</p>
            </Link>
            <Link href="/admin/news/new" className="card hover:shadow-md text-center py-4">
              <TrendingUp className="mx-auto text-primary mb-2" size={24} />
              <p className="text-sm font-medium">ニュース投稿</p>
            </Link>
            <Link href="/admin/members" className="card hover:shadow-md text-center py-4">
              <Users className="mx-auto text-primary mb-2" size={24} />
              <p className="text-sm font-medium">メンバー管理</p>
            </Link>
            <Link href="/admin/analytics" className="card hover:shadow-md text-center py-4">
              <TrendingUp className="mx-auto text-primary mb-2" size={24} />
              <p className="text-sm font-medium">統計を見る</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
