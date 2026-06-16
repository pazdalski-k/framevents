'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

type UploadStatus = {
  name: string
  status: 'waiting' | 'uploading' | 'done' | 'error'
  message?: string
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

  const updatePhotoCount = async () => {
    const { data: photos, error: countError } = await supabase
      .from('photos')
      .select('id')
      .eq('event_id', eventId)

    if (countError) {
      console.log('PHOTO COUNT ERROR:', countError)
      return
    }

    const count = photos?.length || 0

    const { error: updateError } = await supabase
      .from('events')
      .update({ photos_count: count })
      .eq('id', eventId)

    if (updateError) {
      console.log('EVENT COUNT UPDATE ERROR:', updateError)
    }
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

      const cleanName = safeFileName(file.name)
      const uniqueName = `${eventId}/${Date.now()}-${crypto.randomUUID()}-${cleanName}`

      const previewFileName = uniqueName
      const hdFileName = uniqueName

      const { error: previewError } = await supabase.storage
        .from('event-photos-preview')
        .upload(previewFileName, file)

      if (previewError) {
        console.log('PREVIEW UPLOAD ERROR:', previewError)

        setStatuses((current) =>
          current.map((item) =>
            item.name === file.name
              ? {
                  ...item,
                  status: 'error',
                  message: previewError.message,
                }
              : item
          )
        )

        continue
      }

      const { error: hdError } = await supabase.storage
        .from('event-photos-hd')
        .upload(hdFileName, file)

      if (hdError) {
        console.log('HD UPLOAD ERROR:', hdError)

        setStatuses((current) =>
          current.map((item) =>
            item.name === file.name
              ? {
                  ...item,
                  status: 'error',
                  message: hdError.message,
                }
              : item
          )
        )

        continue
      }

      const { data: publicUrlData } = supabase.storage
        .from('event-photos-preview')
        .getPublicUrl(previewFileName)

      const imageUrl = publicUrlData.publicUrl

      const { error: insertError } = await supabase
        .from('photos')
        .insert({
          event_id: eventId,
          image_url: imageUrl,
          file_name: previewFileName,
          hd_file_name: hdFileName,
        })

      if (insertError) {
        console.log('PHOTO INSERT ERROR:', insertError)

        setStatuses((current) =>
          current.map((item) =>
            item.name === file.name
              ? {
                  ...item,
                  status: 'error',
                  message: insertError.message,
                }
              : item
          )
        )

        continue
      }

      setStatuses((current) =>
        current.map((item) =>
          item.name === file.name
            ? { ...item, status: 'done' }
            : item
        )
      )
    }

    await updatePhotoCount()

    setUploading(false)
    router.refresh()

    alert('Upload zakończony.')
  }

  return (
    <div className="border border-white/10 rounded-3xl p-8 bg-white/[0.03]">
      <label className="block">
        <span className="text-white/60 text-sm uppercase tracking-[3px]">
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
        className="mt-8 px-8 py-4 rounded-full bg-white text-black font-bold disabled:opacity-40"
      >
        {uploading ? 'Uploading...' : 'Upload Photos'}
      </button>

      {statuses.length > 0 && (
        <div className="mt-8 space-y-3">
          {statuses.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between border border-white/10 rounded-2xl px-4 py-3"
            >
              <div>
                <p className="text-white text-sm">
                  {item.name}
                </p>

                {item.message && (
                  <p className="text-red-400 text-xs mt-1">
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