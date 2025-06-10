// components/dashboard/mobile/OrderCard.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderCard, { Order } from './OrderCard';
import OrderItemDetails from './OrderItemDetails';

jest.mock('./OrderItemDetails', () => jest.fn(() => <div data-testid="order-item-details-mock">Mocked Item Details</div>));

const mockOrder: Order = {
  id: 'orderTest1',
  orderDate: '2023-10-01T10:00:00Z',
  status: 'Pending',
  deliveryAddress: '123 Test St',
  totalAmount: 199.99,
  orderItems: [
    { id: 'item1', productVariantId: 'pv1', quantity: 1, size: 'M', price: 100 },
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

  test('toggle button has correct accessibility attributes and sr-only text', async () => {
    render(
      <OrderCard
        order={mockOrder}
        handleUpdateStatus={mockHandleUpdateStatus}
        isUpdatingStatus={false}
        orderStatuses={mockOrderStatuses}
      />
    );
    // The button's accessible name includes the sr-only text.
    const toggleButton = screen.getByRole('button', { name: 'Expand order items' });
    const orderItemsContentId = `order-items-${mockOrder.id}`;

    // Initial state (collapsed)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(toggleButton).toHaveAttribute('aria-controls', orderItemsContentId);
    // Verify the sr-only span exists and has the correct text
    const srOnlySpanInitial = toggleButton.querySelector('.sr-only');
    expect(srOnlySpanInitial).toHaveTextContent('Expand order items');


    // Expand
    fireEvent.click(toggleButton);
    await waitFor(() => {
      // Button's accessible name changes because sr-only text changes
      const expandedButton = screen.getByRole('button', { name: 'Collapse order items' });
      expect(expandedButton).toHaveAttribute('aria-expanded', 'true');
      const srOnlySpanExpanded = expandedButton.querySelector('.sr-only');
      expect(srOnlySpanExpanded).toHaveTextContent('Collapse order items');

      // Verify the content area has the correct ID
      // The content div is the one with class 'mt-4 pt-4 border-t' and the generated ID
      const orderItemsContainer = document.getElementById(orderItemsContentId);
      expect(orderItemsContainer).toBeInTheDocument();
      // Ensure the mocked details are visible within this container
      expect(screen.getByTestId('order-item-details-mock')).toBeVisible();

    });

    // Collapse
    fireEvent.click(screen.getByRole('button', { name: 'Collapse order items' })); // Query by new name
    await waitFor(() => {
        const collapsedButton = screen.getByRole('button', { name: 'Expand order items' });
        expect(collapsedButton).toHaveAttribute('aria-expanded', 'false');
        const srOnlySpanCollapsed = collapsedButton.querySelector('.sr-only');
        expect(srOnlySpanCollapsed).toHaveTextContent('Expand order items');
    });
  });

  // This test is somewhat redundant with the one above but focuses more on the toggling action itself.
  test('toggles order items display and accessibility attributes are updated', async () => {
    render(
      <OrderCard
        order={mockOrder}
        handleUpdateStatus={mockHandleUpdateStatus}
        isUpdatingStatus={false}
        orderStatuses={mockOrderStatuses}
      />
    );
    // Initial state: button text is "Expand order items"
    let toggleButton = screen.getByRole('button', { name: /Expand order items/i });
    const orderItemsContentId = `order-items-${mockOrder.id}`;

    // Initial state
    expect(screen.queryByTestId('order-item-details-mock')).not.toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Expand
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.getByTestId('order-item-details-mock')).toBeInTheDocument();
      // After click, button text changes, so re-query
      toggleButton = screen.getByRole('button', { name: /Collapse order items/i });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      const orderItemsContainer = document.getElementById(orderItemsContentId);
      expect(orderItemsContainer).toBeInTheDocument();
    });

    // Collapse
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.queryByTestId('order-item-details-mock')).not.toBeInTheDocument();
      // After click, button text changes again
      toggleButton = screen.getByRole('button', { name: /Expand order items/i });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('displays "No items in this order" if orderItems is empty or undefined', async () => {
    render(
      <OrderCard
        order={{...mockOrder, orderItems: []}} // Order with no items
        handleUpdateStatus={mockHandleUpdateStatus}
        isUpdatingStatus={false}
        orderStatuses={mockOrderStatuses}
      />
    );
    const toggleButton = screen.getByRole('button', { name: /Expand order items/i });
    fireEvent.click(toggleButton);
    await waitFor(() => {
        expect(screen.getByText('No items in this order.')).toBeInTheDocument();
    });
  });
});
