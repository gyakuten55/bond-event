import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('news').select('title').eq('id', params.id).single()
  return { title: data?.title || 'News' }
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('id', params.id)
    .eq('is_published', true)
    .single()

  if (!news) notFound()

  return (
    <div className="section-padding">
      <div className="container-bond">
        <div className="max-w-3xl mx-auto">
          <Link href="/news" className="text-sm text-text-muted hover:text-primary mb-6 inline-block">
            ← お知らせ一覧に戻る
          </Link>

          <Card>
            <p className="text-sm text-text-muted mb-2">
              {news.published_at ? formatDate(news.published_at) : formatDate(news.created_at)}
            </p>
            <h1 className="text-2xl font-bold mb-6">{news.title}</h1>
            <div className="prose max-w-none text-text-muted leading-relaxed whitespace-pre-wrap">
              {news.content}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
