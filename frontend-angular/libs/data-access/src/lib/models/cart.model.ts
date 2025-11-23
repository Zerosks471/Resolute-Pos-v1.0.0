/**
 * Shopping cart models for POS system
 */

import { MenuItem } from './menu-item.model';

/**
 * Represents a selected modifier for a cart item
 */
export interface SelectedModifier {
  id: string;
  name: string;
  priceAdjustment: number;
}

/**
 * Represents an item in the shopping cart
 */
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  modifiers?: SelectedModifier[];
  specialInstructions?: string;
  subtotal: number;
}

/**
 * Represents the complete shopping cart
 */
export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}
