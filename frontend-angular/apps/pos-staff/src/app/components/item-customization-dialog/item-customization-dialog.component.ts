import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem, MenuItemModifier } from '@resolute-pos/data-access';

export interface ItemCustomizationData {
  item: MenuItem;
}

export interface ItemCustomizationResult {
  item: MenuItem;
  quantity: number;
  selectedModifiers: MenuItemModifier[];
  specialInstructions: string;
}

/**
 * Item Customization Dialog
 * Allows staff to customize menu items before adding to cart
 */
@Component({
  selector: 'app-item-customization-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './item-customization-dialog.component.html',
  styleUrls: ['./item-customization-dialog.component.scss'],
})
export class ItemCustomizationDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ItemCustomizationDialogComponent>);
  data = inject<ItemCustomizationData>(MAT_DIALOG_DATA);

  form!: FormGroup;
  item: MenuItem;

  constructor() {
    this.item = this.data.item;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
      modifiers: this.fb.array(
        this.item.modifiers?.map(modifier =>
          this.fb.group({
            id: [modifier.id],
            name: [modifier.name],
            priceAdjustment: [modifier.priceAdjustment],
            selected: [false]
          })
        ) || []
      ),
      specialInstructions: ['', [Validators.maxLength(200)]],
    });
  }

  get modifiersArray(): FormArray {
    return this.form.get('modifiers') as FormArray;
  }

  get selectedModifiers(): MenuItemModifier[] {
    return this.modifiersArray.controls
      .filter(control => control.get('selected')?.value)
      .map(control => ({
        id: control.get('id')?.value,
        name: control.get('name')?.value,
        priceAdjustment: control.get('priceAdjustment')?.value,
      }));
  }

  get totalPrice(): number {
    const basePrice = this.item.price;
    const quantity = this.form.get('quantity')?.value || 1;
    const modifiersTotal = this.selectedModifiers.reduce(
      (sum, mod) => sum + mod.priceAdjustment,
      0
    );
    return (basePrice + modifiersTotal) * quantity;
  }

  incrementQuantity(): void {
    const currentQuantity = this.form.get('quantity')?.value || 1;
    if (currentQuantity < 99) {
      this.form.patchValue({ quantity: currentQuantity + 1 });
    }
  }

  decrementQuantity(): void {
    const currentQuantity = this.form.get('quantity')?.value || 1;
    if (currentQuantity > 1) {
      this.form.patchValue({ quantity: currentQuantity - 1 });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAddToCart(): void {
    if (this.form.valid) {
      const result: ItemCustomizationResult = {
        item: this.item,
        quantity: this.form.get('quantity')?.value,
        selectedModifiers: this.selectedModifiers,
        specialInstructions: this.form.get('specialInstructions')?.value,
      };
      this.dialogRef.close(result);
    }
  }
}
