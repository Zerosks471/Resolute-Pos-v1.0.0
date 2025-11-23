# Angular Workspace Setup - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up the foundational Angular workspace with Nx monorepo, Material Design 3, PWA capabilities, and testing infrastructure for the Resolute POS Angular frontend rebuild.

**Architecture:** Nx workspace with multiple Angular applications (pos-staff, pos-kiosk, kitchen-display, admin-dashboard, customer-web) sharing common libraries (ui-components, data-access, auth, offline-sync, payment). PWA-first with service workers, NgRx state management, and IndexedDB for offline storage.

**Tech Stack:** Angular 18+, Nx, Angular Material (MD3), NgRx, IndexedDB, Socket.IO client, RxJS, Jest, Cypress

---

## Task 1: Initialize Nx Workspace

**Files:**
- Create: `frontend-angular/` (new directory)
- Create: `frontend-angular/nx.json`
- Create: `frontend-angular/package.json`
- Create: `frontend-angular/.gitignore`

**Step 1: Create git worktree for isolated development**

Run: `git worktree add .worktrees/angular-frontend-rebuild angular-frontend-rebuild 2>/dev/null || git worktree add .worktrees/angular-frontend-rebuild -b angular-frontend-rebuild`
Expected: New worktree created at `.worktrees/angular-frontend-rebuild`

**Step 2: Change to worktree directory**

Run: `cd .worktrees/angular-frontend-rebuild`
Expected: Working directory is now the worktree

**Step 3: Initialize Nx workspace**

Run: `npx create-nx-workspace@latest frontend-angular --preset=angular-monorepo --appName=pos-staff --style=scss --nxCloud=false --packageManager=npm`
Expected: Nx workspace created with initial Angular app

**Step 4: Verify workspace structure**

Run: `ls -la frontend-angular/`
Expected: Should see `apps/`, `libs/`, `nx.json`, `package.json`, `tsconfig.base.json`

**Step 5: Commit workspace initialization**

```bash
git add frontend-angular/
git commit -m "$(cat <<'EOF'
feat: initialize Nx workspace for Angular frontend

- Create Nx monorepo with Angular preset
- Initial pos-staff application
- Configure npm as package manager
- Set SCSS as default styling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

Run: `git log -1 --oneline`
Expected: Commit created with message starting with "feat: initialize Nx workspace"

---

## Task 2: Install Angular Material with Material Design 3

**Files:**
- Modify: `frontend-angular/package.json`
- Create: `frontend-angular/apps/pos-staff/src/styles.scss`
- Create: `frontend-angular/libs/ui-components/src/lib/themes/m3-theme.scss`

**Step 1: Install Angular Material**

Run: `cd frontend-angular && npm install @angular/material@18 @angular/cdk@18 @angular/animations@18`
Expected: Packages installed successfully

**Step 2: Create shared UI components library**

Run: `npx nx g @nx/angular:library ui-components --directory=libs/ui-components --importPath=@resolute-pos/ui-components --style=scss --no-interactive`
Expected: Library created at `libs/ui-components/`

**Step 3: Create Material Design 3 theme file**

Create file: `frontend-angular/libs/ui-components/src/lib/themes/m3-theme.scss`

```scss
@use '@angular/material' as mat;

// Material Design 3 theme configuration
$resolute-primary: mat.define-palette(mat.$blue-palette, 600);
$resolute-accent: mat.define-palette(mat.$green-palette, 500);
$resolute-warn: mat.define-palette(mat.$red-palette, 500);

// Create Material Design 3 theme
$resolute-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: $resolute-primary,
    accent: $resolute-accent,
    warn: $resolute-warn,
  ),
  typography: (
    brand-family: 'Roboto, sans-serif',
    plain-family: 'Roboto, sans-serif',
  ),
  density: (
    scale: 0,
  ),
));

// Dark theme variant
$resolute-dark-theme: mat.define-theme((
  color: (
    theme-type: dark,
    primary: $resolute-primary,
    accent: $resolute-accent,
    warn: $resolute-warn,
  ),
));

