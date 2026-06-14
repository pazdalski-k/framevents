import { NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { email, eventId } = body

    if (!email || !eventId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing data',
        },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('event_notifications')
      .insert([
        {
          email,
          event_id: eventId,
          notified: false,
        },
      ])

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Server error',
    })
  }
}