import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { assertSupabaseConfigured, isSupabaseConfigured } from './config'

function createMockClient() {
  const mockQuery = () => ({
    select: () => mockQuery(),
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase未設定です。.env.localにSupabaseのURLとキーを設定してください。' } }),
    update: () => Promise.resolve({ data: null, error: { message: 'Supabase未設定です。' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Supabase未設定です。' } }),
    eq: () => mockQuery(),
    neq: () => mockQuery(),
    in: () => mockQuery(),
    is: () => mockQuery(),
    not: () => mockQuery(),
    gte: () => mockQuery(),
    order: () => mockQuery(),
    limit: () => mockQuery(),
    single: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: (value: { data: null; error: null }) => void) =>
      Promise.resolve({ data: null, error: null }).then(resolve),
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    from: () => mockQuery(),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase未設定です。.env.localにSupabaseのURLとキーを設定してください。' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase未設定です。' } }),
      resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Supabase未設定です。' } }),
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}

export function createClient() {
  assertSupabaseConfigured()
  if (!isSupabaseConfigured()) {
    return createMockClient()
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
