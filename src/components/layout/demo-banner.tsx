import { cookies } from 'next/headers'
import { DemoExitButton } from './demo-exit-button'
import { AlertTriangle } from 'lucide-react'

export function DemoBanner() {
  const role = cookies().get('demo_role')?.value
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
