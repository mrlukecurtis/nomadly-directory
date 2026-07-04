import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Nomadian',
  description: 'Nomadian is Australia\'s directory for campervan builders, van converters, and 4x4 outfitters.',
}

export default function AboutPage() {
  return (
    <div className="max-w-[820px] mx-auto px-8 py-16">
      <span className="text-sm font-semibold text-forest tracking-[0.04em] uppercase">About</span>
      <h1
        className="font-display font-semibold text-ink mt-3 mb-6"
        style={{ fontSize: '44px', lineHeight: '1.06', letterSpacing: '-0.9px' }}
      >
        Built for the mobile living community
      </h1>

      <div className="flex flex-col gap-5 text-[17px] leading-[1.65] text-body-muted max-w-[640px]">
        <p>
          Nomadian is Australia&apos;s dedicated directory for campervan builders, van converters, and 4x4 outfitters. We built it because finding a trusted, verified builder shouldn&apos;t require weeks of forum trawling and cold calls.
        </p>
        <p>
          Every listing is verified for ABN and business legitimacy before it goes live. Builders who complete our full verification process earn a Verified badge, which appears on their profile and in search results.
        </p>
        <p>
          We&apos;re a small team based in Byron Bay, NSW. We live this lifestyle and we built Nomadian for people who do too.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[18px] mt-12">
        {[
          { n: '110+', label: 'Listed businesses' },
          { n: 'Verified', label: 'Builders checked by our team' },
          { n: 'Free', label: 'For enthusiasts, always' },
        ].map(s => (
          <div key={s.label} className="bg-cream border border-hairline rounded-nm-md p-[22px]">
            <p className="font-display font-semibold text-ink text-[32px] tracking-[-0.5px]">{s.n}</p>
            <p className="text-[13px] text-body-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-hairline flex flex-wrap gap-4">
        <Link href="/contact" className="bg-forest text-white text-sm font-semibold rounded-nm-pill px-5 py-[11px] hover:bg-forest-dark transition-colors">
          Get in touch
        </Link>
        <Link href="/van-conversions/" className="bg-canvas text-ink text-sm font-semibold rounded-nm-pill px-5 py-[11px] border border-hairline hover:bg-cream transition-colors">
          Browse builders
        </Link>
      </div>
    </div>
  )
}
