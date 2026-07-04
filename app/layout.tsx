import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Suspense } from 'react'
import ConditionalShell from '@/components/ConditionalShell'
import './globals.css'

const inter = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const interBody = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nomadian.com.au'),
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME ?? 'Nomadian'}`,
    default: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Nomadian',
  },
  description: `Find the best ${process.env.NEXT_PUBLIC_NICHE_KEYWORD ?? 'campervan builders & van converters'} in Australia.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${interBody.variable} font-body`} style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif' }}>
        <Suspense>
          <ConditionalShell>
            {children}
          </ConditionalShell>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
