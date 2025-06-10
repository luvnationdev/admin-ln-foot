// components/dashboard/mobile/OrderItemDetails.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderItemDetails from './OrderItemDetails';
import { useProductVariantControllerServiceGetProductVariantById } from '@/lib/api-client/rq-generated/queries';

jest.mock('@/lib/api-client/rq-generated/queries', () => ({
  useProductVariantControllerServiceGetProductVariantById: jest.fn(),
}));

const mockUseGetProductVariantById = useProductVariantControllerServiceGetProductVariantById as jest.Mock;

const mockItem = {
  id: 'item001',
  productVariantId: 'pv001',
  quantity: 2,
  size: 'M',
  price: 50.99,
};

const mockVariantDetails = {
  id: 'pv001',
  productId: 'prod123',
  imageUrl: 'http://example.com/image.jpg',
  colorCode: '#FF0000',
  sizes: ['M', 'L'],
  stockQuantity: 10,
};

describe('OrderItemDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state initially', () => {
    mockUseGetProductVariantById.mockReturnValue({ isLoading: true, error: null, data: null });
    render(<OrderItemDetails item={mockItem} />);
    expect(screen.getByText('Loading item details...')).toBeInTheDocument();
  });

  test('shows error state and fallback info if variant fetch fails', () => {
    mockUseGetProductVariantById.mockReturnValue({ isLoading: false, error: new Error('Fetch failed'), data: null });
    console.error = jest.fn(); // Suppress console.error for this test
    render(<OrderItemDetails item={mockItem} />);
    expect(screen.getByText(/Could not load full variant details for ID: pv001/i)).toBeInTheDocument();
    expect(screen.getByText(`Quantity: ${mockItem.quantity}`)).toBeInTheDocument(); // Fallback info
    expect(console.error).toHaveBeenCalled();
  });

  test('renders variant details successfully', async () => {
    mockUseGetProductVariantById.mockReturnValue({ isLoading: false, error: null, data: mockVariantDetails });
    render(<OrderItemDetails item={mockItem} />);

    await waitFor(() => {
      expect(screen.getByText(/Product \(ID: prod123\) \/ Variant \(ID: pv001\)/i)).toBeInTheDocument();
      expect(screen.getByAltText('Variant pv001')).toHaveAttribute('src', mockVariantDetails.imageUrl);
      expect(screen.getByTitle(mockVariantDetails.colorCode)).toHaveStyle(`backgroundColor: ${mockVariantDetails.colorCode}`);
      expect(screen.getByText(mockVariantDetails.colorCode)).toBeInTheDocument();
      expect(screen.getByText(`Quantity: ${mockItem.quantity}`)).toBeInTheDocument();
      // Size could come from item or variantDetails
      expect(screen.getByText(`Size: ${mockItem.size}`)).toBeInTheDocument();
      expect(screen.getByText(`Price/Item: ${mockItem.price.toFixed(2)} FCFA`)).toBeInTheDocument();
    });
  });

  test('renders variant sizes if item.size is not available', async () => {
    const itemWithoutSize = { ...mockItem, size: undefined };
    mockUseGetProductVariantById.mockReturnValue({ isLoading: false, error: null, data: mockVariantDetails });
    render(<OrderItemDetails item={itemWithoutSize} />);
    await waitFor(() => {
        expect(screen.getByText(`Size: ${mockVariantDetails.sizes.join(', ')}`)).toBeInTheDocument();
    });
  });
});
