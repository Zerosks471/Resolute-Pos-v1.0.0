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
