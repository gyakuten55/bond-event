'use client'

import { useRouter } from 'next/navigation'

export function DemoExitButton() {
  const router = useRouter()

  const exitDemo = () => {
    document.cookie = 'demo_role=; path=/; max-age=0'
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={exitDemo}
      className="text-xs underline underline-offset-2 hover:no-underline flex-shrink-0"
    >
      デモを終了
    </button>
  )
}
