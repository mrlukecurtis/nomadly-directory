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
export const dynamicParams = false

export async function generateStaticParams() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('service_types').select('slug')
  return (data ?? []).map(r => ({ 'service-slug': r.slug }))
}

async function getServiceData(serviceSlug: string) {
  const supabase = createClient()

  const { data: serviceType } = await supabase
    .from('service_types')
    .select('id, label, slug')
    .eq('slug', serviceSlug)
    .single()

  if (!serviceType) return null

  const [{ data: listings, count }, { data: tags }] = await Promise.all([
    supabase
      .from('listings_with_tag_slugs')
      .select('id, slug, business_name, address_city, address_state, service_type_slug, tags_json, primary_image_url', { count: 'exact' })
      .eq('service_type_id', serviceType.id)
      .range(0, 23),
    supabase.from('listing_tags').select('id, slug, label').order('label'),
  ])

  return { serviceType, listings: listings ?? [], count: count ?? 0, tags: tags ?? [] }
}

export async function generateMetadata({ params }: { params: { 'service-slug': string } }): Promise<Metadata> {
  const data = await getServiceData(params['service-slug'])
  if (!data) return {}
  const { serviceType, count } = data
  return {
    title: `${serviceType.label} in Australia`,
    description: `Find ${count} verified ${serviceType.label.toLowerCase()} across Australia. Compare specialists, read about their services, and request a quote.`,
  }
}

export default async function ServicePage({ params }: { params: { 'service-slug': string } }) {
  const data = await getServiceData(params['service-slug'])
  if (!data) notFound()

  const { serviceType, listings: raw, count, tags } = data
  const listings = raw.map(l => ({
    ...l,
    tags: typeof l.tags_json === 'string' ? JSON.parse(l.tags_json) : (l.tags_json ?? []),
  })) as ListingCard[]

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: serviceType.label, url: `/${serviceType.slug}/` },
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
            {serviceType.label} in Australia
          </h1>
          <div className="flex items-center gap-3 mt-4 mb-3.5">
            <span className="text-sm font-semibold text-forest bg-cream border border-hairline rounded-full px-[14px] py-[5px]">
              {count} businesses
            </span>
          </div>
          <p className="text-[17px] leading-relaxed text-body-muted">
            Compare vetted {serviceType.label.toLowerCase()} across Australia. View build packages, read about their specialisations, and send an enquiry direct.
          </p>
        </div>
      </div>

      {/* Body */}
      <ServicePageClient
        listings={listings}
        tags={tags as Tag[]}
        count={count}
        featureLabel={process.env.NEXT_PUBLIC_TAG_UI_LABEL ?? 'Features'}
      />
    </div>
  )
}
