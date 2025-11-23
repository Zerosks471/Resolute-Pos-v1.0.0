import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { MenuEffects } from './menu.effects';
import * as MenuActions from './menu.actions';
import { MenuApiService } from '../../services/menu-api.service';
import { MenuCategory } from '../../models/menu-item.model';

describe('MenuEffects', () => {
  let actions$: Observable<any>;
  let effects: MenuEffects;
  let menuApiService: jest.Mocked<MenuApiService>;

  beforeEach(() => {
    const apiServiceMock = {
      getMenuItems: jest.fn(),
      getMenuItemsByCategory: jest.fn(),
      updateMenuItemAvailability: jest.fn(),
      searchMenuItems: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        MenuEffects,
        provideMockActions(() => actions$),
        { provide: MenuApiService, useValue: apiServiceMock },
      ],
    });

    effects = TestBed.inject(MenuEffects);
    menuApiService = TestBed.inject(
      MenuApiService
    ) as jest.Mocked<MenuApiService>;
  });

  describe('loadMenuItems$', () => {
    it('should load menu items successfully', (done) => {
      const menuItems = [
        {
          id: '1',
          name: 'Burger',
          description: 'Delicious burger',
          category: MenuCategory.ENTREES,
          price: 12.99,
          available: true,
        },
      ] as any;
      menuApiService.getMenuItems.mockReturnValue(
        of({ success: true, data: menuItems })
      );

      actions$ = of(MenuActions.loadMenuItems());

      effects.loadMenuItems$.subscribe((action: any) => {
        expect(action).toEqual(
          MenuActions.loadMenuItemsSuccess({ menuItems })
        );
        done();
      });
    });

    it('should handle load menu items failure', (done) => {
      const error = new Error('Network error');
      menuApiService.getMenuItems.mockReturnValue(throwError(() => error));

      actions$ = of(MenuActions.loadMenuItems());

      effects.loadMenuItems$.subscribe((action: any) => {
        expect(action).toEqual(
          MenuActions.loadMenuItemsFailure({ error: 'Network error' })
        );
        done();
      });
    });
  });

  describe('loadMenuItemsByCategory$', () => {
    it('should load menu items by category successfully', (done) => {
      const category = MenuCategory.ENTREES;
      const menuItems = [
        {
          id: '1',
          name: 'Burger',
          description: 'Delicious burger',
          category: MenuCategory.ENTREES,
          price: 12.99,
          available: true,
        },
      ] as any;
      menuApiService.getMenuItemsByCategory.mockReturnValue(
        of({ success: true, data: menuItems })
      );

      actions$ = of(MenuActions.loadMenuItemsByCategory({ category }));

      effects.loadMenuItemsByCategory$.subscribe((action: any) => {
        expect(action).toEqual(
          MenuActions.loadMenuItemsByCategorySuccess({ menuItems })
        );
        done();
      });
    });

    it('should handle load menu items by category failure', (done) => {
      const category = MenuCategory.ENTREES;
      const error = new Error('Failed to load category');
      menuApiService.getMenuItemsByCategory.mockReturnValue(
        throwError(() => error)
      );

      actions$ = of(MenuActions.loadMenuItemsByCategory({ category }));

      effects.loadMenuItemsByCategory$.subscribe((action: any) => {
        expect(action).toEqual(
          MenuActions.loadMenuItemsFailure({ error: 'Failed to load category' })
        );
        done();
      });
    });
  });

  describe('updateMenuItemAvailability$', () => {
    it('should update menu item availability successfully', (done) => {
      const itemId = '1';
      const available = false;
      const updatedMenuItem = {
        id: '1',
        name: 'Burger',
        description: 'Delicious burger',
        category: MenuCategory.ENTREES,
        price: 12.99,
        available: false,
      } as any;
      menuApiService.updateMenuItemAvailability.mockReturnValue(
        of({ success: true, data: updatedMenuItem })
      );

      actions$ = of(
        MenuActions.updateMenuItemAvailability({ itemId, available })
      );

      effects.updateMenuItemAvailability$.subscribe((action: any) => {
        expect(action).toEqual(
          MenuActions.updateMenuItemAvailabilitySuccess({
            menuItem: updatedMenuItem,
          })
        );
        done();
      });
    });

    it('should handle update menu item availability failure', (done) => {
      const itemId = '1';
      const available = false;
      const error = new Error('Failed to update availability');
      menuApiService.updateMenuItemAvailability.mockReturnValue(
        throwError(() => error)
      );

      actions$ = of(
        MenuActions.updateMenuItemAvailability({ itemId, available })
      );

      effects.updateMenuItemAvailability$.subscribe((action: any) => {
        expect(action).toEqual(
          MenuActions.loadMenuItemsFailure({
            error: 'Failed to update availability',
          })
        );
        done();
      });
    });
  });

  describe('searchMenuItems$', () => {
    it('should search menu items successfully', (done) => {
      const searchTerm = 'burger';
      const menuItems = [
        {
          id: '1',
          name: 'Burger',
          description: 'Delicious burger',
          category: MenuCategory.ENTREES,
          price: 12.99,
          available: true,
        },
      ] as any;
      menuApiService.searchMenuItems.mockReturnValue(
        of({ success: true, data: menuItems })
      );

      actions$ = of(MenuActions.searchMenuItems({ searchTerm }));

      effects.searchMenuItems$.subscribe((action: any) => {
        expect(action).toEqual(
          MenuActions.searchMenuItemsSuccess({ menuItems })
        );
        done();
      });
    });

    it('should handle search menu items failure', (done) => {
      const searchTerm = 'burger';
      const error = new Error('Search failed');
      menuApiService.searchMenuItems.mockReturnValue(throwError(() => error));

      actions$ = of(MenuActions.searchMenuItems({ searchTerm }));

      effects.searchMenuItems$.subscribe((action: any) => {
        expect(action).toEqual(
          MenuActions.loadMenuItemsFailure({ error: 'Search failed' })
        );
        done();
      });
    });
  });
});
