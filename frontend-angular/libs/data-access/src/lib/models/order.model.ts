/**
 * Order models for POS system
 */

import { OrderItem as BaseOrderItem } from './socket-events.model';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OrderType {
  DINE_IN = 'dine_in',
  TAKEOUT = 'takeout',
  DELIVERY = 'delivery',
}

export interface OrderItemModifier {
  id: string;
  name: string;
  priceAdjustment: number;
}

// Extend the base OrderItem with modifiers
export interface OrderItem extends BaseOrderItem {
  modifiers?: OrderItemModifier[];
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  items: OrderItem[];
  status: OrderStatus;
  orderType: OrderType | string;
  subtotal: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  customerId?: string;
  customerName?: string;
  notes?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}
