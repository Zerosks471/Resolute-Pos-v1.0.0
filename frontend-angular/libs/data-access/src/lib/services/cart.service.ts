import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem, SelectedModifier } from '../models/cart.model';
import { MenuItem } from '../models/menu-item.model';

/**
 * Service for managing shopping cart state
 * Uses Angular signals for reactive state management
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private static readonly TAX_RATE = 0.085; // 8.5% tax rate

  // Signal-based state
  readonly cartItems = signal<CartItem[]>([]);

  // Computed values
  readonly subtotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.subtotal, 0);
  });

  readonly tax = computed(() => {
    const taxAmount = this.subtotal() * CartService.TAX_RATE;
    return Math.round(taxAmount * 100) / 100; // Round to 2 decimal places
  });

  readonly total = computed(() => {
    return Math.round((this.subtotal() + this.tax()) * 100) / 100;
  });

  readonly itemCount = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  /**
   * Add an item to the cart
   */
  addItem(
    item: MenuItem,
    quantity: number,
    modifiers?: SelectedModifier[],
    instructions?: string
  ): void {
    // Don't add items with zero or negative quantity
    if (quantity <= 0) {
      return;
    }

    const cartItem: CartItem = {
      menuItem: item,
      quantity,
      modifiers,
      specialInstructions: instructions,
      subtotal: this.calculateItemSubtotal({
        menuItem: item,
        quantity,
        modifiers,
        subtotal: 0, // Will be calculated
      }),
    };

    // Create new array (immutable update)
    this.cartItems.update((items) => [...items, cartItem]);
  }

  /**
   * Remove an item from the cart by index
   */
  removeItem(index: number): void {
    this.cartItems.update((items) => items.filter((_, i) => i !== index));
  }

  /**
   * Update the quantity of an item in the cart
   */
  updateQuantity(index: number, quantity: number): void {
    // If quantity is zero or negative, remove the item
    if (quantity <= 0) {
      this.removeItem(index);
      return;
    }

    this.cartItems.update((items) => {
      const newItems = [...items];
      if (newItems[index]) {
        newItems[index] = {
          ...newItems[index],
          quantity,
          subtotal: this.calculateItemSubtotal({
            ...newItems[index],
            quantity,
          }),
        };
      }
      return newItems;
    });
  }

  /**
   * Clear all items from the cart
   */
  clearCart(): void {
    this.cartItems.set([]);
  }

  /**
   * Get the current cart state
   */
  getCart(): Cart {
    return {
      items: this.cartItems(),
      subtotal: this.subtotal(),
      tax: this.tax(),
      total: this.total(),
    };
  }

  /**
   * Calculate the subtotal for a single cart item
   * Subtotal = (base price + modifier prices) * quantity
   */
  private calculateItemSubtotal(item: CartItem): number {
    const modifierTotal =
      item.modifiers?.reduce((sum, mod) => sum + mod.priceAdjustment, 0) || 0;
    const itemSubtotal = (item.menuItem.price + modifierTotal) * item.quantity;
    return Math.round(itemSubtotal * 100) / 100; // Round to 2 decimal places
  }
}
