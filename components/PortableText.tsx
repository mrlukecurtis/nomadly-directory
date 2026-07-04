import {
  PortableText as SanityPortableText,
  type PortableTextBlock,
  type PortableTextBlockComponent,
  type PortableTextMarkComponentProps,
  type PortableTextTypeComponentProps,
  type PortableTextListComponent,
} from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

type Props = { value: PortableTextBlock[] }

const blockComponents: Record<string, PortableTextBlockComponent> = {
  h2: ({ children }) => (
    <h2 className="font-display font-semibold text-ink text-[28px] leading-tight tracking-[-0.4px] mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display font-semibold text-ink text-[22px] leading-tight tracking-[-0.3px] mt-8 mb-3">{children}</h3>
  ),
  normal: ({ children }) => (
    <p className="text-[17px] leading-[1.7] text-body-muted mb-5">{children}</p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-coral pl-5 my-6 text-[17px] leading-[1.7] text-body-muted italic">{children}</blockquote>
  ),
}

const listComponents: Record<string, PortableTextListComponent> = {
  bullet: ({ children }) => (
    <ul className="list-disc pl-6 mb-5 space-y-2 text-[17px] leading-[1.7] text-body-muted">{children}</ul>
  ),
  number: ({ children }) => (
    <ol className="list-decimal pl-6 mb-5 space-y-2 text-[17px] leading-[1.7] text-body-muted">{children}</ol>
  ),
}

function LinkMark({ value, children }: PortableTextMarkComponentProps<{ _type: string; href?: string }>) {
  const isExternal = value?.href?.startsWith('http')
  return (
    <a
      href={value?.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="text-forest underline underline-offset-2 hover:text-forest-dark transition-colors"
    >
      {children}
    </a>
  )
}

type SanityImageValue = {
  asset?: object
  alt?: string
  caption?: string
}

function InlineImage({ value }: PortableTextTypeComponentProps<SanityImageValue>) {
  if (!value?.asset) return null
  return (
    <figure className="my-8">
      <div className="relative w-full rounded-nm-md overflow-hidden bg-cream" style={{ aspectRatio: '16/9' }}>
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt ?? ''}
          fill
          className="object-cover"
        />
      </div>
      {value.caption && (
        <figcaption className="text-[13px] text-body-muted text-center mt-2">{value.caption}</figcaption>
      )}
    </figure>
  )
}

export default function PortableText({ value }: Props) {
  return (
    <SanityPortableText
      value={value}
      components={{
        block: blockComponents,
        list: listComponents,
        marks: {
          strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
          link: LinkMark,
        },
        types: {
          image: InlineImage,
        },
      }}
    />
  )
}
