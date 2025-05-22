'use client'
import Preview from '@/components/previews/product/preview'
import { apiClient } from '@/lib/api-client'
import { useUploadFile } from '@/lib/minio/upload'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const productSchema = z.object({
  imageFile: z
    .custom<FileList>(
      (val) => {
        if (typeof window === 'undefined') return true // skip validation on SSR
        return val instanceof FileList
      },
      {
        message: 'Invalid file list',
      }
    )
    .optional(), // For upload
  imageUrl: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  stockQuantity: z.coerce.number().int().nonnegative(),
  categoryNames: z.array(z.string()).min(1),
  sizes: z.array(z.string()),
  variants: z.array(
    z.object({
      imageFile: z
        .custom<FileList>(
          (val) => {
            if (typeof window === 'undefined') return true // skip validation on SSR
            return val instanceof FileList
          },
          {
            message: 'Invalid file list',
          }
        )
        .optional(),
      colorCode: z.string().min(1),
      price: z.coerce.number().positive(),
      stockQuantity: z.coerce.number().int().nonnegative(),
      sizes: z.array(z.string()),
      imageUrl: z.string().optional(),
    })
  ),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const ProductForm = () => {
  const { data: session } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<ProductFormValues | null>(null)
  const [products, setProducts] = useState<ProductFormValues[]>([])

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: selectedProduct ?? {
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
  } = useFieldArray({
    control,
    name: 'variants',
  })

  const { uploadFile } = useUploadFile()

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const imageUrl = await uploadFile((values.imageFile ?? [])[0])

      const productPayload = {
        imageUrl,
        name: values.name,
        description: values.description,
        price: values.price,
        stockQuantity: values.stockQuantity,
        categoryNames: values.categoryNames,
        sizes: values.sizes,
      }

      const { data: product, error } = await apiClient.createProduct({
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: productPayload,
      })

      if (!product || error) {
        toast.error(`Erreur lors de la création du produit`)
        console.error('Erreur lors de la création du produit:', error)
        return
      }

      const variantsPayload = await Promise.all(
        values.variants.map(async (v) => ({
          imageUrl: await uploadFile((v.imageFile ?? [])[0]),
          colorCode: v.colorCode,
          productId: product?.id, // Fill this from response
          price: v.price,
          stockQuantity: v.stockQuantity,
          sizes: v.sizes,
        }))
      )

      const variantsResult = await apiClient.createProductVariants({
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: variantsPayload,
      })
      if (!variantsResult.data || variantsResult.error) {
        toast.error('Erreur lors de la création des variantes')
        console.error(
          'Erreur lors de la création des variantes:',
          variantsResult.error
        )
        return
      }
    } catch (error: unknown) {
      console.error('Une erreur inconnue est survenue: ', error)
      toast.error('Une erreur inconnue est survenue')
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const [
        { data: products, error },
        { data: productVariants, error: secondError },
      ] = await Promise.all([
        apiClient.getAllProducts({
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }),
        apiClient.getProductVariants({
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }),
      ])
      if (!products || error || !productVariants || secondError) {
        toast.error('Erreur lors de la récupération des produits')
        console.error('Erreur lors de la récupération des produits:', error)
        return
      }

      setProducts(
        products.map((product) => ({
          id: product.id,
          name: product.name ?? '',
          description: product.description ?? '',
          price: product.price ?? 0,
          stockQuantity: product.stockQuantity ?? 0,
          categoryNames: product.categoryNames ?? [],
          sizes: product.sizes ?? [],
          imageFile: undefined,
          imageUrl: product.imageUrl,
          variants: productVariants
            .filter((variant) => variant.productId === product.id)
            .map((variant) => ({
              colorCode: variant.colorCode ?? '',
              price: variant.price ?? 0,
              stockQuantity: variant.stockQuantity ?? 0,
              sizes: variant.sizes ?? [],
              id: variant.id ?? '',
              imageUrl: variant.imageUrl,
              imageFile: undefined, // Assuming you want to keep this undefined
            })),
        }))
      )
    }

    fetchProducts().catch((error) => {
      console.error('Erreur lors de la récupération des produits:', error)
      toast.error('Erreur lors de la récupération des produits:')
    })
    return () => {
      setProducts([])
    }
  }, [session?.accessToken])

  const formData = watch()

  return (
    <>
      {!showForm && (
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Liste des Produits</h2>
            <button
              onClick={() => {
                setSelectedProduct(null) // Creating a new product
                setShowForm(true)
              }}
              className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'
            >
              + Ajouter un produit
            </button>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {products.map((product, index) => (
              <div
                key={index}
                className='border rounded-lg p-4 hover:shadow cursor-pointer relative'
              >
                <img
                  src={product.imageUrl ?? '/placeholder.jpg'}
                  alt={product.name}
                  className='w-full h-32 object-cover rounded'
                />
                <h4 className='mt-2 font-semibold text-sm'>{product.name}</h4>
                <p className='text-sm text-gray-600'>{product.price} FCFA</p>

                {/* Categories */}
                <div className='mt-1 text-xs text-gray-500'>
                  Catégories: {product.categoryNames.join(', ')}
                </div>

                {/* Sizes */}
                {product.sizes.length > 0 && (
                  <div className='mt-1 text-xs text-gray-500'>
                    Tailles: {product.sizes.join(', ')}
                  </div>
                )}

                {/* Variant Colors */}
                {product.variants.length > 0 && (
                  <div className='mt-1 text-xs text-gray-500'>
                    Couleurs:
                    <div className='flex flex-wrap mt-1 gap-1'>
                      {product.variants.map((variant, vIdx) => (
                        <div
                          key={vIdx}
                          className='w-4 h-4 rounded-full border'
                          style={{ backgroundColor: variant.colorCode }}
                          title={variant.colorCode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* <button
                  onClick={() => {
                    setSelectedProduct(product) // Editing
                    setShowForm(true)
                  }}
                  className='text-sm text-blue-600 mt-2 underline'
                >
                  Modifier
                </button> */}
              </div>
            ))}
          </div>
        </div>
      )}
      {showForm && (
        <div className='mt-6'>
          <button
            onClick={() => setShowForm(false)}
            className='text-sm text-gray-500 hover:underline mb-4'
          >
            ← Retour à la liste
          </button>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium'>
                  Image principale
                </label>
                <input
                  type='file'
                  {...register('imageFile')}
                  className='w-full border rounded-md p-2'
                />
              </div>

              <div>
                <label className='block text-sm font-medium'>Nom</label>
                <input
                  {...register('name')}
                  className='w-full border rounded-md p-2'
                />
              </div>

              <div>
                <label className='block text-sm font-medium'>Description</label>
                <input
                  {...register('description')}
                  className='w-full border rounded-md p-2'
                />
              </div>

              <div>
                <label className='block text-sm font-medium'>Prix</label>
                <input
                  type='number'
                  {...register('price')}
                  className='w-full border rounded-md p-2'
                />
              </div>

              <div>
                <label className='block text-sm font-medium'>
                  Quantité en stock
                </label>
                <input
                  type='number'
                  {...register('stockQuantity')}
                  className='w-full border rounded-md p-2'
                />
              </div>

              <div>
                <label className='block text-sm font-medium'>
                  Catégories (séparées par des virgules)
                </label>
                <input
                  type='text'
                  onBlur={(e) =>
                    setValue(
                      'categoryNames',
                      e.target.value.split(',').map((c) => c.trim())
                    )
                  }
                  className='w-full border rounded-md p-2'
                />
              </div>

              <div>
                <label className='block text-sm font-medium'>
                  Tailles (séparées par des virgules)
                </label>
                <input
                  type='text'
                  onBlur={(e) =>
                    setValue(
                      'sizes',
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                  className='w-full border rounded-md p-2'
                />
              </div>

              <div>
                <label className='block text-sm font-medium'>Variantes</label>
                <div className='space-y-4'>
                  {variantFields.map((variant, index) => (
                    <div
                      key={variant.id}
                      className='border rounded p-3 space-y-2'
                    >
                      <input
                        type='file'
                        {...register(`variants.${index}.imageFile`)}
                        className='w-full'
                      />
                      <div className='flex items-center gap-2'>
                        <input
                          type='color'
                          value={
                            formData.variants[index]?.colorCode || '#000000'
                          }
                          onChange={(e) =>
                            setValue(
                              `variants.${index}.colorCode`,
                              e.target.value
                            )
                          }
                          className='h-10 w-10 p-0 border rounded'
                          title='Choisir une couleur'
                        />
                        <input
                          value={
                            formData.variants[index]?.colorCode || '#000000'
                          }
                          onChange={(e) =>
                            setValue(
                              `variants.${index}.colorCode`,
                              e.target.value
                            )
                          }
                          placeholder='Couleur'
                          className='flex-1 border rounded-md p-2'
                          type='text'
                        />
                      </div>

                      <input
                        type='number'
                        {...register(`variants.${index}.price`)}
                        placeholder='Prix'
                        className='w-full border rounded-md p-2'
                      />
                      <input
                        type='number'
                        {...register(`variants.${index}.stockQuantity`)}
                        placeholder='Stock'
                        className='w-full border rounded-md p-2'
                      />
                      <input
                        placeholder='Tailles (séparées par des virgules)'
                        onBlur={(e) =>
                          setValue(
                            `variants.${index}.sizes`,
                            e.target.value.split(',').map((s) => s.trim())
                          )
                        }
                        className='w-full border rounded-md p-2'
                      />
                      <button
                        type='button'
                        onClick={() => remove(index)}
                        className='text-red-500'
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}

                  <button
                    type='button'
                    onClick={() =>
                      append({
                        colorCode: '',
                        imageFile: undefined,
                        price: 0,
                        stockQuantity: 0,
                        sizes: [],
                      })
                    }
                    className='mt-2 text-sm text-blue-600'
                  >
                    + Ajouter une variante
                  </button>
                </div>
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700'
              >
                {isSubmitting ? 'Publication...' : 'Publier'}
              </button>
            </div>

            <div className='sticky top-4 max-h-screen overflow-auto'>
              <Preview data={formData} />
            </div>
          </form>
        </div>
      )}
    </>
  )
}
