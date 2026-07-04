import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { postsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { SanityPostSummary } from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Guides, tips, and inspiration for the Australian campervan and adventure vehicle community.',
}

export const revalidate = 60

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function ResourcesPage() {
  let posts: SanityPostSummary[] = []

  try {
    posts = await client.fetch(postsQuery)
  } catch {
    // Sanity not yet configured — show empty state
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="max-w-[640px] mb-12">
        <span className="text-sm font-semibold text-forest tracking-[0.04em] uppercase">Resources</span>
        <h1
          className="font-display font-semibold text-ink mt-3 mb-4"
          style={{ fontSize: '44px', lineHeight: '1.06', letterSpacing: '-0.9px' }}
        >
          Guides for the road ahead
        </h1>
        <p className="text-[17px] leading-[1.65] text-body-muted">
          Tips, build guides, and community stories from Australia&apos;s campervan and adventure vehicle world.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-cream border border-hairline rounded-nm-md px-8 py-16 text-center max-w-[480px] mx-auto">
          <p className="font-display font-semibold text-ink text-xl mb-2">Coming soon</p>
          <p className="text-sm text-body-muted">Resources are on their way. Check back shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link
              key={post._id}
              href={`/resources/${post.slug.current}`}
              className="group bg-canvas border border-card-border rounded-nm-md overflow-hidden hover:shadow-float transition-shadow"
            >
              <div className="relative w-full bg-cream" style={{ aspectRatio: '16/9' }}>
                {post.coverImage?.asset ? (
                  <Image
                    src={urlFor(post.coverImage).width(800).url()}
                    alt={post.coverImage.alt ?? post.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 bg-cream flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c4bfb3" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9l4-4 4 4 4-6 4 6" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-5">
                {post.category && (
                  <span className="text-[11px] font-semibold text-forest tracking-[0.06em] uppercase mb-2 block">
                    {post.category.title}
                  </span>
                )}
                <h2 className="font-display font-semibold text-ink text-[18px] leading-tight tracking-[-0.2px] mb-2 group-hover:text-forest transition-colors">
                  {post.title}
                </h2>
                <p className="text-[14px] leading-[1.55] text-body-muted line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <p className="text-[12px] text-slate">{formatDate(post.publishedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
