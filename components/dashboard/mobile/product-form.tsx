'use client'

import Preview from '@/components/previews/product/preview'
import {
  useProductControllerServicePostApiProducts,
  useProductVariantControllerServicePostApiProductVariantsBulk, // Assuming bulk variant creation
} from '@/lib/api-client/rq-generated/queries'
import type {
  ProductDto,
  ProductVariantDto,
} from '@/lib/api-client/rq-generated/requests/types.gen'
import { useUploadFile } from '@/lib/minio/upload' // Keep for file uploads
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
// Removed useSession

// Define a type for variant form values if not already available from ProductFormValues.variants
export type ProductVariantFormValues = {
  id?: string
  imageFile?: FileList
  colorCode: string
  price: number
  stockQuantity: number
  sizes: string[]
  imageUrl?: string
}

export const productSchema = z.object({
  id: z.string().optional(),
  imageFile: z
    .custom<FileList>(
      (val) => typeof window === 'undefined' || val instanceof FileList,
      { message: 'Invalid file list' }
    )
    .optional(),
  imageUrl: z.string().optional(),
  name: z.string().min(1, 'Le nom du produit est requis.'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Le prix doit être positif.'),
  stockQuantity: z.coerce
    .number()
    .int()
    .nonnegative('Le stock doit être non-négatif.'),
  categoryNames: z
    .array(z.string())
    .min(1, 'Au moins une catégorie est requise.'),
  sizes: z.array(z.string()).optional(), // Make optional if not always required
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        imageFile: z
          .custom<FileList>(
            (val) => typeof window === 'undefined' || val instanceof FileList
          )
          .optional(),
        colorCode: z.string().min(1, 'Le code couleur est requis.'),
        price: z.coerce
          .number()
          .positive('Le prix de la variante doit être positif.'),
        stockQuantity: z.coerce
          .number()
          .int()
          .nonnegative('Le stock de la variante doit être non-négatif.'),
        sizes: z.array(z.string()).optional(), // Make optional
        imageUrl: z.string().optional(),
      })
    )
    .optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const ProductForm = () => {
  const queryClient = useQueryClient()
  const {
    uploadFile,
    isUploading,
    error: uploadError,
  } = useUploadFile('products') // Generic uploader instance

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors: formErrors }, // Use RHF errors
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      categoryNames: [],
      sizes: [],
      variants: [],
    },
  })

  const {
    fields: variantFields,
    append,
    remove,
  } = useFieldArray({ control, name: 'variants' })

  const createProductMutation = useProductControllerServicePostApiProducts({
    onSuccess: (data) => {
      // data here is the created ProductDto (or the full API response depending on codegen config)
      // Assuming data is ProductDto based on typical hook return.
      toast.success(`Produit "${data.name}" créé avec succès!`)
      void queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      console.log(error)
      toast.error(`Une erreur s'est produite lors de la création du produit`)
    },
  })

  const createVariantsMutation =
    useProductVariantControllerServicePostApiProductVariantsBulk({
      onSuccess: () => {
        toast.success('Variantes créées avec succès!')
        void queryClient.invalidateQueries({ queryKey: ['allProductVariants'] }) // Invalidate variants list
        void queryClient.invalidateQueries({ queryKey: ['products'] }) // Also product list as it might show variant counts/details
        reset() // Reset form after everything is successful
      },
      onError: (error) => {
        console.log(error)
        toast.error(
          `Une erreur s'est produite lors de la création d'une variante de produit`
        )
      },
    })

  // Consolidate loading state
  const isSubmitting =
    createProductMutation.isPending ||
    createVariantsMutation.isPending ||
    isUploading

  const onSubmit = async (values: ProductFormValues) => {
    let mainImageUrl = values.imageUrl // Use existing URL if provided (e.g. editing)

    if (values.imageFile && values.imageFile.length > 0) {
      try {
        toast.loading("Téléchargement de l'image principale...")
        mainImageUrl = await uploadFile(values.imageFile[0]) // Pass file to uploadFile
        toast.dismiss()
      } catch (e) {
        toast.dismiss()
        toast.error("Échec du téléchargement de l'image principale.")
        console.error(e)
        return
      }
    } else if (!mainImageUrl && !values.id) {
      // Require image for new products
      toast.error("L'image principale du produit est requise.")
      return
    }

    const productPayload: Omit<ProductDto, 'id' | 'createdAt' | 'updatedAt'> = {
      imageUrl: mainImageUrl,
      name: values.name,
      description: values.description,
      price: values.price,
      stockQuantity: values.stockQuantity,
      categoryNames: values.categoryNames,
      sizes: values.sizes ?? [],
    }

    try {
      const createdProduct = await createProductMutation.mutateAsync({
        formData: productPayload,
      })

      if (!createdProduct?.id) {
        toast.error('Échec de la création du produit ou ID manquant.')
        return
      }

      if (!values.variants || values.variants.length === 0) {
        reset()
        return
      }

      toast.loading('Téléchargement des images des variantes...')
      const variantsWithImageUrls: ProductVariantDto[] = await Promise.all(
        values.variants.map(async (variant) => {
          let variantImageUrl = variant.imageUrl
          if (variant.imageFile && variant.imageFile.length > 0) {
            variantImageUrl = await uploadFile(variant.imageFile[0])
          }
          return {
            ...variant,
            imageUrl: variantImageUrl,
            productId: createdProduct.id,
            price: Number(variant.price),
            stockQuantity: Number(variant.stockQuantity),
            sizes: variant.sizes ?? [],
            imageFile: undefined,
          } as ProductVariantDto
        })
      )
      toast.dismiss()

      await createVariantsMutation.mutateAsync({
        requestBody: {
          variants: variantsWithImageUrls,
        },
      })
    } catch (error) {
      console.error("Une erreur s'est produite lors de la soumission :", error)
    }
  }

  useEffect(() => {
    for (const error of Object.values(formErrors)) {
      if (error && error.message) {
        toast.error(error.message)
      }
    }
    if (uploadError) {
      toast.error(`Erreur d'upload: ${uploadError.message}`)
    }
  }, [formErrors, uploadError])

  const formData = watch()

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='grid grid-cols-1 md:grid-cols-2 gap-6'
    >
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium'>Image principale</label>
          <input
            type='file'
            {...register('imageFile')}
            className='w-full border rounded-md p-2'
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>Nom</label>
          <input
            {...register('name')}
            className='w-full border rounded-md p-2'
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>Description</label>
          <input
            {...register('description')}
            className='w-full border rounded-md p-2'
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>Prix</label>
          <input
            type='number'
            {...register('price')}
            className='w-full border rounded-md p-2'
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>Quantité en stock</label>
          <input
            type='number'
            {...register('stockQuantity')}
            className='w-full border rounded-md p-2'
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>
            Catégories (séparées par des virgules)
          </label>
          <input
            type='text'
            defaultValue={formData.categoryNames?.join(', ')}
            onBlur={(e) =>
              setValue(
                'categoryNames',
                e.target.value.split(',').map((c) => c.trim()),
                { shouldValidate: true, shouldDirty: true }
              )
            }
            className='w-full border rounded-md p-2'
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>
            Tailles (séparées par des virgules)
          </label>
          <input
            type='text'
            defaultValue={formData.sizes?.join(', ')}
            onBlur={(e) =>
              setValue(
                'sizes',
                e.target.value.split(',').map((s) => s.trim()),
                { shouldValidate: true, shouldDirty: true }
              )
            }
            className='w-full border rounded-md p-2'
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>Variantes</label>
          <div className='space-y-4'>
            {variantFields.map((variant, index) => (
              <div key={variant.id} className='border rounded p-3 space-y-2'>
                <input
                  type='file'
                  {...register(`variants.${index}.imageFile`)}
                  className='w-full'
                  disabled={isSubmitting}
                />
                <div className='flex items-center gap-2'>
                  <input
                    type='color'
                    value={formData.variants?.[index]?.colorCode ?? '#000000'}
                    onChange={(e) =>
                      setValue(`variants.${index}.colorCode`, e.target.value)
                    }
                    className='h-10 w-10 p-0 border rounded'
                    title='Choisir une couleur'
                    disabled={isSubmitting}
                  />
                  <input
                    value={formData.variants?.[index]?.colorCode ?? '#000000'}
                    onChange={(e) =>
                      setValue(`variants.${index}.colorCode`, e.target.value)
                    }
                    placeholder='Code Couleur (ex: #FFFFFF)'
                    className='flex-1 border rounded-md p-2'
                    type='text'
                    disabled={isSubmitting}
                  />
                </div>
                <input
                  type='number'
                  {...register(`variants.${index}.price`)}
                  placeholder='Prix Variante'
                  className='w-full border rounded-md p-2'
                  disabled={isSubmitting}
                />
                <input
                  type='number'
                  {...register(`variants.${index}.stockQuantity`)}
                  placeholder='Stock Variante'
                  className='w-full border rounded-md p-2'
                  disabled={isSubmitting}
                />
                <input
                  placeholder='Tailles Variante (séparées par des virgules)'
                  defaultValue={formData.variants?.[index]?.sizes?.join(', ')}
                  onBlur={(e) =>
                    setValue(
                      `variants.${index}.sizes`,
                      e.target.value.split(',').map((s) => s.trim()),
                      { shouldValidate: true, shouldDirty: true }
                    )
                  }
                  className='w-full border rounded-md p-2'
                  disabled={isSubmitting}
                />
                <button
                  type='button'
                  onClick={() => remove(index)}
                  className='text-red-500'
                  disabled={isSubmitting}
                >
                  Supprimer Variante
                </button>
              </div>
            ))}
            {false && <button
              type='button'
              
              onClick={() =>
                append({
                  colorCode: '#000000',
                  price: 0,
                  stockQuantity: 0,
                  sizes: [],
                })
              }
              className='mt-2 text-sm text-blue-600'
              disabled={isSubmitting}
            >
              + Ajouter une variante
            </button>}
          </div>
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-70'
        >
          {isSubmitting ? 'Publication en cours...' : 'Publier le Produit'}
        </button>
      </div>

      <div className='sticky top-4 max-h-screen overflow-auto'>
        <Preview data={formData} />
      </div>
    </form>
  )
}
