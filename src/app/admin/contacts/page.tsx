'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)

  const fetchContacts = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    setContacts(data || [])
  }

  useEffect(() => { fetchContacts() }, [])

  const updateStatus = async (id: string, status: 'read' | 'replied') => {
    const supabase = createClient()
    await supabase.from('contact_messages').update({ status }).eq('id', id)
    fetchContacts()
  }

  const statusConfig: Record<string, { label: string; variant: 'danger' | 'warning' | 'success' }> = {
    unread: { label: '未読', variant: 'danger' },
    read: { label: '既読', variant: 'warning' },
    replied: { label: '返信済', variant: 'success' },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">お問い合わせ管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-2">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelected(c)
                if (c.status === 'unread') updateStatus(c.id, 'read')
              }}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selected?.id === c.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate">{c.name}</span>
                <Badge variant={statusConfig[c.status]?.variant || 'default'}>
                  {statusConfig[c.status]?.label || c.status}
                </Badge>
              </div>
              <p className="text-xs text-text-muted truncate">{c.subject}</p>
              <p className="text-xs text-text-muted mt-1">{formatDateTime(c.created_at)}</p>
            </button>
          ))}
          {contacts.length === 0 && (
            <p className="text-center py-8 text-text-muted text-sm">お問い合わせはありません</p>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">{selected.subject}</h2>
                <Badge variant={statusConfig[selected.status]?.variant || 'default'}>
                  {statusConfig[selected.status]?.label || selected.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4 pb-4 border-b border-border">
                <div>
                  <p className="text-text-muted">名前</p>
                  <p className="font-medium">{selected.name}</p>
                </div>
                <div>
                  <p className="text-text-muted">メール</p>
                  <a href={`mailto:${selected.email}`} className="font-medium text-primary hover:underline">{selected.email}</a>
                </div>
                {selected.company && (
                  <div>
                    <p className="text-text-muted">会社</p>
                    <p className="font-medium">{selected.company}</p>
                  </div>
                )}
                {selected.phone && (
                  <div>
                    <p className="text-text-muted">電話番号</p>
                    <p className="font-medium">{selected.phone}</p>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <p className="text-text-muted text-sm mb-2">メッセージ</p>
                <p className="text-sm whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => updateStatus(selected.id, 'replied')}>
                  返信済みにする
                </Button>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}>
                  <Button size="sm" variant="outline">メールで返信</Button>
                </a>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <p className="text-text-muted text-sm">左のリストからお問い合わせを選択してください</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