// Apply theme
@include mat.all-component-themes($resolute-theme);

// Dark mode support
.dark-theme {
  @include mat.all-component-colors($resolute-dark-theme);
}
```

**Step 4: Import theme in main styles**

Modify: `frontend-angular/apps/pos-staff/src/styles.scss`

```scss
@import '@resolute-pos/ui-components/themes/m3-theme';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  font-family: Roboto, sans-serif;
}
```

**Step 5: Add Material fonts and icons to index.html**

Modify: `frontend-angular/apps/pos-staff/src/index.html`

Add inside `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

**Step 6: Verify Material is working**

Run: `cd frontend-angular && npx nx serve pos-staff`
Expected: Dev server starts on http://localhost:4200

**Step 7: Commit Material setup**

```bash
git add frontend-angular/
git commit -m "$(cat <<'EOF'
feat: add Angular Material with Material Design 3 theme

- Install Angular Material, CDK, and Animations
- Create shared ui-components library
- Configure Material Design 3 theme with primary/accent/warn colors
- Add dark theme variant support
- Import Roboto fonts and Material Icons

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Set Up PWA Configuration

**Files:**
- Modify: `frontend-angular/apps/pos-staff/project.json`
- Create: `frontend-angular/apps/pos-staff/src/manifest.webmanifest`
- Create: `frontend-angular/apps/pos-staff/src/ngsw-config.json`

**Step 1: Install PWA package**

Run: `cd frontend-angular && npm install @angular/pwa@18`
Expected: Package installed

**Step 2: Add PWA schematic to pos-staff app**

Run: `npx nx g @angular/pwa:pwa --project=pos-staff`
Expected: PWA files created (manifest, service worker config, icons)

**Step 3: Configure service worker caching strategy**

Modify: `frontend-angular/apps/pos-staff/src/ngsw-config.json`

```json
{
  "$schema": "../../node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-cache",
      "urls": [
        "/api/v1/**"
      ],
      "cacheConfig": {
        "maxSize": 100,
        "maxAge": "1h",
        "timeout": "10s",
        "strategy": "freshness"
      }
    }
  ]
}
```

**Step 4: Update manifest for POS branding**

Modify: `frontend-angular/apps/pos-staff/src/manifest.webmanifest`

```json
{
  "name": "Resolute POS - Staff",
  "short_name": "POS Staff",
  "theme_color": "#1976d2",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "landscape",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

**Step 5: Verify PWA configuration**

Run: `cd frontend-angular && npx nx build pos-staff --configuration=production`
Expected: Build succeeds, ngsw-worker.js and ngsw.json generated in dist/

**Step 6: Commit PWA setup**

```bash
git add frontend-angular/
git commit -m "$(cat <<'EOF'
feat: configure PWA with service worker and caching

- Add @angular/pwa package
- Configure service worker caching strategies
- Set up asset prefetching and lazy loading
- Add API caching with freshness strategy
- Configure app manifest for staff POS app
- Set landscape orientation for tablet use

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Set Up NgRx State Management

**Files:**
- Create: `frontend-angular/libs/data-access/` (library)
- Create: `frontend-angular/libs/data-access/src/lib/+state/app.reducer.ts`
- Create: `frontend-angular/libs/data-access/src/lib/+state/app.actions.ts`
- Create: `frontend-angular/libs/data-access/src/lib/+state/app.effects.ts`
- Create: `frontend-angular/libs/data-access/src/lib/+state/app.selectors.ts`

**Step 1: Install NgRx packages**

Run: `cd frontend-angular && npm install @ngrx/store@18 @ngrx/effects@18 @ngrx/store-devtools@18 @ngrx/entity@18`
Expected: Packages installed

**Step 2: Create data-access library**

Run: `npx nx g @nx/angular:library data-access --directory=libs/data-access --importPath=@resolute-pos/data-access --style=scss --no-interactive`
Expected: Library created at `libs/data-access/`

**Step 3: Write test for app state reducer**

Create file: `frontend-angular/libs/data-access/src/lib/+state/app.reducer.spec.ts`

```typescript
import { appReducer, initialState } from './app.reducer';
import { setOnlineStatus } from './app.actions';

describe('App Reducer', () => {
  it('should return initial state', () => {
    const action = { type: 'Unknown' };
    const result = appReducer(undefined, action);

    expect(result).toEqual(initialState);
  });

  it('should set online status', () => {
    const action = setOnlineStatus({ isOnline: false });
    const result = appReducer(initialState, action);

    expect(result.isOnline).toBe(false);
  });
});
```

**Step 4: Run test to verify it fails**

Run: `cd frontend-angular && npx nx test data-access`
Expected: FAIL - modules not found

**Step 5: Create app actions**

Create file: `frontend-angular/libs/data-access/src/lib/+state/app.actions.ts`

```typescript
import { createAction, props } from '@ngrx/store';

export const setOnlineStatus = createAction(
  '[App] Set Online Status',
  props<{ isOnline: boolean }>()
);

export const setSyncQueueDepth = createAction(
  '[App] Set Sync Queue Depth',
  props<{ depth: number }>()
);

export const setCurrentUser = createAction(
  '[App] Set Current User',
  props<{ user: { id: string; name: string; role: string; scopes: string[] } | null }>()
);
```

**Step 6: Create app reducer**

Create file: `frontend-angular/libs/data-access/src/lib/+state/app.reducer.ts`

```typescript
import { createReducer, on } from '@ngrx/store';
import * as AppActions from './app.actions';

export interface AppState {
  isOnline: boolean;
  syncQueueDepth: number;
  currentUser: {
    id: string;
    name: string;
    role: string;
    scopes: string[];
  } | null;
}

export const initialState: AppState = {
  isOnline: true,
  syncQueueDepth: 0,
  currentUser: null,
};

export const appReducer = createReducer(
  initialState,
  on(AppActions.setOnlineStatus, (state, { isOnline }) => ({
    ...state,
    isOnline,
  })),
  on(AppActions.setSyncQueueDepth, (state, { depth }) => ({
    ...state,
    syncQueueDepth: depth,
  })),
  on(AppActions.setCurrentUser, (state, { user }) => ({
    ...state,
    currentUser: user,
  }))
);
```

**Step 7: Run test to verify it passes**

Run: `cd frontend-angular && npx nx test data-access`
Expected: PASS - all tests pass

**Step 8: Create app selectors**

Create file: `frontend-angular/libs/data-access/src/lib/+state/app.selectors.ts`

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.reducer';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectIsOnline = createSelector(
  selectAppState,
  (state) => state.isOnline
);

export const selectSyncQueueDepth = createSelector(
  selectAppState,
  (state) => state.syncQueueDepth
);

export const selectCurrentUser = createSelector(
  selectAppState,
  (state) => state.currentUser
);

export const selectIsAuthenticated = createSelector(
  selectCurrentUser,
  (user) => user !== null
);
```

**Step 9: Configure store in pos-staff app**

Modify: `frontend-angular/apps/pos-staff/src/app/app.config.ts`

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { appReducer } from '@resolute-pos/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideStore({ app: appReducer }),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
};
```

**Step 10: Commit NgRx setup**

```bash
git add frontend-angular/
git commit -m "$(cat <<'EOF'
feat: set up NgRx state management

