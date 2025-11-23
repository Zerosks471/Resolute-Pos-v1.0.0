/**
 * API Client Service
 * Centralized HTTP client with interceptors for authentication and error handling
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, filter } from 'rxjs/operators';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly http = inject(HttpClient);

  // Base URL will be set via environment configuration
  private baseUrl = '/api/v1';

  /**
   * Set the base URL for API requests
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, options?: any): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${endpoint}`, {
        ...options,
        withCredentials: true,
        observe: 'response' as 'body',
      })
      .pipe(
        retry(1), // Retry once on failure
        filter((event): event is HttpResponse<T> => event instanceof HttpResponse),
        map((response: HttpResponse<T>) => response.body as T),
        catchError(this.handleError)
      );
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${endpoint}`, body, {
        ...options,
        withCredentials: true,
        headers: this.getHeaders(options?.headers),
        observe: 'response' as 'body',
      })
      .pipe(
        filter((event): event is HttpResponse<T> => event instanceof HttpResponse),
        map((response: HttpResponse<T>) => response.body as T),
        catchError(this.handleError)
      );
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${endpoint}`, body, {
        ...options,
        withCredentials: true,
        headers: this.getHeaders(options?.headers),
        observe: 'response' as 'body',
      })
      .pipe(
        filter((event): event is HttpResponse<T> => event instanceof HttpResponse),
        map((response: HttpResponse<T>) => response.body as T),
        catchError(this.handleError)
      );
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.http
      .patch<T>(`${this.baseUrl}${endpoint}`, body, {
        ...options,
        withCredentials: true,
        headers: this.getHeaders(options?.headers),
        observe: 'response' as 'body',
      })
      .pipe(
        filter((event): event is HttpResponse<T> => event instanceof HttpResponse),
        map((response: HttpResponse<T>) => response.body as T),
        catchError(this.handleError)
      );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options?: any): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${endpoint}`, {
        ...options,
        withCredentials: true,
        observe: 'response' as 'body',
      })
      .pipe(
        filter((event): event is HttpResponse<T> => event instanceof HttpResponse),
        map((response: HttpResponse<T>) => response.body as T),
        catchError(this.handleError)
      );
  }

  /**
   * Get default headers
   */
  private getHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (customHeaders) {
      customHeaders.keys().forEach((key) => {
        const values = customHeaders.getAll(key);
        if (values) {
          values.forEach((value) => {
            headers = headers.append(key, value);
          });
        }
      });
    }

    return headers;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server returned code ${error.status}`;

      // Handle specific status codes
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          // Could trigger logout here
          break;
        case 403:
          errorMessage = 'Access forbidden. You do not have permission.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
      }
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
