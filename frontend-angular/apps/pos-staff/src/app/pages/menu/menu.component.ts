import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-container"><h1>Menu Management</h1><p>Menu editor coming soon...</p></div>`,
  styles: [`.page-container { padding: 20px; }`],
})
export class MenuComponent {}
