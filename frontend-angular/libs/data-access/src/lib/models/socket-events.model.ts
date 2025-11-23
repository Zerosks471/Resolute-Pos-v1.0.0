/**
 * Socket.IO event types for POS system
 */

export interface OrderEvent {
  orderId: string;
  tableId: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
  timestamp: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface KitchenDisplayEvent {
  orderId: string;
  tableNumber: number;
  items: OrderItem[];
  priority: 'normal' | 'high' | 'urgent';
  waitTime: number;
}

export interface TableUpdateEvent {
  tableId: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  occupants?: number;
}

export interface PaymentEvent {
  orderId: string;
  amount: number;
  method: 'cash' | 'card' | 'mobile';
  status: 'pending' | 'completed' | 'failed';
}

/**
 * Socket event names used in the application
 */
export const SocketEvents = {
  // Orders
  NEW_ORDER: 'new_order',
  ORDER_UPDATE: 'order_update',
  ORDER_COMPLETE: 'order_complete',
  ORDER_CANCEL: 'order_cancel',

  // Kitchen
  KITCHEN_ORDER: 'kitchen_order',
  KITCHEN_UPDATE: 'kitchen_update',

  // Tables
  TABLE_UPDATE: 'table_update',

  // Payments
  PAYMENT_UPDATE: 'payment_update',

  // Backend events (sent to server)
  NEW_ORDER_BACKEND: 'new_order_backend',
  ORDER_UPDATE_BACKEND: 'order_update_backend',
} as const;
