/**
 * Test helpers for data-access library
 * Provides utilities for testing Angular services and components
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

/**
 * Setup function for service tests with HTTP client
 */
export function setupServiceTest<T>(serviceClass: any, initialState = {}) {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      serviceClass,
      provideMockStore({ initialState }),
    ],
  });

  const service = TestBed.inject(serviceClass) as T;
  const httpMock = TestBed.inject(HttpTestingController);
  const store = TestBed.inject(MockStore);

  return { service, httpMock, store };
}

/**
 * Setup function for component tests
 */
export function setupComponentTest<T>(component: any, initialState = {}) {
  TestBed.configureTestingModule({
    imports: [component],
    providers: [
      provideMockStore({ initialState }),
      provideRouter([]),
    ],
  });

  const fixture = TestBed.createComponent(component);
  const componentInstance = fixture.componentInstance as T;
  const store = TestBed.inject(MockStore);

  return { fixture, component: componentInstance, store };
}

/**
 * Cleanup function for HTTP tests
 */
export function cleanupHttpTest(httpMock: HttpTestingController) {
  httpMock.verify();
}

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: '1',
  name: 'Test User',
  role: 'waiter' as const,
  scopes: ['pos:order', 'pos:view'],
};

/**
 * Mock API response wrapper
 */
export function mockApiResponse<T>(data: T, success = true) {
  return {
    success,
    data,
    message: success ? 'Success' : 'Error',
  };
}

/**
 * Wait for async operations in tests
 */
export function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
