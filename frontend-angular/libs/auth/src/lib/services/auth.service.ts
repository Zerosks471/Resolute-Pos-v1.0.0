/**
 * Authentication service
 * Handles PIN login, logout, and user state management
 */

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { User, PinLoginRequest, PinLoginResponse } from '../models/user.model';
import { environment } from '../../../../../apps/pos-staff/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly API_URL = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  /**
   * Login with PIN code
   */
  loginWithPin(pin: string): Observable<PinLoginResponse> {
    const request: PinLoginRequest = { pin };

    return this.http
      .post<PinLoginResponse>(`${this.API_URL}/auth/pin-login`, request, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.user) {
            this.setUser(response.user);
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return of({
            success: false,
            message: 'Login failed. Please try again.',
          });
        })
      );
  }

  /**
   * Logout current user
   */
  logout(): Observable<any> {
    return this.http
      .post(`${this.API_URL}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.clearUser();
        }),
        catchError((error) => {
          console.error('Logout error:', error);
          this.clearUser(); // Clear user even if backend fails
          return of({ success: true });
        })
      );
  }

  /**
   * Check if user has specific scope
   */
  hasScope(scope: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;

    // Admin has all scopes
    if (user.role === 'admin') return true;

    // Check if user has the specific scope or wildcard scope
    return user.scopes.some(
      (s) => s === scope || s === '*' || s.startsWith(scope.split(':')[0] + ':*')
    );
  }

  /**
   * Get current user synchronously
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Check authentication status on service initialization
   */
  private checkAuthStatus(): void {
    // Skip during SSR
    if (!this.isBrowser) {
      return;
    }

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.setUser(user);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        this.clearUser();
      }
    }
  }

  /**
   * Set current user and store in localStorage
   */
  private setUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);

    // Only access localStorage in browser
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  /**
   * Clear current user from memory and localStorage
   */
  private clearUser(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Only access localStorage in browser
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
  }
}
