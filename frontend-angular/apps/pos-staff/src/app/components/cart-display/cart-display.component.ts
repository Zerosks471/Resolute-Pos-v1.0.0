import {
  Component,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '@resolute-pos/data-access';

/**
 * Cart Display Component
 * Displays the shopping cart contents with quantity controls and checkout functionality
 */
@Component({
  selector: 'app-cart-display',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  templateUrl: './cart-display.component.html',
  styleUrl: './cart-display.component.scss',
})
export class CartDisplayComponent {
  private cartService = inject(CartService);

  // Access cart state signals from service
  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;
  tax = this.cartService.tax;
  total = this.cartService.total;
  itemCount = this.cartService.itemCount;

  // Output event for checkout
  @Output() checkoutClicked = new EventEmitter<void>();

  /**
   * Increase the quantity of an item
   */
  increaseQuantity(index: number): void {
    const currentItem = this.cartItems()[index];
    if (currentItem) {
      this.cartService.updateQuantity(index, currentItem.quantity + 1);
    }
  }

  /**
   * Decrease the quantity of an item (minimum 1)
   */
  decreaseQuantity(index: number): void {
    const currentItem = this.cartItems()[index];
    if (currentItem && currentItem.quantity > 1) {
      this.cartService.updateQuantity(index, currentItem.quantity - 1);
    }
  }

  /**
   * Remove an item from the cart
   */
  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  /**
   * Clear all items from the cart with confirmation
   */
  clearCart(): void {
    const confirmed = window.confirm(
      'Are you sure you want to clear the cart?'
    );
    if (confirmed) {
      this.cartService.clearCart();
    }
  }

  /**
   * Emit checkout event
   */
  checkout(): void {
    this.checkoutClicked.emit();
  }
}
