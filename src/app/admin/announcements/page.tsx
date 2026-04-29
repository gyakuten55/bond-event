'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  const fetchAnnouncements = async () => {
    const supabase = createClient()
    let query = supabase.from('business_announcements').select('*, users(name, company)').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setAnnouncements(data || [])
  }

  useEffect(() => { fetchAnnouncements() }, [filter])

  const updateStatus = async (id: string, status: 'approved' | 'rejected', adminNote = '') => {
    const supabase = createClient()
    await supabase.from('business_announcements').update({
      status,
      admin_note: adminNote,
      published_at: status === 'approved' ? new Date().toISOString() : null,
    }).eq('id', id)
    fetchAnnouncements()
  }

  const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'danger' | 'default' }> = {
    draft: { label: '下書き', variant: 'default' },
    pending: { label: '審査中', variant: 'warning' },
    approved: { label: '承認', variant: 'success' },
    rejected: { label: '却下', variant: 'danger' },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ビジネス告知管理</h1>

      <div className="flex gap-2">
        {(['pending', 'all', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'すべて' : statusConfig[f]?.label || f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {announcements.map((ann: any) => (
          <Card key={ann.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={statusConfig[ann.status]?.variant || 'default'}>
                    {statusConfig[ann.status]?.label || ann.status}
                  </Badge>
                  <span className="text-xs text-text-muted">{formatDate(ann.created_at)}</span>
                </div>
                <h3 className="font-bold">{ann.title}</h3>
                <p className="text-sm text-text-muted mt-1">{ann.users?.name} ({ann.users?.company || '会社未設定'})</p>
                <p className="text-sm text-text-muted mt-2 whitespace-pre-wrap">{ann.content}</p>
              </div>
              {ann.status === 'pending' && (
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" onClick={() => updateStatus(ann.id, 'approved')}>承認</Button>
                  <Button size="sm" variant="danger" onClick={() => updateStatus(ann.id, 'rejected')}>却下</Button>
                </div>
              )}
            </div>
          </Card>
        ))}
        {announcements.length === 0 && (
          <p className="text-center py-8 text-text-muted text-sm">該当する告知がありません</p>
        )}
      </div>
    </div>
  )
}
