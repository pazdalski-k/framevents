'use client'

import { useState } from 'react'

export default function EventNotificationForm({
  eventId,
}: {
  eventId: number
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!email) {
      setStatus('Please enter your email address.')
      return
    }

    setLoading(true)
    setStatus('')

    const response = await fetch('/api/save-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        eventId,
      }),
    })

    const data = await response.json()

    console.log('SAVE NOTIFICATION RESPONSE:', data)

    if (data.success) {
      setStatus(
        'Merci. Your email has been saved. We will notify you when the gallery is ready.'
      )
      setEmail('')
    } else {
      setStatus(
        data.error || 'Something went wrong. Please try again.'
      )
    }

    setLoading(false)
  }

  return (
    <section className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="uppercase tracking-[5px] text-white/40 text-xs mb-4">
            Gallery notification
          </p>

          <h2 className="text-3xl font-bold mb-4">
            Photos are being processed
          </h2>

          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              🇫🇷 Les photos de cet événement sont en cours de
              sélection et de traitement. La galerie sera disponible
              dans un délai de 24 à 48 heures.
            </p>

            <p>
              🇬🇧 The photos from this event are being selected and
              processed. The gallery will be available within 24 to
              48 hours.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-black rounded-[28px] p-6 border border-white/10">
          <label className="block text-white/60 mb-3">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-white text-black rounded-full px-6 py-4 outline-none mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-full font-semibold disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Notify me'}
          </button>

          {status && (
            <p className="text-white/60 text-sm mt-4 leading-relaxed">
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}