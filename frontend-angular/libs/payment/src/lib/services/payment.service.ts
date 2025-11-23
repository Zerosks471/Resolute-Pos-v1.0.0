/**
 * Payment service
 * Handles payment processing and terminal integration
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  Payment,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
} from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/v1'; // Will be configured via environment

  /**
   * Process a payment
   */
  processPayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      `${this.API_URL}/payments/process`,
      request,
      { withCredentials: true }
    );
  }

  /**
   * Get payment by ID
   */
  getPayment(paymentId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.API_URL}/payments/${paymentId}`, {
      withCredentials: true,
    });
  }

  /**
   * Cancel a payment
   */
  cancelPayment(paymentId: string): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      `${this.API_URL}/payments/${paymentId}/cancel`,
      {},
      { withCredentials: true }
    );
  }

  /**
   * Get payment status
   */
  getPaymentStatus(paymentId: string): Observable<PaymentStatus> {
    return this.http.get<PaymentStatus>(
      `${this.API_URL}/payments/${paymentId}/status`,
      { withCredentials: true }
    );
  }

  /**
   * Calculate change for cash payment
   */
  calculateChange(total: number, tendered: number): number {
    return Math.max(0, tendered - total);
  }
}
