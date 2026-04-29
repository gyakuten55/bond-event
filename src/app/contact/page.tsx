'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { contactSchema, type ContactInput } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { CONTACT_EMAIL } from '@/lib/constants'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactInput) => {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: insertError } = await supabase.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      company: data.company || '',
      phone: data.phone || '',
      subject: data.subject,
      message: data.message,
    })

    if (insertError) {
      setError('エラーが発生しました。もう一度お試しください')
    } else {
      setSuccess(true)
      reset()
    }
    setLoading(false)
  }

  return (
    <>
      <PageHeader title="Contact" description="お問い合わせ" />

      <section className="section-padding">
        <div className="container-bond">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Info */}
            <div className="lg:col-span-4 space-y-8">
              <div>
                <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-2">Email</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[14px] text-text-primary hover:opacity-60">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div>
                <p className="text-[11px] tracking-extra-wide text-text-muted uppercase mb-2">Hours</p>
                <p className="text-[14px] text-text-primary">月〜金 8:00-18:00</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-8">
              {success ? (
                <div className="py-16 text-center">
                  <h2 className="text-xl font-bold mb-3">お問い合わせありがとうございます</h2>
                  <p className="text-[14px] text-text-muted mb-8">
                    内容を確認後、担当者よりご連絡させていただきます。
                  </p>
                  <Button variant="outline" onClick={() => setSuccess(false)}>
                    新しいお問い合わせ
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {error && (
                    <div className="text-[13px] text-red-500 border-l-2 border-red-500 pl-4">{error}</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Input id="name" label="お名前" placeholder="山田 太郎" error={errors.name?.message} {...register('name')} />
                    <Input id="email" label="メールアドレス" type="email" placeholder="example@email.com" error={errors.email?.message} {...register('email')} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Input id="company" label="会社名（任意）" placeholder="株式会社〇〇" {...register('company')} />
                    <Input id="phone" label="電話番号（任意）" type="tel" placeholder="090-1234-5678" {...register('phone')} />
                  </div>
                  <Input id="subject" label="件名" placeholder="お問い合わせの件名" error={errors.subject?.message} {...register('subject')} />
                  <Textarea id="message" label="メッセージ" placeholder="お問い合わせ内容" error={errors.message?.message} {...register('message')} />
                  <Button type="submit" disabled={loading}>
                    {loading ? '送信中...' : '送信する'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
