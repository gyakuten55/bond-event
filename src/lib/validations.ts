import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
})

export const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  confirmPassword: z.string(),
  name: z.string().min(1, '氏名を入力してください'),
  nameKana: z.string().min(1, 'フリガナを入力してください'),
  company: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
})

export const profileSchema = z.object({
  name: z.string().min(1, '氏名を入力してください'),
  nameKana: z.string().min(1, 'フリガナを入力してください'),
  company: z.string().optional(),
  companyUrl: z.string().url('有効なURLを入力してください').or(z.literal('')).optional(),
  businessDescription: z.string().optional(),
  bio: z.string().optional(),
})

export const guestApplicationSchema = z.object({
  guestName: z.string().min(1, 'お名前を入力してください'),
  guestEmail: z.string().email('有効なメールアドレスを入力してください'),
  guestPhone: z.string().min(1, '電話番号を入力してください'),
  guestCompany: z.string().optional(),
  numberOfGuests: z.number().min(1).max(5),
  message: z.string().optional(),
})

export const memberApplicationSchema = z.object({
  numberOfGuests: z.number().min(1).max(5),
  message: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().min(1, '件名を入力してください'),
  message: z.string().min(1, 'メッセージを入力してください'),
})

export const eventSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  description: z.string().optional(),
  eventDate: z.string().min(1, '開催日を入力してください'),
  startTime: z.string().min(1, '開始時間を入力してください'),
  endTime: z.string().optional(),
  venueType: z.enum(['north', 'south']),
  venueName: z.string().min(1, '会場名を入力してください'),
  venueAddress: z.string().optional(),
  capacity: z.number().min(1, '定員を入力してください'),
  participationFee: z.number().min(0),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']),
})

export const announcementSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  content: z.string().min(1, '内容を入力してください'),
})

export const newsSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  content: z.string().min(1, '内容を入力してください'),
  excerpt: z.string().optional(),
  isPublished: z.boolean(),
})

export const donationSchema = z.object({
  eventId: z.string().optional(),
  totalAmount: z.number().min(0),
  edeliAmount: z.number().min(0),
  befriendersAmount: z.number().min(0),
  hitoribocchiAmount: z.number().min(0),
  note: z.string().optional(),
  donatedAt: z.string().min(1, '寄付日を入力してください'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type GuestApplicationInput = z.infer<typeof guestApplicationSchema>
export type MemberApplicationInput = z.infer<typeof memberApplicationSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type EventInput = z.infer<typeof eventSchema>
export type AnnouncementInput = z.infer<typeof announcementSchema>
export type NewsInput = z.infer<typeof newsSchema>
export type DonationInput = z.infer<typeof donationSchema>
