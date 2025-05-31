import { apiClient } from '@/lib/api-client'
import { Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { ProductFormValues } from '../dashboard/mobile/product-form'

export function ProductsList() {
  const { data: session } = useSession()
  const [products, setProducts] = useState<ProductFormValues[]>([])

  const handleDeleteProduct = async (product: ProductFormValues) => {
    const shouldDelete = window.confirm(
      'Etes-vous sure de vouloir supprimer ce produit?'
    )
    if (!shouldDelete) {
      return
    }

    await Promise.all(
      product.variants.map((variant) =>
        apiClient.deleteProductVariant({
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
          path: { id: `${variant.id}` },
        })
      )
    )

    await apiClient.deleteProduct({
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      path: { id: `${product.id}` },
    })
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const [
        { data: products, error },
        { data: productVariants, error: secondError },
      ] = await Promise.all([
        apiClient.getAllProducts(),
        apiClient.getProductVariants({ query: { productId: '' } }),
      ])
      if (!products || error || !productVariants || secondError) {
        toast.error('Erreur lors de la récupération des produits')
        console.error('Erreur lors de la récupération des produits:', error)
        return
      }

      setProducts(
        products[200].map((product) => ({
          id: product.id,
          name: product.name ?? '',
          description: product.description ?? '',
          price: product.price ?? 0,
          stockQuantity: product.stockQuantity ?? 0,
          categoryNames: product.categoryNames ?? [],
          sizes: product.sizes ?? [],
          imageFile: undefined,
          imageUrl: product.imageUrl,
          variants: productVariants[200]
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

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      {products.map((product, index) => (
        <div
          key={index}
          className='border rounded-lg p-4 hover:shadow cursor-pointer relative'
        >
          {/* Delete Icon at top-right */}
          <button
            onClick={() => handleDeleteProduct(product)}
            className='absolute top-2 right-2 text-red-600 hover:text-red-800'
            title='Supprimer'
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
        </div>
      ))}
    </div>
  )
}
