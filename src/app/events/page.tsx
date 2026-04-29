import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/empty-state'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getEventImage } from '@/lib/utils'
import { VENUES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Events',
  description: 'BONDの交流会・イベント情報。次回開催日程と過去のイベント一覧。',
}

export default async function EventsPage() {
  const supabase = createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .in('status', ['published', 'completed'])
    .order('event_date', { ascending: false })

  const now = new Date().toISOString().split('T')[0]
  const upcomingEvents = events?.filter(e => e.event_date >= now) || []
  const pastEvents = events?.filter(e => e.event_date < now) || []

  return (
    <>
      <PageHeader
        title="Events"
        description="BONDの交流会・イベント情報"
      />

      <section className="section-padding">
        <div className="container-bond">
          {/* Upcoming Events */}
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="text-primary" size={22} />
            今後のイベント
          </h2>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group bg-surface border border-border hover:border-brand/40 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={getEventImage(event.id)}
                      alt={event.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant={event.venue_type === 'north' ? 'north' : 'south'}>
                        {VENUES[event.venue_type as keyof typeof VENUES].label}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs text-text-muted">
                        定員 {event.capacity}名
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3">{event.title}</h3>
                    <div className="space-y-2 text-sm text-text-muted">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDate(event.event_date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {event.start_time?.slice(0, 5)}{event.end_time ? `〜${event.end_time.slice(0, 5)}` : '〜'}
                      </div>
                      {event.venue_name && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {event.venue_name}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-sm text-brand font-medium">
                        詳細・申込はこちら →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mb-16">
              <EmptyState
                title="現在予定されているイベントはありません"
                description="新しいイベントが公開されるまでお待ちください"
              />
            </div>
          )}

          {/* Past Events */}
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="text-text-muted" size={22} />
            過去のイベント
          </h2>

          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group bg-surface border border-border hover:border-brand/40 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={getEventImage(event.id)}
                      alt={event.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={event.venue_type === 'north' ? 'north' : 'south'}>
                        {VENUES[event.venue_type as keyof typeof VENUES].label}
                      </Badge>
                      <Badge>終了</Badge>
                    </div>
                    <h3 className="font-bold mb-2">{event.title}</h3>
                    <p className="text-sm text-text-muted">
                      {formatDate(event.event_date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="過去のイベントはありません" />
          )}
        </div>
      </section>
    </>
  )
}
