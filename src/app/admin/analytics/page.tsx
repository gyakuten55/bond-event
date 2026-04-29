'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function AnalyticsPage() {
  const [participationData, setParticipationData] = useState<any[]>([])
  const [memberGrowth, setMemberGrowth] = useState<any[]>([])
  const [venueComparison, setVenueComparison] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    avgAttendance: 0,
    guestConversion: 0,
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      const supabase = createClient()

      // Get all events with application counts
      const { data: events } = await supabase
        .from('events')
        .select('id, title, event_date, venue_type')
        .in('status', ['published', 'completed'])
        .order('event_date', { ascending: true })

      if (events) {
        const participationPromises = events.map(async (event: { id: string; title: string; event_date: string; venue_type: string }) => {
          const { count: total } = await supabase
            .from('event_applications')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id)
            .neq('status', 'cancelled')

          const { count: attended } = await supabase
            .from('event_applications')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id)
            .eq('status', 'attended')

          return {
            name: event.title.replace('BOND交流会 ', ''),
            date: event.event_date,
            venue: event.venue_type,
            申込数: total || 0,
            参加数: attended || 0,
          }
        })

        const participation = await Promise.all(participationPromises)
        setParticipationData(participation.slice(-8))

        // Venue comparison
        const northTotal = participation.filter(p => p.venue === 'north').reduce((s, p) => s + p.申込数, 0)
        const southTotal = participation.filter(p => p.venue === 'south').reduce((s, p) => s + p.申込数, 0)
        setVenueComparison([
          { name: '大阪北', value: northTotal },
          { name: '大阪南', value: southTotal },
        ])
      }

      // Member growth by month
      const { data: members } = await supabase
        .from('users')
        .select('created_at')
        .eq('status', 'approved')
        .eq('role', 'member')
        .order('created_at', { ascending: true })

      if (members) {
        const monthly: Record<string, number> = {}
        let cumulative = 0
        members.forEach((m: { created_at: string }) => {
          const month = m.created_at.slice(0, 7)
          cumulative++
          monthly[month] = cumulative
        })
        setMemberGrowth(Object.entries(monthly).map(([month, count]) => ({ month, 会員数: count })))
      }

      // Overall stats
      const { count: memberCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .eq('role', 'member')

      const { count: eventCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .in('status', ['published', 'completed'])

      // Guest to member conversion
      const { data: guestApps } = await supabase
        .from('event_applications')
        .select('guest_email')
        .is('user_id', null)
        .not('guest_email', 'is', null)

      const guestEmails = new Set(guestApps?.map((a: { guest_email: string }) => a.guest_email) || [])
      let converted = 0
      if (guestEmails.size > 0) {
        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .in('email', Array.from(guestEmails))
        converted = count || 0
      }

      setStats(prev => ({
        ...prev,
        totalMembers: memberCount || 0,
        totalEvents: eventCount || 0,
        guestConversion: guestEmails.size > 0 ? Math.round((converted / guestEmails.size) * 100) : 0,
      }))
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">統計・分析</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-xs text-text-muted mb-1">総会員数</p>
          <p className="text-2xl font-bold">{stats.totalMembers}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-text-muted mb-1">イベント数</p>
          <p className="text-2xl font-bold">{stats.totalEvents}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-text-muted mb-1">ゲスト→会員転換率</p>
          <p className="text-2xl font-bold">{stats.guestConversion}%</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-text-muted mb-1">データ更新</p>
          <p className="text-sm text-text-muted">リアルタイム</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participation Trend */}
        <Card>
          <h3 className="font-bold mb-4">参加推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={participationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DD" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="申込数" stroke="#4A7C59" strokeWidth={2} />
              <Line type="monotone" dataKey="参加数" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Member Growth */}
        <Card>
          <h3 className="font-bold mb-4">会員数推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={memberGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DD" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="会員数" stroke="#4A7C59" fill="#4A7C59" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Venue Comparison */}
        <Card>
          <h3 className="font-bold mb-4">会場別比較</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={venueComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DD" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" name="申込数">
                <Cell fill="#3B82F6" />
                <Cell fill="#F97316" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
