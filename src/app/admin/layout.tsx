'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Megaphone,
  Newspaper,
  Mail,
  Heart,
  BarChart3,
  LogOut,
} from 'lucide-react'

const sidebarItems = [
  { href: '/admin', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/admin/events', label: 'イベント管理', icon: Calendar },
  { href: '/admin/members', label: 'メンバー管理', icon: Users },
  { href: '/admin/announcements', label: 'ビジネス告知', icon: Megaphone },
  { href: '/admin/news', label: 'ニュース管理', icon: Newspaper },
  { href: '/admin/contacts', label: 'お問い合わせ', icon: Mail },
  { href: '/admin/donations', label: '寄付金管理', icon: Heart },
  { href: '/admin/analytics', label: '統計・分析', icon: BarChart3 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = 'demo_role=; path=/; max-age=0'
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-surface-warm">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-[72px] bg-white border-r border-border">
          <div className="px-5 py-5 border-b border-border">
            <p className="text-[11px] tracking-extra-wide text-text-muted uppercase">Admin</p>
          </div>
          <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-text-muted hover:text-text-primary hover:bg-surface-warm transition-colors"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-3 border-t border-border space-y-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-text-muted hover:text-text-primary">
              サイトに戻る
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-text-muted hover:text-red-500 w-full transition-colors"
            >
              <LogOut size={16} />
              ログアウト
            </button>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden fixed top-[72px] left-0 right-0 z-40 bg-white border-b border-border overflow-x-auto">
          <div className="flex px-3 py-2 gap-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-2 text-[11px] text-text-muted hover:text-text-primary whitespace-nowrap tracking-wide"
              >
                <item.icon size={13} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 lg:pl-60 pt-10 lg:pt-0">
          <div className="p-6 lg:p-10 max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
