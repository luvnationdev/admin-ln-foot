// components/dashboard/mobile/OrderCard.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderCard, { Order } from './OrderCard'; // Import Order type
import OrderItemDetails from './OrderItemDetails'; // To mock its behavior

// Mock OrderItemDetails to simplify OrderCard tests
jest.mock('./OrderItemDetails', () => jest.fn(() => <div data-testid="order-item-details-mock">Mocked Item Details</div>));

const mockOrder: Order = {
  id: 'orderTest1',
  orderDate: '2023-10-01T10:00:00Z',
  status: 'Pending',
  deliveryAddress: '123 Test St',
  totalAmount: 199.99,
  orderItems: [
    { id: 'item1', productVariantId: 'pv1', quantity: 1, size: 'M', price: 100 },
    { id: 'item2', productVariantId: 'pv2', quantity: 2, size: 'L', price: 50 },
  ],
};

const mockOrderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const mockHandleUpdateStatus = jest.fn();

describe('OrderCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (OrderItemDetails as jest.Mock).mockClear();
  });

  test('renders order details correctly', () => {
    render(
      <OrderCard
        order={mockOrder}
        handleUpdateStatus={mockHandleUpdateStatus}
        isUpdatingStatus={false}
        orderStatuses={mockOrderStatuses}
      />
    );
    expect(screen.getByText(`Order ID: ${mockOrder.id}`)).toBeInTheDocument();
    expect(screen.getByText(`Customer (Address): ${mockOrder.deliveryAddress}`)).toBeInTheDocument();
    expect(screen.getByText(`Date: ${new Date(mockOrder.orderDate!).toLocaleDateString()}`)).toBeInTheDocument();
    expect(screen.getByText(`Total: ${mockOrder.totalAmount!.toFixed(2)} FCFA`)).toBeInTheDocument();
    expect(screen.getByText(mockOrder.status!)).toBeInTheDocument();
  });

  test('status display has correct color coding (visual check via class)', () => {
    render(
      <OrderCard
        order={{ ...mockOrder, status: 'Delivered' }}
        handleUpdateStatus={mockHandleUpdateStatus}
        isUpdatingStatus={false}
        orderStatuses={mockOrderStatuses}
      />
    );
    const statusBadge = screen.getByText('Delivered');
    // Example: Check for a class part. Exact classes depend on getStatusClasses implementation.
    expect(statusBadge).toHaveClass('bg-purple-100');
  });

  test('status select calls handleUpdateStatus on change', () => {
    render(
      <OrderCard
        order={mockOrder}
        handleUpdateStatus={mockHandleUpdateStatus}
        isUpdatingStatus={false}
        orderStatuses={mockOrderStatuses}
      />
    );
    const statusSelect = screen.getByDisplayValue(mockOrder.status!);
    fireEvent.change(statusSelect, { target: { value: 'Processing' } });
    expect(mockHandleUpdateStatus).toHaveBeenCalledWith(mockOrder, 'Processing');
  });

  test('status select is disabled when isUpdatingStatus is true', () => {
    render(
      <OrderCard
        order={mockOrder}
        handleUpdateStatus={mockHandleUpdateStatus}
        isUpdatingStatus={true}
        orderStatuses={mockOrderStatuses}
      />
    );
    const statusSelect = screen.getByDisplayValue(mockOrder.status!);
    expect(statusSelect).toBeDisabled();
  });

  test('order items are initially collapsed', () => {
    render(
      <OrderCard
        order={mockOrder}
        handleUpdateStatus={mockHandleUpdateStatus}
        isUpdatingStatus={false}
        orderStatuses={mockOrderStatuses}
      />
    );
    expect(screen.queryByTestId('order-item-details-mock')).not.toBeInTheDocument();
  });

  test('toggles order items display on button click', async () => {
    render(
      <OrderCard
        order={mockOrder}
        handleUpdateStatus={mockHandleUpdateStatus}
        isUpdatingStatus={false}
        orderStatuses={mockOrderStatuses}
      />
    );
    const toggleButton = screen.getByRole('button', { name: /chevron(down|up)icon/i });

    // Expand
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('order-item-details-mock')).toHaveLength(mockOrder.orderItems!.length);
      expect(OrderItemDetails as jest.Mock).toHaveBeenCalledTimes(mockOrder.orderItems!.length);
      expect((OrderItemDetails as jest.Mock).mock.calls[0][0].item).toEqual(mockOrder.orderItems![0]);
    });

    // Collapse
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.queryByTestId('order-item-details-mock')).not.toBeInTheDocument();
    });
  });

  test('displays "No items in this order" if orderItems is empty or undefined', async () => {
    render(
      <OrderCard
        order={{...mockOrder, orderItems: []}}
        handleUpdateStatus={mockHandleUpdateStatus}
        isUpdatingStatus={false}
        orderStatuses={mockOrderStatuses}
      />
    );
    const toggleButton = screen.getByRole('button', { name: /chevron(down|up)icon/i });
    fireEvent.click(toggleButton);
    await waitFor(() => {
        expect(screen.getByText('No items in this order.')).toBeInTheDocument();
    });
  });
});
