import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@resolute-pos/auth';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Resolute POS</mat-card-title>
          <mat-card-subtitle>Staff Login</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="pin-display">
            <div class="pin-dots">{{ getMaskedPin() }}</div>
            @if (errorMessage) {
              <div class="error-message">{{ errorMessage }}</div>
            }
          </div>

          <div class="pin-pad">
            @for (row of [[1, 2, 3], [4, 5, 6], [7, 8, 9]]; track row) {
              <div class="pin-row">
                @for (digit of row; track digit) {
                  <button
                    mat-raised-button
                    class="pin-button"
                    (click)="addDigit(digit.toString())"
                    [disabled]="isLoading"
                  >
                    {{ digit }}
                  </button>
                }
              </div>
            }
            <div class="pin-row">
              <button
                mat-raised-button
                class="pin-button"
                (click)="clearPin()"
                [disabled]="isLoading"
              >
                Clear
              </button>
              <button
                mat-raised-button
                class="pin-button"
                (click)="addDigit('0')"
                [disabled]="isLoading"
              >
                0
              </button>
              <button
                mat-raised-button
                color="primary"
                class="pin-button"
                (click)="submit()"
                [disabled]="!canSubmit() || isLoading"
              >
                @if (isLoading) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  Enter
                }
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1.5rem;
    }

    .login-card {
      max-width: 480px;
      width: 100%;
      border-radius: 20px;
      padding: 16px;
    }

    mat-card-header {
      justify-content: center;
      margin-bottom: 2.5rem;
    }

    mat-card-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      color: var(--md-sys-color-primary);
    }

    mat-card-subtitle {
      text-align: center;
      font-size: 1.125rem;
      font-weight: 500;
      margin-top: 8px;
    }

    .pin-display {
      text-align: center;
      margin-bottom: 2.5rem;
      padding: 20px;
      background: var(--md-sys-color-surface-variant);
      border-radius: 16px;
    }

    .pin-dots {
      font-size: 3rem;
      min-height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.75rem;
      color: var(--md-sys-color-primary);
      font-weight: 700;
    }

    .error-message {
      color: var(--md-sys-color-error);
      font-size: 1rem;
      font-weight: 500;
      margin-top: 12px;
      padding: 8px 12px;
      background: var(--md-sys-color-error-container);
      border-radius: 8px;
    }

    .pin-pad {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .pin-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .pin-button {
      height: 72px;
      font-size: 1.75rem;
      font-weight: 600;
      border-radius: 12px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .pin-button:not([disabled]):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .pin-button:not([disabled]):active {
      transform: scale(0.98);
    }

    mat-spinner {
      margin: 0 auto;
    }

    // Mobile responsive
    @media (max-width: 599px) {
      .login-container {
        padding: 1rem;
      }

      .login-card {
        max-width: 100%;
        padding: 12px;
      }

      mat-card-title {
        font-size: 2rem;
      }

      mat-card-subtitle {
        font-size: 1rem;
      }

      .pin-display {
        margin-bottom: 2rem;
        padding: 16px;
      }

      .pin-dots {
        font-size: 2.5rem;
        min-height: 3rem;
      }

      .pin-pad {
        gap: 12px;
      }

      .pin-row {
        gap: 12px;
      }

      .pin-button {
        height: 64px;
        font-size: 1.5rem;
      }
    }
  `],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  pin = '';
  errorMessage: string | null = null;
  isLoading = false;

  addDigit(digit: string): void {
    if (this.pin.length < 6) {
      this.pin += digit;
      this.errorMessage = null;
    }
  }

  clearPin(): void {
    this.pin = '';
  }

  getMaskedPin(): string {
    return '•'.repeat(this.pin.length);
  }

  canSubmit(): boolean {
    return this.pin.length >= 4;
  }

  async submit(): Promise<void> {
    if (!this.canSubmit() || this.isLoading) return;

    this.isLoading = true;
    try {
      const response = await this.authService.loginWithPin(this.pin).toPromise();

      if (response && response.success) {
        this.pin = '';
        await this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = response?.message || 'Invalid PIN. Please try again.';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Invalid PIN';
    } finally {
      this.isLoading = false;
    }
  }
}
