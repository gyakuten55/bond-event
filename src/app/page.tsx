import Link from 'next/link'
import Image from 'next/image'
import { SUPPORT_ORGS } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'

const supportImages = [
  '/media/events/event-09.jpg',
  '/media/events/event-10.jpg',
  '/media/events/event-11.jpg',
]

const galleryImages = [
  '/media/events/event-01.jpg',
  '/media/events/event-02.jpg',
  '/media/events/event-05.jpg',
  '/media/events/event-06.jpg',
  '/media/events/event-07.jpg',
  '/media/events/event-08.jpg',
  '/media/events/event-04.jpg',
  '/media/events/event-10.jpg',
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-brand-dark text-white">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-brand/70" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-transparent to-brand-dark/60" aria-hidden="true" />

        <div className="container-bond relative z-10">
          <div className="max-w-2xl">
            <p className="text-[11px] tracking-extra-wide text-white/70 uppercase mb-8">
              Charity Exchange Meeting
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-sm">
              WE ARE<br />NOT ALONE
            </h1>
            <div className="w-12 h-px bg-white/80 mt-8 mb-8" />
            <p className="text-[15px] text-white/80 leading-relaxed max-w-md">
              みんなで交流して遊びや仕事に役立て、身近で困ってる人に手を差し伸べよう。
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/events" className="bg-white text-brand-dark px-8 py-4 text-[13px] tracking-wide font-medium hover:bg-white/90 transition-colors">
                イベントに参加する
              </Link>
              <Link href="/about" className="border border-white/40 text-white px-8 py-4 text-[13px] tracking-wide font-medium hover:border-white hover:bg-white/10 transition-colors">
                BONDについて
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-b border-border">
        <div className="container-bond">
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="py-12 sm:py-16 text-center">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-brand">2022</p>
              <p className="text-[12px] text-text-muted mt-2 tracking-wide">発足</p>
            </div>
            <div className="py-12 sm:py-16 text-center">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-brand">年4回</p>
              <p className="text-[12px] text-text-muted mt-2 tracking-wide">定期開催</p>
            </div>
            <div className="py-12 sm:py-16 text-center">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-brand">全額</p>
              <p className="text-[12px] text-text-muted mt-2 tracking-wide">寄付</p>
            </div>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section className="section-padding">
        <div className="container-bond">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/media/events/event-03.jpg"
                alt="BOND 交流会の様子"
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-brand" />
            </div>
            <div>
              <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-4">Concept</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-8">
                交流が生む力を、<br />社会の力に変える。
              </h2>
              <div className="space-y-6">
                <p className="text-[15px] text-text-muted leading-[1.9]">
                  BONDは、ビジネス交流と社会貢献を同時に実現するチャリティー交流会です。
                  業種を超えた出会いから新しいビジネスチャンスが生まれ、参加費3,000円は全額が支援団体に寄付されます。
                </p>
                <p className="text-[15px] text-text-muted leading-[1.9]">
                  大阪北（昼間）と大阪南（夜間）の2会場で、3月・6月・9月・12月の年4回開催。
                  メンバー同士が互いのビジネスを応援し合えるコミュニティを作っています。
                </p>
                <Link href="/about" className="inline-flex items-center gap-2 text-[13px] font-medium text-brand border-b border-brand pb-1 hover:opacity-70 transition-opacity mt-2">
                  もっと詳しく <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding bg-surface-warm">
        <div className="container-bond">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
            <div>
              <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-4">Gallery</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">交流会の様子</h2>
            </div>
            <p className="text-[13px] text-text-muted max-w-sm">
              これまでに開催されたBOND交流会のひとコマ。業種を超えた出会いがここにあります。
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {galleryImages.map((src, i) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden group"
              >
                <Image
                  src={src}
                  alt={`BOND 交流会のひとコマ ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 22vw, 48vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="section-padding">
        <div className="container-bond">
          <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-4">Support</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
            <h2 className="text-3xl font-bold tracking-tight">支援先団体</h2>
            <p className="text-[13px] text-text-muted">参加費は3団体に均等配分して全額寄付されます</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUPPORT_ORGS.map((org, i) => (
              <div key={org.id} className="border border-border bg-white flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={supportImages[i]}
                    alt={`${org.name} に関連する活動の様子`}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-8 sm:p-10">
                  <span className="text-[11px] text-text-muted tracking-extra-wide">0{i + 1}</span>
                  <h3 className="text-lg font-bold mt-3 mb-2">{org.name}</h3>
                  <p className="text-[12px] text-brand font-medium tracking-wide mb-4">{org.description}</p>
                  <p className="text-[14px] text-text-muted leading-relaxed">{org.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/support" className="inline-flex items-center gap-2 text-[13px] font-medium text-text-primary border-b border-text-primary pb-1 hover:opacity-60 transition-opacity">
              支援活動の詳細 <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 bg-brand-50">
        <div className="container-bond text-center">
          <p className="text-[11px] tracking-extra-wide text-brand uppercase mb-6">Join Us</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
            BONDに参加しませんか？
          </h2>
          <p className="text-[15px] text-text-muted max-w-md mx-auto mb-10">
            初めての方も大歓迎です。まずは気軽にイベントにお越しください。
          </p>
          <Link href="/events" className="btn-brand inline-block">
            次回のイベントを見る
          </Link>
        </div>
      </section>
    </>
  )
}
