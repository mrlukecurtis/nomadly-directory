'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

function HeaderInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')

  const activeState = searchParams?.get('state') ?? ''

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (activeState) params.set('state', activeState)
    router.push(`/?${params.toString()}`)
  }

  function handleStateChange(state: string) {
    const params = new URLSearchParams(searchParams?.toString())
    if (state) params.set('state', state)
    else params.delete('state')
    router.push(`/?${params.toString()}`)
  }

  return (
    <header className="sticky top-0 z-40 bg-canvas border-b border-hairline">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[60px] flex items-center gap-3 sm:gap-6">
        <Link
          href="/"
          className="font-display font-semibold text-[20px] sm:text-[22px] tracking-[-0.6px] text-ink shrink-0"
        >
          Nomadly
        </Link>

        <form onSubmit={handleSearch} className="flex-1 hidden sm:flex items-center gap-2.5 border border-hairline rounded-nm-pill px-4 py-[9px] bg-canvas max-w-[420px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8478" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search builders, converters…"
            className="flex-1 border-none bg-transparent text-sm text-ink placeholder-slate outline-none"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <select
              value={activeState}
              onChange={e => handleStateChange(e.target.value)}
              className="appearance-none flex items-center gap-2 border border-hairline rounded-nm-pill pl-9 pr-8 py-[9px] text-sm font-medium text-ink bg-canvas cursor-pointer outline-none focus:border-forest"
            >
              <option value="">All states</option>
              {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5c584f" strokeWidth="2" strokeLinecap="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8478" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <Link
            href="/list-your-business"
            className="bg-forest text-white text-sm font-semibold rounded-nm-pill px-4 sm:px-5 py-[9px] sm:py-[11px] hover:bg-forest-dark transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">List your business</span>
            <span className="sm:hidden">List</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-40 bg-canvas border-b border-hairline h-[60px]">
        <div className="max-w-[1280px] mx-auto px-8 h-full flex items-center">
          <span className="font-display font-semibold text-[22px] tracking-[-0.6px] text-ink">Nomadly</span>
        </div>
      </header>
    }>
      <HeaderInner />
    </Suspense>
  )
}
