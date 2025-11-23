import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <nav>
        <a routerLink="/pos">POS</a>
        <a routerLink="/orders">Orders</a>
        <a routerLink="/tables">Tables</a>
        <a routerLink="/menu">Menu</a>
        <a routerLink="/settings">Settings</a>
      </nav>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    nav {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }
    a {
      padding: 10px 20px;
      background: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
  `],
})
export class DashboardComponent {}
