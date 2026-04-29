import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { APPLICATION_STATUS } from '@/lib/constants'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

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

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, title, event_date')
    .eq('id', params.id)
    .single()

  if (eventError || !event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  const { data: applications, error: appsError } = await supabase
    .from('event_applications')
    .select('*, users(name, email, company)')
    .eq('event_id', params.id)
    .order('created_at', { ascending: true })

  if (appsError) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }

  const escapeCsv = (value: unknown) => {
    const str = value == null ? '' : String(value)
    return `"${str.replace(/"/g, '""')}"`
  }

  const headers = ['名前', 'メール', '電話番号', '会社', '区分', 'ステータス', '人数', 'メッセージ', '申込日']
  const rows = (applications ?? []).map((app: any) => [
    app.users?.name || app.guest_name || '',
    app.users?.email || app.guest_email || '',
    app.guest_phone || '',
    app.users?.company || app.guest_company || '',
    app.user_id ? '会員' : 'ゲスト',
    APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.label || app.status,
    app.number_of_guests,
    app.message || '',
    app.created_at,
  ])

  const csv = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.map(escapeCsv).join(',')),
  ].join('\r\n')

  const bom = '﻿'
  const safeTitle = event.title.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 30) || 'event'
  const filename = `applicants-${event.event_date}-${safeTitle}.csv`

  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
