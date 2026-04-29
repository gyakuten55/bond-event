import { isSupabaseConfigured } from '@/lib/supabase/config'
import { AlertTriangle } from 'lucide-react'

export function SetupBanner() {
  if (isSupabaseConfigured()) return null

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
