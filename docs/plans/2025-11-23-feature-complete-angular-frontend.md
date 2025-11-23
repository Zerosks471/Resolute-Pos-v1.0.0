# Feature-Complete Angular Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build complete feature-rich Angular frontend for Resolute POS with 5 applications (pos-staff, kitchen-display, pos-kiosk, admin-dashboard, customer-web) including offline sync, payment terminals, and delivery platform integration.

**Architecture:** Nx monorepo with 5 standalone Angular 20 apps sharing common libraries (ui-components, data-access, auth, offline-sync, payment). Material Design 3 UI, NgRx state management, offline-first PWA, real-time Socket.IO updates. Foundation already complete (workspace, routing, basic auth, API client, Socket.IO service).

**Tech Stack:** Angular 20, Nx, Material Design 3, NgRx, IndexedDB, Socket.IO, Jest, Cypress, TypeScript

---

## Overview

This plan implements the complete feature set defined in `docs/plans/2025-11-23-feature-complete-frontend-implementation-scope.md`. The foundation (workspace setup, basic libraries) is already complete. This plan focuses on building the actual features.

**Estimated Timeline:** 24 weeks (6 months)

**Current State:**
- ✅ Nx workspace with Angular 20
- ✅ Material Design 3 configured
- ✅ PWA setup
- ✅ NgRx app state
- ✅ Basic routing
- ✅ PIN login UI (needs backend integration)
- ✅ Foundation libraries (auth, data-access, offline-sync, payment, ui-components)
- ✅ API client service
- ✅ Socket.IO service

**What This Plan Builds:**
- Complete shared UI components library
- Complete NgRx feature stores (orders, menu, tables, customers)
- Full authentication flow with backend
- Complete POS staff app (dashboard, ordering, tables, payments)
- Complete kitchen display app
- Complete customer kiosk app
- Complete admin dashboard app
- Complete customer web app
- Offline sync implementation
- Payment terminal integration
- Delivery platform integration
- Complete test suites

---

## Phase 1: Foundation & Shared Components (Weeks 1-2)

### Task 1: Create Reusable Button Components

**Files:**
- Create: `frontend-angular/libs/ui-components/src/lib/button/button.component.ts`
- Create: `frontend-angular/libs/ui-components/src/lib/button/button.component.spec.ts`

**Step 1: Write test for primary button**

Create file: `frontend-angular/libs/ui-components/src/lib/button/button.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should render primary button', () => {
    component.variant = 'primary';
    component.label = 'Click me';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Click me');
    expect(button.classList.contains('mat-raised-button')).toBe(true);
  });

  it('should emit click event', () => {
    spyOn(component.clicked, 'emit');
    component.onClick();
    expect(component.clicked.emit).toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend-angular && npx nx test ui-components --testFile=button.component.spec.ts`
Expected: FAIL - ButtonComponent not found

**Step 3: Create button component**

Create file: `frontend-angular/libs/ui-components/src/lib/button/button.component.ts`

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'resolute-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClass()"
      (click)="onClick()"
    >
      @if (loading) {
        <mat-spinner diameter="20"></mat-spinner>
      } @else {
        <ng-content></ng-content>
        {{ label }}
      }
    </button>
  `,
  styles: [`
    button {
      min-width: 120px;
      position: relative;
    }
    mat-spinner {
      display: inline-block;
      margin: 0 auto;
    }
  `],
})
export class ButtonComponent {
  @Input() label = '';
  @Input() variant: 'primary' | 'secondary' | 'text' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<void>();

  getButtonClass(): string {
    switch (this.variant) {
      case 'primary':
        return 'mat-raised-button mat-primary';
      case 'secondary':
        return 'mat-raised-button';
      case 'text':
        return 'mat-button';
    }
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd frontend-angular && npx nx test ui-components --testFile=button.component.spec.ts`
Expected: PASS - All tests passing

**Step 5: Export from ui-components library**

Modify: `frontend-angular/libs/ui-components/src/index.ts`

