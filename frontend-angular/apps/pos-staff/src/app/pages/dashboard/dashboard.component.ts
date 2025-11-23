import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardApiService, DashboardMetrics } from '@resolute-pos/data-access';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="dashboard-container">
      <h1>POS Dashboard</h1>

      <div class="metrics-grid">
        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon>attach_money</mat-icon>
            <mat-card-title>Today's Sales</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">\${{ metrics.totalSales | number:'1.2-2' }}</div>
            @if (metrics.comparedToYesterday !== undefined) {
              <div class="metric-change" [class.positive]="metrics.comparedToYesterday > 0">
                {{ metrics.comparedToYesterday > 0 ? '+' : '' }}{{ metrics.comparedToYesterday }}%
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon>receipt</mat-icon>
            <mat-card-title>Orders</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">{{ metrics.orderCount }}</div>
            @if (metrics.avgTicket !== undefined) {
              <div class="metric-subtitle">Avg: \${{ metrics.avgTicket | number:'1.2-2' }}</div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon>table_restaurant</mat-icon>
            <mat-card-title>Active Tables</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">{{ metrics.activeTables }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-icon>kitchen</mat-icon>
            <mat-card-title>Kitchen Queue</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">{{ metrics.kitchenQueue }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/pos">
            <mat-icon>point_of_sale</mat-icon>
            New Order
          </button>
          <button mat-raised-button routerLink="/orders">
            <mat-icon>list</mat-icon>
            View Orders
          </button>
          <button mat-raised-button routerLink="/tables">
            <mat-icon>table_restaurant</mat-icon>
            Manage Tables
          </button>
          <button mat-raised-button routerLink="/menu">
            <mat-icon>restaurant_menu</mat-icon>
            Menu
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 24px;
      color: var(--mat-sys-on-surface);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .metric-card mat-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .metric-card mat-icon {
      color: var(--mat-sys-primary);
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .metric-value {
      font-size: 36px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .metric-change {
      font-size: 14px;
      color: var(--mat-sys-error);
    }

    .metric-change.positive {
      color: var(--mat-sys-tertiary);
    }

    .metric-subtitle {
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
    }

    .quick-actions h2 {
      margin-bottom: 16px;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private dashboardApi = inject(DashboardApiService);
  private refreshInterval?: number;

  metrics: DashboardMetrics = {
    totalSales: 0,
    orderCount: 0,
    activeTables: 0,
    kitchenQueue: 0,
  };

  ngOnInit(): void {
    this.loadMetrics();
    // Refresh metrics every 30 seconds
    this.refreshInterval = window.setInterval(() => this.loadMetrics(), 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private loadMetrics(): void {
    this.dashboardApi.getTodaysMetrics().subscribe({
      next: (response) => {
        if (response.success) {
          this.metrics = response.data;
        }
      },
      error: (error) => {
        console.error('Failed to load dashboard metrics', error);
      },
    });
  }
}
