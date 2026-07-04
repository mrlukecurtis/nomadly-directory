import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD env variable is not set')
    return new NextResponse('Server misconfiguration', { status: 500 })
  }

  const authHeader = request.headers.get('authorization') ?? ''
  const expected   = 'Basic ' + btoa(`admin:${adminPassword}`)

  if (authHeader !== expected) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
    })
  }

  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
