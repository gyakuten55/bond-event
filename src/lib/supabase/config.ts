const PLACEHOLDER_PATTERNS = ['your_supabase', 'your_service_role']

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return false
  if (!url.startsWith('http')) return false
  if (PLACEHOLDER_PATTERNS.some((p) => url.includes(p) || anonKey.includes(p))) return false
  return true
}

let warned = false

export function warnIfSupabaseMissing() {
  if (isSupabaseConfigured()) return
  if (warned) return
  warned = true

  const message =
    'Supabaseの環境変数が未設定です。NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください。モッククライアントで継続します。'

  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      console.error(`[supabase] ${message}`)
    } else {
      console.warn(`[supabase] ${message}`)
    }
  }
}
