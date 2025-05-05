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
    <div className="rounded-lg border border-gray-300 p-4">
      <div className="bg-white rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colonne de gauche - Images */}
          <div>
            {data.images.length > 0 && (
              <>
                <div className="aspect-square w-full overflow-hidden rounded-lg mb-6">
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

          {/* Colonne de droite - Informations */}
          <div className="space-y-4">
            <div>
              <h2 className="font-medium text-xl mb-2">{data.name || "Nom du produit"}</h2>
              <div className="text-primary text-2xl font-bold">
                {data.price ? `${data.price} FCFA` : "5000 FCFA"}
              </div>
            </div>

            {data.description && (
              <div className="prose prose-sm max-w-none">
                <h3 className="text-sm font-medium text-gray-900">Description</h3>
                <div className="mt-2 text-sm text-gray-500">
                  {data.description}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {data.shoeSizes && data.shoeSizes.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                  <span className="text-sm font-medium">Pointures:</span>
                  {data.shoeSizes.map((size, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium cursor-pointer
                        ${selectedShoeSize === size 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      onClick={() => setSelectedShoeSize(size)}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}

              {data.sizes && data.sizes.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                  <span className="text-sm font-medium">Tailles:</span>
                  {data.sizes.map((size, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium cursor-pointer
                        ${selectedSize === size 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}

              {data.colors && data.colors.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                  <span className="text-sm font-medium">Couleurs:</span>
                  {data.colors.map((color, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center rounded-full w-6 h-6 border cursor-pointer
                        ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-200'}`}
                      style={{ backgroundColor: color }}
                      title={color}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleBuy}
              className="w-full py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Acheter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
