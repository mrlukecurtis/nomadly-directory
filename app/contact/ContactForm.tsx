'use client'
import { useState } from 'react'

const inputClass = 'w-full border border-hairline rounded-nm-sm px-4 py-[11px] text-[15px] text-ink bg-canvas placeholder-slate outline-none focus:border-forest transition-colors'
const labelClass = 'block text-sm font-semibold text-ink mb-1.5'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
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
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: null,
          name: form.name,
          email: form.email,
          message: form.message,
          source_url: '/contact',
        }),
      })
      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setError('Something went wrong. Please email us directly at hello@nomadly.com.au.')
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
        <h3 className="font-display font-semibold text-ink text-xl mb-2">Message sent</h3>
        <p className="text-[15px] text-body-muted">We&apos;ll get back to you within one business day.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Name</label>
        <input required value={form.name} onChange={e => set('name', e.target.value)} className={inputClass} placeholder="Your name" />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass} placeholder="you@example.com" />
      </div>
      <div>
        <label className={labelClass}>Message</label>
        <textarea required value={form.message} onChange={e => set('message', e.target.value)} rows={5} className={`${inputClass} resize-none`} placeholder="What's on your mind?" />
      </div>
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-forest text-white text-[15px] font-semibold rounded-nm-pill py-[13px] hover:bg-forest-dark transition-colors disabled:opacity-60 mt-1"
      >
        {loading ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
