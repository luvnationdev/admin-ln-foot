import { ProductData } from "@/types/product"
//Carousel import
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface PreviewProps {
  data: ProductData
}

export default function Preview({ data }: PreviewProps) {
  return (
    <div className="rounded-lg border border-red-500 p-4">
      <div className="bg-white rounded-lg p-4">
        {data.images.length > 0 && (
          <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
            <img
              src={data.images[0]}
              alt={data.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="border-t pt-2 space-y-1 text-right">
          <div className="font-medium text-lg">{data.name || "Nom du produit"}</div>
          <div className="text-red-500 text-xl font-bold">
            {data.price ? `${data.price} FCFA` : "5000 FCFA"}
          </div>
        </div>
      </div>
    </div>
  )
}