- Install @ngrx/store, effects, devtools, entity
- Create data-access library for state management
- Implement app state with online status, sync queue, current user
- Add actions, reducer, and selectors with tests
- Configure store in pos-staff app with devtools

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Set Up Testing Infrastructure

**Files:**
- Modify: `frontend-angular/apps/pos-staff/project.json`
- Create: `frontend-angular/apps/pos-staff-e2e/` (Cypress tests)
- Modify: `frontend-angular/jest.config.ts`

**Step 1: Install testing dependencies**

Run: `cd frontend-angular && npm install -D @nx/cypress@latest cypress@latest @testing-library/angular@latest @testing-library/jest-dom@latest`
Expected: Packages installed

**Step 2: Generate Cypress E2E project**

Run: `npx nx g @nx/angular:cypress-component-configuration --project=pos-staff --generate-tests`
Expected: Cypress configuration added to pos-staff

**Step 3: Create E2E test for login flow**

Create file: `frontend-angular/apps/pos-staff-e2e/src/e2e/login.cy.ts`

```typescript
describe('PIN Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display login screen', () => {
    cy.get('[data-testid="pin-login"]').should('be.visible');
    cy.get('[data-testid="pin-pad"]').should('be.visible');
  });

  it('should allow PIN entry', () => {
    cy.get('[data-testid="pin-digit-1"]').click();
    cy.get('[data-testid="pin-digit-2"]').click();
    cy.get('[data-testid="pin-digit-3"]').click();
    cy.get('[data-testid="pin-digit-4"]').click();

    cy.get('[data-testid="pin-display"]').should('have.value', '****');
  });

  it('should navigate to dashboard on successful login', () => {
    // This will fail until login is implemented
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          accessToken: 'mock-token',
          user: { id: '1', name: 'Test User', role: 'waiter' }
        }
      }
    }).as('login');

    cy.get('[data-testid="pin-digit-1"]').click();
    cy.get('[data-testid="pin-digit-2"]').click();
    cy.get('[data-testid="pin-digit-3"]').click();
    cy.get('[data-testid="pin-digit-4"]').click();
    cy.get('[data-testid="pin-submit"]').click();

    cy.wait('@login');
    cy.url().should('include', '/dashboard');
  });
});
```

