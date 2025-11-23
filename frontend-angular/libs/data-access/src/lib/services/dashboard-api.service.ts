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
