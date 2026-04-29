import { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { SectionHeading } from '@/components/shared/section-heading'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { SUPPORT_ORGS, PARTICIPATION_FEE } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { Heart, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Support',
  description: 'BONDの支援活動。参加費は全額が3つの支援団体に寄付されます。',
}

export default async function SupportPage() {
  const supabase = createClient()

  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .order('donated_at', { ascending: false })

  const totalDonated = donations?.reduce((sum, d) => sum + d.total_amount, 0) || 0
  const totalEdeli = donations?.reduce((sum, d) => sum + d.edeli_amount, 0) || 0
  const totalBefrienders = donations?.reduce((sum, d) => sum + d.befrienders_amount, 0) || 0
  const totalHitoribocchi = donations?.reduce((sum, d) => sum + d.hitoribocchi_amount, 0) || 0

  return (
    <>
      <PageHeader
        title="Support"
        description="参加費は全額が支援団体に寄付されます"
      />

      {/* How it works */}
      <section className="section-padding">
        <div className="container-bond">
          <SectionHeading
            title="支援の仕組み"
            subtitle={`参加費${formatCurrency(PARTICIPATION_FEE)}は全額が以下の3団体に均等配分（各${formatCurrency(1000)}）して寄付されます`}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUPPORT_ORGS.map((org) => (
              <Card key={org.id} hover>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-1">{org.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{org.description}</p>
                <p className="text-sm text-text-muted leading-relaxed">{org.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Report */}
      <section className="section-padding bg-primary/5">
        <div className="container-bond">
          <SectionHeading
            title="寄付金レポート"
            subtitle="透明性を大切に、寄付金の使途を公開しています"
          />

          {/* Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Card className="text-center">
              <p className="text-sm text-text-muted mb-1">累計寄付総額</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalDonated)}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-text-muted mb-1">イーデリ</p>
              <p className="text-xl font-bold">{formatCurrency(totalEdeli)}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-text-muted mb-1">国際ビフレンダーズ</p>
              <p className="text-xl font-bold">{formatCurrency(totalBefrienders)}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-text-muted mb-1">ひとりぼっちにさせへんPJ</p>
              <p className="text-xl font-bold">{formatCurrency(totalHitoribocchi)}</p>
            </Card>
          </div>

          {/* Donation History */}
          {donations && donations.length > 0 ? (
            <Card>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                寄付履歴
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-text-muted">日付</th>
                      <th className="text-right py-3 px-2 font-medium text-text-muted">合計</th>
                      <th className="text-right py-3 px-2 font-medium text-text-muted">イーデリ</th>
                      <th className="text-right py-3 px-2 font-medium text-text-muted">ビフレンダーズ</th>
                      <th className="text-right py-3 px-2 font-medium text-text-muted">ひとりぼっちPJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d) => (
                      <tr key={d.id} className="border-b border-border/50">
                        <td className="py-3 px-2">{d.donated_at}</td>
                        <td className="py-3 px-2 text-right font-medium">{formatCurrency(d.total_amount)}</td>
                        <td className="py-3 px-2 text-right">{formatCurrency(d.edeli_amount)}</td>
                        <td className="py-3 px-2 text-right">{formatCurrency(d.befrienders_amount)}</td>
                        <td className="py-3 px-2 text-right">{formatCurrency(d.hitoribocchi_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <p className="text-text-muted text-sm">まだ寄付記録がありません</p>
            </Card>
          )}
        </div>
      </section>
    </>
  )
}
