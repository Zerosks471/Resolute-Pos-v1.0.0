import { Route } from '@angular/router';
import { authGuard, scopeGuard } from '@resolute-pos/auth';

/**
 * Application routes for POS Staff application
 *
 * Route structure:
 * - /login - Public login page
 * - /unauthorized - Unauthorized access page
 * - / - Protected routes (require authentication)
 *   - /dashboard - Dashboard (protected)
 *   - /pos - Point of Sale (requires pos:order scope)
 *   - /orders - Order management (requires orders:view scope)
 *   - /tables - Table management (requires tables:view scope)
 *   - /menu - Menu management (requires menu:view scope)
 *   - /settings - Settings (requires settings:view scope)
 */
export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'pos',
    canActivate: [authGuard, scopeGuard(['pos:order'])],
    loadComponent: () =>
      import('./pages/pos/pos.component').then((m) => m.PosComponent),
  },
  {
    path: 'orders',
    canActivate: [authGuard, scopeGuard(['orders:view'])],
    loadComponent: () =>
      import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'tables',
    canActivate: [authGuard, scopeGuard(['tables:view'])],
    loadComponent: () =>
      import('./pages/tables/tables.component').then((m) => m.TablesComponent),
  },
  {
    path: 'menu',
    canActivate: [authGuard, scopeGuard(['menu:view'])],
    loadComponent: () =>
      import('./pages/menu/menu.component').then((m) => m.MenuComponent),
  },
  {
    path: 'settings',
    canActivate: [authGuard, scopeGuard(['settings:view'])],
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
