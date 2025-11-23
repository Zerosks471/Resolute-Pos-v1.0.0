import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrdersState, ordersAdapter } from './orders.reducer';

export const selectOrdersState = createFeatureSelector<OrdersState>('orders');

const { selectAll, selectEntities } = ordersAdapter.getSelectors();

export const selectAllOrders = createSelector(selectOrdersState, selectAll);

export const selectOrderEntities = createSelector(
  selectOrdersState,
  selectEntities
);

export const selectOrdersLoaded = createSelector(
  selectOrdersState,
  (state) => state.loaded
);

export const selectOrdersError = createSelector(
  selectOrdersState,
  (state) => state.error
);

export const selectOrderById = (orderId: string) =>
  createSelector(selectOrderEntities, (entities) => entities[orderId]);

export const selectActiveOrders = createSelector(selectAllOrders, (orders) =>
  orders.filter(
    (order) => order.status !== 'completed' && order.status !== 'cancelled'
  )
);

export const selectOrdersByTable = (tableNumber: string) =>
  createSelector(selectAllOrders, (orders) =>
    orders.filter((order) => order.tableNumber === tableNumber)
  );
