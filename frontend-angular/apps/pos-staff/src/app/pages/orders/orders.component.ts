import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-container"><h1>Order Management</h1><p>Order list coming soon...</p></div>`,
  styles: [`.page-container { padding: 20px; }`],
})
export class OrdersComponent {}
