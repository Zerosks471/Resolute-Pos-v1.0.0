import { createReducer, on } from '@ngrx/store';
import { AppActions, SyncStatus } from './app.actions';

export interface AppState {
  loading: boolean;
  error: string | null;
  online: boolean;
  syncStatus: SyncStatus;
  lastSyncTime: Date | null;
}

export const initialAppState: AppState = {
  loading: false,
  error: null,
  online: true,
  syncStatus: 'idle',
  lastSyncTime: null,
};

export const appReducer = createReducer(
  initialAppState,

  on(AppActions.setLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),

  on(AppActions.setError, (state, { error }) => ({
    ...state,
    error,
  })),

  on(AppActions.setOnline, (state, { online }) => ({
    ...state,
    online,
  })),

  on(AppActions.setSyncStatus, (state, { syncStatus, lastSyncTime }) => ({
    ...state,
    syncStatus,
    lastSyncTime: lastSyncTime ?? state.lastSyncTime,
  }))
);
