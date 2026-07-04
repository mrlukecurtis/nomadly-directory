'use client'
import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/admin'
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push(from)
      router.refresh()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        <p className="font-display font-semibold text-[22px] tracking-[-0.4px] text-ink mb-1">Nomadly admin</p>
        <p className="text-sm text-body-muted mb-8">Enter your password to continue.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoFocus
            className="w-full border border-hairline rounded-nm-sm px-4 py-[11px] text-sm text-ink bg-canvas placeholder-slate outline-none focus:border-forest transition-colors"
          />
          {error && (
            <p className="text-sm text-error">Incorrect password. Try again.</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="bg-forest text-white text-sm font-semibold rounded-nm-pill py-[11px] hover:bg-forest-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
