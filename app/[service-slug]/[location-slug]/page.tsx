import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import Breadcrumb from '@/components/Breadcrumb'
import ServicePageClient from '@/components/ServicePageClient'
import { generateItemListSchema, generateBreadcrumbSchema } from '@/lib/schema'
import type { ListingCard, Tag } from '@/lib/types'

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  const supabase = createAdminClient()

  const [{ data: serviceTypes }, { data: locations }] = await Promise.all([
    supabase.from('service_types').select('slug'),
    supabase.from('locations').select('slug'),
  ])

  const params = []
  for (const st of serviceTypes ?? []) {
    for (const loc of locations ?? []) {
      params.push({ 'service-slug': st.slug, 'location-slug': loc.slug })
    }
  }
  return params
}

function slugToLabel(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

async function getLocationData(serviceSlug: string, locationSlug: string) {
  const supabase = createClient()

  const { data: serviceType } = await supabase
    .from('service_types')
    .select('id, label, slug')
    .eq('slug', serviceSlug)
    .single()

  if (!serviceType) return null

  const { data: location } = await supabase
    .from('locations')
    .select('id, label, slug, location_type, state_code')
    .eq('slug', locationSlug)
    .single()

  const locationLabel = location?.label ?? slugToLabel(locationSlug)
  const isState       = location?.location_type === 'state'

  let query = supabase
    .from('listings_with_tag_slugs')
    .select('id, slug, business_name, address_city, address_state, service_type_slug, tags_json, primary_image_url', { count: 'exact' })
    .eq('service_type_id', serviceType.id)

  if (isState) {
    query = query.eq('address_state', location!.state_code)
  } else {
    query = query.ilike('address_city', locationLabel)
  }

  const [{ data: listings, count }, { data: tags }] = await Promise.all([
    query.range(0, 47),
    supabase.from('listing_tags').select('id, slug, label').order('label'),
  ])

  return { serviceType, locationLabel, locationSlug, listings: listings ?? [], count: count ?? 0, tags: tags ?? [], isState, stateCode: location?.state_code }
}

export async function generateMetadata({ params }: { params: { 'service-slug': string; 'location-slug': string } }): Promise<Metadata> {
  const data = await getLocationData(params['service-slug'], params['location-slug'])
  if (!data) return {}
  const { serviceType, locationLabel, count } = data
  return {
    title: `${serviceType.label} in ${locationLabel}`,
    description: `Find ${count} verified ${serviceType.label.toLowerCase()} in ${locationLabel}. Compare specialists, view their work, and request a quote directly.`,
  }
}

export default async function LocationPage({ params }: { params: { 'service-slug': string; 'location-slug': string } }) {
  const data = await getLocationData(params['service-slug'], params['location-slug'])
  if (!data) notFound()

  const { serviceType, locationLabel, locationSlug, listings: raw, count, tags, stateCode } = data
  const listings = raw.map(l => ({
    ...l,
    tags: typeof l.tags_json === 'string' ? JSON.parse(l.tags_json) : (l.tags_json ?? []),
  })) as ListingCard[]

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: serviceType.label, url: `/${serviceType.slug}/` },
    { name: locationLabel, url: `/${serviceType.slug}/${locationSlug}/` },
  ]

  return (
    <div className="max-w-[1280px] mx-auto">
      <JsonLd data={generateItemListSchema(listings)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      {/* Page hero */}
      <div className="px-4 sm:px-8 pt-7 pb-8 border-b border-hairline">
        <Breadcrumb items={breadcrumbs} />
        <div className="max-w-[720px]">
          <h1 className="font-display font-semibold text-ink text-[30px] sm:text-[44px]" style={{ lineHeight: '1.06', letterSpacing: '-0.7px' }}>
            {serviceType.label} in {locationLabel}
          </h1>
          <div className="flex items-center gap-3 mt-4 mb-3.5">
            <span className="text-sm font-semibold text-forest bg-cream border border-hairline rounded-full px-[14px] py-[5px]">
              {count} businesses
            </span>
          </div>
          <p className="text-[17px] leading-relaxed text-body-muted">
            {count === 0
              ? `No ${serviceType.label.toLowerCase()} currently listed in ${locationLabel}. Check back soon or browse all of Australia.`
              : `Compare vetted ${serviceType.label.toLowerCase()} in ${locationLabel}. View build packages, read about their specialisations, and send an enquiry direct.`}
          </p>
        </div>
      </div>

      {/* Body */}
      <ServicePageClient
        listings={listings}
        tags={tags as Tag[]}
        count={count}
        featureLabel={process.env.NEXT_PUBLIC_TAG_UI_LABEL ?? 'Features'}
        initialState={stateCode ?? ''}
        locationLabel={locationLabel}
      >
        {count > 0 && (
          <div className="bg-cream border-t border-hairline mt-12 px-0 py-14">
            <div className="max-w-[820px]">
              <h2 className="font-display font-semibold text-ink mb-4" style={{ fontSize: '26px', letterSpacing: '-0.4px' }}>
                {serviceType.label} in {locationLabel}
              </h2>
              <p className="text-base leading-[1.7] text-body-muted">
                Browse all vetted {serviceType.label.toLowerCase()} in {locationLabel}. Each listing has been reviewed for relevance. Use the filters to narrow by specialisation, or send an enquiry directly from any profile.
              </p>
            </div>
          </div>
        )}
      </ServicePageClient>
    </div>
  )
}
