import { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { SectionHeading } from '@/components/shared/section-heading'
import { Card } from '@/components/ui/card'
import { SUPPORT_ORGS, PARTICIPATION_FEE } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Support',
  description: 'BONDの支援活動。参加費は全額が3つの支援団体に寄付されます。',
}

export default function SupportPage() {
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
    </>
  )
}
