'use client'
import { useState } from 'react'

const inputClass = 'w-full border border-hairline rounded-nm-sm px-4 py-[11px] text-[15px] text-ink bg-canvas placeholder-slate outline-none focus:border-forest transition-colors'
const labelClass = 'block text-sm font-semibold text-ink mb-1.5'

export default function ListBusinessForm() {
  const [form, setForm] = useState({ name: '', businessName: '', email: '', phone: '', serviceType: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, val: string) {
    setForm(f => ({ ...f, [field]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/list-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Something went wrong')
      setDone(true)
    } catch {
      setError('Something went wrong. Please email us at hello@nomadian.com.au.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center mx-auto mb-4">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display font-semibold text-ink text-xl mb-2">You&apos;re on the list</h3>
        <p className="text-[15px] text-body-muted leading-relaxed max-w-[300px] mx-auto">
          We&apos;ll review your details and reach out within one business day to get your listing set up.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Your name</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)} className={inputClass} placeholder="Jane Smith" />
        </div>
        <div>
          <label className={labelClass}>Business name</label>
          <input required value={form.businessName} onChange={e => set('businessName', e.target.value)} className={inputClass} placeholder="Smith Van Co." />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email address</label>
        <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass} placeholder="jane@smithvanbuilds.com.au" />
      </div>

      <div>
        <label className={labelClass}>Phone number</label>
        <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass} placeholder="0400 000 000" />
      </div>

      <div>
        <label className={labelClass}>Service type</label>
        <select
          required
          value={form.serviceType}
          onChange={e => set('serviceType', e.target.value)}
          className={`${inputClass} cursor-pointer appearance-none`}
        >
          <option value="">Select a category</option>
          <option>Van conversion</option>
          <option>Campervan builder</option>
          <option>4x4 outfitter</option>
          <option>Motorhome conversion</option>
          <option>Caravan builder</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Tell us about your business</label>
        <textarea
          value={form.message}
          onChange={e => set('message', e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Where you're based, how long you've been operating, what you specialise in…"
        />
      </div>

      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-forest text-white text-[15px] font-semibold rounded-nm-pill py-[13px] hover:bg-forest-dark transition-colors disabled:opacity-60 mt-1"
      >
        {loading ? 'Sending…' : 'Submit your interest'}
      </button>

      <p className="text-[12px] text-slate text-center">
        No payment required. We&apos;ll be in touch to discuss listing options.
      </p>
    </form>
  )
}
