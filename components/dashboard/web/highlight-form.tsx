'use client'

import { Textarea } from '@/components/ui/textarea'
import { useHighlightControllerServicePostApiV1Highlights } from '@/lib/api-client/rq-generated/queries'
import { useUploadFile } from '@/lib/minio/upload'
import { X } from 'lucide-react'
import type React from 'react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export default function HighlightForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [uploadFileInput, setUploadFile] = useState<File | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadFile: uploadToMinio } = useUploadFile('highlights')

  const { mutate: createHighlight } =
    useHighlightControllerServicePostApiV1Highlights({
      onSuccess: () => {
        toast.success('Point fort créé avec succès !')
        // Reset form
        setTitle('')
        setDescription('')
        setVideoUrl('')
        setThumbnailUrl('')
        setUploadFile(null)
      },
      onError: (error) => {
        toast.error('Erreur lors de la création du point fort')
        console.error(error)
      },
    })

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setThumbnailUrl(ev.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !videoUrl || !description) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    let finalThumbnailUrl = thumbnailUrl
    if (uploadFileInput) {
      try {
        toast.loading('Upload de la miniature...')

        finalThumbnailUrl = await uploadToMinio(uploadFileInput)
      } catch (error) {
        toast.error("Erreur lors de l'upload de l'image : " + String(error))
        return
      }
    }

    createHighlight({
      requestBody: {
        title,
        videoUrl,
        description,
        thumbnailUrl: finalThumbnailUrl || videoUrl,
      },
    })
  }

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='title' className='block text-sm font-medium'>
            Titre point fort
          </label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            placeholder='titre'
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='description' className='block text-sm font-medium'>
            Description
          </label>
          <Textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            placeholder='Description du point fort'
            rows={4}
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='video' className='block text-sm font-medium'>
            Insérer vidéo
          </label>
          <div className='flex'>
            <input
              type='text'
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className='flex-grow px-3 py-2 border rounded-l-md'
              placeholder='lien'
            />
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='px-3 py-2 text-white bg-gray-400 rounded-r-md hover:bg-gray-500'
            >
              Choisir une miniature
            </button>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleThumbnailSelect}
            className='hidden'
          />
          {thumbnailUrl && (
            <div className='mt-2 relative inline-block'>
              <img
                src={thumbnailUrl}
                alt='Miniature'
                className='w-32 h-32 object-cover rounded-md'
              />
              <button
                type='button'
                className='absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm'
                onClick={() => {
                  setThumbnailUrl('')
                  setUploadFile(null)
                }}
              >
                <X className='h-4 w-4 text-gray-500' />
              </button>
            </div>
          )}
        </div>

        <button
          type='submit'
          className='w-full py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600'
        >
          PUBLIER
        </button>
      </form>
    </div>
  )
}
