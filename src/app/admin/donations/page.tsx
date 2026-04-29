'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { Plus, X } from 'lucide-react'

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    eventId: '',
    totalAmount: 3000,
    edeliAmount: 1000,
    befriendersAmount: 1000,
    hitoribocchiAmount: 1000,
    note: '',
    donatedAt: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    const supabase = createClient()
    const [{ data: donationData }, { data: eventData }] = await Promise.all([
      supabase.from('donations').select('*, events(title, event_date)').order('donated_at', { ascending: false }),
      supabase.from('events').select('id, title, event_date').order('event_date', { ascending: false }),
    ])
    setDonations(donationData || [])
    setEvents(eventData || [])
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    await supabase.from('donations').insert({
      event_id: form.eventId || null,
      total_amount: form.totalAmount,
      edeli_amount: form.edeliAmount,
      befrienders_amount: form.befriendersAmount,
      hitoribocchi_amount: form.hitoribocchiAmount,
      note: form.note,
      donated_at: form.donatedAt,
    })

    setShowForm(false)
    setLoading(false)
    fetchData()
  }

  const totalAll = donations.reduce((s, d) => s + d.total_amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">寄付金管理</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={16} className="mr-1" />閉じる</> : <><Plus size={16} className="mr-1" />記録追加</>}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-xs text-text-muted mb-1">累計寄付総額</p>
          <p className="text-xl font-bold text-primary">{formatCurrency(totalAll)}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-text-muted mb-1">イーデリ</p>
          <p className="text-lg font-bold">{formatCurrency(donations.reduce((s, d) => s + d.edeli_amount, 0))}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-text-muted mb-1">国際ビフレンダーズ</p>
          <p className="text-lg font-bold">{formatCurrency(donations.reduce((s, d) => s + d.befrienders_amount, 0))}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-text-muted mb-1">ひとりぼっちPJ</p>
          <p className="text-lg font-bold">{formatCurrency(donations.reduce((s, d) => s + d.hitoribocchi_amount, 0))}</p>
        </Card>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card>
          <h2 className="font-bold mb-4">寄付金記録を追加</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">関連イベント（任意）</label>
              <select
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-surface"
                value={form.eventId}
                onChange={(e) => setForm({ ...form, eventId: e.target.value })}
              >
                <option value="">選択なし</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title} ({ev.event_date})</option>
                ))}
              </select>
            </div>
            <Input
              id="donatedAt"
              label="寄付日"
              type="date"
              value={form.donatedAt}
              onChange={(e) => setForm({ ...form, donatedAt: e.target.value })}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                id="totalAmount"
                label="合計金額"
                type="number"
                value={form.totalAmount}
                onChange={(e) => setForm({ ...form, totalAmount: Number(e.target.value) })}
              />
              <Input
                id="edeliAmount"
                label="イーデリ"
                type="number"
                value={form.edeliAmount}
                onChange={(e) => setForm({ ...form, edeliAmount: Number(e.target.value) })}
              />
              <Input
                id="befriendersAmount"
                label="ビフレンダーズ"
                type="number"
                value={form.befriendersAmount}
                onChange={(e) => setForm({ ...form, befriendersAmount: Number(e.target.value) })}
              />
              <Input
                id="hitoribocchiAmount"
                label="ひとりぼっちPJ"
                type="number"
                value={form.hitoribocchiAmount}
                onChange={(e) => setForm({ ...form, hitoribocchiAmount: Number(e.target.value) })}
              />
            </div>
            <Button type="submit" disabled={loading}>{loading ? '保存中...' : '保存'}</Button>
          </form>
        </Card>
      )}

      {/* Donation History */}
      <Card>
        <h2 className="font-bold mb-4">寄付履歴</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-text-muted">日付</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">イベント</th>
                <th className="text-right py-3 px-2 font-medium text-text-muted">合計</th>
                <th className="text-right py-3 px-2 font-medium text-text-muted">イーデリ</th>
                <th className="text-right py-3 px-2 font-medium text-text-muted">ビフレンダーズ</th>
                <th className="text-right py-3 px-2 font-medium text-text-muted">ひとりぼっちPJ</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d: any) => (
                <tr key={d.id} className="border-b border-border/50">
                  <td className="py-3 px-2">{d.donated_at}</td>
                  <td className="py-3 px-2 text-text-muted">{d.events?.title || '—'}</td>
                  <td className="py-3 px-2 text-right font-medium">{formatCurrency(d.total_amount)}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(d.edeli_amount)}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(d.befrienders_amount)}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(d.hitoribocchi_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
