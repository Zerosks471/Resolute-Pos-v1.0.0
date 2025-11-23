import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card [class.elevated]="elevated">
      @if (title) {
        <mat-card-header>
          <mat-card-title>{{ title }}</mat-card-title>
          @if (subtitle) {
            <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
          }
        </mat-card-header>
      }
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
      @if (hasActions) {
        <mat-card-actions>
          <ng-content select="[card-actions]"></ng-content>
        </mat-card-actions>
      }
    </mat-card>
  `,
  styles: [`
    mat-card.elevated {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `],
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() elevated = false;
  @Input() hasActions = false;
}
