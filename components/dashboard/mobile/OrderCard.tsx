// components/dashboard/mobile/OrderCard.tsx
'use client'

import React, { useState, Fragment } from 'react'; // Fragment is not used, can be removed
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import OrderItemDetails from './OrderItemDetails';

// Interfaces (Order, OrderItem)
export interface OrderItem {
  id: string;
  productVariantId: string;
  quantity: number;
  size?: string;
  price?: number;
}

export interface Order {
  id: string;
  orderDate?: string;
  status?: string;
  deliveryAddress?: string;
  totalAmount?: number;
  orderItems?: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  handleUpdateStatus: (order: Order, newStatus: string) => void;
  isUpdatingStatus: boolean;
  orderStatuses: string[];
}

// Helper function to get status colors
const getStatusClasses = (status?: string): string => {
  if (!status) return 'bg-gray-100 text-gray-800 border-gray-300'; // Default/Unknown
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'shipped':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'delivered':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, handleUpdateStatus, isUpdatingStatus, orderStatuses }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleOrderItems = () => {
    setIsExpanded(!isExpanded);
  };

  const statusDisplayClasses = getStatusClasses(order.status);

  return (
    <div className='bg-white border rounded-md p-4 shadow'>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 items-start'>
        <div className='md:col-span-4 space-y-1'>
          <div className='flex items-center mb-2'>
            <button onClick={toggleOrderItems} className="mr-2 p-1 hover:bg-gray-100 rounded focus:outline-none">
              {isExpanded ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
            </button>
            <h3 className='text-lg font-semibold'>Order ID: {order.id}</h3>
          </div>
          <p><strong>Customer (Address):</strong> {order.deliveryAddress || 'N/A'}</p>
          <p><strong>Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Total:</strong> {order.totalAmount?.toFixed(2) || 'N/A'} FCFA</p>
          <div className='flex items-center'>
            <p className='mr-2'><strong>Status:</strong></p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusDisplayClasses}`}>
                {order.status || 'N/A'}
            </span>
          </div>
        </div>
        <div className='md:col-span-1 space-y-2'>
          <label htmlFor={`status-select-${order.id}`} className="sr-only">Update status for order {order.id}</label>
          <select
            id={`status-select-${order.id}`}
            value={order.status || ''}
            onChange={e => handleUpdateStatus(order, e.target.value)}
            className='p-2 border rounded w-full focus:ring-2 focus:ring-blue-500'
            disabled={isUpdatingStatus}
          >
            {orderStatuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isExpanded && (
        <div className='mt-4 pt-4 border-t'>
          <h4 className='text-md font-semibold mb-2'>Order Items:</h4>
          {order.orderItems && order.orderItems.length > 0 ? (
            <div className='space-y-2'>
              {order.orderItems.map(item => (
                <OrderItemDetails key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className='text-sm text-gray-500'>No items in this order.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
