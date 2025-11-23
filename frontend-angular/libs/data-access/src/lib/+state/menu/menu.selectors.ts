import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MenuState, menuAdapter } from './menu.reducer';
import { MenuCategory } from '../../models';

export const selectMenuState = createFeatureSelector<MenuState>('menu');

const { selectAll, selectEntities } = menuAdapter.getSelectors();

export const selectAllMenuItems = createSelector(selectMenuState, selectAll);

export const selectMenuEntities = createSelector(
  selectMenuState,
  selectEntities
);

export const selectMenuLoading = createSelector(
  selectMenuState,
  (state) => state.loading
);

export const selectMenuLoaded = createSelector(
  selectMenuState,
  (state) => state.loaded
);

export const selectMenuError = createSelector(
  selectMenuState,
  (state) => state.error
);

export const selectMenuItemsByCategory = (category: MenuCategory) =>
  createSelector(selectAllMenuItems, (menuItems) =>
    menuItems.filter((item) => item.category === category)
  );

export const selectAvailableMenuItems = createSelector(
  selectAllMenuItems,
  (menuItems) => menuItems.filter((item) => item.available)
);

export const selectMenuItemById = (itemId: string) =>
  createSelector(selectMenuEntities, (entities) => entities[itemId]);
