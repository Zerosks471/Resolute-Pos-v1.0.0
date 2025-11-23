import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MenuBrowserComponent } from '../../components/menu-browser/menu-browser.component';
import { CartDisplayComponent } from '../../components/cart-display/cart-display.component';
import { ItemCustomizationDialogComponent, ItemCustomizationResult } from '../../components/item-customization-dialog/item-customization-dialog.component';
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
  private dialog = inject(MatDialog);

  /**
   * Handle menu item selection
   * Opens customization dialog before adding to cart
   */
  onMenuItemSelected(item: MenuItem): void {
    const dialogRef = this.dialog.open(ItemCustomizationDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { item },
      disableClose: false,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result: ItemCustomizationResult | undefined) => {
      if (result) {
        this.cartService.addItem(
          result.item,
          result.quantity,
          result.selectedModifiers,
          result.specialInstructions
        );
      }
    });
  }

  /**
   * Handle checkout action
   * TODO: Implement full checkout flow in future tasks
   */
  onCheckout(): void {
    alert('Checkout functionality coming soon!');
  }
}
