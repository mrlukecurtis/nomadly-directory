'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { ListingCard } from '@/lib/types'
import SafeImage from './SafeImage'

export default function ListingCardComponent({ listing }: { listing: ListingCard }) {
  const [saved, setSaved] = useState(false)

  const categoryLabel = listing.service_type_slug
    ? listing.service_type_slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : null

  return (
    <div className="flex flex-col bg-canvas border border-hairline rounded-nm-lg overflow-hidden hover:shadow-float-soft transition-shadow">
      <div className="relative h-52 bg-cream">
        {listing.primary_image_url ? (
          <SafeImage
            src={listing.primary_image_url}
            alt={listing.business_name}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cream to-hairline" />
        )}

        <button
          onClick={() => setSaved(s => !s)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full border-none flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(43,42,38,0.34)' }}
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? '#ffffff' : 'none'} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z" />
          </svg>
        </button>

        {categoryLabel && (
          <div className="absolute bottom-3 left-3 text-xs font-semibold px-[11px] py-[5px] rounded-full text-forest" style={{ background: 'rgba(255,255,255,0.94)' }}>
            {categoryLabel}
          </div>
        )}
      </div>

      <div className="p-[18px] flex flex-col gap-[11px] flex-1">
        <div className="flex items-start gap-2">
          <Link href={`/listings/${listing.slug}`} className="font-display font-semibold text-[19px] tracking-[-0.2px] text-ink leading-[1.2] flex-1 hover:text-forest transition-colors">
            {listing.business_name}
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-slate">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8478" strokeWidth="2" strokeLinecap="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {listing.address_city}, {listing.address_state}
        </div>

        {listing.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {listing.tags.slice(0, 3).map(t => (
              <span key={t.slug} className="text-xs font-medium px-[10px] py-1 rounded-full bg-cream text-ink border border-hairline">
                {t.label}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/listings/${listing.slug}`}
          className="mt-auto self-start bg-forest text-white text-sm font-semibold rounded-nm-pill px-5 py-[10px] hover:bg-forest-dark transition-colors"
        >
          View profile
        </Link>
      </div>
    </div>
  )
}
