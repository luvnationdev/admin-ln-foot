'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Assuming the generated client follows the pattern observed
import {
  useOrderControllerServiceGetApiOrders,
  useOrderControllerServicePutApiOrdersById,
} from '@/lib/api-client/rq-generated/queries' // Adjust if path or naming is different

// Based on OrderDto from OpenAPI spec
interface Order {
  id: string;
  orderDate?: string; // Assuming string format like "date-time"
  status?: string;
  // Using deliveryAddress as a stand-in for customer name for now
  // Ideally, the API would provide a customer name or ID to fetch customer details
  deliveryAddress?: string;
  totalAmount?: number;
  // orderItems are not directly displayed in this simplified table yet
}

// Actual statuses might come from API or a predefined constant list
const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] // Placeholder, adjust if API provides these

export default function OrderManagement() {
  const { data: session, status: sessionStatus } = useSession()
  const queryClient = useQueryClient()

  const isAdmin = session?.user?.roles?.includes('admin')

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders, // To refetch after update
  } = useOrderControllerServiceGetApiOrders(
    ['orders'], // Query key
    {
      query: { enabled: sessionStatus === 'authenticated' && isAdmin } // Only fetch if admin and authenticated
    }
  );

  const updateOrderMutation = useOrderControllerServicePutApiOrdersById({
    onSuccess: (updatedOrder) => {
      toast.success(`Order ${updatedOrder.id} status updated successfully!`)
      queryClient.invalidateQueries({ queryKey: ['orders'] }) // Invalidate and refetch
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

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!isAdmin) {
      toast.error('Permission denied.')
      return
    }

    // Find the original order to send the full DTO, as PUT expects the whole object
    const orderToUpdate = ordersData?.find(o => o.id === orderId)
    if (!orderToUpdate) {
        toast.error("Order not found for update.")
        return;
    }

    const updatedOrderPayload = {
        ...orderToUpdate,
        status: newStatus,
    };

    // The generated hook for PUT /api/orders/{id} likely expects { id: string, requestBody: OrderDto }
    // The 'requestBody' should match the OrderDto structure from your OpenAPI spec.
    // Make sure all required fields of OrderDto are included.
    // For this example, we assume orderToUpdate (with modified status) is a valid OrderDto.
    updateOrderMutation.mutate({ id: orderId, requestBody: updatedOrderPayload as any }); // Cast as 'any' if type is complex or not perfectly matching generated types
  }

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
        <table className='min-w-full bg-white border'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b'>Order ID</th>
              <th className='py-2 px-4 border-b'>Customer (Delivery Address)</th>
              <th className='py-2 px-4 border-b'>Order Date</th>
              <th className='py-2 px-4 border-b'>Total Amount</th>
              <th className='py-2 px-4 border-b'>Status</th>
              <th className='py-2 px-4 border-b'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ordersData?.map((order: Order) => (
              <tr key={order.id}>
                <td className='py-2 px-4 border-b'>{order.id}</td>
                <td className='py-2 px-4 border-b'>{order.deliveryAddress || 'N/A'}</td>
                <td className='py-2 px-4 border-b'>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                <td className='py-2 px-4 border-b'>{order.totalAmount?.toFixed(2) || 'N/A'}</td>
                <td className='py-2 px-4 border-b'>{order.status || 'N/A'}</td>
                <td className='py-2 px-4 border-b'>
                  <select
                    value={order.status || ''}
                    onChange={e => handleUpdateStatus(order.id, e.target.value)}
                    className='p-1 border rounded'
                    disabled={updateOrderMutation.isPending && updateOrderMutation.variables?.id === order.id}
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
