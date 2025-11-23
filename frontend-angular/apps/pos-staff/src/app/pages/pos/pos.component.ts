import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuBrowserComponent } from '../../components/menu-browser/menu-browser.component';
import { CartDisplayComponent } from '../../components/cart-display/cart-display.component';
import { CartService, MenuItem } from '@resolute-pos/data-access';

/**
 * POS Component
 * Main Point of Sale interface that integrates menu browsing and cart management
 */
@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, MenuBrowserComponent, CartDisplayComponent],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss'],
})
export class PosComponent {
  private cartService = inject(CartService);

  /**
   * Handle menu item selection
   * Adds the selected item to the cart with a default quantity of 1
   */
  onMenuItemSelected(item: MenuItem): void {
    this.cartService.addItem(item, 1, undefined, undefined);
  }

  /**
   * Handle checkout action
   * TODO: Implement full checkout flow in future tasks
   */
  onCheckout(): void {
    alert('Checkout functionality coming soon!');
  }
}
