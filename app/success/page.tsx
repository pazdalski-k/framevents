'use client'

import { useEffect } from 'react'

export default function SuccessPage() {
  useEffect(() => {
    localStorage.removeItem('eventframe_cart')
  }, [])

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-8">
      <div className="text-center max-w-2xl">

        <h1 className="text-6xl font-bold mb-8">
          Payment Successful 🎉
        </h1>

        <p className="text-white/70 text-xl mb-10">
          Thank you for your purchase.
          Your order has been received.
        </p>

        <a
          href="/"
          className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
        >
          Back to EventFrame
        </a>

      </div>
    </main>
  )
}