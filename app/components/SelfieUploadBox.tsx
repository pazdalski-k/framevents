'use client'

import { useRef, useState } from 'react'

export default function SelfieUploadBox() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }

    const url = URL.createObjectURL(file)

    setPreviewUrl(url)
    setSelectedFile(file)
    setStatus('')
  }

  const uploadSelfie = async () => {
    if (!selectedFile) {
      setStatus('Please choose a selfie first.')
      return
    }

    setLoading(true)
    setStatus('Uploading selfie...')

    const formData = new FormData()
    formData.append('file', selectedFile)

    const response = await fetch('/api/upload-selfie', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      setStatus(
        'Selfie uploaded successfully. Face search engine will be connected in the next step.'
      )
    } else {
      setStatus(
        data.error || 'Selfie upload failed. Please try again.'
      )
    }

    setLoading(false)
  }

  return (
    <div className="border-2 border-dashed border-white/20 rounded-[32px] min-h-[320px] flex items-center justify-center p-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {previewUrl ? (
        <div className="text-center w-full">
          <img
            src={previewUrl}
            alt="Selfie preview"
            className="mx-auto max-h-[220px] rounded-2xl object-contain mb-6"
          />

          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition"
            >
              Change selfie
            </button>

            <button
              type="button"
              onClick={uploadSelfie}
              disabled={loading}
              className="bg-white text-black px-6 py-3 rounded-full font-semibold disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload selfie'}
            </button>
          </div>

          {status && (
            <p className="text-white/50 text-sm mt-4 leading-relaxed">
              {status}
            </p>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="text-7xl mb-6">📸</div>

          <p className="text-xl text-white/60 mb-6">
            Upload a selfie to find your photos
          </p>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
          >
            Upload Selfie
          </button>
        </div>
      )}
    </div>
  )
}