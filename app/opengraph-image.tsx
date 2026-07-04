import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function DefaultOG() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Van Builders Australia'
  const nicheKw  = process.env.NEXT_PUBLIC_NICHE_KEYWORD ?? 'van conversions & fitouts'

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a2e',
        color: '#ffffff',
        padding: '80px',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 700, marginBottom: 24, lineHeight: 1.1 }}>
        {siteName}
      </div>
      <div style={{ fontSize: 32, opacity: 0.65 }}>
        Find {nicheKw} specialists across Australia
      </div>
    </div>,
    { ...size }
  )
}
