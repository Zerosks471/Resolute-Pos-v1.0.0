/**
 * Authentication Interceptor
 * Adds authentication headers and handles 401 responses
 */

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Clone the request to add credentials
  const authReq = req.clone({
    withCredentials: true, // Include cookies for JWT
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - redirect to login
        console.warn('Unauthorized request, redirecting to login');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
