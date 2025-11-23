import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as MenuActions from './menu.actions';
import { MenuItem } from '../../models';

export interface MenuState extends EntityState<MenuItem> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const menuAdapter: EntityAdapter<MenuItem> = createEntityAdapter<MenuItem>();

export const initialState: MenuState = menuAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
});

export const menuReducer = createReducer(
  initialState,
  on(MenuActions.loadMenuItems, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MenuActions.loadMenuItemsSuccess, (state, { menuItems }) =>
    menuAdapter.setAll(menuItems, {
      ...state,
      loaded: true,
      loading: false,
    })
  ),
  on(MenuActions.loadMenuItemsFailure, (state, { error }) => ({
    ...state,
    error,
    loaded: false,
    loading: false,
  })),
  on(MenuActions.loadMenuItemsByCategory, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MenuActions.loadMenuItemsByCategorySuccess, (state, { menuItems }) =>
    menuAdapter.setAll(menuItems, {
      ...state,
      loaded: true,
      loading: false,
    })
  ),
  on(MenuActions.updateMenuItemAvailability, (state) => ({
    ...state,
    loading: true,
  })),
  on(MenuActions.updateMenuItemAvailabilitySuccess, (state, { menuItem }) =>
    menuAdapter.updateOne(
      { id: menuItem.id, changes: menuItem },
      { ...state, loading: false }
    )
  ),
  on(MenuActions.searchMenuItems, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MenuActions.searchMenuItemsSuccess, (state, { menuItems }) =>
    menuAdapter.setAll(menuItems, {
      ...state,
      loaded: true,
      loading: false,
    })
  )
);
