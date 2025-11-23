import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { OrdersEffects } from './orders.effects';
import * as OrdersActions from './orders.actions';
import { OrdersApiService } from '../../services/orders-api.service';

describe('OrdersEffects', () => {
  let actions$: Observable<any>;
  let effects: OrdersEffects;
  let ordersApiService: jest.Mocked<OrdersApiService>;

  beforeEach(() => {
    const apiServiceMock = {
      getOrders: jest.fn(),
      createOrder: jest.fn(),
      updateOrderStatus: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        OrdersEffects,
        provideMockActions(() => actions$),
        { provide: OrdersApiService, useValue: apiServiceMock },
      ],
    });

    effects = TestBed.inject(OrdersEffects);
    ordersApiService = TestBed.inject(
      OrdersApiService
    ) as jest.Mocked<OrdersApiService>;
  });

  it('should load orders successfully', (done) => {
    const orders = [{ id: '1', orderNumber: 'ORD001' }] as any;
    ordersApiService.getOrders.mockReturnValue(of({ success: true, data: orders }));

    actions$ = of(OrdersActions.loadOrders());

    effects.loadOrders$.subscribe((action: any) => {
      expect(action).toEqual(OrdersActions.loadOrdersSuccess({ orders }));
      done();
    });
  });

  it('should handle load orders failure', (done) => {
    const error = new Error('Network error');
    ordersApiService.getOrders.mockReturnValue(throwError(() => error));

    actions$ = of(OrdersActions.loadOrders());

    effects.loadOrders$.subscribe((action: any) => {
      expect(action).toEqual(OrdersActions.loadOrdersFailure({ error: 'Network error' }));
      done();
    });
  });

  it('should create order successfully', (done) => {
    const order = { tableNumber: '5', items: [] } as any;
    const createdOrder = { id: '1', ...order } as any;
    ordersApiService.createOrder.mockReturnValue(of({ success: true, data: createdOrder }));

    actions$ = of(OrdersActions.createOrder({ order }));

    effects.createOrder$.subscribe((action: any) => {
      expect(action).toEqual(OrdersActions.createOrderSuccess({ order: createdOrder }));
      done();
    });
  });

  it('should handle create order failure', (done) => {
    const order = { tableNumber: '5', items: [] } as any;
    const error = new Error('Failed to create order');
    ordersApiService.createOrder.mockReturnValue(throwError(() => error));

    actions$ = of(OrdersActions.createOrder({ order }));

    effects.createOrder$.subscribe((action: any) => {
      expect(action).toEqual(OrdersActions.createOrderFailure({ error: 'Failed to create order' }));
      done();
    });
  });

  it('should update order status successfully', (done) => {
    const updatedOrder = { id: '1', status: 'completed' } as any;
    ordersApiService.updateOrderStatus.mockReturnValue(of({ success: true, data: updatedOrder }));

    actions$ = of(OrdersActions.updateOrderStatus({ orderId: '1', status: 'completed' }));

    effects.updateOrderStatus$.subscribe((action: any) => {
      expect(action).toEqual(OrdersActions.updateOrderStatusSuccess({ order: updatedOrder }));
      done();
    });
  });

  it('should handle update order status failure', (done) => {
    const error = new Error('Failed to update status');
    ordersApiService.updateOrderStatus.mockReturnValue(throwError(() => error));

    actions$ = of(OrdersActions.updateOrderStatus({ orderId: '1', status: 'completed' }));

    effects.updateOrderStatus$.subscribe((action: any) => {
      expect(action).toEqual(OrdersActions.loadOrdersFailure({ error: 'Failed to update status' }));
      done();
    });
  });
});
