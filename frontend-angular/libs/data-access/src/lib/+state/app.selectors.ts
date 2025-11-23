import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.reducer';

export const APP_FEATURE_KEY = 'app';

// Feature selector
export const selectAppState = createFeatureSelector<AppState>(APP_FEATURE_KEY);

// Selectors for individual state properties
export const selectLoading = createSelector(
  selectAppState,
  (state: AppState) => state.loading
);

export const selectError = createSelector(
  selectAppState,
  (state: AppState) => state.error
);

export const selectOnline = createSelector(
  selectAppState,
  (state: AppState) => state.online
);

export const selectSyncStatus = createSelector(
  selectAppState,
  (state: AppState) => state.syncStatus
);

export const selectLastSyncTime = createSelector(
  selectAppState,
  (state: AppState) => state.lastSyncTime
);

// Computed selectors
export const selectIsOffline = createSelector(
  selectOnline,
  (online) => !online
);

export const selectIsSyncing = createSelector(
  selectSyncStatus,
  (status) => status === 'syncing'
);

export const selectHasError = createSelector(
  selectError,
  (error) => error !== null
);

export const selectAppReady = createSelector(
  selectLoading,
  selectError,
  (loading, error) => !loading && !error
);

export const selectSyncInfo = createSelector(
  selectSyncStatus,
  selectLastSyncTime,
  selectOnline,
  (syncStatus, lastSyncTime, online) => ({
    status: syncStatus,
    lastSyncTime,
    online,
  })
);
