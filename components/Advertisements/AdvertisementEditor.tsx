'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUploadFile } from '@/lib/minio/upload'
import { Link as LinkIcon, X } from 'lucide-react'
import { useRef, useState } from 'react'

import { useAdvertisementControllerServicePutApiV1AdvertisementsById } from '@/lib/api-client/rq-generated/queries'
import type { AdvertisementDto } from '@/lib/api-client/rq-generated/requests'
import { toast } from 'sonner'

interface AdvertisementEditorProps {
  advertisement?: AdvertisementDto | null
}

export default function AdvertisementEditor({
  advertisement,
}: AdvertisementEditorProps) {
  const [title, setTitle] = useState(advertisement?.title ?? '')
  const [description, setDescription] = useState(advertisement?.content ?? '')
  const [referenceUrl, setReferenceUrl] = useState(advertisement?.url ?? '')
  const [uploadFileInput, setUploadFile] = useState<File | null>(null)
  const [featuredImage, setFeaturedImage] = useState(
    advertisement?.imageUrl ?? ''
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: updateAdvertisement } =
    useAdvertisementControllerServicePutApiV1AdvertisementsById({
      onSuccess: () => {
        toast.success('Publicité mise à jour avec succès!')
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour de la publicité')
      },
    })

  const { uploadFile } = useUploadFile('advertisements', uploadFileInput)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFile(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setFeaturedImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!advertisement?.id) return

    let imageUrl = advertisement.imageUrl
    if (uploadFileInput) {
      imageUrl = await uploadFile()
    }
    updateAdvertisement({
      id: advertisement.id,
      requestBody: {
        title,
        content: description,
        url: referenceUrl ?? undefined,
        imageUrl: imageUrl ?? undefined,
      },
    })
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-4'>
        <Input
          placeholder='Titre de la publicité'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='text-lg'
        />

        <Textarea
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Input
              type='url'
              placeholder='URL de référence'
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              className='flex-1'
            />
            <Button
              variant='outline'
              size='icon'
              onClick={() => window.open(referenceUrl, '_blank')}
              disabled={!referenceUrl}
            >
              <LinkIcon className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <div
          className='border-2 border-dashed border-blue-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors'
          onClick={() => fileInputRef.current?.click()}
        >
          {featuredImage ? (
            <div className='relative w-full'>
              <img
                src={featuredImage}
                alt='Featured'
                className='w-full h-48 object-cover rounded-md'
              />
              <button
                className='absolute top-2 right-2 bg-white rounded-full p-1'
                onClick={(e) => {
                  e.stopPropagation()
                  setFeaturedImage('')
                  setUploadFile(null)
                }}
              >
                <X className='h-4 w-4 text-gray-500' />
              </button>
            </div>
          ) : (
            <div className='text-blue-500 text-center'>
              <span className='text-3xl'>+</span>
              <p className='mt-2 text-sm text-blue-500'>Ajouter une image</p>
            </div>
          )}
          <input
            type='file'
            ref={fileInputRef}
            className='hidden'
            accept='image/*'
            onChange={handleImageUpload}
          />
        </div>

        <Button onClick={handleSave} className='w-full'>
          Mettre à jour
        </Button>
      </div>
    </div>
  )
}
