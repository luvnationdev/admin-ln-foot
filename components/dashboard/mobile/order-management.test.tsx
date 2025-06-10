// components/dashboard/mobile/order-management.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderManagement from './OrderManagement'; // Corrected import name
import {
  useOrderControllerServiceGetApiOrders,
  useOrderControllerServicePutApiOrdersById,
} from '@/lib/api-client/rq-generated/queries';
import { toast } from 'sonner';
import OrderCard, { Order as OrderCardOrderType } from './OrderCard'; // Import OrderCard and its Order type

// Mock next-auth/react
jest.mock('next-auth/react');
// Mock API hooks
jest.mock('@/lib/api-client/rq-generated/queries', () => ({
  useOrderControllerServiceGetApiOrders: jest.fn(),
  useOrderControllerServicePutApiOrdersById: jest.fn(),
}));
// Mock sonner
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
// Mock OrderCard
jest.mock('./OrderCard', () => jest.fn(() => <div data-testid="order-card-mock">Mocked Order Card</div>));


const mockUseSession = useSession as jest.Mock;
const mockGetApiOrders = useOrderControllerServiceGetApiOrders as jest.Mock;
const mockPutApiOrdersById = useOrderControllerServicePutApiOrdersById as jest.Mock;
const mockToast = toast as jest.Mocked<typeof toast>;
const MockedOrderCard = OrderCard as jest.Mock;


const queryClient = new QueryClient();
const AllTheProviders: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Re-using mockOrdersData, but ensuring it matches OrderCardOrderType if different
const mockApiOrdersData: OrderCardOrderType[] = [
  { id: 'order1', status: 'Pending', orderItems: [{id: 'item1', productVariantId: 'pv1', quantity:1}] },
  { id: 'order2', status: 'Processing', orderItems: [] },
];

// Mock window.confirm for handleUpdateStatus tests
global.confirm = jest.fn();

describe('OrderManagement Component (Refactored)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    (global.confirm as jest.Mock).mockReturnValue(true); // Default confirmation
    mockPutApiOrdersById.mockReturnValue({ mutate: jest.fn(), isPending: false, variables: null });
    mockUseSession.mockReturnValue({ data: { user: { roles: ['admin'] } }, status: 'authenticated' });
    mockGetApiOrders.mockReturnValue({ data: [...mockApiOrdersData], isLoading: false, error: null, refetch: jest.fn() });
  });

  test('shows permission denied if user is not admin', () => {
    mockUseSession.mockReturnValueOnce({ data: { user: { roles: ['user'] } }, status: 'authenticated' });
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('You do not have permission to view this page.')).toBeInTheDocument();
  });

  test('shows loading session state', () => {
    mockUseSession.mockReturnValueOnce({ data: null, status: 'loading' });
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('Loading session...')).toBeInTheDocument();
  });

  test('shows loading orders state', () => {
    mockGetApiOrders.mockReturnValueOnce({ data: undefined, isLoading: true, error: null });
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('Loading orders...')).toBeInTheDocument();
  });

  test('shows error state if fetching orders fails', () => {
    mockGetApiOrders.mockReturnValueOnce({ data: undefined, isLoading: false, error: new Error("Network Error") });
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('Could not load orders. An error occurred.')).toBeInTheDocument();
    expect(mockToast.error).toHaveBeenCalledWith('Error fetching orders: Network Error');
  });

  test('renders OrderCard components when orders are fetched', () => {
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getAllByTestId('order-card-mock')).toHaveLength(mockApiOrdersData.length);
    expect(MockedOrderCard).toHaveBeenCalledTimes(mockApiOrdersData.length);
    // Check props passed to the first OrderCard instance
    expect(MockedOrderCard).toHaveBeenNthCalledWith(1, expect.objectContaining({
        order: mockApiOrdersData[0],
        isUpdatingStatus: false, // Assuming mutation is not pending for this order initially
        // handleUpdateStatus and orderStatuses are also passed
    }), {});
  });

  test('shows "No orders found" when list is empty', () => {
    mockGetApiOrders.mockReturnValueOnce({ data: [], isLoading: false, error: null });
    render(<OrderManagement />, { wrapper: AllTheProviders });
    expect(screen.getByText('No orders found.')).toBeInTheDocument();
  });

  // Tests for handleUpdateStatus (confirmation, cancellation logic)
  // These tests remain in OrderManagement as handleUpdateStatus is defined here.
  describe('handleUpdateStatus in OrderManagement', () => {
    let instance: any; // To hold the rendered component instance if needed for handleUpdateStatus
    let handleUpdateStatusFn: (order: OrderCardOrderType, newStatus: string) => void;

    beforeEach(() => {
        // To test handleUpdateStatus, we need to get a reference to it.
        // One way is to check what's passed to OrderCard mock.
        MockedOrderCard.mockImplementation(props => {
            // Capture the function when OrderCard is rendered
            if (props.order.id === mockApiOrdersData[0].id) { // Assuming we test with the first order
                 handleUpdateStatusFn = props.handleUpdateStatus;
            }
            return <div data-testid="order-card-mock">Mocked Order Card</div>;
        });
        render(<OrderManagement />, { wrapper: AllTheProviders });
    });

    test('prompts confirmation and calls mutation if confirmed', async () => {
        const mockMutate = jest.fn();
        mockPutApiOrdersById.mockReturnValueOnce({ mutate: mockMutate, isPending: false, variables: null });
        (global.confirm as jest.Mock).mockReturnValueOnce(true);

        handleUpdateStatusFn(mockApiOrdersData[0], 'Processing');

        expect(global.confirm).toHaveBeenCalled();
        expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({
            id: mockApiOrdersData[0].id,
            requestBody: expect.objectContaining({ status: 'Processing' }),
        }));
    });

    test('aborts mutation if not confirmed', async () => {
        const mockMutate = jest.fn();
        mockPutApiOrdersById.mockReturnValueOnce({ mutate: mockMutate, isPending: false, variables: null });
        (global.confirm as jest.Mock).mockReturnValueOnce(false);

        handleUpdateStatusFn(mockApiOrdersData[0], 'Processing');

        expect(global.confirm).toHaveBeenCalled();
        expect(mockMutate).not.toHaveBeenCalled();
    });

    test('allows cancellation for "Pending" orders', () => {
        const mockMutate = jest.fn();
        mockPutApiOrdersById.mockReturnValueOnce({ mutate: mockMutate, isPending: false, variables: null });
        (global.confirm as jest.Mock).mockReturnValueOnce(true);

        const pendingOrder = { ...mockApiOrdersData[0], status: 'Pending' }; // Ensure status is Pending for this test
        handleUpdateStatusFn(pendingOrder, 'Cancelled');

        expect(mockToast.error).not.toHaveBeenCalled();
        expect(mockMutate).toHaveBeenCalled();
    });

    test('prevents cancellation for non-"Pending" orders and shows toast', () => {
        const mockMutate = jest.fn();
        mockPutApiOrdersById.mockReturnValueOnce({ mutate: mockMutate, isPending: false, variables: null });

        const processingOrder = { ...mockApiOrdersData[1], status: 'Processing' }; // Ensure status is not Pending
        handleUpdateStatusFn(processingOrder, 'Cancelled');

        expect(mockToast.error).toHaveBeenCalledWith('Orders can only be cancelled if they are in "Pending" status.');
        expect(mockMutate).not.toHaveBeenCalled();
    });
  });
});
