import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartDisplayComponent } from './cart-display.component';
import { CartService } from '@resolute-pos/data-access';
import { signal } from '@angular/core';
import { MenuItem, MenuCategory } from '@resolute-pos/data-access';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CartDisplayComponent', () => {
  let component: CartDisplayComponent;
  let fixture: ComponentFixture<CartDisplayComponent>;
  let mockCartService: any;

  // Mock menu items for testing
  const mockMenuItem1: MenuItem = {
    id: '1',
    name: 'Burger',
    description: 'Delicious burger',
    category: MenuCategory.ENTREES,
    price: 12.99,
    available: true,
  };

  const mockMenuItem2: MenuItem = {
    id: '2',
    name: 'Fries',
    description: 'Crispy fries',
    category: MenuCategory.SIDES,
    price: 4.99,
    available: true,
  };

  beforeEach(async () => {
    // Create mock cart service with signals
    mockCartService = {
      cartItems: signal([]),
      subtotal: signal(0),
      tax: signal(0),
      total: signal(0),
      itemCount: signal(0),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CartDisplayComponent],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compileComponents();
  });

  // Helper to create component - call this after setting up mock data
  const createComponent = () => {
    fixture = TestBed.createComponent(CartDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create the component', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display empty state when cart has no items', () => {
    // Arrange - signals already set to empty in beforeEach
    createComponent();

    // Assert
    const emptyCart = fixture.debugElement.query(By.css('.empty-cart'));
    expect(emptyCart).toBeTruthy();
    expect(emptyCart.nativeElement.textContent).toContain('Cart is empty');
  });

  it('should display cart items from service', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 2,
        subtotal: 25.98,
      },
      {
        menuItem: mockMenuItem2,
        quantity: 1,
        subtotal: 4.99,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(3);
    mockCartService.subtotal.set(30.97);
    mockCartService.tax.set(2.63);
    mockCartService.total.set(33.6);

    createComponent();

    // Assert
    const listItems = fixture.debugElement.queryAll(By.css('mat-list-item'));
    expect(listItems.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Burger');
    expect(fixture.nativeElement.textContent).toContain('Fries');
  });

  it('should display item count in header', () => {
    // Arrange
    mockCartService.itemCount.set(5);
    mockCartService.cartItems.set([
      { menuItem: mockMenuItem1, quantity: 5, subtotal: 64.95 },
    ]);

    createComponent();

    // Assert
    const header = fixture.debugElement.query(By.css('.cart-header'));
    expect(header.nativeElement.textContent).toContain('Cart (5)');
  });

  it('should call updateQuantity when increase button is clicked', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 2,
        subtotal: 25.98,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(2);

    createComponent();

    // Act
    const increaseButton = fixture.debugElement.query(
      By.css('[data-testid="increase-quantity-0"]')
    );
    increaseButton.nativeElement.click();

    // Assert
    expect(mockCartService.updateQuantity).toHaveBeenCalledWith(0, 3);
  });

  it('should call updateQuantity when decrease button is clicked', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 3,
        subtotal: 38.97,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(3);

    createComponent();

    // Act
    const decreaseButton = fixture.debugElement.query(
      By.css('[data-testid="decrease-quantity-0"]')
    );
    decreaseButton.nativeElement.click();

    // Assert
    expect(mockCartService.updateQuantity).toHaveBeenCalledWith(0, 2);
  });

  it('should not decrease quantity below 1', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 1,
        subtotal: 12.99,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(1);

    createComponent();

    // Act
    const decreaseButton = fixture.debugElement.query(
      By.css('[data-testid="decrease-quantity-0"]')
    );
    decreaseButton.nativeElement.click();

    // Assert
    expect(mockCartService.updateQuantity).not.toHaveBeenCalled();
  });

  it('should call removeItem when remove button is clicked', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 2,
        subtotal: 25.98,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(2);

    createComponent();

    // Act
    const removeButton = fixture.debugElement.query(
      By.css('[data-testid="remove-item-0"]')
    );
    removeButton.nativeElement.click();

    // Assert
    expect(mockCartService.removeItem).toHaveBeenCalledWith(0);
  });

  it('should call clearCart with confirmation when clear button is clicked', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 2,
        subtotal: 25.98,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(2);

    createComponent();
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    // Act
    const clearButton = fixture.debugElement.query(
      By.css('[data-testid="clear-cart"]')
    );
    clearButton.nativeElement.click();

    // Assert
    expect(window.confirm).toHaveBeenCalled();
    expect(mockCartService.clearCart).toHaveBeenCalled();
  });

  it('should not clear cart if confirmation is cancelled', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 2,
        subtotal: 25.98,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(2);

    createComponent();
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    // Act
    const clearButton = fixture.debugElement.query(
      By.css('[data-testid="clear-cart"]')
    );
    clearButton.nativeElement.click();

    // Assert
    expect(window.confirm).toHaveBeenCalled();
    expect(mockCartService.clearCart).not.toHaveBeenCalled();
  });

  it('should emit checkoutClicked event when checkout button is clicked', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 2,
        subtotal: 25.98,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(2);

    createComponent();

    let emitted = false;
    component.checkoutClicked.subscribe(() => {
      emitted = true;
    });

    // Act
    const checkoutButton = fixture.debugElement.query(
      By.css('[data-testid="checkout-button"]')
    );
    checkoutButton.nativeElement.click();

    // Assert
    expect(emitted).toBe(true);
  });

  it('should display correct totals from service', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 2,
        subtotal: 25.98,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(2);
    mockCartService.subtotal.set(25.98);
    mockCartService.tax.set(2.21);
    mockCartService.total.set(28.19);

    createComponent();

    // Assert
    const footer = fixture.debugElement.query(By.css('.cart-footer'));
    expect(footer.nativeElement.textContent).toContain('25.98');
    expect(footer.nativeElement.textContent).toContain('2.21');
    expect(footer.nativeElement.textContent).toContain('28.19');
  });

  it('should display modifiers if present', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 1,
        modifiers: [
          { id: '1', name: 'Extra Cheese', priceAdjustment: 1.5 },
          { id: '2', name: 'Bacon', priceAdjustment: 2.0 },
        ],
        subtotal: 16.49,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(1);

    createComponent();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Extra Cheese');
    expect(fixture.nativeElement.textContent).toContain('Bacon');
  });

  it('should display special instructions if present', () => {
    // Arrange
    const cartItems = [
      {
        menuItem: mockMenuItem1,
        quantity: 1,
        specialInstructions: 'No pickles, please',
        subtotal: 12.99,
      },
    ];
    mockCartService.cartItems.set(cartItems);
    mockCartService.itemCount.set(1);

    createComponent();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('No pickles, please');
  });

  it('should not show clear button when cart is empty', () => {
    // Arrange - signals already empty in beforeEach
    createComponent();

    // Assert
    const clearButton = fixture.debugElement.query(
      By.css('[data-testid="clear-cart"]')
    );
    expect(clearButton).toBeFalsy();
  });
});
