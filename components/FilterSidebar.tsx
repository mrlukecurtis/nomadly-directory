'use client'
import type { Tag } from '@/lib/types'

interface Props {
  tags: Tag[]
  states: string[]
  activeTag: string
  activeState: string
  onChange: (tag: string, state: string) => void
  featureLabel?: string
}

const ALL_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

export default function FilterSidebar({
  tags, activeTag, activeState, onChange, featureLabel = 'Features',
}: Props) {
  function handleLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
      onChange(activeTag, activeState)
    })
  }

  return (
    <div className="w-full lg:w-[248px] shrink-0 bg-canvas border border-hairline rounded-nm-lg p-[22px]">
      <div className="flex items-center justify-between mb-5">
        <span className="font-display font-semibold text-[17px] text-ink">Filters</span>
        {(activeTag || activeState) && (
          <button
            onClick={() => onChange('', '')}
            className="text-[13px] font-semibold text-coral cursor-pointer border-none bg-transparent p-0"
          >
            Clear all
          </button>
        )}
      </div>

      <p className="text-[12px] font-semibold tracking-[0.06em] uppercase text-slate mb-3">
        {featureLabel}
      </p>
      <div className="flex flex-col gap-[11px] mb-6">
        {tags.map(t => (
          <label key={t.slug} className="flex items-center gap-2.5 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={activeTag === t.slug}
              onChange={e => onChange(e.target.checked ? t.slug : '', activeState)}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: 'var(--color-forest)' }}
            />
            {t.label}
          </label>
        ))}
      </div>

      <div className="h-px bg-hairline mb-5" />

      <p className="text-[12px] font-semibold tracking-[0.06em] uppercase text-slate mb-3">State</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => onChange(activeTag, '')}
          className={`text-[13px] font-medium px-3 py-[6px] rounded-full cursor-pointer border transition-colors ${
            !activeState
              ? 'bg-forest text-white border-forest'
              : 'bg-canvas text-ink border-hairline hover:border-forest'
          }`}
        >
          All states
        </button>
        {ALL_STATES.map(s => (
          <button
            key={s}
            onClick={() => onChange(activeTag, s)}
            className={`text-[13px] font-medium px-3 py-[6px] rounded-full cursor-pointer border transition-colors ${
              activeState === s
                ? 'bg-forest text-white border-forest'
                : 'bg-canvas text-ink border-hairline hover:border-forest'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={handleLocation}
        className="flex items-center gap-[7px] text-[13px] font-semibold text-forest cursor-pointer border-none bg-transparent p-0 hover:opacity-80 transition-opacity"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round">
          <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
          <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
          <circle cx="12" cy="12" r="7" />
        </svg>
        Use my location
      </button>
    </div>
  )
}
