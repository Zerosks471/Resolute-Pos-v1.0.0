import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardApiService, DashboardMetrics } from '@resolute-pos/data-access';

/**
 * Dashboard Component - Touch-Friendly POS Style
 * Main landing page with key metrics and quick actions
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private dashboardApi = inject(DashboardApiService);
  private refreshInterval?: number;

  // Reactive state
  loading = signal(false);
  error = signal<string | null>(null);
  lastUpdated = new Date();

  metrics: DashboardMetrics = {
    totalSales: 0,
    orderCount: 0,
    activeTables: 0,
    kitchenQueue: 0,
  };

  ngOnInit(): void {
    this.loadMetrics();
    // Refresh metrics every 30 seconds for real-time updates
    this.refreshInterval = window.setInterval(() => {
      this.loadMetrics();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  /**
   * Load dashboard metrics from API
   */
  loadMetrics(): void {
    this.loading.set(true);
    this.error.set(null);

    this.dashboardApi.getTodaysMetrics().subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.metrics = response.data;
          this.lastUpdated = new Date();
        } else {
          this.error.set('Failed to load metrics. Please try again.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Failed to load dashboard metrics', err);
        this.error.set(
          err.message || 'Unable to connect to server. Please check your connection and try again.'
        );
      },
    });
  }

  /**
   * Retry loading metrics after error
   */
  retry(): void {
    this.loadMetrics();
  }
}
