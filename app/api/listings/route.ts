import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tagSlug = searchParams.get('tag') ?? ''
  const state   = searchParams.get('state') ?? ''
  const q       = searchParams.get('q') ?? ''
  const page    = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit   = 24
  const from    = (page - 1) * limit

  const supabase = createClient()

  let query = supabase
    .from('listings_with_tag_slugs')
    .select(
      'id, slug, business_name, address_city, address_state, service_type_slug, tags_json, primary_image_url',
      { count: 'exact' }
    )

  if (tagSlug) query = query.contains('tag_slugs', [tagSlug])
  if (state)   query = query.eq('address_state', state.toUpperCase())
  if (q)       query = query.ilike('business_name', `%${q}%`)

  const { data, count, error } = await query
    .order('business_name')
    .range(from, from + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    listings:   data ?? [],
    total:      count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  })
}
