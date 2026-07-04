import type { ListingDetail, ListingCard } from './types'

export function generateLocalBusinessSchema(listing: ListingDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.business_name,
    url: listing.website_url ?? undefined,
    telephone: listing.phone ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address_street ?? undefined,
      addressLocality: listing.address_city,
      addressRegion: listing.address_state,
      postalCode: listing.address_postcode ?? undefined,
      addressCountry: 'AU',
    },
    geo: listing.latitude && listing.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: listing.latitude,
      longitude: listing.longitude,
    } : undefined,
    description: listing.description ?? undefined,
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`,
    })),
  }
}

export function generateItemListSchema(listings: ListingCard[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: listings.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/listings/${l.slug}`,
      name: l.business_name,
    })),
  }
}
