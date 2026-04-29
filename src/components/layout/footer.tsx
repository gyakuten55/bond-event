import Link from 'next/link'
import { CONTACT_EMAIL, NAV_ITEMS } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-text-primary text-white">
      <div className="container-bond">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="text-lg font-bold tracking-extra-wide mb-2">BOND</p>
            <p className="text-[11px] tracking-extra-wide text-brand-light uppercase mb-4">We Are Not Alone</p>
            <p className="text-[13px] text-white/50 leading-relaxed max-w-xs">
              交流して情報交換や人脈作りをして仕事に役立て、身近で困ってる人に手を差し伸べよう。
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] tracking-extra-wide text-white/30 uppercase mb-5">Menu</p>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[13px] text-white/50 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] tracking-extra-wide text-white/30 uppercase mb-5">Support</p>
            <ul className="space-y-3 text-[13px] text-white/50">
              <li>イーデリ</li>
              <li>国際ビフレンダーズ</li>
              <li>ひとりぼっちにさせへんPJ</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-[11px] tracking-extra-wide text-white/30 uppercase mb-5">Contact</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[13px] text-white/50 hover:text-white block">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} BOND. All rights reserved.
          </p>
          <p className="text-[11px] text-white/30">
            Charity Exchange Meeting
          </p>
        </div>
      </div>
    </footer>
  )
}
