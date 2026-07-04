import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Nomadian collects, uses, and protects your information.',
}

const year = new Date().getFullYear()

export default function PrivacyPage() {
  return (
    <div className="max-w-[720px] mx-auto px-8 py-16">
      <span className="text-sm font-semibold text-forest tracking-[0.04em] uppercase">Legal</span>
      <h1 className="font-display font-semibold text-ink mt-3 mb-2" style={{ fontSize: '38px', letterSpacing: '-0.7px' }}>
        Privacy Policy
      </h1>
      <p className="text-sm text-slate mb-10">Last updated January {year}</p>

      <div className="flex flex-col gap-8 text-[16px] leading-[1.7] text-body-muted">
        <section>
          <h2 className="font-display font-semibold text-ink mb-3" style={{ fontSize: '20px' }}>Information we collect</h2>
          <p>When you submit an enquiry through Nomadian, we collect your name, email address, phone number (optional), and the message you send. This information is shared with the business you contacted so they can respond to your enquiry.</p>
          <p className="mt-3">We also collect anonymised usage data (pages visited, time on page) via Vercel Analytics. This data cannot be used to identify you.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-ink mb-3" style={{ fontSize: '20px' }}>How we use it</h2>
          <p>Your enquiry details are used solely to facilitate communication between you and the business you contacted. We do not sell your personal information to third parties or use it for advertising.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-ink mb-3" style={{ fontSize: '20px' }}>Data storage</h2>
          <p>Enquiry data is stored securely in Supabase (hosted in Sydney, Australia). Business listing data is sourced from publicly available business directories and is used to help Australians find vetted mobile living professionals.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-ink mb-3" style={{ fontSize: '20px' }}>Your rights</h2>
          <p>You can request access to, correction of, or deletion of your personal data at any time by emailing <a href="mailto:privacy@nomadian.com.au" className="text-forest hover:underline">privacy@nomadian.com.au</a>. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-ink mb-3" style={{ fontSize: '20px' }}>Cookies</h2>
          <p>Nomadian does not use advertising cookies or tracking pixels. Vercel Analytics uses privacy-first, cookieless tracking that complies with Australian Privacy Act requirements.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-ink mb-3" style={{ fontSize: '20px' }}>Contact</h2>
          <p>For privacy-related enquiries: <a href="mailto:privacy@nomadian.com.au" className="text-forest hover:underline">privacy@nomadian.com.au</a></p>
        </section>
      </div>
    </div>
  )
}
