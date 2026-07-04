import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Nomadly team.',
}

export default function ContactPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-8 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <span className="text-sm font-semibold text-forest tracking-[0.04em] uppercase">Contact</span>
          <h1
            className="font-display font-semibold text-ink mt-3 mb-5"
            style={{ fontSize: '44px', lineHeight: '1.06', letterSpacing: '-0.9px' }}
          >
            We&apos;d love to hear from you
          </h1>
          <p className="text-[17px] leading-[1.6] text-body-muted mb-8 max-w-[440px]">
            Questions about a listing, partnership enquiries, or just want to say hi — we reply to everything within one business day.
          </p>

          <div className="flex flex-col gap-4">
            <a href="mailto:hello@nomadly.com.au" className="flex items-center gap-3.5 group">
              <div className="w-11 h-11 rounded-nm-md bg-cream border border-hairline flex items-center justify-center shrink-0">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] text-slate">Email</p>
                <p className="text-[15px] font-medium text-ink group-hover:text-forest transition-colors">hello@nomadly.com.au</p>
              </div>
            </a>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-nm-md bg-cream border border-hairline flex items-center justify-center shrink-0">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] text-slate">Based in</p>
                <p className="text-[15px] font-medium text-ink">Byron Bay, NSW</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-canvas border border-hairline rounded-nm-lg p-8 lg:sticky lg:top-[80px]">
          <h2 className="font-display font-semibold text-ink mb-6" style={{ fontSize: '22px', letterSpacing: '-0.3px' }}>
            Send a message
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
