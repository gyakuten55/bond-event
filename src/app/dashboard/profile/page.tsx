'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { profileSchema, type ProfileInput } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  })

  const loadProfile = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setInitialLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      reset({
        name: profile.name,
        nameKana: profile.name_kana,
        company: profile.company,
        companyUrl: profile.company_url,
        businessDescription: profile.business_description,
        bio: profile.bio,
      })
    }
    setInitialLoading(false)
  }

  useEffect(() => {
    loadProfile()
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: ProfileInput) => {
    setLoading(true)
    setError('')
    setSuccess(false)
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('ログイン状態を確認できませんでした。再ログインしてください。')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        name: data.name,
        name_kana: data.nameKana,
        company: data.company || '',
        company_url: data.companyUrl || '',
        business_description: data.businessDescription || '',
        bio: data.bio || '',
      })
      .eq('id', user.id)

    if (updateError) {
      setError('更新に失敗しました。もう一度お試しください')
    } else {
      setSuccess(true)
      await loadProfile()
      successTimeoutRef.current = setTimeout(() => setSuccess(false), 4000)
    }
    setLoading(false)
  }

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">プロフィール編集</h1>
        <Card>
          <p className="text-sm text-text-muted">読み込み中…</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">プロフィール編集</h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 bg-green-50 text-green-600 text-sm p-3 rounded-lg">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              <span>プロフィールを更新しました</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input id="name" label="氏名" error={errors.name?.message} {...register('name')} />
            <Input id="nameKana" label="フリガナ" error={errors.nameKana?.message} {...register('nameKana')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input id="company" label="会社名" {...register('company')} />
            <Input id="companyUrl" label="会社URL" type="url" placeholder="https://" error={errors.companyUrl?.message} {...register('companyUrl')} />
          </div>

          <Textarea
            id="businessDescription"
            label="ビジネス紹介（メンバーページに表示されます）"
            placeholder="あなたのビジネスについて教えてください"
            {...register('businessDescription')}
          />

          <Textarea
            id="bio"
            label="自己紹介"
            placeholder="自己紹介をご記入ください"
            {...register('bio')}
          />

          <Button type="submit" disabled={loading || !isDirty}>
            {loading ? '更新中...' : 'プロフィールを更新'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
