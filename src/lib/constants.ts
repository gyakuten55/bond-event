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
