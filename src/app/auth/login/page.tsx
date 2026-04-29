'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push(redirect)
      }
      router.refresh()
    }
  }

  const handleDemoLogin = (role: 'admin' | 'member') => {
    document.cookie = `demo_role=${role}; path=/; max-age=86400`
    if (role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-3">Log in</p>
          <h1 className="text-2xl font-bold tracking-tight">アカウントにログイン</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="text-[13px] text-red-500 border-l-2 border-red-500 pl-4 py-1">
              {error}
            </div>
          )}

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

          <div className="text-right">
            <Link href="/auth/reset-password" className="text-[12px] text-text-muted hover:text-text-primary">
              パスワードを忘れた方
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </form>

        <p className="mt-8 text-[13px] text-text-muted">
          アカウントをお持ちでない方は{' '}
          <Link href="/auth/register" className="text-text-primary font-medium border-b border-text-primary pb-px">
            新規登録
          </Link>
        </p>

        {/* Demo Login */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-4">Demo Access</p>
          <div className="space-y-3">
            <button
              onClick={() => handleDemoLogin('admin')}
              className="w-full text-left px-5 py-4 border border-border hover:border-text-primary/30 transition-colors"
            >
              <span className="text-[13px] font-medium block">管理者としてログイン</span>
              <span className="text-[12px] text-text-muted mt-0.5 block">ダッシュボード・統計・全管理機能</span>
            </button>
            <button
              onClick={() => handleDemoLogin('member')}
              className="w-full text-left px-5 py-4 border border-border hover:border-text-primary/30 transition-colors"
            >
              <span className="text-[13px] font-medium block">メンバーとしてログイン</span>
              <span className="text-[12px] text-text-muted mt-0.5 block">マイページ・イベント申込・告知投稿</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
