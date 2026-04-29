import { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { createClient } from '@/lib/supabase/server'
import { User, Building2, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Members',
  description: 'BONDのメンバー紹介。様々な業種のビジネスパーソンが参加しています。',
}

export default async function MembersPage() {
  const supabase = createClient()

  const { data: members } = await supabase
    .from('users')
    .select('id, name, company, business_description, photo_url, company_url')
    .eq('status', 'approved')
    .eq('role', 'member')
    .order('created_at', { ascending: true })

  return (
    <>
      <PageHeader
        title="Members"
        description="BONDの仲間たち"
      />

      <section className="section-padding">
        <div className="container-bond">
          {members && members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member) => (
                <Card key={member.id} hover className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-primary" size={32} />
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  {member.company && (
                    <div className="flex items-center justify-center gap-1 mt-1 text-sm text-text-muted">
                      <Building2 size={14} />
                      {member.company_url ? (
                        <a
                          href={member.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary inline-flex items-center gap-1"
                        >
                          {member.company}
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        member.company
                      )}
                    </div>
                  )}
                  {member.business_description && (
                    <p className="mt-3 text-sm text-text-muted leading-relaxed line-clamp-3">
                      {member.business_description}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="メンバーがまだいません"
              description="メンバーが承認されると表示されます"
            />
          )}
        </div>
      </section>
    </>
  )
}
