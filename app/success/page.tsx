'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState(
    'Saving your order...'
  )

  const [downloads, setDownloads] =
    useState<any[]>([])

  const [purchaseType, setPurchaseType] =
    useState('')

  const [eventTitle, setEventTitle] =
    useState('')

  useEffect(() => {
    const processOrder = async () => {
      localStorage.removeItem('framevent_cart')

      if (!sessionId) {
        setStatus(
          'Payment completed, but no session ID was found.'
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
            'Could not save your order.'
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

        setStatus('Your purchase is ready.')
      } else {
        setStatus(
          downloadData.error ||
            'Could not load downloads.'
        )
      }
    }

    processOrder()
  }, [sessionId])

  return (
    <main className="min-h-screen bg-black text-white px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold mb-8 text-center">
          Payment Successful 🎉
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
              Download Entire Gallery ZIP
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
                    Download HD
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
            Back to FramEvent
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
            Loading order...
          </p>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}