import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  // Check admin role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch applications
  const { data: applications } = await supabase
    .from('event_applications')
    .select('*, users(name, email, company)')
    .eq('event_id', params.id)
    .order('created_at', { ascending: true })

  if (!applications) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Build CSV
  const headers = ['名前', 'メール', '電話番号', '会社', '区分', 'ステータス', '人数', 'メッセージ', '申込日']
  const rows = applications.map((app: any) => [
    app.users?.name || app.guest_name || '',
    app.users?.email || app.guest_email || '',
    app.guest_phone || '',
    app.users?.company || app.guest_company || '',
    app.user_id ? '会員' : 'ゲスト',
    app.status,
    app.number_of_guests,
    (app.message || '').replace(/"/g, '""'),
    app.created_at,
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map((cell: any) => `"${cell}"`).join(',')),
  ].join('\n')

  // Add BOM for Excel Japanese support
  const bom = '\uFEFF'

  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="applicants-${params.id}.csv"`,
    },
  })
}
