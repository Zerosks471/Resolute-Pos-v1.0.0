import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { MenuItem, MenuCategory } from '../models/menu-item.model';
import { SelectedModifier } from '../models/cart.model';

describe('CartService', () => {
  let service: CartService;

  // Mock menu items for testing
  const mockMenuItem1: MenuItem = {
    id: 'item-1',
    name: 'Burger',
    description: 'Delicious burger',
    category: MenuCategory.ENTREES,
    price: 10.0,
    available: true,
  };

  const mockMenuItem2: MenuItem = {
    id: 'item-2',
    name: 'Fries',
    description: 'Crispy fries',
    category: MenuCategory.SIDES,
    price: 5.0,
    available: true,
  };

  const mockModifier1: SelectedModifier = {
    id: 'mod-1',
    name: 'Extra Cheese',
    priceAdjustment: 1.5,
  };

  const mockModifier2: SelectedModifier = {
    id: 'mod-2',
    name: 'Bacon',
    priceAdjustment: 2.0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty cart', () => {
    expect(service.cartItems()).toEqual([]);
    expect(service.subtotal()).toBe(0);
    expect(service.tax()).toBe(0);
    expect(service.total()).toBe(0);
    expect(service.itemCount()).toBe(0);
  });

  it('should add item to cart without modifiers', () => {
    service.addItem(mockMenuItem1, 2);

    const items = service.cartItems();
    expect(items.length).toBe(1);
    expect(items[0].menuItem).toEqual(mockMenuItem1);
    expect(items[0].quantity).toBe(2);
    expect(items[0].subtotal).toBe(20.0); // 10 * 2
    expect(items[0].modifiers).toBeUndefined();
    expect(items[0].specialInstructions).toBeUndefined();
  });

  it('should add item to cart with modifiers', () => {
    service.addItem(mockMenuItem1, 1, [mockModifier1, mockModifier2], 'No onions');

    const items = service.cartItems();
    expect(items.length).toBe(1);
    expect(items[0].menuItem).toEqual(mockMenuItem1);
    expect(items[0].quantity).toBe(1);
    expect(items[0].modifiers).toEqual([mockModifier1, mockModifier2]);
    expect(items[0].specialInstructions).toBe('No onions');
    // Subtotal: (10 + 1.5 + 2.0) * 1 = 13.5
    expect(items[0].subtotal).toBe(13.5);
  });

  it('should add multiple different items to cart', () => {
    service.addItem(mockMenuItem1, 2);
    service.addItem(mockMenuItem2, 3);

    const items = service.cartItems();
    expect(items.length).toBe(2);
    expect(items[0].menuItem).toEqual(mockMenuItem1);
    expect(items[1].menuItem).toEqual(mockMenuItem2);
  });

  it('should not add item with zero or negative quantity', () => {
    service.addItem(mockMenuItem1, 0);
    expect(service.cartItems().length).toBe(0);

    service.addItem(mockMenuItem1, -1);
    expect(service.cartItems().length).toBe(0);
  });

  it('should remove item from cart by index', () => {
    service.addItem(mockMenuItem1, 1);
    service.addItem(mockMenuItem2, 2);

    expect(service.cartItems().length).toBe(2);

    service.removeItem(0);

    const items = service.cartItems();
    expect(items.length).toBe(1);
    expect(items[0].menuItem).toEqual(mockMenuItem2);
  });

  it('should update item quantity', () => {
    service.addItem(mockMenuItem1, 2);

    service.updateQuantity(0, 5);

    const items = service.cartItems();
    expect(items[0].quantity).toBe(5);
    expect(items[0].subtotal).toBe(50.0); // 10 * 5
  });

  it('should remove item when quantity updated to zero or negative', () => {
    service.addItem(mockMenuItem1, 2);
    service.addItem(mockMenuItem2, 3);

    expect(service.cartItems().length).toBe(2);

    service.updateQuantity(0, 0);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].menuItem).toEqual(mockMenuItem2);
  });

  it('should calculate subtotal correctly', () => {
    service.addItem(mockMenuItem1, 2); // 10 * 2 = 20
    service.addItem(mockMenuItem2, 3); // 5 * 3 = 15

    expect(service.subtotal()).toBe(35.0);
  });

  it('should calculate tax correctly at 8.5%', () => {
    service.addItem(mockMenuItem1, 2); // subtotal = 20
    service.addItem(mockMenuItem2, 3); // subtotal = 15
    // Total subtotal = 35
    // Tax = 35 * 0.085 = 2.975 rounded to 2.98

    const tax = service.tax();
    expect(tax).toBeCloseTo(2.98, 2);
  });

  it('should calculate total correctly', () => {
    service.addItem(mockMenuItem1, 2); // 20
    service.addItem(mockMenuItem2, 3); // 15
    // Subtotal = 35
    // Tax = 2.98 (8.5%)
    // Total = 37.98

    const total = service.total();
    expect(total).toBeCloseTo(37.98, 2);
  });

  it('should calculate item count correctly', () => {
    service.addItem(mockMenuItem1, 2);
    service.addItem(mockMenuItem2, 3);

    expect(service.itemCount()).toBe(5); // 2 + 3
  });

  it('should clear cart', () => {
    service.addItem(mockMenuItem1, 2);
    service.addItem(mockMenuItem2, 3);

    expect(service.cartItems().length).toBe(2);

    service.clearCart();

    expect(service.cartItems()).toEqual([]);
    expect(service.subtotal()).toBe(0);
    expect(service.tax()).toBe(0);
    expect(service.total()).toBe(0);
    expect(service.itemCount()).toBe(0);
  });

  it('should return current cart state via getCart()', () => {
    service.addItem(mockMenuItem1, 2); // 20
    service.addItem(mockMenuItem2, 1); // 5

    const cart = service.getCart();

    expect(cart.items.length).toBe(2);
    expect(cart.subtotal).toBe(25.0);
    expect(cart.tax).toBeCloseTo(2.13, 2); // 25 * 0.085
    expect(cart.total).toBeCloseTo(27.13, 2);
  });

  it('should handle modifiers in price calculation', () => {
    // Item: $10, Modifier 1: +$1.50, Modifier 2: +$2.00, Quantity: 2
    // Subtotal: (10 + 1.5 + 2) * 2 = 27
    service.addItem(mockMenuItem1, 2, [mockModifier1, mockModifier2]);

    const items = service.cartItems();
    expect(items[0].subtotal).toBe(27.0);
    expect(service.subtotal()).toBe(27.0);
  });

  it('should update subtotal when quantity changes with modifiers', () => {
    service.addItem(mockMenuItem1, 1, [mockModifier1]); // (10 + 1.5) * 1 = 11.5

    expect(service.cartItems()[0].subtotal).toBe(11.5);

    service.updateQuantity(0, 3); // (10 + 1.5) * 3 = 34.5

    expect(service.cartItems()[0].subtotal).toBe(34.5);
    expect(service.subtotal()).toBe(34.5);
  });
});
