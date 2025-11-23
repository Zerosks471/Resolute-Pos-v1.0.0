import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuBrowserComponent } from './menu-browser.component';
import {
  selectAllMenuItems,
  selectMenuLoading,
  selectMenuError,
  loadMenuItems,
  MenuItem,
  MenuCategory,
} from '@resolute-pos/data-access';
import { By } from '@angular/platform-browser';

describe('MenuBrowserComponent', () => {
  let component: MenuBrowserComponent;
  let fixture: ComponentFixture<MenuBrowserComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing',
      category: MenuCategory.APPETIZERS,
      price: 8.99,
      available: true,
      imageUrl: '/assets/salad.jpg',
    },
    {
      id: '2',
      name: 'Grilled Salmon',
      description: 'Atlantic salmon with lemon butter',
      category: MenuCategory.ENTREES,
      price: 24.99,
      available: true,
      imageUrl: '/assets/salmon.jpg',
    },
    {
      id: '3',
      name: 'Chocolate Cake',
      description: 'Rich chocolate layer cake',
      category: MenuCategory.DESSERTS,
      price: 6.99,
      available: false,
      imageUrl: '/assets/cake.jpg',
    },
    {
      id: '4',
      name: 'French Fries',
      description: 'Crispy golden fries',
      category: MenuCategory.SIDES,
      price: 4.99,
      available: true,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuBrowserComponent, MatCardModule, MatProgressSpinnerModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllMenuItems, value: [] },
            { selector: selectMenuLoading, value: false },
            { selector: selectMenuError, value: null },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(MenuBrowserComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadMenuItems action on init', () => {
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(loadMenuItems());
  });

  it('should display menu items from store', () => {
    store.overrideSelector(selectAllMenuItems, mockMenuItems);
    store.overrideSelector(selectMenuLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.menu-item-card'));
    expect(cards.length).toBe(4);

    const firstCard = cards[0].nativeElement;
    expect(firstCard.textContent).toContain('Caesar Salad');
    expect(firstCard.textContent).toContain('Fresh romaine lettuce');
    expect(firstCard.textContent).toContain('8.99');
  });

  it('should show loading spinner when loading is true', () => {
    store.overrideSelector(selectMenuLoading, true);
    store.overrideSelector(selectAllMenuItems, []);
    store.refreshState();
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();

    const menuGrid = fixture.debugElement.query(By.css('.menu-grid'));
    expect(menuGrid).toBeFalsy();
  });

  it('should show error message when error exists', () => {
    const errorMessage = 'Failed to load menu items';
    store.overrideSelector(selectMenuError, errorMessage);
    store.overrideSelector(selectMenuLoading, false);
    store.overrideSelector(selectAllMenuItems, []);
    store.refreshState();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain(errorMessage);
  });

  it('should emit itemSelected when a menu item is clicked', () => {
    store.overrideSelector(selectAllMenuItems, mockMenuItems);
    store.overrideSelector(selectMenuLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.itemSelected, 'emit');

    const firstCard = fixture.debugElement.query(By.css('.menu-item-card'));
    firstCard.nativeElement.click();

    expect(emitSpy).toHaveBeenCalledWith(mockMenuItems[0]);
  });

  it('should filter items by category when selectedCategory input is provided', () => {
    component.selectedCategory = MenuCategory.ENTREES;
    store.overrideSelector(selectAllMenuItems, mockMenuItems);
    store.overrideSelector(selectMenuLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.menu-item-card'));
    expect(cards.length).toBe(1);
    expect(cards[0].nativeElement.textContent).toContain('Grilled Salmon');
  });

  it('should filter items by search term when searchTerm input is provided', () => {
    component.searchTerm = 'salad';
    store.overrideSelector(selectAllMenuItems, mockMenuItems);
    store.overrideSelector(selectMenuLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.menu-item-card'));
    expect(cards.length).toBe(1);
    expect(cards[0].nativeElement.textContent).toContain('Caesar Salad');
  });

  it('should filter items by both category and search term when both are provided', () => {
    component.selectedCategory = MenuCategory.ENTREES;
    component.searchTerm = 'salmon';
    store.overrideSelector(selectAllMenuItems, mockMenuItems);
    store.overrideSelector(selectMenuLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.menu-item-card'));
    expect(cards.length).toBe(1);
    expect(cards[0].nativeElement.textContent).toContain('Grilled Salmon');
  });

  it('should mark unavailable items with unavailable class', () => {
    store.overrideSelector(selectAllMenuItems, mockMenuItems);
    store.overrideSelector(selectMenuLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.menu-item-card'));
    const unavailableCard = cards.find(
      (card) =>
        card.nativeElement.textContent.includes('Chocolate Cake')
    );

    expect(unavailableCard?.nativeElement.classList.contains('unavailable')).toBe(true);
  });

  it('should display placeholder image when imageUrl is not provided', () => {
    store.overrideSelector(selectAllMenuItems, mockMenuItems);
    store.overrideSelector(selectMenuLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.menu-item-card'));
    const friesCard = cards.find(
      (card) => card.nativeElement.textContent.includes('French Fries')
    );

    const img = friesCard?.query(By.css('img'));
    expect(img?.nativeElement.src).toContain('/assets/placeholder.jpg');
  });

  it('should return correct value from isItemAvailable method', () => {
    const availableItem = mockMenuItems[0];
    const unavailableItem = mockMenuItems[2];

    expect(component.isItemAvailable(availableItem)).toBe(true);
    expect(component.isItemAvailable(unavailableItem)).toBe(false);
  });

  it('should handle empty menu items gracefully', () => {
    store.overrideSelector(selectAllMenuItems, []);
    store.overrideSelector(selectMenuLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.menu-item-card'));
    expect(cards.length).toBe(0);

    const menuGrid = fixture.debugElement.query(By.css('.menu-grid'));
    expect(menuGrid).toBeTruthy(); // Grid should still render
  });

  it('should not emit itemSelected for unavailable items when clicked', () => {
    store.overrideSelector(selectAllMenuItems, mockMenuItems);
    store.overrideSelector(selectMenuLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.itemSelected, 'emit');

    const cards = fixture.debugElement.queryAll(By.css('.menu-item-card'));
    const unavailableCard = cards.find(
      (card) => card.nativeElement.textContent.includes('Chocolate Cake')
    );

    unavailableCard?.nativeElement.click();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
