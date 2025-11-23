import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'resolute-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClass()"
      (click)="onClick()"
    >
      @if (loading) {
        <mat-spinner diameter="20"></mat-spinner>
      } @else {
        <ng-content></ng-content>
        {{ label }}
      }
    </button>
  `,
  styles: [`
    button {
      min-width: 120px;
      position: relative;
    }
    mat-spinner {
      display: inline-block;
      margin: 0 auto;
    }
  `],
})
export class ButtonComponent {
  @Input() label = '';
  @Input() variant: 'primary' | 'secondary' | 'text' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<void>();

  getButtonClass(): string {
    switch (this.variant) {
      case 'primary':
        return 'mat-raised-button mat-primary';
      case 'secondary':
        return 'mat-raised-button';
      case 'text':
        return 'mat-button';
    }
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
