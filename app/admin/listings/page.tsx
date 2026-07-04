import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminListingsPage() {
  const supabase = createAdminClient()
  const { data: listings } = await supabase
    .from('listings')
    .select('id, slug, business_name, address_city, address_state, service_type_id, verified, claimed, is_active')
    .order('business_name')

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-[22px] border-b border-hairline bg-canvas">
        <div>
          <h1 className="font-display font-semibold text-[22px] tracking-[-0.3px] text-ink">Listings</h1>
          <p className="text-[13px] text-slate mt-0.5">{listings?.length ?? 0} total</p>
        </div>
      </div>

      <div className="p-7">
        <div className="bg-canvas border border-hairline rounded-nm-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="text-left px-[22px] py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">Business name</th>
                  <th className="text-left px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">City</th>
                  <th className="text-left px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">State</th>
                  <th className="text-left px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">Verified</th>
                  <th className="text-left px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate">Status</th>
                  <th className="px-[22px] py-3"></th>
                </tr>
              </thead>
              <tbody>
                {(listings ?? []).map(l => (
                  <tr key={l.id} className="border-b border-hairline hover:bg-cream/50 transition-colors">
                    <td className="px-[22px] py-[15px] font-semibold text-ink">
                      <a href={`/listings/${l.slug}`} target="_blank" className="hover:text-forest transition-colors">
                        {l.business_name}
                      </a>
                    </td>
                    <td className="px-3 py-[15px] text-body-muted">{l.address_city}</td>
                    <td className="px-3 py-[15px] text-body-muted">{l.address_state}</td>
                    <td className="px-3 py-[15px]">
                      {l.verified
                        ? <span className="text-[13px] font-semibold text-forest">Yes</span>
                        : <span className="text-[13px] text-slate">No</span>}
                    </td>
                    <td className="px-3 py-[15px]">
                      {l.is_active ? (
                        <span className="text-[13px] font-semibold px-3 py-1 rounded-full bg-[rgba(47,74,60,0.10)] text-forest">Active</span>
                      ) : (
                        <span className="text-[13px] font-semibold px-3 py-1 rounded-full bg-cream text-slate">Inactive</span>
                      )}
                    </td>
                    <td className="px-[22px] py-[15px] text-right">
                      <Link href={`/listings/${l.slug}`} target="_blank" className="text-sm font-semibold text-forest hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
