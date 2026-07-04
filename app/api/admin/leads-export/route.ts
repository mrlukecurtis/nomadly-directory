import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('leads')
    .select('created_at, listings(business_name), name, email, phone, message, source_url')
    .order('created_at', { ascending: false })

  const headers = ['Date', 'Listing', 'Name', 'Email', 'Phone', 'Message', 'Source URL']
  const rows = (data ?? []).map(lead => [
    new Date(lead.created_at).toISOString(),
    ((lead.listings as unknown) as { business_name: string } | null)?.business_name ?? '',
    lead.name,
    lead.email,
    lead.phone ?? '',
    (lead.message ?? '').replace(/\n/g, ' '),
    lead.source_url ?? '',
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
