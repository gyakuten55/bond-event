'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError(authError.message === 'User already registered'
        ? 'このメールアドレスは既に登録されています'
        : 'エラーが発生しました。もう一度お試しください')
      setLoading(false)
      return
    }

    if (authData.user) {
      // Update profile with name and company
      await supabase
        .from('users')
        .update({
          name: data.name,
          name_kana: data.nameKana,
          company: data.company || '',
        })
        .eq('id', authData.user.id)

      setSuccess(true)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">登録ありがとうございます</h2>
            <p className="text-text-muted text-sm mb-6">
              確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
            </p>
            <Link href="/auth/login" className="text-primary hover:underline font-medium text-sm">
              ログインページへ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">新規会員登録</h1>
          <p className="mt-2 text-sm text-text-muted">BONDのメンバーになりましょう</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
            )}

            <Input
              id="name"
              label="氏名"
              placeholder="山田 太郎"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              id="nameKana"
              label="フリガナ"
              placeholder="ヤマダ タロウ"
              error={errors.nameKana?.message}
              {...register('nameKana')}
            />

            <Input
              id="company"
              label="会社名（任意）"
              placeholder="株式会社〇〇"
              error={errors.company?.message}
              {...register('company')}
            />

            <Input
              id="email"
              label="メールアドレス"
              type="email"
              placeholder="example@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              id="password"
              label="パスワード"
              type="password"
              placeholder="8文字以上"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              id="confirmPassword"
              label="パスワード確認"
              type="password"
              placeholder="もう一度入力"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '登録中...' : '会員登録'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted">
            既にアカウントをお持ちの方は{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
