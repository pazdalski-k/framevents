import { NextResponse } from 'next/server'

const ADMIN_COOKIE_NAME = 'framevents_admin_session'

export async function POST() {
  const response = NextResponse.json({
    success: true,
  })

  // Nowe bezpieczne cookie admina
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  // Stare cookie — usuwamy dla porządku
  response.cookies.set('framevent_admin', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}