'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ListingCard, Tag } from '@/lib/types'
import ListingGrid from './ListingGrid'
import FilterSidebar from './FilterSidebar'

interface Props {
  initialListings: ListingCard[]
  totalCount: number
  tags: Tag[]
  states: string[]
}

const PAGE_SIZE = 9

export default function DirectoryClient({ initialListings, totalCount, tags, states }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [listings, setListings] = useState<ListingCard[]>(initialListings)
  const [total, setTotal]       = useState(totalCount)
  const [loading, setLoading]   = useState(false)
  const [page, setPage]         = useState(1)

  const activeTag   = searchParams.get('tag') ?? ''
  const activeState = searchParams.get('state') ?? ''
  const activeQ     = searchParams.get('q') ?? ''
  const totalPages  = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const fetchListings = useCallback(async (tag: string, state: string, q: string, p: number) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (tag)   params.set('tag', tag)
    if (state) params.set('state', state)
    if (q)     params.set('q', q)
    params.set('page', String(p))
    const res  = await fetch(`/api/listings?${params}`)
    const data = await res.json()
    const parsed = (data.listings ?? []).map((l: Record<string, unknown>) => ({
      ...l,
      tags: typeof l.tags_json === 'string'
        ? JSON.parse(l.tags_json as string)
        : (l.tags_json ?? []),
    }))
    setListings(parsed)
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchListings(activeTag, activeState, activeQ, page)
  }, [activeTag, activeState, activeQ, page, fetchListings])

  const updateFilter = (tag: string, state: string) => {
    const params = new URLSearchParams()
    if (tag)     params.set('tag', tag)
    if (state)   params.set('state', state)
    if (activeQ) params.set('q', activeQ)
    setPage(1)
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const featureLabel = process.env.NEXT_PUBLIC_TAG_UI_LABEL ?? 'Features'
  const locationLabel = activeState || 'Australia'
  const start = (page - 1) * PAGE_SIZE + 1
  const end   = Math.min(page * PAGE_SIZE, total)

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const hasFilters = !!(activeTag || activeState || activeQ)

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
      {/* Mobile filter row */}
      <div className="lg:hidden flex items-center justify-between mb-5">
        <p className="text-sm text-slate">{total} builders</p>
        <button
          onClick={() => setMobileFiltersOpen(o => !o)}
          className="flex items-center gap-2 text-sm font-semibold text-ink border border-hairline rounded-nm-pill px-4 py-2 hover:border-forest transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filters{hasFilters ? ' (active)' : ''}
        </button>
      </div>

      {mobileFiltersOpen && (
        <div className="lg:hidden mb-6">
          <FilterSidebar
            tags={tags}
            states={states}
            activeTag={activeTag}
            activeState={activeState}
            onChange={(tag, state) => { updateFilter(tag, state); setMobileFiltersOpen(false) }}
            featureLabel={featureLabel}
          />
        </div>
      )}

      <div className="flex gap-8 items-start">
        <aside className="hidden lg:block sticky top-[76px]">
          <FilterSidebar
            tags={tags}
            states={states}
            activeTag={activeTag}
            activeState={activeState}
            onChange={updateFilter}
            featureLabel={featureLabel}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold text-[22px] tracking-[-0.3px] text-ink">
                {activeQ
                  ? `${total} result${total !== 1 ? 's' : ''} for "${activeQ}"${activeState ? ` in ${activeState}` : ''}`
                  : `${total} builders${activeState ? ` in ${activeState}` : ' across Australia'}`}
              </h2>
              {total > 0 && (
                <p className="text-sm text-slate mt-0.5">
                  Showing {start}–{end} · sorted by top rated
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 border border-hairline rounded-nm-pill px-[14px] py-[9px] text-sm font-medium text-ink cursor-pointer">
              Sort: Top rated
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8478" strokeWidth="2" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-72 bg-cream rounded-nm-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <ListingGrid listings={listings} />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-[38px] h-[38px] flex items-center justify-center border border-hairline rounded-full cursor-pointer disabled:opacity-40 hover:border-forest transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8478" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[38px] h-[38px] flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors ${
                      page === p
                        ? 'bg-forest text-white font-semibold'
                        : 'text-ink hover:bg-cream'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}

              {totalPages > 5 && (
                <>
                  <span className="min-w-[38px] h-[38px] flex items-center justify-center text-sm text-slate">…</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`min-w-[38px] h-[38px] flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors ${
                      page === totalPages ? 'bg-forest text-white font-semibold' : 'text-ink hover:bg-cream'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-[38px] h-[38px] flex items-center justify-center border border-hairline rounded-full cursor-pointer disabled:opacity-40 hover:border-forest transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2b2a26" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
