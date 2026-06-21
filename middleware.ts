import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE_NAME = 'framevents_admin_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const adminSessionToken = process.env.ADMIN_SESSION_TOKEN
  const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value

  if (adminSessionToken && adminCookie === adminSessionToken) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('next', pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}