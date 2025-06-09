'use client'

import React, { useState, useEffect, Fragment } from 'react' // Added Fragment
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'; // For accordion toggle

import {
  useOrderControllerServiceGetApiOrders,
  useOrderControllerServicePutApiOrdersById,
} from '@/lib/api-client/rq-generated/queries'

// Based on OrderItemDto from OpenAPI spec
interface OrderItem {
  id: string;
  productVariantId: string; // Will be displayed directly for now
  quantity: number;
  size?: string;
  price?: number;
  // TODO: Potentially add fields for fetched product/variant details like name, color, image
}

// Based on OrderDto from OpenAPI spec
interface Order {
  id: string;
  orderDate?: string;
  status?: string;
  deliveryAddress?: string;
  totalAmount?: number;
  orderItems?: OrderItem[]; // Added orderItems
}

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OrderManagement() {
  const { data: session, status: sessionStatus } = useSession()
  const queryClient = useQueryClient()
  const [expandedOrderItems, setExpandedOrderItems] = useState<Record<string, boolean>>({});

  const isAdmin = session?.user?.roles?.includes('admin')

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useOrderControllerServiceGetApiOrders(
    ['orders'],
    { query: { enabled: sessionStatus === 'authenticated' && isAdmin } }
  );

  const updateOrderMutation = useOrderControllerServicePutApiOrdersById({
    onSuccess: (updatedOrder) => {
      toast.success(`Order ${updatedOrder.id} status updated successfully!`)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error: Error, variables) => {
      toast.error(`Failed to update order ${variables.id}: ${error.message}`)
      console.error('Error updating order:', error)
    },
  })

  useEffect(() => {
    if (ordersError) {
      toast.error(`Error fetching orders: ${(ordersError as Error).message}`)
      console.error('Error fetching orders:', ordersError)
    }
  }, [ordersError])

  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    if (!isAdmin) {
      toast.error('Permission denied.')
      return
    }

    // Restrict cancellation to "Pending" status only
    if (newStatus === 'Cancelled' && order.status !== 'Pending') {
      toast.error('Orders can only be cancelled if they are in "Pending" status.');
      // Optionally, reset the select dropdown to the original status if using controlled components for select
      // This example assumes direct change, so toast is the main feedback.
      return;
    }

    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to change the status of order ${order.id} from "${order.status}" to "${newStatus}"?`
    )
    if (!confirmed) {
      // If not confirmed, and if the select element is controlled,
      // you might need to reset its value to order.status here.
      // For this basic example, we assume the visual change might momentarily occur
      // but the actual update won't proceed. A more robust UI would control the select.
      return;
    }

    const updatedOrderPayload = {
      ...order, // Spread all existing fields from the fetched order
      status: newStatus,
    };

    updateOrderMutation.mutate({ id: order.id, requestBody: updatedOrderPayload as any });
  }

  const toggleOrderItems = (orderId: string) => {
    setExpandedOrderItems(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  if (sessionStatus === 'loading') {
    return <div>Loading session...</div>
  }

  if (!isAdmin) {
    return <div>You do not have permission to view this page.</div>
  }

  if (isLoadingOrders) {
    return <div>Loading orders...</div>
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Manage Orders</h2>
      {ordersData && ordersData.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className='space-y-2'>
          {ordersData?.map((order: Order) => (
            <Fragment key={order.id}>
              <div className='bg-white border rounded-md p-4'>
                <div className='grid grid-cols-5 gap-4 items-center'>
                  <div className='col-span-4'>
                    <div className='flex items-center'>
                        <button onClick={() => toggleOrderItems(order.id)} className="mr-2 p-1 hover:bg-gray-100 rounded">
                            {expandedOrderItems[order.id] ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                        </button>
                        <div><strong>ID:</strong> {order.id}</div>
                    </div>
                    <div><strong>Customer (Address):</strong> {order.deliveryAddress || 'N/A'}</div>
                    <div><strong>Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</div>
                    <div><strong>Total:</strong> {order.totalAmount?.toFixed(2) || 'N/A'} FCFA</div>
                    <div><strong>Status:</strong> {order.status || 'N/A'}</div>
                  </div>
                  <div className='col-span-1'>
                    <select
                      value={order.status || ''}
                      onChange={e => handleUpdateStatus(order, e.target.value)}
                      className='p-2 border rounded w-full'
                      disabled={updateOrderMutation.isPending && updateOrderMutation.variables?.id === order.id}
                    >
                      {orderStatuses.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {expandedOrderItems[order.id] && (
                  <div className='mt-3 pt-3 border-t'>
                    <h4 className='text-md font-semibold mb-2'>Order Items:</h4>
                    {order.orderItems && order.orderItems.length > 0 ? (
                      <ul className='space-y-1 pl-4'>
                        {order.orderItems.map(item => (
                          <li key={item.id} className='text-sm p-1 bg-gray-50 rounded'>
                            <div><strong>Variant ID:</strong> {item.productVariantId}</div>
                            {/* TODO: Fetch and display more product variant details here (e.g., name, color) */}
                            <div><strong>Quantity:</strong> {item.quantity}</div>
                            <div><strong>Size:</strong> {item.size || 'N/A'}</div>
                            <div><strong>Price/Item:</strong> {item.price?.toFixed(2) || 'N/A'} FCFA</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-sm text-gray-500'>No items in this order.</p>
                    )}
                  </div>
                )}
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
