'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

interface LeadFormProps {
  listingId: string
  listingName: string
}

const schema = z.object({
  name:       z.string().min(2, 'Name must be at least 2 characters'),
  email:      z.string().email('Please enter a valid email address'),
  phone:      z.string().optional(),
  message:    z.string().min(10, 'Please describe what you need (min 10 characters)'),
  listing_id: z.string().uuid(),
})

type FormValues = z.infer<typeof schema>

const inputClass = 'w-full text-[15px] text-ink px-[13px] py-[11px] rounded-nm-sm border border-border-light bg-canvas placeholder-slate outline-none focus:border-forest transition-colors'
const labelClass = 'block text-[13px] text-body-muted mb-1.5'
const errorClass = 'text-error text-xs mt-1'

export default function LeadForm({ listingId, listingName }: LeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { listing_id: listingId },
  })

  const onSubmit = async (data: FormValues) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-display font-semibold text-ink text-[17px]">Enquiry sent</p>
        <p className="text-body-muted text-sm mt-1">{listingName} will be in touch shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...register('listing_id')} />

      <div>
        <label className={labelClass}>Your name</label>
        <input
          {...register('name')}
          placeholder="Jordan Rivera"
          className={inputClass}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="jordan@email.com"
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Phone</label>
        <input
          {...register('phone')}
          type="tel"
          placeholder="04XX XXX XXX"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>What are you building?</label>
        <textarea
          {...register('message')}
          rows={3}
          placeholder="Sprinter 144, family of 3, want solar + an internal bathroom"
          className={`${inputClass} resize-vertical`}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-forest text-white text-[15px] font-semibold rounded-nm-pill py-[14px] hover:bg-forest-dark transition-colors disabled:opacity-50 cursor-pointer"
      >
        {status === 'loading' ? 'Sending…' : 'Send enquiry'}
      </button>

      {status === 'error' && (
        <p className="text-error text-sm text-center">Something went wrong. Please try again or call directly.</p>
      )}

      <p className="text-center text-[12px] text-slate leading-relaxed">
        Free to enquire · No obligation · Your details are shared only with this builder
      </p>
    </form>
  )
}