**Step 4: Run E2E test to verify setup (will fail - not implemented)**

Run: `cd frontend-angular && npx nx e2e pos-staff-e2e --watch=false`
Expected: Tests run but fail (login not implemented yet)

**Step 5: Configure Jest for better test output**

Modify: `frontend-angular/jest.config.ts`

```typescript
export default {
  displayName: 'frontend-angular',
  preset: './jest.preset.js',
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'apps/**/*.ts',
    'libs/**/*.ts',
    '!**/*.spec.ts',
    '!**/*.config.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: ['**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
};
```

**Step 6: Create test setup file**

Create file: `frontend-angular/test-setup.ts`

```typescript
import '@testing-library/jest-dom';

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
```

**Step 7: Commit testing infrastructure**

```bash
git add frontend-angular/
git commit -m "$(cat <<'EOF'
feat: set up testing infrastructure with Jest and Cypress

- Install Cypress for E2E testing
- Add @testing-library/angular for component testing
- Configure Jest with coverage thresholds (70%)
- Create initial E2E test for PIN login flow
- Set up test utilities and setup files

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Create Shared Libraries Structure

**Files:**
- Create: `frontend-angular/libs/auth/`
- Create: `frontend-angular/libs/offline-sync/`
- Create: `frontend-angular/libs/payment/`
- Create: `frontend-angular/libs/data-access/src/lib/models/`

**Step 1: Generate auth library**

Run: `cd frontend-angular && npx nx g @nx/angular:library auth --directory=libs/auth --importPath=@resolute-pos/auth --style=scss --no-interactive`
Expected: Library created at `libs/auth/`

**Step 2: Generate offline-sync library**

Run: `npx nx g @nx/angular:library offline-sync --directory=libs/offline-sync --importPath=@resolute-pos/offline-sync --style=scss --no-interactive`
Expected: Library created at `libs/offline-sync/`

**Step 3: Generate payment library**

Run: `npx nx g @nx/angular:library payment --directory=libs/payment --importPath=@resolute-pos/payment --style=scss --no-interactive`
Expected: Library created at `libs/payment/`

**Step 4: Create shared data models**

Create file: `frontend-angular/libs/data-access/src/lib/models/user.model.ts`

```typescript
export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  scopes: string[];
  pin?: string; // Only for display, never store actual PIN
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  WAITER = 'waiter',
  CASHIER = 'cashier',
  KITCHEN = 'kitchen',
  CUSTOMER = 'customer',
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}
```

Create file: `frontend-angular/libs/data-access/src/lib/models/order.model.ts`

```typescript
export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  ticketNumber?: string;
  customerId?: string;
  items: OrderItem[];
  status: OrderStatus;
  orderType: OrderType;
  subtotal: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  modifiers: OrderItemModifier[];
  specialInstructions?: string;
  status: OrderItemStatus;
}

