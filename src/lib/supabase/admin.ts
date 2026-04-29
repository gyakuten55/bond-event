import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey || serviceRoleKey.includes('your_service_role')) {
    throw new Error(
      'Supabase Admin clientの環境変数が未設定です。SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください。'
    )
  }

  return createClient<Database>(url, serviceRoleKey)
}
