import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosComponent } from './pos.component';
import { MenuBrowserComponent } from '../../components/menu-browser/menu-browser.component';
import { CartDisplayComponent } from '../../components/cart-display/cart-display.component';
import { CartService } from '@resolute-pos/data-access';
import { MenuItem, MenuCategory } from '@resolute-pos/data-access';
import { signal } from '@angular/core';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

describe('PosComponent', () => {
  let component: PosComponent;
  let fixture: ComponentFixture<PosComponent>;
  let cartService: jest.Mocked<CartService>;
  let mockCartService: Partial<CartService>;
  let store: MockStore;

  const mockMenuItem: MenuItem = {
    id: 1,
    name: 'Test Burger',
    description: 'Delicious test burger',
    price: 12.99,
    category: MenuCategory.MAIN_COURSE,
    available: true,
    imageUrl: '/assets/test-burger.jpg',
  };

  // NgRx Entity adapter requires this specific structure
  const initialState = {
    menu: {
      ids: [],
      entities: {},
      loaded: false,
      loading: false,
      error: null,
    },
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
      getCart: jest.fn(() => ({
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      })),
    };

    await TestBed.configureTestingModule({
      imports: [PosComponent, NoopAnimationsModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PosComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as jest.Mocked<CartService>;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the menu browser component', () => {
    const menuBrowser = fixture.debugElement.query(
      By.directive(MenuBrowserComponent)
    );
    expect(menuBrowser).toBeTruthy();
  });

  it('should display the cart display component', () => {
    const cartDisplay = fixture.debugElement.query(
      By.directive(CartDisplayComponent)
    );
    expect(cartDisplay).toBeTruthy();
  });

  it('should add item to cart when menu item is selected with default quantity of 1', () => {
    component.onMenuItemSelected(mockMenuItem);

    expect(cartService.addItem).toHaveBeenCalledWith(
      mockMenuItem,
      1,
      undefined,
      undefined
    );
  });

  it('should handle checkout when checkout is clicked', () => {
    // Spy on window.alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.onCheckout();

    expect(alertSpy).toHaveBeenCalledWith(
      'Checkout functionality coming soon!'
    );

    alertSpy.mockRestore();
  });

  it('should have proper CSS classes for responsive layout', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.pos-container');
    const content = compiled.querySelector('.pos-content');
    const menuSection = compiled.querySelector('.menu-section');
    const cartSection = compiled.querySelector('.cart-section');

    expect(container).toBeTruthy();
    expect(content).toBeTruthy();
    expect(menuSection).toBeTruthy();
    expect(cartSection).toBeTruthy();
  });

  it('should pass itemSelected event from menu browser to onMenuItemSelected handler', () => {
    const spy = jest.spyOn(component, 'onMenuItemSelected');
    const menuBrowser = fixture.debugElement.query(
      By.directive(MenuBrowserComponent)
    );

    menuBrowser.componentInstance.itemSelected.emit(mockMenuItem);

    expect(spy).toHaveBeenCalledWith(mockMenuItem);
  });

  it('should pass checkoutClicked event from cart display to onCheckout handler', () => {
    const spy = jest.spyOn(component, 'onCheckout');
    const cartDisplay = fixture.debugElement.query(
      By.directive(CartDisplayComponent)
    );

    cartDisplay.componentInstance.checkoutClicked.emit();

    expect(spy).toHaveBeenCalled();
  });
});
