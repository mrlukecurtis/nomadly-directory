import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const schema = z.object({
  name:       z.string().min(2),
  email:      z.string().email(),
  phone:      z.string().optional(),
  message:    z.string().min(10),
  listing_id: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const { name, email, phone, message, listing_id } = parsed.data
  const supabase = createAdminClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('business_name')
    .eq('id', listing_id)
    .single()
  const listingName = listing?.business_name ?? 'Unknown Business'

  const { error: dbError } = await supabase.from('leads').insert({
    listing_id,
    name,
    email,
    phone: phone ?? null,
    message,
    source_url: request.headers.get('referer'),
  })

  if (dbError) {
    console.error('DB insert error:', dbError)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from:    process.env.RESEND_FROM_EMAIL!,
        to:      process.env.RESEND_TO_EMAIL!,
        subject: `New Enquiry: ${listingName}`,
        text:    `Name: ${name}\nEmail: ${email}\nPhone: ${phone ?? 'N/A'}\n\nMessage:\n${message}\n\nListing: ${listingName}`,
      })
    } catch (emailError) {
      console.error('Email send failed:', emailError)
    }
  }

  return NextResponse.json({ success: true })
}
