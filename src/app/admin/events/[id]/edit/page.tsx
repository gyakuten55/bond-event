'use client'

import { useState, useEffect } from 'react'
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

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
  })

  useEffect(() => {
    const fetchEvent = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('events').select('*').eq('id', params.id).single()
      if (data) {
        reset({
          title: data.title,
          description: data.description,
          eventDate: data.event_date,
          startTime: data.start_time,
          endTime: data.end_time || '',
          venueType: data.venue_type,
          venueName: data.venue_name,
          venueAddress: data.venue_address,
          capacity: data.capacity,
          participationFee: data.participation_fee,
          status: data.status,
        })
      }
    }
    fetchEvent()
  }, [params.id, reset])

  const onSubmit = async (data: EventInput) => {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase.from('events').update({
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
    }).eq('id', params.id)

    if (updateError) {
      setError('エラーが発生しました')
      setLoading(false)
    } else {
      router.push(`/admin/events/${params.id}`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/events/${params.id}`} className="text-sm text-text-muted hover:text-primary">← イベント詳細</Link>
        <h1 className="text-2xl font-bold mt-2">イベント編集</h1>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

          <Input id="title" label="タイトル" error={errors.title?.message} {...register('title')} />
          <Textarea id="description" label="説明" {...register('description')} />

          <div className="grid grid-cols-2 gap-4">
            <Input id="eventDate" label="開催日" type="date" error={errors.eventDate?.message} {...register('eventDate')} />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">会場エリア</label>
              <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-surface" {...register('venueType')}>
                <option value="north">大阪北（昼間）</option>
                <option value="south">大阪南（夜間）</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input id="startTime" label="開始時間" type="time" error={errors.startTime?.message} {...register('startTime')} />
            <Input id="endTime" label="終了時間" type="time" {...register('endTime')} />
          </div>

          <Input id="venueName" label="会場名" error={errors.venueName?.message} {...register('venueName')} />
          <Input id="venueAddress" label="住所" {...register('venueAddress')} />

          <div className="grid grid-cols-2 gap-4">
            <Input id="capacity" label="定員" type="number" error={errors.capacity?.message} {...register('capacity', { valueAsNumber: true })} />
            <Input id="participationFee" label="参加費（円）" type="number" {...register('participationFee', { valueAsNumber: true })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">ステータス</label>
            <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-surface" {...register('status')}>
              <option value="draft">下書き</option>
              <option value="published">公開</option>
              <option value="cancelled">中止</option>
              <option value="completed">終了</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? '更新中...' : '更新する'}</Button>
            <Link href={`/admin/events/${params.id}`}><Button type="button" variant="ghost">キャンセル</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
