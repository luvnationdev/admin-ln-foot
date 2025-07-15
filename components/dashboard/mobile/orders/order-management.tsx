'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { toast } from 'sonner'

import {
  useOrderControllerServiceGetApiOrders,
  useOrderControllerServicePutApiOrdersById,
} from '@/lib/api-client/rq-generated/queries'

import type { OrderDto } from '@/lib/api-client/rq-generated/requests'
import OrderCard from './order-card'

const orderStatusesList = [
  'Pending',
  'Processing',
  'Completed',
  'Delivered',
  'Cancelled',
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
      console.error('Error updating order:', error) // Keep console.error for debugging
    },
  })

  useEffect(() => {
    if (ordersError) {
      // Log the error for debugging
      console.error('Error fetching orders:', ordersError)
      // Display a generic error message to the user via toast
      toast.error(`Error fetching orders: ${(ordersError as Error).message}`)
    }
  }, [ordersError])

  const handleUpdateStatus = (order: OrderDto, newStatus: string) => {
    if (!isAdmin) {
      toast.error('Permission denied.')
      return
    }

    if (newStatus === 'Cancelled' && order.status !== 'Pending') {
      toast.error(
        'Orders can only be cancelled if they are in "Pending" status.'
      )
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to change the status of order ${order.id} from "${order.status ?? 'N/A'}" to "${newStatus}"?`
    )
    if (!confirmed) {
      return
    }

    const payloadForUpdate = {
      ...order,
      orderItems: order.orderItems?.map((item) => ({
        // Ensure only necessary fields for OrderItemDto are sent if API expects strict DTOs
        id: item.id, // This might not be needed or allowed by backend for update operations
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        size: item.size,
        price: item.price, // Price might be fixed and not updatable from here
      })),
      status: newStatus,
    }

    updateOrderMutation.mutate({
      id: order.id!,
      requestBody: payloadForUpdate,
    })
  }

  if (sessionStatus === 'loading') {
    return <div className='p-4 text-center'>Loading session...</div>
  }

  if (!isAdmin) {
    return (
      <div className='p-4 text-center'>
        You do not have permission to view this page.
      </div>
    )
  }

  if (isLoadingOrders) {
    return <div className='p-4 text-center'>Loading orders...</div>
  }

  if (ordersError) {
    // This provides a fallback UI if ordersData is undefined due to an error
    return (
      <div className='p-4 text-center text-red-600'>
        Could not load orders. An error occurred.
      </div>
    )
  }

  return (
    <div className='space-y-4 p-4'>
      <h2 className='text-2xl font-semibold mb-6 text-center md:text-left'>
        Manage Orders
      </h2>
      {ordersData && ordersData.length === 0 ? (
        <p className='text-center text-gray-500'>No orders found.</p>
      ) : (
        <div className='space-y-4'>
          {/* Type for 'order' is inferred from 'ordersData' which should be Order[] */}
          {ordersData?.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              handleUpdateStatus={handleUpdateStatus}
              isUpdatingStatus={
                updateOrderMutation.isPending &&
                updateOrderMutation.variables?.id === order.id
              }
              orderStatuses={orderStatusesList}
            />
          ))}
        </div>
      )}
    </div>
  )
}