export interface OrderItemModifier {
  id: string;
  name: string;
  price: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  SENT_TO_KITCHEN = 'sent_to_kitchen',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OrderItemStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  COMPLETED = 'completed',
}

export enum OrderType {
  DINE_IN = 'dine_in',
  TAKEOUT = 'takeout',
  DELIVERY = 'delivery',
  KIOSK = 'kiosk',
}
```

Create file: `frontend-angular/libs/data-access/src/lib/models/index.ts`

```typescript
export * from './user.model';
export * from './order.model';
```

**Step 5: Update library exports**

Modify: `frontend-angular/libs/data-access/src/index.ts`

```typescript
export * from './lib/+state/app.actions';
export * from './lib/+state/app.reducer';
export * from './lib/+state/app.selectors';
export * from './lib/models';
```

**Step 6: Verify libraries are accessible**

Run: `cd frontend-angular && npx nx build auth && npx nx build offline-sync && npx nx build payment && npx nx build data-access`
Expected: All libraries build successfully

**Step 7: Commit shared libraries structure**

```bash
git add frontend-angular/
git commit -m "$(cat <<'EOF'
feat: create shared libraries structure

- Generate auth library for authentication and authorization
- Generate offline-sync library for background sync
- Generate payment library for terminal integration
- Create shared data models (User, Order, OrderItem)
- Define enums for roles, statuses, and order types
- Export models from data-access library

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Configure API Client and Environment

**Files:**
- Create: `frontend-angular/libs/data-access/src/lib/api/api-client.service.ts`
- Create: `frontend-angular/libs/data-access/src/lib/api/api-client.interceptor.ts`
- Create: `frontend-angular/apps/pos-staff/src/environments/environment.ts`
- Create: `frontend-angular/apps/pos-staff/src/environments/environment.development.ts`

**Step 1: Install HTTP client dependencies**

Run: `cd frontend-angular && npm install socket.io-client@4`
Expected: Package installed

**Step 2: Create environment files**

Create file: `frontend-angular/apps/pos-staff/src/environments/environment.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api/v1',
  socketUrl: 'http://localhost:3000',
};
```

Create file: `frontend-angular/apps/pos-staff/src/environments/environment.development.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  socketUrl: 'http://localhost:3000',
};
```

**Step 3: Write test for API client service**

Create file: `frontend-angular/libs/data-access/src/lib/api/api-client.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiClientService } from './api-client.service';

describe('ApiClientService', () => {
  let service: ApiClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiClientService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have get method', () => {
    expect(service.get).toBeDefined();
  });

  it('should have post method', () => {
    expect(service.post).toBeDefined();
  });
});
```

**Step 4: Run test to verify it fails**

Run: `cd frontend-angular && npx nx test data-access --testFile=api-client.service.spec.ts`
Expected: FAIL - ApiClientService not found

**Step 5: Create API client service**

Create file: `frontend-angular/libs/data-access/src/lib/api/api-client.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../../../apps/pos-staff/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(endpoint: string, options?: any): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${endpoint}`, {
        ...options,
        withCredentials: true,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  post<T>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${endpoint}`, data, {
        ...options,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${endpoint}`, data, {
        ...options,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string, options?: any): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${endpoint}`, {
        ...options,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

**Step 6: Run test to verify it passes**

Run: `cd frontend-angular && npx nx test data-access --testFile=api-client.service.spec.ts`
Expected: PASS

**Step 7: Create HTTP interceptor for auth tokens**

Create file: `frontend-angular/libs/data-access/src/lib/api/api-client.interceptor.ts`

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const apiClientInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized - token expired
      if (error.status === 401 || error.status === 403) {
        // Try to refresh token
        // For now, just redirect to login
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
```

**Step 8: Update data-access exports**

Modify: `frontend-angular/libs/data-access/src/index.ts`

```typescript
export * from './lib/+state/app.actions';
export * from './lib/+state/app.reducer';
export * from './lib/+state/app.selectors';
export * from './lib/models';
export * from './lib/api/api-client.service';
export * from './lib/api/api-client.interceptor';
```

**Step 9: Configure interceptor in app**

Modify: `frontend-angular/apps/pos-staff/src/app/app.config.ts`

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { appReducer, apiClientInterceptor } from '@resolute-pos/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(withInterceptors([apiClientInterceptor])),
    provideStore({ app: appReducer }),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
};
```

**Step 10: Commit API client configuration**

```bash
git add frontend-angular/
git commit -m "$(cat <<'EOF'
feat: configure API client with interceptors

