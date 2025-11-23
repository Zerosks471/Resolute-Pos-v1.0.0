import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItemCustomizationDialogComponent, ItemCustomizationData } from './item-customization-dialog.component';
import { MenuItem, MenuCategory } from '@resolute-pos/data-access';

describe('ItemCustomizationDialogComponent', () => {
  let component: ItemCustomizationDialogComponent;
  let fixture: ComponentFixture<ItemCustomizationDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ItemCustomizationDialogComponent>>;

  const mockItem: MenuItem = {
    id: '1',
    name: 'Pizza',
    description: 'Delicious pizza',
    category: MenuCategory.ENTREES,
    price: 10.00,
    available: true,
    modifiers: [
      { id: '1', name: 'Extra Cheese', priceAdjustment: 2.00 },
      { id: '2', name: 'Pepperoni', priceAdjustment: 1.50 },
    ],
  };

  const mockData: ItemCustomizationData = {
    item: mockItem,
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ItemCustomizationDialogComponent,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCustomizationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.get('quantity')?.value).toBe(1);
    expect(component.form.get('specialInstructions')?.value).toBe('');
    expect(component.modifiersArray.length).toBe(2);
  });

  it('should display item name and description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.dialog-title')?.textContent).toContain('Pizza');
    expect(compiled.querySelector('.description')?.textContent).toContain('Delicious pizza');
  });

  it('should increment quantity', () => {
    component.incrementQuantity();
    expect(component.form.get('quantity')?.value).toBe(2);
  });

  it('should decrement quantity', () => {
    component.form.patchValue({ quantity: 3 });
    component.decrementQuantity();
    expect(component.form.get('quantity')?.value).toBe(2);
  });

  it('should not decrement quantity below 1', () => {
    component.decrementQuantity();
    expect(component.form.get('quantity')?.value).toBe(1);
  });

  it('should not increment quantity above 99', () => {
    component.form.patchValue({ quantity: 99 });
    component.incrementQuantity();
    expect(component.form.get('quantity')?.value).toBe(99);
  });

  it('should calculate total price without modifiers', () => {
    expect(component.totalPrice).toBe(10.00);
  });

  it('should calculate total price with modifiers', () => {
    component.modifiersArray.at(0).patchValue({ selected: true }); // +2.00
    expect(component.totalPrice).toBe(12.00);
  });

  it('should calculate total price with quantity and modifiers', () => {
    component.form.patchValue({ quantity: 2 });
    component.modifiersArray.at(0).patchValue({ selected: true }); // +2.00
    expect(component.totalPrice).toBe(24.00); // (10 + 2) * 2
  });

  it('should get selected modifiers', () => {
    component.modifiersArray.at(0).patchValue({ selected: true });
    component.modifiersArray.at(1).patchValue({ selected: true });

    const selected = component.selectedModifiers;
    expect(selected.length).toBe(2);
    expect(selected[0].name).toBe('Extra Cheese');
    expect(selected[1].name).toBe('Pepperoni');
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });

  it('should close dialog with result on add to cart', () => {
    component.modifiersArray.at(0).patchValue({ selected: true });
    component.form.patchValue({
      quantity: 2,
      specialInstructions: 'No onions',
    });

    component.onAddToCart();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      item: mockItem,
      quantity: 2,
      selectedModifiers: jasmine.arrayContaining([
        jasmine.objectContaining({ name: 'Extra Cheese' }),
      ]),
      specialInstructions: 'No onions',
    });
  });

  it('should not submit if form is invalid', () => {
    component.form.patchValue({ quantity: 0 }); // Invalid quantity
    component.onAddToCart();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should validate special instructions max length', () => {
    const longText = 'a'.repeat(201);
    component.form.patchValue({ specialInstructions: longText });
    expect(component.form.get('specialInstructions')?.errors?.['maxlength']).toBeTruthy();
  });
});
