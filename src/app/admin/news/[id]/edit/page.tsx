'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { newsSchema, type NewsInput } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function EditNewsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
  })

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('news').select('*').eq('id', params.id).single()
      if (data) {
        reset({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          isPublished: data.is_published,
        })
      }
    }
    fetch()
  }, [params.id, reset])

  const onSubmit = async (data: NewsInput) => {
    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.from('news').update({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || '',
      is_published: data.isPublished,
      published_at: data.isPublished ? new Date().toISOString() : null,
    }).eq('id', params.id)

    if (updateError) {
      setError('エラーが発生しました')
      setLoading(false)
    } else {
      router.push('/admin/news')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/news" className="text-sm text-text-muted hover:text-primary">← ニュース一覧</Link>
        <h1 className="text-2xl font-bold mt-2">ニュース編集</h1>
      </div>
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          <Input id="title" label="タイトル" error={errors.title?.message} {...register('title')} />
          <Textarea id="excerpt" label="要約（任意）" {...register('excerpt')} />
          <Textarea id="content" label="本文" className="min-h-[200px]" error={errors.content?.message} {...register('content')} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="rounded border-border" {...register('isPublished')} />
            公開する
          </label>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? '更新中...' : '更新する'}</Button>
            <Link href="/admin/news"><Button type="button" variant="ghost">キャンセル</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
