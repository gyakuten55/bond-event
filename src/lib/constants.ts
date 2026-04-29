export const SITE_NAME = 'BOND'
export const SITE_DESCRIPTION = 'チャリティービジネス交流会 BOND - WE ARE NOT ALONE'
export const SITE_URL = 'https://cross-bond.jp'
export const CONTACT_EMAIL = 'info@cross-bond.jp'

export const PARTICIPATION_FEE = 3000

export const SUPPORT_ORGS = [
  {
    id: 'edeli',
    name: 'イーデリ',
    description: 'ホームレス支援',
    detail: '路上生活者への食事提供や生活支援を行う団体です。',
  },
  {
    id: 'befrienders',
    name: '国際ビフレンダーズ',
    description: '自殺防止支援',
    detail: '自殺予防のための相談・支援活動を行う国際的な団体です。',
  },
  {
    id: 'hitoribocchi',
    name: 'ひとりぼっちにさせへんプロジェクト',
    description: 'いじめ・引きこもり・更生支援',
    detail: 'いじめ、引きこもり、社会復帰を支援する団体です。',
  },
] as const

export const VENUES = {
  north: { label: '大阪北（昼間）', time: '12:00〜', color: 'blue' },
  south: { label: '大阪南（夜間）', time: '17:00〜', color: 'orange' },
} as const

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/members', label: 'Members' },
  { href: '/support', label: 'Support' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
] as const

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export const APPLICATION_STATUS: Record<
  'pending' | 'confirmed' | 'cancelled' | 'attended',
  { label: string; variant: BadgeVariant }
> = {
  pending: { label: '受付中', variant: 'warning' },
  confirmed: { label: '参加確定', variant: 'success' },
  cancelled: { label: 'キャンセル', variant: 'danger' },
  attended: { label: '参加済み', variant: 'info' },
}

export const EVENT_STATUS: Record<
  'draft' | 'published' | 'cancelled' | 'completed',
  { label: string; variant: BadgeVariant }
> = {
  draft: { label: '下書き', variant: 'default' },
  published: { label: '公開中', variant: 'success' },
  cancelled: { label: '中止', variant: 'danger' },
  completed: { label: '終了', variant: 'warning' },
}

export const ANNOUNCEMENT_STATUS: Record<
  'draft' | 'pending' | 'approved' | 'rejected',
  { label: string; variant: BadgeVariant }
> = {
  draft: { label: '下書き', variant: 'default' },
  pending: { label: '審査中', variant: 'warning' },
  approved: { label: '承認', variant: 'success' },
  rejected: { label: '却下', variant: 'danger' },
}
