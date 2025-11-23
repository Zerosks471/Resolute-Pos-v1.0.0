import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-container"><h1>Point of Sale</h1><p>POS interface coming soon...</p></div>`,
  styles: [`.page-container { padding: 20px; }`],
})
export class PosComponent {}
