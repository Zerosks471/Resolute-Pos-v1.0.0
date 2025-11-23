import { createAction, props } from '@ngrx/store';
import { Order } from '../../models';

export const loadOrders = createAction('[Orders] Load Orders');

export const loadOrdersSuccess = createAction(
  '[Orders] Load Orders Success',
  props<{ orders: Order[] }>()
);

export const loadOrdersFailure = createAction(
  '[Orders] Load Orders Failure',
  props<{ error: string }>()
);

export const createOrder = createAction(
  '[Orders] Create Order',
  props<{ order: Partial<Order> }>()
);

export const createOrderSuccess = createAction(
  '[Orders] Create Order Success',
  props<{ order: Order }>()
);

export const createOrderFailure = createAction(
  '[Orders] Create Order Failure',
  props<{ error: string }>()
);

export const updateOrderStatus = createAction(
  '[Orders] Update Order Status',
  props<{ orderId: string; status: string }>()
);

export const updateOrderStatusSuccess = createAction(
  '[Orders] Update Order Status Success',
  props<{ order: Order }>()
);

export const newOrderReceived = createAction(
  '[Orders/Socket] New Order Received',
  props<{ order: Order }>()
);

export const orderUpdated = createAction(
  '[Orders/Socket] Order Updated',
  props<{ order: Order }>()
);
