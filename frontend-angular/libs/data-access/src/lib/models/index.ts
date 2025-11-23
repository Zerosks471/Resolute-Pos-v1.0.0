// Export socket events
// Note: OrderItem from socket-events is re-exported from order.model
export type {
  OrderEvent,
  KitchenDisplayEvent,
  TableUpdateEvent,
  PaymentEvent,
  SocketEvents,
} from './socket-events.model';
export type { OrderItem as BaseOrderItem } from './socket-events.model';

// Export order models including the extended OrderItem
export * from './order.model';

// Export menu item models
export * from './menu-item.model';
