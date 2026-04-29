import { cookies } from 'next/headers'
import { DemoExitButton } from './demo-exit-button'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { AlertTriangle } from 'lucide-react'

export function DemoBanner() {
  const role = cookies().get('demo_role')?.value
  const supabaseConfigured = isSupabaseConfigured()

  if (!supabaseConfigured) {
    return (
      <div className="bg-red-600 text-white text-sm">
        <div className="container-bond flex items-center gap-2 py-2">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span className="truncate">
            Supabase未設定です。.env.local の NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください。
          </span>
        </div>
      </div>
    )
  }

  if (!role) return null

  const label = role === 'admin' ? '管理者' : 'メンバー'

  return (
    <div className="bg-amber-500 text-white text-sm">
      <div className="container-bond flex items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span className="truncate">
            デモモード（{label}）で閲覧中です。本番データではありません。
          </span>
        </div>
        <DemoExitButton />
      </div>
    </div>
  )
}
