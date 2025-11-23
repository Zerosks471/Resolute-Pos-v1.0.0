import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-container"><h1>Settings</h1><p>Settings panel coming soon...</p></div>`,
  styles: [`.page-container { padding: 20px; }`],
})
export class SettingsComponent {}
