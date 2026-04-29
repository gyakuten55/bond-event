const PLACEHOLDER_PATTERNS = ['your_supabase', 'your_service_role']

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return false
  if (!url.startsWith('http')) return false
  if (PLACEHOLDER_PATTERNS.some((p) => url.includes(p) || anonKey.includes(p))) return false
  return true
}

export function assertSupabaseConfigured() {
  if (isSupabaseConfigured()) return

  const message =
    'Supabaseの環境変数が未設定です。NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください。'

  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

  if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
    throw new Error(`[supabase] ${message}`)
  }

  if (typeof window === 'undefined') {
    console.warn(`[supabase] ${message} モッククライアントで継続します。`)
  }
}