- Create ApiClientService with HTTP methods (get, post, put, delete)
- Add withCredentials for cookie-based auth
- Implement error handling with retry logic
- Create HTTP interceptor for 401/403 handling
- Configure environment files for API and Socket URLs
- Add interceptor to app configuration

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Set Up Socket.IO Service

**Files:**
- Create: `frontend-angular/libs/data-access/src/lib/socket/socket.service.ts`
- Create: `frontend-angular/libs/data-access/src/lib/socket/socket.service.spec.ts`

**Step 1: Write test for Socket service**

Create file: `frontend-angular/libs/data-access/src/lib/socket/socket.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketService],
    });
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have connect method', () => {
    expect(service.connect).toBeDefined();
  });

  it('should have disconnect method', () => {
    expect(service.disconnect).toBeDefined();
  });

  it('should have emit method', () => {
    expect(service.emit).toBeDefined();
  });

  it('should have on method', () => {
    expect(service.on).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend-angular && npx nx test data-access --testFile=socket.service.spec.ts`
Expected: FAIL - SocketService not found

**Step 3: Create Socket service**

Create file: `frontend-angular/libs/data-access/src/lib/socket/socket.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../../apps/pos-staff/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;

  connect(): void {
    if (!this.socket) {
      this.socket = io(environment.socketUrl, {
        withCredentials: true,
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('error', (error: any) => {
        console.error('Socket error:', error);
      });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Call connect() first.');
    }
  }

  on<T>(event: string): Observable<T> {
    return new Observable((observer) => {
      if (!this.socket) {
        console.warn('Socket not connected. Call connect() first.');
        return;
      }

      this.socket.on(event, (data: T) => {
        observer.next(data);
      });

      // Cleanup on unsubscribe
      return () => {
        if (this.socket) {
          this.socket.off(event);
        }
      };
    });
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd frontend-angular && npx nx test data-access --testFile=socket.service.spec.ts`
Expected: PASS

**Step 5: Update data-access exports**

Modify: `frontend-angular/libs/data-access/src/index.ts`

```typescript
export * from './lib/+state/app.actions';
export * from './lib/+state/app.reducer';
export * from './lib/+state/app.selectors';
export * from './lib/models';
export * from './lib/api/api-client.service';
export * from './lib/api/api-client.interceptor';
export * from './lib/socket/socket.service';
```

**Step 6: Commit Socket.IO service**

