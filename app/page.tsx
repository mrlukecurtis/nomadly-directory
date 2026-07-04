import { createClient } from '@/lib/supabase/server'
import DirectoryClient from '@/components/DirectoryClient'
import HeroSearch from '@/components/HeroSearch'
import type { ListingCard, Tag } from '@/lib/types'
import { Suspense } from 'react'

export const revalidate = 3600

async function HomePage() {
  const supabase = createClient()

  const [
    { data: initialListings },
    { count: totalCount },
    { data: tags },
    { data: stateRows },
  ] = await Promise.all([
    supabase
      .from('listings_with_tag_slugs')
      .select('id, slug, business_name, address_city, address_state, service_type_slug, tags_json, primary_image_url')
      .range(0, 8),
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('listing_tags')
      .select('id, slug, label')
      .order('label'),
    supabase
      .from('listings')
      .select('address_state')
      .eq('is_active', true),
  ])

  const states = Array.from(new Set((stateRows ?? []).map(r => r.address_state))).sort()

  const listings = (initialListings ?? []).map(l => ({
    ...l,
    tags: typeof l.tags_json === 'string'
      ? JSON.parse(l.tags_json)
      : (l.tags_json ?? []),
  })) as ListingCard[]

  return (
    <>
      {/* Hero */}
      <section
        className="relative text-center px-4 sm:px-8 py-14 sm:py-[88px]"
        style={{
          background: 'linear-gradient(180deg,rgba(43,42,38,0.36) 0%,rgba(43,42,38,0.30) 45%,rgba(43,42,38,0.58) 100%), url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
        }}
      >
        <h1
          className="font-display font-semibold text-white max-w-[760px] mx-auto text-[36px] sm:text-[56px]"
          style={{ lineHeight: '1.06', letterSpacing: '-1px', textShadow: '0 2px 18px rgba(0,0,0,0.45)' }}
        >
          Find professional van builders near you
        </h1>
        <p
          className="text-white/90 max-w-[560px] mx-auto mt-4 sm:mt-5 text-base sm:text-lg leading-[1.55]"
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.45)' }}
        >
          Compare vetted custom campervan builders, van converters and 4x4 outfitters across Australia
        </p>

        <HeroSearch />
      </section>

      <div id="results">
        <DirectoryClient
          initialListings={listings}
          totalCount={totalCount ?? 0}
          tags={(tags ?? []) as Tag[]}
          states={states}
        />
      </div>
    </>
  )
}

export default function Page() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  )
}
