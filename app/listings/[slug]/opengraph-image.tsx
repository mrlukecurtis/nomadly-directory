import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function ListingOG({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data } = await supabase
    .from('listings')
    .select('business_name, address_city, address_state')
    .eq('slug', params.slug)
    .single()

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Van Builders Australia'

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a2e',
        color: '#ffffff',
        padding: '60px',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 16, lineHeight: 1.2 }}>
        {data?.business_name ?? 'Business Listing'}
      </div>
      <div style={{ fontSize: 28, opacity: 0.7 }}>
        {data?.address_city}, {data?.address_state} · {siteName}
      </div>
    </div>,
    { ...size }
  )
}
