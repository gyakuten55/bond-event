'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { eventSchema, type EventInput } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      participationFee: 3000,
      capacity: 30,
      status: 'draft',
      venueType: 'north',
    },
  })

  const onSubmit = async (data: EventInput) => {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: insertError } = await supabase.from('events').insert({
      title: data.title,
      description: data.description || '',
      event_date: data.eventDate,
      start_time: data.startTime,
      end_time: data.endTime || null,
      venue_type: data.venueType,
      venue_name: data.venueName,
      venue_address: data.venueAddress || '',
      capacity: data.capacity,
      participation_fee: data.participationFee,
      status: data.status,
    })

    if (insertError) {
      setError('エラーが発生しました')
      setLoading(false)
    } else {
      router.push('/admin/events')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/events" className="text-sm text-text-muted hover:text-primary">← イベント一覧</Link>
        <h1 className="text-2xl font-bold mt-2">イベント新規作成</h1>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

          <Input id="title" label="タイトル" placeholder="BOND交流会 Vol.XX" error={errors.title?.message} {...register('title')} />

          <Textarea id="description" label="説明" placeholder="イベントの詳細説明" {...register('description')} />

          <div className="grid grid-cols-2 gap-4">
            <Input id="eventDate" label="開催日" type="date" error={errors.eventDate?.message} {...register('eventDate')} />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">会場エリア</label>
              <select
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-surface"
                {...register('venueType')}
              >
                <option value="north">大阪北（昼間）</option>
                <option value="south">大阪南（夜間）</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input id="startTime" label="開始時間" type="time" error={errors.startTime?.message} {...register('startTime')} />
            <Input id="endTime" label="終了時間" type="time" {...register('endTime')} />
          </div>

          <Input id="venueName" label="会場名" placeholder="会場名を入力" error={errors.venueName?.message} {...register('venueName')} />
          <Input id="venueAddress" label="住所" placeholder="大阪府..." {...register('venueAddress')} />

          <div className="grid grid-cols-2 gap-4">
            <Input id="capacity" label="定員" type="number" error={errors.capacity?.message} {...register('capacity', { valueAsNumber: true })} />
            <Input id="participationFee" label="参加費（円）" type="number" {...register('participationFee', { valueAsNumber: true })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">ステータス</label>
            <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-surface" {...register('status')}>
              <option value="draft">下書き</option>
              <option value="published">公開</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? '作成中...' : '作成する'}</Button>
            <Link href="/admin/events"><Button type="button" variant="ghost">キャンセル</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
