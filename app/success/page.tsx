'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type DownloadPhoto = {
  id: number
  previewUrl: string
  downloadUrl: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState(
    'Enregistrement de votre commande...'
  )

  const [downloads, setDownloads] =
    useState<DownloadPhoto[]>([])

  const [purchaseType, setPurchaseType] =
    useState('')

  const [eventTitle, setEventTitle] =
    useState('')

  useEffect(() => {
    const processOrder = async () => {
      try {
        localStorage.removeItem('framevent_cart')
        localStorage.removeItem('eventframe_cart')

        if (!sessionId) {
          setStatus(
            'Paiement validé, mais aucun identifiant de session n’a été trouvé.'
          )
          return
        }

        const orderResponse = await fetch(
          '/api/create-order',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
            }),
          }
        )

        const orderData =
          await orderResponse.json()

        if (!orderData.success) {
          setStatus(
            orderData.error ||
              'Impossible d’enregistrer votre commande.'
          )
          return
        }

        const downloadResponse = await fetch(
          '/api/get-downloads',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
            }),
          }
        )

        const downloadData =
          await downloadResponse.json()

        if (downloadData.success) {
          setDownloads(
            downloadData.downloads || []
          )

          setPurchaseType(
            downloadData.purchaseType || ''
          )

          setEventTitle(
            downloadData.eventTitle || ''
          )

          setStatus('Votre achat est prêt.')
        } else {
          setStatus(
            downloadData.error ||
              'Impossible de charger les téléchargements.'
          )
        }
      } catch (error) {
        console.error('Success page error:', error)
        setStatus(
          'Une erreur est survenue pendant le chargement de votre commande.'
        )
      }
    }

    processOrder()
  }, [sessionId])

  return (
    <main className="min-h-screen bg-black text-white px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold mb-8 text-center">
          Paiement réussi 🎉
        </h1>

        <p className="text-center text-white/70 text-xl mb-12">
          {status}
        </p>

        {purchaseType === 'gallery' && (
          <div className="text-center mb-16">
            <a
              href={`/api/download-gallery-zip?sessionId=${sessionId}`}
              className="inline-block bg-green-600 hover:bg-green-500 px-10 py-5 rounded-2xl text-xl font-bold"
            >
              Télécharger toute la galerie ZIP
            </a>

            {eventTitle && (
              <p className="mt-4 text-white/60">
                {eventTitle}
              </p>
            )}
          </div>
        )}

        {downloads.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {downloads.map((photo) => (
              <div
                key={photo.id}
                className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800"
              >
                <img
                  src={photo.previewUrl}
                  alt=""
                  className="w-full aspect-square object-cover"
                />

                <div className="p-4">
                  <a
                    href={photo.downloadUrl}
                    download
                    className="block text-center bg-white text-black px-4 py-3 rounded-xl font-semibold"
                  >
                    Télécharger HD
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold"
          >
            Retour à FramEvents
          </a>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white px-8 py-20">
          <p className="text-center text-white/70 text-xl">
            Chargement de la commande...
          </p>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}