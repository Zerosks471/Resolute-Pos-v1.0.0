import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-container">
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <a routerLink="/dashboard">Return to Dashboard</a>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
    a {
      margin-top: 20px;
      padding: 10px 20px;
      background: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
  `],
})
export class UnauthorizedComponent {}