```bash
git add frontend-angular/
git commit -m "$(cat <<'EOF'
feat: add Socket.IO service for real-time updates

- Create SocketService with connect, disconnect, emit, on methods
- Add connection status tracking
- Implement Observable-based event listening
- Configure withCredentials for authenticated connections
- Add error handling and logging
- Write unit tests for Socket service

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Create Initial Routing Structure

**Files:**
- Modify: `frontend-angular/apps/pos-staff/src/app/app.routes.ts`
- Create: `frontend-angular/apps/pos-staff/src/app/pages/login/login.component.ts`
- Create: `frontend-angular/apps/pos-staff/src/app/pages/dashboard/dashboard.component.ts`

**Step 1: Generate login component**

Run: `cd frontend-angular && npx nx g @nx/angular:component pages/login --project=pos-staff --style=scss --export=false`
Expected: Component created at `apps/pos-staff/src/app/pages/login/`

**Step 2: Generate dashboard component**

Run: `npx nx g @nx/angular:component pages/dashboard --project=pos-staff --style=scss --export=false`
Expected: Component created at `apps/pos-staff/src/app/pages/dashboard/`

**Step 3: Configure routes**

Modify: `frontend-angular/apps/pos-staff/src/app/app.routes.ts`

```typescript
import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [authGuard], // Will add in next task
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
```

**Step 4: Create basic login template**

Modify: `frontend-angular/apps/pos-staff/src/app/pages/login/login.component.html`

```html
<div class="login-container">
  <div class="login-card">
    <h1>Resolute POS</h1>
    <h2>Staff Login</h2>

    <div class="pin-login" data-testid="pin-login">
      <input
        type="password"
        [value]="getPinDisplay()"
        readonly
        class="pin-display"
        data-testid="pin-display"
      />

      <div class="pin-pad" data-testid="pin-pad">
        @for (digit of digits; track digit) {
          <button
            class="pin-button"
            (click)="addDigit(digit)"
            [attr.data-testid]="'pin-digit-' + digit"
          >
            {{ digit }}
          </button>
        }
        <button class="pin-button" (click)="clearPin()">Clear</button>
        <button class="pin-button" (click)="addDigit(0)" data-testid="pin-digit-0">0</button>
        <button
          class="pin-button pin-submit"
          (click)="submitPin()"
          data-testid="pin-submit"
        >
          Enter
        </button>
      </div>
    </div>
  </div>
</div>
```

**Step 5: Create login component logic**

Modify: `frontend-angular/apps/pos-staff/src/app/pages/login/login.component.ts`

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  pin: number[] = [];
  digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(private router: Router) {}

  addDigit(digit: number): void {
    if (this.pin.length < 6) {
      this.pin.push(digit);
    }
  }

  clearPin(): void {
    this.pin = [];
  }

  getPinDisplay(): string {
    return '*'.repeat(this.pin.length);
  }

  submitPin(): void {
    if (this.pin.length >= 4) {
      // TODO: Call auth service to validate PIN
      console.log('PIN submitted:', this.pin.join(''));

      // For now, just navigate to dashboard
      this.router.navigate(['/dashboard']);
    }
  }
}
```

**Step 6: Add basic styling for login**

Modify: `frontend-angular/apps/pos-staff/src/app/pages/login/login.component.scss`

```scss
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 400px;

  h1 {
    margin: 0 0 8px;
    font-size: 32px;
    font-weight: 700;
    color: #1976d2;
  }

  h2 {
    margin: 0 0 32px;
    font-size: 18px;
    font-weight: 400;
    color: #666;
  }
}

.pin-display {
  width: 100%;
  padding: 16px;
  font-size: 32px;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 24px;
  letter-spacing: 8px;
}

.pin-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.pin-button {
  padding: 20px;
  font-size: 24px;
  font-weight: 600;
  border: 2px solid #1976d2;
  background: white;
  color: #1976d2;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1976d2;
    color: white;
  }

  &:active {
    transform: scale(0.95);
  }

  &.pin-submit {
    background: #1976d2;
    color: white;
  }
}
```

**Step 7: Create basic dashboard template**

Modify: `frontend-angular/apps/pos-staff/src/app/pages/dashboard/dashboard.component.html`

```html
<div class="dashboard-container">
  <h1>POS Dashboard</h1>
  <p>Welcome to Resolute POS</p>
</div>
```

**Step 8: Verify routing works**

Run: `cd frontend-angular && npx nx serve pos-staff`
Expected: App loads at http://localhost:4200, shows login page

**Step 9: Commit routing structure**

```bash
git add frontend-angular/
git commit -m "$(cat <<'EOF'
feat: create initial routing structure with login and dashboard

- Configure app routes with login and dashboard paths
- Generate login component with PIN pad interface
- Generate dashboard component placeholder
- Add basic styling for login screen
- Implement PIN entry logic (4-6 digits)
- Add navigation from login to dashboard

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Push to GitHub and Document Progress

**Files:**
- Create: `frontend-angular/README.md`
- Modify: `docs/plans/2025-11-22-angular-frontend-rebuild-design.md`

**Step 1: Create frontend README**

Create file: `frontend-angular/README.md`

```markdown
# Resolute POS - Angular Frontend

