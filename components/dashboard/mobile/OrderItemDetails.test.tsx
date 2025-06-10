// components/dashboard/mobile/OrderItemDetails.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderItemDetails from './OrderItemDetails';
import {
    useProductVariantControllerServiceGetProductVariantById,
    useProductControllerServiceGetProductById
} from '@/lib/api-client/rq-generated/queries';

jest.mock('@/lib/api-client/rq-generated/queries', () => ({
  useProductVariantControllerServiceGetProductVariantById: jest.fn(),
  useProductControllerServiceGetProductById: jest.fn(), // Mock the new hook
}));

const mockUseGetProductVariantById = useProductVariantControllerServiceGetProductVariantById as jest.Mock;
const mockUseGetProductById = useProductControllerServiceGetProductById as jest.Mock;


const mockItem = {
  id: 'item001',
  productVariantId: 'pv001',
  quantity: 2,
  size: 'M',
  price: 50.99,
};

const mockVariantDetails = {
  id: 'pv001',
  productId: 'prod123', // Ensure productId is present for product fetching
  imageUrl: 'http://example.com/image.jpg',
  colorCode: '#FF0000',
  sizes: ['M', 'L'],
  stockQuantity: 10,
};

const mockProductDetails = {
  id: 'prod123',
  name: 'Awesome T-Shirt',
  description: 'A really cool t-shirt',
  // ... other product fields
};

describe('OrderItemDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default successful mocks for variant
    mockUseGetProductVariantById.mockReturnValue({
        isLoading: false,
        error: null,
        data: mockVariantDetails
    });
    // Default successful mocks for product (can be overridden in specific tests)
    mockUseGetProductById.mockReturnValue({
        isLoading: false,
        error: null,
        data: mockProductDetails
    });
  });

  test('shows loading state for variant initially', () => {
    mockUseGetProductVariantById.mockReturnValueOnce({ isLoading: true, error: null, data: null });
    // Product hook shouldn't be called yet or its loading state is irrelevant if variant is loading
    mockUseGetProductById.mockReturnValueOnce({ isLoading: false, error: null, data: null });
    render(<OrderItemDetails item={mockItem} />);
    expect(screen.getByText('Loading variant details...')).toBeInTheDocument();
  });

  test('shows error state and fallback info if variant fetch fails', () => {
    mockUseGetProductVariantById.mockReturnValueOnce({ isLoading: false, error: new Error('Variant Fetch failed'), data: null });
    console.error = jest.fn();
    render(<OrderItemDetails item={mockItem} />);
    expect(screen.getByText(/Could not load full variant details for ID: pv001/i)).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith("Error fetching variant pv001:", expect.any(Error));
  });

  // Tests for Product Name Fetching
  test('shows loading state for product name after variant is loaded', async () => {
    mockUseGetProductVariantById.mockReturnValue({ isLoading: false, error: null, data: mockVariantDetails });
    mockUseGetProductById.mockReturnValueOnce({ isLoading: true, error: null, data: null });
    render(<OrderItemDetails item={mockItem} />);

    await waitFor(() => {
        // Example: Check for text that indicates product name is loading
        expect(screen.getByText(/Loading name.../i)).toBeInTheDocument();
    });
  });

  test('shows error state for product name if product fetch fails', async () => {
    mockUseGetProductVariantById.mockReturnValue({ isLoading: false, error: null, data: mockVariantDetails });
    mockUseGetProductById.mockReturnValueOnce({ isLoading: false, error: new Error('Product Fetch failed'), data: null });
    console.error = jest.fn();
    render(<OrderItemDetails item={mockItem} />);

    await waitFor(() => {
        expect(screen.getByText(/Error loading name/i)).toBeInTheDocument();
        expect(console.error).toHaveBeenCalledWith("Error fetching product prod123:", expect.any(Error));
    });
  });

  test('renders product name and all details successfully', async () => {
    // Both hooks return success
    render(<OrderItemDetails item={mockItem} />);

    await waitFor(() => {
      // Check for product name
      expect(screen.getByText(`${mockProductDetails.name} (Variant ID: ${mockItem.productVariantId})`)).toBeInTheDocument();

      // Check variant details (image, color, etc.)
      const image = screen.getByAltText(`${mockProductDetails.name} - Variant ${mockItem.productVariantId}`);
      expect(image).toHaveAttribute('src', mockVariantDetails.imageUrl);
      expect(screen.getByTitle(mockVariantDetails.colorCode)).toHaveStyle(`backgroundColor: ${mockVariantDetails.colorCode}`);
      expect(screen.getByText(mockVariantDetails.colorCode)).toBeInTheDocument();
      expect(screen.getByText(`Quantity: ${mockItem.quantity}`)).toBeInTheDocument();
      expect(screen.getByText(`Size: ${mockItem.size}`)).toBeInTheDocument();
      expect(screen.getByText(`Price/Item: ${mockItem.price.toFixed(2)} FCFA`)).toBeInTheDocument();
    });
  });

  test('renders correctly if product name is null/undefined from API', async () => {
    mockUseGetProductById.mockReturnValueOnce({
        isLoading: false,
        error: null,
        data: { ...mockProductDetails, name: null } // Simulate API returning null name
    });
    render(<OrderItemDetails item={mockItem} />);
    await waitFor(() => {
      expect(screen.getByText(`Unknown Product (Variant ID: ${mockItem.productVariantId})`)).toBeInTheDocument();
    });
  });

  test('image alt text falls back if product name is not available', async () => {
    mockUseGetProductById.mockReturnValueOnce({ isLoading: true, error: null, data: null }); // Product name not yet loaded
    render(<OrderItemDetails item={mockItem} />);
    await waitFor(() => {
        const image = screen.getByAltText(`Variant ${mockItem.productVariantId}`);
        expect(image).toBeInTheDocument();
    });
  });
});
