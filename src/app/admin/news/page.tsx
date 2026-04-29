import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default async function AdminNewsPage() {
  const supabase = createClient()
  const { data: news } = await supabase.from('news').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ニュース管理</h1>
        <Link href="/admin/news/new">
          <Button size="sm"><Plus size={16} className="mr-1" />新規作成</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-text-muted">タイトル</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">ステータス</th>
                <th className="text-left py-3 px-2 font-medium text-text-muted">作成日</th>
                <th className="text-right py-3 px-2 font-medium text-text-muted">操作</th>
              </tr>
            </thead>
            <tbody>
              {news?.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{item.title}</td>
                  <td className="py-3 px-2">
                    <Badge variant={item.is_published ? 'success' : 'default'}>
                      {item.is_published ? '公開中' : '下書き'}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-text-muted">{formatDate(item.created_at)}</td>
                  <td className="py-3 px-2 text-right">
                    <Link href={`/admin/news/${item.id}/edit`} className="text-primary hover:underline text-sm">
                      編集
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
