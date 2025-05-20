"use client";

import type React from "react"

import { useState, useRef } from "react"
import { X, Link as LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useUploadFile } from '@/lib/minio/upload'
import { trpc } from '@/lib/trpc/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function PublicitesForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [featuredImage, setFeaturedImage] = useState("")
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { mutate: createAdvertisement } = trpc.advertisements.createAdvertisement.useMutation()
  const { uploadFile: uploadUrl } = useUploadFile(uploadFile)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Si l'utilisateur a sélectionné une image, on désactive la vidéo
      setMediaType('image')
      setVideoUrl('')
      setUploadFile(file)
      
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setFeaturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Si l'utilisateur saisit une URL de vidéo, on désactive l'image
    setMediaType('video')
    setFeaturedImage('')
    setUploadFile(null)
    setVideoUrl(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation de base
    if (!title) {
      toast.error('Le titre est requis')
      return
    }

    if (mediaType === 'image' && !uploadFile) {
      toast.error('Veuillez sélectionner une image')
      return
    }

    if (mediaType === 'video' && !videoUrl) {
      toast.error('Veuillez fournir une URL de vidéo')
      return
    }

    // Notification de progression
    const toastId = toast.loading('Création de la publicité en cours...')
    
    try {
      if (mediaType === 'image' && uploadFile) {
        // Upload de l'image et création de la publicité
        toast.loading('Upload de l\'image...', { id: toastId })
        const uploadedImageUrl = await uploadUrl()
        
        toast.loading('Enregistrement de la publicité...', { id: toastId })
        
        createAdvertisement({
          title,
          description,
          referenceUrl,
          imageUrl: uploadedImageUrl,
        }, {
          onSuccess: () => {
            toast.success('Publicité créée avec succès!', { id: toastId })
            // Réinitialiser le formulaire
            resetForm()
          },
          onError: (error) => {
            toast.error(`Erreur: ${error.message}`, { id: toastId })
          }
        })
      } else if (mediaType === 'video') {
        // Création directe avec URL vidéo
        toast.loading('Enregistrement de la publicité...', { id: toastId })
        
        createAdvertisement({
          title,
          description,
          referenceUrl,
          imageUrl: videoUrl, // On utilise le champ imageUrl pour stocker l'URL de la vidéo
        }, {
          onSuccess: () => {
            toast.success('Publicité créée avec succès!', { id: toastId })
            // Réinitialiser le formulaire
            resetForm()
          },
          onError: (error) => {
            toast.error(`Erreur: ${error.message}`, { id: toastId })
          }
        })
      }
    } catch (error) {
      toast.error('Une erreur est survenue', { id: toastId })
      console.error(error)
    }
  }
  
  const resetForm = () => {
    setTitle('')
    setDescription('')
    setReferenceUrl('')
    setVideoUrl('')
    setFeaturedImage('')
    setUploadFile(null)
    setMediaType('image')
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Média de la publicité</h2>
          
          <div className="mb-4">
            <div className="flex space-x-4 mb-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${mediaType === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setMediaType('image')}
              >
                Image
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${mediaType === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setMediaType('video')}
              >
                Vidéo
              </button>
            </div>
          </div>
          
          {mediaType === 'image' && (
            <div id="image-upload">
              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {featuredImage ? (
                  <div className="relative w-full">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      className="absolute top-2 right-2 bg-white rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFeaturedImage("")
                        setUploadFile(null)
                      }}
                      type="button"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div className="text-blue-500 text-center">
                    <span className="text-3xl">+</span>
                    <p className="mt-2 text-sm text-blue-500">Ajouter une image</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>
            </div>
          )}
          
          {mediaType === 'video' && (
            <div className='space-y-2'>
              <Input
                type='text'
                value={videoUrl}
                onChange={handleVideoUrlChange}
                className='w-full'
                placeholder='URL de la vidéo (YouTube, Vimeo, etc.)'
              />
              {videoUrl && (
                <div className="mt-2 p-2 border rounded-md">
                  <p className="text-sm text-gray-600">URL vidéo: {videoUrl}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='space-y-2'>
          <label htmlFor='title' className='block text-sm font-medium'>
            Titre de la publicité
          </label>
          <Input
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full'
            placeholder='Titre de la publicité'
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
            className='w-full'
            placeholder='Description'
            rows={4}
          />
        </div>
        
        <div className='space-y-2'>
          <label htmlFor='referenceUrl' className='block text-sm font-medium'>
            URL de référence
          </label>
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-4 w-4 text-gray-500" />
            <Input
              id='referenceUrl'
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              className='w-full'
              placeholder='https://example.com'
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="px-4 bg-orange-400 rounded-sm"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="rounded-sm px-4 font-semibold text-shadow-2xs bg-blue-500 hover:bg-blue-600"
          >
            PUBLIER
          </Button>
        </div>
      </form>
    </div>
  );
}
