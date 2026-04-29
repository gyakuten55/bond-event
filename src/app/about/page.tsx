import { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader } from '@/components/shared/page-header'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const scenesImages = [
  '/media/events/event-04.jpg',
  '/media/events/event-05.jpg',
  '/media/events/event-06.jpg',
  '/media/events/event-07.jpg',
]

export const metadata: Metadata = {
  title: 'About',
  description: 'BONDについて - WE ARE NOT ALONE チャリティービジネス交流会のコンセプトと歴史',
}

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About" description="私たちは一人ではない" />

      {/* Concept */}
      <section className="section-padding border-b border-border">
        <div className="container-bond">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-3">Concept</p>
              <h2 className="text-2xl font-bold tracking-tight">BONDのコンセプト</h2>
            </div>
            <div className="lg:col-span-8">
              <div className="text-[15px] text-text-muted leading-[1.9] space-y-6 max-w-xl">
                <p>
                  BONDは2022年4月に発足した、関西発のチャリティービジネス交流会です。
                </p>
                <p>
                  「みんなで交流して遊びや仕事に役立て、身近で困ってる人に手を差し伸べよう」という想いのもと、
                  ビジネス交流と社会貢献を同時に実現する場を提供しています。
                </p>
                <p>
                  参加費3,000円は全額が支援団体への寄付に充てられます。
                  各回3つの支援団体にそれぞれ1,000円ずつ均等に配分されます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding border-b border-border">
        <div className="container-bond">
          <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-12">Features</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-14">
            {[
              {
                num: '01',
                title: '年4回の定期開催',
                desc: '3月・6月・9月・12月の年4回、水曜日に開催。大阪北（昼12:00〜）と大阪南（夜17:00〜）の2会場で同時開催。',
              },
              {
                num: '02',
                title: '参加費は全額寄付',
                desc: '参加費3,000円は全額が支援団体に寄付されます。参加するだけで社会貢献ができる仕組みです。',
              },
              {
                num: '03',
                title: '業種を超えた交流',
                desc: '様々な業界のビジネスパーソンが集まり、情報交換や人脈づくりができます。新しいビジネスチャンスの発見も。',
              },
              {
                num: '04',
                title: 'ビジネス告知の機会',
                desc: 'メンバーは自身のビジネスやサービスを告知できます。互いのビジネスを応援し合えるコミュニティです。',
              },
            ].map((item) => (
              <div key={item.num} className="group">
                <span className="text-[11px] text-text-muted tracking-extra-wide">{item.num}</span>
                <h3 className="text-lg font-bold mt-2 mb-3">{item.title}</h3>
                <p className="text-[14px] text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenes from BOND */}
      <section className="section-padding bg-surface-warm border-b border-border">
        <div className="container-bond">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-12">
            <div className="lg:col-span-4">
              <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-3">Scenes</p>
              <h2 className="text-2xl font-bold tracking-tight">Scenes from BOND</h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-[15px] text-text-muted leading-[1.9] max-w-xl">
                これまでに開催されたBOND交流会での一場面。
                業種を超えたビジネスパーソンが集まり、情報交換や人脈作りが行われています。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {scenesImages.map((src, i) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden group">
                <Image
                  src={src}
                  alt={`BOND 交流会の場面 ${i + 1}`}
                  fill
                  sizes="(min-width: 640px) 48vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Representative */}
      <section className="section-padding">
        <div className="container-bond">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-3">Representative</p>
              <h2 className="text-2xl font-bold tracking-tight">代表紹介</h2>
            </div>
            <div className="lg:col-span-8 max-w-xl">
              <div className="border-l-2 border-gold pl-8">
                <h3 className="text-xl font-bold">中村 智</h3>
                <p className="text-[13px] text-gold font-medium mt-1 mb-6 tracking-wide">Satoshi Nakamura</p>
                <div className="text-[14px] text-text-muted leading-[1.9] space-y-4">
                  <p>
                    クロスグループ代表。創業23年、法人5社、従業員150名。
                    大阪でカフェバー10店舗を展開する飲食事業、和歌山でのリゾート事業、障害者雇用A型事業所の運営など、
                    幅広い事業を手がける。
                  </p>
                  <p>
                    座右の銘は「Bad days tell more than good days」。
                    ビジネスの経験を活かしながら、BONDを通じて社会貢献活動に取り組んでいる。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface-warm border-t border-border">
        <div className="container-bond text-center">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">イベントに参加する</h2>
          <p className="text-[14px] text-text-muted mb-8">初めての方も大歓迎です</p>
          <Link href="/events" className="btn-brand inline-flex items-center gap-2">
            イベント一覧 <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
