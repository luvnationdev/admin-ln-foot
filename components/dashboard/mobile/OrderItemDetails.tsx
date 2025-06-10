// components/dashboard/mobile/OrderItemDetails.tsx
'use client'

import React from 'react';
import { useProductVariantControllerServiceGetProductVariantById } from '@/lib/api-client/rq-generated/queries';
// ProductVariantDto can be imported if needed for explicit typing, but often inferred by the hook

interface OrderItem {
  id: string;
  productVariantId: string;
  quantity: number;
  size?: string;
  price?: number;
}

interface OrderItemDetailsProps {
  item: OrderItem;
}

const OrderItemDetails: React.FC<OrderItemDetailsProps> = ({ item }) => {
  const {
    data: variantDetails,
    isLoading: isLoadingVariant,
    error: variantError
  } = useProductVariantControllerServiceGetProductVariantById(
    { id: item.productVariantId }, // Hook parameters
    { query: { enabled: !!item.productVariantId } } // Hook options
  );

  if (isLoadingVariant) return <p className='text-sm text-gray-500 p-2'>Loading item details...</p>;

  if (variantError) {
    console.error(`Error fetching variant ${item.productVariantId}:`, variantError);
    // Fallback to showing basic item info if variant fetch fails
    return (
        <div className='text-sm p-2 bg-red-50 border border-red-200 rounded shadow-sm'>
            <p className='font-semibold text-red-700'>Could not load full variant details for ID: {item.productVariantId}.</p>
            <div><strong>Quantity:</strong> {item.quantity}</div>
            <div><strong>Size:</strong> {item.size || 'N/A'}</div>
            <div><strong>Price/Item:</strong> {item.price?.toFixed(2) || 'N/A'} FCFA</div>
        </div>
    );
  }

  return (
    <div className='text-sm p-3 bg-gray-50 rounded shadow-md border border-gray-200'>
      {/* TODO: Future: Fetch and display Product Name using variantDetails.productId if available and if a hook for Product by ID exists. */}
      <p className='font-semibold'>
        {variantDetails?.productId ? `Product (ID: ${variantDetails.productId}) / ` : ''}
        Variant (ID: {item.productVariantId})
      </p>

      {variantDetails?.imageUrl && (
        <img
          src={variantDetails.imageUrl}
          alt={`Variant ${item.productVariantId}`} // TODO: Future: Improve alt text with product name and variant specifics once product name is fetched.
          className='w-20 h-20 object-cover my-2 rounded border'
        />
      )}

      {variantDetails?.colorCode && (
        <div className='flex items-center my-1'>
          <span className='mr-2'><strong>Color:</strong></span>
          <div
            className='w-5 h-5 rounded-full border'
            style={{ backgroundColor: variantDetails.colorCode }}
            title={variantDetails.colorCode}
          />
          <span className='ml-2'>{variantDetails.colorCode}</span>
        </div>
      )}

      <div><strong>Quantity:</strong> {item.quantity}</div>
      <div><strong>Size:</strong> {item.size || (variantDetails?.sizes && variantDetails.sizes.length > 0 ? variantDetails.sizes.join(', ') : 'N/A')}</div>
      <div><strong>Price/Item:</strong> {item.price?.toFixed(2) || 'N/A'} FCFA</div>
      {/* Example: Display stock if relevant and available */}
      {/* {typeof variantDetails?.stockQuantity === 'number' && <div><strong>Stock:</strong> {variantDetails.stockQuantity}</div>} */}
    </div>
  );
};

export default OrderItemDetails;
