import { ordersReducer, initialState } from './orders.reducer';
import * as OrdersActions from './orders.actions';
import { Order, OrderStatus } from '../../models';

describe('Orders Reducer', () => {
  it('should return initial state', () => {
    const action = { type: 'Unknown' };
    const result = ordersReducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it('should load orders successfully', () => {
    const orders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD001',
        tableNumber: '5',
        items: [],
        status: OrderStatus.PENDING,
        orderType: 'dine_in',
        subtotal: 25.0,
        tax: 2.0,
        tip: 5.0,
        discount: 0,
        total: 32.0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user1',
      },
    ];
    const action = OrdersActions.loadOrdersSuccess({ orders });
    const result = ordersReducer(initialState, action);

    expect(result.ids.length).toBe(1);
    expect(result.entities['1']).toEqual(orders[0]);
    expect(result.loaded).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle load orders failure', () => {
    const error = 'Failed to load orders';
    const action = OrdersActions.loadOrdersFailure({ error });
    const result = ordersReducer(initialState, action);

    expect(result.loaded).toBe(false);
    expect(result.error).toBe(error);
  });

  it('should add order on create success', () => {
    const order: Order = {
      id: '2',
      orderNumber: 'ORD002',
      tableNumber: '3',
      items: [],
      status: OrderStatus.PENDING,
      orderType: 'dine_in',
      subtotal: 15.0,
      tax: 1.5,
      tip: 0,
      discount: 0,
      total: 16.5,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user2',
    };
    const action = OrdersActions.createOrderSuccess({ order });
    const result = ordersReducer(initialState, action);

    expect(result.ids.length).toBe(1);
    expect(result.entities['2']).toEqual(order);
  });

  it('should update order on status update', () => {
    const existingOrder: Order = {
      id: '1',
      orderNumber: 'ORD001',
      tableNumber: '5',
      items: [],
      status: OrderStatus.PENDING,
      orderType: 'dine_in',
      subtotal: 25.0,
      tax: 2.0,
      tip: 5.0,
      discount: 0,
      total: 32.0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user1',
    };

    const stateWithOrder = ordersReducer(
      initialState,
      OrdersActions.createOrderSuccess({ order: existingOrder })
    );

    const updatedOrder: Order = {
      ...existingOrder,
      status: OrderStatus.PREPARING,
    };

    const action = OrdersActions.updateOrderStatusSuccess({ order: updatedOrder });
    const result = ordersReducer(stateWithOrder, action);

    expect(result.entities['1']?.status).toBe(OrderStatus.PREPARING);
  });

  it('should add order on socket new order received', () => {
    const order: Order = {
      id: '3',
      orderNumber: 'ORD003',
      tableNumber: '7',
      items: [],
      status: OrderStatus.PENDING,
      orderType: 'dine_in',
      subtotal: 30.0,
      tax: 3.0,
      tip: 0,
      discount: 0,
      total: 33.0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user3',
    };
    const action = OrdersActions.newOrderReceived({ order });
    const result = ordersReducer(initialState, action);

    expect(result.ids.length).toBe(1);
    expect(result.entities['3']).toEqual(order);
  });

  it('should update order on socket order updated', () => {
    const existingOrder: Order = {
      id: '1',
      orderNumber: 'ORD001',
      tableNumber: '5',
      items: [],
      status: OrderStatus.PENDING,
      orderType: 'dine_in',
      subtotal: 25.0,
      tax: 2.0,
      tip: 5.0,
      discount: 0,
      total: 32.0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user1',
    };

    const stateWithOrder = ordersReducer(
      initialState,
      OrdersActions.newOrderReceived({ order: existingOrder })
    );

    const updatedOrder: Order = {
      ...existingOrder,
      status: OrderStatus.READY,
    };

    const action = OrdersActions.orderUpdated({ order: updatedOrder });
    const result = ordersReducer(stateWithOrder, action);

    expect(result.entities['1']?.status).toBe(OrderStatus.READY);
  });
});
