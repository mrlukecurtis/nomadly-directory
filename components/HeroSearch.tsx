'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const STATE_MAP: Record<string, string> = {
  'nsw': 'NSW', 'new south wales': 'NSW',
  'vic': 'VIC', 'victoria': 'VIC',
  'qld': 'QLD', 'queensland': 'QLD',
  'wa': 'WA', 'western australia': 'WA',
  'sa': 'SA', 'south australia': 'SA',
  'tas': 'TAS', 'tasmania': 'TAS',
  'act': 'ACT', 'australian capital territory': 'ACT',
  'nt': 'NT', 'northern territory': 'NT',
}

export default function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [locating, setLocating] = useState(false)
  const locationRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    const stateCode = STATE_MAP[location.trim().toLowerCase()]
    if (stateCode) params.set('state', stateCode)
    const qs = params.toString()
    router.push(qs ? `/?${qs}#results` : '/#results')
  }

  function handleLocate() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const stateRaw: string = data.address?.state ?? ''
          const code = STATE_MAP[stateRaw.toLowerCase()]
          if (code) {
            setLocation(code)
            locationRef.current?.focus()
          }
        } finally {
          setLocating(false)
        }
      },
      () => setLocating(false)
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 px-2 sm:px-0">
      {/* Desktop: single pill row */}
      <div className="hidden sm:flex items-center bg-canvas border border-hairline rounded-nm-pill shadow-float-soft max-w-[620px] mx-auto overflow-hidden">
        <div className="flex-[1.3] flex items-center gap-2.5 px-4 py-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8478" strokeWidth="2" strokeLinecap="round" className="shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 min-w-0 border-none bg-transparent text-[15px] text-ink placeholder-slate outline-none"
            placeholder="Van conversions, 4x4 outfitters…"
          />
        </div>
        <div className="w-px h-[30px] bg-hairline shrink-0" />
        <div className="flex-1 flex items-center gap-2.5 px-4 py-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8478" strokeWidth="2" strokeLinecap="round" className="shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <input
            ref={locationRef}
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="flex-1 min-w-0 border-none bg-transparent text-[15px] text-ink placeholder-slate outline-none"
            placeholder="State, e.g. NSW"
          />
        </div>
        <button
          type="submit"
          className="bg-forest text-white text-[15px] font-semibold rounded-nm-pill mx-2 px-6 py-2.5 hover:bg-forest-dark transition-colors shrink-0"
        >
          Search
        </button>
      </div>

      {/* Mobile: stacked */}
      <div className="sm:hidden flex flex-col gap-3 max-w-[400px] mx-auto">
        <div className="flex items-center gap-2.5 bg-canvas border border-hairline rounded-nm-xl px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8478" strokeWidth="2" strokeLinecap="round" className="shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 min-w-0 border-none bg-transparent text-[15px] text-ink placeholder-slate outline-none"
            placeholder="Van conversions, outfitters…"
          />
        </div>
        <div className="flex items-center gap-2.5 bg-canvas border border-hairline rounded-nm-xl px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8478" strokeWidth="2" strokeLinecap="round" className="shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <input
            ref={locationRef}
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="flex-1 min-w-0 border-none bg-transparent text-[15px] text-ink placeholder-slate outline-none"
            placeholder="State, e.g. NSW"
          />
        </div>
        <button
          type="submit"
          className="bg-forest text-white text-[15px] font-semibold rounded-nm-pill py-3 hover:bg-forest-dark transition-colors"
        >
          Search
        </button>
      </div>

      <button
        type="button"
        onClick={handleLocate}
        disabled={locating}
        className="flex items-center justify-center gap-[7px] mt-4 mx-auto text-sm font-semibold text-white cursor-pointer disabled:opacity-60"
        style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
          <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
          <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
          <circle cx="12" cy="12" r="7" />
        </svg>
        {locating ? 'Locating…' : 'Use my location'}
      </button>
    </form>
  )
}
