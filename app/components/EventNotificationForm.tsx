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
      setStatus('Veuillez saisir votre adresse e-mail.')
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
        'Merci. Votre adresse e-mail a été enregistrée. Nous vous préviendrons lorsque la galerie sera prête.'
      )
      setEmail('')
    } else {
      setStatus(
        data.error || 'Une erreur est survenue. Veuillez réessayer.'
      )
    }

    setLoading(false)
  }

  return (
    <section className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="uppercase tracking-[5px] text-white/40 text-xs mb-4">
            Notification galerie
          </p>

          <h2 className="text-3xl font-bold mb-4">
            Les photos sont en cours de traitement
          </h2>

          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              Les photos de cet événement sont en cours de sélection et de
              traitement. La galerie sera disponible dans un délai de 24 à 48
              heures.
            </p>

            <p>
              Laissez votre e-mail et nous vous préviendrons dès que les photos
              seront disponibles.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-black rounded-[28px] p-6 border border-white/10"
        >
          <label className="block text-white/60 mb-3">
            Adresse e-mail
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full bg-white text-black rounded-full px-6 py-4 outline-none mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-full font-semibold disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Me prévenir'}
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