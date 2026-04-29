import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/shared/page-header'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'News',
  description: 'BONDからのお知らせ。交流会情報やアップデートをお届けします。',
}

export default async function NewsPage() {
  const supabase = createClient()

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      <PageHeader title="News" description="お知らせ" />

      <section className="section-padding">
        <div className="container-bond">
          <div className="max-w-3xl mx-auto">
            {news && news.length > 0 ? (
              <div className="space-y-4">
                {news.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`}>
                    <Card hover className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-text-muted mb-1">
                          {item.published_at ? formatDate(item.published_at) : formatDate(item.created_at)}
                        </p>
                        <h3 className="font-bold">{item.title}</h3>
                        {item.excerpt && (
                          <p className="text-sm text-text-muted mt-1 line-clamp-2">{item.excerpt}</p>
                        )}
                      </div>
                      <ChevronRight className="text-text-muted flex-shrink-0" size={20} />
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="お知らせはまだありません" />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
