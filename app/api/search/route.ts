import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q     = searchParams.get('q') ?? ''
  const page  = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = 24
  const from  = (page - 1) * limit

  if (!q.trim()) return NextResponse.json({ listings: [], total: 0 })

  const supabase = createClient()
  const { data, count, error } = await supabase
    .from('listings')
    .select('id, slug, business_name, address_city, address_state', { count: 'exact' })
    .textSearch('fts', q, { type: 'websearch' })
    .eq('is_active', true)
    .range(from, from + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ listings: data ?? [], total: count ?? 0, page })
}
