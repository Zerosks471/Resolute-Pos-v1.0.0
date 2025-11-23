import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-container"><h1>Table Management</h1><p>Table layout coming soon...</p></div>`,
  styles: [`.page-container { padding: 20px; }`],
})
export class TablesComponent {}
