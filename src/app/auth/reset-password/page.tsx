'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/profile`,
    })

    if (resetError) {
      setError('エラーが発生しました。もう一度お試しください')
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center card">
          <h2 className="text-xl font-bold mb-4">メールを送信しました</h2>
          <p className="text-text-muted text-sm mb-6">
            パスワードリセット用のリンクをメールで送信しました。メールをご確認ください。
          </p>
          <Link href="/auth/login" className="text-primary hover:underline font-medium text-sm">
            ログインページへ戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">パスワードリセット</h1>
          <p className="mt-2 text-sm text-text-muted">登録メールアドレスにリセットリンクを送信します</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
            )}
            <Input
              id="email"
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '送信中...' : 'リセットリンクを送信'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-text-muted hover:text-primary">
              ログインページへ戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
