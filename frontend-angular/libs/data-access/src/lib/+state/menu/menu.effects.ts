import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as MenuActions from './menu.actions';
import { MenuApiService } from '../../services/menu-api.service';

@Injectable()
export class MenuEffects {
  private actions$ = inject(Actions);
  private menuApi = inject(MenuApiService);

  loadMenuItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MenuActions.loadMenuItems),
      switchMap(() =>
        this.menuApi.getMenuItems().pipe(
          map((response) =>
            MenuActions.loadMenuItemsSuccess({ menuItems: response.data || [] })
          ),
          catchError((error) =>
            of(MenuActions.loadMenuItemsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadMenuItemsByCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MenuActions.loadMenuItemsByCategory),
      switchMap(({ category }) =>
        this.menuApi.getMenuItemsByCategory(category).pipe(
          map((response) =>
            MenuActions.loadMenuItemsByCategorySuccess({
              menuItems: response.data || [],
            })
          ),
          catchError((error) =>
            of(MenuActions.loadMenuItemsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateMenuItemAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MenuActions.updateMenuItemAvailability),
      switchMap(({ itemId, available }) =>
        this.menuApi.updateMenuItemAvailability(itemId, available).pipe(
          map((response) =>
            MenuActions.updateMenuItemAvailabilitySuccess({
              menuItem: response.data!,
            })
          ),
          catchError((error) =>
            of(MenuActions.loadMenuItemsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  searchMenuItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MenuActions.searchMenuItems),
      switchMap(({ searchTerm }) =>
        this.menuApi.searchMenuItems(searchTerm).pipe(
          map((response) =>
            MenuActions.searchMenuItemsSuccess({ menuItems: response.data || [] })
          ),
          catchError((error) =>
            of(MenuActions.loadMenuItemsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
