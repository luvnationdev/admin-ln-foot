// components/dashboard/mobile/order-management.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import { useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderManagement from './order-management'; // Adjust path as necessary
import {
  useOrderControllerServiceGetApiOrders,
  useOrderControllerServicePutApiOrdersById,
} from '@/lib/api-client/rq-generated/queries'; // Adjust path

// Mock next-auth/react
jest.mock('next-auth/react');

// Mock the API hooks
jest.mock('@/lib/api-client/rq-generated/queries', () => ({
  useOrderControllerServiceGetApiOrders: jest.fn(),
  useOrderControllerServicePutApiOrdersById: jest.fn(),
}));

const mockUseSession = useSession as jest.Mock;
const mockGetApiOrders = useOrderControllerServiceGetApiOrders as jest.Mock;
const mockPutApiOrdersById = useOrderControllerServicePutApiOrdersById as jest.Mock;

const queryClient = new QueryClient();

const AllTheProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('OrderManagement Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    queryClient.clear(); // Clear query cache

    // Default mock for put mutation
    mockPutApiOrdersById.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      variables: null,
    });
  });

  // Test 1: Permission Denied for Non-Admin
  test('shows permission denied if user is not admin', () => {
    mockUseSession.mockReturnValue({ data: { user: { roles: ['user'] } }, status: 'authenticated' });
    mockGetApiOrders.mockReturnValue({ data: [], isLoading: false, error: null });
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('You do not have permission to view this page.')).toBeInTheDocument();
  });

  // Test 2: Loading Session
  test('shows loading session state', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' });
    mockGetApiOrders.mockReturnValue({ data: [], isLoading: false, error: null });
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('Loading session...')).toBeInTheDocument();
  });

  // Test 3: Admin View - Loading Orders
  test('admin sees loading orders state', () => {
    mockUseSession.mockReturnValue({ data: { user: { roles: ['admin'] } }, status: 'authenticated' });
    mockGetApiOrders.mockReturnValue({ data: undefined, isLoading: true, error: null });
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('Loading orders...')).toBeInTheDocument();
  });

  // Test 4: Admin View - Fetched Orders
  const mockOrders = [
    { id: 'order1', deliveryAddress: '123 Main St', orderDate: '2023-01-15T10:00:00Z', totalAmount: 100, status: 'Pending' },
    { id: 'order2', deliveryAddress: '456 Oak Ave', orderDate: '2023-01-16T11:30:00Z', totalAmount: 150, status: 'Processing' },
  ];

  test('admin sees list of orders when fetched', async () => {
    mockUseSession.mockReturnValue({ data: { user: { roles: ['admin'] } }, status: 'authenticated' });
    mockGetApiOrders.mockReturnValue({ data: mockOrders, isLoading: false, error: null });
    render(<OrderManagement />, { wrapper: AllTheProviders });

    expect(screen.getByText('Manage Orders')).toBeInTheDocument();
    expect(screen.getByText('order1')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('order2')).toBeInTheDocument();
    expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();
  });

  // Test 5: Admin View - No Orders
  test('admin sees "No orders found" when list is empty', () => {
    mockUseSession.mockReturnValue({ data: { user: { roles: ['admin'] } }, status: 'authenticated' });
    mockGetApiOrders.mockReturnValue({ data: [], isLoading: false, error: null });
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('No orders found.')).toBeInTheDocument();
  });

  // Test 6: Admin View - Error Fetching Orders
  test('admin sees error message if fetching orders fails', () => {
    mockUseSession.mockReturnValue({ data: { user: { roles: ['admin'] } }, status: 'authenticated' });
    mockGetApiOrders.mockReturnValue({ data: undefined, isLoading: false, error: new Error('Failed to fetch') });
    // Mock toast.error
    const mockToastError = jest.fn();
    jest.spyOn(require('sonner'), 'toast', 'get').mockReturnValue({ error: mockToastError });

    render(<OrderManagement />, { wrapper: AllTheProviders });

    // Check if toast.error was called with the error message
    // Note: The component itself doesn't render the error directly in the main body for fetch errors, it uses toast
    // So we check if the toast was called.
    expect(mockToastError).toHaveBeenCalledWith('Error fetching orders: Failed to fetch');
  });

  // Test 7: Admin View - Update Order Status
  test('admin can update order status', async () => {
    const mockMutate = jest.fn();
    mockPutApiOrdersById.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      variables: null,
    });
    mockUseSession.mockReturnValue({ data: { user: { roles: ['admin'] } }, status: 'authenticated' });
    mockGetApiOrders.mockReturnValue({ data: [mockOrders[0]], isLoading: false, error: null, refetch: jest.fn() });

    // Mock toast.success
    const mockToastSuccess = jest.fn();
    jest.spyOn(require('sonner'), 'toast', 'get').mockReturnValue({ ...jest.requireActual('sonner').toast, success: mockToastSuccess });


    render(<OrderManagement />, { wrapper: AllTheProviders });

    const selectElement = screen.getByDisplayValue('Pending'); // Find select by current value
    fireEvent.change(selectElement, { target: { value: 'Shipped' } });

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: 'order1',
        requestBody: { ...mockOrders[0], status: 'Shipped' },
      });
    });

    // Simulate successful mutation for toast message
    // In a real scenario, the onSuccess callback of the mutation hook would be called
    // For this test, we directly check if mutate was called.
    // To test the toast, we'd need to call the onSuccess mock from mockPutApiOrdersById
    const mutationOptions = mockPutApiOrdersById.mock.calls[0][0]; // Get the options passed to the hook
    mutationOptions.onSuccess({ id: 'order1' }); // Manually call onSuccess

    await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('Order order1 status updated successfully!');
    });
  });

   // Test 8: Admin View - Update Order Status Failure
  test('handles error when updating order status fails', async () => {
    const mockMutate = jest.fn((args) => {
        // Simulate error by calling onError from the hook's options
        const mutationOptions = mockPutApiOrdersById.mock.calls[0][0];
        mutationOptions.onError(new Error('Update failed'), args);
    });

    mockPutApiOrdersById.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      variables: null,
    });
    mockUseSession.mockReturnValue({ data: { user: { roles: ['admin'] } }, status: 'authenticated' });
    mockGetApiOrders.mockReturnValue({ data: [mockOrders[0]], isLoading: false, error: null, refetch: jest.fn() });

    const mockToastError = jest.fn();
    jest.spyOn(require('sonner'), 'toast', 'get').mockReturnValue({ ...jest.requireActual('sonner').toast, error: mockToastError });

    render(<OrderManagement />, { wrapper: AllTheProviders });

    const selectElement = screen.getByDisplayValue('Pending');
    fireEvent.change(selectElement, { target: { value: 'Shipped' } });

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith('Failed to update order order1: Update failed');
    });
  });

});
