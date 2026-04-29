'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { announcementSchema, type AnnouncementInput } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function NewAnnouncementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<AnnouncementInput>({
    resolver: zodResolver(announcementSchema),
  })

  const onSubmit = async (data: AnnouncementInput) => {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: insertError } = await supabase.from('business_announcements').insert({
      user_id: user.id,
      title: data.title,
      content: data.content,
      status: 'pending',
    })

    if (insertError) {
      setError('エラーが発生しました。もう一度お試しください')
      setLoading(false)
    } else {
      router.push('/dashboard/announcements')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/announcements" className="text-sm text-text-muted hover:text-primary">
          ← ビジネス告知一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold mt-2">ビジネス告知 新規作成</h1>
        <p className="text-sm text-text-muted mt-1">投稿後、管理者の承認を経て公開されます</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

          <Input
            id="title"
            label="タイトル"
            placeholder="告知のタイトル"
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            id="content"
            label="内容"
            placeholder="ビジネスの告知内容を記入してください"
            className="min-h-[200px]"
            error={errors.content?.message}
            {...register('content')}
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? '投稿中...' : '投稿する'}
            </Button>
            <Link href="/dashboard/announcements">
              <Button type="button" variant="ghost">キャンセル</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
