import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as OrdersActions from './orders.actions';
import { OrdersApiService } from '../../services/orders-api.service';

@Injectable()
export class OrdersEffects {
  private actions$ = inject(Actions);
  private ordersApi = inject(OrdersApiService);

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrders),
      switchMap(() =>
        this.ordersApi.getOrders().pipe(
          map((response) =>
            OrdersActions.loadOrdersSuccess({ orders: response.data || [] })
          ),
          catchError((error) =>
            of(OrdersActions.loadOrdersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.createOrder),
      switchMap(({ order }) =>
        this.ordersApi.createOrder(order).pipe(
          map((response) =>
            OrdersActions.createOrderSuccess({ order: response.data! })
          ),
          catchError((error) =>
            of(OrdersActions.createOrderFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrderStatus),
      switchMap(({ orderId, status }) =>
        this.ordersApi.updateOrderStatus(orderId, status).pipe(
          map((response) =>
            OrdersActions.updateOrderStatusSuccess({ order: response.data! })
          ),
          catchError((error) =>
            of(OrdersActions.loadOrdersFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