Modern Angular-based frontend for Resolute POS system with offline-first PWA capabilities.

## Architecture

- **Nx Monorepo:** Multiple apps sharing common libraries
- **Angular 18+:** Latest Angular features with standalone components
- **Material Design 3:** Modern, accessible UI components
- **PWA:** Offline-first with service workers
- **NgRx:** Predictable state management
- **Socket.IO:** Real-time updates

## Applications

- `pos-staff`: Waiter/cashier interface
- `pos-kiosk`: Customer self-service kiosk (planned)
- `kitchen-display`: Kitchen display system (planned)
- `admin-dashboard`: Manager/admin interface (planned)
- `customer-web`: Online ordering web app (planned)

## Shared Libraries

- `ui-components`: Reusable Material Design components
- `data-access`: API client, state management, models
- `auth`: Authentication and authorization
- `offline-sync`: Background sync and queue management
- `payment`: Payment terminal integrations

## Development

```bash
# Install dependencies
npm install

# Serve pos-staff app
npx nx serve pos-staff

# Run tests
npx nx test pos-staff
npx nx test data-access

# Run E2E tests
npx nx e2e pos-staff-e2e

# Build for production
npx nx build pos-staff --configuration=production
```

## Progress

✅ Workspace setup with Nx
✅ Angular Material with MD3 theme
✅ PWA configuration with service workers
✅ NgRx state management
✅ Testing infrastructure (Jest + Cypress)
✅ Shared libraries structure
✅ API client with interceptors
✅ Socket.IO service
✅ Initial routing with login/dashboard

## Next Steps

- Implement authentication with PIN login
- Create auth guard for protected routes
- Build IndexedDB service for offline storage
- Implement offline sync queue
- Create reusable UI components library
- Build waiter workflow (table selection, order taking)
```

**Step 2: Update design document status**

Modify: `docs/plans/2025-11-22-angular-frontend-rebuild-design.md`

Add at the top after the header:

```markdown
**Implementation Status:** 🟡 In Progress

- ✅ Workspace setup complete (2025-11-22)
- ✅ Core infrastructure complete (PWA, NgRx, testing)
- 🔄 Authentication implementation in progress
- ⏳ Feature development pending
```

**Step 3: Run all tests to verify everything works**

Run: `cd frontend-angular && npx nx run-many --target=test --all`
Expected: All tests pass

**Step 4: Build all projects**

Run: `npx nx run-many --target=build --all`
Expected: All projects build successfully

**Step 5: Commit documentation**

```bash
git add .
git commit -m "$(cat <<'EOF'
docs: add frontend README and update design document status

- Create comprehensive README for Angular frontend
- Document architecture, apps, and libraries
- Add development commands and progress checklist
- Update design document with implementation status
- Mark workspace setup phase as complete

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**Step 6: Push to GitHub**

Run: `git push origin angular-frontend-rebuild`
Expected: Changes pushed to remote branch

**Step 7: Verify workspace is ready**

Run: `cd frontend-angular && npx nx serve pos-staff`

Visit: http://localhost:4200
Expected: Login page loads successfully

---

## Summary

This plan sets up the foundational Angular workspace with:

1. ✅ Nx monorepo for managing multiple apps and shared libraries
2. ✅ Angular Material with Material Design 3 theming
3. ✅ PWA configuration with service workers and caching strategies
4. ✅ NgRx state management with app state, actions, and selectors
5. ✅ Testing infrastructure (Jest for unit, Cypress for E2E)
6. ✅ Shared libraries (ui-components, data-access, auth, offline-sync, payment)
7. ✅ API client service with HTTP interceptors
8. ✅ Socket.IO service for real-time updates
9. ✅ Initial routing with login and dashboard pages
10. ✅ Documentation and progress tracking

**Next Implementation Plan:** Authentication with PIN login, auth guards, and session management.
