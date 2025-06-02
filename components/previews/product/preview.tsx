import { type ProductFormValues } from '@/components/dashboard/mobile/product-form'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { useState } from 'react'
import { toast } from 'sonner'

interface PreviewProps {
  data: ProductFormValues
}

export default function Preview({ data }: PreviewProps) {
  const [selectedSize, setSelectedSize] = useState<string>()
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>()
  const selectedVariant = data.variants?.[selectedVariantIndex ?? 0]

  const handleBuy = () => {
    const imageFileList = selectedVariant?.imageFile ?? []
    const selection = {
      product: data.name,
      description: data.description,
      price: selectedVariant?.price ?? data.price,
      image: imageFileList[0]?.name ?? imageFileList[0]?.name,
      selectedSize,
      color: selectedVariant?.colorCode,
    }

    toast.success('Sélection du produit', {
      description: (
        <pre className='mt-2 w-full rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {JSON.stringify(selection, null, 2)}
          </code>
        </pre>
      ),
      duration: 5000,
    })
  }

  return (
    <div className='rounded-lg border border-gray-300 border-dashed p-4 max-w-sm mx-auto'>
      <div className='bg-white rounded-lg p-4'>
        {/* Header */}
        <div className='flex items-center mb-4 border-b pb-2'>
          <span className='text-gray-500 mr-2'>&#8592;</span>
          <h3 className='font-medium'>Product Details</h3>
        </div>

        <div className='flex flex-col'>
          {/* Image preview */}
          <div className='mb-4'>
            {data.imageFile?.length && (
              <div className='aspect-square w-full overflow-hidden rounded-lg mb-6 border border-gray-100'>
                <img
                  src={URL.createObjectURL(data.imageFile[0])}
                  alt={data.name}
                  className='h-full w-full object-cover'
                />
              </div>
            )}
            {(data.variants?.length ?? 0) > 0 && (
              <Carousel className='w-full'>
                <CarouselContent>
                  {data.variants!.map((v, index) => (
                    <CarouselItem
                      key={index}
                      className='basis-1/4 cursor-pointer'
                    >
                      <div
                        className={`h-12 relative rounded aspect-square overflow-hidden ${
                          selectedVariantIndex === index
                            ? 'border-2 border-primary'
                            : ''
                        }`}
                        onClick={() => setSelectedVariantIndex(index)}
                      >
                        {v.imageFile?.length && (
                          <img
                            src={URL.createObjectURL(v.imageFile[0])}
                            alt={`${data.name} variant ${index + 1}`}
                            className='h-full w-full object-cover'
                          />
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}
          </div>

          {/* Product info */}
          <div className='space-y-4'>
            <div>
              <h2 className='font-bold text-2xl mb-2'>
                {data.name || 'Nom du produit'}
              </h2>
              <div className='text-primary text-xl font-bold'>
                {selectedVariant?.price ?? data.price} FCFA
              </div>
            </div>

            {/* Description */}
            <div className='border-t border-b py-4'>
              <h3 className='text-sm font-medium text-gray-900 mb-2'>
                Détail du produit
              </h3>
              <div className='text-sm text-gray-500'>
                {data.description ?? 'Aucune description'}
              </div>
            </div>

            {/* Size selection */}
            {(selectedVariant?.sizes?.length ?? 0) > 0 ||
            (data.sizes?.length ?? 0) > 0 ? (
              <div>
                <span className='text-sm font-medium block mb-2'>
                  Sélectionner la taille
                </span>
                <div className='flex flex-wrap gap-2'>
                  {(selectedVariant?.sizes ?? data.sizes ?? []).map(
                    (size, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium cursor-pointer border ${
                          selectedSize === size
                            ? 'border-primary bg-white text-primary'
                            : 'border-gray-200 bg-white text-gray-600'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </span>
                    )
                  )}
                </div>
              </div>
            ) : null}

            {/* Buy button */}
            <button
              onClick={handleBuy}
              className='w-full py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 mt-4'
            >
              Acheter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
