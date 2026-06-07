'use client'

import { useState, useEffect } from 'react'

type Photo = {
  id: number
  image_url: string
}

export default function Gallery({
  photos,
}: {
  photos: Photo[]
}) {
  const [selectedImage, setSelectedImage] =
  useState<number | null>(null)

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedImage(null)
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  return () => {
    window.removeEventListener(
      'keydown',
      handleKeyDown
    )
  }
}, [])

  return (
    <>
      <div className="columns-1 md:columns-2 gap-8 space-y-8">
        {photos.map((photo, index) => (
          <img
            key={photo.id}
            src={photo.image_url}
            alt=""
            onClick={() =>
              setSelectedImage(index)
            }
            className="w-full mb-8 rounded-2xl hover:scale-[1.02] transition duration-300 cursor-pointer"
          />
        ))}
      </div>

      {selectedImage !== null && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-8"
        >
          <a
  href={photos[selectedImage].image_url}
  download
  className="absolute top-8 right-24 bg-white text-black px-6 py-3 rounded-full font-semibold"
>
  Download
</a>

<button
  onClick={() => setSelectedImage(null)}
  className="absolute top-8 right-8 text-white text-4xl"
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

          <img
            src={photos[selectedImage].image_url}
            alt=""
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>
      )}
    </>
  )
}