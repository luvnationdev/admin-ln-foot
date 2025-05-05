import { ProductData } from "@/types/product"
import { useState } from "react"
import { toast } from "sonner"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface PreviewProps {
  data: ProductData
}

export default function Preview({ data }: PreviewProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>()
  const [selectedShoeSize, setSelectedShoeSize] = useState<string>()
  const [selectedColor, setSelectedColor] = useState<string>()

  const handleBuy = () => {
    const selection = {
      product: data.name,
      price: data.price,
      image: data.images[selectedImage],
      selectedSize,
      selectedShoeSize,
      selectedColor,
    }

    toast.success("Sélection du produit", {
      description: (
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(selection, null, 2)}</code>
        </pre>
      ),
      duration: 5000,
    })
  }

  return (
    <div className="rounded-lg border border-gray-300 border-dashed p-4 max-w-sm mx-auto">
      <div className="bg-white rounded-lg p-4">
        {/* Header with back button - like in the image */}
        <div className="flex items-center mb-4 border-b pb-2">
          <span className="text-gray-500 mr-2">&#8592;</span>
          <h3 className="font-medium">Product Details</h3>
        </div>

        <div className="flex flex-col">
          {/* Image section */}
          <div className="mb-4">
            {data.images.length > 0 && (
              <>
                <div className="aspect-square w-full overflow-hidden rounded-lg mb-6 border border-gray-100">
                  <img
                    src={data.images[selectedImage]}
                    alt={data.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Carousel className="w-full">
                  <CarouselContent>
                    {data.images.map((image, index) => (
                      <CarouselItem key={index} className="basis-1/4 cursor-pointer">
                        <div 
                          className={`h-12 relative rounded aspect-square overflow-hidden ${selectedImage === index ? 'border-2 border-primary' : ''}`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <img
                            src={image}
                            alt={`${data.name} ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </>
            )}
          </div>

          {/* Product info section */}
          <div className="space-y-4">
            {/* Product title and rating */}
            <div>
              <h2 className="font-bold text-2xl mb-2">{data.name || "Nom du produit"}</h2>
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs font-medium">
                  <span className="text-yellow-500 mr-1">★</span>
                  4.3 (16 Reviews)
                </span>
              </div>
              <div className="text-primary text-xl font-bold">
                {data.price ? `${data.price} FCFA` : "5000 FCFA"}
              </div>
            </div>

            {/* Product description */}
            <div className="border-t border-b py-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Détail du produit</h3>
              <div className="text-sm text-gray-500">
                {data.description || "profiter des toute derniere sortie de vos maillot de foot pour un confort total est une protection assurer de vos pied lors de vos choc"}
              </div>
            </div>

            {/* Size selection */}
            <div className="space-y-4">
              {data.sizes && data.sizes.length > 0 && (
                <div>
                  <span className="text-sm font-medium block mb-2">Sélectionner la taille</span>
                  <div className="flex flex-wrap gap-2">
                    {data.sizes.map((size, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium cursor-pointer border 
                          ${selectedSize === size 
                            ? 'border-primary bg-white text-primary' 
                            : 'border-gray-200 bg-white text-gray-600'}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Shoe size selection */}
              {data.shoeSizes && data.shoeSizes.length > 0 && (
                <div>
                  <span className="text-sm font-medium block mb-2">Pointures</span>
                  <div className="flex flex-wrap gap-2">
                    {data.shoeSizes.map((size, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium cursor-pointer border 
                          ${selectedShoeSize === size 
                            ? 'border-primary bg-white text-primary' 
                            : 'border-gray-200 bg-white text-gray-600'}`}
                        onClick={() => setSelectedShoeSize(size)}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selection */}
              {data.colors && data.colors.length > 0 && (
                <div>
                  <span className="text-sm font-medium block mb-2">Sélectionner couleur: {selectedColor ? selectedColor : 'Noire'}</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    {data.colors.map((color, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center rounded-full w-8 h-8 cursor-pointer border
                          ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-200'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Buy button */}
            <button
              onClick={handleBuy}
              className="w-full py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 mt-4"
            >
              Acheter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
