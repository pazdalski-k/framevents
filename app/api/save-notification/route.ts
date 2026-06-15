import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/app/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    const { data: event } = await supabase
      .from('events')
      .select('title, date, location')
      .eq('id', eventId)
      .single()

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

    await resend.emails.send({
      from: 'FramEvent <onboarding@resend.dev>',
      to: email,
      subject: 'FramEvent – Gallery notification / Notification galerie',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>FramEvent</h2>

          <p><strong>🇫🇷 Français</strong></p>
          <p>
            Merci pour votre inscription.
          </p>
          <p>
            Les photos de l’événement ${
              event?.title ? `<strong>${event.title}</strong>` : ''
            } sont en cours de sélection et de traitement.
          </p>
          <p>
            La galerie sera disponible dans un délai de 24 à 48 heures.
            Nous vous informerons dès que les photos seront en ligne.
          </p>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />

          <p><strong>🇬🇧 English</strong></p>
          <p>
            Thank you for registering.
          </p>
          <p>
            The photos from ${
              event?.title ? `<strong>${event.title}</strong>` : 'this event'
            } are currently being selected and processed.
          </p>
          <p>
            The gallery will be available within 24 to 48 hours.
            We will notify you as soon as the photos are online.
          </p>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />

          <p style="font-size: 14px; color: #555;">
            FramEvent<br />
            Krzysztof Pazdalski
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.log('SAVE NOTIFICATION ERROR:', error)

    return NextResponse.json({
      success: false,
      error: 'Server error',
    })
  }
}