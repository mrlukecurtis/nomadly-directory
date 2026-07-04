import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminPage() {
  const supabase = createAdminClient()

  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: listingCount },
    { count: leadCount },
    { count: weekLeadCount },
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
  ])

  const dateStr = today.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-[22px] border-b border-hairline bg-canvas">
        <div>
          <h1 className="font-display font-semibold text-[22px] tracking-[-0.3px] text-ink">Dashboard</h1>
          <p className="text-[13px] text-slate mt-0.5">{dateStr}</p>
        </div>
        <a
          href="/api/admin/leads-export"
          download
          className="flex items-center gap-2 bg-canvas border border-forest text-forest text-sm font-semibold rounded-nm-xl px-4 py-[9px] hover:bg-cream transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </a>
      </div>

      <div className="p-7 flex flex-col gap-6">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-[18px]">
          <div className="bg-canvas border border-hairline rounded-nm-md p-[22px]">
            <p className="text-[12px] font-semibold tracking-[0.06em] uppercase text-slate">Total listings</p>
            <p className="font-display font-semibold text-ink mt-2 mb-1" style={{ fontSize: '36px', letterSpacing: '-0.6px' }}>{listingCount ?? 0}</p>
            <p className="text-[13px] text-body-muted">across all service types</p>
          </div>
          <div className="bg-canvas border border-hairline rounded-nm-md p-[22px]">
            <p className="text-[12px] font-semibold tracking-[0.06em] uppercase text-slate">Total leads</p>
            <p className="font-display font-semibold text-ink mt-2 mb-1" style={{ fontSize: '36px', letterSpacing: '-0.6px' }}>{leadCount ?? 0}</p>
            <p className="text-[13px] text-body-muted">all time</p>
          </div>
          <div className="bg-forest text-white rounded-nm-md p-[22px]">
            <p className="text-[12px] font-semibold tracking-[0.06em] uppercase text-white/65">Leads this week</p>
            <p className="font-display font-semibold mt-2 mb-1" style={{ fontSize: '36px', letterSpacing: '-0.6px' }}>{weekLeadCount ?? 0}</p>
            <p className="text-[13px] text-white/80">last 7 days</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex gap-3">
          <Link href="/admin/leads" className="flex items-center gap-2 bg-canvas border border-forest text-forest text-sm font-semibold rounded-nm-xl px-4 py-[9px] hover:bg-cream transition-colors">
            View all leads
          </Link>
          <Link href="/admin/listings" className="flex items-center gap-2 bg-canvas border border-hairline text-ink text-sm font-semibold rounded-nm-xl px-4 py-[9px] hover:bg-cream transition-colors">
            View all listings
          </Link>
        </div>
      </div>
    </>
  )
}