```typescript
export * from './lib/button/button.component';
```

**Step 6: Commit**

```bash
git add libs/ui-components/
git commit -m "$(cat <<'EOF'
feat: add reusable button component

- Create ButtonComponent with primary, secondary, text variants
- Support loading state with spinner
- Support disabled state
- Emit click events
- Add unit tests

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Create Card Component

**Files:**
- Create: `frontend-angular/libs/ui-components/src/lib/card/card.component.ts`
- Create: `frontend-angular/libs/ui-components/src/lib/card/card.component.spec.ts`

**Step 1: Write test for card component**

Create file: `frontend-angular/libs/ui-components/src/lib/card/card.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should render card with title', () => {
    component.title = 'Test Card';
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toContain('Test Card');
  });

  it('should render card content', () => {
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('mat-card-content');
    expect(content).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend-angular && npx nx test ui-components --testFile=card.component.spec.ts`
Expected: FAIL - CardComponent not found

**Step 3: Create card component**

Create file: `frontend-angular/libs/ui-components/src/lib/card/card.component.ts`

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'resolute-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card [class.elevated]="elevated">
      @if (title) {
        <mat-card-header>
          <mat-card-title>{{ title }}</mat-card-title>
          @if (subtitle) {
            <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
          }
        </mat-card-header>
      }
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
      @if (hasActions) {
        <mat-card-actions>
          <ng-content select="[card-actions]"></ng-content>
        </mat-card-actions>
      }
    </mat-card>
  `,
  styles: [`
    mat-card.elevated {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `],
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() elevated = false;
  @Input() hasActions = false;
}
```

**Step 4: Run test to verify it passes**

Run: `cd frontend-angular && npx nx test ui-components --testFile=card.component.spec.ts`
Expected: PASS

**Step 5: Export from library**

Modify: `frontend-angular/libs/ui-components/src/index.ts`

```typescript
export * from './lib/button/button.component';
export * from './lib/card/card.component';
```

**Step 6: Commit**

```bash
git add libs/ui-components/
git commit -m "feat: add reusable card component

- Create CardComponent with Material Design 3
- Support title and subtitle
- Support elevated variant
- Support action buttons
- Add unit tests

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Create Orders NgRx Feature Store

**Files:**
- Create: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.actions.ts`
- Create: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.reducer.ts`
- Create: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.selectors.ts`
- Create: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.effects.ts`
- Create: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.reducer.spec.ts`

**Step 1: Write test for orders reducer**

Create file: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.reducer.spec.ts`

```typescript
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
        subtotal: 25.00,
        tax: 2.00,
        tip: 5.00,
        discount: 0,
        total: 32.00,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user1'
      }
    ];
    const action = OrdersActions.loadOrdersSuccess({ orders });
    const result = ordersReducer(initialState, action);

    expect(result.orders.length).toBe(1);
    expect(result.loaded).toBe(true);
    expect(result.error).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend-angular && npx nx test data-access --testFile=orders.reducer.spec.ts`
Expected: FAIL - modules not found

**Step 3: Create orders actions**

Create file: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.actions.ts`

```typescript
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
```

**Step 4: Create orders reducer**

Create file: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.reducer.ts`

```typescript
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
```

**Step 5: Run test to verify it passes**

Run: `cd frontend-angular && npx nx test data-access --testFile=orders.reducer.spec.ts`
Expected: PASS

**Step 6: Create selectors**

Create file: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.selectors.ts`

```typescript
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
```

**Step 7: Export from data-access library**

Modify: `frontend-angular/libs/data-access/src/index.ts`

Add:
```typescript
export * from './lib/+state/orders/orders.actions';
export * from './lib/+state/orders/orders.reducer';
export * from './lib/+state/orders/orders.selectors';
```

**Step 8: Commit**

```bash
git add libs/data-access/
git commit -m "feat: add orders NgRx feature store

- Create orders actions (load, create, update status)
- Create orders reducer with EntityAdapter
- Create orders selectors (all, by id, by table, active)
- Support Socket.IO real-time updates
- Add unit tests for reducer

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Create Orders Effects for API Integration

**Files:**
- Create: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.effects.ts`
- Create: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.effects.spec.ts`
- Create: `frontend-angular/libs/data-access/src/lib/services/orders-api.service.ts`

**Step 1: Write test for orders effects**

Create file: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.effects.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { OrdersEffects } from './orders.effects';
import * as OrdersActions from './orders.actions';
import { OrdersApiService } from '../../services/orders-api.service';

describe('OrdersEffects', () => {
  let actions$: Observable<any>;
  let effects: OrdersEffects;
  let ordersApiService: jasmine.SpyObj<OrdersApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('OrdersApiService', [
      'getOrders',
      'createOrder',
      'updateOrderStatus',
    ]);

    TestBed.configureTestingModule({
      providers: [
        OrdersEffects,
        provideMockActions(() => actions$),
        { provide: OrdersApiService, useValue: apiServiceSpy },
      ],
    });

    effects = TestBed.inject(OrdersEffects);
    ordersApiService = TestBed.inject(
      OrdersApiService
    ) as jasmine.SpyObj<OrdersApiService>;
  });

  it('should load orders successfully', (done) => {
    const orders = [{ id: '1', orderNumber: 'ORD001' }] as any;
    ordersApiService.getOrders.and.returnValue(of({ success: true, data: orders }));

    actions$ = of(OrdersActions.loadOrders());

    effects.loadOrders$.subscribe((action) => {
      expect(action).toEqual(OrdersActions.loadOrdersSuccess({ orders }));
      done();
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend-angular && npx nx test data-access --testFile=orders.effects.spec.ts`
Expected: FAIL - modules not found

**Step 3: Create orders API service**

Create file: `frontend-angular/libs/data-access/src/lib/services/orders-api.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { Order } from '../models';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  private apiClient = inject(ApiClientService);

  getOrders(): Observable<ApiResponse<Order[]>> {
    return this.apiClient.get<ApiResponse<Order[]>>('/orders');
  }

  getOrderById(id: string): Observable<ApiResponse<Order>> {
    return this.apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
  }

  createOrder(order: Partial<Order>): Observable<ApiResponse<Order>> {
    return this.apiClient.post<ApiResponse<Order>>('/orders', order);
  }

  updateOrderStatus(
    orderId: string,
    status: string
  ): Observable<ApiResponse<Order>> {
    return this.apiClient.put<ApiResponse<Order>>(`/orders/${orderId}/status`, {
      status,
    });
  }

  getOrdersByTable(tableNumber: string): Observable<ApiResponse<Order[]>> {
    return this.apiClient.get<ApiResponse<Order[]>>(
      `/orders/table/${tableNumber}`
    );
  }
}
```

**Step 4: Create orders effects**

Create file: `frontend-angular/libs/data-access/src/lib/+state/orders/orders.effects.ts`

```typescript
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
            OrdersActions.loadOrdersSuccess({ orders: response.data })
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
            OrdersActions.createOrderSuccess({ order: response.data })
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
            OrdersActions.updateOrderStatusSuccess({ order: response.data })
          ),
          catchError((error) =>
            of(OrdersActions.loadOrdersFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
```

**Step 5: Run test to verify it passes**

Run: `cd frontend-angular && npx nx test data-access --testFile=orders.effects.spec.ts`
Expected: PASS

**Step 6: Export effects and API service**

Modify: `frontend-angular/libs/data-access/src/index.ts`

Add:
```typescript
export * from './lib/+state/orders/orders.effects';
export * from './lib/services/orders-api.service';
```

**Step 7: Commit**

```bash
git add libs/data-access/
git commit -m "feat: add orders effects and API service

- Create OrdersEffects for async operations
- Create OrdersApiService for backend communication
- Handle load, create, and update operations
- Add error handling with catchError
- Add unit tests for effects

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Phase 2: POS Staff Application (Weeks 3-6)

### Task 5: Integrate Authentication with Backend

**Files:**
- Modify: `frontend-angular/libs/auth/src/lib/services/auth.service.ts`
- Create: `frontend-angular/libs/auth/src/lib/services/auth.service.spec.ts`

**Step 1: Write test for PIN login with backend**

Create file: `frontend-angular/libs/auth/src/lib/services/auth.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ApiClientService } from '@resolute-pos/data-access';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, ApiClientService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login with PIN successfully', (done) => {
    const mockResponse = {
      success: true,
      data: {
        user: {
          id: '1',
          name: 'John Doe',
          role: 'waiter',
          scopes: ['pos:order', 'tables:view'],
        },
      },
    };

    service.loginWithPin('1234').subscribe((response) => {
      expect(response.success).toBe(true);
      expect(response.data.user.name).toBe('John Doe');
      done();
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/auth/pin-login')
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ pin: '1234' });
    req.flush(mockResponse);
  });

  it('should handle login failure', (done) => {
    const mockError = {
      success: false,
      message: 'Invalid PIN',
    };

    service.loginWithPin('0000').subscribe(
      () => fail('should have failed'),
      (error) => {
        expect(error).toBeTruthy();
        done();
      }
    );

    const req = httpMock.expectOne((request) =>
      request.url.includes('/auth/pin-login')
    );
    req.flush(mockError, { status: 401, statusText: 'Unauthorized' });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend-angular && npx nx test auth --testFile=auth.service.spec.ts`
Expected: FAIL - method not implemented

**Step 3: Update auth service with backend integration**

Modify: `frontend-angular/libs/auth/src/lib/services/auth.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiClientService } from '@resolute-pos/data-access';
import { User, PinLoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiClient = inject(ApiClientService);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);

  loginWithPin(pin: string): Observable<PinLoginResponse> {
    return this.apiClient
      .post<PinLoginResponse>('/auth/pin-login', { pin })
      .pipe(
        tap((response) => {
          if (response.success && response.data?.user) {
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticated$.next(true);
            // Store user in session storage for persistence
            sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
          }
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticated$.next(false);
    sessionStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasScope(scope: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    // Admin bypasses all scope checks
    if (user.role === 'admin') return true;
    return user.scopes?.includes(scope) || false;
  }

  // Restore user from session storage on app init
  restoreSession(): void {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUserSubject.next(user);
        this.isAuthenticated$.next(true);
      } catch (e) {
        console.error('Failed to restore session', e);
        this.logout();
      }
    }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd frontend-angular && npx nx test auth --testFile=auth.service.spec.ts`
Expected: PASS

**Step 5: Update login component to use integrated auth service**

Modify: `frontend-angular/apps/pos-staff/src/app/pages/login/login.component.ts`

Change the submit method:

```typescript
async submit(): Promise<void> {
  if (!this.canSubmit() || this.isLoading) return;

  this.isLoading = true;
  this.errorMessage = null;

  try {
    const response = await this.authService.loginWithPin(this.pin).toPromise();

    if (response && response.success) {
      this.pin = '';
      await this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = response?.message || 'Invalid PIN. Please try again.';
      this.pin = '';
    }
  } catch (error: any) {
    this.errorMessage = error.error?.message || 'Invalid PIN. Please try again.';
    this.pin = '';
  } finally {
    this.isLoading = false;
  }
}
```

**Step 6: Commit**

```bash
git add libs/auth/ apps/pos-staff/
git commit -m "feat: integrate authentication with backend API

- Update AuthService to call backend PIN login endpoint
- Store user in session storage for persistence
- Add session restoration on app init
- Update login component to handle API responses
- Add comprehensive unit tests
- Add error handling for failed login

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: Create Dashboard Real-Time Metrics

**Files:**
- Create: `frontend-angular/apps/pos-staff/src/app/pages/dashboard/dashboard.component.ts` (replace placeholder)
- Create: `frontend-angular/apps/pos-staff/src/app/pages/dashboard/dashboard.component.spec.ts`
- Create: `frontend-angular/libs/data-access/src/lib/services/dashboard-api.service.ts`

**Step 1: Write test for dashboard component**

Create file: `frontend-angular/apps/pos-staff/src/app/pages/dashboard/dashboard.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardApiService } from '@resolute-pos/data-access';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: jasmine.SpyObj<DashboardApiService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('DashboardApiService', [
      'getTodaysMetrics',
    ]);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: DashboardApiService, useValue: serviceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(
      DashboardApiService
    ) as jasmine.SpyObj<DashboardApiService>;
  });

  it('should load todays metrics on init', () => {
    const mockMetrics = {
      totalSales: 1250.50,
      orderCount: 42,
      activeTables: 8,
      kitchenQueue: 3,
    };

    dashboardService.getTodaysMetrics.and.returnValue(
      of({ success: true, data: mockMetrics })
    );

    component.ngOnInit();

    expect(dashboardService.getTodaysMetrics).toHaveBeenCalled();
    expect(component.metrics).toEqual(mockMetrics);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend-angular && npx nx test pos-staff --testFile=dashboard.component.spec.ts`
Expected: FAIL - component not implemented

**Step 3: Create dashboard API service**

Create file: `frontend-angular/libs/data-access/src/lib/services/dashboard-api.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';

export interface DashboardMetrics {
  totalSales: number;
  orderCount: number;
  activeTables: number;
  kitchenQueue: number;
  avgTicket?: number;
  comparedToYesterday?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private apiClient = inject(ApiClientService);

  getTodaysMetrics(): Observable<ApiResponse<DashboardMetrics>> {
    return this.apiClient.get<ApiResponse<DashboardMetrics>>(
      '/dashboard/metrics'
    );
  }
}
```

**Step 4: Create dashboard component**

Modify: `frontend-angular/apps/pos-staff/src/app/pages/dashboard/dashboard.component.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardApiService, DashboardMetrics } from '@resolute-pos/data-access';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="dashboard-container">
      <h1>POS Dashboard</h1>

      <div class="metrics-grid">
        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon>attach_money</mat-icon>
            <mat-card-title>Today's Sales</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">\${{ metrics.totalSales | number:'1.2-2' }}</div>
            @if (metrics.comparedToYesterday) {
              <div class="metric-change" [class.positive]="metrics.comparedToYesterday > 0">
                {{ metrics.comparedToYesterday > 0 ? '+' : '' }}{{ metrics.comparedToYesterday }}%
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon>receipt</mat-icon>
            <mat-card-title>Orders</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">{{ metrics.orderCount }}</div>
            @if (metrics.avgTicket) {
              <div class="metric-subtitle">Avg: \${{ metrics.avgTicket | number:'1.2-2' }}</div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon>table_restaurant</mat-icon>
            <mat-card-title>Active Tables</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">{{ metrics.activeTables }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon>kitchen</mat-icon>
            <mat-card-title>Kitchen Queue</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">{{ metrics.kitchenQueue }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/pos">
            <mat-icon>point_of_sale</mat-icon>
            New Order
          </button>
          <button mat-raised-button routerLink="/orders">
            <mat-icon>list</mat-icon>
            View Orders
          </button>
          <button mat-raised-button routerLink="/tables">
            <mat-icon>table_restaurant</mat-icon>
            Manage Tables
          </button>
          <button mat-raised-button routerLink="/menu">
            <mat-icon>restaurant_menu</mat-icon>
            Menu
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 24px;
      color: var(--mat-sys-on-surface);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .metric-card mat-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .metric-card mat-icon {
      color: var(--mat-sys-primary);
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .metric-value {
      font-size: 36px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .metric-change {
      font-size: 14px;
      color: var(--mat-sys-error);
    }

    .metric-change.positive {
      color: var(--mat-sys-tertiary);
    }

    .metric-subtitle {
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
    }

    .quick-actions h2 {
      margin-bottom: 16px;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `],
})
export class DashboardComponent implements OnInit {
  private dashboardApi = inject(DashboardApiService);

  metrics: DashboardMetrics = {
    totalSales: 0,
    orderCount: 0,
    activeTables: 0,
    kitchenQueue: 0,
  };

  ngOnInit(): void {
    this.loadMetrics();
    // Refresh metrics every 30 seconds
    setInterval(() => this.loadMetrics(), 30000);
  }

  private loadMetrics(): void {
    this.dashboardApi.getTodaysMetrics().subscribe({
      next: (response) => {
        if (response.success) {
          this.metrics = response.data;
        }
      },
      error: (error) => {
        console.error('Failed to load dashboard metrics', error);
      },
    });
  }
}
```

**Step 5: Run test to verify it passes**

Run: `cd frontend-angular && npx nx test pos-staff --testFile=dashboard.component.spec.ts`
Expected: PASS

**Step 6: Export dashboard API service**

Modify: `frontend-angular/libs/data-access/src/index.ts`

Add:
```typescript
export * from './lib/services/dashboard-api.service';
```

**Step 7: Commit**

```bash
git add apps/pos-staff/ libs/data-access/
git commit -m "feat: create dashboard with real-time metrics

- Create DashboardComponent with Material Design 3 cards
- Display sales, orders, tables, kitchen queue metrics
- Create DashboardApiService for backend integration
- Auto-refresh metrics every 30 seconds
- Add quick action buttons for navigation
- Add unit tests

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## NOTE: Comprehensive Plan Continuation

**The plan above demonstrates the task structure and approach. A complete plan would continue with:**

**Phase 2 Continued: POS Staff Application**
- Task 7-15: Complete POS ordering flow (menu browsing, cart, customization)
- Task 16-20: Table management (floor plan, status tracking)
- Task 21-30: Payment processing (split bills, terminal integration)

**Phase 3: Kitchen Display (Tasks 31-40)**
- Real-time order cards
- Station filtering
- Order status tracking
- Touch-optimized UI

**Phase 4: Customer Kiosk (Tasks 41-55)**
- Welcome and onboarding
- Guided ordering wizard
- Touch optimization
- Payment integration

**Phase 5: Admin Dashboard (Tasks 56-75)**
- Reports (sales, operational, financial)
- Inventory management
- User management
- Settings configuration

**Phase 6: Customer Web App (Tasks 76-90)**
- Online ordering
- Order tracking
- Account features
- Loyalty integration

**Phase 7: Advanced Features (Tasks 91-110)**
- Offline sync with IndexedDB
- Payment terminal integration (Dejavoo/PAX)
- Delivery platform integration
- Complete loyalty program

**Phase 8: Testing & Polish (Tasks 111-120)**
- E2E test suites
- Performance optimization
- Accessibility compliance
- Documentation

**Total Estimated Tasks:** 120+ bite-sized tasks

---

## Execution Strategy

Given the scope (120+ tasks over 24 weeks), recommend:

**Option 1: Phased Execution**
- Complete Phase 1-2 first (Foundation + POS Staff)
- Deploy for testing
- Gather feedback
- Continue with remaining phases

**Option 2: Parallel Development**
- Multiple developers work on different apps simultaneously
- Use git worktrees for isolation
- Regular integration points

**Option 3: MVP First**
- Focus on core order flow (POS → Kitchen → Payment)
- Deploy minimal viable product
- Add remaining features iteratively

---

## Next Steps

1. Review this plan structure
2. Decide on execution approach (phased, parallel, or MVP)
3. If continuing with full plan, I can generate the remaining 114 tasks following the same structure
4. Alternatively, I can create separate focused plans for each phase

**Would you like me to:**
- A) Continue writing all 120+ tasks in this plan
- B) Create separate plans for each phase
- C) Start execution with the tasks above (Phase 1 foundation)
- D) Modify the approach
