import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { warnIfSupabaseMissing, isSupabaseConfigured } from './config'

function createMockClient() {
  const mockQuery = () => ({
    select: () => mockQuery(),
    insert: () => mockQuery(),
    update: () => mockQuery(),
    delete: () => mockQuery(),
    eq: () => mockQuery(),
    neq: () => mockQuery(),
    in: () => mockQuery(),
    is: () => mockQuery(),
    not: () => mockQuery(),
    gte: () => mockQuery(),
    order: () => mockQuery(),
    limit: () => mockQuery(),
    single: () => Promise.resolve({ data: null, error: null, count: 0 }),
    then: (resolve: (value: { data: null; error: null; count: number }) => void) =>
      Promise.resolve({ data: null, error: null, count: 0 }).then(resolve),
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    from: () => mockQuery(),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}

export function createClient() {
  if (!isSupabaseConfigured()) {
    warnIfSupabaseMissing()
    return createMockClient()
  }

  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component cannot set cookies
          }
        },
      },
    }
  )
}
