'use client'
import { useState } from 'react'
import type { ListingCard, Tag } from '@/lib/types'
import ListingGrid from './ListingGrid'
import FilterSidebar from './FilterSidebar'

interface Props {
  listings: ListingCard[]
  tags: Tag[]
  count: number
  featureLabel: string
  initialState?: string
  locationLabel?: string
  children?: React.ReactNode
}

export default function ServicePageClient({
  listings,
  tags,
  count,
  featureLabel,
  initialState = '',
  locationLabel,
  children,
}: Props) {
  const [activeTag, setActiveTag] = useState('')
  const [activeState, setActiveState] = useState(initialState)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  function handleChange(tag: string, state: string) {
    setActiveTag(tag)
    setActiveState(state)
    setMobileFiltersOpen(false)
  }

  const filtered = listings.filter(l => {
    const tagMatch = !activeTag || (Array.isArray(l.tags) && l.tags.some((t: { slug: string }) => t.slug === activeTag))
    const stateMatch = !activeState || l.address_state === activeState
    return tagMatch && stateMatch
  })

  const label = locationLabel ?? 'Australia'
  const shown = filtered.length
  const hasActiveFilters = !!(activeTag || activeState)

  return (
    <div className="px-4 sm:px-8 py-7 sm:py-9 pb-12">
      {/* Mobile filter toggle */}
      <div className="lg:hidden flex items-center justify-between mb-5">
        <p className="text-sm text-slate">
          {hasActiveFilters ? `${shown} of ${count} shown` : `${count} businesses`}
        </p>
        <button
          onClick={() => setMobileFiltersOpen(o => !o)}
          className="flex items-center gap-2 text-sm font-semibold text-ink border border-hairline rounded-nm-pill px-4 py-2 hover:border-forest transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filters{hasActiveFilters ? ' (active)' : ''}
        </button>
      </div>

      {/* Mobile filter panel */}
      {mobileFiltersOpen && (
        <div className="lg:hidden mb-6">
          <FilterSidebar
            tags={tags}
            states={[]}
            activeTag={activeTag}
            activeState={activeState}
            onChange={handleChange}
            featureLabel={featureLabel}
          />
        </div>
      )}

      <div className="flex gap-8 items-start">
        <aside className="hidden lg:block sticky top-[76px] shrink-0">
          <FilterSidebar
            tags={tags}
            states={[]}
            activeTag={activeTag}
            activeState={activeState}
            onChange={handleChange}
            featureLabel={featureLabel}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate mb-5 hidden lg:block">
            {hasActiveFilters
              ? `Showing ${shown} of ${count}`
              : `Showing 1–${Math.min(count, listings.length)} of ${count}${locationLabel ? ` in ${label}` : ''}`}
          </p>
          <ListingGrid listings={filtered} />
          {children}
        </div>
      </div>
    </div>
  )
}
