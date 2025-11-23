import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as OrdersActions from './orders.actions';
import { Order } from '../../models';

export interface OrdersState extends EntityState<Order> {
  loaded: boolean;
  error: string | null;
}

export const ordersAdapter: EntityAdapter<Order> = createEntityAdapter<Order>();

export const initialState: OrdersState = ordersAdapter.getInitialState({
  loaded: false,
  error: null,
});

export const ordersReducer = createReducer(
  initialState,
  on(OrdersActions.loadOrders, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(OrdersActions.loadOrdersSuccess, (state, { orders }) =>
    ordersAdapter.setAll(orders, { ...state, loaded: true })
  ),
  on(OrdersActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    error,
    loaded: false,
  })),
  on(OrdersActions.createOrderSuccess, (state, { order }) =>
    ordersAdapter.addOne(order, state)
  ),
  on(OrdersActions.updateOrderStatusSuccess, (state, { order }) =>
    ordersAdapter.updateOne({ id: order.id, changes: order }, state)
  ),
  on(OrdersActions.newOrderReceived, (state, { order }) =>
    ordersAdapter.addOne(order, state)
  ),
  on(OrdersActions.orderUpdated, (state, { order }) =>
    ordersAdapter.updateOne({ id: order.id, changes: order }, state)
  )
);
