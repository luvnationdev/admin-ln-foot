// components/dashboard/mobile/OrderItemDetails.tsx
'use client'

import React from 'react';
import {
    useProductVariantControllerServiceGetProductVariantById,
    useProductControllerServiceGetProductById // Import hook for fetching product by ID
} from '@/lib/api-client/rq-generated/queries';
// ProductVariantDto and ProductDto can be imported for explicit typing if desired
// import type { ProductVariantDto, ProductDto } from '@/lib/api-client/rq-generated/requests/types.gen';

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
    { id: item.productVariantId },
    { query: { enabled: !!item.productVariantId } }
  );

  // Fetch product details using productId from variantDetails
  const productId = variantDetails?.productId;
  const {
    data: productDetails,
    isLoading: isLoadingProduct,
    error: productError,
  } = useProductControllerServiceGetProductById(
    { id: productId! }, // The '!' asserts productId is non-null, enabled flag handles undefined
    { query: { enabled: !!productId } } // Only run if productId is available
  );

  if (isLoadingVariant) return <p className='text-sm text-gray-500 p-2'>Loading variant details...</p>;

  if (variantError) {
    console.error(`Error fetching variant ${item.productVariantId}:`, variantError);
    return (
        <div className='text-sm p-2 bg-red-50 border border-red-200 rounded shadow-sm'>
            <p className='font-semibold text-red-700'>Could not load full variant details for ID: {item.productVariantId}.</p>
            <div><strong>Quantity:</strong> {item.quantity}</div>
            <div><strong>Size:</strong> {item.size || 'N/A'}</div>
            <div><strong>Price/Item:</strong> {item.price?.toFixed(2) || 'N/A'} FCFA</div>
        </div>
    );
  }

  // Determine the display name for the product
  let productNameDisplay = `Variant (ID: ${item.productVariantId})`;
  if (isLoadingProduct && variantDetails) {
      productNameDisplay = `Product (ID: ${variantDetails.productId}) / Variant (ID: ${item.productVariantId}) - Loading name...`;
  } else if (productError && variantDetails) {
      console.error(`Error fetching product ${variantDetails.productId}:`, productError);
      productNameDisplay = `Product (ID: ${variantDetails.productId}) - Error loading name / Variant (ID: ${item.productVariantId})`;
  } else if (productDetails) {
      productNameDisplay = `${productDetails.name || 'Unknown Product'} (Variant ID: ${item.productVariantId})`;
  } else if (variantDetails?.productId) { // Fallback if productDetails somehow not loaded but productId exists
      productNameDisplay = `Product (ID: ${variantDetails.productId}) / Variant (ID: ${item.productVariantId})`;
  }


  return (
    <div className='text-sm p-3 bg-gray-50 rounded shadow-md border border-gray-200'>
      <p className='font-semibold'>{productNameDisplay}</p>

      {variantDetails?.imageUrl && (
        <img
          src={variantDetails.imageUrl}
          alt={productDetails?.name ? `${productDetails.name} - Variant ${item.productVariantId}` : `Variant ${item.productVariantId}`}
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
    </div>
  );
};

export default OrderItemDetails;
