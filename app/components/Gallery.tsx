'use client'

import { useEffect, useState } from 'react'

type Photo = {
  id: number
  image_url: string
}

type CartItem = {
  photoId: number
  imageUrl: string
  eventId: number
  price: number
}

export default function Gallery({
  photos,
  photoPrice,
  eventId,
}: {
  photos: Photo[]
  photoPrice: number
  eventId: number
}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [added, setAdded] = useState(false)

  const selectedPhoto =
    selectedImage !== null ? photos[selectedImage] : null

  const formatPrice = (price: number) => {
    return `${price.toFixed(2).replace('.', ',')}€`
  }

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('eventframe_cart')

      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch {
      setCart([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('eventframe_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (selectedImage === null) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedImage])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return

      if (e.key === 'Escape') {
        setSelectedImage(null)
      }

      if (e.key === 'ArrowLeft') {
        setSelectedImage(
          selectedImage > 0 ? selectedImage - 1 : photos.length - 1
        )
      }

      if (e.key === 'ArrowRight') {
        setSelectedImage(
          selectedImage < photos.length - 1 ? selectedImage + 1 : 0
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage, photos.length])

  const buyPhoto = async () => {
    if (!selectedPhoto) return

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photoId: selectedPhoto.id,
        eventId,
        price: photoPrice,
      }),
    })

    const data = await response.json()

    if (data.url) {
      window.location.href = data.url
    }
  }

  const addToCart = () => {
    if (!selectedPhoto) return

    setCart((currentCart) => {
      const alreadyExists = currentCart.some(
        (item) => item.photoId === selectedPhoto.id
      )

      if (alreadyExists) return currentCart

      return [
        ...currentCart,
        {
          photoId: selectedPhoto.id,
          imageUrl: selectedPhoto.image_url,
          eventId,
          price: photoPrice,
        },
      ]
    })

    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 1200)
  }

  const checkoutCart = async () => {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
      }),
    })

    const data = await response.json()

    if (data.url) {
      window.location.href = data.url
    }
  }

  const removeFromCart = (photoId: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.photoId !== photoId)
    )
  }

  const goPrevious = () => {
    if (selectedImage === null) return

    setSelectedImage(
      selectedImage > 0 ? selectedImage - 1 : photos.length - 1
    )
  }

  const goNext = () => {
    if (selectedImage === null) return

    setSelectedImage(
      selectedImage < photos.length - 1 ? selectedImage + 1 : 0
    )
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <>
      {cart.length > 0 && (
        <div className="sticky top-4 z-40 mb-8 flex justify-center px-4">
          <div className="flex w-full max-w-3xl flex-col gap-3 rounded-[28px] border border-white/10 bg-white p-4 text-black shadow-2xl md:flex-row md:items-center md:justify-between md:rounded-full md:px-6 md:py-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-5">
              <span className="font-bold">
                {cart.length} photo{cart.length > 1 ? 's' : ''} dans le panier
              </span>

              <span className="text-sm text-black/50">
                Total : {formatPrice(total)}
              </span>
            </div>

            <button
              onClick={checkoutCart}
              className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:scale-[1.02]"
            >
              Payer
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
        {photos.map((photo, index) => {
          const isInCart = cart.some(
            (item) => item.photoId === photo.id
          )

          return (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#111111]"
            >
              <img
                src={photo.image_url}
                alt=""
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => setSelectedImage(index)}
                className="aspect-[4/3] w-full cursor-pointer select-none object-cover transition duration-500 group-hover:scale-[1.03]"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div className="rounded-full border border-white/15 bg-black/65 px-4 py-2 text-sm font-bold text-white shadow-xl backdrop-blur-xl">
                  {formatPrice(photoPrice)}
                </div>

                <button
                  onClick={() => setSelectedImage(index)}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black shadow-xl transition hover:scale-[1.04]"
                >
                  Voir / acheter
                </button>
              </div>

              {isInCart && (
                <button
                  onClick={() => removeFromCart(photo.id)}
                  className="absolute right-4 top-4 rounded-full border border-white/15 bg-white px-4 py-2 text-xs font-bold text-black shadow-xl"
                >
                  Dans le panier ✓
                </button>
              )}
            </div>
          )
        })}
      </div>

      {selectedImage !== null && selectedPhoto && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black text-white"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),rgba(0,0,0,0)_42%),linear-gradient(180deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_16%,rgba(0,0,0,1)_100%)]" />

          {/* Desktop top action bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 top-0 z-[70] hidden border-b border-white/10 bg-black/88 px-6 py-5 shadow-2xl backdrop-blur-2xl md:block"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[4px] text-white/35">
                  FramEvent
                </p>

                <p className="mt-1 text-sm text-white/60">
                  Photo {selectedImage + 1} / {photos.length}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={addToCart}
                  className="rounded-full border border-white/20 bg-white/8 px-7 py-4 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/15"
                >
                  {added ? 'Ajouté ✓' : 'Ajouter au panier'}
                </button>

                <button
                  onClick={buyPhoto}
                  className="rounded-full bg-white px-8 py-4 text-sm font-black text-black shadow-2xl transition hover:scale-[1.03]"
                >
                  Acheter la photo {formatPrice(photoPrice)}
                </button>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
                  aria-label="Fermer"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          {/* Mobile top bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 top-0 z-[70] border-b border-white/10 bg-black/90 px-4 py-4 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[3px] text-white/35">
                  FramEvent
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {selectedImage + 1} / {photos.length}
                </p>
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
          </div>

          {/* Image area */}
          <div className="relative z-[60] flex h-full items-center justify-center px-4 pb-[150px] pt-[88px] md:px-24 md:pb-10 md:pt-[118px]">
            <button
              onClick={(e) => {
                e.stopPropagation()
                goPrevious()
              }}
              className="absolute left-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-3xl text-white backdrop-blur-xl transition hover:bg-white/10 md:flex"
              aria-label="Photo précédente"
            >
              ←
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-full max-w-full items-center justify-center"
            >
              <img
                src={selectedPhoto.image_url}
                alt=""
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="max-h-[calc(100svh-250px)] max-w-full select-none rounded-[18px] object-contain shadow-[0_30px_120px_rgba(0,0,0,0.9)] md:max-h-[calc(100svh-170px)] md:rounded-[24px]"
              />

              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px] md:rounded-[24px]">
                <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 rotate-[-24deg] grid-cols-2 gap-x-24 gap-y-12 opacity-25 md:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span
                      key={i}
                      className="whitespace-nowrap text-3xl font-black tracking-wide text-white/45 md:text-5xl"
                    >
                      FramEvent
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-3xl text-white backdrop-blur-xl transition hover:bg-white/10 md:flex"
              aria-label="Photo suivante"
            >
              →
            </button>
          </div>

          {/* Mobile navigation */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-[96px] left-4 right-4 z-[72] flex items-center justify-between md:hidden"
          >
            <button
              onClick={goPrevious}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl text-white backdrop-blur-xl"
              aria-label="Photo précédente"
            >
              ←
            </button>

            <p className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm font-bold text-white backdrop-blur-xl">
              {selectedImage + 1} / {photos.length}
            </p>

            <button
              onClick={goNext}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl text-white backdrop-blur-xl"
              aria-label="Photo suivante"
            >
              →
            </button>
          </div>

          {/* Mobile bottom purchase bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 z-[75] border-t border-white/10 bg-black/92 px-4 pb-5 pt-4 backdrop-blur-2xl md:hidden"
          >
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={addToCart}
                className="rounded-full border border-white/18 bg-white/10 px-4 py-4 text-sm font-bold text-white"
              >
                {added ? 'Ajouté ✓' : 'Panier'}
              </button>

              <button
                onClick={buyPhoto}
                className="rounded-full bg-white px-4 py-4 text-sm font-black text-black shadow-2xl"
              >
                Acheter {formatPrice(photoPrice)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}