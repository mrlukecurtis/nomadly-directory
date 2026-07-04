export interface ServiceType {
  id: string
  slug: string
  label: string
  vehicle_type: string | null
  description: string | null
}

export interface Location {
  id: string
  slug: string
  label: string
  location_type: 'state' | 'city'
  state_code: string | null
  country_code: string
}

export interface Tag {
  id: string
  slug: string
  label: string
}

export interface ListingProduct {
  id: string
  listing_id: string
  name: string
  description: string | null
  capacity: string | null
  price_range: string | null
  created_at: string
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  alt_text: string | null
  source_url: string | null
  rank: number | null
  verified: boolean
  created_at: string
}

export interface Listing {
  id: string
  slug: string
  business_name: string
  website_url: string | null
  phone: string | null
  email: string | null
  address_street: string | null
  address_city: string
  address_state: string
  address_postcode: string | null
  latitude: number | null
  longitude: number | null
  description: string | null
  service_type_id: string | null
  verified: boolean
  verification_confidence: number | null
  is_active: boolean
  claimed: boolean
  service_cities: string[] | null
  service_regions: string[] | null
  service_states: string[] | null
  service_radius_km: number | null
  created_at: string
  updated_at: string
}

export interface ListingDetail extends Listing {
  service_type: { slug: string; label: string } | null
  products: ListingProduct[]
  tags: { slug: string; label: string }[]
  images: ListingImage[]
}

export interface ListingCard {
  id: string
  slug: string
  business_name: string
  address_city: string
  address_state: string
  service_type_slug: string | null
  tags: { slug: string; label: string }[]
  primary_image_url: string | null
}

export interface Lead {
  id: string
  listing_id: string | null
  name: string
  email: string
  phone: string | null
  message: string | null
  source_url: string | null
  created_at: string
}

export interface Page {
  id: string
  slug: string
  title: string
  content: string | null
  meta_title: string | null
  meta_desc: string | null
  published: boolean
  published_at: string | null
  created_at: string
}
