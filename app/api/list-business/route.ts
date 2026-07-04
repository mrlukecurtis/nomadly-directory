import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, businessName, email, phone, serviceType, message } = body

  if (!name || !email || !businessName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from('leads').insert({
    listing_id: null,
    name,
    email,
    phone: phone || null,
    message: `Business: ${businessName}\nService type: ${serviceType}\n\n${message}`,
    source_url: 'list-your-business',
  })

  if (error) {
    console.error('list-business insert error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
