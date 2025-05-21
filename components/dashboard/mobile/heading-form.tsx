'use client'

import { apiClient } from '@/lib/api-client'
import { useUploadFile } from '@/lib/minio/upload'
import { useSession } from 'next-auth/react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type Heading = {
  id?: string
  title: string
  imageUrl: string
}

export default function HeadingsPage() {
  const { data: session } = useSession()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [showForm, setShowForm] = useState(false)

  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadFileInput, setUploadFileInput] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadFile } = useUploadFile(uploadFileInput)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || (!imageUrl && !uploadFileInput)) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    setIsSubmitting(true)
    let finalThumbnailUrl = imageUrl

    if (uploadFileInput) {
      try {
        toast.loading('Upload de la miniature...')
        finalThumbnailUrl = await uploadFile()
        toast.success('Image uploadée avec succès !')
      } catch (error) {
        console.error('Error uploading thumbnail:', error)
        toast.error("Erreur lors de l'upload de l'image")
        setIsSubmitting(false)
        return
      }
    }

    const { data, error } = await apiClient.createHeading({
      body: { imageUrl: finalThumbnailUrl, title },
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })

    if (!data || error) {
      toast.error('Erreur lors de la création du contenu')
      setIsSubmitting(false)
      return
    }
    toast.success('Contenu créé avec succès !')

    setTitle('')
    setImageUrl('')
    setUploadFileInput(null)
    setIsSubmitting(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFileInput(file)
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageUrl(ev.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Fetch headings when the component mounts
  useEffect(() => {
    const fetchHeadings = async () => {
      const { data, error } = await apiClient.getHeadings({
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })

      if (!data || error) {
        toast.error('Erreur lors de la récupération des titres')
        return
      }
      setHeadings(
        data.map((heading) => ({
          id: heading.id,
          title: heading.title ?? '',
          imageUrl: heading.imageUrl ?? '',
        }))
      )
    }

    fetchHeadings().catch((error) => {
      console.error('Error fetching headings:', error)
      toast.error('Erreur lors de la récupération des titres')
    })
    // Optionally, you can set up a polling mechanism to refresh the headings
    const interval = setInterval(() => {
      fetchHeadings().catch((error) => {
        console.error('Error fetching headings:', error)
        toast.error('Erreur lors de la récupération des titres')
      })
    }, 60000) // Fetch every 60 seconds

    return () => {
      clearInterval(interval)
    }
  }, [session?.accessToken])

  return (
    <div className='w-full max-w-3xl mx-auto p-6 space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Titres</h1>
        {showForm ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className='text-sm text-gray-500 hover:underline mb-4'
          >
            ← Retour à la liste
          </button>
        ) : (
          <button
            onClick={() => setShowForm(!showForm)}
            className='px-4 py-2 rounded-md outline-none bg-orange-500 text-white hover:bg-orange-600'
          >
            Ajouter un titre
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className='flex flex-col sm:flex-row gap-6 justify-between space-y-6 p-4 rounded-md'
        >
          <div className='flex-1 space-y-4'>
            {/* Title Input */}
            <div>
              <label htmlFor='title' className='block text-sm font-medium mb-1'>
                Titre
              </label>
              <input
                type='text'
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-3 py-2 border rounded-md'
                placeholder='Titre'
              />
            </div>

            {/* Image URL + File Upload */}
            <div>
              <label htmlFor='image' className='block text-sm font-medium mb-1'>
                Image miniature
              </label>
              <div className='flex'>
                <input
                  type='text'
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className='flex-grow px-3 py-2 border rounded-l-md'
                  placeholder='Lien de l’image ou sélectionner un fichier'
                />
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='px-4 py-2 text-white bg-gray-500 rounded-r-md hover:bg-gray-600'
                >
                  Parcourir
                </button>
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className='hidden'
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50'
            >
              {isSubmitting ? 'Publication en cours...' : 'PUBLIER'}
            </button>
          </div>

          {imageUrl && (
            <div className='sm:w-1/3 flex justify-center items-start'>
              <img
                src={imageUrl}
                alt='Aperçu miniature'
                className='rounded-md max-h-40 w-full object-contain border'
              />
            </div>
          )}
        </form>
      )}

      {!showForm && (
        <div className='grid gap-4 sm:grid-cols-2'>
          {headings.map((heading, idx) => (
            <div key={idx} className='border rounded-md p-4 shadow-sm bg-white'>
              <img
                src={heading.imageUrl}
                alt={heading.title}
                className='w-full h-40 object-cover rounded-md mb-2'
              />
              <h2 className='text-lg font-semibold'>{heading.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
