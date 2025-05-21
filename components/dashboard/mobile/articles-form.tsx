'use client'

import Preview from '@/components/previews/article/preview'
import { Badge } from '@/components/ui/badge'
import { CATEGORIES, SHOE_SIZES, SIZES } from '@/constants/product'
import { apiClient } from '@/lib/api-client'
import { useUploadFile } from '@/lib/minio/upload'
import { type ProductData } from '@/types/product'
import { ChevronDown, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { type KeyboardEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function ArticlesForm() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<ProductData>({
    category: 'Catégories',
    images: [],
    name: '',
    price: '',
    description: '',
    colors: [],
    sizes: [],
    shoeSizes: [],
  })

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSizesOpen, setIsSizesOpen] = useState(false)
  const [isShoesSizesOpen, setIsShoesSizesOpen] = useState(false)
  const [newColor, setNewColor] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isPending, setIsPending] = useState(false)

  const categories = CATEGORIES

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { uploadFile: uploadUrl } = useUploadFile(uploadFile)

  const handleAddColor = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newColor.trim()) {
      e.preventDefault()
      setFormData((prev) => ({
        ...prev,
        colors: [...(prev.colors ?? []), newColor.trim()],
      }))
      setNewColor('')
    }
  }

  const handleRemoveColor = (colorToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors?.filter((color) => color !== colorToRemove),
    }))
  }

  const handleImageSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // Prévisualiser toutes les images
      Array.from(files).forEach((file) => {
        setUploadFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, reader.result as string],
          }))
        }
        reader.readAsDataURL(file)
      })

      toast.info('Images ajoutées avec succès !')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (formData.images.length === 0) {
      toast.error('Veuillez ajouter au moins une image')
      return
    }

    toast.loading("Création de l'article en cours...")

    try {
      // Uploader l'image
      let imageUrl = ''

      if (uploadFile) {
        try {
          imageUrl = await uploadUrl()
        } catch (error) {
          console.error("Erreur lors de l'upload de l'image:", error)
          toast.error("Erreur lors de l'upload de l'image")
          return
        }
      }

      setIsPending(true)
      // Créer le produit
      const { data: product, error } = await apiClient.createProduct({
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: {
          categoryNames: [formData.category],
          name: formData.name,
          description: formData.description,
          price: Number(formData.price) || 0,
          imageUrl: imageUrl,
          stockQuantity: 0,
          sizes: formData.sizes,
        },
      })

      if (!product || error) {
        console.error("Erreur lors de la création de l'article:", error)
        toast.error("Erreur lors de la création de l'article")
        return
      }

      // Créer les produits couleurs
      await Promise.all(
        formData.images.map((imageUrl, i) =>
          apiClient.createProductVariant({
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
            body: {
              imageUrl,
              stockQuantity: 0,
              price: Number(formData.price) || 0,
              sizes: formData.sizes,
              productId: product?.id,
              colorCode: (formData.colors ?? [])[i] ?? 'default',
            },
          })
        )
      )

      setIsPending(false)

      toast.success('Article créé avec succès !')

      // Réinitialiser le formulaire
      setFormData({
        category: 'Catégories',
        images: [],
        name: '',
        price: '',
        description: '',
        colors: [],
        sizes: [],
        shoeSizes: [],
      })
      setUploadFile(null)
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      console.error("Erreur lors de la création de l'article:", err)
      toast.error("Erreur lors de la création de l'article")
    }
  }

  const showColorsField = ['Maillot', 'Godasse'].includes(formData.category)
  const showSizesField = formData.category === 'Maillot'
  const showShoeSizesField = formData.category === 'Godasse'

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Catégories */}
        <div className='space-y-2'>
          <label htmlFor='category' className='block text-sm font-medium'>
            Catégories
          </label>
          <div className='relative'>
            <button
              type='button'
              className='flex items-center justify-between w-full px-3 py-2 text-left border rounded-md'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {formData.category}
              <ChevronDown className='w-4 h-4 ml-2' />
            </button>
            {isDropdownOpen && (
              <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto'>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className='px-3 py-2 cursor-pointer hover:bg-gray-100'
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        category: cat,
                      }))
                      setIsDropdownOpen(false)
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Images - Mise à jour du composant d'upload */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium'>Images du produit</label>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            accept='image/*'
            multiple
            className='hidden'
          />
          <div
            className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-wrap gap-2 cursor-pointer hover:bg-gray-50 transition-colors'
            onClick={handleImageSelect}
          >
            {formData.images.map((img, index) => (
              <div
                key={index}
                className='relative w-20 h-20 bg-gray-100 rounded-md'
              >
                <img
                  src={img}
                  alt=''
                  className='w-full h-full object-cover rounded-md'
                />
                <button
                  type='button'
                  className='absolute -top-2 -right-2 bg-red-500 rounded-full p-1'
                  onClick={(e) => {
                    e.stopPropagation()
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }))
                  }}
                >
                  <X className='w-4 h-4 text-white' />
                </button>
              </div>
            ))}
            {formData.images.length === 0 && (
              <div className='text-gray-500 w-full text-center p-6'>
                <span className='text-3xl'>+</span>
                <p className='mt-2 text-sm'>Cliquez pour ajouter des images</p>
              </div>
            )}
          </div>
        </div>
        {/* Champs conditionnels */}
        {showColorsField && (
          <div className='space-y-2'>
            <label className='block text-sm font-medium'>
              Couleurs disponibles
            </label>
            <div className='flex flex-wrap gap-2 mb-2'>
              {formData.colors?.map((color) => (
                <Badge key={color} variant='secondary'>
                  {color}
                  <button
                    type='button'
                    onClick={() => handleRemoveColor(color)}
                    className='ml-2'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </Badge>
              ))}
            </div>
            <input
              type='text'
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyDown={handleAddColor}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='Ajouter une couleur et appuyer sur Entrée'
            />
          </div>
        )}
        {showSizesField && (
          <div className='space-y-2'>
            <label className='block text-sm font-medium'>
              Tailles disponibles
            </label>
            <div className='relative'>
              <button
                type='button'
                className='flex items-center justify-between w-full px-3 py-2 text-left border rounded-md'
                onClick={() => setIsSizesOpen(!isSizesOpen)}
              >
                {formData.sizes?.length
                  ? `${formData.sizes.length} taille(s) sélectionnée(s)`
                  : 'Sélectionner les tailles'}
                <ChevronDown className='w-4 h-4 ml-2' />
              </button>
              {isSizesOpen && (
                <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg'>
                  {SIZES.map((size) => (
                    <label
                      key={size}
                      className='flex items-center px-3 py-2 hover:bg-gray-100'
                    >
                      <input
                        type='checkbox'
                        checked={formData.sizes?.includes(size)}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            sizes: e.target.checked
                              ? [...(prev.sizes ?? []), size]
                              : (prev.sizes?.filter((s) => s !== size) ?? []),
                          }))
                        }}
                        className='mr-2'
                      />
                      {size}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {showShoeSizesField && (
          <div className='space-y-2'>
            <label className='block text-sm font-medium'>
              Pointures disponibles
            </label>
            <div className='relative'>
              <button
                type='button'
                className='flex items-center justify-between w-full px-3 py-2 text-left border rounded-md'
                onClick={() => setIsShoesSizesOpen(!isShoesSizesOpen)}
              >
                {formData.shoeSizes?.length
                  ? `${formData.shoeSizes.length} pointure(s) sélectionnée(s)`
                  : 'Sélectionner les pointures'}
                <ChevronDown className='w-4 h-4 ml-2' />
              </button>
              {isShoesSizesOpen && (
                <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto'>
                  {SHOE_SIZES.map((size) => (
                    <label
                      key={size}
                      className='flex items-center px-3 py-2 hover:bg-gray-100'
                    >
                      <input
                        type='checkbox'
                        checked={formData.shoeSizes?.includes(size)}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            shoeSizes: e.target.checked
                              ? [...(prev.shoeSizes ?? []), size]
                              : (prev.shoeSizes?.filter((s) => s !== size) ??
                                []),
                          }))
                        }}
                        className='mr-2'
                      />
                      {size}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Champs de base */}
        <div className='space-y-2'>
          <label htmlFor='name' className='block text-sm font-medium'>
            Nom de l{"'"}article
          </label>
          <input
            type='text'
            id='name'
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className='w-full px-3 py-2 border rounded-md'
            placeholder="Nom de l'article"
          />
        </div>
        <div className='space-y-2'>
          <label htmlFor='price' className='block text-sm font-medium'>
            Prix
          </label>
          <input
            type='text'
            id='price'
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: e.target.value,
              }))
            }
            className='w-full px-3 py-2 border rounded-md'
            placeholder='Prix'
          />
        </div>
        <div className='space-y-2'>
          <label htmlFor='description' className='block text-sm font-medium'>
            Description
          </label>
          <textarea
            id='description'
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className='w-full px-3 py-2 border rounded-md'
            rows={4}
            placeholder='Ajouter une des description'
          ></textarea>
        </div>{' '}
        <button
          type='submit'
          className='w-full py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600'
          disabled={isPending}
        >
          {isPending ? 'PUBLICATION EN COURS...' : 'PUBLIER'}
        </button>
      </form>

      <div className='sticky top-4'>
        <Preview data={formData} />
      </div>
    </div>
  )
}
