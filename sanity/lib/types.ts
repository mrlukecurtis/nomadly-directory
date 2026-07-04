export type SanitySlug = { current: string }

export type SanityImageAsset = {
  asset: { _ref: string; _type: string }
  alt?: string
}

export type SanityCategory = {
  _id: string
  title: string
  slug: SanitySlug
  description?: string
}

export type SanityPostSummary = {
  _id: string
  title: string
  slug: SanitySlug
  excerpt: string
  publishedAt: string
  coverImage?: SanityImageAsset
  category?: SanityCategory
}

export type SanityPost = SanityPostSummary & {
  body: unknown[]
  seoTitle?: string
  seoDescription?: string
}
