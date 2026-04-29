'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/50">
      <div className="container-bond">
        <div className="flex items-center justify-between h-[80px]">
          <Link href="/" className="flex items-center" aria-label="BOND - charity exchange meeting">
            <Image
              src="/logo.png"
              alt="BOND charity exchange meeting"
              width={200}
              height={80}
              priority
              className="h-14 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] tracking-wide text-text-muted hover:text-text-primary uppercase"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <Link href="/auth/login" className="text-[13px] tracking-wide text-text-muted hover:text-text-primary">
              Log in
            </Link>
            <Link href="/events" className="btn-brand">
              JOIN
            </Link>
          </div>

          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニュー"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden pb-6 pt-2">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm tracking-wide text-text-muted hover:text-text-primary py-3 border-b border-border/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-4">
                <Link
                  href="/auth/login"
                  className="btn-outline flex-1 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/events"
                  className="btn-brand flex-1 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  JOIN
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
