'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { UserRow } from '@/types/database'

export default function AdminMembersPage() {
  const [members, setMembers] = useState<UserRow[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [loading, setLoading] = useState(true)

  const fetchMembers = async () => {
    const supabase = createClient()
    let query = supabase.from('users').select('*').eq('role', 'member').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setMembers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchMembers() }, [filter])

  const updateStatus = async (userId: string, status: 'approved' | 'rejected') => {
    const supabase = createClient()
    await supabase.from('users').update({ status }).eq('id', userId)
    fetchMembers()
  }

  const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'danger' }> = {
    pending: { label: '承認待ち', variant: 'warning' },
    approved: { label: '承認済み', variant: 'success' },
    rejected: { label: '却下', variant: 'danger' },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">メンバー管理</h1>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
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

      {/* Members Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-text-muted">氏名</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">メール</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">会社</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">ステータス</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">登録日</th>
                <th className="text-right py-3 px-2 font-medium text-text-muted">操作</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-border/50 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{member.name || '—'}</td>
                  <td className="py-3 px-2 text-text-muted">{member.email}</td>
                  <td className="py-3 px-2 text-text-muted">{member.company || '—'}</td>
                  <td className="py-3 px-2">
                    <Badge variant={statusConfig[member.status]?.variant || 'default'}>
                      {statusConfig[member.status]?.label || member.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-text-muted">{formatDate(member.created_at)}</td>
                  <td className="py-3 px-2 text-right space-x-2">
                    {member.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => updateStatus(member.id, 'approved')}>承認</Button>
                        <Button size="sm" variant="danger" onClick={() => updateStatus(member.id, 'rejected')}>却下</Button>
                      </>
                    )}
                    {member.status === 'rejected' && (
                      <Button size="sm" onClick={() => updateStatus(member.id, 'approved')}>承認する</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {members.length === 0 && !loading && (
          <p className="text-center py-8 text-text-muted text-sm">該当するメンバーがいません</p>
        )}
      </Card>
    </div>
  )
}
