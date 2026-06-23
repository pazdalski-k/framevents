'use client'

import { useEffect, useMemo, useState } from 'react'

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

const CART_STORAGE_KEY = 'eventframe_cart'

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
  const [isCartOpen, setIsCartOpen] = useState(false)

  const selectedPhoto = selectedImage !== null ? photos[selectedImage] : null

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0)
  }, [cart])

  const formatPrice = (price: number) => {
    return `${price.toFixed(2).replace('.', ',')}€`
  }

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)

      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch {
      setCart([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (selectedImage === null && !isCartOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedImage, isCartOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCartOpen && e.key === 'Escape') {
        setIsCartOpen(false)
        return
      }

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
  }, [selectedImage, photos.length, isCartOpen])

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
    if (cart.length === 0) return

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

  const clearCart = () => {
    setCart([])
    setIsCartOpen(false)
  }

  const goPrevious = () => {
    if (selectedImage === null) return

    setSelectedImage(selectedImage > 0 ? selectedImage - 1 : photos.length - 1)
  }

  const goNext = () => {
    if (selectedImage === null) return

    setSelectedImage(selectedImage < photos.length - 1 ? selectedImage + 1 : 0)
  }

  const isSelectedPhotoInCart = selectedPhoto
    ? cart.some((item) => item.photoId === selectedPhoto.id)
    : false

  return (
    <>
      {cart.length > 0 && (
        <div className="sticky top-4 z-40 mb-8 flex justify-center px-4">
          <div className="flex w-full max-w-4xl flex-col gap-3 rounded-[28px] border border-white/10 bg-white p-4 text-black shadow-2xl md:flex-row md:items-center md:justify-between md:rounded-full md:px-6 md:py-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col text-left transition hover:opacity-70 md:flex-row md:items-center md:gap-5"
            >
              <span className="font-bold">
                Panier · {cart.length} photo{cart.length > 1 ? 's' : ''}
              </span>

              <span className="text-sm text-black/50">
                Total : {formatPrice(total)}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="rounded-full border border-black/10 bg-black/5 px-5 py-3 text-sm font-bold text-black transition hover:bg-black/10"
              >
                Voir le panier
              </button>

              <button
                onClick={checkoutCart}
                className="rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02]"
              >
                Paiement
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
        {photos.map((photo, index) => {
          const isInCart = cart.some((item) => item.photoId === photo.id)

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
                  className="absolute right-4 top-4 rounded-full border border-white/15 bg-white px-4 py-2 text-xs font-bold text-black shadow-xl transition hover:scale-[1.04]"
                >
                  Retirer ✓
                </button>
              )}
            </div>
          )
        })}
      </div>

      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 z-[90] bg-black/80 p-4 text-white backdrop-blur-xl md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-auto flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#111111] shadow-[0_40px_140px_rgba(0,0,0,0.85)] md:rounded-[40px]"
          >
            <div className="flex items-start justify-between gap-6 border-b border-white/10 p-5 md:p-8">
              <div>
                <p className="text-xs uppercase tracking-[4px] text-[#d6a85f]">
                  Panier
                </p>

                <h3 className="mt-2 text-3xl font-black md:text-4xl">
                  Votre sélection
                </h3>

                <p className="mt-2 text-sm text-white/50">
                  {cart.length} photo{cart.length > 1 ? 's' : ''} · Total{' '}
                  {formatPrice(total)}
                </p>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
                aria-label="Fermer le panier"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-8">
              {cart.length === 0 ? (
                <div className="rounded-[28px] border border-white/10 bg-black/40 p-8 text-center">
                  <h4 className="text-2xl font-bold">
                    Aucune photo sélectionnée
                  </h4>

                  <p className="mt-3 text-white/50">
                    Ajoutez une photo au panier pour continuer.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {cart.map((item, index) => (
                    <div
                      key={item.photoId}
                      className="grid grid-cols-[88px_1fr] gap-4 rounded-[24px] border border-white/10 bg-black/35 p-3 md:grid-cols-[120px_1fr_auto] md:items-center md:p-4"
                    >
                      <img
                        src={item.imageUrl}
                        alt=""
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        className="h-[88px] w-[88px] rounded-[18px] object-cover md:h-[96px] md:w-[120px]"
                      />

                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[3px] text-white/35">
                          Photo #{index + 1}
                        </p>

                        <p className="mt-2 font-bold text-white">
                          Image HD sans filigrane
                        </p>

                        <p className="mt-1 text-sm text-white/50">
                          {formatPrice(item.price)}
                        </p>

                        <button
                          onClick={() => removeFromCart(item.photoId)}
                          className="mt-4 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white/75 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-200 md:hidden"
                        >
                          Supprimer
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.photoId)}
                        className="hidden rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white/75 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-200 md:block"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 bg-black/50 p-5 md:p-8">
              <div className="mb-5 flex items-center justify-between text-lg">
                <span className="text-white/60">Total</span>
                <span className="text-2xl font-black text-white">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Continuer
                </button>

                <button
                  onClick={clearCart}
                  disabled={cart.length === 0}
                  className="rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-white/75 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Vider le panier
                </button>

                <button
                  onClick={checkoutCart}
                  disabled={cart.length === 0}
                  className="rounded-full bg-white px-6 py-4 text-sm font-black text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Passer au paiement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedImage !== null && selectedPhoto && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black text-white"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),rgba(0,0,0,0)_42%),linear-gradient(180deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_16%,rgba(0,0,0,1)_100%)]" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 top-0 z-[70] hidden border-b border-white/10 bg-black/88 px-6 py-5 shadow-2xl backdrop-blur-2xl md:block"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[4px] text-white/35">
                  FramEvents
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
                  {isSelectedPhotoInCart
                    ? 'Déjà dans le panier ✓'
                    : added
                      ? 'Ajouté ✓'
                      : 'Ajouter au panier'}
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="rounded-full border border-[#d6a85f]/50 bg-[#d6a85f]/10 px-7 py-4 text-sm font-bold text-[#d6a85f] transition hover:bg-[#d6a85f] hover:text-black"
                >
                  Voir le panier ({cart.length})
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

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 top-0 z-[70] border-b border-white/10 bg-black/90 px-4 py-4 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[3px] text-white/35">
                  FramEvents
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

          <div className="relative z-[60] flex h-full items-center justify-center px-4 pb-[170px] pt-[88px] md:px-24 md:pb-10 md:pt-[118px]">
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
                className="max-h-[calc(100svh-280px)] max-w-full select-none rounded-[18px] object-contain shadow-[0_30px_120px_rgba(0,0,0,0.9)] md:max-h-[calc(100svh-170px)] md:rounded-[24px]"
              />

              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px] md:rounded-[24px]">
                <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 rotate-[-24deg] grid-cols-2 gap-x-24 gap-y-12 opacity-25 md:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span
                      key={i}
                      className="whitespace-nowrap text-3xl font-black tracking-wide text-white/45 md:text-5xl"
                    >
                      FramEvents
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

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-[116px] left-4 right-4 z-[72] flex items-center justify-between md:hidden"
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

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 z-[75] border-t border-white/10 bg-black/92 px-4 pb-5 pt-4 backdrop-blur-2xl md:hidden"
          >
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={addToCart}
                className="rounded-full border border-white/18 bg-white/10 px-3 py-4 text-xs font-bold text-white"
              >
                {isSelectedPhotoInCart
                  ? 'Ajoutée ✓'
                  : added
                    ? 'Ajouté ✓'
                    : 'Ajouter'}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="rounded-full border border-[#d6a85f]/50 bg-[#d6a85f]/10 px-3 py-4 text-xs font-bold text-[#d6a85f]"
              >
                Panier ({cart.length})
              </button>

              <button
                onClick={buyPhoto}
                className="rounded-full bg-white px-3 py-4 text-xs font-black text-black shadow-2xl"
              >
                Acheter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}