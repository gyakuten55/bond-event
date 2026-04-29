import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'yyyy年M月d日（E）', { locale: ja })
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'yyyy年M月d日（E）HH:mm', { locale: ja })
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount)
}

const EVENT_IMAGE_COUNT = 11

export function getEventImage(seed: string | number) {
  const key = String(seed)
  let sum = 0
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i)
  const idx = (sum % EVENT_IMAGE_COUNT) + 1
  return `/media/events/event-${String(idx).padStart(2, '0')}.jpg`
}
