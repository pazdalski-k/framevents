'use client'

export default function BuyGalleryButton({
  eventId,
  eventTitle,
  galleryPrice,
}: {
  eventId: number
  eventTitle: string
  galleryPrice: number
}) {
  const buyGallery = async () => {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'gallery',
        eventId,
        eventTitle,
        price: galleryPrice,
      }),
    })

    const data = await response.json()

    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <button
      onClick={buyGallery}
      className="border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition"
    >
      Buy Gallery {galleryPrice}€
    </button>
  )
}