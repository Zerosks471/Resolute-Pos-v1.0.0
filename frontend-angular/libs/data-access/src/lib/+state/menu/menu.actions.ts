import { createAction, props } from '@ngrx/store';
import { MenuItem, MenuCategory } from '../../models';

export const loadMenuItems = createAction('[Menu] Load Menu Items');

export const loadMenuItemsSuccess = createAction(
  '[Menu] Load Menu Items Success',
  props<{ menuItems: MenuItem[] }>()
);

export const loadMenuItemsFailure = createAction(
  '[Menu] Load Menu Items Failure',
  props<{ error: string }>()
);

export const loadMenuItemsByCategory = createAction(
  '[Menu] Load Menu Items By Category',
  props<{ category: MenuCategory }>()
);

export const loadMenuItemsByCategorySuccess = createAction(
  '[Menu] Load Menu Items By Category Success',
  props<{ menuItems: MenuItem[] }>()
);

export const updateMenuItemAvailability = createAction(
  '[Menu] Update Menu Item Availability',
  props<{ itemId: string; available: boolean }>()
);

export const updateMenuItemAvailabilitySuccess = createAction(
  '[Menu] Update Menu Item Availability Success',
  props<{ menuItem: MenuItem }>()
);

export const searchMenuItems = createAction(
  '[Menu] Search Menu Items',
  props<{ searchTerm: string }>()
);

export const searchMenuItemsSuccess = createAction(
  '[Menu] Search Menu Items Success',
  props<{ menuItems: MenuItem[] }>()
);
