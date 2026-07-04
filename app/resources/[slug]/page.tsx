import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { postBySlugQuery, postSlugsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { SanityPost } from '@/sanity/lib/types'
import PortableText from '@/components/PortableText'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  try {
    const slugs: { slug: string }[] = await client.fetch(postSlugsQuery)
    return slugs.map(s => ({ slug: s.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post: SanityPost = await client.fetch(postBySlugQuery, { slug: params.slug })
    if (!post) return {}
    return {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      openGraph: post.coverImage?.asset
        ? { images: [{ url: urlFor(post.coverImage).width(1200).height(630).url() }] }
        : undefined,
    }
  } catch {
    return {}
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const revalidate = 60

export default async function ResourcePost({ params }: Props) {
  let post: SanityPost | null = null
  try {
    post = await client.fetch(postBySlugQuery, { slug: params.slug })
  } catch {
    notFound()
  }
  if (!post) notFound()

  return (
    <div className="max-w-[820px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <Link
        href="/resources"
        className="inline-flex items-center gap-1.5 text-sm text-body-muted hover:text-ink transition-colors mb-8"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Resources
      </Link>

      {post.category && (
        <span className="text-[11px] font-semibold text-forest tracking-[0.06em] uppercase mb-3 block">
          {post.category.title}
        </span>
      )}

      <h1
        className="font-display font-semibold text-ink mb-4"
        style={{ fontSize: '44px', lineHeight: '1.06', letterSpacing: '-0.9px' }}
      >
        {post.title}
      </h1>

      <p className="text-[17px] leading-[1.65] text-body-muted mb-6 max-w-[640px]">{post.excerpt}</p>

      <p className="text-[13px] text-slate mb-8">{formatDate(post.publishedAt)}</p>

      {post.coverImage?.asset && (
        <div className="relative w-full rounded-nm-md overflow-hidden bg-cream mb-10" style={{ aspectRatio: '16/9' }}>
          <Image
            src={urlFor(post.coverImage).width(1600).url()}
            alt={post.coverImage.alt ?? post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {post.body && (
        <div className="max-w-[680px]">
          <PortableText value={post.body as never} />
        </div>
      )}

      <div className="mt-14 pt-8 border-t border-hairline">
        <Link
          href="/resources"
          className="bg-canvas text-ink text-sm font-semibold rounded-nm-pill px-5 py-[11px] border border-hairline hover:bg-cream transition-colors"
        >
          Back to Resources
        </Link>
      </div>
    </div>
  )
}
