'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { toast } from 'sonner'

import {
  useOrderControllerServiceGetApiOrders,
  useOrderControllerServicePutApiOrdersById,
} from '@/lib/api-client/rq-generated/queries'

// Actual statuses might come from API or a predefined constant list
const orderStatuses = [
  'pending',
  'completed',
  'delivered',
  'cancelled',
]

export default function OrderManagement() {
  const { data: session, status: sessionStatus } = useSession()
  const queryClient = useQueryClient()

  const isAdmin = session?.user?.roles?.includes('admin')

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useOrderControllerServiceGetApiOrders(['orders'], {
    enabled: sessionStatus === 'authenticated' && isAdmin,
  })

  const updateOrderMutation = useOrderControllerServicePutApiOrdersById({
    onSuccess: async (updatedOrder) => {
      toast.success(`Order ${updatedOrder.id} status updated successfully!`)
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
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
    const orderToUpdate = ordersData?.find((o) => o.id === orderId)
    if (!orderToUpdate) {
      toast.error('Order not found for update.')
      return
    }

    const updatedOrderPayload = {
      ...orderToUpdate,
      status: newStatus,
    }

    // The generated hook for PUT /api/orders/{id} likely expects { id: string, requestBody: OrderDto }
    // The 'requestBody' should match the OrderDto structure from your OpenAPI spec.
    // Make sure all required fields of OrderDto are included.
    // For this example, we assume orderToUpdate (with modified status) is a valid OrderDto.
    updateOrderMutation.mutate({
      id: orderId,
      requestBody: updatedOrderPayload,
    }) // Cast as 'any' if type is complex or not perfectly matching generated types
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
              <th className='py-2 px-4 border-b'>
                Customer (Delivery Address)
              </th>
              <th className='py-2 px-4 border-b'>Order Date</th>
              <th className='py-2 px-4 border-b'>Total Amount</th>
              <th className='py-2 px-4 border-b'>Status</th>
              <th className='py-2 px-4 border-b'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ordersData?.map((order) => (
              <tr key={order.id}>
                <td className='py-2 px-4 border-b'>{order.id}</td>
                <td className='py-2 px-4 border-b'>
                  {order.deliveryAddress ?? 'N/A'}
                </td>
                <td className='py-2 px-4 border-b'>
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className='py-2 px-4 border-b'>
                  {order.totalAmount?.toFixed(2) ?? 'N/A'}
                </td>
                <td className='py-2 px-4 border-b'>{order.status ?? 'N/A'}</td>
                <td className='py-2 px-4 border-b'>
                  <select
                    value={order.status ?? ''}
                    onChange={(e) =>
                      handleUpdateStatus(order.id ?? '', e.target.value)
                    }
                    className='p-1 border rounded'
                    disabled={
                      updateOrderMutation.isPending &&
                      updateOrderMutation.variables?.id === order.id
                    }
                  >
                    {orderStatuses.map((status) => (
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
