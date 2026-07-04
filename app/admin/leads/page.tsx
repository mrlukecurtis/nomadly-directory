import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminLeadsPage() {
  const supabase = createAdminClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('id, created_at, listings(business_name), name, email, phone, message, source_url')
    .order('created_at', { ascending: false })

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-[22px] border-b border-hairline bg-canvas">
        <div>
          <h1 className="font-display font-semibold text-[22px] tracking-[-0.3px] text-ink">Leads</h1>
          <p className="text-[13px] text-slate mt-0.5">{leads?.length ?? 0} total</p>
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

      <div className="p-7">
        {leads?.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-body-muted">No leads yet.</p>
          </div>
        ) : (
          <div className="bg-canvas border border-hairline rounded-nm-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm" style={{ tableLayout: 'fixed' }}>
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="text-left px-[22px] py-3 w-24 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">Date</th>
                    <th className="text-left px-3 py-3 w-28 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">Name</th>
                    <th className="text-left px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">Email</th>
                    <th className="text-left px-3 py-3 w-28 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">Phone</th>
                    <th className="text-left px-3 py-3 w-36 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">Listing</th>
                    <th className="text-left px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {(leads ?? []).map(lead => (
                    <tr key={lead.id} className="border-b border-hairline hover:bg-cream/50 transition-colors">
                      <td className="px-[22px] py-3.5 text-slate whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-3 py-3.5 font-semibold text-ink overflow-hidden text-ellipsis whitespace-nowrap">{lead.name}</td>
                      <td className="px-3 py-3.5 overflow-hidden text-ellipsis whitespace-nowrap">
                        <a href={`mailto:${lead.email}`} className="text-forest hover:underline">{lead.email}</a>
                      </td>
                      <td className="px-3 py-3.5 text-body-muted whitespace-nowrap">{lead.phone ?? '—'}</td>
                      <td className="px-3 py-3.5 text-body-muted overflow-hidden text-ellipsis whitespace-nowrap">
                        {((lead.listings as unknown) as { business_name: string } | null)?.business_name ?? '—'}
                      </td>
                      <td className="px-3 py-3.5 text-body-muted overflow-hidden text-ellipsis whitespace-nowrap">{lead.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
