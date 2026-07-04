import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { ListingDetail } from '@/lib/types'
import LeadForm from '@/components/LeadForm'
import JsonLd from '@/components/JsonLd'
import Breadcrumb from '@/components/Breadcrumb'
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { formatPhone, getStateLabel, slugify } from '@/lib/utils'

export const revalidate = 86400

export async function generateStaticParams() {
  const supabase = createAdminClient()
  const allSlugs: string[] = []
  const pageSize = 500
  let offset = 0

  while (true) {
    const { data, error } = await supabase
      .from('listings')
      .select('slug')
      .eq('is_active', true)
      .range(offset, offset + pageSize - 1)

    if (error || !data || data.length === 0) break
    allSlugs.push(...data.map(r => r.slug))
    if (data.length < pageSize) break
    offset += pageSize
  }

  return allSlugs.map(slug => ({ slug }))
}

async function getListing(slug: string): Promise<ListingDetail | null> {
  const supabase = createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('*, service_type:service_types(slug, label)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!listing) return null

  const [{ data: products }, { data: images }, { data: tagJoins }] = await Promise.all([
    supabase.from('listing_products').select('*').eq('listing_id', listing.id).order('name'),
    supabase.from('listing_images').select('*').eq('listing_id', listing.id).order('rank'),
    supabase.from('listing_tag_assignments').select('tag_id, listing_tags(slug, label)').eq('listing_id', listing.id),
  ])

  const tags = ((tagJoins ?? []) as unknown as { tag_id: string; listing_tags: { slug: string; label: string } | null }[])
    .map(j => j.listing_tags)
    .filter(Boolean)
    .sort((a, b) => a!.label.localeCompare(b!.label)) as { slug: string; label: string }[]

  return {
    ...listing,
    service_type: listing.service_type as { slug: string; label: string } | null,
    products: products ?? [],
    images: images ?? [],
    tags,
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const listing = await getListing(params.slug)
  if (!listing) return {}

  const nicheKw  = process.env.NEXT_PUBLIC_NICHE_KEYWORD ?? 'van conversions & fitouts'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Nomadly'

  return {
    title: `${listing.business_name} — ${listing.address_city} ${listing.address_state}`,
    description: `${listing.business_name} offers ${nicheKw} in ${listing.address_city}, ${getStateLabel(listing.address_state)}. ${(listing.description ?? '').split('.')[0]}.`,
    openGraph: { title: listing.business_name, siteName },
  }
}

export default async function ListingPage({ params }: { params: { slug: string } }) {
  const listing = await getListing(params.slug)
  if (!listing) notFound()

  const serviceTypeSlug  = listing.service_type?.slug ?? 'van-conversions'
  const serviceTypeLabel = listing.service_type?.label ?? 'Van Conversions'
  const citySlug         = slugify(listing.address_city)
  const heroImage        = listing.images[0]
  const thumbImages      = listing.images.slice(1, 5)
  const tagUiLabel       = process.env.NEXT_PUBLIC_TAG_UI_LABEL ?? 'Specialisations'

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: serviceTypeLabel, url: `/${serviceTypeSlug}/` },
    { name: listing.address_city, url: `/${serviceTypeSlug}/${citySlug}/` },
    { name: listing.business_name, url: `/listings/${listing.slug}` },
  ]

  const serviceAreas = [
    ...(listing.service_cities ?? []),
    ...(listing.service_regions ?? []),
    ...(listing.service_states ?? []),
  ].filter(Boolean)

  return (
    <div className="max-w-[1280px] mx-auto">
      <JsonLd data={generateLocalBusinessSchema(listing)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      {/* Breadcrumb */}
      <div className="px-4 sm:px-8 pt-5 pb-1">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Gallery */}
      {listing.images.length > 0 && (
        <div className="px-4 sm:px-8 pb-2">
          <div className="flex gap-3 h-[240px] sm:h-[420px]">
            {/* Hero image */}
            <div className="relative rounded-nm-lg overflow-hidden flex-[2]">
              <Image
                src={heroImage.url}
                alt={heroImage.alt_text ?? listing.business_name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 text-white text-[13px] font-medium px-[14px] py-2 rounded-full cursor-pointer" style={{ background: 'rgba(43,42,38,0.62)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                {listing.images.length} photos
              </div>
            </div>
            {/* Thumbnails — hidden on mobile */}
            {thumbImages.length > 0 && (
              <div className="hidden sm:flex flex-col gap-3 flex-1">
                {thumbImages.map(img => (
                  <div key={img.id} className="relative rounded-nm-sm overflow-hidden flex-1">
                    <Image
                      src={img.url}
                      alt={img.alt_text ?? listing.business_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content — two columns */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 px-4 sm:px-8 pt-7 pb-14 items-start">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2.5">
                {listing.service_type && (
                  <span className="text-[13px] font-semibold px-3 py-[5px] rounded-full bg-cream text-forest border border-hairline">
                    {listing.service_type.label}
                  </span>
                )}
                {listing.verified && (
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold px-3 py-[5px] rounded-full border" style={{ background: 'var(--color-gold-soft)', color: '#8a5f1f', borderColor: 'rgba(212,162,78,0.4)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a5f1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z" opacity="0.18" fill="#8a5f1f" stroke="none" />
                      <path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z" fill="none" stroke="#8a5f1f" strokeWidth="1.8" />
                      <polyline points="8.5 12 11 14.5 15.5 9.5" fill="none" stroke="#8a5f1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Verified builder
                  </span>
                )}
              </div>
              <h1 className="font-display font-semibold text-ink" style={{ fontSize: '38px', lineHeight: '1.08', letterSpacing: '-0.8px' }}>
                {listing.business_name}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-[15px] text-body-muted">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c584f" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  {listing.address_city}, {getStateLabel(listing.address_state)}
                </span>
                {listing.phone && (
                  <a href={`tel:${listing.phone}`} className="flex items-center gap-1.5 text-[15px] text-forest font-medium hover:underline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .35 1.9.65 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.3 1.81.52 2.81.65A2 2 0 0 1 22 16.92Z" />
                    </svg>
                    {formatPhone(listing.phone)}
                  </a>
                )}
                {listing.website_url && (
                  <a href={listing.website_url} target="_blank" rel="noopener noreferrer" className="text-[15px] text-forest font-medium hover:underline">
                    Visit website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <p className="text-[17px] leading-[1.55] text-body-muted mb-8 max-w-[640px]">
              {listing.description}
            </p>
          )}

          {/* Service areas */}
          {serviceAreas.length > 0 && (
            <div className="mb-8">
              <p className="text-[12px] font-semibold tracking-[0.06em] uppercase text-slate mb-3">Service areas</p>
              <div className="flex flex-wrap gap-[9px]">
                {serviceAreas.map((area, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-sm font-medium px-[14px] py-[7px] rounded-full border" style={{ background: 'var(--color-coral-soft)', color: 'var(--color-coral)', borderColor: 'rgba(201,111,69,0.28)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-coral)" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {area}
                  </span>
                ))}
                {listing.service_radius_km && (
                  <span className="flex items-center gap-1.5 text-sm font-medium px-[14px] py-[7px] rounded-full bg-cream text-ink border border-hairline">
                    Within {listing.service_radius_km} km
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Products / Services */}
          {listing.products.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display font-semibold text-ink mb-4" style={{ fontSize: '22px', letterSpacing: '-0.3px' }}>Build packages &amp; services</h2>
              <div className="flex flex-col gap-3.5">
                {listing.products.map(p => (
                  <div key={p.id} className="flex items-center gap-5 bg-canvas border border-hairline rounded-nm-md px-[22px] py-5">
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-[18px] text-ink mb-1">{p.name}</h3>
                      {p.description && <p className="text-[15px] leading-relaxed text-body-muted">{p.description}</p>}
                      {p.capacity && <p className="text-sm text-slate mt-1">Suitable for: {p.capacity}</p>}
                    </div>
                    {p.price_range && (
                      <span className="font-display font-semibold text-[16px] text-forest whitespace-nowrap">{p.price_range}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags / Features */}
          {listing.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display font-semibold text-ink mb-2" style={{ fontSize: '22px', letterSpacing: '-0.3px' }}>{tagUiLabel}</h2>
              <p className="text-[15px] text-body-muted mb-4">Specialisations and fitout capabilities offered by this builder.</p>
              <div className="flex flex-wrap gap-2.5">
                {listing.tags.map(t => (
                  <span key={t.slug} className="text-sm font-medium px-4 py-[9px] rounded-full bg-cream text-ink border border-hairline">
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact details */}
          <div className="mb-8 max-w-[460px]">
            <h2 className="font-display font-semibold text-ink mb-4" style={{ fontSize: '22px', letterSpacing: '-0.3px' }}>Contact</h2>
            <div className="flex flex-col divide-y divide-hairline">
              {listing.phone && (
                <div className="flex items-center gap-3.5 py-3.5">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .35 1.9.65 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.3 1.81.52 2.81.65A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  <div>
                    <p className="text-[13px] text-slate">Phone</p>
                    <a href={`tel:${listing.phone}`} className="text-[15px] font-medium text-ink hover:text-forest transition-colors">{formatPhone(listing.phone)}</a>
                  </div>
                </div>
              )}
              {listing.email && (
                <div className="flex items-center gap-3.5 py-3.5">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" />
                  </svg>
                  <div>
                    <p className="text-[13px] text-slate">Email</p>
                    <a href={`mailto:${listing.email}`} className="text-[15px] font-medium text-ink hover:text-forest transition-colors">{listing.email}</a>
                  </div>
                </div>
              )}
              {listing.address_street && (
                <div className="flex items-center gap-3.5 py-3.5">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <p className="text-[13px] text-slate">Address</p>
                    <p className="text-[15px] font-medium text-ink">{listing.address_street}, {listing.address_city} {listing.address_state} {listing.address_postcode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-hairline">
            <Link href={`/${serviceTypeSlug}/`} className="text-sm font-semibold text-forest hover:underline">
              ← Browse all {serviceTypeLabel}
            </Link>
          </div>
        </div>

        {/* Right column — lead capture */}
        <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-[76px]">
          <div className="bg-cream border border-hairline rounded-nm-lg p-[26px] mb-4">
            <h2 className="font-display font-semibold text-ink mb-2" style={{ fontSize: '21px', letterSpacing: '-0.3px', lineHeight: '1.25' }}>
              Get a quote from {listing.business_name.split(' ')[0]}
            </h2>
            <div className="flex items-center gap-1.5 text-[13px] text-body-muted mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              Usually replies within 1 business day
            </div>
            <LeadForm listingId={listing.id} listingName={listing.business_name} />
          </div>

          <div className="flex items-center gap-3 px-[18px] py-4 bg-canvas border border-hairline rounded-nm-md">
            <div className="w-11 h-11 rounded-full bg-forest flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z" /><polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Verified &amp; insured</p>
              <p className="text-[13px] text-body-muted">ABN &amp; workmanship warranty checked by Nomadly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
