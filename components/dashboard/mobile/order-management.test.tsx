// components/dashboard/mobile/order-management.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderManagement from './order-management'; // Adjust path as necessary
import {
  useOrderControllerServiceGetApiOrders,
  useOrderControllerServicePutApiOrdersById,
} from '@/lib/api-client/rq-generated/queries'; // Adjust path
import { toast } from 'sonner'; // Import toast

// Mock next-auth/react
jest.mock('next-auth/react');

// Mock the API hooks
jest.mock('@/lib/api-client/rq-generated/queries', () => ({
  useOrderControllerServiceGetApiOrders: jest.fn(),
  useOrderControllerServicePutApiOrdersById: jest.fn(),
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(), // Add other methods if used
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));


const mockUseSession = useSession as jest.Mock;
const mockGetApiOrders = useOrderControllerServiceGetApiOrders as jest.Mock;
const mockPutApiOrdersById = useOrderControllerServicePutApiOrdersById as jest.Mock;
const mockToast = toast as jest.Mocked<typeof toast>;


const queryClient = new QueryClient();

const AllTheProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock window.confirm
global.confirm = jest.fn();

const mockOrdersData = [
  {
    id: 'order1',
    deliveryAddress: '123 Main St',
    orderDate: '2023-01-15T10:00:00Z',
    totalAmount: 100,
    status: 'Pending',
    orderItems: [
      { id: 'item1', productVariantId: 'pv001', quantity: 1, size: 'M', price: 50 },
      { id: 'item2', productVariantId: 'pv002', quantity: 2, size: 'L', price: 25 },
    ]
  },
  {
    id: 'order2',
    deliveryAddress: '456 Oak Ave',
    orderDate: '2023-01-16T11:30:00Z',
    totalAmount: 150,
    status: 'Processing',
    orderItems: []
  },
  {
    id: 'order3',
    deliveryAddress: '789 Pine Ln',
    orderDate: '2023-01-17T12:00:00Z',
    totalAmount: 200,
    status: 'Pending', // Another pending for cancellation test
    orderItems: [{ id: 'item3', productVariantId: 'pv003', quantity: 1, size: 'S', price: 200 }]
  },
];


describe('OrderManagement Component - Updated Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    (global.confirm as jest.Mock).mockReturnValue(true); // Default to confirmed

    mockPutApiOrdersById.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      variables: null,
    });
    mockUseSession.mockReturnValue({ data: { user: { roles: ['admin'] } }, status: 'authenticated' });
    mockGetApiOrders.mockReturnValue({ data: [...mockOrdersData], isLoading: false, error: null, refetch: jest.fn() });
  });

  // Test Confirmation Dialog
  test('status update prompts confirmation dialog', async () => {
    render(<OrderManagement />, { wrapper: AllTheProviders });
    const order1StatusSelect = screen.getAllByDisplayValue('Pending')[0]; // First order is 'Pending'
    fireEvent.change(order1StatusSelect, { target: { value: 'Processing' } });

    expect(global.confirm).toHaveBeenCalledWith(
      'Are you sure you want to change the status of order order1 from "Pending" to "Processing"?'
    );
  });

  test('status update proceeds if confirmed', async () => {
    const mockMutate = jest.fn();
    mockPutApiOrdersById.mockReturnValueOnce({ mutate: mockMutate, isPending: false, variables: null });
    (global.confirm as jest.Mock).mockReturnValueOnce(true);

    render(<OrderManagement />, { wrapper: AllTheProviders });
    const order1StatusSelect = screen.getAllByDisplayValue('Pending')[0];
    fireEvent.change(order1StatusSelect, { target: { value: 'Processing' } });

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: 'order1',
        requestBody: { ...mockOrdersData[0], status: 'Processing' },
      });
    });
  });

  test('status update is aborted if not confirmed', async () => {
    const mockMutate = jest.fn();
    mockPutApiOrdersById.mockReturnValueOnce({ mutate: mockMutate, isPending: false, variables: null });
    (global.confirm as jest.Mock).mockReturnValueOnce(false);

    render(<OrderManagement />, { wrapper: AllTheProviders });
    const order1StatusSelect = screen.getAllByDisplayValue('Pending')[0];
    fireEvent.change(order1StatusSelect, { target: { value: 'Processing' } });

    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  // Test Cancellation Restriction
  test('allows cancellation for "Pending" orders after confirmation', async () => {
    const mockMutate = jest.fn();
    mockPutApiOrdersById.mockReturnValueOnce({ mutate: mockMutate, isPending: false, variables: null });
    (global.confirm as jest.Mock).mockReturnValueOnce(true);

    render(<OrderManagement />, { wrapper: AllTheProviders });
    // Find the select for order1 (Pending)
    const pendingOrderSelects = screen.getAllByDisplayValue('Pending');
    const order1Select = pendingOrderSelects.find(select => {
        // Try to find a unique part of its parent card, like the ID.
        // This is a bit brittle, depends on DOM structure.
        let parent: HTMLElement | null = select.parentElement;
        while(parent) {
            if (parent.textContent?.includes('ID: order1')) return true;
            parent = parent.parentElement;
        }
        return false;
    });

    if (!order1Select) throw new Error("Could not find select for order1");

    fireEvent.change(order1Select, { target: { value: 'Cancelled' } });

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: 'order1',
        requestBody: { ...mockOrdersData[0], status: 'Cancelled' },
      });
    });
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  test('prevents cancellation for non-"Pending" orders and shows toast', async () => {
    const mockMutate = jest.fn();
    mockPutApiOrdersById.mockReturnValueOnce({ mutate: mockMutate, isPending: false, variables: null });
    (global.confirm as jest.Mock).mockReturnValueOnce(true); // Confirm, but logic should prevent

    render(<OrderManagement />, { wrapper: AllTheProviders });
    const processingOrderSelect = screen.getByDisplayValue('Processing'); // order2 is 'Processing'
    fireEvent.change(processingOrderSelect, { target: { value: 'Cancelled' } });

    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith('Orders can only be cancelled if they are in "Pending" status.');
    });
  });

  // Test Order Items Display
  test('order items are initially collapsed', () => {
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.queryByText('Variant ID: pv001')).not.toBeInTheDocument();
  });

  test('clicking toggle expands and collapses order items for a specific order', async () => {
    render(<OrderManagement />, { wrapper: AllTheProviders });

    // Find toggle for order1 - it's the first chevron button
    const order1Toggle = screen.getAllByRole('button', { name: /chevron(down|up)icon/i })[0];

    // Expand
    fireEvent.click(order1Toggle);
    await waitFor(() => {
      expect(screen.getByText('Variant ID: pv001')).toBeInTheDocument();
      expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
      expect(screen.getByText('Size: M')).toBeInTheDocument();
      expect(screen.getByText('Price/Item: 50.00 FCFA')).toBeInTheDocument();
      expect(screen.getByText('Variant ID: pv002')).toBeInTheDocument();
    });

    // Collapse
    fireEvent.click(order1Toggle);
    await waitFor(() => {
      expect(screen.queryByText('Variant ID: pv001')).not.toBeInTheDocument();
    });
  });

  test('displays "No items in this order" if orderItems is empty', async () => {
    render(<OrderManagement />, { wrapper: AllTheProviders });
    // Find toggle for order2 (which has empty orderItems)
    // This assumes order of buttons matches order of data.
    const orderToggles = screen.getAllByRole('button', { name: /chevron(down|up)icon/i });
    const order2Toggle = orderToggles[1]; // Second order in mockOrdersData

    fireEvent.click(order2Toggle);
    await waitFor(() => {
      expect(screen.getByText('No items in this order.')).toBeInTheDocument();
    });
  });

   // Ensure basic rendering still works (smoke test for layout change)
  test('renders orders in card layout', () => {
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('ID: order1')).toBeInTheDocument();
    expect(screen.getByText('Customer (Address): 123 Main St')).toBeInTheDocument();
    expect(screen.getByText('ID: order2')).toBeInTheDocument();
    expect(screen.getByText('Customer (Address): 456 Oak Ave')).toBeInTheDocument();
  });

  // Re-check a few original tests to ensure they are still valid
  test('[Original Check] shows permission denied if user is not admin', () => {
    mockUseSession.mockReturnValueOnce({ data: { user: { roles: ['user'] } }, status: 'authenticated' });
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('You do not have permission to view this page.')).toBeInTheDocument();
  });

  test('[Original Check] admin sees list of orders', async () => {
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('Manage Orders')).toBeInTheDocument();
    expect(screen.getByText('ID: order1')).toBeInTheDocument();
    expect(screen.getByText('ID: order2')).toBeInTheDocument();
  });
});
