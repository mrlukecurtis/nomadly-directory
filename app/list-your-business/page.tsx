import type { Metadata } from 'next'
import ListBusinessForm from './ListBusinessForm'

export const metadata: Metadata = {
  title: 'List Your Business',
  description: 'Get your van conversion or mobile living business in front of thousands of Australians ready to build their dream rig.',
}

const BENEFITS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Reach qualified leads',
    body: 'Every visitor is actively researching a build. These are buyers, not browsers.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Set up in minutes',
    body: 'We build and manage your profile. You just verify the details and start getting enquiries.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z" /><polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: 'Verified badge',
    body: 'Verified listings get a trust badge that lifts click-through and enquiry rates.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Performance insights',
    body: 'See how many people viewed your profile and where your enquiries are coming from.',
  },
]

export default function ListYourBusinessPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-8 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: pitch */}
        <div>
          <span className="text-sm font-semibold text-forest tracking-[0.04em] uppercase">For professionals</span>
          <h1
            className="font-display font-semibold text-ink mt-3 mb-5"
            style={{ fontSize: '44px', lineHeight: '1.06', letterSpacing: '-0.9px' }}
          >
            Get your business in front of serious builders
          </h1>
          <p className="text-[17px] leading-[1.6] text-body-muted mb-10 max-w-[480px]">
            Nomadian is where Australians go to find vetted campervan builders, van converters, and 4x4 outfitters. A listing puts your business directly in front of people ready to commission a build.
          </p>

          <div className="flex flex-col gap-6">
            {BENEFITS.map(b => (
              <div key={b.title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-nm-md bg-cream border border-hairline flex items-center justify-center shrink-0">
                  {b.icon}
                </div>
                <div>
                  <p className="font-semibold text-ink mb-0.5">{b.title}</p>
                  <p className="text-[15px] text-body-muted leading-relaxed">{b.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 bg-cream border border-hairline rounded-nm-md">
            <p className="text-sm font-semibold text-ink mb-1">Already listed?</p>
            <p className="text-[13px] text-body-muted">
              Your business may already be in our directory. Email us at{' '}
              <a href="mailto:hello@nomadian.com.au" className="text-forest hover:underline font-medium">hello@nomadian.com.au</a>{' '}
              to claim and verify your profile.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="bg-canvas border border-hairline rounded-nm-lg p-8 lg:sticky lg:top-[80px]">
          <h2 className="font-display font-semibold text-ink mb-2" style={{ fontSize: '24px', letterSpacing: '-0.4px' }}>
            Register your interest
          </h2>
          <p className="text-[15px] text-body-muted mb-6">
            Tell us about your business and we&apos;ll be in touch within one business day.
          </p>
          <ListBusinessForm />
        </div>
      </div>
    </div>
  )
}
