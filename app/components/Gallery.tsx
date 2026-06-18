'use client'

import { useState, useEffect } from 'react'

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
  const [selectedImage, setSelectedImage] =
    useState<number | null>(null)

  const [cart, setCart] = useState<CartItem[]>([])
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('eventframe_cart')

    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'eventframe_cart',
      JSON.stringify(cart)
    )
  }, [cart])

  const buyPhoto = async () => {
    if (selectedImage === null) return

    const photo = photos[selectedImage]

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photoId: photo.id,
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
    if (selectedImage === null) return

    const photo = photos[selectedImage]

    setCart((currentCart) => {
      const alreadyExists = currentCart.some(
        (item) => item.photoId === photo.id
      )

      if (alreadyExists) return currentCart

      return [
        ...currentCart,
        {
          photoId: photo.id,
          imageUrl: photo.image_url,
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

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      {cart.length > 0 && (
        <div className="sticky top-6 z-40 mb-10 flex justify-center">
          <div className="bg-white text-black rounded-full px-6 py-4 flex items-center gap-6 shadow-2xl">
            <span className="font-semibold">
              {cart.length} photo{cart.length > 1 ? 's' : ''} dans le panier
            </span>

            <span className="text-black/50">
              Total : {total}€
            </span>

            <button
              onClick={checkoutCart}
              className="bg-black text-white px-6 py-3 rounded-full font-semibold"
            >
              Payer
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {photos.map((photo, index) => {
          const isInCart = cart.some(
            (item) => item.photoId === photo.id
          )

          return (
            <div key={photo.id} className="relative group">
              <img
                src={photo.image_url}
                alt=""
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => setSelectedImage(index)}
                className="w-full aspect-[4/3] object-cover rounded-2xl hover:scale-[1.02] transition duration-300 cursor-pointer select-none"
              />

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition">
                <div className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {photoPrice}€
                </div>

                <button
                  onClick={() => setSelectedImage(index)}
                  className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition"
                >
                  Acheter la photo
                </button>
              </div>

              {isInCart && (
                <button
                  onClick={() => removeFromCart(photo.id)}
                  className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold"
                >
                  Dans le panier ✓
                </button>
              )}
            </div>
          )
        })}
      </div>

      {selectedImage !== null && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-8"
        >
          <div className="absolute top-8 right-24 flex gap-3 z-[60]">
            <button
              onClick={(e) => {
                e.stopPropagation()
                addToCart()
              }}
              className="border border-white/20 text-white px-6 py-4 rounded-full font-semibold hover:bg-white/10 transition"
            >
              {added ? 'Ajouté ✓' : 'Ajouter au panier'}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                buyPhoto()
              }}
              className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition"
            >
              Acheter la photo {photoPrice}€
            </button>
          </div>

          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition z-[60]"
          >
            ✕
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(
                selectedImage > 0
                  ? selectedImage - 1
                  : photos.length - 1
              )
            }}
            className="absolute left-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-4xl text-white hover:bg-black/70 transition z-[60]"
          >
            ←
          </button>

          <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white text-xl font-semibold z-[60]">
            {selectedImage + 1} / {photos.length}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(
                selectedImage < photos.length - 1
                  ? selectedImage + 1
                  : 0
              )
            }}
            className="absolute right-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-4xl text-white hover:bg-black/70 transition z-[60]"
          >
            →
          </button>

          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[selectedImage].image_url}
              alt=""
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl select-none"
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-white/20 text-7xl font-bold rotate-[-25deg] tracking-widest">
                FramEvent
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}