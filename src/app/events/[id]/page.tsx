import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Users, CircleDollarSign } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { VENUES } from '@/lib/constants'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: event } = await supabase.from('events').select('title').eq('id', params.id).single()
  return { title: event?.title || 'Event' }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!event) notFound()

  const { count: applicationCount } = await supabase
    .from('event_applications')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .neq('status', 'cancelled')

  const isUpcoming = event.event_date >= new Date().toISOString().split('T')[0]
  const spotsLeft = event.capacity - (applicationCount || 0)

  return (
    <div className="section-padding">
      <div className="container-bond">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link href="/events" className="text-sm text-text-muted hover:text-primary mb-6 inline-block">
            ← イベント一覧に戻る
          </Link>

          <Card className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={event.venue_type === 'north' ? 'north' : 'south'}>
                {VENUES[event.venue_type as keyof typeof VENUES].label}
              </Badge>
              {!isUpcoming && <Badge>終了</Badge>}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-6">{event.title}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={18} className="text-primary flex-shrink-0" />
                <span>{formatDate(event.event_date)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={18} className="text-primary flex-shrink-0" />
                <span>{event.start_time?.slice(0, 5)}{event.end_time ? `〜${event.end_time.slice(0, 5)}` : '〜'}</span>
              </div>
              {event.venue_name && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={18} className="text-primary flex-shrink-0" />
                  <span>{event.venue_name}{event.venue_address ? ` (${event.venue_address})` : ''}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <CircleDollarSign size={18} className="text-primary flex-shrink-0" />
                <span>参加費 {formatCurrency(event.participation_fee)}（全額寄付）</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users size={18} className="text-primary flex-shrink-0" />
                <span>定員 {event.capacity}名（残り{spotsLeft > 0 ? spotsLeft : 0}名）</span>
              </div>
            </div>

            {event.description && (
              <div className="border-t border-border pt-6">
                <h2 className="font-bold mb-3">イベント詳細</h2>
                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}
          </Card>

          {isUpcoming && spotsLeft > 0 && (
            <div className="text-center">
              <Link href={`/events/${event.id}/apply`}>
                <Button size="lg" className="px-12">
                  このイベントに申し込む
                </Button>
              </Link>
              <p className="mt-3 text-xs text-text-muted">
                会員登録なしでもゲストとしてお申し込みいただけます
              </p>
            </div>
          )}

          {isUpcoming && spotsLeft <= 0 && (
            <div className="text-center">
              <p className="text-red-500 font-medium">定員に達しました</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
