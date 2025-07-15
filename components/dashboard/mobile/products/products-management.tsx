'use client'

import {
  useProductControllerServiceDeleteApiProductsById,
  useProductControllerServiceGetApiProducts,
  useProductVariantControllerServiceDeleteApiProductVariantsById,
  useProductVariantControllerServiceGetApiProductVariants,
} from '@/lib/api-client/rq-generated/queries'
import type {
  ProductDto,
  ProductVariantDto,
} from '@/lib/api-client/rq-generated/requests/types.gen'
import { Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type {
  ProductFormValues,
  ProductVariantFormValues,
} from './product-form'; // Assuming ProductVariantFormValues might be useful

// Skeleton Loader
function ProductSkeleton() {
  return (
    <div className='border rounded-lg p-4 animate-pulse'>
      <div className='w-full h-32 bg-gray-300 rounded mb-2'></div>
      <div className='h-4 bg-gray-300 rounded w-3/4 mb-1'></div>
      <div className='h-4 bg-gray-300 rounded w-1/2 mb-2'></div>
      <div className='h-3 bg-gray-300 rounded w-full mb-1'></div>
      <div className='h-3 bg-gray-300 rounded w-2/3'></div>
    </div>
  )
}

export function ProductsManagement() {
  const [selectedProductId, setSelectedProductId] = useState<string>()

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchAllProducts,
  } = useProductControllerServiceGetApiProducts(['products'])

  const {
    data: variantsData,
    isLoading: isLoadingVariants,
    error: variantsError,
    refetch: refetchAllProductVariants,
  } = useProductVariantControllerServiceGetApiProductVariants(
    {
      productId: selectedProductId,
    },
    ['allProductVariants']
  )

  const deleteProductMutation =
    useProductControllerServiceDeleteApiProductsById({
      onSuccess: async () => {
        toast.success('Produit supprimé avec succès.')
        void refetchAllProducts()
        void refetchAllProductVariants()
      },
      onError: (error) => {
        console.error('Error deleting product:', error)
        toast.error('Erreur lors de la suppression du produit')
      },
    })

  const deleteVariantMutation =
    useProductVariantControllerServiceDeleteApiProductVariantsById({
      onSuccess: async () => {
        void refetchAllProductVariants()
      },
      onError: (error) => {
        console.error('Error deleting product variant:', error)
        toast.error('Erreur lors de la la suppression de la variante')
      },
    })

  useEffect(() => {
    if (productsError) {
      console.error('Error fetching products:', productsError)
      toast.error('Erreur lors de la récupération des produits')
    }
    if (variantsError) {
      console.error("Error fetching product's variantes:", productsError)
      toast.error('Erreur lors de la récupération des variantes de produits')
    }
  }, [productsError, variantsError])

  const products = useMemo(() => {
    if (!productsData || !variantsData) return []

    return productsData.map(
      (product: ProductDto): ProductFormValues => ({
        id: product.id,
        name: product.name ?? '',
        description: product.description ?? '',
        price: product.price ?? 0,
        stockQuantity: product.stockQuantity ?? 0,
        categoryNames: product.categoryNames ?? [],
        sizes: product.sizes ?? [],
        imageUrl: product.imageUrl,
        imageFile: undefined, // Not available from API, keep as per original
        variants: variantsData
          .filter(
            (variant: ProductVariantDto) => variant.productId === product.id
          )
          .map(
            (variant: ProductVariantDto): ProductVariantFormValues => ({
              // Use ProductVariantFormValues if defined, or inline structure
              id: variant.id ?? '',
              colorCode: variant.colorCode ?? '',
              price: variant.price ?? 0,
              stockQuantity: variant.stockQuantity ?? 0,
              sizes: variant.sizes ?? [],
              imageUrl: variant.imageUrl,
              imageFile: undefined, // Not available from API
            })
          ),
      })
    )
  }, [productsData, variantsData])

  const handleDeleteProduct = async (product: ProductFormValues) => {
    if (!product.id) return
    const shouldDelete = window.confirm(
      'Etes-vous sûr de vouloir supprimer ce produit et toutes ses variantes?'
    )
    if (!shouldDelete) return

    setSelectedProductId(product.id)
    try {
      // Delete all variants first
      if (product.variants && product.variants.length > 0) {
        toast.loading('Suppression des variantes...')
        await Promise.all(
          product.variants.map((variant) => {
            if (variant.id) {
              return deleteVariantMutation.mutateAsync({ id: variant.id })
            }
            return Promise.resolve()
          })
        )
        toast.dismiss() // Dismiss loading toast for variants
      }
      // Then delete the main product
      deleteProductMutation.mutate({ id: product.id })
    } catch (error) {
      toast.dismiss()
      toast.error('Une erreur est survenue lors de la suppression.')
      console.error('Delete error:', error)
    } finally {
      setSelectedProductId(undefined)
    }
  }

  if (isLoadingProducts || isLoadingVariants) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {[...Array<null>(3)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return <p className='text-center text-gray-500'>Aucun produit trouvé.</p>
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {products.map((product) => (
        <div
          key={product.id ?? product.name} // Use a stable key
          className='border rounded-lg p-4 hover:shadow cursor-pointer relative'
        >
          <button
            onClick={() => handleDeleteProduct(product)}
            className='absolute top-2 right-2 text-red-600 hover:text-red-800 p-1 bg-white/50 rounded-full'
            title='Supprimer le produit'
            disabled={
              deleteProductMutation.isPending || deleteVariantMutation.isPending
            }
          >
            <Trash2 size={16} />
          </button>

          <img
            src={product.imageUrl ?? '/placeholder.jpg'}
            alt={product.name}
            className='w-full h-32 object-cover rounded'
          />
          <h4 className='mt-2 font-semibold text-sm'>{product.name}</h4>
          <p className='text-sm text-gray-600'>{product.price} FCFA</p>

          <div className='mt-1 text-xs text-gray-500'>
            Catégories: {product.categoryNames.join(', ')}
          </div>

          {(product.sizes?.length ?? 0) > 0 && (
            <div className='mt-1 text-xs text-gray-500'>
              Tailles: {product.sizes!.join(', ')}
            </div>
          )}

          {(product.variants?.length ?? 0) > 0 && (
            <div className='mt-1 text-xs'>
              <span className='text-gray-500'>Couleurs:</span>
              <div className='flex flex-wrap mt-1 gap-1'>
                {product.variants!.map((variant, vIdx) => (
                  <div
                    key={variant.id ?? vIdx}
                    className='w-4 h-4 rounded-full border'
                    style={{ backgroundColor: variant.colorCode }}
                    title={variant.colorCode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
