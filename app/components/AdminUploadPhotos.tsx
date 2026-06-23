'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type UploadStatus = {
  name: string
  status: 'waiting' | 'uploading' | 'done' | 'error'
  message?: string
}

async function createWatermarkedPreview(file: File) {
  return new Promise<Blob>((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = () => {
      img.src = reader.result as string
    }

    img.onload = () => {
      const maxWidth = 1600
      const scale = Math.min(1, maxWidth / img.width)

      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject('Canvas error')
        return
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.globalAlpha = 0.22
      ctx.fillStyle = 'white'
      ctx.font = 'bold 70px Arial'
      ctx.textAlign = 'center'
      ctx.rotate((-25 * Math.PI) / 180)

      for (let x = -canvas.width; x < canvas.width * 2; x += 520) {
        for (let y = -canvas.height; y < canvas.height * 2; y += 280) {
          ctx.fillText('FramEvents', x, y)
        }
      }

      ctx.restore()

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject('Preview error')
            return
          }

          resolve(blob)
        },
        'image/jpeg',
        0.82
      )
    }

    img.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminUploadPhotos({
  eventId,
}: {
  eventId: number
}) {
  const router = useRouter()

  const [files, setFiles] = useState<File[]>([])
  const [statuses, setStatuses] = useState<UploadStatus[]>([])
  const [uploading, setUploading] = useState(false)

  const safeFileName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9.-]/g, '')
  }

  const uploadPhotos = async () => {
    if (files.length === 0) {
      alert('Wybierz zdjęcia do uploadu.')
      return
    }

    setUploading(true)

    setStatuses(
      files.map((file) => ({
        name: file.name,
        status: 'waiting',
      }))
    )

    for (const file of files) {
      setStatuses((current) =>
        current.map((item) =>
          item.name === file.name
            ? { ...item, status: 'uploading' }
            : item
        )
      )

      try {
        const cleanName = safeFileName(file.name)
        const timestamp = Date.now()

        const previewFileName =
          `${eventId}/${timestamp}-preview-${crypto.randomUUID()}-${cleanName}.jpg`

        const hdFileName =
          `${eventId}/${timestamp}-hd-${crypto.randomUUID()}-${cleanName}`

        const previewBlob = await createWatermarkedPreview(file)

        const formData = new FormData()
        formData.append('eventId', String(eventId))
        formData.append('previewFileName', previewFileName)
        formData.append('hdFileName', hdFileName)
        formData.append('previewFile', previewBlob, 'preview.jpg')
        formData.append('hdFile', file, cleanName)

        const response = await fetch('/api/admin-upload-photo', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Upload error')
        }

        setStatuses((current) =>
          current.map((item) =>
            item.name === file.name
              ? { ...item, status: 'done' }
              : item
          )
        )
      } catch (error) {
        console.log('ADMIN UPLOAD ERROR:', error)

        const message =
          error instanceof Error
            ? error.message
            : 'Upload error'

        setStatuses((current) =>
          current.map((item) =>
            item.name === file.name
              ? {
                  ...item,
                  status: 'error',
                  message,
                }
              : item
          )
        )
      }
    }

    setUploading(false)
    router.refresh()

    alert('Upload zakończony.')
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
      <label className="block">
        <span className="text-sm uppercase tracking-[3px] text-white/60">
          Select photos
        </span>

        <input
          type="file"
          multiple
          accept="image/*"
          className="mt-4 block w-full text-white"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || [])
            setFiles(selectedFiles)
            setStatuses([])
          }}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-6 text-white/60">
          Selected files: {files.length}
        </div>
      )}

      <button
        onClick={uploadPhotos}
        disabled={uploading}
        className="mt-8 rounded-full bg-white px-8 py-4 font-bold text-black disabled:opacity-40"
      >
        {uploading ? 'Uploading...' : 'Upload Photos'}
      </button>

      {statuses.length > 0 && (
        <div className="mt-8 space-y-3">
          {statuses.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">
                  {item.name}
                </p>

                {item.message && (
                  <p className="mt-1 text-xs text-red-400">
                    {item.message}
                  </p>
                )}
              </div>

              <p className="text-sm text-white/50">
                {item.status === 'waiting' && 'Waiting'}
                {item.status === 'uploading' && 'Uploading...'}
                {item.status === 'done' && 'Done ✅'}
                {item.status === 'error' && 'Error ❌'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}