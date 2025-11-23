import { menuReducer, initialState } from './menu.reducer';
import * as MenuActions from './menu.actions';
import { MenuItem, MenuCategory } from '../../models';

describe('Menu Reducer', () => {
  const mockMenuItem1: MenuItem = {
    id: '1',
    name: 'Burger',
    description: 'Classic beef burger',
    category: MenuCategory.ENTREES,
    price: 12.99,
    available: true,
    imageUrl: '/images/burger.jpg',
    prepTime: 15,
    allergens: ['gluten', 'dairy'],
    modifiers: [
      { id: 'm1', name: 'Extra Cheese', priceAdjustment: 1.5 },
      { id: 'm2', name: 'Bacon', priceAdjustment: 2.0 },
    ],
  };

  const mockMenuItem2: MenuItem = {
    id: '2',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce',
    category: MenuCategory.APPETIZERS,
    price: 8.99,
    available: true,
    prepTime: 10,
  };

  const mockMenuItem3: MenuItem = {
    id: '3',
    name: 'Chocolate Cake',
    description: 'Rich chocolate dessert',
    category: MenuCategory.DESSERTS,
    price: 6.99,
    available: false,
  };

  it('should return initial state', () => {
    const action = { type: 'Unknown' };
    const result = menuReducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it('should set loading to true on loadMenuItems', () => {
    const action = MenuActions.loadMenuItems();
    const result = menuReducer(initialState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should load menu items successfully', () => {
    const menuItems: MenuItem[] = [mockMenuItem1, mockMenuItem2];
    const action = MenuActions.loadMenuItemsSuccess({ menuItems });
    const result = menuReducer(initialState, action);

    expect(result.ids.length).toBe(2);
    expect(result.entities['1']).toEqual(mockMenuItem1);
    expect(result.entities['2']).toEqual(mockMenuItem2);
    expect(result.loaded).toBe(true);
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('should handle load menu items failure', () => {
    const error = 'Failed to load menu items';
    const action = MenuActions.loadMenuItemsFailure({ error });
    const result = menuReducer(initialState, action);

    expect(result.loaded).toBe(false);
    expect(result.loading).toBe(false);
    expect(result.error).toBe(error);
  });

  it('should set loading to true on loadMenuItemsByCategory', () => {
    const action = MenuActions.loadMenuItemsByCategory({
      category: MenuCategory.ENTREES,
    });
    const result = menuReducer(initialState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should load menu items by category successfully', () => {
    const menuItems: MenuItem[] = [mockMenuItem1];
    const action = MenuActions.loadMenuItemsByCategorySuccess({ menuItems });
    const result = menuReducer(initialState, action);

    expect(result.ids.length).toBe(1);
    expect(result.entities['1']).toEqual(mockMenuItem1);
    expect(result.loaded).toBe(true);
    expect(result.loading).toBe(false);
  });

  it('should set loading to true on updateMenuItemAvailability', () => {
    const action = MenuActions.updateMenuItemAvailability({
      itemId: '1',
      available: false,
    });
    const result = menuReducer(initialState, action);

    expect(result.loading).toBe(true);
  });

  it('should update menu item availability successfully', () => {
    // First add the item to state
    const stateWithItem = menuReducer(
      initialState,
      MenuActions.loadMenuItemsSuccess({ menuItems: [mockMenuItem1] })
    );

    const updatedItem: MenuItem = {
      ...mockMenuItem1,
      available: false,
    };

    const action = MenuActions.updateMenuItemAvailabilitySuccess({
      menuItem: updatedItem,
    });
    const result = menuReducer(stateWithItem, action);

    expect(result.entities['1']?.available).toBe(false);
    expect(result.loading).toBe(false);
  });

  it('should set loading to true on searchMenuItems', () => {
    const action = MenuActions.searchMenuItems({ searchTerm: 'burger' });
    const result = menuReducer(initialState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle search menu items success', () => {
    const menuItems: MenuItem[] = [mockMenuItem1];
    const action = MenuActions.searchMenuItemsSuccess({ menuItems });
    const result = menuReducer(initialState, action);

    expect(result.ids.length).toBe(1);
    expect(result.entities['1']).toEqual(mockMenuItem1);
    expect(result.loaded).toBe(true);
    expect(result.loading).toBe(false);
  });

  it('should replace existing items when loading new items', () => {
    // First load some items
    const stateWithItems = menuReducer(
      initialState,
      MenuActions.loadMenuItemsSuccess({
        menuItems: [mockMenuItem1, mockMenuItem2],
      })
    );

    expect(stateWithItems.ids.length).toBe(2);

    // Load new items (should replace, not add)
    const newItems: MenuItem[] = [mockMenuItem3];
    const action = MenuActions.loadMenuItemsSuccess({ menuItems: newItems });
    const result = menuReducer(stateWithItems, action);

    expect(result.ids.length).toBe(1);
    expect(result.entities['3']).toEqual(mockMenuItem3);
    expect(result.entities['1']).toBeUndefined();
  });

  it('should maintain state structure when updating availability', () => {
    const stateWithItems = menuReducer(
      initialState,
      MenuActions.loadMenuItemsSuccess({
        menuItems: [mockMenuItem1, mockMenuItem2, mockMenuItem3],
      })
    );

    const updatedItem: MenuItem = {
      ...mockMenuItem1,
      available: false,
    };

    const action = MenuActions.updateMenuItemAvailabilitySuccess({
      menuItem: updatedItem,
    });
    const result = menuReducer(stateWithItems, action);

    // Should only update the specific item
    expect(result.entities['1']?.available).toBe(false);
    expect(result.entities['2']?.available).toBe(true);
    expect(result.entities['3']?.available).toBe(false);
    expect(result.ids.length).toBe(3);
  });
});
