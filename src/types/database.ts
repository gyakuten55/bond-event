// Type aliases for use in components
export type UserRole = 'member' | 'admin'
export type UserStatus = 'pending' | 'approved' | 'rejected'
export type EventVenue = 'north' | 'south'
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'
export type ApplicationStatus = 'pending' | 'confirmed' | 'cancelled' | 'attended'
export type AnnouncementStatus = 'draft' | 'pending' | 'approved' | 'rejected'
export type ContactStatus = 'unread' | 'read' | 'replied'

// Row types for use in components
export interface UserRow {
  id: string
  email: string
  name: string
  name_kana: string
  company: string
  company_url: string
  business_description: string
  bio: string
  photo_url: string
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
}

export interface EventRow {
  id: string
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string | null
  venue_type: EventVenue
  venue_name: string
  venue_address: string
  capacity: number
  participation_fee: number
  status: EventStatus
  image_url: string
  created_at: string
  updated_at: string
}

export interface EventApplicationRow {
  id: string
  event_id: string
  user_id: string | null
  guest_name: string | null
  guest_email: string | null
  guest_phone: string | null
  guest_company: string | null
  number_of_guests: number
  message: string
  status: ApplicationStatus
  applied_at: string
  created_at: string
}

export interface BusinessAnnouncementRow {
  id: string
  user_id: string
  title: string
  content: string
  image_url: string
  status: AnnouncementStatus
  admin_note: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface NewsRow {
  id: string
  title: string
  content: string
  excerpt: string
  image_url: string
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface ContactMessageRow {
  id: string
  name: string
  email: string
  company: string
  phone: string
  subject: string
  message: string
  status: ContactStatus
  admin_note: string
  created_at: string
}

export interface DonationRow {
  id: string
  event_id: string | null
  total_amount: number
  edeli_amount: number
  befrienders_amount: number
  hitoribocchi_amount: number
  note: string
  donated_at: string
  created_at: string
}

// Supabase Database type - use `any` until generated types are available
// Run `npx supabase gen types typescript` after setting up Supabase to generate proper types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any
