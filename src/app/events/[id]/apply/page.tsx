'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { guestApplicationSchema, type GuestApplicationInput } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { EventRow, UserRow } from '@/types/database'

export default function ApplyPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<EventRow | null>(null)
  const [user, setUser] = useState<UserRow | null>(null)
  const [isGuest, setIsGuest] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<GuestApplicationInput>({
    resolver: zodResolver(guestApplicationSchema),
    defaultValues: { numberOfGuests: 1 },
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .single()

      if (eventData) setEvent(eventData)

      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profile) {
          setUser(profile)
          setIsGuest(false)
        }
      }
    }
    fetchData()
  }, [params.id])

  const onGuestSubmit = async (data: GuestApplicationInput) => {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: insertError } = await supabase.from('event_applications').insert({
      event_id: params.id,
      guest_name: data.guestName,
      guest_email: data.guestEmail,
      guest_phone: data.guestPhone,
      guest_company: data.guestCompany || '',
      number_of_guests: data.numberOfGuests,
      message: data.message || '',
    })

    if (insertError) {
      if (insertError.code === '23505') {
        setError('このメールアドレスで既に申し込み済みです')
      } else {
        setError('エラーが発生しました。もう一度お試しください')
      }
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  const onMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      setError('ログインが必要です')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('event_applications').insert({
      event_id: params.id,
      user_id: authUser.id,
      number_of_guests: 1,
    })

    if (insertError) {
      if (insertError.code === '23505') {
        setError('既にこのイベントに申し込み済みです')
      } else {
        setError('エラーが発生しました。もう一度お試しください')
      }
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="section-padding">
        <div className="container-bond">
          <div className="max-w-lg mx-auto text-center">
            <Card>
              <div className="text-primary text-5xl mb-4">&#10003;</div>
              <h2 className="text-xl font-bold mb-3">お申し込みありがとうございます</h2>
              <p className="text-sm text-text-muted mb-6">
                イベントへの参加申し込みを受け付けました。
                {isGuest && '確認メールをお送りしますのでご確認ください。'}
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/events">
                  <Button variant="outline">イベント一覧へ</Button>
                </Link>
                {isGuest && (
                  <Link href="/auth/register">
                    <Button>会員登録する</Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-padding">
      <div className="container-bond">
        <div className="max-w-lg mx-auto">
          <Link href={`/events/${params.id}`} className="text-sm text-text-muted hover:text-primary mb-6 inline-block">
            ← イベント詳細に戻る
          </Link>

          <h1 className="text-2xl font-bold mb-2">参加申込</h1>
          {event && <p className="text-text-muted text-sm mb-8">{event.title}</p>}

          {/* Toggle: Guest / Member */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsGuest(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                isGuest ? 'bg-white shadow-sm text-primary' : 'text-text-muted'
              }`}
            >
              ゲスト申込
            </button>
            <button
              onClick={() => setIsGuest(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                !isGuest ? 'bg-white shadow-sm text-primary' : 'text-text-muted'
              }`}
            >
              会員申込
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
          )}

          {isGuest ? (
            <Card>
              <form onSubmit={handleSubmit(onGuestSubmit)} className="space-y-5">
                <Input
                  id="guestName"
                  label="お名前"
                  placeholder="山田 太郎"
                  error={errors.guestName?.message}
                  {...register('guestName')}
                />
                <Input
                  id="guestEmail"
                  label="メールアドレス"
                  type="email"
                  placeholder="example@email.com"
                  error={errors.guestEmail?.message}
                  {...register('guestEmail')}
                />
                <Input
                  id="guestPhone"
                  label="電話番号"
                  type="tel"
                  placeholder="090-1234-5678"
                  error={errors.guestPhone?.message}
                  {...register('guestPhone')}
                />
                <Input
                  id="guestCompany"
                  label="会社名（任意）"
                  placeholder="株式会社〇〇"
                  {...register('guestCompany')}
                />
                <Input
                  id="numberOfGuests"
                  label="参加人数"
                  type="number"
                  min={1}
                  max={5}
                  error={errors.numberOfGuests?.message}
                  {...register('numberOfGuests', { valueAsNumber: true })}
                />
                <Textarea
                  id="message"
                  label="メッセージ（任意）"
                  placeholder="ご質問やご要望があればご記入ください"
                  {...register('message')}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '送信中...' : '申し込む'}
                </Button>
              </form>
              <p className="mt-4 text-xs text-text-muted text-center">
                <Link href="/auth/register" className="text-primary hover:underline">会員登録</Link>すると次回以降の申込がスムーズになります
              </p>
            </Card>
          ) : user ? (
            <Card>
              <form onSubmit={onMemberSubmit} className="space-y-5">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">ログイン中のアカウント</p>
                  <p className="text-sm text-text-muted">{user.name}（{user.email}）</p>
                  {user.company && <p className="text-sm text-text-muted">{user.company}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '送信中...' : 'このアカウントで申し込む'}
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <p className="text-text-muted mb-4">会員申込にはログインが必要です</p>
              <Link href={`/auth/login?redirect=/events/${params.id}/apply`}>
                <Button>ログインする</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
