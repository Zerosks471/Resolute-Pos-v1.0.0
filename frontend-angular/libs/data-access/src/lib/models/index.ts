// Export socket events
// Note: OrderItem from socket-events is re-exported from order.model
export {
  OrderEvent,
  KitchenDisplayEvent,
  TableUpdateEvent,
  PaymentEvent,
  SocketEvents,
  OrderItem as BaseOrderItem, // Export as BaseOrderItem to avoid conflicts
} from './socket-events.model';

// Export order models including the extended OrderItem
export * from './order.model';

// Export menu item models
export * from './menu-item.model';
