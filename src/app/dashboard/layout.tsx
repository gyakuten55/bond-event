'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, User, Megaphone, LogOut } from 'lucide-react'

const sidebarItems = [
  { href: '/dashboard', label: 'マイページ', icon: LayoutDashboard },
  { href: '/dashboard/events', label: '参加イベント', icon: Calendar },
  { href: '/dashboard/profile', label: 'プロフィール', icon: User },
  { href: '/dashboard/announcements', label: 'ビジネス告知', icon: Megaphone },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = 'demo_role=; path=/; max-age=0'
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-surface-warm">
      <div className="container-bond py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="space-y-0.5">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-[13px] text-text-muted hover:text-text-primary hover:bg-white transition-colors"
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-[13px] text-text-muted hover:text-red-500 w-full transition-colors mt-4"
              >
                <LogOut size={16} />
                ログアウト
              </button>
            </nav>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
